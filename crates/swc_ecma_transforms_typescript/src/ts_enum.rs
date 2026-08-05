use rustc_hash::FxHashMap;
use swc_atoms::{wtf8::Wtf8Buf, Atom, Wtf8Atom};
use swc_common::{SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{
    number::{JsNumber, ToJsString},
    ExprFactory,
};

#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub(crate) struct TsEnumRecordKey {
    pub enum_id: Id,
    pub member_name: Wtf8Atom,
}

pub(crate) type TsEnumRecord = FxHashMap<TsEnumRecordKey, TsEnumRecordValue>;

#[derive(Debug, Clone)]
pub(crate) enum TsEnumRecordValue {
    String(Wtf8Atom),
    Number(Number),
    Opaque(Box<Expr>),
    Void,
}

impl TsEnumRecordValue {
    /// Creates a computed number. Computations intentionally discard source
    /// spelling so code generation can choose the canonical representation.
    fn number(value: impl Into<f64>) -> Self {
        Self::Number(Number {
            span: DUMMY_SP,
            value: value.into(),
            raw: None,
        })
    }

    /// Creates a number converted directly from an AST value.
    fn converted_number(value: impl Into<f64>, raw: Option<Atom>) -> Self {
        Self::Number(Number {
            span: DUMMY_SP,
            value: value.into(),
            raw,
        })
    }

    pub fn inc(&self) -> Self {
        match self {
            Self::Number(num) => Self::number(num.value + 1.0),
            _ => Self::Void,
        }
    }

    pub fn is_const(&self) -> bool {
        matches!(
            self,
            TsEnumRecordValue::String(..) | TsEnumRecordValue::Number(..)
        )
    }

    pub fn is_string(&self) -> bool {
        matches!(self, TsEnumRecordValue::String(..))
    }

    pub fn has_value(&self) -> bool {
        !matches!(self, TsEnumRecordValue::Void)
    }

    fn push_to_string(&self, output: &mut Wtf8Buf) -> bool {
        match self {
            Self::String(value) => output.push_wtf8(value),
            Self::Number(value) => output.push_str(&value.value.to_js_string()),
            Self::Opaque(_) | Self::Void => return false,
        }

        true
    }
}

impl From<TsEnumRecordValue> for Expr {
    fn from(value: TsEnumRecordValue) -> Self {
        match value {
            TsEnumRecordValue::String(string) => Lit::Str(string.into()).into(),
            TsEnumRecordValue::Number(num) => Lit::Num(num).into(),
            TsEnumRecordValue::Void => *Expr::undefined(DUMMY_SP),
            TsEnumRecordValue::Opaque(expr) => *expr,
        }
    }
}

impl From<f64> for TsEnumRecordValue {
    fn from(value: f64) -> Self {
        Self::number(value)
    }
}

pub(crate) struct EnumValueComputer<'a> {
    pub enum_id: &'a Id,
    pub unresolved_ctxt: SyntaxContext,
    pub record: &'a TsEnumRecord,
    pub const_vars: &'a FxHashMap<Id, TsEnumRecordValue>,
}

/// Returns a statically known enum member key without discarding lone
/// surrogates.
pub(crate) fn static_enum_member_name(property: &MemberProp) -> Option<Wtf8Atom> {
    match property {
        MemberProp::Ident(ident) => Some(ident.sym.clone().into()),
        MemberProp::Computed(ComputedPropName { expr, .. }) => match &**expr {
            Expr::Lit(Lit::Str(string)) => Some(string.value.clone()),
            Expr::Tpl(template) if template.exprs.is_empty() && template.quasis.len() == 1 => {
                template.quasis[0].cooked.clone()
            }
            _ => None,
        },
        MemberProp::PrivateName(_) => None,
        #[cfg(swc_ast_unknown)]
        _ => panic!("unable to access unknown nodes"),
    }
}

/// Evaluation context for [`EnumValueComputer::compute_rec`].
///
/// TypeScript decides enum member constness from the *syntactic* form of the
/// initializer, without type resolution. See
/// https://github.com/microsoft/TypeScript/pull/50528 and the constraints
/// described in https://github.com/evanw/esbuild/issues/4387.
#[derive(Clone, Copy)]
pub(crate) struct EvalCtx {
    /// Whether a reference to a `const` binding may be resolved to its value.
    /// Disabled under type syntax: `enum E { A = foo as string }` is not a
    /// constant for TypeScript even when `foo` is.
    allow_const_var: bool,
    /// Whether type syntax makes the whole expression non-constant instead of
    /// being stripped. Used when evaluating a `const` initializer, where any
    /// annotation or assertion removes constness.
    ts_is_opaque: bool,
}

impl EvalCtx {
    /// Context for a `const` variable initializer.
    pub(crate) const CONST_INIT: Self = Self {
        allow_const_var: true,
        ts_is_opaque: true,
    };
    /// Context for an enum member initializer.
    pub(crate) const MEMBER: Self = Self {
        allow_const_var: true,
        ts_is_opaque: false,
    };
    /// Context for re-computing a member whose value the pre-pass already
    /// classified as non-constant. Resolving `const` bindings here would
    /// override that verdict: the binding map is complete by this point, and
    /// type assertions have already been stripped from the initializer.
    pub(crate) const RECOMPUTE: Self = Self {
        allow_const_var: false,
        ts_is_opaque: false,
    };
}

/// https://github.com/microsoft/TypeScript/pull/50528
impl EnumValueComputer<'_> {
    /// Whether [`Self::compute`] could fold this expression at all, decided
    /// from its outermost form alone.
    ///
    /// `compute` takes the expression by value, so evaluating an initializer
    /// means cloning it. Every form not listed here hits the `Opaque`
    /// catch-all immediately, and `const` initializers in real TypeScript are
    /// mostly arrow functions, object literals and calls — cloning those to
    /// discard the result dominated the cost of the collection pass.
    ///
    /// Kept in sync with the arms of `compute_rec`. An omission here can only
    /// under-fold; it can never produce a wrong value.
    pub fn can_fold_shape(expr: &Expr) -> bool {
        matches!(
            expr,
            Expr::Lit(..)
                | Expr::Ident(..)
                | Expr::Paren(..)
                | Expr::Unary(..)
                | Expr::Bin(..)
                | Expr::Member(..)
                | Expr::Tpl(..)
                | Expr::TsAs(..)
                | Expr::TsNonNull(..)
                | Expr::TsTypeAssertion(..)
                | Expr::TsConstAssertion(..)
                | Expr::TsInstantiation(..)
                | Expr::TsSatisfies(..)
        )
    }

    pub fn compute(&self, expr: Box<Expr>, ctx: EvalCtx) -> TsEnumRecordValue {
        self.compute_rec(expr, ctx)
    }

    fn compute_rec(&self, expr: Box<Expr>, ctx: EvalCtx) -> TsEnumRecordValue {
        match *expr {
            Expr::Lit(Lit::Str(s)) => TsEnumRecordValue::String(s.value),
            Expr::Lit(Lit::Num(n)) => TsEnumRecordValue::Number(n),
            Expr::Ident(ref ident) if ident.ctxt == self.unresolved_ctxt => {
                if let Some(value) = self.record.get(&TsEnumRecordKey {
                    enum_id: self.enum_id.clone(),
                    member_name: ident.sym.clone().into(),
                }) {
                    if value.is_const() {
                        value.clone()
                    } else {
                        TsEnumRecordValue::Opaque(
                            self.enum_id
                                .clone()
                                .make_member(ident.clone().into())
                                .into(),
                        )
                    }
                } else {
                    match ident.sym.as_ref() {
                        "Infinity" => TsEnumRecordValue::converted_number(
                            f64::INFINITY,
                            Some(ident.sym.clone()),
                        ),
                        "NaN" => {
                            TsEnumRecordValue::converted_number(f64::NAN, Some(ident.sym.clone()))
                        }
                        _ => TsEnumRecordValue::Opaque(expr),
                    }
                }
            }
            // A reference to a `const` binding whose initializer is a constant
            // expression. TypeScript treats it as a compile-time constant, so
            // the member is emitted as a string enum instead of a reverse
            // mapping. Only reachable when not under type syntax.
            Expr::Ident(ref ident) if ctx.allow_const_var => self
                .const_vars
                .get(&ident.to_id())
                .cloned()
                .unwrap_or_else(|| TsEnumRecordValue::Opaque(expr)),
            Expr::Paren(e) => self.compute_rec(e.expr, ctx),
            Expr::Unary(e) => self.compute_unary(e, ctx),
            Expr::Bin(e) => self.compute_bin(e, ctx),
            Expr::Member(e) => self.compute_member(e, ctx),
            Expr::Tpl(e) => self.compute_tpl(e, ctx),
            // Handle TypeScript type expressions by stripping them
            // and computing the inner expression
            Expr::TsAs(TsAsExpr { expr: inner, .. })
            | Expr::TsNonNull(TsNonNullExpr { expr: inner, .. })
            | Expr::TsTypeAssertion(TsTypeAssertion { expr: inner, .. })
            | Expr::TsConstAssertion(TsConstAssertion { expr: inner, .. })
            | Expr::TsInstantiation(TsInstantiation { expr: inner, .. })
            | Expr::TsSatisfies(TsSatisfiesExpr { expr: inner, .. }) => {
                if ctx.ts_is_opaque {
                    // Any annotation or assertion removes constness from a
                    // `const` initializer.
                    return TsEnumRecordValue::Opaque(inner);
                }
                self.compute_rec(
                    inner,
                    EvalCtx {
                        allow_const_var: false,
                        ..ctx
                    },
                )
            }
            _ => TsEnumRecordValue::Opaque(expr),
        }
    }

    fn compute_unary(&self, expr: UnaryExpr, ctx: EvalCtx) -> TsEnumRecordValue {
        if !matches!(expr.op, op!(unary, "+") | op!(unary, "-") | op!("~")) {
            return TsEnumRecordValue::Opaque(expr.into());
        }

        let inner = self.compute_rec(expr.arg, ctx);

        let TsEnumRecordValue::Number(num) = inner else {
            return TsEnumRecordValue::Opaque(
                UnaryExpr {
                    span: expr.span,
                    op: expr.op,
                    arg: Box::new(inner.into()),
                }
                .into(),
            );
        };

        match expr.op {
            op!(unary, "+") => TsEnumRecordValue::number(num.value),
            op!(unary, "-") => TsEnumRecordValue::number(-num.value),
            op!("~") => TsEnumRecordValue::number(!JsNumber::from(num.value)),
            _ => unreachable!(),
        }
    }

    fn compute_bin(&self, expr: BinExpr, ctx: EvalCtx) -> TsEnumRecordValue {
        let origin_expr = expr.clone();
        if !matches!(
            expr.op,
            op!(bin, "+")
                | op!(bin, "-")
                | op!("*")
                | op!("/")
                | op!("%")
                | op!("**")
                | op!("<<")
                | op!(">>")
                | op!(">>>")
                | op!("|")
                | op!("&")
                | op!("^"),
        ) {
            return TsEnumRecordValue::Opaque(origin_expr.into());
        }

        let left = self.compute_rec(expr.left, ctx);
        let right = self.compute_rec(expr.right, ctx);

        if expr.op == BinaryOp::Add && (left.is_string() || right.is_string()) {
            let mut value = Wtf8Buf::new();

            if left.push_to_string(&mut value) && right.push_to_string(&mut value) {
                return TsEnumRecordValue::String(Wtf8Atom::from(&*value));
            }
        }

        match (left, right, expr.op) {
            (TsEnumRecordValue::Number(left), TsEnumRecordValue::Number(right), op) => {
                let left = JsNumber::from(left.value);
                let right = JsNumber::from(right.value);
                let value = match op {
                    op!(bin, "+") => left + right,
                    op!(bin, "-") => left - right,
                    op!("*") => left * right,
                    op!("/") => left / right,
                    op!("%") => left % right,
                    op!("**") => left.pow(right),
                    op!("<<") => left << right,
                    op!(">>") => left >> right,
                    op!(">>>") => left.unsigned_shr(right),
                    op!("|") => left | right,
                    op!("&") => left & right,
                    op!("^") => left ^ right,
                    _ => unreachable!(),
                };

                TsEnumRecordValue::number(value)
            }
            (left, right, _) => {
                let mut origin_expr = origin_expr;

                if left.is_const() {
                    origin_expr.left = Box::new(left.into());
                }

                if right.is_const() {
                    origin_expr.right = Box::new(right.into());
                }

                TsEnumRecordValue::Opaque(origin_expr.into())
            }
        }
    }

    fn compute_member(&self, expr: MemberExpr, _ctx: EvalCtx) -> TsEnumRecordValue {
        let opaque_expr = TsEnumRecordValue::Opaque(expr.clone().into());

        let Some(member_name) = static_enum_member_name(&expr.prop) else {
            return opaque_expr;
        };

        let Expr::Ident(ident) = *expr.obj else {
            return opaque_expr;
        };

        self.record
            .get(&TsEnumRecordKey {
                enum_id: ident.to_id(),
                member_name,
            })
            .cloned()
            .filter(TsEnumRecordValue::has_value)
            .unwrap_or(opaque_expr)
    }

    fn compute_tpl(&self, expr: Tpl, ctx: EvalCtx) -> TsEnumRecordValue {
        let opaque_expr = TsEnumRecordValue::Opaque(expr.clone().into());

        let Tpl { exprs, quasis, .. } = expr;

        let mut quasis_iter = quasis.into_iter();

        let Some(first_quasi) = quasis_iter.next() else {
            return opaque_expr;
        };
        let Some(first_cooked) = first_quasi.cooked.as_ref() else {
            return opaque_expr;
        };
        let mut string = Wtf8Buf::from(first_cooked);

        for (q, expr) in quasis_iter.zip(exprs) {
            let expr = self.compute_rec(expr, ctx);

            if !expr.push_to_string(&mut string) {
                return opaque_expr;
            }
            let Some(cooked) = q.cooked.as_ref() else {
                return opaque_expr;
            };

            string.push_wtf8(cooked);
        }

        TsEnumRecordValue::String(Wtf8Atom::from(&*string))
    }
}
