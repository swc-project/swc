use swc_es_ast::{
    AssignOp, BinaryOp, Expr, ExprId, Lit, MemberProp, MetaPropKind, UnaryOp, UpdateOp,
};

use super::Emitter;
use crate::{
    precedence::{binary_precedence, is_right_associative_binary, Precedence},
    Result,
};

impl<W> Emitter<'_, W>
where
    W: crate::WriteJs,
{
    #[inline]
    pub(crate) fn emit_expr(&mut self, expr: ExprId) -> Result {
        self.emit_expr_with_parens_if_needed(expr, Precedence::Lowest)
    }

    pub(super) fn emit_expr_inner(&mut self, expr: ExprId) -> Result {
        match self.expr(expr).clone() {
            Expr::Ident(ident) => self.emit_ident(&ident),
            Expr::Lit(lit) => self.emit_lit(&lit),
            Expr::Function(function) => self.emit_function_expr(function),
            Expr::Class(class) => self.emit_class_expr(class),
            Expr::JSXElement(element) => self.emit_jsx_element(element),
            Expr::TsAs(expr) => {
                self.emit_expr_with_parens_if_needed(expr.expr, Precedence::Relational)?;
                self.write_space_pretty()?;
                self.keyword("as")?;
                self.write_space_pretty()?;
                self.emit_ts_type(expr.ty)
            }
            Expr::Array(expr) => {
                self.punct("[")?;
                for (index, elem) in expr.elems.iter().enumerate() {
                    if index != 0 {
                        self.punct(",")?;
                        self.write_space_pretty()?;
                    }

                    if let Some(elem) = elem {
                        if elem.spread {
                            self.punct("...")?;
                        }
                        self.emit_expr(elem.expr)?;
                    }
                }
                self.punct("]")
            }
            Expr::Object(expr) => {
                self.punct("{")?;
                if !expr.props.is_empty() {
                    self.indent();
                    self.write_line()?;
                }

                for (index, prop) in expr.props.iter().enumerate() {
                    if index != 0 {
                        self.punct(",")?;
                        self.write_line()?;
                    }

                    self.emit_prop_name(&prop.key)?;
                    self.punct(":")?;
                    self.write_space_pretty()?;
                    self.emit_expr(prop.value)?;
                }

                if !expr.props.is_empty() {
                    self.dedent();
                    self.write_line()?;
                }

                self.punct("}")
            }
            Expr::Unary(expr) => {
                let op = unary_op_text(expr.op);
                self.operator(op)?;
                if matches!(expr.op, UnaryOp::TypeOf | UnaryOp::Void | UnaryOp::Delete) {
                    self.write_space_pretty()?;
                }
                self.emit_expr_with_parens_if_needed(expr.arg, Precedence::Prefix)
            }
            Expr::Binary(expr) => {
                let precedence = binary_precedence(expr.op);
                let left_prec = if is_right_associative_binary(expr.op) {
                    precedence.next()
                } else {
                    precedence
                };
                let right_prec = if is_right_associative_binary(expr.op) {
                    precedence
                } else {
                    precedence.next()
                };

                self.emit_expr_with_parens_if_needed(expr.left, left_prec)?;
                self.write_space_pretty()?;
                self.operator(binary_op_text(expr.op))?;
                self.write_space_pretty()?;
                self.emit_expr_with_parens_if_needed(expr.right, right_prec)
            }
            Expr::Assign(expr) => {
                self.emit_pat(expr.left)?;
                self.write_space_pretty()?;
                self.operator(assign_op_text(expr.op))?;
                self.write_space_pretty()?;
                self.emit_expr_with_parens_if_needed(expr.right, Precedence::Assignment)
            }
            Expr::Call(expr) => {
                self.emit_expr_with_parens_if_needed(expr.callee, Precedence::Call)?;
                self.punct("(")?;
                self.emit_call_args(&expr.args)?;
                self.punct(")")
            }
            Expr::Member(expr) => {
                self.emit_expr_with_parens_if_needed(expr.obj, Precedence::Member)?;
                match expr.prop {
                    MemberProp::Ident(ident) | MemberProp::Private(ident) => {
                        self.punct(".")?;
                        self.emit_ident(&ident)
                    }
                    MemberProp::Computed(prop) => {
                        self.punct("[")?;
                        self.emit_expr(prop)?;
                        self.punct("]")
                    }
                }
            }
            Expr::Cond(expr) => {
                self.emit_expr_with_parens_if_needed(expr.test, Precedence::Conditional.next())?;
                self.punct("?")?;
                self.write_space_pretty()?;
                self.emit_expr_with_parens_if_needed(expr.cons, Precedence::Assignment)?;
                self.punct(":")?;
                self.write_space_pretty()?;
                self.emit_expr_with_parens_if_needed(expr.alt, Precedence::Assignment)
            }
            Expr::Seq(expr) => {
                for (index, item) in expr.exprs.iter().enumerate() {
                    if index != 0 {
                        self.punct(",")?;
                        self.write_space_pretty()?;
                    }
                    self.emit_expr_with_parens_if_needed(*item, Precedence::Assignment)?;
                }
                Ok(())
            }
            Expr::New(expr) => {
                self.keyword("new")?;
                self.write_space_pretty()?;
                self.emit_expr_with_parens_if_needed(expr.callee, Precedence::Call)?;
                self.punct("(")?;
                self.emit_call_args(&expr.args)?;
                self.punct(")")
            }
            Expr::Update(expr) => {
                let op = update_op_text(expr.op);
                if expr.prefix {
                    self.operator(op)?;
                    self.emit_expr_with_parens_if_needed(expr.arg, Precedence::Prefix)
                } else {
                    self.emit_expr_with_parens_if_needed(expr.arg, Precedence::Postfix)?;
                    self.operator(op)
                }
            }
            Expr::Await(expr) => {
                self.keyword("await")?;
                self.write_space_pretty()?;
                self.emit_expr_with_parens_if_needed(expr.arg, Precedence::Prefix)
            }
            Expr::Arrow(expr) => {
                if expr.is_async {
                    self.keyword("async")?;
                    self.write_space_force()?;
                }
                self.punct("(")?;
                for (index, param) in expr.params.iter().enumerate() {
                    if index != 0 {
                        self.punct(",")?;
                        self.write_space_pretty()?;
                    }
                    self.emit_pat(*param)?;
                }
                self.punct(")")?;
                self.write_space_pretty()?;
                self.punct("=>")?;

                match expr.body {
                    swc_es_ast::ArrowBody::Expr(expr) => {
                        self.write_space_pretty()?;
                        self.emit_expr_with_parens_if_needed(expr, Precedence::Assignment)
                    }
                    swc_es_ast::ArrowBody::Block(stmts) => {
                        self.write_space_pretty()?;
                        self.emit_block_stmt_list(&stmts)
                    }
                }
            }
            Expr::Template(expr) => {
                self.punct("`")?;
                for (index, quasi) in expr.quasis.iter().enumerate() {
                    self.emit_template_quasi(quasi.value.as_ref())?;
                    if let Some(value) = expr.exprs.get(index) {
                        self.punct("${")?;
                        self.emit_expr(*value)?;
                        self.punct("}")?;
                    }
                }
                self.punct("`")
            }
            Expr::Yield(expr) => {
                self.keyword("yield")?;
                if expr.delegate {
                    self.operator("*")?;
                }
                if let Some(arg) = expr.arg {
                    self.write_space_pretty()?;
                    self.emit_expr_with_parens_if_needed(arg, Precedence::Assignment)?;
                }
                Ok(())
            }
            Expr::TaggedTemplate(expr) => {
                self.emit_expr_with_parens_if_needed(expr.tag, Precedence::Call)?;
                self.punct("`")?;
                for (index, quasi) in expr.template.quasis.iter().enumerate() {
                    self.emit_template_quasi(quasi.value.as_ref())?;
                    if let Some(value) = expr.template.exprs.get(index) {
                        self.punct("${")?;
                        self.emit_expr(*value)?;
                        self.punct("}")?;
                    }
                }
                self.punct("`")
            }
            Expr::MetaProp(expr) => match expr.kind {
                MetaPropKind::NewTarget => self.write_token("new.target"),
                MetaPropKind::ImportMeta => self.write_token("import.meta"),
            },
            Expr::OptChain(expr) => self.emit_opt_chain(expr.base),
            Expr::Paren(expr) => {
                self.punct("(")?;
                self.emit_expr(expr.expr)?;
                self.punct(")")
            }
        }
    }

    fn emit_call_args(&mut self, args: &[swc_es_ast::ExprOrSpread]) -> Result {
        for (index, arg) in args.iter().enumerate() {
            if index != 0 {
                self.punct(",")?;
                self.write_space_pretty()?;
            }

            if arg.spread {
                self.punct("...")?;
            }
            self.emit_expr(arg.expr)?;
        }

        Ok(())
    }

    fn emit_lit(&mut self, lit: &Lit) -> Result {
        match lit {
            Lit::Str(value) => self.emit_string_literal(value.value.as_ref()),
            Lit::Bool(value) => {
                if value.value {
                    self.keyword("true")
                } else {
                    self.keyword("false")
                }
            }
            Lit::Null(_) => self.keyword("null"),
            Lit::Num(value) => self.emit_number_literal(value.value),
            Lit::BigInt(value) => {
                self.write_token(value.value.as_ref())?;
                self.punct("n")
            }
            Lit::Regex(value) => {
                self.punct("/")?;
                self.write_raw(&escape_regex_pattern(value.exp.as_ref()))?;
                self.punct("/")?;
                self.write_token(value.flags.as_ref())
            }
        }
    }

    fn emit_opt_chain(&mut self, base: ExprId) -> Result {
        match self.expr(base).clone() {
            Expr::Member(member) => {
                self.emit_expr_with_parens_if_needed(member.obj, Precedence::Member)?;
                match member.prop {
                    MemberProp::Ident(ident) | MemberProp::Private(ident) => {
                        self.punct("?.")?;
                        self.emit_ident(&ident)
                    }
                    MemberProp::Computed(prop) => {
                        self.punct("?.[")?;
                        self.emit_expr(prop)?;
                        self.punct("]")
                    }
                }
            }
            Expr::Call(call) => {
                self.emit_expr_with_parens_if_needed(call.callee, Precedence::Call)?;
                self.punct("?.(")?;
                self.emit_call_args(&call.args)?;
                self.punct(")")
            }
            _ => {
                self.emit_expr_with_parens_if_needed(base, Precedence::Call)?;
                self.punct("?.")
            }
        }
    }
}

#[inline]
fn unary_op_text(op: UnaryOp) -> &'static str {
    match op {
        UnaryOp::Plus => "+",
        UnaryOp::Minus => "-",
        UnaryOp::Bang => "!",
        UnaryOp::Tilde => "~",
        UnaryOp::TypeOf => "typeof",
        UnaryOp::Void => "void",
        UnaryOp::Delete => "delete",
    }
}

#[inline]
fn binary_op_text(op: BinaryOp) -> &'static str {
    match op {
        BinaryOp::Add => "+",
        BinaryOp::Sub => "-",
        BinaryOp::Mul => "*",
        BinaryOp::Div => "/",
        BinaryOp::Mod => "%",
        BinaryOp::EqEq => "==",
        BinaryOp::EqEqEq => "===",
        BinaryOp::NotEq => "!=",
        BinaryOp::NotEqEq => "!==",
        BinaryOp::Lt => "<",
        BinaryOp::LtEq => "<=",
        BinaryOp::Gt => ">",
        BinaryOp::GtEq => ">=",
        BinaryOp::LShift => "<<",
        BinaryOp::RShift => ">>",
        BinaryOp::ZeroFillRShift => ">>>",
        BinaryOp::LogicalAnd => "&&",
        BinaryOp::LogicalOr => "||",
        BinaryOp::BitOr => "|",
        BinaryOp::BitXor => "^",
        BinaryOp::BitAnd => "&",
        BinaryOp::In => "in",
        BinaryOp::InstanceOf => "instanceof",
        BinaryOp::Exp => "**",
        BinaryOp::NullishCoalescing => "??",
    }
}

#[inline]
fn assign_op_text(op: AssignOp) -> &'static str {
    match op {
        AssignOp::Assign => "=",
        AssignOp::AddAssign => "+=",
        AssignOp::SubAssign => "-=",
        AssignOp::MulAssign => "*=",
        AssignOp::DivAssign => "/=",
        AssignOp::ModAssign => "%=",
        AssignOp::LShiftAssign => "<<=",
        AssignOp::RShiftAssign => ">>=",
        AssignOp::ZeroFillRShiftAssign => ">>>=",
        AssignOp::BitOrAssign => "|=",
        AssignOp::BitXorAssign => "^=",
        AssignOp::BitAndAssign => "&=",
        AssignOp::ExpAssign => "**=",
        AssignOp::AndAssign => "&&=",
        AssignOp::OrAssign => "||=",
        AssignOp::NullishAssign => "??=",
    }
}

#[inline]
fn update_op_text(op: UpdateOp) -> &'static str {
    match op {
        UpdateOp::PlusPlus => "++",
        UpdateOp::MinusMinus => "--",
    }
}

#[inline]
fn escape_regex_pattern(pattern: &str) -> String {
    let mut out = String::with_capacity(pattern.len());

    for c in pattern.chars() {
        match c {
            '/' => out.push_str("\\/"),
            '\n' => out.push_str("\\n"),
            '\r' => out.push_str("\\r"),
            '\u{2028}' => out.push_str("\\u2028"),
            '\u{2029}' => out.push_str("\\u2029"),
            c => out.push(c),
        }
    }

    out
}
