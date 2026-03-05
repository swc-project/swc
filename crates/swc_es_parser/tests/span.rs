use std::path::PathBuf;

use swc_common::{errors::Handler, Span};
use swc_es_ast::{
    Class, ClassMember, Decl, Expr, Function, JSXElement, ModuleDecl, Pat, Program, Stmt, TsType,
};
use swc_es_visit::{Visit, VisitWith};

mod common;

use common::ecma_reuse::{
    category_for_path, class_member_label, decl_label, expr_label, module_decl_label,
    parse_loaded_file, pat_label, snapshot_path_for, span_of_class_member, span_of_decl,
    span_of_expr, span_of_module_decl, span_of_pat, span_of_program, span_of_stmt, span_of_ts_type,
    stmt_label, ts_type_label, Case,
};

#[testing::fixture("../swc_ecma_parser/tests/span/**/*.js")]
#[testing::fixture("../swc_ecma_parser/tests/span/**/*.ts")]
#[testing::fixture("../swc_ecma_parser/tests/comments/**/*.js")]
fn span(entry: PathBuf) {
    let category = category_for_path(&entry);
    let case = Case {
        path: entry.clone(),
        category,
    };

    let output = testing::run_test(false, |cm, handler| -> Result<(), ()> {
        let fm = cm
            .load_file(&entry)
            .unwrap_or_else(|err| panic!("failed to load fixture {}: {err}", entry.display()));
        let parsed = parse_loaded_file(&fm, &case);

        let mut had_parser_error = false;
        for error in parsed.recovered {
            had_parser_error = true;
            error.into_diagnostic(handler).emit();
        }
        if let Some(error) = parsed.fatal {
            had_parser_error = true;
            error.into_diagnostic(handler).emit();
        }

        if had_parser_error {
            return Err(());
        }

        let parsed = parsed
            .parsed
            .unwrap_or_else(|| panic!("span fixture {} produced no AST", entry.display()));

        let mut shower = SpanShower { handler };
        parsed.program.visit_with(&parsed.store, &mut shower);

        Err(())
    })
    .expect_err("span fixture should emit diagnostics");

    output
        .compare_to_file(snapshot_path_for(&entry, ".span.swc-stderr"))
        .unwrap_or_else(|_| panic!("span snapshot mismatch: {}", entry.display()));
}

struct SpanShower<'a> {
    handler: &'a Handler,
}

impl SpanShower<'_> {
    fn show(&self, label: &str, span: Span) {
        self.handler.struct_span_err(span, label).emit();
    }
}

impl Visit for SpanShower<'_> {
    fn visit_program_node(&mut self, _store: &swc_es_ast::AstStore, node: &Program) {
        self.show("Program", span_of_program(node));
    }

    fn visit_stmt_node(&mut self, store: &swc_es_ast::AstStore, node: &Stmt) {
        if let Some(span) = span_of_stmt(store, node) {
            self.show(stmt_label(node), span);
        }
    }

    fn visit_decl_node(&mut self, store: &swc_es_ast::AstStore, node: &Decl) {
        if let Some(span) = span_of_decl(store, node) {
            self.show(decl_label(node), span);
        }
    }

    fn visit_pat_node(&mut self, store: &swc_es_ast::AstStore, node: &Pat) {
        if let Some(span) = span_of_pat(store, node) {
            self.show(pat_label(node), span);
        }
    }

    fn visit_expr_node(&mut self, store: &swc_es_ast::AstStore, node: &Expr) {
        if let Some(span) = span_of_expr(store, node) {
            self.show(expr_label(node), span);
        }
    }

    fn visit_module_decl_node(&mut self, store: &swc_es_ast::AstStore, node: &ModuleDecl) {
        if let Some(span) = span_of_module_decl(store, node) {
            self.show(module_decl_label(node), span);
        }
    }

    fn visit_function_node(&mut self, _store: &swc_es_ast::AstStore, node: &Function) {
        self.show("Function", node.span);
    }

    fn visit_class_node(&mut self, _store: &swc_es_ast::AstStore, node: &Class) {
        self.show("Class", node.span);
    }

    fn visit_class_member_node(&mut self, _store: &swc_es_ast::AstStore, node: &ClassMember) {
        self.show(class_member_label(node), span_of_class_member(node));
    }

    fn visit_jsx_element_node(&mut self, _store: &swc_es_ast::AstStore, node: &JSXElement) {
        self.show("JSXElement", node.span);
    }

    fn visit_ts_type_node(&mut self, store: &swc_es_ast::AstStore, node: &TsType) {
        if let Some(span) = span_of_ts_type(store, node) {
            self.show(ts_type_label(node), span);
        }
    }
}
