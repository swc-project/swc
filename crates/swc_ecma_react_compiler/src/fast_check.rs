use swc_ecma_ast::{
    CallExpr, Callee, ExportDefaultDecl, ExportDefaultExpr, Expr, FnDecl, FnExpr, JSXElement,
    JSXFragment, MemberProp, ModuleItem, Pat, Program, Stmt, Str, VarDeclarator,
};
use swc_ecma_visit::{Visit, VisitWith};

/// Heuristically determines whether a module is an interesting React Compiler
/// target.
///
/// This minimizes false positives, but does not recognize every function that
/// infer mode can compile. Use [`may_require`] when a `false` result will skip
/// compilation.
pub fn is_required(program: &Program) -> bool {
    let mut finder = Finder::default();
    finder.visit_program(program);
    finder.found
}

/// Conservatively determines whether infer or annotation mode could compile
/// anything.
///
/// False positives only add compiler work, while false negatives could change
/// output. This scans every function context for JSX, plausible hook calls, and
/// opt-in directives, including dynamic gating directives.
pub fn may_require(program: &Program) -> bool {
    let mut finder = PotentialFinder::default();
    finder.visit_program(program);
    finder.found
}

#[derive(Default)]
struct Finder {
    found: bool,

    /// We are in a function that starts with a capital letter or it's a
    /// function that starts with `use`
    is_interested: bool,
}

#[derive(Default)]
struct PotentialFinder {
    found: bool,
}

fn is_hook_callee(expr: &Expr) -> bool {
    match expr {
        Expr::Ident(ident) => ident.sym.starts_with("use"),
        Expr::Member(member) => {
            let Expr::Ident(object) = &*member.obj else {
                return false;
            };
            let MemberProp::Ident(property) = &member.prop else {
                return false;
            };

            object.sym.starts_with(|c: char| c.is_ascii_uppercase())
                && property.sym.starts_with("use")
        }
        _ => false,
    }
}

fn is_opt_in_directive(value: &Str) -> bool {
    value.value.as_str().is_some_and(|value| {
        matches!(value, "use memo" | "use forget") || value.starts_with("use memo if(")
    })
}

impl Visit for PotentialFinder {
    fn visit_call_expr(&mut self, node: &CallExpr) {
        if self.found {
            return;
        }
        if let Callee::Expr(expr) = &node.callee {
            if is_hook_callee(expr) {
                self.found = true;
                return;
            }
        }

        node.visit_children_with(self);
    }

    fn visit_jsx_element(&mut self, _: &JSXElement) {
        self.found = true;
    }

    fn visit_jsx_fragment(&mut self, _: &JSXFragment) {
        self.found = true;
    }

    fn visit_module_item(&mut self, node: &ModuleItem) {
        if self.found {
            return;
        }
        node.visit_children_with(self);
    }

    fn visit_stmt(&mut self, node: &Stmt) {
        if self.found {
            return;
        }
        node.visit_children_with(self);
    }

    fn visit_str(&mut self, node: &Str) {
        if self.found {
            return;
        }
        self.found = is_opt_in_directive(node);
    }
}

impl Visit for Finder {
    fn visit_callee(&mut self, node: &Callee) {
        if self.is_interested {
            if let Callee::Expr(e) = node {
                if let Expr::Ident(c) = &**e {
                    if c.sym.starts_with("use") {
                        self.found = true;
                        return;
                    }
                }
            }
        }

        node.visit_children_with(self);
    }

    fn visit_export_default_decl(&mut self, node: &ExportDefaultDecl) {
        let old = self.is_interested;

        self.is_interested = true;

        node.visit_children_with(self);

        self.is_interested = old;
    }

    fn visit_export_default_expr(&mut self, node: &ExportDefaultExpr) {
        let old = self.is_interested;

        self.is_interested = true;

        node.visit_children_with(self);

        self.is_interested = old;
    }

    fn visit_expr(&mut self, node: &Expr) {
        if self.found {
            return;
        }
        if self.is_interested
            && matches!(
                node,
                Expr::JSXMember(..)
                    | Expr::JSXNamespacedName(..)
                    | Expr::JSXEmpty(..)
                    | Expr::JSXElement(..)
                    | Expr::JSXFragment(..)
            )
        {
            self.found = true;
            return;
        }

        node.visit_children_with(self);
    }

    fn visit_fn_decl(&mut self, node: &FnDecl) {
        let old = self.is_interested;

        self.is_interested = node.ident.sym.starts_with("use")
            || node.ident.sym.starts_with(|c: char| c.is_ascii_uppercase());

        node.visit_children_with(self);

        self.is_interested = old;
    }

    fn visit_fn_expr(&mut self, node: &FnExpr) {
        let old = self.is_interested;

        self.is_interested |= node.ident.as_ref().is_some_and(|ident| {
            ident.sym.starts_with("use") || ident.sym.starts_with(|c: char| c.is_ascii_uppercase())
        });

        node.visit_children_with(self);

        self.is_interested = old;
    }

    fn visit_stmt(&mut self, node: &Stmt) {
        if self.found {
            return;
        }
        node.visit_children_with(self);
    }

    fn visit_var_declarator(&mut self, node: &VarDeclarator) {
        let old = self.is_interested;

        if matches!(node.init.as_deref(), Some(Expr::Fn(..) | Expr::Arrow(..))) {
            if let Pat::Ident(ident) = &node.name {
                self.is_interested = ident.sym.starts_with("use")
                    || ident.sym.starts_with(|c: char| c.is_ascii_uppercase());
            } else {
                self.is_interested = false;
            }
        }

        node.visit_children_with(self);

        self.is_interested = old;
    }
}

#[cfg(test)]
mod tests {
    use swc_common::FileName;
    use swc_ecma_parser::{parse_file_as_program, EsSyntax, Syntax};
    use testing::run_test2;

    use super::*;

    fn assert_required(code: &str, required: bool) {
        assert_detection(code, required, is_required);
    }

    fn assert_may_require(code: &str, required: bool) {
        assert_detection(code, required, may_require);
    }

    fn assert_detection(code: &str, required: bool, detector: fn(&Program) -> bool) {
        run_test2(false, |cm, _| {
            let fm =
                cm.new_source_file(FileName::Custom("test.tsx".into()).into(), code.to_string());

            let program = parse_file_as_program(
                &fm,
                Syntax::Es(EsSyntax {
                    jsx: true,
                    ..Default::default()
                }),
                Default::default(),
                Default::default(),
                &mut vec![],
            )
            .unwrap();

            assert_eq!(detector(&program), required);

            Ok(())
        })
        .unwrap();
    }

    #[test]
    fn lazy_return() {
        assert_required(
            "
            function Foo() {
                const a = <div>Hello</div>;

                return a
            }
            ",
            true,
        );

        assert_required(
            "
            function Foo() {
            ",
            false,
        );
    }

    #[test]
    fn return_jsx() {
        assert_required(
            "
            function Foo() {
                return <div>Hello</div>;
            }
            ",
            true,
        );
    }

    #[test]
    fn use_hooks() {
        assert_required(
            "
            function Foo(props) {
                const [a, b] = useState(0);

                return props.children;
            }
            ",
            true,
        );
    }

    #[test]
    fn arrow_function() {
        assert_required(
            "
            const Foo = () => <div>Hello</div>;
            ",
            true,
        );

        assert_required(
            "
            const Foo = () => {
                return <div>Hello</div>;
            };
            ",
            true,
        );
    }

    #[test]
    fn export_const_arrow_function() {
        assert_required(
            "
            export const Foo = () => <div>Hello</div>;
            ",
            true,
        );

        assert_required(
            "
            export const Foo = () => {
                return <div>Hello</div>;
            };
            ",
            true,
        );
    }

    #[test]
    fn normal_arrow_function() {
        assert_required(
            "
            const Foo = () => {
                const a = 1;
                console.log(a);
            };
            ",
            false,
        );
    }

    #[test]
    fn export_default_arrow_function() {
        assert_required(
            "
            export default () => <div>Hello</div>;
            ",
            true,
        );
    }

    #[test]
    fn not_required_arrow_function() {
        assert_required(
            "
            export default () => {
                const a = 1;
                console.log(a);
            };
            ",
            false,
        );
    }

    #[test]
    fn conservative_check_detects_wrapped_callbacks() {
        let source = "
            const Foo = React.forwardRef((props, ref) => <div ref={ref} />);
            const Bar = memo(() => <span />);
        ";
        assert_required(source, false);
        assert_may_require(source, true);
    }

    #[test]
    fn conservative_check_detects_member_hooks() {
        let source = "
            function useCounter() {
                return React.useState(0);
            }
        ";
        assert_required(source, false);
        assert_may_require(source, true);
    }

    #[test]
    fn conservative_check_detects_opt_in_directives() {
        assert_may_require("function lower() { 'use memo'; return 1; }", true);
        assert_may_require("function lower() { 'use forget'; return 1; }", true);
        assert_may_require(
            "function lower() { 'use memo if(featureFlag)'; return 1; }",
            true,
        );
    }

    #[test]
    fn conservative_check_skips_plain_modules() {
        assert_may_require(
            "
            export const answer = 42;
            export function add(a, b) { return a + b; }
            ",
            false,
        );
    }
}
