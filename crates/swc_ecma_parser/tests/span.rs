use std::path::PathBuf;

use swc_common::{comments::SingleThreadedComments, errors::Handler, Spanned};
use swc_ecma_ast::*;
use swc_ecma_parser::{lexer::Lexer, EsSyntax, Parser, Syntax, TsSyntax};
use swc_ecma_visit::{Visit, VisitWith};

#[testing::fixture("tests/span/**/*.js")]
#[testing::fixture("tests/span/**/*.ts")]
#[testing::fixture("tests/comments/**/*.js")]
fn span(entry: PathBuf) {
    let dir = entry.parent().unwrap().to_path_buf();
    let file_name = entry
        .file_name()
        .unwrap()
        .to_str()
        .expect("to_str() failed")
        .to_string();

    let content = ::testing::run_test(false, |cm, handler| -> Result<(), _> {
        let src = cm.load_file(&entry).expect("failed to load file");

        let comments = SingleThreadedComments::default();
        let lexer = Lexer::new(
            if file_name.ends_with(".js") {
                Syntax::Es(EsSyntax {
                    jsx: true,
                    decorators: true,
                    ..Default::default()
                })
            } else {
                Syntax::Typescript(TsSyntax {
                    tsx: true,
                    decorators: true,
                    no_early_errors: true,
                    ..Default::default()
                })
            },
            Default::default(),
            (&*src).into(),
            Some(&comments),
        );
        let mut parser: Parser<Lexer> = Parser::new_from(lexer);

        {
            let module = parser
                .parse_module()
                .map_err(|e| e.into_diagnostic(handler).emit())?;

            Shower { handler }.visit_module(&module);
        }

        Err(())
    })
    .expect_err("failed to run test");

    let ref_file = format!("{}.span.swc-stderr", dir.join(&file_name).display());

    content.compare_to_file(ref_file).unwrap();
}

struct Shower<'a> {
    handler: &'a Handler,
}

impl Shower<'_> {
    fn show(&self, name: &str, node: &dyn Spanned) {
        let span = node.span();

        self.handler.struct_span_err(span, name).emit();
    }
}

impl Visit for Shower<'_> {
    fn visit_array_lit(&mut self, n: &ArrayLit) {
        self.show("ArrayLit", n);
        n.visit_children_with(self)
    }

    fn visit_array_pat(&mut self, n: &ArrayPat) {
        self.show("ArrayPat", n);
        n.visit_children_with(self)
    }

    fn visit_arrow_expr(&mut self, n: &ArrowExpr) {
        self.show("ArrowExpr", n);
        n.visit_children_with(self)
    }

    fn visit_assign_expr(&mut self, n: &AssignExpr) {
        self.show("AssignExpr", n);
        n.visit_children_with(self)
    }

    fn visit_assign_pat(&mut self, n: &AssignPat) {
        self.show("AssignPat", n);
        n.visit_children_with(self)
    }

    fn visit_assign_pat_prop(&mut self, n: &AssignPatProp) {
        self.show("AssignPatProp", n);
        n.visit_children_with(self)
    }

    fn visit_assign_prop(&mut self, n: &AssignProp) {
        self.show("AssignProp", n);
        n.visit_children_with(self)
    }

    fn visit_await_expr(&mut self, n: &AwaitExpr) {
        self.show("AwaitExpr", n);
        n.visit_children_with(self)
    }

    fn visit_bin_expr(&mut self, n: &BinExpr) {
        self.show("BinExpr", n);
        n.visit_children_with(self)
    }

    fn visit_block_stmt(&mut self, n: &BlockStmt) {
        self.show("BlockStmt", n);
        n.visit_children_with(self)
    }

    fn visit_block_stmt_or_expr(&mut self, n: &BlockStmtOrExpr) {
        self.show("BlockStmtOrExpr", n);
        n.visit_children_with(self)
    }

    fn visit_bool(&mut self, n: &Bool) {
        self.show("Bool", n);
        n.visit_children_with(self)
    }

    fn visit_break_stmt(&mut self, n: &BreakStmt) {
        self.show("BreakStmt", n);
        n.visit_children_with(self)
    }

    fn visit_call_expr(&mut self, n: &CallExpr) {
        self.show("CallExpr", n);
        n.visit_children_with(self)
    }

    fn visit_catch_clause(&mut self, n: &CatchClause) {
        self.show("CatchClause", n);
        n.visit_children_with(self)
    }

    fn visit_class(&mut self, n: &Class) {
        self.show("Class", n);
        n.visit_children_with(self)
    }

    fn visit_class_decl(&mut self, n: &ClassDecl) {
        self.show("ClassDecl", n);
        n.visit_children_with(self)
    }

    fn visit_class_expr(&mut self, n: &ClassExpr) {
        self.show("ClassExpr", n);
        n.visit_children_with(self)
    }

    fn visit_class_member(&mut self, n: &ClassMember) {
        self.show("ClassMember", n);
        n.visit_children_with(self)
    }

    fn visit_class_method(&mut self, n: &ClassMethod) {
        self.show("ClassMethod", n);
        n.visit_children_with(self)
    }

    fn visit_class_prop(&mut self, n: &ClassProp) {
        self.show("ClassProp", n);
        n.visit_children_with(self)
    }

    fn visit_computed_prop_name(&mut self, n: &ComputedPropName) {
        self.show("ComputedPropName", n);
        n.visit_children_with(self)
    }

    fn visit_cond_expr(&mut self, n: &CondExpr) {
        self.show("CondExpr", n);
        n.visit_children_with(self)
    }

    fn visit_constructor(&mut self, n: &Constructor) {
        self.show("Constructor", n);
        n.visit_children_with(self)
    }

    fn visit_continue_stmt(&mut self, n: &ContinueStmt) {
        self.show("ContinueStmt", n);
        n.visit_children_with(self)
    }

    fn visit_debugger_stmt(&mut self, n: &DebuggerStmt) {
        self.show("DebuggerStmt", n);
        n.visit_children_with(self)
    }

    fn visit_decl(&mut self, n: &Decl) {
        self.show("Decl", n);
        n.visit_children_with(self)
    }

    fn visit_decorator(&mut self, n: &Decorator) {
        self.show("Decorator", n);
        n.visit_children_with(self)
    }

    fn visit_default_decl(&mut self, n: &DefaultDecl) {
        self.show("DefaultDecl", n);
        n.visit_children_with(self)
    }

    fn visit_do_while_stmt(&mut self, n: &DoWhileStmt) {
        self.show("DoWhileStmt", n);
        n.visit_children_with(self)
    }

    fn visit_empty_stmt(&mut self, n: &EmptyStmt) {
        self.show("EmptyStmt", n);
        n.visit_children_with(self)
    }

    fn visit_export_all(&mut self, n: &ExportAll) {
        self.show("ExportAll", n);
        n.visit_children_with(self)
    }

    fn visit_export_decl(&mut self, n: &ExportDecl) {
        self.show("ExportDecl", n);
        n.visit_children_with(self)
    }

    fn visit_export_default_decl(&mut self, n: &ExportDefaultDecl) {
        self.show("ExportDefaultDecl", n);
        n.visit_children_with(self)
    }

    fn visit_export_default_expr(&mut self, n: &ExportDefaultExpr) {
        self.show("ExportDefaultExpr", n);
        n.visit_children_with(self)
    }

    fn visit_export_default_specifier(&mut self, n: &ExportDefaultSpecifier) {
        self.show("ExportDefaultSpecifier", n);
        n.visit_children_with(self)
    }

    fn visit_export_named_specifier(&mut self, n: &ExportNamedSpecifier) {
        self.show("ExportNamedSpecifier", n);
        n.visit_children_with(self)
    }

    fn visit_export_namespace_specifier(&mut self, n: &ExportNamespaceSpecifier) {
        self.show("ExportNamespaceSpecifier", n);
        n.visit_children_with(self)
    }

    fn visit_export_specifier(&mut self, n: &ExportSpecifier) {
        self.show("ExportSpecifier", n);
        n.visit_children_with(self)
    }

    fn visit_expr(&mut self, n: &Expr) {
        self.show("Expr", n);
        n.visit_children_with(self)
    }

    fn visit_expr_or_spread(&mut self, n: &ExprOrSpread) {
        self.show("ExprOrSpread", n);
        n.visit_children_with(self)
    }

    fn visit_callee(&mut self, n: &Callee) {
        self.show("Callee", n);
        n.visit_children_with(self)
    }

    fn visit_expr_stmt(&mut self, n: &ExprStmt) {
        self.show("ExprStmt", n);
        n.visit_children_with(self)
    }

    fn visit_fn_decl(&mut self, n: &FnDecl) {
        self.show("FnDecl", n);
        n.visit_children_with(self)
    }

    fn visit_fn_expr(&mut self, n: &FnExpr) {
        self.show("FnExpr", n);
        n.visit_children_with(self)
    }

    fn visit_for_in_stmt(&mut self, n: &ForInStmt) {
        self.show("ForInStmt", n);
        n.visit_children_with(self)
    }

    fn visit_for_of_stmt(&mut self, n: &ForOfStmt) {
        self.show("ForOfStmt", n);
        n.visit_children_with(self)
    }

    fn visit_for_stmt(&mut self, n: &ForStmt) {
        self.show("ForStmt", n);
        n.visit_children_with(self)
    }

    fn visit_function(&mut self, n: &Function) {
        self.show("Function", n);
        n.visit_children_with(self)
    }

    fn visit_getter_prop(&mut self, n: &GetterProp) {
        self.show("GetterProp", n);
        n.visit_children_with(self)
    }

    fn visit_ident(&mut self, n: &Ident) {
        self.show("Ident", n);
        n.visit_children_with(self)
    }

    fn visit_if_stmt(&mut self, n: &IfStmt) {
        self.show("IfStmt", n);
        n.visit_children_with(self)
    }

    fn visit_import_decl(&mut self, n: &ImportDecl) {
        self.show("ImportDecl", n);
        n.visit_children_with(self)
    }

    fn visit_import_default_specifier(&mut self, n: &ImportDefaultSpecifier) {
        self.show("ImportDefaultSpecifier", n);
        n.visit_children_with(self)
    }

    fn visit_import_named_specifier(&mut self, n: &ImportNamedSpecifier) {
        self.show("ImportNamedSpecifier", n);
        n.visit_children_with(self)
    }

    fn visit_import_specifier(&mut self, n: &ImportSpecifier) {
        self.show("ImportSpecifier", n);
        n.visit_children_with(self)
    }

    fn visit_import_star_as_specifier(&mut self, n: &ImportStarAsSpecifier) {
        self.show("ImportStarAsSpecifier", n);
        n.visit_children_with(self)
    }

    fn visit_invalid(&mut self, n: &Invalid) {
        self.show("Invalid", n);
        n.visit_children_with(self)
    }

    fn visit_jsx_attr(&mut self, n: &JSXAttr) {
        self.show("JSXAttr", n);
        n.visit_children_with(self)
    }

    fn visit_jsx_attr_name(&mut self, n: &JSXAttrName) {
        self.show("JSXAttrName", n);
        n.visit_children_with(self)
    }

    fn visit_jsx_attr_or_spread(&mut self, n: &JSXAttrOrSpread) {
        self.show("JSXAttrOrSpread", n);
        n.visit_children_with(self)
    }

    fn visit_jsx_attr_value(&mut self, n: &JSXAttrValue) {
        self.show("JSXAttrValue", n);
        n.visit_children_with(self)
    }

    fn visit_jsx_closing_element(&mut self, n: &JSXClosingElement) {
        self.show("JSXClosingElement", n);
        n.visit_children_with(self)
    }

    fn visit_jsx_closing_fragment(&mut self, n: &JSXClosingFragment) {
        self.show("JSXClosingFragment", n);
        n.visit_children_with(self)
    }

    fn visit_jsx_element(&mut self, n: &JSXElement) {
        self.show("JSXElement", n);
        n.visit_children_with(self)
    }

    fn visit_jsx_element_child(&mut self, n: &JSXElementChild) {
        self.show("JSXElementChild", n);
        n.visit_children_with(self)
    }

    fn visit_jsx_element_name(&mut self, n: &JSXElementName) {
        self.show("JSXElementName", n);
        n.visit_children_with(self)
    }

    fn visit_jsx_empty_expr(&mut self, n: &JSXEmptyExpr) {
        self.show("JSXEmptyExpr", n);
        n.visit_children_with(self)
    }

    fn visit_jsx_expr(&mut self, n: &JSXExpr) {
        self.show("JSXExpr", n);
        n.visit_children_with(self)
    }

    fn visit_jsx_expr_container(&mut self, n: &JSXExprContainer) {
        self.show("JSXExprContainer", n);
        n.visit_children_with(self)
    }

    fn visit_jsx_fragment(&mut self, n: &JSXFragment) {
        self.show("JSXFragment", n);
        n.visit_children_with(self)
    }

    fn visit_jsx_member_expr(&mut self, n: &JSXMemberExpr) {
        self.show("JSXMemberExpr", n);
        n.visit_children_with(self)
    }

    fn visit_jsx_namespaced_name(&mut self, n: &JSXNamespacedName) {
        self.show("JSXNamespacedName", n);
        n.visit_children_with(self)
    }

    fn visit_jsx_object(&mut self, n: &JSXObject) {
        self.show("JSXObject", n);
        n.visit_children_with(self)
    }

    fn visit_jsx_opening_element(&mut self, n: &JSXOpeningElement) {
        self.show("JSXOpeningElement", n);
        n.visit_children_with(self)
    }

    fn visit_jsx_opening_fragment(&mut self, n: &JSXOpeningFragment) {
        self.show("JSXOpeningFragment", n);
        n.visit_children_with(self)
    }

    fn visit_jsx_spread_child(&mut self, n: &JSXSpreadChild) {
        self.show("JSXSpreadChild", n);
        n.visit_children_with(self)
    }

    fn visit_jsx_text(&mut self, n: &JSXText) {
        self.show("JSXText", n);
        n.visit_children_with(self)
    }

    fn visit_key_value_pat_prop(&mut self, n: &KeyValuePatProp) {
        self.show("KeyValuePatProp", n);
        n.visit_children_with(self)
    }

    fn visit_key_value_prop(&mut self, n: &KeyValueProp) {
        self.show("KeyValueProp", n);
        n.visit_children_with(self)
    }

    fn visit_labeled_stmt(&mut self, n: &LabeledStmt) {
        self.show("LabeledStmt", n);
        n.visit_children_with(self)
    }

    fn visit_lit(&mut self, n: &Lit) {
        self.show("Lit", n);
        n.visit_children_with(self)
    }

    fn visit_member_expr(&mut self, n: &MemberExpr) {
        self.show("MemberExpr", n);
        n.visit_children_with(self)
    }

    fn visit_meta_prop_expr(&mut self, n: &MetaPropExpr) {
        self.show("MetaPropExpr", n);
        n.visit_children_with(self)
    }

    fn visit_method_prop(&mut self, n: &MethodProp) {
        self.show("MethodProp", n);
        n.visit_children_with(self)
    }

    fn visit_module(&mut self, n: &Module) {
        self.show("Module", n);
        n.visit_children_with(self)
    }

    fn visit_module_decl(&mut self, n: &ModuleDecl) {
        self.show("ModuleDecl", n);
        n.visit_children_with(self)
    }

    fn visit_module_item(&mut self, n: &ModuleItem) {
        self.show("ModuleItem", n);
        n.visit_children_with(self)
    }

    fn visit_named_export(&mut self, n: &NamedExport) {
        self.show("NamedExport", n);
        n.visit_children_with(self)
    }

    fn visit_new_expr(&mut self, n: &NewExpr) {
        self.show("NewExpr", n);
        n.visit_children_with(self)
    }

    fn visit_null(&mut self, n: &Null) {
        self.show("Null", n);
        n.visit_children_with(self)
    }

    fn visit_number(&mut self, n: &Number) {
        self.show("Number", n);
        n.visit_children_with(self)
    }

    fn visit_object_lit(&mut self, n: &ObjectLit) {
        self.show("ObjectLit", n);
        n.visit_children_with(self)
    }

    fn visit_object_pat(&mut self, n: &ObjectPat) {
        self.show("ObjectPat", n);
        n.visit_children_with(self)
    }

    fn visit_object_pat_prop(&mut self, n: &ObjectPatProp) {
        self.show("ObjectPatProp", n);
        n.visit_children_with(self)
    }

    fn visit_opt_chain_expr(&mut self, n: &OptChainExpr) {
        self.show("OptChainExpr", n);
        n.visit_children_with(self)
    }

    fn visit_opt_chain_base(&mut self, n: &OptChainBase) {
        self.show("OptChainBase", n);
        n.visit_children_with(self)
    }

    fn visit_opt_call(&mut self, n: &OptCall) {
        self.show("OptCall", n);
        n.visit_children_with(self)
    }

    fn visit_param(&mut self, n: &Param) {
        self.show("Param", n);
        n.visit_children_with(self)
    }

    fn visit_param_or_ts_param_prop(&mut self, n: &ParamOrTsParamProp) {
        self.show("ParamOrTsParamProp", n);
        n.visit_children_with(self)
    }

    fn visit_paren_expr(&mut self, n: &ParenExpr) {
        self.show("ParenExpr", n);
        n.visit_children_with(self)
    }

    fn visit_pat(&mut self, n: &Pat) {
        self.show("Pat", n);
        n.visit_children_with(self)
    }

    fn visit_assign_target(&mut self, n: &AssignTarget) {
        self.show("AssignTarget", n);
        n.visit_children_with(self)
    }

    fn visit_private_method(&mut self, n: &PrivateMethod) {
        self.show("PrivateMethod", n);
        n.visit_children_with(self)
    }

    fn visit_private_name(&mut self, n: &PrivateName) {
        self.show("PrivateName", n);
        n.visit_children_with(self)
    }

    fn visit_private_prop(&mut self, n: &PrivateProp) {
        self.show("PrivateProp", n);
        n.visit_children_with(self)
    }

    fn visit_program(&mut self, n: &Program) {
        self.show("Program", n);
        n.visit_children_with(self)
    }

    fn visit_prop(&mut self, n: &Prop) {
        self.show("Prop", n);
        n.visit_children_with(self)
    }

    fn visit_prop_name(&mut self, n: &PropName) {
        self.show("PropName", n);
        n.visit_children_with(self)
    }

    fn visit_prop_or_spread(&mut self, n: &PropOrSpread) {
        self.show("PropOrSpread", n);
        n.visit_children_with(self)
    }

    fn visit_regex(&mut self, n: &Regex) {
        self.show("Regex", n);
        n.visit_children_with(self)
    }

    fn visit_rest_pat(&mut self, n: &RestPat) {
        self.show("RestPat", n);
        n.visit_children_with(self)
    }

    fn visit_return_stmt(&mut self, n: &ReturnStmt) {
        self.show("ReturnStmt", n);
        n.visit_children_with(self)
    }

    fn visit_script(&mut self, n: &Script) {
        self.show("Script", n);
        n.visit_children_with(self)
    }

    fn visit_seq_expr(&mut self, n: &SeqExpr) {
        self.show("SeqExpr", n);
        n.visit_children_with(self)
    }

    fn visit_setter_prop(&mut self, n: &SetterProp) {
        self.show("SetterProp", n);
        n.visit_children_with(self)
    }

    fn visit_spread_element(&mut self, n: &SpreadElement) {
        self.show("SpreadElement", n);
        n.visit_children_with(self)
    }

    fn visit_stmt(&mut self, n: &Stmt) {
        self.show("Stmt", n);
        n.visit_children_with(self)
    }

    fn visit_str(&mut self, n: &Str) {
        self.show("Str", n);
        n.visit_children_with(self)
    }

    fn visit_super(&mut self, n: &Super) {
        self.show("Super", n);
        n.visit_children_with(self)
    }

    fn visit_switch_case(&mut self, n: &SwitchCase) {
        self.show("SwitchCase", n);
        n.visit_children_with(self)
    }

    fn visit_switch_stmt(&mut self, n: &SwitchStmt) {
        self.show("SwitchStmt", n);
        n.visit_children_with(self)
    }

    fn visit_tagged_tpl(&mut self, n: &TaggedTpl) {
        self.show("TaggedTpl", n);
        n.visit_children_with(self)
    }

    fn visit_this_expr(&mut self, n: &ThisExpr) {
        self.show("ThisExpr", n);
        n.visit_children_with(self)
    }

    fn visit_throw_stmt(&mut self, n: &ThrowStmt) {
        self.show("ThrowStmt", n);
        n.visit_children_with(self)
    }

    fn visit_tpl(&mut self, n: &Tpl) {
        self.show("Tpl", n);
        n.visit_children_with(self)
    }

    fn visit_tpl_element(&mut self, n: &TplElement) {
        self.show("TplElement", n);
        n.visit_children_with(self)
    }

    fn visit_try_stmt(&mut self, n: &TryStmt) {
        self.show("TryStmt", n);
        n.visit_children_with(self)
    }

    fn visit_ts_array_type(&mut self, n: &TsArrayType) {
        self.show("TsArrayType", n);
        n.visit_children_with(self)
    }

    fn visit_ts_as_expr(&mut self, n: &TsAsExpr) {
        self.show("TsAsExpr", n);
        n.visit_children_with(self)
    }

    fn visit_ts_call_signature_decl(&mut self, n: &TsCallSignatureDecl) {
        self.show("TsCallSignatureDecl", n);
        n.visit_children_with(self)
    }

    fn visit_ts_conditional_type(&mut self, n: &TsConditionalType) {
        self.show("TsConditionalType", n);
        n.visit_children_with(self)
    }

    fn visit_ts_const_assertion(&mut self, n: &TsConstAssertion) {
        self.show("TsConstAssertion", n);
        n.visit_children_with(self)
    }

    fn visit_ts_construct_signature_decl(&mut self, n: &TsConstructSignatureDecl) {
        self.show("TsConstructSignatureDecl", n);
        n.visit_children_with(self)
    }

    fn visit_ts_constructor_type(&mut self, n: &TsConstructorType) {
        self.show("TsConstructorType", n);
        n.visit_children_with(self)
    }

    fn visit_ts_entity_name(&mut self, n: &TsEntityName) {
        self.show("TsEntityName", n);
        n.visit_children_with(self)
    }

    fn visit_ts_enum_decl(&mut self, n: &TsEnumDecl) {
        self.show("TsEnumDecl", n);
        n.visit_children_with(self)
    }

    fn visit_ts_enum_member(&mut self, n: &TsEnumMember) {
        self.show("TsEnumMember", n);
        n.visit_children_with(self)
    }

    fn visit_ts_enum_member_id(&mut self, n: &TsEnumMemberId) {
        self.show("TsEnumMemberId", n);
        n.visit_children_with(self)
    }

    fn visit_ts_export_assignment(&mut self, n: &TsExportAssignment) {
        self.show("TsExportAssignment", n);
        n.visit_children_with(self)
    }

    fn visit_ts_expr_with_type_args(&mut self, n: &TsExprWithTypeArgs) {
        self.show("TsExprWithTypeArgs", n);
        n.visit_children_with(self)
    }

    fn visit_ts_external_module_ref(&mut self, n: &TsExternalModuleRef) {
        self.show("TsExternalModuleRef", n);
        n.visit_children_with(self)
    }

    fn visit_ts_fn_or_constructor_type(&mut self, n: &TsFnOrConstructorType) {
        self.show("TsFnOrConstructorType", n);
        n.visit_children_with(self)
    }

    fn visit_ts_fn_param(&mut self, n: &TsFnParam) {
        self.show("TsFnParam", n);
        n.visit_children_with(self)
    }

    fn visit_ts_fn_type(&mut self, n: &TsFnType) {
        self.show("TsFnType", n);
        n.visit_children_with(self)
    }

    fn visit_ts_import_equals_decl(&mut self, n: &TsImportEqualsDecl) {
        self.show("TsImportEqualsDecl", n);
        n.visit_children_with(self)
    }

    fn visit_ts_import_type(&mut self, n: &TsImportType) {
        self.show("TsImportType", n);
        n.visit_children_with(self)
    }

    fn visit_ts_index_signature(&mut self, n: &TsIndexSignature) {
        self.show("TsIndexSignature", n);
        n.visit_children_with(self)
    }

    fn visit_ts_indexed_access_type(&mut self, n: &TsIndexedAccessType) {
        self.show("TsIndexedAccessType", n);
        n.visit_children_with(self)
    }

    fn visit_ts_infer_type(&mut self, n: &TsInferType) {
        self.show("TsInferType", n);
        n.visit_children_with(self)
    }

    fn visit_ts_interface_body(&mut self, n: &TsInterfaceBody) {
        self.show("TsInterfaceBody", n);
        n.visit_children_with(self)
    }

    fn visit_ts_interface_decl(&mut self, n: &TsInterfaceDecl) {
        self.show("TsInterfaceDecl", n);
        n.visit_children_with(self)
    }

    fn visit_ts_intersection_type(&mut self, n: &TsIntersectionType) {
        self.show("TsIntersectionType", n);
        n.visit_children_with(self)
    }

    fn visit_ts_keyword_type(&mut self, n: &TsKeywordType) {
        self.show("TsKeywordType", n);
        n.visit_children_with(self)
    }

    fn visit_ts_lit(&mut self, n: &TsLit) {
        self.show("TsLit", n);
        n.visit_children_with(self)
    }

    fn visit_ts_lit_type(&mut self, n: &TsLitType) {
        self.show("TsLitType", n);
        n.visit_children_with(self)
    }

    fn visit_ts_mapped_type(&mut self, n: &TsMappedType) {
        self.show("TsMappedType", n);
        n.visit_children_with(self)
    }

    fn visit_ts_method_signature(&mut self, n: &TsMethodSignature) {
        self.show("TsMethodSignature", n);
        n.visit_children_with(self)
    }

    fn visit_ts_module_block(&mut self, n: &TsModuleBlock) {
        self.show("TsModuleBlock", n);
        n.visit_children_with(self)
    }

    fn visit_ts_module_decl(&mut self, n: &TsModuleDecl) {
        self.show("TsModuleDecl", n);
        n.visit_children_with(self)
    }

    fn visit_ts_module_name(&mut self, n: &TsModuleName) {
        self.show("TsModuleName", n);
        n.visit_children_with(self)
    }

    fn visit_ts_module_ref(&mut self, n: &TsModuleRef) {
        self.show("TsModuleRef", n);
        n.visit_children_with(self)
    }

    fn visit_ts_namespace_body(&mut self, n: &TsNamespaceBody) {
        self.show("TsNamespaceBody", n);
        n.visit_children_with(self)
    }

    fn visit_ts_namespace_decl(&mut self, n: &TsNamespaceDecl) {
        self.show("TsNamespaceDecl", n);
        n.visit_children_with(self)
    }

    fn visit_ts_namespace_export_decl(&mut self, n: &TsNamespaceExportDecl) {
        self.show("TsNamespaceExportDecl", n);
        n.visit_children_with(self)
    }

    fn visit_ts_non_null_expr(&mut self, n: &TsNonNullExpr) {
        self.show("TsNonNullExpr", n);
        n.visit_children_with(self)
    }

    fn visit_ts_optional_type(&mut self, n: &TsOptionalType) {
        self.show("TsOptionalType", n);
        n.visit_children_with(self)
    }

    fn visit_ts_param_prop(&mut self, n: &TsParamProp) {
        self.show("TsParamProp", n);
        n.visit_children_with(self)
    }

    fn visit_ts_param_prop_param(&mut self, n: &TsParamPropParam) {
        self.show("TsParamPropParam", n);
        n.visit_children_with(self)
    }

    fn visit_ts_parenthesized_type(&mut self, n: &TsParenthesizedType) {
        self.show("TsParenthesizedType", n);
        n.visit_children_with(self)
    }

    fn visit_ts_property_signature(&mut self, n: &TsPropertySignature) {
        self.show("TsPropertySignature", n);
        n.visit_children_with(self)
    }

    fn visit_ts_qualified_name(&mut self, n: &TsQualifiedName) {
        self.show("TsQualifiedName", n);
        n.visit_children_with(self)
    }

    fn visit_ts_rest_type(&mut self, n: &TsRestType) {
        self.show("TsRestType", n);
        n.visit_children_with(self)
    }

    fn visit_ts_this_type(&mut self, n: &TsThisType) {
        self.show("TsThisType", n);
        n.visit_children_with(self)
    }

    fn visit_ts_this_type_or_ident(&mut self, n: &TsThisTypeOrIdent) {
        self.show("TsThisTypeOrIdent", n);
        n.visit_children_with(self)
    }

    fn visit_ts_tuple_element(&mut self, n: &TsTupleElement) {
        self.show("TsTupleElement", n);
        n.visit_children_with(self)
    }

    fn visit_ts_tuple_type(&mut self, n: &TsTupleType) {
        self.show("TsTupleType", n);
        n.visit_children_with(self)
    }

    fn visit_ts_type(&mut self, n: &TsType) {
        self.show("TsType", n);
        n.visit_children_with(self)
    }

    fn visit_ts_type_alias_decl(&mut self, n: &TsTypeAliasDecl) {
        self.show("TsTypeAliasDecl", n);
        n.visit_children_with(self)
    }

    fn visit_ts_type_ann(&mut self, n: &TsTypeAnn) {
        self.show("TsTypeAnn", n);
        n.visit_children_with(self)
    }

    fn visit_ts_type_assertion(&mut self, n: &TsTypeAssertion) {
        self.show("TsTypeAssertion", n);
        n.visit_children_with(self)
    }

    fn visit_ts_type_element(&mut self, n: &TsTypeElement) {
        self.show("TsTypeElement", n);
        n.visit_children_with(self)
    }

    fn visit_ts_type_lit(&mut self, n: &TsTypeLit) {
        self.show("TsTypeLit", n);
        n.visit_children_with(self)
    }

    fn visit_ts_type_operator(&mut self, n: &TsTypeOperator) {
        self.show("TsTypeOperator", n);
        n.visit_children_with(self)
    }

    fn visit_ts_type_param(&mut self, n: &TsTypeParam) {
        self.show("TsTypeParam", n);
        n.visit_children_with(self)
    }

    fn visit_ts_type_param_decl(&mut self, n: &TsTypeParamDecl) {
        self.show("TsTypeParamDecl", n);
        n.visit_children_with(self)
    }

    fn visit_ts_type_param_instantiation(&mut self, n: &TsTypeParamInstantiation) {
        self.show("TsTypeParamInstantiation", n);
        n.visit_children_with(self)
    }

    fn visit_ts_type_predicate(&mut self, n: &TsTypePredicate) {
        self.show("TsTypePredicate", n);
        n.visit_children_with(self)
    }

    fn visit_ts_type_query(&mut self, n: &TsTypeQuery) {
        self.show("TsTypeQuery", n);
        n.visit_children_with(self)
    }

    fn visit_ts_type_query_expr(&mut self, n: &TsTypeQueryExpr) {
        self.show("TsTypeQueryExpr", n);
        n.visit_children_with(self)
    }

    fn visit_ts_type_ref(&mut self, n: &TsTypeRef) {
        self.show("TsTypeRef", n);
        n.visit_children_with(self)
    }

    fn visit_ts_union_or_intersection_type(&mut self, n: &TsUnionOrIntersectionType) {
        self.show("TsUnionOrIntersectionType", n);
        n.visit_children_with(self)
    }

    fn visit_ts_union_type(&mut self, n: &TsUnionType) {
        self.show("TsUnionType", n);
        n.visit_children_with(self)
    }

    fn visit_unary_expr(&mut self, n: &UnaryExpr) {
        self.show("UnaryExpr", n);
        n.visit_children_with(self)
    }

    fn visit_update_expr(&mut self, n: &UpdateExpr) {
        self.show("UpdateExpr", n);
        n.visit_children_with(self)
    }

    fn visit_var_decl(&mut self, n: &VarDecl) {
        self.show("VarDecl", n);
        n.visit_children_with(self)
    }

    fn visit_var_decl_or_expr(&mut self, n: &VarDeclOrExpr) {
        self.show("VarDeclOrExpr", n);
        n.visit_children_with(self)
    }

    fn visit_for_head(&mut self, n: &ForHead) {
        self.show("ForHead", n);
        n.visit_children_with(self)
    }

    fn visit_var_declarator(&mut self, n: &VarDeclarator) {
        self.show("VarDeclarator", n);
        n.visit_children_with(self)
    }

    fn visit_while_stmt(&mut self, n: &WhileStmt) {
        self.show("WhileStmt", n);
        n.visit_children_with(self)
    }

    fn visit_with_stmt(&mut self, n: &WithStmt) {
        self.show("WithStmt", n);
        n.visit_children_with(self)
    }

    fn visit_yield_expr(&mut self, n: &YieldExpr) {
        self.show("YieldExpr", n);
        n.visit_children_with(self)
    }
}
