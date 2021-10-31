use std::collections::HashMap;
use swc_atoms::JsWord;
use swc_common::{
    comments::{Comment, Comments},
    Span, DUMMY_SP,
};
use swc_ecma_ast as ast;
use swc_ecma_visit::{self, Node, Visit, VisitWith};

pub fn analyze_dependencies(
    module: &ast::Module,
    comments: &dyn Comments,
) -> Vec<DependencyDescriptor> {
    let mut v = DependencyCollector {
        comments,
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
    /// The span of the import/export statement.
    pub span: Span,
    /// The text specifier associated with the import/export statement.
    pub specifier: JsWord,
    /// The span of the specifier.
    pub specifier_span: Span,
    /// Import assertions for this dependency.
    /// NOTE: it's filled only for static imports and exports.
    pub import_assertions: HashMap<String, String>,
}

struct DependencyCollector<'a> {
    comments: &'a dyn Comments,
    pub items: Vec<DependencyDescriptor>,
    // This field is used to determine if currently visited "require"
    // is top level and "static", or inside module body and "dynamic".
    is_top_level: bool,
}

impl<'a> DependencyCollector<'a> {
    fn get_leading_comments(&self, span: Span) -> Vec<Comment> {
        self.comments.get_leading(span.lo).unwrap_or_else(Vec::new)
    }
}

impl<'a> Visit for DependencyCollector<'a> {
    fn visit_import_decl(&mut self, node: &ast::ImportDecl, _parent: &dyn Node) {
        let specifier = node.src.value.clone();
        let leading_comments = self.get_leading_comments(node.span);
        let kind = if node.type_only {
            DependencyKind::ImportType
        } else {
            DependencyKind::Import
        };
        let import_assertions = parse_import_assertions(node.asserts.as_ref());
        self.items.push(DependencyDescriptor {
            kind,
            is_dynamic: false,
            leading_comments,
            span: node.span,
            specifier,
            specifier_span: node.src.span,
            import_assertions,
        });
    }

    fn visit_named_export(&mut self, node: &ast::NamedExport, _parent: &dyn Node) {
        if let Some(src) = &node.src {
            let specifier = src.value.clone();
            let leading_comments = self.get_leading_comments(node.span);
            let kind = if node.type_only {
                DependencyKind::ExportType
            } else {
                DependencyKind::Export
            };
            let import_assertions = parse_import_assertions(node.asserts.as_ref());
            self.items.push(DependencyDescriptor {
                kind,
                is_dynamic: false,
                leading_comments,
                span: node.span,
                specifier,
                specifier_span: src.span,
                import_assertions,
            });
        }
    }

    fn visit_export_all(&mut self, node: &ast::ExportAll, _parent: &dyn Node) {
        let specifier = node.src.value.clone();
        let leading_comments = self.get_leading_comments(node.span);
        let import_assertions = parse_import_assertions(node.asserts.as_ref());
        self.items.push(DependencyDescriptor {
            kind: DependencyKind::Export,
            is_dynamic: false,
            leading_comments,
            span: node.span,
            specifier,
            specifier_span: node.src.span,
            import_assertions,
        });
    }

    fn visit_ts_import_type(&mut self, node: &ast::TsImportType, _parent: &dyn Node) {
        let specifier = node.arg.value.clone();
        let span = node.span;
        let leading_comments = self.get_leading_comments(span);
        self.items.push(DependencyDescriptor {
            kind: DependencyKind::ImportType,
            is_dynamic: false,
            leading_comments,
            span: node.span,
            specifier,
            specifier_span: node.arg.span,
            import_assertions: HashMap::default(),
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
                    let leading_comments = self.get_leading_comments(node.span);
                    self.items.push(DependencyDescriptor {
                        kind,
                        is_dynamic,
                        leading_comments,
                        span: node.span,
                        specifier,
                        specifier_span: str_.span,
                        import_assertions: HashMap::default(),
                    });
                }
            }
        }
    }
}

/// Parses import assertions into a hashmap. According to proposal the values
/// can only be strings (https://github.com/tc39/proposal-import-assertions#should-more-than-just-strings-be-supported-as-attribute-values)
/// and thus non-string values are skipped.
fn parse_import_assertions(asserts: Option<&ast::ObjectLit>) -> HashMap<String, String> {
    let mut import_assertions = HashMap::new();
    if let Some(asserts) = asserts {
        for prop in &asserts.props {
            let prop = prop.clone().expect_prop();
            let key_value = prop.expect_key_value();
            let key = key_value.key.expect_str().value.to_string();
            let value_lit = key_value.value.expect_lit();
            if let ast::Lit::Str(str_) = value_lit {
                import_assertions.insert(key, str_.value.to_string());
            }
        }
    }
    import_assertions
}

#[cfg(test)]
mod tests {
    use super::*;
    use ast::EsVersion;
    use swc_common::{
        comments::{Comment, CommentKind, SingleThreadedComments},
        BytePos, FileName, Span, SyntaxContext,
    };
    use swc_ecma_parser::{lexer::Lexer, Parser, StringInput, Syntax, TsConfig};

    fn helper(
        file_name: &str,
        source: &str,
    ) -> Result<(ast::Module, SingleThreadedComments), testing::StdErr> {
        let output = ::testing::run_test(false, |cm, handler| {
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
                    import_assertions: true,
                    ..Default::default()
                }),
                EsVersion::Es2015,
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

            Ok((res.unwrap(), comments))
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
        let (module, comments) = helper("test.ts", &source).unwrap();
        let dependencies = analyze_dependencies(&module, &comments);
        assert_eq!(dependencies.len(), 8);
        assert_eq!(
            dependencies,
            vec![
                DependencyDescriptor {
                    kind: DependencyKind::Import,
                    is_dynamic: false,
                    leading_comments: Vec::new(),
                    span: Span::new(BytePos(0), BytePos(33), Default::default()),
                    specifier: JsWord::from("./test.ts"),
                    specifier_span: Span::new(BytePos(21), BytePos(32), Default::default()),
                    import_assertions: HashMap::default(),
                },
                DependencyDescriptor {
                    kind: DependencyKind::ImportType,
                    is_dynamic: false,
                    leading_comments: vec![Comment {
                        kind: CommentKind::Block,
                        text: r#"* JSDoc "#.to_string(),
                        span: Span::new(BytePos(34), BytePos(46), SyntaxContext::empty()),
                    }],
                    span: Span::new(BytePos(47), BytePos(85), Default::default()),
                    specifier: JsWord::from("./foo.d.ts"),
                    specifier_span: Span::new(BytePos(72), BytePos(84), Default::default()),
                    import_assertions: HashMap::default(),
                },
                DependencyDescriptor {
                    kind: DependencyKind::Export,
                    is_dynamic: false,
                    leading_comments: vec![Comment {
                        kind: CommentKind::Line,
                        text: r#"/ <reference foo="bar" />"#.to_string(),
                        span: Span::new(BytePos(86), BytePos(113), SyntaxContext::empty()),
                    }],
                    span: Span::new(BytePos(114), BytePos(147), Default::default()),
                    specifier: JsWord::from("./buzz.ts"),
                    specifier_span: Span::new(BytePos(136), BytePos(147), Default::default()),
                    import_assertions: HashMap::default(),
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
                    span: Span::new(BytePos(180), BytePos(220), Default::default()),
                    specifier: JsWord::from("./fizz.d.ts"),
                    specifier_span: Span::new(BytePos(206), BytePos(219), Default::default()),
                    import_assertions: HashMap::default(),
                },
                DependencyDescriptor {
                    kind: DependencyKind::Require,
                    is_dynamic: false,
                    leading_comments: Vec::new(),
                    span: Span::new(BytePos(238), BytePos(253), Default::default()),
                    specifier: JsWord::from("path"),
                    specifier_span: Span::new(BytePos(246), BytePos(252), Default::default()),
                    import_assertions: HashMap::default(),
                },
                DependencyDescriptor {
                    kind: DependencyKind::Import,
                    is_dynamic: true,
                    leading_comments: Vec::new(),
                    span: Span::new(BytePos(273), BytePos(292), Default::default()),
                    specifier: JsWord::from("./foo1.ts"),
                    specifier_span: Span::new(BytePos(280), BytePos(291), Default::default()),
                    import_assertions: HashMap::default(),
                },
                DependencyDescriptor {
                    kind: DependencyKind::Import,
                    is_dynamic: true,
                    leading_comments: Vec::new(),
                    span: Span::new(BytePos(323), BytePos(341), Default::default()),
                    specifier: JsWord::from("./foo.ts"),
                    specifier_span: Span::new(BytePos(330), BytePos(340), Default::default()),
                    import_assertions: HashMap::default(),
                },
                DependencyDescriptor {
                    kind: DependencyKind::Require,
                    is_dynamic: true,
                    leading_comments: Vec::new(),
                    span: Span::new(BytePos(394), BytePos(417), Default::default()),
                    specifier: JsWord::from("some_package"),
                    specifier_span: Span::new(BytePos(402), BytePos(416), Default::default()),
                    import_assertions: HashMap::default(),
                }
            ]
        );
    }

    #[test]
    fn test_import_assertions() {
        let source = r#"import * as bar from "./test.ts" assert { "type": "typescript" };
export * from "./test.ts" assert { "type": "typescript" };
export { bar } from "./test.json" assert { "type": "json" };
      "#;
        let (module, comments) = helper("test.ts", &source).unwrap();
        let mut expected_assertions1 = HashMap::new();
        expected_assertions1.insert("type".to_string(), "typescript".to_string());
        let mut expected_assertions2 = HashMap::new();
        expected_assertions2.insert("type".to_string(), "json".to_string());
        let dependencies = analyze_dependencies(&module, &comments);
        assert_eq!(dependencies.len(), 3);
        assert_eq!(
            dependencies,
            vec![
                DependencyDescriptor {
                    kind: DependencyKind::Import,
                    is_dynamic: false,
                    leading_comments: Vec::new(),
                    span: Span::new(BytePos(0), BytePos(65), Default::default()),
                    specifier: JsWord::from("./test.ts"),
                    specifier_span: Span::new(BytePos(21), BytePos(32), Default::default()),
                    import_assertions: expected_assertions1.clone(),
                },
                DependencyDescriptor {
                    kind: DependencyKind::Export,
                    is_dynamic: false,
                    leading_comments: Vec::new(),
                    span: Span::new(BytePos(66), BytePos(124), Default::default()),
                    specifier: JsWord::from("./test.ts"),
                    specifier_span: Span::new(BytePos(80), BytePos(91), Default::default()),
                    import_assertions: expected_assertions1,
                },
                DependencyDescriptor {
                    kind: DependencyKind::Export,
                    is_dynamic: false,
                    leading_comments: Vec::new(),
                    span: Span::new(BytePos(125), BytePos(185), Default::default()),
                    specifier: JsWord::from("./test.json"),
                    specifier_span: Span::new(BytePos(145), BytePos(158), Default::default()),
                    import_assertions: expected_assertions2,
                },
            ]
        );
    }
}
