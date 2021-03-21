use super::list::ListFormat;
use std::{rc::Rc, sync::Arc};
use swc_common::{
    errors::SourceMapper, BytePos, SourceMap, SourceMapperDyn, Span, Spanned, SyntaxContext,
};
use swc_ecma_ast::*;

pub trait SpanExt: Spanned {
    fn is_synthesized(&self) -> bool {
        self.span().ctxt() != SyntaxContext::empty()
    }

    fn starts_on_new_line(&self, format: ListFormat) -> bool {
        format.intersects(ListFormat::PreferNewLine)
    }

    /// Gets a custom text range to use when emitting comments.
    fn comment_range(&self) -> Span {
        //TODO
        self.span()
    }
}
impl<T: Spanned> SpanExt for T {}

pub trait SourceMapperExt {
    fn get_code_map(&self) -> &dyn SourceMapper;

    fn is_on_same_line(&self, lo: BytePos, hi: BytePos) -> bool {
        // let cm = self.get_code_map();

        // let lo = cm.lookup_char_pos(lo);
        // let hi = cm.lookup_char_pos(hi);

        // lo.line == hi.line && lo.file.name_hash == hi.file.name_hash
        false
    }

    fn should_write_separating_line_terminator<P: Spanned, N: Spanned>(
        &self,
        prev: Option<P>,
        next: Option<N>,
        format: ListFormat,
    ) -> bool {
        let prev = prev.map(|s| s.span());
        let next = next.map(|s| s.span());

        if format.contains(ListFormat::MultiLine) {
            return true;
        }

        if format.contains(ListFormat::PreserveLines) {
            if let (Some(prev), Some(next)) = (prev, next) {
                if prev.is_synthesized() || next.is_synthesized() {
                    return prev.starts_on_new_line(format) || next.starts_on_new_line(format);
                }

                return !self.is_on_same_line(prev.hi(), next.lo());
            } else {
                return false;
            }
        }

        false
    }

    fn should_write_leading_line_terminator<N: Spanned>(
        &self,
        parent_node: Span,
        children: &[N],
        format: ListFormat,
    ) -> bool {
        if format.contains(ListFormat::MultiLine) {
            return true;
        }

        if format.contains(ListFormat::PreserveLines) {
            if format.contains(ListFormat::PreferNewLine) {
                return true;
            }

            if children.is_empty() {
                return !self.is_on_same_line(parent_node.lo(), parent_node.hi());
            }

            let first_child = children[0].span();
            if parent_node.is_synthesized() || first_child.is_synthesized() {
                return first_child.starts_on_new_line(format);
            }

            !self.is_on_same_line(parent_node.lo(), first_child.lo())
        } else {
            false
        }
    }

    fn should_write_closing_line_terminator<N: Spanned>(
        &self,
        parent_node: Span,
        children: &[N],
        format: ListFormat,
    ) -> bool {
        if format.contains(ListFormat::MultiLine) {
            return (format & ListFormat::NoTrailingNewLine) == ListFormat::None;
        }

        if format.contains(ListFormat::PreserveLines) {
            if format.contains(ListFormat::PreferNewLine) {
                return true;
            }

            if children.is_empty() {
                return !self.is_on_same_line(parent_node.lo(), parent_node.hi());
            }

            let last_child = children[children.len() - 1].span();
            if parent_node.is_synthesized() || last_child.is_synthesized() {
                last_child.starts_on_new_line(format)
            } else {
                !self.is_on_same_line(parent_node.hi(), last_child.hi())
            }
        } else {
            false
        }
    }
}
impl SourceMapperExt for dyn SourceMapper {
    fn get_code_map(&self) -> &dyn SourceMapper {
        self
    }
}
impl SourceMapperExt for Arc<SourceMapperDyn> {
    fn get_code_map(&self) -> &dyn SourceMapper {
        &**self
    }
}
impl SourceMapperExt for Rc<SourceMapperDyn> {
    fn get_code_map(&self) -> &dyn SourceMapper {
        &**self
    }
}

impl SourceMapperExt for Arc<SourceMap> {
    fn get_code_map(&self) -> &dyn SourceMapper {
        &**self
    }
}

impl SourceMapperExt for Rc<SourceMap> {
    fn get_code_map(&self) -> &dyn SourceMapper {
        &**self
    }
}

/// Leftmost recursion
pub trait StartsWithAlphaNum {
    fn starts_with_alpha_num(&self) -> bool;
}

impl StartsWithAlphaNum for Expr {
    fn starts_with_alpha_num(&self) -> bool {
        match *self {
            Expr::Ident(_)
            | Expr::Lit(Lit::Bool(_))
            | Expr::Lit(Lit::Num(_))
            | Expr::Lit(Lit::Null(_))
            | Expr::Await(_)
            | Expr::Fn(_)
            | Expr::Class(_)
            | Expr::This(_)
            | Expr::Yield(_)
            | Expr::New(_)
            | Expr::MetaProp(_) => true,

            Expr::PrivateName(_) => false,

            // Handle other literals.
            Expr::Lit(_) => false,

            Expr::Seq(SeqExpr { ref exprs, .. }) => exprs
                .first()
                .map(|e| e.starts_with_alpha_num())
                .unwrap_or(false),

            //
            Expr::Assign(AssignExpr { ref left, .. }) => left.starts_with_alpha_num(),

            Expr::Bin(BinExpr { ref left, .. }) | Expr::Cond(CondExpr { test: ref left, .. }) => {
                left.starts_with_alpha_num()
            }
            Expr::Call(CallExpr {
                callee: ref left, ..
            })
            | Expr::Member(MemberExpr { obj: ref left, .. }) => left.starts_with_alpha_num(),

            Expr::Unary(UnaryExpr { op, .. }) => match op {
                op!("void") | op!("delete") | op!("typeof") => true,
                _ => false,
            },

            Expr::Arrow(ref expr) => match expr.params.as_slice() {
                [p] => p.starts_with_alpha_num(),
                _ => false,
            },

            Expr::Update(ref expr) => {
                if expr.prefix {
                    false
                } else {
                    expr.arg.starts_with_alpha_num()
                }
            }

            Expr::Tpl(_) | Expr::Array(_) | Expr::Object(_) | Expr::Paren(_) => false,

            Expr::TaggedTpl(TaggedTpl { ref tag, .. }) => tag.starts_with_alpha_num(),

            // it's empty
            Expr::JSXEmpty(..) => false,
            // start with `<`
            Expr::JSXFragment(..) | Expr::JSXElement(..) => false,
            Expr::JSXNamespacedName(..) => true,
            Expr::JSXMember(..) => true,

            Expr::TsTypeAssertion(..) => false,
            Expr::TsNonNull(TsNonNullExpr { ref expr, .. })
            | Expr::TsAs(TsAsExpr { ref expr, .. })
            | Expr::TsConstAssertion(TsConstAssertion { ref expr, .. }) => {
                expr.starts_with_alpha_num()
            }

            Expr::OptChain(ref e) => e.expr.starts_with_alpha_num(),

            Expr::Invalid(..) => true,
        }
    }
}

impl StartsWithAlphaNum for Pat {
    fn starts_with_alpha_num(&self) -> bool {
        match *self {
            Pat::Ident(..) => true,
            Pat::Assign(AssignPat { ref left, .. }) => left.starts_with_alpha_num(),
            Pat::Object(..) | Pat::Array(..) | Pat::Rest(..) => false,
            Pat::Expr(ref expr) => expr.starts_with_alpha_num(),
            Pat::Invalid(..) => true,
        }
    }
}

impl StartsWithAlphaNum for PatOrExpr {
    fn starts_with_alpha_num(&self) -> bool {
        match *self {
            PatOrExpr::Pat(ref p) => p.starts_with_alpha_num(),
            PatOrExpr::Expr(ref e) => e.starts_with_alpha_num(),
        }
    }
}

impl StartsWithAlphaNum for ExprOrSpread {
    fn starts_with_alpha_num(&self) -> bool {
        match *self {
            ExprOrSpread {
                spread: Some(_), ..
            } => false,
            ExprOrSpread {
                spread: None,
                ref expr,
            } => expr.starts_with_alpha_num(),
        }
    }
}
impl StartsWithAlphaNum for ExprOrSuper {
    fn starts_with_alpha_num(&self) -> bool {
        match *self {
            ExprOrSuper::Super(_) => true,
            ExprOrSuper::Expr(ref e) => e.starts_with_alpha_num(),
        }
    }
}
impl StartsWithAlphaNum for Stmt {
    fn starts_with_alpha_num(&self) -> bool {
        match *self {
            Stmt::Expr(ref expr) => expr.expr.starts_with_alpha_num(),
            Stmt::Decl(ref decl) => decl.starts_with_alpha_num(),
            Stmt::Debugger(..)
            | Stmt::With(..)
            | Stmt::While(..)
            | Stmt::DoWhile(..)
            | Stmt::Return(..)
            | Stmt::Labeled(..)
            | Stmt::Break(..)
            | Stmt::Continue(..)
            | Stmt::Switch(..)
            | Stmt::Throw(..)
            | Stmt::Try(..)
            | Stmt::For(..)
            | Stmt::ForIn(..)
            | Stmt::ForOf(..)
            | Stmt::If(..) => true,
            Stmt::Block(..) | Stmt::Empty(..) => false,
        }
    }
}

impl StartsWithAlphaNum for Decl {
    fn starts_with_alpha_num(&self) -> bool {
        match *self {
            Decl::Class(..)
            | Decl::Fn(..)
            | Decl::Var(..)
            | Decl::TsEnum(..)
            | Decl::TsInterface(..)
            | Decl::TsModule(..)
            | Decl::TsTypeAlias(..) => true,
        }
    }
}
