#![allow(dead_code)]

use std::{num::FpCategory, time::Instant};

use rustc_hash::FxHashSet;
use swc_atoms::{wtf8::Wtf8Buf, Atom, Wtf8Atom};
use swc_common::{util::take::Take, Span, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::{fixer::fixer, hygiene::hygiene};
use swc_ecma_utils::{num_from_str, number::ToJsString, DropSpan, ModuleItemLike, StmtLike, Value};
use swc_ecma_visit::{noop_visit_type, visit_mut_pass, visit_obj_and_computed, Visit, VisitWith};

pub(crate) mod base54;
pub(crate) mod size;
pub(crate) mod sort;

/// Returns whether a number is falsy according to ECMAScript semantics.
#[inline]
pub(crate) fn is_falsy_number(value: f64) -> bool {
    matches!(value.classify(), FpCategory::Zero | FpCategory::Nan)
}

/// Returns a nonnumeric string from an expression that is statically known to
/// be a property name.
///
/// Only string literals, expression-free template literals, and parentheses
/// around either form are safe to treat as property names. Numeric strings are
/// intentionally excluded because they are equivalent to numeric property
/// keys, which property mangling does not rewrite.
pub(crate) fn static_property_name(expr: &Expr) -> Option<&Wtf8Atom> {
    let value = static_property_value(expr)?;

    is_non_numeric_property_name(value).then_some(value)
}

fn static_property_value(expr: &Expr) -> Option<&Wtf8Atom> {
    match expr {
        Expr::Lit(Lit::Str(string)) => Some(&string.value),
        Expr::Tpl(template) if template.exprs.is_empty() && template.quasis.len() == 1 => {
            template.quasis[0].cooked.as_ref()
        }
        Expr::Paren(paren) => static_property_value(&paren.expr),
        _ => None,
    }
}

/// Visits every nonnumeric string that can be selected as a static property
/// name by an expression.
///
/// Conditional and logical expressions can select a branch, while only the
/// final expression in a sequence is its value. Parentheses do not affect the
/// value.
pub(crate) fn for_each_static_property_name(expr: &Expr, mut visit: impl FnMut(&Wtf8Atom)) {
    fn visit_static_property_name(expr: &Expr, visit: &mut impl FnMut(&Wtf8Atom)) {
        match expr {
            Expr::Paren(paren) => visit_static_property_name(&paren.expr, visit),
            Expr::Cond(cond) => {
                visit_static_property_name(&cond.cons, visit);
                visit_static_property_name(&cond.alt, visit);
            }
            Expr::Seq(seq) => {
                if let Some(last) = seq.exprs.last() {
                    visit_static_property_name(last, visit);
                }
            }
            Expr::Bin(bin)
                if matches!(
                    bin.op,
                    BinaryOp::LogicalAnd | BinaryOp::LogicalOr | BinaryOp::NullishCoalescing
                ) =>
            {
                match logical_property_name_alternatives(bin) {
                    LogicalPropertyNameAlternatives::Left => {
                        visit_static_property_name(&bin.left, visit);
                    }
                    LogicalPropertyNameAlternatives::Right => {
                        visit_static_property_name(&bin.right, visit);
                    }
                    LogicalPropertyNameAlternatives::Both => {
                        visit_static_property_name(&bin.left, visit);
                        visit_static_property_name(&bin.right, visit);
                    }
                }
            }
            _ => {
                if let Some(name) = static_property_name(expr) {
                    visit(name);
                }
            }
        }
    }

    visit_static_property_name(expr, &mut visit);
}

/// Visits falsy static property names that can control `&&` or `||` branch
/// selection within an expression.
///
/// Property-name mangling replaces names with nonempty generated identifiers.
/// A falsy name must therefore remain unchanged when it may be evaluated as a
/// logical operation's left operand, or the operation can select a different
/// property-name alternative.
pub(crate) fn for_each_short_circuit_falsy_property_name(
    expr: &Expr,
    mut visit: impl FnMut(&Wtf8Atom),
) {
    fn visit_short_circuit_falsy_property_name(
        expr: &Expr,
        collect_static_names: bool,
        visit: &mut impl FnMut(&Wtf8Atom),
    ) {
        if collect_static_names {
            if let Some(name) = static_property_name(expr) {
                if name.is_empty() {
                    visit(name);
                }
                return;
            }
        }

        match expr {
            Expr::Paren(paren) => {
                visit_short_circuit_falsy_property_name(&paren.expr, collect_static_names, visit)
            }
            Expr::Cond(cond) => {
                visit_short_circuit_falsy_property_name(&cond.cons, collect_static_names, visit);
                visit_short_circuit_falsy_property_name(&cond.alt, collect_static_names, visit);
            }
            Expr::Seq(seq) => {
                if let Some(last) = seq.exprs.last() {
                    visit_short_circuit_falsy_property_name(last, collect_static_names, visit);
                }
            }
            Expr::Bin(bin) if matches!(bin.op, BinaryOp::LogicalAnd | BinaryOp::LogicalOr) => {
                // The left operand controls this operation's branch selection, so
                // inspect all of its static alternatives. If this whole operation
                // is itself a controlling operand, its right result is also a
                // possible controlling value.
                visit_short_circuit_falsy_property_name(&bin.left, true, visit);
                visit_short_circuit_falsy_property_name(&bin.right, collect_static_names, visit);
            }
            Expr::Bin(bin) => {
                visit_short_circuit_falsy_property_name(&bin.left, collect_static_names, visit);
                visit_short_circuit_falsy_property_name(&bin.right, collect_static_names, visit);
            }
            _ => {}
        }
    }

    visit_short_circuit_falsy_property_name(expr, false, &mut visit);
}

/// Visits the expressions that a logical operation can return as its value.
///
/// A known left-hand result selects exactly one branch. Otherwise both branches
/// can become the computed key, so each must be considered. This avoids
/// rewriting an unreachable string literal such as the empty left operand of
/// `"" || "property"`, which would change that expression's truthiness.
pub(crate) enum LogicalPropertyNameAlternatives {
    Left,
    Right,
    Both,
}

pub(crate) fn logical_property_name_alternatives(bin: &BinExpr) -> LogicalPropertyNameAlternatives {
    match bin.op {
        BinaryOp::LogicalAnd => match static_truthiness(&bin.left) {
            Some(true) => LogicalPropertyNameAlternatives::Right,
            Some(false) => LogicalPropertyNameAlternatives::Left,
            None => LogicalPropertyNameAlternatives::Both,
        },
        BinaryOp::LogicalOr => match static_truthiness(&bin.left) {
            Some(true) => LogicalPropertyNameAlternatives::Left,
            Some(false) => LogicalPropertyNameAlternatives::Right,
            None => LogicalPropertyNameAlternatives::Both,
        },
        BinaryOp::NullishCoalescing => match static_nullishness(&bin.left) {
            Some(true) => LogicalPropertyNameAlternatives::Right,
            Some(false) => LogicalPropertyNameAlternatives::Left,
            None => LogicalPropertyNameAlternatives::Both,
        },
        _ => unreachable!("logical property-name alternatives require a logical operator"),
    }
}

fn static_truthiness(expr: &Expr) -> Option<bool> {
    match expr {
        Expr::Paren(paren) => static_truthiness(&paren.expr),
        Expr::Lit(Lit::Bool(boolean)) => Some(boolean.value),
        Expr::Lit(Lit::Null(..)) => Some(false),
        Expr::Lit(Lit::Num(number)) => Some(!is_falsy_number(number.value)),
        Expr::Lit(Lit::Str(string)) => Some(!string.value.is_empty()),
        Expr::Tpl(template) if template.exprs.is_empty() && template.quasis.len() == 1 => template
            .quasis[0]
            .cooked
            .as_ref()
            .map(|value| !value.is_empty()),
        Expr::Unary(unary) if unary.op == UnaryOp::Void => Some(false),
        Expr::Unary(unary) if unary.op == UnaryOp::TypeOf => Some(true),
        _ => None,
    }
}

fn static_nullishness(expr: &Expr) -> Option<bool> {
    match expr {
        Expr::Paren(paren) => static_nullishness(&paren.expr),
        Expr::Lit(Lit::Null(..))
        | Expr::Unary(UnaryExpr {
            op: UnaryOp::Void, ..
        }) => Some(true),
        Expr::Lit(..)
        | Expr::Array(..)
        | Expr::Arrow(..)
        | Expr::Class(..)
        | Expr::Fn(..)
        | Expr::Object(..)
        | Expr::Tpl(..)
        | Expr::Unary(..) => Some(false),
        _ => None,
    }
}

/// Visits primitive property keys whose string spellings must remain stable.
///
/// Property mangling does not rewrite primitive expressions. Reserving their
/// equivalent string keys prevents a string definition from being renamed away
/// from a computed access such as `object[NaN]`.
pub(crate) fn for_each_primitive_property_name(expr: &Expr, mut visit: impl FnMut(&str)) {
    fn visit_primitive_property_name(expr: &Expr, visit: &mut impl FnMut(&str)) {
        match expr {
            Expr::Paren(paren) => visit_primitive_property_name(&paren.expr, visit),
            Expr::Cond(cond) => {
                visit_primitive_property_name(&cond.cons, visit);
                visit_primitive_property_name(&cond.alt, visit);
            }
            Expr::Seq(seq) => {
                if let Some(last) = seq.exprs.last() {
                    visit_primitive_property_name(last, visit);
                }
            }
            Expr::Bin(bin)
                if matches!(
                    bin.op,
                    BinaryOp::LogicalAnd | BinaryOp::LogicalOr | BinaryOp::NullishCoalescing
                ) =>
            {
                match logical_property_name_alternatives(bin) {
                    LogicalPropertyNameAlternatives::Left => {
                        visit_primitive_property_name(&bin.left, visit);
                    }
                    LogicalPropertyNameAlternatives::Right => {
                        visit_primitive_property_name(&bin.right, visit);
                    }
                    LogicalPropertyNameAlternatives::Both => {
                        visit_primitive_property_name(&bin.left, visit);
                        visit_primitive_property_name(&bin.right, visit);
                    }
                }
            }
            Expr::Lit(Lit::Bool(boolean)) => visit(if boolean.value { "true" } else { "false" }),
            Expr::Lit(Lit::Null(..)) => visit("null"),
            Expr::Ident(ident) => match &*ident.sym {
                "undefined" | "NaN" | "Infinity" => visit(&ident.sym),
                _ => {}
            },
            Expr::Unary(unary) => match unary.op {
                UnaryOp::Void => visit("undefined"),
                UnaryOp::TypeOf => {
                    if let Some(name) = static_typeof_property_name(&unary.arg) {
                        visit(name);
                    }
                }
                UnaryOp::Bang => match static_truthiness(&unary.arg) {
                    Some(true) => visit("false"),
                    Some(false) => visit("true"),
                    None => {
                        visit("true");
                        visit("false");
                    }
                },
                UnaryOp::Plus => {
                    if let Some(name) = static_unary_plus_property_name(&unary.arg) {
                        visit(name);
                    } else {
                        visit_primitive_property_name(&unary.arg, visit);
                    }
                }
                UnaryOp::Minus => match &*unary.arg {
                    Expr::Ident(ident) if &*ident.sym == "Infinity" => visit("-Infinity"),
                    Expr::Ident(ident) if &*ident.sym == "NaN" => visit("NaN"),
                    _ => {}
                },
                _ => {}
            },
            _ => {}
        }
    }

    visit_primitive_property_name(expr, &mut visit);
}

/// Returns the property key produced by `typeof` when the operand's type is
/// determined entirely by syntax. Dynamic identifiers and expressions remain
/// unknown so their property keys are not spuriously reserved.
fn static_typeof_property_name(expr: &Expr) -> Option<&'static str> {
    match expr {
        Expr::Paren(paren) => static_typeof_property_name(&paren.expr),
        Expr::Lit(Lit::Str(..)) | Expr::Tpl(..) => Some("string"),
        Expr::Lit(Lit::Bool(..)) => Some("boolean"),
        Expr::Lit(Lit::Num(..)) => Some("number"),
        Expr::Lit(Lit::BigInt(..)) => Some("bigint"),
        Expr::Lit(Lit::Null(..))
        | Expr::Lit(Lit::Regex(..))
        | Expr::Array(..)
        | Expr::Object(..) => Some("object"),
        Expr::Arrow(..) | Expr::Class(..) | Expr::Fn(..) => Some("function"),
        Expr::Unary(unary) => match unary.op {
            UnaryOp::Void => Some("undefined"),
            UnaryOp::Bang => Some("boolean"),
            UnaryOp::Minus | UnaryOp::Tilde => match static_typeof_property_name(&unary.arg) {
                Some("bigint") => Some("bigint"),
                Some("number") => Some("number"),
                _ => None,
            },
            UnaryOp::Plus => Some("number"),
            UnaryOp::TypeOf => Some("string"),
            UnaryOp::Delete => None,
        },
        _ => None,
    }
}

/// Returns whether all possible values of an expression are either static
/// property names or numeric keys that property mangling intentionally ignores.
pub(crate) fn is_static_or_numeric_property_key(expr: &Expr) -> bool {
    match expr {
        Expr::Paren(paren) => is_static_or_numeric_property_key(&paren.expr),
        Expr::Cond(cond) => {
            is_static_or_numeric_property_key(&cond.cons)
                && is_static_or_numeric_property_key(&cond.alt)
        }
        Expr::Seq(seq) => seq
            .exprs
            .last()
            .is_some_and(|last| is_static_or_numeric_property_key(last)),
        Expr::Lit(Lit::Num(_)) => true,
        _ => static_property_value(expr).is_some(),
    }
}

/// Returns whether a computed property key can be replaced directly after
/// property hoisting.
pub(crate) fn is_direct_property_key(expr: &Expr) -> bool {
    matches!(expr, Expr::Lit(Lit::Str(_) | Lit::Num(_)))
}

/// Returns whether a string property name is not equivalent to a numeric key.
pub(crate) fn is_non_numeric_property_name(value: &Wtf8Atom) -> bool {
    !is_numeric_property_name(value)
}

fn unparenthesized_expr(mut expr: &Expr) -> &Expr {
    while let Expr::Paren(paren) = expr {
        expr = &paren.expr;
    }
    expr
}

/// Returns whether a string is the canonical property key for an ECMAScript
/// numeric or BigInt literal.
///
/// Comparing the parsed number's ECMAScript spelling avoids treating Rust-only
/// spellings such as `infinity` and `nan` as numeric keys, and keeps distinct
/// property names like `"01"` and `"1.0"` eligible for mangling. Canonical
/// decimal BigInt spellings are checked separately because values beyond `f64`
/// precision still address their decimal string property keys.
fn is_numeric_property_name(value: &Wtf8Atom) -> bool {
    value.as_str().is_some_and(|value| {
        value
            .parse::<f64>()
            .is_ok_and(|number| number.is_finite() && number.to_js_string() == value)
            || is_canonical_bigint_property_name(value)
    })
}

fn is_canonical_bigint_property_name(value: &str) -> bool {
    let digits = value.strip_prefix('-').unwrap_or(value);

    digits == "0"
        || matches!(digits.as_bytes().first(), Some(b'1'..=b'9'))
            && digits.as_bytes()[1..].iter().all(u8::is_ascii_digit)
}

/// Returns a nonnumeric static string property name produced by the safe
/// string-concatenation folding performed before property mangling.
///
/// This is used only while collecting quoted names before compression. The
/// mangle-only path intentionally does not treat additions as rewritable
/// property keys.
pub(crate) fn folded_static_property_name(expr: &Expr) -> Option<Wtf8Atom> {
    fn append(expr: &Expr, result: &mut Wtf8Buf) -> Option<()> {
        match expr {
            Expr::Paren(paren) => append(&paren.expr, result),
            Expr::Bin(bin) if bin.op == BinaryOp::Add => {
                append(&bin.left, result)?;
                append(&bin.right, result)
            }
            Expr::Tpl(template) => {
                let mut quasis = template.quasis.iter();
                result.push_wtf8(quasis.next()?.cooked.as_ref()?);

                for (expr, quasi) in template.exprs.iter().zip(quasis) {
                    result.push_wtf8(static_property_value(expr)?);
                    result.push_wtf8(quasi.cooked.as_ref()?);
                }

                Some(())
            }
            _ => {
                result.push_wtf8(static_property_value(expr)?);
                Some(())
            }
        }
    }

    let mut value = Wtf8Buf::new();
    append(expr, &mut value)?;
    let value: Wtf8Atom = value.into();
    is_non_numeric_property_name(&value).then_some(value)
}

/// Returns the primitive property key produced by a statically coercible unary
/// plus expression. BigInt operands are excluded because unary plus throws.
fn static_unary_plus_property_name(expr: &Expr) -> Option<&'static str> {
    let value = match unparenthesized_expr(expr) {
        Expr::Lit(Lit::Bool(boolean)) => {
            if boolean.value {
                1.0
            } else {
                0.0
            }
        }
        Expr::Lit(Lit::Null(..)) => 0.0,
        Expr::Lit(Lit::Num(number)) => number.value,
        Expr::Lit(Lit::Str(string)) => {
            let value = string.value.as_str()?;
            match num_from_str(value) {
                Value::Known(value) => value,
                Value::Unknown => return None,
            }
        }
        Expr::Unary(unary) if unary.op == UnaryOp::Void => f64::NAN,
        _ => return None,
    };

    match value {
        value if value.is_nan() => Some("NaN"),
        value if value == f64::INFINITY => Some("Infinity"),
        value if value == f64::NEG_INFINITY => Some("-Infinity"),
        _ => None,
    }
}

pub(crate) fn make_number(span: Span, value: f64) -> Expr {
    trace_op!("Creating a numeric literal");
    Lit::Num(Number {
        span,
        value,
        raw: None,
    })
    .into()
}

pub trait ModuleItemExt:
    StmtLike + ModuleItemLike + From<Stmt> + Spanned + std::fmt::Debug
{
    fn as_module_decl(&self) -> Result<&ModuleDecl, &Stmt>;

    fn as_module_decl_mut(&mut self) -> Result<&mut ModuleDecl, &mut Stmt>;

    fn from_module_item(item: ModuleItem) -> Self;

    fn into_module_item(self) -> ModuleItem {
        match self.into_module_decl() {
            Ok(v) => v.into(),
            Err(v) => v.into(),
        }
    }

    fn into_module_decl(self) -> Result<ModuleDecl, Stmt>;
}

impl ModuleItemExt for Stmt {
    fn as_module_decl(&self) -> Result<&ModuleDecl, &Stmt> {
        Err(self)
    }

    fn as_module_decl_mut(&mut self) -> Result<&mut ModuleDecl, &mut Stmt> {
        Err(self)
    }

    fn from_module_item(item: ModuleItem) -> Self {
        item.expect_stmt()
    }

    fn into_module_decl(self) -> Result<ModuleDecl, Stmt> {
        Err(self)
    }
}

impl ModuleItemExt for ModuleItem {
    fn as_module_decl(&self) -> Result<&ModuleDecl, &Stmt> {
        match self {
            ModuleItem::ModuleDecl(v) => Ok(v),
            ModuleItem::Stmt(v) => Err(v),
            #[cfg(swc_ast_unknown)]
            _ => panic!("unable to access unknown nodes"),
        }
    }

    fn as_module_decl_mut(&mut self) -> Result<&mut ModuleDecl, &mut Stmt> {
        match self {
            ModuleItem::ModuleDecl(v) => Ok(v),
            ModuleItem::Stmt(v) => Err(v),
            #[cfg(swc_ast_unknown)]
            _ => panic!("unable to access unknown nodes"),
        }
    }

    fn from_module_item(item: ModuleItem) -> Self {
        item
    }

    fn into_module_decl(self) -> Result<ModuleDecl, Stmt> {
        match self {
            ModuleItem::ModuleDecl(v) => Ok(v),
            ModuleItem::Stmt(v) => Err(v),
            #[cfg(swc_ast_unknown)]
            _ => panic!("unable to access unknown nodes"),
        }
    }
}

///
/// - `!0` for true
/// - `!1` for false
pub(crate) fn make_bool(span: Span, value: bool) -> Expr {
    trace_op!("Creating a boolean literal");

    UnaryExpr {
        span,
        op: op!("!"),
        arg: Lit::Num(Number {
            span: DUMMY_SP,
            value: if value { 0.0 } else { 1.0 },
            raw: None,
        })
        .into(),
    }
    .into()
}

/// Additional methods for optimizing expressions.
pub(crate) trait ExprOptExt: Sized {
    fn as_expr(&self) -> &Expr;
    fn as_mut(&mut self) -> &mut Expr;

    fn first_expr_mut(&mut self) -> &mut Expr {
        let expr = self.as_mut();
        match expr {
            Expr::Seq(seq) => seq
                .exprs
                .first_mut()
                .expect("Sequence expressions should have at least one element")
                .first_expr_mut(),
            expr => expr,
        }
    }

    /// This returns itself for normal expressions and returns last expressions
    /// for sequence expressions.
    fn value_mut(&mut self) -> &mut Expr {
        let expr = self.as_mut();
        match expr {
            Expr::Seq(seq) => seq
                .exprs
                .last_mut()
                .expect("Sequence expressions should have at least one element")
                .value_mut(),
            expr => expr,
        }
    }

    fn force_seq(&mut self) -> &mut SeqExpr {
        let expr = self.as_mut();
        match expr {
            Expr::Seq(seq) => seq,
            _ => {
                let inner = expr.take();
                *expr = SeqExpr {
                    span: DUMMY_SP,
                    exprs: vec![Box::new(inner)],
                }
                .into();
                expr.force_seq()
            }
        }
    }

    fn prepend_exprs(&mut self, mut exprs: Vec<Box<Expr>>) {
        if exprs.is_empty() {
            return;
        }

        let to = self.as_mut();
        match to {
            Expr::Seq(to) => {
                exprs.append(&mut to.exprs);
                to.exprs = exprs;
            }
            _ => {
                let v = to.take();
                exprs.push(Box::new(v));
                *to = SeqExpr {
                    span: DUMMY_SP,
                    exprs,
                }
                .into();
            }
        }
    }
}

impl ExprOptExt for Box<Expr> {
    fn as_expr(&self) -> &Expr {
        self
    }

    fn as_mut(&mut self) -> &mut Expr {
        self
    }
}

impl ExprOptExt for Expr {
    fn as_expr(&self) -> &Expr {
        self
    }

    fn as_mut(&mut self) -> &mut Expr {
        self
    }
}

pub(crate) fn contains_leaping_continue_with_label<N>(n: &N, label: Atom) -> bool
where
    N: VisitWith<LeapFinder>,
{
    let mut v = LeapFinder {
        target_label: Some(label),
        ..Default::default()
    };
    n.visit_with(&mut v);
    v.found_continue_with_label
}

#[allow(unused)]
pub(crate) fn contains_leaping_yield<N>(n: &N) -> bool
where
    N: VisitWith<LeapFinder>,
{
    let mut v = LeapFinder::default();
    n.visit_with(&mut v);
    v.found_yield
}

#[derive(Default)]
pub(crate) struct LeapFinder {
    found_await: bool,
    found_yield: bool,
    found_continue_with_label: bool,
    target_label: Option<Atom>,
}

impl Visit for LeapFinder {
    noop_visit_type!(fail);

    fn visit_await_expr(&mut self, n: &AwaitExpr) {
        n.visit_children_with(self);

        self.found_await = true;
    }

    fn visit_arrow_expr(&mut self, _: &ArrowExpr) {}

    fn visit_class_method(&mut self, _: &ClassMethod) {}

    fn visit_constructor(&mut self, _: &Constructor) {}

    fn visit_continue_stmt(&mut self, n: &ContinueStmt) {
        n.visit_children_with(self);

        if let Some(label) = &n.label {
            self.found_continue_with_label |=
                self.target_label.as_ref().is_some_and(|l| *l == label.sym);
        }
    }

    fn visit_function(&mut self, _: &Function) {}

    fn visit_yield_expr(&mut self, n: &YieldExpr) {
        n.visit_children_with(self);

        self.found_yield = true;
    }
}

/// This method returns true only if `T` is `var`. (Not `const` or `let`)
pub(crate) fn is_hoisted_var_decl_without_init<T>(t: &T) -> bool
where
    T: StmtLike,
{
    let var = match t.as_stmt() {
        Some(Stmt::Decl(Decl::Var(v)))
            if matches!(
                &**v,
                VarDecl {
                    kind: VarDeclKind::Var,
                    ..
                }
            ) =>
        {
            v
        }
        _ => return false,
    };
    var.decls.iter().all(|decl| decl.init.is_none())
}

pub(crate) trait IsModuleItem {
    fn is_module_item() -> bool;
}

impl IsModuleItem for Stmt {
    fn is_module_item() -> bool {
        false
    }
}

impl IsModuleItem for ModuleItem {
    fn is_module_item() -> bool {
        true
    }
}

pub trait ValueExt<T>: Into<Value<T>> {
    fn opt(self) -> Option<T> {
        match self.into() {
            Value::Known(v) => Some(v),
            _ => None,
        }
    }
}

impl<T> ValueExt<T> for Value<T> {}

pub struct DeepThisExprVisitor {
    found: bool,
}

impl Visit for DeepThisExprVisitor {
    noop_visit_type!(fail);

    fn visit_this_expr(&mut self, _: &ThisExpr) {
        self.found = true;
    }
}

pub fn deeply_contains_this_expr<N>(body: &N) -> bool
where
    N: VisitWith<DeepThisExprVisitor>,
{
    let mut visitor = DeepThisExprVisitor { found: false };
    body.visit_with(&mut visitor);
    visitor.found
}

#[derive(Default)]
pub(crate) struct IdentUsageCollector {
    ids: FxHashSet<Id>,
    ignore_nested: bool,
}

impl Visit for IdentUsageCollector {
    noop_visit_type!(fail);

    visit_obj_and_computed!();

    fn visit_expr(&mut self, n: &Expr) {
        if let Expr::Ident(i) = n {
            self.ids.insert(i.to_id());
            return;
        }

        n.visit_children_with(self);
    }

    fn visit_arrow_function_body(&mut self, n: &ArrowFunctionBody) {
        if self.ignore_nested {
            return;
        }

        n.visit_children_with(self);
    }

    fn visit_constructor(&mut self, n: &Constructor) {
        if self.ignore_nested {
            return;
        }

        n.visit_children_with(self);
    }

    fn visit_function(&mut self, n: &Function) {
        if self.ignore_nested {
            return;
        }

        n.visit_children_with(self);
    }

    fn visit_ident(&mut self, n: &Ident) {
        self.ids.insert(n.to_id());
    }

    fn visit_prop_name(&mut self, n: &PropName) {
        if let PropName::Computed(..) = n {
            n.visit_children_with(self);
        }
    }
}

#[derive(Default)]
pub(crate) struct CapturedIdCollector {
    ids: FxHashSet<Id>,
    is_nested: bool,
}

impl Visit for CapturedIdCollector {
    noop_visit_type!(fail);

    visit_obj_and_computed!();

    fn visit_expr(&mut self, n: &Expr) {
        if let Expr::Ident(i) = n {
            if self.is_nested {
                self.ids.insert(i.to_id());
            }
            return;
        }

        n.visit_children_with(self);
    }

    fn visit_arrow_function_body(&mut self, n: &ArrowFunctionBody) {
        let old = self.is_nested;
        self.is_nested = true;
        n.visit_children_with(self);
        self.is_nested = old;
    }

    fn visit_constructor(&mut self, n: &Constructor) {
        let old = self.is_nested;
        self.is_nested = true;
        n.visit_children_with(self);
        self.is_nested = old;
    }

    fn visit_function(&mut self, n: &Function) {
        let old = self.is_nested;
        self.is_nested = true;
        n.visit_children_with(self);
        self.is_nested = old;
    }

    fn visit_ident(&mut self, n: &Ident) {
        if self.is_nested {
            self.ids.insert(n.to_id());
        }
    }

    fn visit_prop_name(&mut self, n: &PropName) {
        if let PropName::Computed(..) = n {
            n.visit_children_with(self);
        }
    }
}

pub(crate) fn idents_captured_by<N>(n: &N) -> FxHashSet<Id>
where
    N: VisitWith<CapturedIdCollector>,
{
    let mut v = CapturedIdCollector {
        is_nested: false,
        ..Default::default()
    };
    n.visit_with(&mut v);
    v.ids
}

pub(crate) fn idents_used_by<N>(n: &N) -> FxHashSet<Id>
where
    N: VisitWith<IdentUsageCollector>,
{
    let mut v = IdentUsageCollector {
        ignore_nested: false,
        ..Default::default()
    };
    n.visit_with(&mut v);
    v.ids
}

pub(crate) fn idents_used_by_ignoring_nested<N>(n: &N) -> FxHashSet<Id>
where
    N: VisitWith<IdentUsageCollector>,
{
    let mut v = IdentUsageCollector {
        ignore_nested: true,
        ..Default::default()
    };
    n.visit_with(&mut v);
    v.ids
}

pub fn now() -> Option<Instant> {
    #[cfg(target_arch = "wasm32")]
    {
        None
    }
    #[cfg(not(target_arch = "wasm32"))]
    {
        Some(Instant::now())
    }
}

#[allow(unused)]
pub(crate) fn dump_program(p: &Program) -> String {
    #[cfg(feature = "debug")]
    {
        force_dump_program(p)
    }
    #[cfg(not(feature = "debug"))]
    {
        String::new()
    }
}

pub(crate) fn force_dump_program(p: &Program) -> String {
    let _noop_sub = tracing::subscriber::set_default(tracing::subscriber::NoSubscriber::default());

    crate::debug::dump(
        &p.clone()
            .apply(fixer(None))
            .apply(hygiene())
            .apply(visit_mut_pass(DropSpan {})),
        true,
    )
}

#[cfg(feature = "concurrent")]
#[macro_export(local_inner_macros)]
#[allow(clippy::crate_in_macro_def)]
macro_rules! maybe_par {
  ($prefix:ident.$name:ident.iter().$operator:ident($($rest:expr)*), $threshold:expr) => {
      if $prefix.$name.len() >= $threshold {
          use par_iter::prelude::*;
          $prefix.$name.par_iter().$operator($($rest)*)
      } else {
          $prefix.$name.iter().$operator($($rest)*)
      }
  };

  ($prefix:ident.$name:ident.into_iter().$operator:ident($($rest:expr)*), $threshold:expr) => {
      if $prefix.$name.len() >= $threshold {
          use par_iter::prelude::*;
          $prefix.$name.into_par_iter().$operator($($rest)*)
      } else {
          $prefix.$name.into_iter().$operator($($rest)*)
      }
  };

  ($name:ident.iter().$operator:ident($($rest:expr)*), $threshold:expr) => {
      if $name.len() >= $threshold {
          use par_iter::prelude::*;
          $name.par_iter().$operator($($rest)*)
      } else {
          $name.iter().$operator($($rest)*)
      }
  };

  ($name:ident.into_iter().$operator:ident($($rest:expr)*), $threshold:expr) => {
      if $name.len() >= $threshold {
          use par_iter::prelude::*;
          $name.into_par_iter().$operator($($rest)*)
      } else {
          $name.into_iter().$operator($($rest)*)
      }
  };

  ($name:ident.iter_mut().$operator:ident($($rest:expr)*), $threshold:expr) => {
      if $name.len() >= $threshold {
          use par_iter::prelude::*;
          $name.par_iter_mut().$operator($($rest)*)
      } else {
          $name.iter_mut().$operator($($rest)*)
      }
  };

  ($name:ident.iter().$operator:ident($($rest:expr)*).$operator2:ident($($rest2:expr)*), $threshold:expr) => {
      if $name.len() >= $threshold {
          use par_iter::prelude::*;
          $name.par_iter().$operator($($rest)*).$operator2($($rest2)*)
      } else {
          $name.iter().$operator($($rest)*).$operator2($($rest2)*)
      }
  };

  ($name:ident.into_iter().$operator:ident($($rest:expr)*).$operator2:ident($($rest2:expr)*), $threshold:expr) => {
      if $name.len() >= $threshold {
          use par_iter::prelude::*;
          $name.into_par_iter().$operator($($rest)*).$operator2($($rest2)*)
      } else {
          $name.into_iter().$operator($($rest)*).$operator2($($rest2)*)
      }
  };

  ($name:ident.iter_mut().$operator:ident($($rest:expr)*).$operator2:ident($($rest2:expr)*), $threshold:expr) => {
      if $name.len() >= $threshold {
          use par_iter::prelude::*;
          $name.par_iter_mut().$operator($($rest)*).$operator2($($rest2)*)
      } else {
          $name.iter_mut().$operator($($rest)*).$operator2($($rest2)*)
      }
  };

  ($name:ident.iter().$operator:ident($($rest:expr)*).$operator2:ident::<$t:ty>($($rest2:expr)*), $threshold:expr) => {
      if $name.len() >= $threshold {
          use par_iter::prelude::*;
          $name.par_iter().$operator($($rest)*).$operator2::<$t>($($rest2)*)
      } else {
          $name.iter().$operator($($rest)*).$operator2::<$t>($($rest2)*)
      }
  };

  ($name:ident.iter().$operator:ident($($rest:expr)*).$operator2:ident($($rest2:expr)*).$operator3:ident($($rest3:expr)*), $threshold:expr) => {
      if $name.len() >= $threshold {
          use par_iter::prelude::*;
          $name.par_iter().$operator($($rest)*).$operator2($($rest2)*).$operator3($($rest3)*)
      } else {
          $name.iter().$operator($($rest)*).$operator2($($rest2)*).$operator3($($rest3)*)
      }
  };
}

#[cfg(not(feature = "concurrent"))]
#[macro_export(local_inner_macros)]
#[allow(clippy::crate_in_macro_def)]
macro_rules! maybe_par {
  ($prefix:ident.$name:ident.iter().$operator:ident($($rest:expr)*), $threshold:expr) => {
    $prefix.$name.iter().$operator($($rest)*)
  };

  ($prefix:ident.$name:ident.into_iter().$operator:ident($($rest:expr)*), $threshold:expr) => {
    $prefix.$name.into_iter().$operator($($rest)*)
  };

  ($name:ident.iter().$operator:ident($($rest:expr)*), $threshold:expr) => {
    $name.iter().$operator($($rest)*)
  };

  ($name:ident.into_iter().$operator:ident($($rest:expr)*), $threshold:expr) => {
    $name.into_iter().$operator($($rest)*)
  };

  ($name:ident.iter_mut().$operator:ident($($rest:expr)*), $threshold:expr) => {
    $name.iter_mut().$operator($($rest)*)
  };

  ($name:ident.iter().$operator:ident($($rest:expr)*).$operator2:ident($($rest2:expr)*), $threshold:expr) => {
    $name.iter().$operator($($rest)*).$operator2($($rest2)*)
  };

  ($name:ident.into_iter().$operator:ident($($rest:expr)*).$operator2:ident($($rest2:expr)*), $threshold:expr) => {
    $name.into_iter().$operator($($rest)*).$operator2($($rest2)*)
  };

  ($name:ident.iter_mut().$operator:ident($($rest:expr)*).$operator2:ident($($rest2:expr)*), $threshold:expr) => {
    $name.iter_mut().$operator($($rest)*).$operator2($($rest2)*)
  };

  ($name:ident.iter().$operator:ident($($rest:expr)*).$operator2:ident::<$t:ty>($($rest2:expr)*), $threshold:expr) => {
    $name.iter().$operator($($rest)*).$operator2::<$t>($($rest2)*)
  };

  ($name:ident.iter().$operator:ident($($rest:expr)*).$operator2:ident($($rest2:expr)*).$operator3:ident($($rest3:expr)*), $threshold:expr) => {
    $name.iter().$operator($($rest)*).$operator2($($rest2)*).$operator3($($rest3)*)
  };
}
