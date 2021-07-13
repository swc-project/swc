#![feature(test)]

extern crate test;

use std::{
    env,
    io::{self},
    path::Path,
};
use swc_common::{comments::SingleThreadedComments, errors::Handler, Spanned, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_parser::{lexer::Lexer, Parser, StringInput, Syntax, TsConfig};
use swc_ecma_visit::{Node, Visit, VisitWith};
use test::{
    test_main, DynTestFn, Options, ShouldPanic::No, TestDesc, TestDescAndFn, TestName, TestType,
};
use walkdir::WalkDir;

fn add_test<F: FnOnce() + Send + 'static>(
    tests: &mut Vec<TestDescAndFn>,
    name: String,
    ignore: bool,
    f: F,
) {
    tests.push(TestDescAndFn {
        desc: TestDesc {
            test_type: TestType::UnitTest,
            name: TestName::DynTestName(name),
            ignore,
            should_panic: No,
            allow_fail: false,
        },
        testfn: DynTestFn(Box::new(f)),
    });
}

fn load_tests(tests: &mut Vec<TestDescAndFn>) -> Result<(), io::Error> {
    let dir = Path::new(env!("CARGO_MANIFEST_DIR"))
        .join("tests")
        .join("span");

    eprintln!("Loading tests from {}", dir.display());

    for entry in WalkDir::new(&dir) {
        let entry = entry?;
        if !entry.metadata()?.is_file() {
            continue;
        }

        let ext = match entry.path().extension() {
            None => continue,
            Some(v) => v.to_string_lossy().to_string(),
        };
        if ext != "js" && ext != "ts" && ext != "tsx" {
            continue;
        }

        let file_name = entry
            .path()
            .strip_prefix(&dir)
            .expect("failed to strip prefix")
            .to_str()
            .expect("to_str() failed")
            .to_string();

        let ignore = false;

        let name = format!("span::{}", file_name);

        let dir = dir.clone();
        add_test(tests, name, ignore, move || {
            let content = ::testing::run_test(false, |cm, handler| -> Result<(), _> {
                let src = cm.load_file(&entry.path()).expect("failed to load file");

                let comments = SingleThreadedComments::default();
                let lexer = Lexer::new(
                    Syntax::Typescript(TsConfig {
                        tsx: true,
                        decorators: true,
                        no_early_errors: true,
                        ..Default::default()
                    }),
                    Default::default(),
                    (&*src).into(),
                    Some(&comments),
                );
                let mut parser: Parser<Lexer<StringInput>> = Parser::new_from(lexer);

                {
                    let module = parser
                        .parse_module()
                        .map_err(|e| e.into_diagnostic(handler).emit())?;

                    Shower { handler }.visit_module(&module, &Invalid { span: DUMMY_SP } as _);
                }

                Err(())
            })
            .expect_err("failed to run test");

            let ref_file = format!("{}.spans", dir.join(&file_name).display());

            content.compare_to_file(&ref_file).unwrap();
        });
    }

    Ok(())
}

#[test]
fn span() {
    let args: Vec<_> = env::args().collect();
    let mut tests = Vec::new();
    load_tests(&mut tests).expect("failed to load testss");
    test_main(&args, tests, Some(Options::new()));
}

struct Shower<'a> {
    handler: &'a Handler,
}

impl Shower<'_> {
    fn show(&self, name: &str, node: &dyn Spanned) {
        let span = node.span();

        self.handler.struct_span_warn(span, name).emit();
    }
}

impl Visit for Shower<'_> {
    fn visit_array_lit(&mut self, n: &ArrayLit, _parent: &dyn Node) {
        self.show("ArrayLit", n);
        n.visit_children_with(self)
    }
    fn visit_array_pat(&mut self, n: &ArrayPat, _parent: &dyn Node) {
        self.show("ArrayPat", n);
        n.visit_children_with(self)
    }
    fn visit_arrow_expr(&mut self, n: &ArrowExpr, _parent: &dyn Node) {
        self.show("ArrowExpr", n);
        n.visit_children_with(self)
    }
    fn visit_assign_expr(&mut self, n: &AssignExpr, _parent: &dyn Node) {
        self.show("AssignExpr", n);
        n.visit_children_with(self)
    }
    fn visit_assign_pat(&mut self, n: &AssignPat, _parent: &dyn Node) {
        self.show("AssignPat", n);
        n.visit_children_with(self)
    }
    fn visit_assign_pat_prop(&mut self, n: &AssignPatProp, _parent: &dyn Node) {
        self.show("AssignPatProp", n);
        n.visit_children_with(self)
    }
    fn visit_assign_prop(&mut self, n: &AssignProp, _parent: &dyn Node) {
        self.show("AssignProp", n);
        n.visit_children_with(self)
    }
    fn visit_await_expr(&mut self, n: &AwaitExpr, _parent: &dyn Node) {
        self.show("AwaitExpr", n);
        n.visit_children_with(self)
    }
    fn visit_bin_expr(&mut self, n: &BinExpr, _parent: &dyn Node) {
        self.show("BinExpr", n);
        n.visit_children_with(self)
    }
    fn visit_block_stmt(&mut self, n: &BlockStmt, _parent: &dyn Node) {
        self.show("BlockStmt", n);
        n.visit_children_with(self)
    }
    fn visit_block_stmt_or_expr(&mut self, n: &BlockStmtOrExpr, _parent: &dyn Node) {
        self.show("BlockStmtOrExpr", n);
        n.visit_children_with(self)
    }
    fn visit_bool(&mut self, n: &Bool, _parent: &dyn Node) {
        self.show("Bool", n);
        n.visit_children_with(self)
    }
    fn visit_break_stmt(&mut self, n: &BreakStmt, _parent: &dyn Node) {
        self.show("BreakStmt", n);
        n.visit_children_with(self)
    }
    fn visit_call_expr(&mut self, n: &CallExpr, _parent: &dyn Node) {
        self.show("CallExpr", n);
        n.visit_children_with(self)
    }
    fn visit_catch_clause(&mut self, n: &CatchClause, _parent: &dyn Node) {
        self.show("CatchClause", n);
        n.visit_children_with(self)
    }
    fn visit_class(&mut self, n: &Class, _parent: &dyn Node) {
        self.show("Class", n);
        n.visit_children_with(self)
    }
    fn visit_class_decl(&mut self, n: &ClassDecl, _parent: &dyn Node) {
        self.show("ClassDecl", n);
        n.visit_children_with(self)
    }
    fn visit_class_expr(&mut self, n: &ClassExpr, _parent: &dyn Node) {
        self.show("ClassExpr", n);
        n.visit_children_with(self)
    }
    fn visit_class_member(&mut self, n: &ClassMember, _parent: &dyn Node) {
        self.show("ClassMember", n);
        n.visit_children_with(self)
    }
    fn visit_class_method(&mut self, n: &ClassMethod, _parent: &dyn Node) {
        self.show("ClassMethod", n);
        n.visit_children_with(self)
    }
    fn visit_class_prop(&mut self, n: &ClassProp, _parent: &dyn Node) {
        self.show("ClassProp", n);
        n.visit_children_with(self)
    }
    fn visit_computed_prop_name(&mut self, n: &ComputedPropName, _parent: &dyn Node) {
        self.show("ComputedPropName", n);
        n.visit_children_with(self)
    }
    fn visit_cond_expr(&mut self, n: &CondExpr, _parent: &dyn Node) {
        self.show("CondExpr", n);
        n.visit_children_with(self)
    }
    fn visit_constructor(&mut self, n: &Constructor, _parent: &dyn Node) {
        self.show("Constructor", n);
        n.visit_children_with(self)
    }
    fn visit_continue_stmt(&mut self, n: &ContinueStmt, _parent: &dyn Node) {
        self.show("ContinueStmt", n);
        n.visit_children_with(self)
    }
    fn visit_debugger_stmt(&mut self, n: &DebuggerStmt, _parent: &dyn Node) {
        self.show("DebuggerStmt", n);
        n.visit_children_with(self)
    }
    fn visit_decl(&mut self, n: &Decl, _parent: &dyn Node) {
        self.show("Decl", n);
        n.visit_children_with(self)
    }
    fn visit_decorator(&mut self, n: &Decorator, _parent: &dyn Node) {
        self.show("Decorator", n);
        n.visit_children_with(self)
    }
    fn visit_default_decl(&mut self, n: &DefaultDecl, _parent: &dyn Node) {
        self.show("DefaultDecl", n);
        n.visit_children_with(self)
    }
    fn visit_do_while_stmt(&mut self, n: &DoWhileStmt, _parent: &dyn Node) {
        self.show("DoWhileStmt", n);
        n.visit_children_with(self)
    }
    fn visit_empty_stmt(&mut self, n: &EmptyStmt, _parent: &dyn Node) {
        self.show("EmptyStmt", n);
        n.visit_children_with(self)
    }
    fn visit_export_all(&mut self, n: &ExportAll, _parent: &dyn Node) {
        self.show("ExportAll", n);
        n.visit_children_with(self)
    }
    fn visit_export_decl(&mut self, n: &ExportDecl, _parent: &dyn Node) {
        self.show("ExportDecl", n);
        n.visit_children_with(self)
    }
    fn visit_export_default_decl(&mut self, n: &ExportDefaultDecl, _parent: &dyn Node) {
        self.show("ExportDefaultDecl", n);
        n.visit_children_with(self)
    }
    fn visit_export_default_expr(&mut self, n: &ExportDefaultExpr, _parent: &dyn Node) {
        self.show("ExportDefaultExpr", n);
        n.visit_children_with(self)
    }
    fn visit_export_default_specifier(&mut self, n: &ExportDefaultSpecifier, _parent: &dyn Node) {
        self.show("ExportDefaultSpecifier", n);
        n.visit_children_with(self)
    }
    fn visit_export_named_specifier(&mut self, n: &ExportNamedSpecifier, _parent: &dyn Node) {
        self.show("ExportNamedSpecifier", n);
        n.visit_children_with(self)
    }
    fn visit_export_namespace_specifier(
        &mut self,
        n: &ExportNamespaceSpecifier,
        _parent: &dyn Node,
    ) {
        self.show("ExportNamespaceSpecifier", n);
        n.visit_children_with(self)
    }
    fn visit_export_specifier(&mut self, n: &ExportSpecifier, _parent: &dyn Node) {
        self.show("ExportSpecifier", n);
        n.visit_children_with(self)
    }
    fn visit_expr(&mut self, n: &Expr, _parent: &dyn Node) {
        self.show("Expr", n);
        n.visit_children_with(self)
    }
    fn visit_expr_or_spread(&mut self, n: &ExprOrSpread, _parent: &dyn Node) {
        self.show("ExprOrSpread", n);
        n.visit_children_with(self)
    }
    fn visit_expr_or_super(&mut self, n: &ExprOrSuper, _parent: &dyn Node) {
        self.show("ExprOrSuper", n);
        n.visit_children_with(self)
    }
    fn visit_expr_stmt(&mut self, n: &ExprStmt, _parent: &dyn Node) {
        self.show("ExprStmt", n);
        n.visit_children_with(self)
    }
    fn visit_fn_decl(&mut self, n: &FnDecl, _parent: &dyn Node) {
        self.show("FnDecl", n);
        n.visit_children_with(self)
    }
    fn visit_fn_expr(&mut self, n: &FnExpr, _parent: &dyn Node) {
        self.show("FnExpr", n);
        n.visit_children_with(self)
    }
    fn visit_for_in_stmt(&mut self, n: &ForInStmt, _parent: &dyn Node) {
        self.show("ForInStmt", n);
        n.visit_children_with(self)
    }
    fn visit_for_of_stmt(&mut self, n: &ForOfStmt, _parent: &dyn Node) {
        self.show("ForOfStmt", n);
        n.visit_children_with(self)
    }
    fn visit_for_stmt(&mut self, n: &ForStmt, _parent: &dyn Node) {
        self.show("ForStmt", n);
        n.visit_children_with(self)
    }
    fn visit_function(&mut self, n: &Function, _parent: &dyn Node) {
        self.show("Function", n);
        n.visit_children_with(self)
    }
    fn visit_getter_prop(&mut self, n: &GetterProp, _parent: &dyn Node) {
        self.show("GetterProp", n);
        n.visit_children_with(self)
    }
    fn visit_ident(&mut self, n: &Ident, _parent: &dyn Node) {
        self.show("Ident", n);
        n.visit_children_with(self)
    }
    fn visit_if_stmt(&mut self, n: &IfStmt, _parent: &dyn Node) {
        self.show("IfStmt", n);
        n.visit_children_with(self)
    }
    fn visit_import_decl(&mut self, n: &ImportDecl, _parent: &dyn Node) {
        self.show("ImportDecl", n);
        n.visit_children_with(self)
    }
    fn visit_import_default_specifier(&mut self, n: &ImportDefaultSpecifier, _parent: &dyn Node) {
        self.show("ImportDefaultSpecifier", n);
        n.visit_children_with(self)
    }
    fn visit_import_named_specifier(&mut self, n: &ImportNamedSpecifier, _parent: &dyn Node) {
        self.show("ImportNamedSpecifier", n);
        n.visit_children_with(self)
    }
    fn visit_import_specifier(&mut self, n: &ImportSpecifier, _parent: &dyn Node) {
        self.show("ImportSpecifier", n);
        n.visit_children_with(self)
    }
    fn visit_import_star_as_specifier(&mut self, n: &ImportStarAsSpecifier, _parent: &dyn Node) {
        self.show("ImportStarAsSpecifier", n);
        n.visit_children_with(self)
    }
    fn visit_invalid(&mut self, n: &Invalid, _parent: &dyn Node) {
        self.show("Invalid", n);
        n.visit_children_with(self)
    }
    fn visit_jsx_attr(&mut self, n: &JSXAttr, _parent: &dyn Node) {
        self.show("JSXAttr", n);
        n.visit_children_with(self)
    }
    fn visit_jsx_attr_name(&mut self, n: &JSXAttrName, _parent: &dyn Node) {
        self.show("JSXAttrName", n);
        n.visit_children_with(self)
    }
    fn visit_jsx_attr_or_spread(&mut self, n: &JSXAttrOrSpread, _parent: &dyn Node) {
        self.show("JSXAttrOrSpread", n);
        n.visit_children_with(self)
    }
    fn visit_jsx_attr_value(&mut self, n: &JSXAttrValue, _parent: &dyn Node) {
        self.show("JSXAttrValue", n);
        n.visit_children_with(self)
    }
    fn visit_jsx_closing_element(&mut self, n: &JSXClosingElement, _parent: &dyn Node) {
        self.show("JSXClosingElement", n);
        n.visit_children_with(self)
    }
    fn visit_jsx_closing_fragment(&mut self, n: &JSXClosingFragment, _parent: &dyn Node) {
        self.show("JSXClosingFragment", n);
        n.visit_children_with(self)
    }
    fn visit_jsx_element(&mut self, n: &JSXElement, _parent: &dyn Node) {
        self.show("JSXElement", n);
        n.visit_children_with(self)
    }
    fn visit_jsx_element_child(&mut self, n: &JSXElementChild, _parent: &dyn Node) {
        self.show("JSXElementChild", n);
        n.visit_children_with(self)
    }
    fn visit_jsx_element_name(&mut self, n: &JSXElementName, _parent: &dyn Node) {
        self.show("JSXElementName", n);
        n.visit_children_with(self)
    }
    fn visit_jsx_empty_expr(&mut self, n: &JSXEmptyExpr, _parent: &dyn Node) {
        self.show("JSXEmptyExpr", n);
        n.visit_children_with(self)
    }
    fn visit_jsx_expr(&mut self, n: &JSXExpr, _parent: &dyn Node) {
        self.show("JSXExpr", n);
        n.visit_children_with(self)
    }
    fn visit_jsx_expr_container(&mut self, n: &JSXExprContainer, _parent: &dyn Node) {
        self.show("JSXExprContainer", n);
        n.visit_children_with(self)
    }
    fn visit_jsx_fragment(&mut self, n: &JSXFragment, _parent: &dyn Node) {
        self.show("JSXFragment", n);
        n.visit_children_with(self)
    }
    fn visit_jsx_member_expr(&mut self, n: &JSXMemberExpr, _parent: &dyn Node) {
        self.show("JSXMemberExpr", n);
        n.visit_children_with(self)
    }
    fn visit_jsx_namespaced_name(&mut self, n: &JSXNamespacedName, _parent: &dyn Node) {
        self.show("JSXNamespacedName", n);
        n.visit_children_with(self)
    }
    fn visit_jsx_object(&mut self, n: &JSXObject, _parent: &dyn Node) {
        self.show("JSXObject", n);
        n.visit_children_with(self)
    }
    fn visit_jsx_opening_element(&mut self, n: &JSXOpeningElement, _parent: &dyn Node) {
        self.show("JSXOpeningElement", n);
        n.visit_children_with(self)
    }
    fn visit_jsx_opening_fragment(&mut self, n: &JSXOpeningFragment, _parent: &dyn Node) {
        self.show("JSXOpeningFragment", n);
        n.visit_children_with(self)
    }
    fn visit_jsx_spread_child(&mut self, n: &JSXSpreadChild, _parent: &dyn Node) {
        self.show("JSXSpreadChild", n);
        n.visit_children_with(self)
    }
    fn visit_jsx_text(&mut self, n: &JSXText, _parent: &dyn Node) {
        self.show("JSXText", n);
        n.visit_children_with(self)
    }
    fn visit_key_value_pat_prop(&mut self, n: &KeyValuePatProp, _parent: &dyn Node) {
        self.show("KeyValuePatProp", n);
        n.visit_children_with(self)
    }
    fn visit_key_value_prop(&mut self, n: &KeyValueProp, _parent: &dyn Node) {
        self.show("KeyValueProp", n);
        n.visit_children_with(self)
    }
    fn visit_labeled_stmt(&mut self, n: &LabeledStmt, _parent: &dyn Node) {
        self.show("LabeledStmt", n);
        n.visit_children_with(self)
    }
    fn visit_lit(&mut self, n: &Lit, _parent: &dyn Node) {
        self.show("Lit", n);
        n.visit_children_with(self)
    }
    fn visit_member_expr(&mut self, n: &MemberExpr, _parent: &dyn Node) {
        self.show("MemberExpr", n);
        n.visit_children_with(self)
    }
    fn visit_meta_prop_expr(&mut self, n: &MetaPropExpr, _parent: &dyn Node) {
        self.show("MetaPropExpr", n);
        n.visit_children_with(self)
    }
    fn visit_method_prop(&mut self, n: &MethodProp, _parent: &dyn Node) {
        self.show("MethodProp", n);
        n.visit_children_with(self)
    }
    fn visit_module(&mut self, n: &Module, _parent: &dyn Node) {
        self.show("Module", n);
        n.visit_children_with(self)
    }
    fn visit_module_decl(&mut self, n: &ModuleDecl, _parent: &dyn Node) {
        self.show("ModuleDecl", n);
        n.visit_children_with(self)
    }
    fn visit_module_item(&mut self, n: &ModuleItem, _parent: &dyn Node) {
        self.show("ModuleItem", n);
        n.visit_children_with(self)
    }
    fn visit_named_export(&mut self, n: &NamedExport, _parent: &dyn Node) {
        self.show("NamedExport", n);
        n.visit_children_with(self)
    }
    fn visit_new_expr(&mut self, n: &NewExpr, _parent: &dyn Node) {
        self.show("NewExpr", n);
        n.visit_children_with(self)
    }
    fn visit_null(&mut self, n: &Null, _parent: &dyn Node) {
        self.show("Null", n);
        n.visit_children_with(self)
    }
    fn visit_number(&mut self, n: &Number, _parent: &dyn Node) {
        self.show("Number", n);
        n.visit_children_with(self)
    }
    fn visit_object_lit(&mut self, n: &ObjectLit, _parent: &dyn Node) {
        self.show("ObjectLit", n);
        n.visit_children_with(self)
    }
    fn visit_object_pat(&mut self, n: &ObjectPat, _parent: &dyn Node) {
        self.show("ObjectPat", n);
        n.visit_children_with(self)
    }
    fn visit_object_pat_prop(&mut self, n: &ObjectPatProp, _parent: &dyn Node) {
        self.show("ObjectPatProp", n);
        n.visit_children_with(self)
    }
    fn visit_opt_chain_expr(&mut self, n: &OptChainExpr, _parent: &dyn Node) {
        self.show("OptChainExpr", n);
        n.visit_children_with(self)
    }
    fn visit_param(&mut self, n: &Param, _parent: &dyn Node) {
        self.show("Param", n);
        n.visit_children_with(self)
    }
    fn visit_param_or_ts_param_prop(&mut self, n: &ParamOrTsParamProp, _parent: &dyn Node) {
        self.show("ParamOrTsParamProp", n);
        n.visit_children_with(self)
    }
    fn visit_paren_expr(&mut self, n: &ParenExpr, _parent: &dyn Node) {
        self.show("ParenExpr", n);
        n.visit_children_with(self)
    }
    fn visit_pat(&mut self, n: &Pat, _parent: &dyn Node) {
        self.show("Pat", n);
        n.visit_children_with(self)
    }
    fn visit_pat_or_expr(&mut self, n: &PatOrExpr, _parent: &dyn Node) {
        self.show("PatOrExpr", n);
        n.visit_children_with(self)
    }
    fn visit_private_method(&mut self, n: &PrivateMethod, _parent: &dyn Node) {
        self.show("PrivateMethod", n);
        n.visit_children_with(self)
    }
    fn visit_private_name(&mut self, n: &PrivateName, _parent: &dyn Node) {
        self.show("PrivateName", n);
        n.visit_children_with(self)
    }
    fn visit_private_prop(&mut self, n: &PrivateProp, _parent: &dyn Node) {
        self.show("PrivateProp", n);
        n.visit_children_with(self)
    }
    fn visit_program(&mut self, n: &Program, _parent: &dyn Node) {
        self.show("Program", n);
        n.visit_children_with(self)
    }
    fn visit_prop(&mut self, n: &Prop, _parent: &dyn Node) {
        self.show("Prop", n);
        n.visit_children_with(self)
    }
    fn visit_prop_name(&mut self, n: &PropName, _parent: &dyn Node) {
        self.show("PropName", n);
        n.visit_children_with(self)
    }
    fn visit_prop_or_spread(&mut self, n: &PropOrSpread, _parent: &dyn Node) {
        self.show("PropOrSpread", n);
        n.visit_children_with(self)
    }
    fn visit_regex(&mut self, n: &Regex, _parent: &dyn Node) {
        self.show("Regex", n);
        n.visit_children_with(self)
    }
    fn visit_rest_pat(&mut self, n: &RestPat, _parent: &dyn Node) {
        self.show("RestPat", n);
        n.visit_children_with(self)
    }
    fn visit_return_stmt(&mut self, n: &ReturnStmt, _parent: &dyn Node) {
        self.show("ReturnStmt", n);
        n.visit_children_with(self)
    }
    fn visit_script(&mut self, n: &Script, _parent: &dyn Node) {
        self.show("Script", n);
        n.visit_children_with(self)
    }
    fn visit_seq_expr(&mut self, n: &SeqExpr, _parent: &dyn Node) {
        self.show("SeqExpr", n);
        n.visit_children_with(self)
    }
    fn visit_setter_prop(&mut self, n: &SetterProp, _parent: &dyn Node) {
        self.show("SetterProp", n);
        n.visit_children_with(self)
    }
    fn visit_spread_element(&mut self, n: &SpreadElement, _parent: &dyn Node) {
        self.show("SpreadElement", n);
        n.visit_children_with(self)
    }
    fn visit_stmt(&mut self, n: &Stmt, _parent: &dyn Node) {
        self.show("Stmt", n);
        n.visit_children_with(self)
    }
    fn visit_str(&mut self, n: &Str, _parent: &dyn Node) {
        self.show("Str", n);
        n.visit_children_with(self)
    }
    fn visit_super(&mut self, n: &Super, _parent: &dyn Node) {
        self.show("Super", n);
        n.visit_children_with(self)
    }
    fn visit_switch_case(&mut self, n: &SwitchCase, _parent: &dyn Node) {
        self.show("SwitchCase", n);
        n.visit_children_with(self)
    }
    fn visit_switch_stmt(&mut self, n: &SwitchStmt, _parent: &dyn Node) {
        self.show("SwitchStmt", n);
        n.visit_children_with(self)
    }
    fn visit_tagged_tpl(&mut self, n: &TaggedTpl, _parent: &dyn Node) {
        self.show("TaggedTpl", n);
        n.visit_children_with(self)
    }
    fn visit_this_expr(&mut self, n: &ThisExpr, _parent: &dyn Node) {
        self.show("ThisExpr", n);
        n.visit_children_with(self)
    }
    fn visit_throw_stmt(&mut self, n: &ThrowStmt, _parent: &dyn Node) {
        self.show("ThrowStmt", n);
        n.visit_children_with(self)
    }
    fn visit_tpl(&mut self, n: &Tpl, _parent: &dyn Node) {
        self.show("Tpl", n);
        n.visit_children_with(self)
    }
    fn visit_tpl_element(&mut self, n: &TplElement, _parent: &dyn Node) {
        self.show("TplElement", n);
        n.visit_children_with(self)
    }
    fn visit_try_stmt(&mut self, n: &TryStmt, _parent: &dyn Node) {
        self.show("TryStmt", n);
        n.visit_children_with(self)
    }
    fn visit_ts_array_type(&mut self, n: &TsArrayType, _parent: &dyn Node) {
        self.show("TsArrayType", n);
        n.visit_children_with(self)
    }
    fn visit_ts_as_expr(&mut self, n: &TsAsExpr, _parent: &dyn Node) {
        self.show("TsAsExpr", n);
        n.visit_children_with(self)
    }
    fn visit_ts_call_signature_decl(&mut self, n: &TsCallSignatureDecl, _parent: &dyn Node) {
        self.show("TsCallSignatureDecl", n);
        n.visit_children_with(self)
    }
    fn visit_ts_conditional_type(&mut self, n: &TsConditionalType, _parent: &dyn Node) {
        self.show("TsConditionalType", n);
        n.visit_children_with(self)
    }
    fn visit_ts_const_assertion(&mut self, n: &TsConstAssertion, _parent: &dyn Node) {
        self.show("TsConstAssertion", n);
        n.visit_children_with(self)
    }
    fn visit_ts_construct_signature_decl(
        &mut self,
        n: &TsConstructSignatureDecl,
        _parent: &dyn Node,
    ) {
        self.show("TsConstructSignatureDecl", n);
        n.visit_children_with(self)
    }
    fn visit_ts_constructor_type(&mut self, n: &TsConstructorType, _parent: &dyn Node) {
        self.show("TsConstructorType", n);
        n.visit_children_with(self)
    }
    fn visit_ts_entity_name(&mut self, n: &TsEntityName, _parent: &dyn Node) {
        self.show("TsEntityName", n);
        n.visit_children_with(self)
    }
    fn visit_ts_enum_decl(&mut self, n: &TsEnumDecl, _parent: &dyn Node) {
        self.show("TsEnumDecl", n);
        n.visit_children_with(self)
    }
    fn visit_ts_enum_member(&mut self, n: &TsEnumMember, _parent: &dyn Node) {
        self.show("TsEnumMember", n);
        n.visit_children_with(self)
    }
    fn visit_ts_enum_member_id(&mut self, n: &TsEnumMemberId, _parent: &dyn Node) {
        self.show("TsEnumMemberId", n);
        n.visit_children_with(self)
    }
    fn visit_ts_export_assignment(&mut self, n: &TsExportAssignment, _parent: &dyn Node) {
        self.show("TsExportAssignment", n);
        n.visit_children_with(self)
    }
    fn visit_ts_expr_with_type_args(&mut self, n: &TsExprWithTypeArgs, _parent: &dyn Node) {
        self.show("TsExprWithTypeArgs", n);
        n.visit_children_with(self)
    }
    fn visit_ts_external_module_ref(&mut self, n: &TsExternalModuleRef, _parent: &dyn Node) {
        self.show("TsExternalModuleRef", n);
        n.visit_children_with(self)
    }
    fn visit_ts_fn_or_constructor_type(&mut self, n: &TsFnOrConstructorType, _parent: &dyn Node) {
        self.show("TsFnOrConstructorType", n);
        n.visit_children_with(self)
    }
    fn visit_ts_fn_param(&mut self, n: &TsFnParam, _parent: &dyn Node) {
        self.show("TsFnParam", n);
        n.visit_children_with(self)
    }
    fn visit_ts_fn_type(&mut self, n: &TsFnType, _parent: &dyn Node) {
        self.show("TsFnType", n);
        n.visit_children_with(self)
    }
    fn visit_ts_import_equals_decl(&mut self, n: &TsImportEqualsDecl, _parent: &dyn Node) {
        self.show("TsImportEqualsDecl", n);
        n.visit_children_with(self)
    }
    fn visit_ts_import_type(&mut self, n: &TsImportType, _parent: &dyn Node) {
        self.show("TsImportType", n);
        n.visit_children_with(self)
    }
    fn visit_ts_index_signature(&mut self, n: &TsIndexSignature, _parent: &dyn Node) {
        self.show("TsIndexSignature", n);
        n.visit_children_with(self)
    }
    fn visit_ts_indexed_access_type(&mut self, n: &TsIndexedAccessType, _parent: &dyn Node) {
        self.show("TsIndexedAccessType", n);
        n.visit_children_with(self)
    }
    fn visit_ts_infer_type(&mut self, n: &TsInferType, _parent: &dyn Node) {
        self.show("TsInferType", n);
        n.visit_children_with(self)
    }
    fn visit_ts_interface_body(&mut self, n: &TsInterfaceBody, _parent: &dyn Node) {
        self.show("TsInterfaceBody", n);
        n.visit_children_with(self)
    }
    fn visit_ts_interface_decl(&mut self, n: &TsInterfaceDecl, _parent: &dyn Node) {
        self.show("TsInterfaceDecl", n);
        n.visit_children_with(self)
    }
    fn visit_ts_intersection_type(&mut self, n: &TsIntersectionType, _parent: &dyn Node) {
        self.show("TsIntersectionType", n);
        n.visit_children_with(self)
    }
    fn visit_ts_keyword_type(&mut self, n: &TsKeywordType, _parent: &dyn Node) {
        self.show("TsKeywordType", n);
        n.visit_children_with(self)
    }

    fn visit_ts_lit(&mut self, n: &TsLit, _parent: &dyn Node) {
        self.show("TsLit", n);
        n.visit_children_with(self)
    }
    fn visit_ts_lit_type(&mut self, n: &TsLitType, _parent: &dyn Node) {
        self.show("TsLitType", n);
        n.visit_children_with(self)
    }
    fn visit_ts_mapped_type(&mut self, n: &TsMappedType, _parent: &dyn Node) {
        self.show("TsMappedType", n);
        n.visit_children_with(self)
    }
    fn visit_ts_method_signature(&mut self, n: &TsMethodSignature, _parent: &dyn Node) {
        self.show("TsMethodSignature", n);
        n.visit_children_with(self)
    }
    fn visit_ts_module_block(&mut self, n: &TsModuleBlock, _parent: &dyn Node) {
        self.show("TsModuleBlock", n);
        n.visit_children_with(self)
    }
    fn visit_ts_module_decl(&mut self, n: &TsModuleDecl, _parent: &dyn Node) {
        self.show("TsModuleDecl", n);
        n.visit_children_with(self)
    }
    fn visit_ts_module_name(&mut self, n: &TsModuleName, _parent: &dyn Node) {
        self.show("TsModuleName", n);
        n.visit_children_with(self)
    }
    fn visit_ts_module_ref(&mut self, n: &TsModuleRef, _parent: &dyn Node) {
        self.show("TsModuleRef", n);
        n.visit_children_with(self)
    }
    fn visit_ts_namespace_body(&mut self, n: &TsNamespaceBody, _parent: &dyn Node) {
        self.show("TsNamespaceBody", n);
        n.visit_children_with(self)
    }
    fn visit_ts_namespace_decl(&mut self, n: &TsNamespaceDecl, _parent: &dyn Node) {
        self.show("TsNamespaceDecl", n);
        n.visit_children_with(self)
    }
    fn visit_ts_namespace_export_decl(&mut self, n: &TsNamespaceExportDecl, _parent: &dyn Node) {
        self.show("TsNamespaceExportDecl", n);
        n.visit_children_with(self)
    }
    fn visit_ts_non_null_expr(&mut self, n: &TsNonNullExpr, _parent: &dyn Node) {
        self.show("TsNonNullExpr", n);
        n.visit_children_with(self)
    }
    fn visit_ts_optional_type(&mut self, n: &TsOptionalType, _parent: &dyn Node) {
        self.show("TsOptionalType", n);
        n.visit_children_with(self)
    }
    fn visit_ts_param_prop(&mut self, n: &TsParamProp, _parent: &dyn Node) {
        self.show("TsParamProp", n);
        n.visit_children_with(self)
    }
    fn visit_ts_param_prop_param(&mut self, n: &TsParamPropParam, _parent: &dyn Node) {
        self.show("TsParamPropParam", n);
        n.visit_children_with(self)
    }
    fn visit_ts_parenthesized_type(&mut self, n: &TsParenthesizedType, _parent: &dyn Node) {
        self.show("TsParenthesizedType", n);
        n.visit_children_with(self)
    }
    fn visit_ts_property_signature(&mut self, n: &TsPropertySignature, _parent: &dyn Node) {
        self.show("TsPropertySignature", n);
        n.visit_children_with(self)
    }
    fn visit_ts_qualified_name(&mut self, n: &TsQualifiedName, _parent: &dyn Node) {
        self.show("TsQualifiedName", n);
        n.visit_children_with(self)
    }
    fn visit_ts_rest_type(&mut self, n: &TsRestType, _parent: &dyn Node) {
        self.show("TsRestType", n);
        n.visit_children_with(self)
    }
    fn visit_ts_this_type(&mut self, n: &TsThisType, _parent: &dyn Node) {
        self.show("TsThisType", n);
        n.visit_children_with(self)
    }
    fn visit_ts_this_type_or_ident(&mut self, n: &TsThisTypeOrIdent, _parent: &dyn Node) {
        self.show("TsThisTypeOrIdent", n);
        n.visit_children_with(self)
    }
    fn visit_ts_tuple_element(&mut self, n: &TsTupleElement, _parent: &dyn Node) {
        self.show("TsTupleElement", n);
        n.visit_children_with(self)
    }
    fn visit_ts_tuple_type(&mut self, n: &TsTupleType, _parent: &dyn Node) {
        self.show("TsTupleType", n);
        n.visit_children_with(self)
    }
    fn visit_ts_type(&mut self, n: &TsType, _parent: &dyn Node) {
        self.show("TsType", n);
        n.visit_children_with(self)
    }
    fn visit_ts_type_alias_decl(&mut self, n: &TsTypeAliasDecl, _parent: &dyn Node) {
        self.show("TsTypeAliasDecl", n);
        n.visit_children_with(self)
    }
    fn visit_ts_type_ann(&mut self, n: &TsTypeAnn, _parent: &dyn Node) {
        self.show("TsTypeAnn", n);
        n.visit_children_with(self)
    }
    fn visit_ts_type_assertion(&mut self, n: &TsTypeAssertion, _parent: &dyn Node) {
        self.show("TsTypeAssertion", n);
        n.visit_children_with(self)
    }
    fn visit_ts_type_element(&mut self, n: &TsTypeElement, _parent: &dyn Node) {
        self.show("TsTypeElement", n);
        n.visit_children_with(self)
    }
    fn visit_ts_type_lit(&mut self, n: &TsTypeLit, _parent: &dyn Node) {
        self.show("TsTypeLit", n);
        n.visit_children_with(self)
    }
    fn visit_ts_type_operator(&mut self, n: &TsTypeOperator, _parent: &dyn Node) {
        self.show("TsTypeOperator", n);
        n.visit_children_with(self)
    }

    fn visit_ts_type_param(&mut self, n: &TsTypeParam, _parent: &dyn Node) {
        self.show("TsTypeParam", n);
        n.visit_children_with(self)
    }
    fn visit_ts_type_param_decl(&mut self, n: &TsTypeParamDecl, _parent: &dyn Node) {
        self.show("TsTypeParamDecl", n);
        n.visit_children_with(self)
    }
    fn visit_ts_type_param_instantiation(
        &mut self,
        n: &TsTypeParamInstantiation,
        _parent: &dyn Node,
    ) {
        self.show("TsTypeParamInstantiation", n);
        n.visit_children_with(self)
    }
    fn visit_ts_type_predicate(&mut self, n: &TsTypePredicate, _parent: &dyn Node) {
        self.show("TsTypePredicate", n);
        n.visit_children_with(self)
    }
    fn visit_ts_type_query(&mut self, n: &TsTypeQuery, _parent: &dyn Node) {
        self.show("TsTypeQuery", n);
        n.visit_children_with(self)
    }
    fn visit_ts_type_query_expr(&mut self, n: &TsTypeQueryExpr, _parent: &dyn Node) {
        self.show("TsTypeQueryExpr", n);
        n.visit_children_with(self)
    }
    fn visit_ts_type_ref(&mut self, n: &TsTypeRef, _parent: &dyn Node) {
        self.show("TsTypeRef", n);
        n.visit_children_with(self)
    }
    fn visit_ts_union_or_intersection_type(
        &mut self,
        n: &TsUnionOrIntersectionType,
        _parent: &dyn Node,
    ) {
        self.show("TsUnionOrIntersectionType", n);
        n.visit_children_with(self)
    }
    fn visit_ts_union_type(&mut self, n: &TsUnionType, _parent: &dyn Node) {
        self.show("TsUnionType", n);
        n.visit_children_with(self)
    }
    fn visit_unary_expr(&mut self, n: &UnaryExpr, _parent: &dyn Node) {
        self.show("UnaryExpr", n);
        n.visit_children_with(self)
    }
    fn visit_update_expr(&mut self, n: &UpdateExpr, _parent: &dyn Node) {
        self.show("UpdateExpr", n);
        n.visit_children_with(self)
    }
    fn visit_var_decl(&mut self, n: &VarDecl, _parent: &dyn Node) {
        self.show("VarDecl", n);
        n.visit_children_with(self)
    }
    fn visit_var_decl_or_expr(&mut self, n: &VarDeclOrExpr, _parent: &dyn Node) {
        self.show("VarDeclOrExpr", n);
        n.visit_children_with(self)
    }
    fn visit_var_decl_or_pat(&mut self, n: &VarDeclOrPat, _parent: &dyn Node) {
        self.show("VarDeclOrPat", n);
        n.visit_children_with(self)
    }
    fn visit_var_declarator(&mut self, n: &VarDeclarator, _parent: &dyn Node) {
        self.show("VarDeclarator", n);
        n.visit_children_with(self)
    }
    fn visit_while_stmt(&mut self, n: &WhileStmt, _parent: &dyn Node) {
        self.show("WhileStmt", n);
        n.visit_children_with(self)
    }
    fn visit_with_stmt(&mut self, n: &WithStmt, _parent: &dyn Node) {
        self.show("WithStmt", n);
        n.visit_children_with(self)
    }
    fn visit_yield_expr(&mut self, n: &YieldExpr, _parent: &dyn Node) {
        self.show("YieldExpr", n);
        n.visit_children_with(self)
    }
}
