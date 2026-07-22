use core::f64;

use rustc_hash::{FxHashMap, FxHashSet};
use swc_atoms::{wtf8::Wtf8Buf, Atom, Wtf8Atom};
use swc_common::{Mark, DUMMY_SP};
use swc_ecma_ast::{
    BinExpr, BinaryOp, Expr, Id, Lit, MemberExpr, Number, Pat, Program, Str, TsEnumDecl,
    TsEnumMemberId, UnaryExpr, UnaryOp, VarDecl, VarDeclKind,
};
use swc_ecma_utils::number::{JsNumber, ToJsString};
use swc_ecma_visit::{noop_visit_type, Visit, VisitWith};

use super::{util::ast_ext::MemberPropExt, FastDts};

#[derive(Debug, Clone)]
enum ConstantValue {
    Number(Number),
    String(Wtf8Atom),
}

impl ConstantValue {
    /// Creates a computed number. Computations intentionally discard source
    /// spelling so code generation can choose the canonical representation.
    fn number(value: f64) -> Self {
        Self::Number(Number {
            span: DUMMY_SP,
            value,
            raw: None,
        })
    }

    /// Creates a number converted directly from an AST value.
    fn converted_number(value: f64, raw: Option<Atom>) -> Self {
        Self::Number(Number {
            span: DUMMY_SP,
            value,
            raw,
        })
    }

    fn push_to(self, output: &mut Wtf8Buf) {
        match self {
            Self::Number(number) => output.push_str(&number.value.to_js_string()),
            Self::String(string) => output.push_wtf8(&string),
        }
    }
}

#[derive(Debug, Clone, Default)]
struct Evaluation {
    value: Option<ConstantValue>,
    has_external_references: bool,
}

impl Evaluation {
    fn constant(value: ConstantValue) -> Self {
        Self {
            value: Some(value),
            has_external_references: false,
        }
    }
}

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
struct EnumMemberKey {
    enum_id: Id,
    member_name: Wtf8Atom,
}

#[derive(Debug, Clone)]
struct EnumMemberBinding {
    evaluation: Evaluation,
    declaration_id: u32,
}

#[derive(Debug, Clone)]
struct ExternalConstant {
    init: Box<Expr>,
    source_order: u32,
}

/// Source-order state shared by enum declarations in one FastDts transform.
///
/// TypeScript stores the value of each enum member declaration separately,
/// while references resolve through the member symbol's first value
/// declaration. Keeping those concerns separate is required for duplicate and
/// merged enum declarations.
#[derive(Debug, Default)]
pub(super) struct EnumEvaluationContext {
    member_names: FxHashMap<Id, FxHashSet<Wtf8Atom>>,
    member_bindings: FxHashMap<EnumMemberKey, EnumMemberBinding>,
    external_constants: FxHashMap<Id, ExternalConstant>,
    next_declaration_id: u32,
    next_source_order: u32,
}

impl EnumEvaluationContext {
    fn take_declaration_id(&mut self) -> u32 {
        let declaration_id = self.next_declaration_id;
        self.next_declaration_id += 1;
        declaration_id
    }

    fn take_source_order(&mut self) -> u32 {
        let source_order = self.next_source_order;
        self.next_source_order += 1;
        source_order
    }
}

#[derive(Default)]
struct EnumMemberNameCollector {
    names: FxHashMap<Id, FxHashSet<Wtf8Atom>>,
}

impl Visit for EnumMemberNameCollector {
    noop_visit_type!();

    fn visit_ts_enum_decl(&mut self, decl: &TsEnumDecl) {
        let member_names = self.names.entry(decl.id.to_id()).or_default();
        member_names.extend(
            decl.members
                .iter()
                .map(|member| enum_member_name(&member.id)),
        );

        decl.visit_children_with(self);
    }
}

impl FastDts {
    pub(crate) fn collect_enum_member_names(&mut self, program: &Program) {
        let mut collector = EnumMemberNameCollector::default();
        program.visit_with(&mut collector);
        self.enum_evaluation_context.member_names = collector.names;
    }

    pub(crate) fn register_enum_external_constants(&mut self, decl: &VarDecl) {
        if decl.kind != VarDeclKind::Const {
            return;
        }

        for declarator in &decl.decls {
            let Pat::Ident(binding) = &declarator.name else {
                continue;
            };
            if binding.type_ann.is_some() {
                continue;
            }
            let Some(init) = &declarator.init else {
                continue;
            };

            let source_order = self.enum_evaluation_context.take_source_order();
            self.enum_evaluation_context
                .external_constants
                .entry(binding.id.to_id())
                .or_insert_with(|| ExternalConstant {
                    init: init.clone(),
                    source_order,
                });
        }
    }

    pub(crate) fn transform_enum(&mut self, decl: &mut TsEnumDecl) {
        let enum_id = decl.id.to_id();
        let declaration_id = self.enum_evaluation_context.take_declaration_id();
        let unresolved_mark = self.unresolved_mark;
        let mut previous_value = Some(ConstantValue::number(-1.0));

        for member in &mut decl.members {
            let source_order = self.enum_evaluation_context.take_source_order();
            let member_name = enum_member_name(&member.id);
            let member_key = EnumMemberKey {
                enum_id: enum_id.clone(),
                member_name: member_name.clone(),
            };

            let evaluation = if let Some(init) = &member.init {
                let mut evaluator = EnumEvaluator {
                    context: &self.enum_evaluation_context,
                    unresolved_mark,
                    current_member: &member_key,
                    current_declaration_id: declaration_id,
                    constant_stack: FxHashSet::default(),
                };
                evaluator.evaluate(init, source_order, true)
            } else {
                match &previous_value {
                    Some(ConstantValue::Number(number)) => {
                        Evaluation::constant(ConstantValue::number(number.value + 1.0))
                    }
                    Some(ConstantValue::String(_)) | None => Evaluation::default(),
                }
            };

            if member.init.is_some() && evaluation.has_external_references {
                self.enum_member_initializers(member.span);
            }

            previous_value = evaluation.value.clone();
            self.enum_evaluation_context
                .member_bindings
                .entry(member_key)
                .or_insert_with(|| EnumMemberBinding {
                    evaluation: evaluation.clone(),
                    declaration_id,
                });

            member.init = evaluation.value.map(constant_value_to_expr);
        }
    }
}

struct EnumEvaluator<'a> {
    context: &'a EnumEvaluationContext,
    unresolved_mark: Mark,
    current_member: &'a EnumMemberKey,
    current_declaration_id: u32,
    constant_stack: FxHashSet<Id>,
}

impl EnumEvaluator<'_> {
    fn evaluate(
        &mut self,
        expr: &Expr,
        source_order: u32,
        in_enum_member_scope: bool,
    ) -> Evaluation {
        match expr {
            Expr::Lit(lit) => match lit {
                Lit::Str(string) => {
                    Evaluation::constant(ConstantValue::String(string.value.clone()))
                }
                Lit::Num(number) => Evaluation::constant(ConstantValue::Number(number.clone())),
                Lit::Null(_) | Lit::BigInt(_) | Lit::Bool(_) | Lit::Regex(_) | Lit::JSXText(_) => {
                    Evaluation::default()
                }
                #[cfg(swc_ast_unknown)]
                _ => panic!("unable to access unknown nodes"),
            },
            Expr::Tpl(template) => {
                let mut quasis = template.quasis.iter();
                let Some(first) = quasis.next().and_then(|quasi| quasi.cooked.as_ref()) else {
                    return Evaluation::default();
                };
                let mut value = Wtf8Buf::from(first);
                let mut has_external_references = false;

                for (expr, quasi) in template.exprs.iter().zip(quasis) {
                    let evaluation = self.evaluate(expr, source_order, in_enum_member_scope);
                    let Some(constant) = evaluation.value else {
                        // TypeScript discards external-reference state when a
                        // template expression is not fully constant.
                        return Evaluation::default();
                    };
                    constant.push_to(&mut value);
                    let Some(cooked) = quasi.cooked.as_ref() else {
                        return Evaluation::default();
                    };
                    value.push_wtf8(cooked);
                    has_external_references |= evaluation.has_external_references;
                }

                Evaluation {
                    value: Some(ConstantValue::String(Wtf8Atom::from(&*value))),
                    has_external_references,
                }
            }
            Expr::Paren(expr) => self.evaluate(&expr.expr, source_order, in_enum_member_scope),
            Expr::Bin(expr) => self.evaluate_binary(expr, source_order, in_enum_member_scope),
            Expr::Unary(expr) => self.evaluate_unary(expr, source_order, in_enum_member_scope),
            Expr::Ident(ident) => {
                self.evaluate_identifier(ident, source_order, in_enum_member_scope)
            }
            Expr::Member(member) => self.evaluate_member(member, in_enum_member_scope),
            Expr::OptChain(chain) => chain
                .base
                .as_member()
                .map_or_else(Evaluation::default, |member| {
                    self.evaluate_member(member, in_enum_member_scope)
                }),
            _ => Evaluation::default(),
        }
    }

    fn evaluate_identifier(
        &mut self,
        ident: &swc_ecma_ast::Ident,
        source_order: u32,
        in_enum_member_scope: bool,
    ) -> Evaluation {
        let is_unresolved = ident.ctxt.has_mark(self.unresolved_mark);
        let member_name: Wtf8Atom = ident.sym.clone().into();

        if in_enum_member_scope
            && is_unresolved
            && self.is_known_member(&self.current_member.enum_id, &member_name)
        {
            let key = EnumMemberKey {
                enum_id: self.current_member.enum_id.clone(),
                member_name,
            };
            return self.evaluate_enum_member(&key, true);
        }

        if is_unresolved {
            match ident.sym.as_ref() {
                "Infinity" => {
                    return Evaluation::constant(ConstantValue::converted_number(
                        f64::INFINITY,
                        Some(ident.sym.clone()),
                    ));
                }
                "NaN" => {
                    return Evaluation::constant(ConstantValue::converted_number(
                        f64::NAN,
                        Some(ident.sym.clone()),
                    ));
                }
                _ => {}
            }
        }

        self.evaluate_external_constant(&ident.to_id(), source_order)
    }

    fn evaluate_external_constant(&mut self, id: &Id, source_order: u32) -> Evaluation {
        let Some(constant) = self.context.external_constants.get(id) else {
            return Evaluation::default();
        };
        if constant.source_order >= source_order || !self.constant_stack.insert(id.clone()) {
            return Evaluation::default();
        }

        let mut evaluation = self.evaluate(&constant.init, constant.source_order, false);
        self.constant_stack.remove(id);
        evaluation.has_external_references = true;
        evaluation
    }

    fn evaluate_member(&mut self, member: &MemberExpr, in_enum_member_scope: bool) -> Evaluation {
        let Some(ident) = member.obj.as_ident() else {
            return Evaluation::default();
        };
        let Some(member_name) = member.prop.static_name() else {
            return Evaluation::default();
        };
        let key = EnumMemberKey {
            enum_id: ident.to_id(),
            member_name: member_name.clone(),
        };

        self.evaluate_enum_member(&key, in_enum_member_scope)
    }

    fn evaluate_enum_member(&self, key: &EnumMemberKey, in_enum_member_scope: bool) -> Evaluation {
        if let Some(binding) = self.context.member_bindings.get(key) {
            let mut evaluation = binding.evaluation.clone();
            if !in_enum_member_scope || binding.declaration_id != self.current_declaration_id {
                evaluation.has_external_references = true;
            }
            return evaluation;
        }

        if !self.is_known_member(&key.enum_id, &key.member_name) {
            return Evaluation::default();
        }

        if in_enum_member_scope && key == self.current_member {
            return Evaluation::default();
        }

        // TypeScript reports the forward reference separately and uses zero as
        // the enum evaluator's recovery value.
        Evaluation::constant(ConstantValue::number(0.0))
    }

    fn is_known_member(&self, enum_id: &Id, member_name: &Wtf8Atom) -> bool {
        self.context
            .member_names
            .get(enum_id)
            .is_some_and(|member_names| member_names.contains(member_name))
    }

    fn evaluate_unary(
        &mut self,
        expr: &UnaryExpr,
        source_order: u32,
        in_enum_member_scope: bool,
    ) -> Evaluation {
        let evaluation = self.evaluate(&expr.arg, source_order, in_enum_member_scope);
        let has_external_references = evaluation.has_external_references;
        let Some(ConstantValue::Number(number)) = evaluation.value else {
            return Evaluation {
                value: None,
                has_external_references,
            };
        };

        let value = match expr.op {
            UnaryOp::Minus => Some(-number.value),
            UnaryOp::Plus => Some(number.value),
            UnaryOp::Tilde => Some((!JsNumber::from(number.value)).into()),
            _ => None,
        };

        Evaluation {
            value: value.map(ConstantValue::number),
            has_external_references,
        }
    }

    fn evaluate_binary(
        &mut self,
        expr: &BinExpr,
        source_order: u32,
        in_enum_member_scope: bool,
    ) -> Evaluation {
        let left = self.evaluate(&expr.left, source_order, in_enum_member_scope);
        let right = self.evaluate(&expr.right, source_order, in_enum_member_scope);
        let has_external_references = left.has_external_references || right.has_external_references;
        let (Some(left), Some(right)) = (left.value, right.value) else {
            return Evaluation {
                value: None,
                has_external_references,
            };
        };

        if expr.op == BinaryOp::Add
            && (matches!(&left, ConstantValue::String(_))
                || matches!(&right, ConstantValue::String(_)))
        {
            let mut value = Wtf8Buf::new();
            left.push_to(&mut value);
            right.push_to(&mut value);
            return Evaluation {
                value: Some(ConstantValue::String(Wtf8Atom::from(&*value))),
                has_external_references,
            };
        }

        let left = JsNumber::from(match left {
            ConstantValue::Number(number) => number.value,
            ConstantValue::String(_) => {
                return Evaluation {
                    value: None,
                    has_external_references,
                };
            }
        });
        let right = JsNumber::from(match right {
            ConstantValue::Number(number) => number.value,
            ConstantValue::String(_) => {
                return Evaluation {
                    value: None,
                    has_external_references,
                };
            }
        });

        let value = match expr.op {
            BinaryOp::LShift => Some(left << right),
            BinaryOp::RShift => Some(left >> right),
            BinaryOp::ZeroFillRShift => Some(left.unsigned_shr(right)),
            BinaryOp::Add => Some(left + right),
            BinaryOp::Sub => Some(left - right),
            BinaryOp::Mul => Some(left * right),
            BinaryOp::Div => Some(left / right),
            BinaryOp::Mod => Some(left % right),
            BinaryOp::BitOr => Some(left | right),
            BinaryOp::BitXor => Some(left ^ right),
            BinaryOp::BitAnd => Some(left & right),
            BinaryOp::Exp => Some(left.pow(right)),
            _ => None,
        };

        Evaluation {
            value: value.map(|number| ConstantValue::number(number.into())),
            has_external_references,
        }
    }
}

fn constant_value_to_expr(value: ConstantValue) -> Box<Expr> {
    Box::new(match value {
        ConstantValue::Number(number) => Expr::Lit(Lit::Num(number)),
        ConstantValue::String(value) => Expr::Lit(Lit::Str(Str {
            span: DUMMY_SP,
            value,
            raw: None,
        })),
    })
}

fn enum_member_name(member: &TsEnumMemberId) -> Wtf8Atom {
    match member {
        TsEnumMemberId::Ident(ident) => ident.sym.clone().into(),
        TsEnumMemberId::Str(string) => string.value.clone(),
        #[cfg(swc_ast_unknown)]
        _ => panic!("unable to access unknown nodes"),
    }
}
