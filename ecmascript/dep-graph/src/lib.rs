use swc_atoms::JsWord;
use swc_common::{
    comments::{Comment, SingleThreadedComments},
    Loc, SourceMap, Span, DUMMY_SP,
};
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
        is_top_level: true,
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
    Require,
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
    pub specifier: JsWord,
}

struct DependencyCollector<'a> {
    comments: &'a SingleThreadedComments,
    pub items: Vec<DependencyDescriptor>,
    source_map: &'a SourceMap,
    // This field is used to determine if currently visited "require"
    // is top level and "static", or inside module body and "dynamic".
    is_top_level: bool,
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
        let specifier = node.src.value.clone();
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
            let specifier = src.value.clone();
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
        let specifier = node.src.value.clone();
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
        let specifier = node.arg.value.clone();
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

    fn visit_module_items(&mut self, items: &[ast::ModuleItem], _parent: &dyn Node) {
        swc_ecma_visit::visit_module_items(self, items, _parent);
    }

    fn visit_stmts(&mut self, items: &[ast::Stmt], _parent: &dyn Node) {
        self.is_top_level = false;
        swc_ecma_visit::visit_stmts(self, items, _parent);
        self.is_top_level = true;
    }

    fn visit_call_expr(&mut self, node: &ast::CallExpr, _parent: &dyn Node) {
        use ast::{Expr::*, ExprOrSuper::*};

        swc_ecma_visit::visit_call_expr(self, node, _parent);
        let call_expr = match node.callee.clone() {
            Super(_) => return,
            Expr(boxed) => boxed,
        };

        let kind = match &*call_expr {
            Ident(ident) => match ident.sym.to_string().as_str() {
                "import" => DependencyKind::Import,
                "require" => DependencyKind::Require,
                _ => return,
            },
            _ => return,
        };

        // import() are always dynamic, even if at top level
        let is_dynamic = !self.is_top_level || kind == DependencyKind::Import;

        if let Some(arg) = node.args.get(0) {
            if let Lit(lit) = &*arg.expr {
                if let ast::Lit::Str(str_) = lit {
                    let specifier = str_.value.clone();
                    let span = node.span;
                    let (location, leading_comments) = self.get_location_and_comments(span);
                    self.items.push(DependencyDescriptor {
                        kind,
                        is_dynamic,
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
            let lexer: Lexer = Lexer::new(
                Syntax::Typescript(TsConfig {
                    dts: file_name.ends_with(".d.ts"),
                    tsx: file_name.contains("tsx"),
                    dynamic_import: true,
                    decorators: true,
                    no_early_errors: true,
                    ..Default::default()
                }),
                JscTarget::Es2015,
                fm.start_pos,
                &fm.src,
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
const { join } = require("path");

// dynamic 
await import("./foo1.ts");

try {
    const foo = await import("./foo.ts");
} catch (e) {
    // pass
}

try {
    const foo = require("some_package");
} catch (e) {
    // pass
}
      "#;
        let (module, source_map, comments) = helper("test.ts", &source).unwrap();
        // eprintln!("module {:#?}", module);
        let dependencies = analyze_dependencies(&module, &source_map, &comments);
        assert_eq!(dependencies.len(), 8);
        assert_eq!(
            dependencies,
            vec![
                DependencyDescriptor {
                    kind: DependencyKind::Import,
                    is_dynamic: false,
                    leading_comments: Vec::new(),
                    col: 0,
                    line: 1,
                    specifier: JsWord::from("./test.ts")
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
                    specifier: JsWord::from("./foo.d.ts")
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
                    specifier: JsWord::from("./buzz.ts")
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
                    specifier: JsWord::from("./fizz.d.ts")
                },
                DependencyDescriptor {
                    kind: DependencyKind::Require,
                    is_dynamic: false,
                    leading_comments: Vec::new(),
                    col: 17,
                    line: 11,
                    specifier: JsWord::from("path")
                },
                DependencyDescriptor {
                    kind: DependencyKind::Import,
                    is_dynamic: true,
                    leading_comments: Vec::new(),
                    col: 6,
                    line: 14,
                    specifier: JsWord::from("./foo1.ts")
                },
                DependencyDescriptor {
                    kind: DependencyKind::Import,
                    is_dynamic: true,
                    leading_comments: Vec::new(),
                    col: 22,
                    line: 17,
                    specifier: JsWord::from("./foo.ts")
                },
                DependencyDescriptor {
                    kind: DependencyKind::Require,
                    is_dynamic: true,
                    leading_comments: Vec::new(),
                    col: 16,
                    line: 23,
                    specifier: JsWord::from("some_package")
                }
            ]
        );
    }
}
