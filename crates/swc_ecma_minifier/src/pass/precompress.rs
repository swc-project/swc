//! Pre-compression pass that hoists frequently used static method calls to
//! local aliases.
//!
//! For example:
//! ```js
//! Object.assign(a, {});
//! Object.assign(b, {});
//! Object.assign(c, {});
//! ```
//!
//! Becomes:
//! ```js
//! var _ObjectAssign = Object.assign;
//! _ObjectAssign(a, {});
//! _ObjectAssign(b, {});
//! _ObjectAssign(c, {});
//! ```
//!
//! After mangling, this can result in smaller output.

use rustc_hash::FxHashMap;
use swc_atoms::Atom;
use swc_common::{util::take::Take, Mark, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_visit::{
    noop_visit_mut_type, noop_visit_type, Visit, VisitMut, VisitMutWith, VisitWith,
};

use crate::option::CompressOptions;

/// Minimum number of usages required to hoist a static method.
/// The alias costs extra bytes (`var a=Object.assign;`), so we only hoist
/// if there are enough usages to make it worthwhile.
const MIN_USAGES_TO_HOIST: usize = 2;

/// Known built-in objects and their static methods that are safe to hoist.
fn is_known_static_method(obj: &str, prop: &str) -> bool {
    match obj {
        "Object" => matches!(
            prop,
            "assign"
                | "keys"
                | "values"
                | "entries"
                | "fromEntries"
                | "freeze"
                | "seal"
                | "preventExtensions"
                | "isFrozen"
                | "isSealed"
                | "isExtensible"
                | "getOwnPropertyDescriptor"
                | "getOwnPropertyDescriptors"
                | "getOwnPropertyNames"
                | "getOwnPropertySymbols"
                | "getPrototypeOf"
                | "setPrototypeOf"
                | "create"
                | "defineProperty"
                | "defineProperties"
                | "hasOwn"
                | "is"
        ),
        "Array" => matches!(prop, "isArray" | "from" | "of"),
        "Reflect" => matches!(
            prop,
            "apply"
                | "construct"
                | "defineProperty"
                | "deleteProperty"
                | "get"
                | "getOwnPropertyDescriptor"
                | "getPrototypeOf"
                | "has"
                | "isExtensible"
                | "ownKeys"
                | "preventExtensions"
                | "set"
                | "setPrototypeOf"
        ),
        "Math" => matches!(
            prop,
            "abs"
                | "acos"
                | "acosh"
                | "asin"
                | "asinh"
                | "atan"
                | "atan2"
                | "atanh"
                | "cbrt"
                | "ceil"
                | "clz32"
                | "cos"
                | "cosh"
                | "exp"
                | "expm1"
                | "floor"
                | "fround"
                | "hypot"
                | "imul"
                | "log"
                | "log10"
                | "log1p"
                | "log2"
                | "max"
                | "min"
                | "pow"
                | "random"
                | "round"
                | "sign"
                | "sin"
                | "sinh"
                | "sqrt"
                | "tan"
                | "tanh"
                | "trunc"
        ),
        "String" => matches!(prop, "fromCharCode" | "fromCodePoint" | "raw"),
        "Number" => matches!(
            prop,
            "isFinite" | "isInteger" | "isNaN" | "isSafeInteger" | "parseFloat" | "parseInt"
        ),
        "JSON" => matches!(prop, "parse" | "stringify"),
        "Promise" => matches!(
            prop,
            "all" | "allSettled" | "any" | "race" | "reject" | "resolve" | "withResolvers"
        ),
        "Symbol" => matches!(prop, "for" | "keyFor"),
        _ => false,
    }
}

/// Key for tracking static method usage: (object_name, method_name)
type StaticMethodKey = (Atom, Atom);

/// First pass: count usages of static method calls.
struct StaticMethodCounter {
    unresolved_ctxt: SyntaxContext,
    /// Count of usages for each static method
    counts: FxHashMap<StaticMethodKey, usize>,
}

impl StaticMethodCounter {
    fn new(unresolved_mark: Mark) -> Self {
        Self {
            unresolved_ctxt: SyntaxContext::empty().apply_mark(unresolved_mark),
            counts: Default::default(),
        }
    }

    fn try_record_static_method_call(&mut self, callee: &Expr) {
        if let Some((obj, prop)) = extract_static_method(callee, self.unresolved_ctxt) {
            if is_known_static_method(&obj, &prop) {
                *self.counts.entry((obj, prop)).or_insert(0) += 1;
            }
        }
    }
}

impl Visit for StaticMethodCounter {
    noop_visit_type!();

    fn visit_call_expr(&mut self, e: &CallExpr) {
        if let Callee::Expr(callee) = &e.callee {
            self.try_record_static_method_call(callee);
        }
        e.visit_children_with(self);
    }

    fn visit_new_expr(&mut self, e: &NewExpr) {
        // For `new` expressions, we count constructor usages like `new Map()`
        // This is handled separately in the builtin constructor aliasing
        e.visit_children_with(self);
    }
}

/// Extract (object_name, method_name) from a member expression like
/// `Object.assign`.
fn extract_static_method(expr: &Expr, unresolved_ctxt: SyntaxContext) -> Option<(Atom, Atom)> {
    let member = expr.as_member()?;

    // Object must be a simple identifier (e.g., `Object`)
    let obj = member.obj.as_ident()?;

    // Must be unresolved (global)
    if obj.ctxt != unresolved_ctxt {
        return None;
    }

    // Property must be a non-computed identifier
    if member.prop.is_computed() {
        return None;
    }

    let prop = member.prop.as_ident()?;

    Some((obj.sym.clone(), prop.sym.clone()))
}

/// Second pass: replace static method calls with aliases.
struct StaticMethodReplacer {
    unresolved_ctxt: SyntaxContext,
    /// Map from static method key to the alias identifier
    aliases: FxHashMap<StaticMethodKey, Ident>,
    /// Variable declarations to prepend
    var_decls: Vec<VarDeclarator>,
}

impl StaticMethodReplacer {
    fn new(unresolved_mark: Mark, counts: FxHashMap<StaticMethodKey, usize>) -> Self {
        let unresolved_ctxt = SyntaxContext::empty().apply_mark(unresolved_mark);
        let mut aliases = FxHashMap::default();
        let mut var_decls = Vec::new();

        for ((obj, prop), count) in counts {
            if count >= MIN_USAGES_TO_HOIST {
                // Create a private name for the alias
                let alias_name: Atom = format!("_{}_{}", obj, prop).into();
                let alias_ident = Ident::new(alias_name, DUMMY_SP, SyntaxContext::empty());

                // Create the initializer: Object.assign
                let init = MemberExpr {
                    span: DUMMY_SP,
                    obj: Box::new(Ident::new(obj.clone(), DUMMY_SP, unresolved_ctxt).into()),
                    prop: MemberProp::Ident(IdentName::new(prop.clone(), DUMMY_SP)),
                };

                var_decls.push(VarDeclarator {
                    span: DUMMY_SP,
                    name: alias_ident.clone().into(),
                    init: Some(Box::new(init.into())),
                    definite: false,
                });

                aliases.insert((obj, prop), alias_ident);
            }
        }

        Self {
            unresolved_ctxt,
            aliases,
            var_decls,
        }
    }

    fn has_aliases(&self) -> bool {
        !self.aliases.is_empty()
    }

    fn take_var_decls(&mut self) -> Vec<VarDeclarator> {
        self.var_decls.take()
    }
}

impl VisitMut for StaticMethodReplacer {
    noop_visit_mut_type!();

    fn visit_mut_call_expr(&mut self, e: &mut CallExpr) {
        // Visit children first
        e.visit_mut_children_with(self);

        // Then try to replace the callee
        if let Callee::Expr(callee) = &mut e.callee {
            if let Some((obj, prop)) = extract_static_method(callee, self.unresolved_ctxt) {
                if let Some(alias) = self.aliases.get(&(obj, prop)) {
                    *callee = Box::new(alias.clone().into());
                }
            }
        }
    }
}

/// Run the precompress optimization on a program.
pub fn precompress_optimizer(
    program: &mut Program,
    options: &CompressOptions,
    unresolved_mark: Mark,
) {
    if !options.unsafe_hoist_static_method_alias {
        return;
    }

    // First pass: count static method usages
    let mut counter = StaticMethodCounter::new(unresolved_mark);
    program.visit_with(&mut counter);

    // Create replacer with aliases for frequently used methods
    let mut replacer = StaticMethodReplacer::new(unresolved_mark, counter.counts);

    if !replacer.has_aliases() {
        return;
    }

    // Second pass: replace static method calls with aliases
    program.visit_mut_with(&mut replacer);

    // Prepend variable declarations
    let var_decls = replacer.take_var_decls();
    if var_decls.is_empty() {
        return;
    }

    let var_stmt = Stmt::Decl(Decl::Var(Box::new(VarDecl {
        span: DUMMY_SP,
        kind: VarDeclKind::Var,
        declare: false,
        decls: var_decls,
        ctxt: SyntaxContext::empty(),
    })));

    match program {
        Program::Module(module) => {
            module.body.insert(0, ModuleItem::Stmt(var_stmt));
        }
        Program::Script(script) => {
            script.body.insert(0, var_stmt);
        }
    }
}
