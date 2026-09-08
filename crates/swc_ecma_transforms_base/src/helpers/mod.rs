use std::cell::RefCell;

use swc_atoms::atom;
use swc_common::{Mark, SyntaxContext, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_utils::{prepend_stmts, quote_ident, DropSpan, ExprFactory};
use swc_ecma_visit::{noop_visit_mut_type, visit_mut_pass, VisitMut, VisitMutWith};

#[doc(hidden)]
pub mod generated;

use generated::{HelperBitmap, HelperName};

#[macro_export]
macro_rules! enable_helper {
    ($i:ident) => {{
        $crate::helpers::HELPERS.with(|helpers| {
            let helper = $crate::helpers::generated::HelperName::$i;
            helpers.enable(helper);
            helpers.mark()
        })
    }};
}

#[cfg(feature = "inline-helpers")]
fn parse(code: &str, path: &str) -> Vec<Stmt> {
    let cm = swc_common::SourceMap::default();

    let fm = cm.new_source_file(
        swc_common::FileName::Custom(path.into()).into(),
        code.to_string(),
    );
    swc_ecma_parser::parse_file_as_script(
        &fm,
        Default::default(),
        Default::default(),
        None,
        &mut Vec::new(),
    )
    .map(|mut script| {
        script.body.visit_mut_with(&mut DropSpan);
        script.body
    })
    .map_err(|e| {
        unreachable!("Error occurred while parsing error: {:?}", e);
    })
    .unwrap()
}

better_scoped_tls::scoped_tls!(
    /// This variable is used to manage helper scripts like `_inherits` from babel.
    ///
    /// The instance contains flags where each flag denotes if a helper script should be injected.
    pub static HELPERS: Helpers
);

/// Tracks used helper methods. (e.g. __extends)
#[derive(Debug, Default)]
pub struct Helpers {
    external: bool,
    mark: HelperMark,
    inner: RefCell<Inner>,
}

#[derive(Debug, Clone, Copy)]
pub struct HelperData {
    external: bool,
    mark: HelperMark,
    inner: Inner,
}

impl Helpers {
    pub fn new(external: bool) -> Self {
        Helpers {
            external,
            mark: Default::default(),
            inner: Default::default(),
        }
    }

    pub const fn mark(&self) -> Mark {
        self.mark.0
    }

    pub const fn external(&self) -> bool {
        self.external
    }

    pub fn data(&self) -> HelperData {
        HelperData {
            inner: *self.inner.borrow(),
            external: self.external,
            mark: self.mark,
        }
    }

    pub fn from_data(data: HelperData) -> Self {
        Helpers {
            external: data.external,
            mark: data.mark,
            inner: RefCell::new(data.inner),
        }
    }
}

#[derive(Debug, Clone, Copy)]
struct HelperMark(Mark);
impl Default for HelperMark {
    fn default() -> Self {
        HelperMark(Mark::new())
    }
}

#[derive(Debug, Clone, Copy, Default)]
struct Inner {
    used: HelperBitmap,
}

impl Inner {
    fn enable(&mut self, name: HelperName) {
        self.used.insert(name);
    }

    fn extend_from(&mut self, other: &Self) {
        self.used |= other.used;
    }

    fn is_enabled(&self, name: HelperName) -> bool {
        self.used.contains(name)
    }

    fn any(&self) -> bool {
        !self.used.is_empty()
    }
}

impl Helpers {
    #[doc(hidden)]
    pub fn enable(&self, name: HelperName) {
        self.inner.borrow_mut().enable(name);
    }

    pub fn extend_from(&self, other: &Self) {
        let other = other.inner.borrow();
        let mut me = self.inner.borrow_mut();

        me.extend_from(&other);
    }
}

pub fn inject_helpers(global_mark: Mark) -> impl Pass + VisitMut {
    visit_mut_pass(InjectHelpers {
        global_mark,
        helper_ctxt: None,
    })
}

struct InjectHelpers {
    global_mark: Mark,
    helper_ctxt: Option<SyntaxContext>,
}

impl InjectHelpers {
    fn is_helper_used(&self) -> bool {
        HELPERS.with(|helpers| helpers.inner.borrow().any())
    }

    #[cfg(feature = "inline-helpers")]
    fn build_helpers(&self) -> Vec<Stmt> {
        let (required, mark) = HELPERS.with(|helpers| {
            let inner = helpers.inner.borrow();
            let mut required = HelperBitmap::EMPTY;

            for helper in generated::ALL {
                if inner.is_enabled(helper.name) {
                    required |= helper.deps;
                }
            }

            (required, helpers.mark.0)
        });

        let base = SyntaxContext::empty().apply_mark(mark);
        let mut buf = Vec::new();

        for helper in generated::ALL {
            if required.contains(helper.name) {
                buf.extend(
                    generated::stmts(helper.name)
                        .iter()
                        .cloned()
                        .map(|mut stmt| {
                            stmt.visit_mut_with(&mut Marker {
                                base,
                                decls: Default::default(),
                                decl_ctxt: SyntaxContext::empty().apply_mark(Mark::new()),
                            });
                            stmt
                        }),
                );
            }
        }

        buf
    }

    fn build_imports(&self) -> Vec<ModuleItem> {
        let mut buf = Vec::new();

        HELPERS.with(|helpers| {
            let inner = helpers.inner.borrow();
            let ctxt = SyntaxContext::empty().apply_mark(helpers.mark.0);

            for helper in generated::ALL {
                if inner.is_enabled(helper.name) {
                    let specifier = ImportSpecifier::Named(ImportNamedSpecifier {
                        span: DUMMY_SP,
                        local: Ident::new(helper.local.into(), DUMMY_SP, ctxt),
                        imported: Some(quote_ident!("_").into()),
                        is_type_only: false,
                    });

                    buf.push(ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl {
                        span: DUMMY_SP,
                        specifiers: vec![specifier],
                        src: Box::new(Str::from(helper.import_path)),
                        with: Default::default(),
                        type_only: Default::default(),
                        phase: Default::default(),
                    })));
                }
            }
        });

        buf
    }

    fn build_requires(&self) -> Vec<Stmt> {
        let mut buf = Vec::new();

        HELPERS.with(|helpers| {
            let inner = helpers.inner.borrow();

            for helper in generated::ALL {
                if inner.is_enabled(helper.name) {
                    buf.push(self.build_reqire(helper, helpers.mark.0));
                }
            }
        });

        buf
    }

    #[allow(unused_variables)]
    fn make_helpers_for_module(&mut self) -> Vec<ModuleItem> {
        let (helper_mark, external) = HELPERS.with(|helper| (helper.mark(), helper.external()));

        #[cfg(feature = "inline-helpers")]
        if !external {
            return self
                .build_helpers()
                .into_iter()
                .map(ModuleItem::Stmt)
                .collect();
        }

        if self.is_helper_used() {
            self.helper_ctxt = Some(SyntaxContext::empty().apply_mark(helper_mark));
            self.build_imports()
        } else {
            Vec::new()
        }
    }

    #[allow(unused_variables)]
    fn make_helpers_for_script(&mut self) -> Vec<Stmt> {
        let (helper_mark, external) = HELPERS.with(|helper| (helper.mark(), helper.external()));

        #[cfg(feature = "inline-helpers")]
        if !external {
            return self.build_helpers();
        }

        if self.is_helper_used() {
            self.helper_ctxt = Some(SyntaxContext::empty().apply_mark(helper_mark));
            self.build_requires()
        } else {
            Default::default()
        }
    }

    fn build_reqire(&self, helper: &generated::HelperDef, mark: Mark) -> Stmt {
        let c = CallExpr {
            span: DUMMY_SP,
            callee: Expr::from(Ident {
                span: DUMMY_SP,
                ctxt: SyntaxContext::empty().apply_mark(self.global_mark),
                sym: atom!("require"),
                ..Default::default()
            })
            .as_callee(),
            args: vec![Str {
                span: DUMMY_SP,
                value: helper.import_path.into(),
                raw: None,
            }
            .as_arg()],
            ..Default::default()
        };
        let ctxt = SyntaxContext::empty().apply_mark(mark);
        VarDecl {
            kind: VarDeclKind::Var,
            decls: vec![VarDeclarator {
                span: DUMMY_SP,
                name: Pat::Ident(Ident::new(helper.local.into(), DUMMY_SP, ctxt).into()),
                init: Some(c.into()),
                definite: false,
            }],
            ..Default::default()
        }
        .into()
    }

    fn map_helper_ref_ident(&mut self, ref_ident: &Ident) -> Option<Expr> {
        self.helper_ctxt
            .filter(|ctxt| ctxt == &ref_ident.ctxt)
            .map(|_| {
                let ident = ref_ident.clone().without_loc();

                MemberExpr {
                    span: ref_ident.span,
                    obj: Box::new(ident.into()),
                    prop: MemberProp::Ident(atom!("_").into()),
                }
                .into()
            })
    }
}

impl VisitMut for InjectHelpers {
    noop_visit_mut_type!();

    fn visit_mut_module(&mut self, module: &mut Module) {
        let helpers = self.make_helpers_for_module();

        prepend_stmts(&mut module.body, helpers.into_iter());
    }

    fn visit_mut_script(&mut self, script: &mut Script) {
        let helpers = self.make_helpers_for_script();
        let helpers_is_empty = helpers.is_empty();

        prepend_stmts(&mut script.body, helpers.into_iter());

        if !helpers_is_empty {
            script.visit_mut_children_with(self);
        }
    }

    fn visit_mut_expr(&mut self, n: &mut Expr) {
        match n {
            Expr::Ident(ref_ident) => {
                if let Some(expr) = self.map_helper_ref_ident(ref_ident) {
                    *n = expr;
                }
            }

            _ => n.visit_mut_children_with(self),
        };
    }
}

#[cfg(feature = "inline-helpers")]
struct Marker {
    base: SyntaxContext,
    decls: rustc_hash::FxHashMap<swc_atoms::Atom, SyntaxContext>,

    decl_ctxt: SyntaxContext,
}

#[cfg(feature = "inline-helpers")]
impl VisitMut for Marker {
    noop_visit_mut_type!();

    fn visit_mut_fn_decl(&mut self, n: &mut FnDecl) {
        let old_decl_ctxt = std::mem::replace(
            &mut self.decl_ctxt,
            SyntaxContext::empty().apply_mark(Mark::new()),
        );
        let old_decls = self.decls.clone();

        n.visit_mut_children_with(self);

        self.decls = old_decls;
        self.decl_ctxt = old_decl_ctxt;
    }

    fn visit_mut_fn_expr(&mut self, n: &mut FnExpr) {
        let old_decl_ctxt = std::mem::replace(
            &mut self.decl_ctxt,
            SyntaxContext::empty().apply_mark(Mark::new()),
        );
        let old_decls = self.decls.clone();

        n.visit_mut_children_with(self);

        self.decls = old_decls;
        self.decl_ctxt = old_decl_ctxt;
    }

    fn visit_mut_ident(&mut self, i: &mut Ident) {
        i.ctxt = self.decls.get(&i.sym).copied().unwrap_or(self.base);
    }

    fn visit_mut_member_prop(&mut self, p: &mut MemberProp) {
        if let MemberProp::Computed(p) = p {
            p.visit_mut_with(self);
        }
    }

    fn visit_mut_param(&mut self, n: &mut Param) {
        if let Pat::Ident(i) = &n.pat {
            self.decls.insert(i.sym.clone(), self.decl_ctxt);
        }

        n.visit_mut_children_with(self);
    }

    fn visit_mut_prop_name(&mut self, n: &mut PropName) {
        if let PropName::Computed(e) = n {
            e.visit_mut_with(self);
        }
    }

    fn visit_mut_super_prop(&mut self, p: &mut SuperProp) {
        if let SuperProp::Computed(p) = p {
            p.visit_mut_with(self);
        }
    }

    fn visit_mut_var_declarator(&mut self, v: &mut VarDeclarator) {
        if let Pat::Ident(i) = &mut v.name {
            if &*i.sym == "id" || &*i.sym == "resource" {
                i.ctxt = self.base;
                self.decls.insert(i.sym.clone(), self.base);
                return;
            }

            if !(i.sym.starts_with("__") && i.sym.starts_with("_ts_")) {
                self.decls.insert(i.sym.clone(), self.decl_ctxt);
            }
        }

        v.visit_mut_children_with(self);
    }
}

#[cfg(test)]
mod tests {
    use testing::DebugUsingDisplay;

    use super::*;

    #[test]
    fn external_helper() {
        let input = "_throw()";
        crate::tests::Tester::run(|tester| {
            HELPERS.set(&Helpers::new(true), || {
                let expected = tester.apply_transform(
                    DropSpan,
                    "output.js",
                    Default::default(),
                    "import { _ as _throw } from \"@swc/helpers/_/_throw\";
_throw();",
                )?;
                enable_helper!(throw);

                eprintln!("----- Actual -----");

                let tr = inject_helpers(Mark::new());
                let actual = tester
                    .apply_transform(tr, "input.js", Default::default(), input)?
                    .apply(crate::hygiene::hygiene())
                    .apply(crate::fixer::fixer(None));

                if actual == expected {
                    return Ok(());
                }

                let (actual_src, expected_src) = (tester.print(&actual), tester.print(&expected));

                if actual_src == expected_src {
                    return Ok(());
                }

                println!(">>>>> Orig <<<<<\n{input}");
                println!(">>>>> Code <<<<<\n{actual_src}");
                assert_eq!(
                    DebugUsingDisplay(&actual_src),
                    DebugUsingDisplay(&expected_src)
                );
                Err(())
            })
        });
    }

    #[test]
    #[cfg(feature = "inline-helpers")]
    fn use_strict_before_helper() {
        crate::tests::test_transform(
            Default::default(),
            |_| {
                enable_helper!(throw);
                inject_helpers(Mark::new())
            },
            "'use strict'",
            "'use strict'
function _throw(e) {
    throw e;
}
",
            false,
            Default::default,
        )
    }

    #[test]
    #[cfg(feature = "inline-helpers")]
    fn name_conflict() {
        crate::tests::test_transform(
            Default::default(),
            |_| {
                enable_helper!(throw);
                inject_helpers(Mark::new())
            },
            "let _throw = null",
            "function _throw(e) {
    throw e;
}
let _throw1 = null;
",
            false,
            Default::default,
        )
    }

    #[test]
    #[cfg(feature = "inline-helpers")]
    fn inline_helper_dependencies() {
        let input = "_to_consumable_array(foo);";
        crate::tests::Tester::run(|tester| {
            HELPERS.set(&Helpers::new(false), || {
                enable_helper!(to_consumable_array);

                let tr = inject_helpers(Mark::new());
                let actual = tester
                    .apply_transform(tr, "input.js", Default::default(), input)?
                    .apply(crate::hygiene::hygiene())
                    .apply(crate::fixer::fixer(None));
                let actual_src = tester.print(&actual);

                for helper in [
                    "_array_like_to_array",
                    "_array_without_holes",
                    "_iterable_to_array",
                    "_non_iterable_spread",
                    "_to_consumable_array",
                    "_unsupported_iterable_to_array",
                ] {
                    assert!(
                        actual_src.contains(&format!("function {helper}(")),
                        "expected inline helper `{helper}` in output:\n{actual_src}"
                    );
                }

                assert!(
                    !actual_src.contains("@swc/helpers"),
                    "inline helpers should not emit external imports:\n{actual_src}"
                );

                Ok(())
            })
        });
    }

    #[test]
    fn use_strict_abort() {
        crate::tests::test_transform(
            Default::default(),
            |_| noop_pass(),
            "'use strict'

let x = 4;",
            "'use strict'

let x = 4;",
            false,
            Default::default,
        );
    }

    #[test]
    #[cfg(feature = "inline-helpers")]
    fn issue_8871() {
        crate::tests::test_transform(
            Default::default(),
            |_| {
                enable_helper!(using_ctx);
                inject_helpers(Mark::new())
            },
            "let _throw = null",
            r#"
            function _using_ctx() {
                var _disposeSuppressedError = typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed) {
                    var err = new Error();
                    err.name = "SuppressedError";
                    err.suppressed = suppressed;
                    err.error = error;
                    return err;
                }, empty = {}, stack = [];
                function using(isAwait, value) {
                    if (value != null) {
                        if (Object(value) !== value) {
                            throw new TypeError("using declarations can only be used with objects, functions, null, or undefined.");
                        }
                        if (isAwait) {
                            var dispose = value[Symbol.asyncDispose || Symbol.for("Symbol.asyncDispose")];
                        }
                        if (dispose == null) {
                            dispose = value[Symbol.dispose || Symbol.for("Symbol.dispose")];
                        }
                        if (typeof dispose !== "function") {
                            throw new TypeError(`Property [Symbol.dispose] is not a function.`);
                        }
                        stack.push({
                            v: value,
                            d: dispose,
                            a: isAwait
                        });
                    } else if (isAwait) {
                        stack.push({
                            d: value,
                            a: isAwait
                        });
                    }
                    return value;
                }
                return {
                    e: empty,
                    u: using.bind(null, false),
                    a: using.bind(null, true),
                    d: function() {
                        var error = this.e;
                        function next() {
                            while(resource = stack.pop()){
                                try {
                                    var resource, disposalResult = resource.d && resource.d.call(resource.v);
                                    if (resource.a) {
                                        return Promise.resolve(disposalResult).then(next, err);
                                    }
                                } catch (e) {
                                    return err(e);
                                }
                            }
                            if (error !== empty) throw error;
                        }
                        function err(e) {
                            error = error !== empty ? new _disposeSuppressedError(e, error) : e;
                            return next();
                        }
                        return next();
                    }
                };
            }
                    
let _throw = null;
"#,
            false,
            Default::default,
        )
    }
}
