use swc_common::{
    comments::{Comment, SingleThreadedComments},
    Loc, DUMMY_SP,
};
pub use swc_common::{SourceMap, Span};
use swc_ecma_ast as ast;
use swc_ecma_visit::{self, Node, Visit, VisitWith};

pub fn analyze_dependencies(
    module: &ast::Module,
    source_map: &SourceMap,
    comments: &SingleThreadedComments,
) -> Vec<DependencyDescriptor> {
    let mut v = DependencyCollector {
        comments,
        source_map,
        items: vec![],
    };
    module.visit_with(&ast::Invalid { span: DUMMY_SP }, &mut v);
    v.items
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DependencyKind {
    Import,
    ImportType,
    Export,
    ExportType,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub struct DependencyDescriptor {
    pub kind: DependencyKind,
    /// A flag indicating if the import is dynamic or not.
    pub is_dynamic: bool,
    /// Any leading comments associated with the dependency.  This is used for
    /// further processing of supported pragma that impact the dependency.
    pub leading_comments: Vec<Comment>,
    /// The location of the import/export statement.
    pub col: usize,
    pub line: usize,
    /// The text specifier associated with the import/export statement.
    pub specifier: String,
}

struct DependencyCollector<'a> {
    comments: &'a SingleThreadedComments,
    pub items: Vec<DependencyDescriptor>,
    source_map: &'a SourceMap,
}

impl<'a> DependencyCollector<'a> {
    fn get_location_and_comments(&self, span: Span) -> (Loc, Vec<Comment>) {
        let location = self.source_map.lookup_char_pos(span.lo);
        let leading_comments = self
            .comments
            .with_leading(span.lo, |comments| comments.to_vec());
        (location, leading_comments)
    }
}

impl<'a> Visit for DependencyCollector<'a> {
    fn visit_import_decl(&mut self, node: &ast::ImportDecl, _parent: &dyn Node) {
        let specifier = node.src.value.to_string();
        let span = node.span;
        let (location, leading_comments) = self.get_location_and_comments(span);
        let kind = if node.type_only {
            DependencyKind::ImportType
        } else {
            DependencyKind::Import
        };
        self.items.push(DependencyDescriptor {
            kind,
            is_dynamic: false,
            leading_comments,
            col: location.col_display,
            line: location.line,
            specifier,
        });
    }

    fn visit_named_export(&mut self, node: &ast::NamedExport, _parent: &dyn Node) {
        if let Some(src) = &node.src {
            let specifier = src.value.to_string();
            let span = node.span;
            let (location, leading_comments) = self.get_location_and_comments(span);
            let kind = if node.type_only {
                DependencyKind::ExportType
            } else {
                DependencyKind::Export
            };
            self.items.push(DependencyDescriptor {
                kind,
                is_dynamic: false,
                leading_comments,
                col: location.col_display,
                line: location.line,
                specifier,
            });
        }
    }

    fn visit_export_all(&mut self, node: &ast::ExportAll, _parent: &dyn Node) {
        let specifier = node.src.value.to_string();
        let span = node.span;
        let (location, leading_comments) = self.get_location_and_comments(span);
        self.items.push(DependencyDescriptor {
            kind: DependencyKind::Export,
            is_dynamic: false,
            leading_comments,
            col: location.col_display,
            line: location.line,
            specifier,
        });
    }

    fn visit_ts_import_type(&mut self, node: &ast::TsImportType, _parent: &dyn Node) {
        let specifier = node.arg.value.to_string();
        let span = node.span;
        let (location, leading_comments) = self.get_location_and_comments(span);
        self.items.push(DependencyDescriptor {
            kind: DependencyKind::ImportType,
            is_dynamic: false,
            leading_comments,
            col: location.col_display,
            line: location.line,
            specifier,
        });
    }

    fn visit_call_expr(&mut self, node: &ast::CallExpr, _parent: &dyn Node) {
        use ast::{Expr::*, ExprOrSuper::*};

        swc_ecma_visit::visit_call_expr(self, node, _parent);
        let call_expr = match node.callee.clone() {
            Super(_) => return,
            Expr(boxed) => boxed,
        };

        match &*call_expr {
            Ident(ident) => {
                if &ident.sym.to_string() != "import" {
                    return;
                }
            }
            _ => return,
        };

        if let Some(arg) = node.args.get(0) {
            if let Lit(lit) = &*arg.expr {
                if let ast::Lit::Str(str_) = lit {
                    let specifier = str_.value.to_string();
                    let span = node.span;
                    let (location, leading_comments) = self.get_location_and_comments(span);
                    self.items.push(DependencyDescriptor {
                        kind: DependencyKind::Import,
                        is_dynamic: true,
                        leading_comments,
                        col: location.col_display,
                        line: location.line,
                        specifier,
                    });
                }
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use swc_common::{
        comments::{Comment, CommentKind},
        sync::Lrc,
        BytePos, FileName, Span, SyntaxContext,
    };
    use swc_ecma_parser::{lexer::Lexer, JscTarget, Parser, StringInput, Syntax, TsConfig};

    fn helper(
        file_name: &str,
        source: &str,
    ) -> Result<(ast::Module, Lrc<SourceMap>, SingleThreadedComments), testing::StdErr> {
        let output = ::testing::run_test(true, |cm, handler| {
            let fm =
                cm.new_source_file(FileName::Custom(file_name.to_string()), source.to_string());

            let comments = SingleThreadedComments::default();
            let lexer: Lexer<StringInput<'_>> = Lexer::new(
                Syntax::Typescript(TsConfig {
                    dts: file_name.ends_with(".d.ts"),
                    tsx: file_name.contains("tsx"),
                    dynamic_import: true,
                    decorators: true,
                    no_early_errors: true,
                    ..Default::default()
                }),
                JscTarget::Es2015,
                (&*fm).into(),
                Some(&comments),
            );

            let mut p = Parser::new_from(lexer);

            let res = p
                .parse_module()
                .map_err(|e| e.into_diagnostic(&handler).emit());

            for err in p.take_errors() {
                err.into_diagnostic(&handler).emit();
            }

            if handler.has_errors() {
                return Err(());
            }

            Ok((res.unwrap(), cm, comments))
        });

        output
    }

    #[test]
    fn test_parsed_module_get_dependencies() {
        let source = r#"import * as bar from "./test.ts";
/** JSDoc */
import type { Foo } from "./foo.d.ts";
/// <reference foo="bar" />
export * as Buzz from "./buzz.ts";
// @some-pragma
/**
 * Foo
 */
export type { Fizz } from "./fizz.d.ts";
const foo = await import("./foo.ts");
      "#;
        let (module, source_map, comments) = helper("test.ts", &source).unwrap();
        let dependencies = analyze_dependencies(&module, &source_map, &comments);
        assert_eq!(dependencies.len(), 5);
        assert_eq!(
            dependencies,
            vec![
                DependencyDescriptor {
                    kind: DependencyKind::Import,
                    is_dynamic: false,
                    leading_comments: Vec::new(),
                    col: 0,
                    line: 1,
                    specifier: "./test.ts".to_owned()
                },
                DependencyDescriptor {
                    kind: DependencyKind::ImportType,
                    is_dynamic: false,
                    leading_comments: vec![Comment {
                        kind: CommentKind::Block,
                        text: r#"* JSDoc "#.to_string(),
                        span: Span::new(BytePos(34), BytePos(46), SyntaxContext::empty()),
                    }],
                    col: 0,
                    line: 3,
                    specifier: "./foo.d.ts".to_owned()
                },
                DependencyDescriptor {
                    kind: DependencyKind::Export,
                    is_dynamic: false,
                    leading_comments: vec![Comment {
                        kind: CommentKind::Line,
                        text: r#"/ <reference foo="bar" />"#.to_string(),
                        span: Span::new(BytePos(86), BytePos(113), SyntaxContext::empty()),
                    }],
                    col: 0,
                    line: 5,
                    specifier: "./buzz.ts".to_owned()
                },
                DependencyDescriptor {
                    kind: DependencyKind::ExportType,
                    is_dynamic: false,
                    leading_comments: vec![
                        Comment {
                            kind: CommentKind::Line,
                            text: r#" @some-pragma"#.to_string(),
                            span: Span::new(BytePos(149), BytePos(164), SyntaxContext::empty()),
                        },
                        Comment {
                            kind: CommentKind::Block,
                            text: "*\n * Foo\n ".to_string(),
                            span: Span::new(BytePos(165), BytePos(179), SyntaxContext::empty()),
                        }
                    ],
                    col: 0,
                    line: 10,
                    specifier: "./fizz.d.ts".to_owned()
                },
                DependencyDescriptor {
                    kind: DependencyKind::Import,
                    is_dynamic: true,
                    leading_comments: Vec::new(),
                    col: 18,
                    line: 11,
                    specifier: "./foo.ts".to_owned()
                }
            ]
        );
    }
}
