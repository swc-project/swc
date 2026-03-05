use std::path::PathBuf;

use swc_common::{
    comments::SingleThreadedComments,
    errors::{DiagnosticBuilder, Handler, Level},
    BytePos, Span,
};
use swc_es_ast::{
    Class, ClassMember, Decl, Expr, Function, JSXElement, ModuleDecl, Pat, Program, Stmt, TsType,
};
use swc_es_parser::{EsSyntax, Syntax, TsSyntax};
use swc_es_visit::{Visit, VisitWith};

mod common;

use common::ecma_reuse::{
    parse_loaded_file_with_syntax_mode, snapshot_path_for, span_of_class_member, span_of_decl,
    span_of_expr, span_of_module_decl, span_of_pat, span_of_program, span_of_stmt, span_of_ts_type,
    ParseMode,
};

fn syntax_for_comments(path: &std::path::Path) -> Syntax {
    match path.extension().and_then(|ext| ext.to_str()) {
        Some("ts") => Syntax::Typescript(TsSyntax {
            decorators: true,
            no_early_errors: true,
            ..Default::default()
        }),
        Some("tsx") => Syntax::Typescript(TsSyntax {
            tsx: true,
            decorators: true,
            no_early_errors: true,
            ..Default::default()
        }),
        _ => Syntax::Es(EsSyntax {
            jsx: false,
            decorators: true,
            decorators_before_export: false,
            export_default_from: true,
            import_attributes: true,
            explicit_resource_management: true,
            ..Default::default()
        }),
    }
}

#[testing::fixture("../swc_ecma_parser/tests/comments/**/input.js")]
fn test(input: PathBuf) {
    let output = testing::run_test(false, |cm, handler| -> Result<(), ()> {
        let fm = cm
            .load_file(&input)
            .unwrap_or_else(|err| panic!("failed to load fixture {}: {err}", input.display()));

        let parsed =
            parse_loaded_file_with_syntax_mode(&fm, syntax_for_comments(&input), ParseMode::Module);

        if let Some(error) = parsed.fatal {
            panic!(
                "comments fixture {} produced fatal parse error: {:?}:{:?}:{}",
                input.display(),
                error.severity(),
                error.code(),
                error.message()
            );
        }

        if !parsed.recovered.is_empty() {
            panic!(
                "comments fixture {} produced parser errors: {:?}",
                input.display(),
                parsed.recovered
            );
        }

        let comments = parsed.comments;
        let parsed = parsed
            .parsed
            .unwrap_or_else(|| panic!("comments fixture {} produced no AST", input.display()));

        let mut printer = CommentPrinter {
            handler,
            comments,
            emitted: false,
        };
        parsed.program.visit_with(&parsed.store, &mut printer);

        if !printer.emitted {
            printer.emit_all_comments_fallback();
        }
        if !printer.emitted {
            DiagnosticBuilder::new(handler, Level::Note, "No comments attached by parser").emit();
        }

        Err(())
    })
    .expect_err("comments fixture should emit note diagnostics");

    output
        .compare_to_file(snapshot_path_for(&input, ".swc-stderr"))
        .unwrap_or_else(|_| panic!("comments snapshot mismatch: {}", input.display()));
}

struct CommentPrinter<'a> {
    handler: &'a Handler,
    comments: SingleThreadedComments,
    emitted: bool,
}

impl CommentPrinter<'_> {
    fn emit_comments_at_span(&mut self, span: Span) {
        let mut emitted = false;

        self.comments.with_leading(span.lo, |comments| {
            for comment in comments {
                DiagnosticBuilder::new(self.handler, Level::Note, "Leading (lo)")
                    .span_note(Span::new_with_checked(span.lo, span.lo), &comment.text)
                    .emit();
                emitted = true;
            }
        });

        self.comments.with_trailing(span.lo, |comments| {
            for comment in comments {
                DiagnosticBuilder::new(self.handler, Level::Note, "Trailing (lo)")
                    .span_note(Span::new_with_checked(span.lo, span.lo), &comment.text)
                    .emit();
                emitted = true;
            }
        });

        if span.hi.0 > 0 {
            let hi_minus_one = span.hi - BytePos(1);
            self.comments.with_leading(hi_minus_one, |comments| {
                for comment in comments {
                    DiagnosticBuilder::new(self.handler, Level::Note, "Leading (hi)")
                        .span_note(
                            Span::new_with_checked(hi_minus_one, hi_minus_one),
                            &comment.text,
                        )
                        .emit();
                    emitted = true;
                }
            });
        }

        self.comments.with_trailing(span.hi, |comments| {
            for comment in comments {
                DiagnosticBuilder::new(self.handler, Level::Note, "Trailing (hi)")
                    .span_note(Span::new_with_checked(span.hi, span.hi), &comment.text)
                    .emit();
                emitted = true;
            }
        });

        if emitted {
            self.emitted = true;
        }
    }

    fn emit_all_comments_fallback(&mut self) {
        let (leading, trailing) = self.comments.borrow_all();

        for comments in leading.values() {
            for comment in comments {
                DiagnosticBuilder::new(self.handler, Level::Note, "Leading (fallback)")
                    .span_note(comment.span, &comment.text)
                    .emit();
                self.emitted = true;
            }
        }

        for comments in trailing.values() {
            for comment in comments {
                DiagnosticBuilder::new(self.handler, Level::Note, "Trailing (fallback)")
                    .span_note(comment.span, &comment.text)
                    .emit();
                self.emitted = true;
            }
        }
    }
}

impl Visit for CommentPrinter<'_> {
    fn visit_program_node(&mut self, _store: &swc_es_ast::AstStore, node: &Program) {
        self.emit_comments_at_span(span_of_program(node));
    }

    fn visit_stmt_node(&mut self, store: &swc_es_ast::AstStore, node: &Stmt) {
        if let Some(span) = span_of_stmt(store, node) {
            self.emit_comments_at_span(span);
        }
    }

    fn visit_decl_node(&mut self, store: &swc_es_ast::AstStore, node: &Decl) {
        if let Some(span) = span_of_decl(store, node) {
            self.emit_comments_at_span(span);
        }
    }

    fn visit_pat_node(&mut self, store: &swc_es_ast::AstStore, node: &Pat) {
        if let Some(span) = span_of_pat(store, node) {
            self.emit_comments_at_span(span);
        }
    }

    fn visit_expr_node(&mut self, store: &swc_es_ast::AstStore, node: &Expr) {
        if let Some(span) = span_of_expr(store, node) {
            self.emit_comments_at_span(span);
        }
    }

    fn visit_module_decl_node(&mut self, store: &swc_es_ast::AstStore, node: &ModuleDecl) {
        if let Some(span) = span_of_module_decl(store, node) {
            self.emit_comments_at_span(span);
        }
    }

    fn visit_function_node(&mut self, _store: &swc_es_ast::AstStore, node: &Function) {
        self.emit_comments_at_span(node.span);
    }

    fn visit_class_node(&mut self, _store: &swc_es_ast::AstStore, node: &Class) {
        self.emit_comments_at_span(node.span);
    }

    fn visit_class_member_node(&mut self, _store: &swc_es_ast::AstStore, node: &ClassMember) {
        self.emit_comments_at_span(span_of_class_member(node));
    }

    fn visit_jsx_element_node(&mut self, _store: &swc_es_ast::AstStore, node: &JSXElement) {
        self.emit_comments_at_span(node.span);
    }

    fn visit_ts_type_node(&mut self, store: &swc_es_ast::AstStore, node: &TsType) {
        if let Some(span) = span_of_ts_type(store, node) {
            self.emit_comments_at_span(span);
        }
    }
}
