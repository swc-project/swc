use swc_es_ast::{
    AssignOp, BinaryOp, Expr, ExprOrSpread, Lit, MemberProp, MetaPropKind, PropName, UnaryOp,
    UpdateOp,
};

use super::{EmitResult, Emitter};

const PREC_COMMA: u8 = 1;
const PREC_ASSIGN: u8 = 2;
const PREC_CONDITIONAL: u8 = 3;
const PREC_LOGICAL_OR: u8 = 4;
const PREC_LOGICAL_AND: u8 = 5;
const PREC_BIT_OR: u8 = 6;
const PREC_BIT_XOR: u8 = 7;
const PREC_BIT_AND: u8 = 8;
const PREC_EQUALITY: u8 = 9;
const PREC_RELATIONAL: u8 = 10;
const PREC_SHIFT: u8 = 11;
const PREC_ADDITIVE: u8 = 12;
const PREC_MULTIPLICATIVE: u8 = 13;
const PREC_EXPONENTIAL: u8 = 14;
const PREC_PREFIX: u8 = 15;
const PREC_POSTFIX: u8 = 16;
const PREC_CALL: u8 = 17;
const PREC_PRIMARY: u8 = 18;

impl Emitter<'_> {
    pub(super) fn emit_expr(&mut self, id: swc_es_ast::ExprId, parent_prec: u8) -> EmitResult {
        let store = self.store;
        let expr = Self::get_expr(store, id)?;
        let prec = self.expr_precedence(expr);
        let needs_paren = prec < parent_prec;
        if needs_paren {
            self.out.push_byte(b'(');
        }

        match expr {
            Expr::Ident(ident) => self.write_ident_sym(&ident.sym),
            Expr::Lit(lit) => self.emit_lit(lit),
            Expr::Function(function) => {
                self.out.push_str("function");
                let function = Self::get_function(store, *function)?;
                if function.is_generator {
                    self.out.push_byte(b'*');
                }
                self.emit_function_expr(function)?;
            }
            Expr::Class(class_id) => self.emit_class_with_name(*class_id, None)?,
            Expr::JSXElement(id) => self.emit_jsx_element(*id)?,
            Expr::TsAs(as_expr) => {
                self.emit_expr(as_expr.expr, PREC_RELATIONAL)?;
                self.out.push_str(" as ");
                self.emit_ts_type(as_expr.ty)?;
            }
            Expr::Array(array) => {
                self.out.push_byte(b'[');
                for (idx, elem) in array.elems.iter().enumerate() {
                    if idx != 0 {
                        self.out.push_byte(b',');
                    }
                    if let Some(elem) = elem {
                        self.emit_expr_or_spread(elem)?;
                    }
                }
                self.out.push_byte(b']');
            }
            Expr::Object(object) => {
                self.out.push_byte(b'{');
                for (idx, prop) in object.props.iter().enumerate() {
                    if idx != 0 {
                        self.out.push_byte(b',');
                    }

                    if let PropName::Ident(ident) = &prop.key {
                        if ident.sym.as_ref() == "__spread__" {
                            self.out.push_str("...");
                            self.emit_expr(prop.value, 0)?;
                            continue;
                        }
                    }

                    let shorthand = match (&prop.key, Self::get_expr(store, prop.value)?) {
                        (PropName::Ident(key), Expr::Ident(value)) => key.sym == value.sym,
                        _ => false,
                    };

                    if shorthand {
                        if let PropName::Ident(ident) = &prop.key {
                            self.write_ident_sym(&ident.sym);
                            continue;
                        }
                    }

                    self.emit_prop_name(&prop.key)?;
                    self.out.push_byte(b':');
                    self.emit_expr(prop.value, 0)?;
                }
                self.out.push_byte(b'}');
            }
            Expr::Unary(unary) => {
                match unary.op {
                    UnaryOp::Plus => self.out.push_byte(b'+'),
                    UnaryOp::Minus => self.out.push_byte(b'-'),
                    UnaryOp::Bang => self.out.push_byte(b'!'),
                    UnaryOp::Tilde => self.out.push_byte(b'~'),
                    UnaryOp::TypeOf => self.out.push_str("typeof "),
                    UnaryOp::Void => self.out.push_str("void "),
                    UnaryOp::Delete => self.out.push_str("delete "),
                }
                self.emit_expr(unary.arg, PREC_PREFIX)?;
            }
            Expr::Binary(binary) => {
                let op_prec = self.binary_precedence(binary.op);
                let left_prec = if binary.op == BinaryOp::Exp {
                    op_prec + 1
                } else {
                    op_prec
                };
                let right_prec = if binary.op == BinaryOp::Exp {
                    op_prec
                } else {
                    op_prec + 1
                };

                self.emit_expr(binary.left, left_prec)?;
                self.out.push_str(self.binary_op_text(binary.op));
                self.emit_expr(binary.right, right_prec)?;
            }
            Expr::Assign(assign) => {
                self.emit_pat(assign.left)?;
                self.out.push_str(self.assign_op_text(assign.op));
                self.emit_expr(assign.right, PREC_ASSIGN)?;
            }
            Expr::Call(call) => {
                self.emit_expr(call.callee, PREC_CALL)?;
                self.out.push_byte(b'(');
                for (idx, arg) in call.args.iter().enumerate() {
                    if idx != 0 {
                        self.out.push_byte(b',');
                    }
                    self.emit_expr_or_spread(arg)?;
                }
                self.out.push_byte(b')');
            }
            Expr::Member(member) => {
                self.emit_expr(member.obj, PREC_CALL)?;
                match &member.prop {
                    MemberProp::Ident(ident) => {
                        self.out.push_byte(b'.');
                        self.write_ident_sym(&ident.sym);
                    }
                    MemberProp::Private(ident) => {
                        self.out.push_byte(b'.');
                        self.write_private_ident_sym(&ident.sym);
                    }
                    MemberProp::Computed(expr) => {
                        self.out.push_byte(b'[');
                        self.emit_expr(*expr, 0)?;
                        self.out.push_byte(b']');
                    }
                }
            }
            Expr::Cond(cond) => {
                self.emit_expr(cond.test, PREC_CONDITIONAL + 1)?;
                self.out.push_byte(b'?');
                self.emit_expr(cond.cons, PREC_ASSIGN)?;
                self.out.push_byte(b':');
                self.emit_expr(cond.alt, PREC_CONDITIONAL)?;
            }
            Expr::Seq(seq) => {
                for (idx, expr) in seq.exprs.iter().enumerate() {
                    if idx != 0 {
                        self.out.push_byte(b',');
                    }
                    self.emit_expr(*expr, PREC_ASSIGN)?;
                }
            }
            Expr::New(new_expr) => {
                self.out.push_str("new ");
                self.emit_expr(new_expr.callee, PREC_CALL)?;
                self.out.push_byte(b'(');
                for (idx, arg) in new_expr.args.iter().enumerate() {
                    if idx != 0 {
                        self.out.push_byte(b',');
                    }
                    self.emit_expr_or_spread(arg)?;
                }
                self.out.push_byte(b')');
            }
            Expr::Update(update) => {
                if update.prefix {
                    self.out.push_str(match update.op {
                        UpdateOp::PlusPlus => "++",
                        UpdateOp::MinusMinus => "--",
                    });
                    self.emit_expr(update.arg, PREC_POSTFIX)?;
                } else {
                    self.emit_expr(update.arg, PREC_POSTFIX)?;
                    self.out.push_str(match update.op {
                        UpdateOp::PlusPlus => "++",
                        UpdateOp::MinusMinus => "--",
                    });
                }
            }
            Expr::Await(await_expr) => {
                self.out.push_str("await ");
                self.emit_expr(await_expr.arg, PREC_PREFIX)?;
            }
            Expr::Arrow(arrow) => {
                if arrow.is_async {
                    self.out.push_str("async ");
                }
                self.out.push_byte(b'(');
                for (idx, param) in arrow.params.iter().enumerate() {
                    if idx != 0 {
                        self.out.push_byte(b',');
                    }
                    self.emit_pat(*param)?;
                }
                self.out.push_str(")=>");
                match &arrow.body {
                    swc_es_ast::ArrowBody::Expr(expr) => self.emit_expr(*expr, PREC_ASSIGN)?,
                    swc_es_ast::ArrowBody::Block(stmts) => self.emit_block_stmts(stmts)?,
                }
            }
            Expr::Template(template) => self.emit_template_expr(template)?,
            Expr::Yield(yield_expr) => {
                self.out.push_str("yield");
                if yield_expr.delegate {
                    self.out.push_byte(b'*');
                }
                if let Some(arg) = yield_expr.arg {
                    self.out.push_byte(b' ');
                    self.emit_expr(arg, PREC_ASSIGN)?;
                }
            }
            Expr::TaggedTemplate(tagged) => {
                self.emit_expr(tagged.tag, PREC_CALL)?;
                self.emit_template_expr(&tagged.template)?;
            }
            Expr::MetaProp(meta_prop) => {
                self.out.push_str(match meta_prop.kind {
                    MetaPropKind::NewTarget => "new.target",
                    MetaPropKind::ImportMeta => "import.meta",
                });
            }
            Expr::OptChain(chain) => {
                self.emit_opt_chain_base(chain.base)?;
            }
            Expr::Paren(paren) => {
                self.out.push_byte(b'(');
                self.emit_expr(paren.expr, 0)?;
                self.out.push_byte(b')');
            }
        }

        if needs_paren {
            self.out.push_byte(b')');
        }

        Ok(())
    }

    fn emit_function_expr(&mut self, function: &swc_es_ast::Function) -> EmitResult {
        self.out.push_byte(b'(');
        for (idx, param) in function.params.iter().enumerate() {
            if idx != 0 {
                self.out.push_byte(b',');
            }
            for decorator in &param.decorators {
                self.out.push_byte(b'@');
                self.emit_expr(decorator.expr, 0)?;
                self.out.push_byte(b' ');
            }
            self.emit_pat(param.pat)?;
        }
        self.out.push_byte(b')');
        self.emit_block_stmts(&function.body)
    }

    fn emit_template_expr(&mut self, template: &swc_es_ast::TemplateExpr) -> EmitResult {
        if template.quasis.is_empty() {
            if template.exprs.is_empty() {
                self.out.push_str("``");
                return Ok(());
            }

            return Err(Self::invalid_ast(
                "template with expressions must have at least one quasi",
            ));
        }

        if template.quasis.len() != template.exprs.len() + 1 {
            return Err(Self::invalid_ast(
                "template quasis length must equal expressions length + 1",
            ));
        }

        self.out.push_byte(b'`');
        for idx in 0..template.exprs.len() {
            self.out
                .write_template_chunk(template.quasis[idx].value.as_ref());
            self.out.push_str("${");
            self.emit_expr(template.exprs[idx], 0)?;
            self.out.push_byte(b'}');
        }
        self.out
            .write_template_chunk(template.quasis[template.exprs.len()].value.as_ref());
        self.out.push_byte(b'`');
        Ok(())
    }

    fn emit_opt_chain_base(&mut self, base: swc_es_ast::ExprId) -> EmitResult {
        let store = self.store;
        match Self::get_expr(store, base)? {
            Expr::Member(member) => {
                self.emit_expr(member.obj, PREC_CALL)?;
                match &member.prop {
                    MemberProp::Ident(ident) => {
                        self.out.push_str("?.");
                        self.write_ident_sym(&ident.sym);
                    }
                    MemberProp::Private(ident) => {
                        self.out.push_str("?.");
                        self.write_private_ident_sym(&ident.sym);
                    }
                    MemberProp::Computed(expr) => {
                        self.out.push_str("?.[");
                        self.emit_expr(*expr, 0)?;
                        self.out.push_byte(b']');
                    }
                }
                Ok(())
            }
            Expr::Call(call) => {
                self.emit_expr(call.callee, PREC_CALL)?;
                self.out.push_str("?.(");
                for (idx, arg) in call.args.iter().enumerate() {
                    if idx != 0 {
                        self.out.push_byte(b',');
                    }
                    self.emit_expr_or_spread(arg)?;
                }
                self.out.push_byte(b')');
                Ok(())
            }
            _ => Err(Self::invalid_ast(
                "optional chain base must be call or member expression",
            )),
        }
    }

    fn emit_expr_or_spread(&mut self, node: &ExprOrSpread) -> EmitResult {
        if node.spread {
            self.out.push_str("...");
        }
        self.emit_expr(node.expr, 0)
    }

    fn emit_lit(&mut self, lit: &Lit) {
        match lit {
            Lit::Str(lit) => self.out.write_js_string(lit.value.as_ref()),
            Lit::Bool(lit) => {
                if lit.value {
                    self.out.push_str("true");
                } else {
                    self.out.push_str("false");
                }
            }
            Lit::Null(_) => self.out.push_str("null"),
            Lit::Num(lit) => self.out.write_number(lit.value),
            Lit::BigInt(lit) => {
                self.out.push_str(lit.value.as_ref());
                self.out.push_byte(b'n');
            }
            Lit::Regex(lit) => {
                self.out.push_byte(b'/');
                self.out.push_str(lit.exp.as_ref());
                self.out.push_byte(b'/');
                self.out.push_str(lit.flags.as_ref());
            }
        }
    }

    fn expr_precedence(&self, expr: &Expr) -> u8 {
        match expr {
            Expr::Seq(_) => PREC_COMMA,
            Expr::Assign(_) | Expr::Arrow(_) | Expr::Yield(_) => PREC_ASSIGN,
            Expr::Cond(_) => PREC_CONDITIONAL,
            Expr::TsAs(_) => PREC_RELATIONAL,
            Expr::Binary(binary) => self.binary_precedence(binary.op),
            Expr::Unary(_) | Expr::Await(_) => PREC_PREFIX,
            Expr::Update(_) => PREC_POSTFIX,
            Expr::Call(_)
            | Expr::Member(_)
            | Expr::New(_)
            | Expr::TaggedTemplate(_)
            | Expr::OptChain(_) => PREC_CALL,
            Expr::Ident(_)
            | Expr::Lit(_)
            | Expr::Function(_)
            | Expr::Class(_)
            | Expr::JSXElement(_)
            | Expr::Array(_)
            | Expr::Object(_)
            | Expr::Template(_)
            | Expr::MetaProp(_)
            | Expr::Paren(_) => PREC_PRIMARY,
        }
    }

    fn binary_precedence(&self, op: BinaryOp) -> u8 {
        match op {
            BinaryOp::LogicalOr => PREC_LOGICAL_OR,
            BinaryOp::NullishCoalescing => PREC_LOGICAL_OR,
            BinaryOp::LogicalAnd => PREC_LOGICAL_AND,
            BinaryOp::BitOr => PREC_BIT_OR,
            BinaryOp::BitXor => PREC_BIT_XOR,
            BinaryOp::BitAnd => PREC_BIT_AND,
            BinaryOp::EqEq | BinaryOp::EqEqEq | BinaryOp::NotEq | BinaryOp::NotEqEq => {
                PREC_EQUALITY
            }
            BinaryOp::Lt
            | BinaryOp::LtEq
            | BinaryOp::Gt
            | BinaryOp::GtEq
            | BinaryOp::In
            | BinaryOp::InstanceOf => PREC_RELATIONAL,
            BinaryOp::LShift | BinaryOp::RShift | BinaryOp::ZeroFillRShift => PREC_SHIFT,
            BinaryOp::Add | BinaryOp::Sub => PREC_ADDITIVE,
            BinaryOp::Mul | BinaryOp::Div | BinaryOp::Mod => PREC_MULTIPLICATIVE,
            BinaryOp::Exp => PREC_EXPONENTIAL,
        }
    }

    fn binary_op_text(&self, op: BinaryOp) -> &'static str {
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
            BinaryOp::In => " in ",
            BinaryOp::InstanceOf => " instanceof ",
            BinaryOp::Exp => "**",
            BinaryOp::NullishCoalescing => "??",
        }
    }

    fn assign_op_text(&self, op: AssignOp) -> &'static str {
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

    pub(super) fn expr_stmt_needs_paren(&self, expr: &Expr) -> bool {
        matches!(expr, Expr::Object(_) | Expr::Function(_) | Expr::Class(_))
    }
}
