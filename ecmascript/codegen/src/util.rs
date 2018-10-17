use super::{list::ListFormat, Emitter, Result};
use std::rc::Rc;
use swc_common::{errors::SourceMapper, BytePos, SourceMapperDyn, Span, Spanned, SyntaxContext};
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

impl<'a> Emitter<'a> {
    pub(crate) fn punct(&mut self, span: Span, t: &'static str) -> Result {
        if t == ";" {
            self.wr.write_semi()?;
        } else {
            self.wr.write_punct(t)?;
        };

        Ok(())
    }
}

pub trait SourceMapperExt {
    fn get_code_map(&self) -> &SourceMapper;

    fn is_on_same_line(&self, lo: BytePos, hi: BytePos) -> bool {
        let cm = self.get_code_map();

        let lo = cm.lookup_char_pos(lo);
        let hi = cm.lookup_char_pos(hi);

        lo.line == hi.line && lo.file.name_hash == hi.file.name_hash
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

            return !self.is_on_same_line(parent_node.lo(), first_child.lo());
        } else {
            return false;
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
                return last_child.starts_on_new_line(format);
            } else {
                return !self.is_on_same_line(parent_node.hi(), last_child.hi());
            }
        } else {
            return false;
        }
    }
}
impl SourceMapperExt for SourceMapper {
    fn get_code_map(&self) -> &SourceMapper {
        self
    }
}
impl SourceMapperExt for Rc<SourceMapperDyn> {
    fn get_code_map(&self) -> &SourceMapper {
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

            // Handle other literals.
            Expr::Lit(_) => false,

            Expr::Seq(SeqExpr { ref exprs, .. }) => exprs
                .first()
                .map(|e| e.starts_with_alpha_num())
                .unwrap_or(false),

            //
            Expr::Assign(AssignExpr { ref left, .. }) => left.starts_with_alpha_num(),

            Expr::Bin(BinExpr { ref left, .. }) | Expr::Cond(CondExpr { test: ref left, .. }) => {
                return left.starts_with_alpha_num();
            }
            Expr::Call(CallExpr {
                callee: ref left, ..
            })
            | Expr::Member(MemberExpr { obj: ref left, .. }) => left.starts_with_alpha_num(),

            Expr::Unary(UnaryExpr { op, .. }) => match op {
                op!("void") | op!("delete") | op!("typeof") => true,
                _ => false,
            },

            // TODO: Support `v => {}`
            Expr::Arrow(ArrowExpr { .. }) => false,

            Expr::Tpl(_) | Expr::Update(_) | Expr::Array(_) | Expr::Object(_) | Expr::Paren(_) => {
                false
            }
        }
    }
}

impl StartsWithAlphaNum for Pat {
    fn starts_with_alpha_num(&self) -> bool {
        unimplemented!()
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
            ExprOrSuper::Expr(ref e) => return e.starts_with_alpha_num(),
        }
    }
}
