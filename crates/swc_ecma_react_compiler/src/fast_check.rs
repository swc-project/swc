use react_compiler_hir::environment::is_hook_name;
use swc_ecma_ast::{
    ArrowExpr, ArrowFunctionBody, CallExpr, Callee, Expr, Function, JSXElement, JSXFragment, Lit,
    MemberProp, Module, ModuleItem, Program, Script, Stmt, Str,
};
use swc_ecma_visit::{Visit, VisitWith};

/// Conservatively determines whether infer or annotation mode could compile
/// anything.
///
/// There may be false positives, but no false negatives: a `false` result means
/// compilation cannot change the program. This scans every function context for
/// JSX, plausible hook calls, and opt-in directives, including dynamic gating
/// directives.
pub fn is_required(program: &Program) -> bool {
    let mut finder = Finder::default();
    finder.visit_program(program);
    finder.found
}

#[derive(Default)]
struct Finder {
    found: bool,
}

fn is_hook_callee(expr: &Expr) -> bool {
    match expr {
        Expr::Ident(ident) => is_hook_name(&ident.sym),
        Expr::Member(member) => {
            let Expr::Ident(object) = &*member.obj else {
                return false;
            };
            let MemberProp::Ident(property) = &member.prop else {
                return false;
            };

            object
                .sym
                .starts_with(|character: char| character.is_ascii_uppercase())
                && is_hook_name(&property.sym)
        }
        _ => false,
    }
}

fn is_opt_in_directive(value: &Str) -> bool {
    value.value.as_str().is_some_and(|value| {
        matches!(value, "use memo" | "use forget") || value.starts_with("use memo if(")
    })
}

fn has_opt_in_directive<'a>(statements: impl IntoIterator<Item = &'a Stmt>) -> bool {
    for statement in statements {
        if !statement.can_precede_directive() {
            break;
        }

        let Stmt::Expr(expression) = statement else {
            continue;
        };
        let Expr::Lit(Lit::Str(value)) = &*expression.expr else {
            continue;
        };
        if is_opt_in_directive(value) {
            return true;
        }
    }

    false
}

fn module_has_opt_in_directive(module: &Module) -> bool {
    for item in &module.body {
        let ModuleItem::Stmt(statement) = item else {
            break;
        };
        if !statement.can_precede_directive() {
            break;
        }

        let Stmt::Expr(expression) = statement else {
            continue;
        };
        let Expr::Lit(Lit::Str(value)) = &*expression.expr else {
            continue;
        };
        if is_opt_in_directive(value) {
            return true;
        }
    }

    false
}

impl Visit for Finder {
    fn visit_arrow_expr(&mut self, node: &ArrowExpr) {
        if let ArrowFunctionBody::FunctionBody(body) = &*node.body {
            if has_opt_in_directive(&body.stmts) {
                self.found = true;
                return;
            }
        }

        node.visit_children_with(self);
    }

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

    fn visit_function(&mut self, node: &Function) {
        if has_opt_in_directive(&node.body.stmts) {
            self.found = true;
            return;
        }

        node.visit_children_with(self);
    }

    fn visit_jsx_element(&mut self, _: &JSXElement) {
        self.found = true;
    }

    fn visit_jsx_fragment(&mut self, _: &JSXFragment) {
        self.found = true;
    }

    fn visit_module(&mut self, node: &Module) {
        if module_has_opt_in_directive(node) {
            self.found = true;
            return;
        }

        node.visit_children_with(self);
    }

    fn visit_module_item(&mut self, node: &ModuleItem) {
        if self.found {
            return;
        }
        node.visit_children_with(self);
    }

    fn visit_script(&mut self, node: &Script) {
        if has_opt_in_directive(&node.body) {
            self.found = true;
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
}

#[cfg(test)]
mod tests {
    use swc_common::FileName;
    use swc_ecma_parser::{parse_file_as_program, EsSyntax, Syntax};
    use testing::run_test2;

    use super::*;

    fn assert_required(code: &str, required: bool) {
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

            assert_eq!(is_required(&program), required);

            Ok(())
        })
        .unwrap();
    }

    fn assert_not_compiled(code: &str) {
        let result = crate::transform_source(
            code,
            Syntax::Es(EsSyntax {
                jsx: true,
                ..Default::default()
            }),
            crate::default_plugin_options(),
        );
        assert!(result.program.is_none());
        assert!(result.diagnostics.is_empty());
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
        assert_required(source, true);
    }

    #[test]
    fn conservative_check_detects_member_hooks() {
        let source = "
            function useCounter() {
                return React.useState(0);
            }
        ";
        assert_required(source, true);
    }

    #[test]
    fn conservative_check_skips_names_without_react_patterns() {
        for source in [
            "export function App() { return React.createElement('div'); }",
            "export function useComputed() { return 1; }",
        ] {
            assert_required(source, false);
            assert_not_compiled(source);
        }
    }

    #[test]
    fn conservative_check_skips_jsx_free_wrapped_components() {
        let source = "
            const Button = React.forwardRef((props, ref) =>
                React.createElement('button', { ref }, props.label)
            );
        ";
        assert_required(source, false);
        assert_not_compiled(source);
    }

    #[test]
    fn conservative_check_matches_hook_naming() {
        assert_required("const state = useState();", true);
        assert_required("const value = use3rdParty();", true);
        assert_required("const user = getUser();", false);
        assert_required("const value = useless();", false);
    }

    #[test]
    fn conservative_check_detects_opt_in_directives() {
        assert_required("function lower() { 'use memo'; return 1; }", true);
        assert_required("function lower() { 'use forget'; return 1; }", true);
        assert_required(
            "function lower() { 'use memo if(featureFlag)'; return 1; }",
            true,
        );
        assert_required("'use memo'; export const answer = 42;", true);
        assert_required(
            "function lower() { 'use strict'; 'use memo'; return 1; }",
            true,
        );
        assert_required("const lower = () => { 'use memo'; return 1; };", true);
        assert_required("function lower() { work(); 'use memo'; return 1; }", false);
        assert_required("const lower = () => 'use memo';", false);
        assert_required("const marker = 'use memo';", false);
        assert_required("import value from 'use memo'; export default value;", false);
    }

    #[test]
    fn conservative_check_skips_plain_modules() {
        assert_required(
            "
            export const answer = 42;
            export function add(a, b) { return a + b; }
            ",
            false,
        );
    }
}
