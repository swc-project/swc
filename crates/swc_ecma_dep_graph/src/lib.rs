use std::collections::HashMap;

use swc_atoms::{js_word, JsWord};
use swc_common::{
    comments::{Comment, Comments},
    Span,
};
use swc_ecma_ast as ast;
use swc_ecma_visit::{self, Visit, VisitWith};

pub fn analyze_dependencies(
    module: &ast::Module,
    comments: &dyn Comments,
) -> Vec<DependencyDescriptor> {
    let mut v = DependencyCollector {
        comments,
        items: vec![],
        is_top_level: true,
    };
    module.visit_with(&mut v);
    v.items
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub enum DependencyKind {
    Import,
    ImportType,
    ImportEquals,
    Export,
    ExportType,
    ExportEquals,
    Require,
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub enum ImportAssertion {
    /// The value of this assertion could not be statically analyzed.
    Unknown,
    /// The value of this assertion is a statically analyzed string.
    Known(String),
}

#[derive(Clone, Debug, Eq, PartialEq)]
pub enum ImportAssertions {
    /// There was no import assertions object literal.
    None,
    /// The set of assertion keys could not be statically analyzed.
    Unknown,
    /// The set of assertion keys is statically analyzed, though each respective
    /// value may or may not not be for dynamic imports.
    Known(HashMap<String, ImportAssertion>),
}

impl Default for ImportAssertions {
    fn default() -> Self {
        ImportAssertions::None
    }
}

impl ImportAssertions {
    pub fn get(&self, key: &str) -> Option<&String> {
        match self {
            ImportAssertions::Known(map) => match map.get(key) {
                Some(ImportAssertion::Known(value)) => Some(value),
                _ => None,
            },
            _ => None,
        }
    }
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
    pub import_assertions: ImportAssertions,
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
        self.comments.get_leading(span.lo).unwrap_or_default()
    }
}

impl<'a> Visit for DependencyCollector<'a> {
    fn visit_import_decl(&mut self, node: &ast::ImportDecl) {
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

    fn visit_named_export(&mut self, node: &ast::NamedExport) {
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

    fn visit_export_all(&mut self, node: &ast::ExportAll) {
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

    fn visit_ts_import_type(&mut self, node: &ast::TsImportType) {
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
            import_assertions: Default::default(),
        });
    }

    fn visit_module_items(&mut self, items: &[ast::ModuleItem]) {
        swc_ecma_visit::visit_module_items(self, items);
    }

    fn visit_stmts(&mut self, items: &[ast::Stmt]) {
        self.is_top_level = false;
        swc_ecma_visit::visit_stmts(self, items);
        self.is_top_level = true;
    }

    fn visit_call_expr(&mut self, node: &ast::CallExpr) {
        use ast::{Callee, Expr, Ident, MemberProp};

        swc_ecma_visit::visit_call_expr(self, node);
        let kind = match &node.callee {
            Callee::Super(_) => return,
            Callee::Import(_) => DependencyKind::Import,
            Callee::Expr(expr) => match &**expr {
                Expr::Ident(Ident {
                    sym: js_word!("require"),
                    ..
                }) => DependencyKind::Require,
                Expr::Member(member) => match (&*member.obj, &member.prop) {
                    (
                        Expr::Ident(Ident { sym: obj_sym, .. }),
                        MemberProp::Ident(Ident { sym: prop_sym, .. }),
                    ) if obj_sym == "require" && prop_sym == "resolve" => DependencyKind::Require,
                    _ => return,
                },
                _ => return,
            },
        };

        if let Some(arg) = node.args.get(0) {
            if let Expr::Lit(ast::Lit::Str(str_)) = &*arg.expr {
                // import() are always dynamic, even if at top level
                let is_dynamic = !self.is_top_level || kind == DependencyKind::Import;
                let dynamic_import_assertions = if kind == DependencyKind::Import {
                    parse_dynamic_import_assertions(node.args.get(1))
                } else {
                    Default::default()
                };
                let specifier = str_.value.clone();
                let leading_comments = self.get_leading_comments(node.span);
                self.items.push(DependencyDescriptor {
                    kind,
                    is_dynamic,
                    leading_comments,
                    span: node.span,
                    specifier,
                    specifier_span: str_.span,
                    import_assertions: dynamic_import_assertions,
                });
            }
        }
    }

    fn visit_ts_import_equals_decl(&mut self, node: &ast::TsImportEqualsDecl) {
        use ast::TsModuleRef;

        if let TsModuleRef::TsExternalModuleRef(module) = &node.module_ref {
            let leading_comments = self.get_leading_comments(node.span);
            let expr = &module.expr;
            let specifier = expr.value.clone();

            let kind = if node.is_type_only {
                DependencyKind::ImportType
            } else if node.is_export {
                DependencyKind::ExportEquals
            } else {
                DependencyKind::ImportEquals
            };

            self.items.push(DependencyDescriptor {
                kind,
                is_dynamic: false,
                leading_comments,
                span: node.span,
                specifier,
                specifier_span: expr.span,
                import_assertions: Default::default(),
            });
        }
    }
}

/// Parses import assertions into a hashmap. According to proposal the values
/// can only be strings (https://github.com/tc39/proposal-import-assertions#should-more-than-just-strings-be-supported-as-attribute-values)
/// and thus non-string values are skipped.
fn parse_import_assertions(asserts: Option<&ast::ObjectLit>) -> ImportAssertions {
    let asserts = match asserts {
        Some(asserts) => asserts,
        None => return ImportAssertions::None,
    };
    let mut import_assertions = HashMap::new();
    for prop in asserts.props.iter() {
        if let ast::PropOrSpread::Prop(prop) = prop {
            if let ast::Prop::KeyValue(key_value) = &**prop {
                let maybe_key = match &key_value.key {
                    ast::PropName::Str(key) => Some(key.value.to_string()),
                    ast::PropName::Ident(ident) => Some(ident.sym.to_string()),
                    _ => None,
                };

                if let Some(key) = maybe_key {
                    if let ast::Expr::Lit(ast::Lit::Str(str_)) = &*key_value.value {
                        import_assertions
                            .insert(key, ImportAssertion::Known(str_.value.to_string()));
                    }
                }
            }
        }
    }
    ImportAssertions::Known(import_assertions)
}

/// Parses import assertions from the second arg of a dynamic import.
fn parse_dynamic_import_assertions(arg: Option<&ast::ExprOrSpread>) -> ImportAssertions {
    let arg = match arg {
        Some(arg) => arg,
        None => return ImportAssertions::None,
    };

    if arg.spread.is_some() {
        return ImportAssertions::Unknown;
    }

    let object_lit = match &*arg.expr {
        ast::Expr::Object(object_lit) => object_lit,
        _ => return ImportAssertions::Unknown,
    };

    let mut assertions_map = HashMap::new();
    let mut had_assert_key = false;

    for prop in object_lit.props.iter() {
        let prop = match prop {
            ast::PropOrSpread::Prop(prop) => prop,
            _ => return ImportAssertions::Unknown,
        };
        let key_value = match &**prop {
            ast::Prop::KeyValue(key_value) => key_value,
            _ => return ImportAssertions::Unknown,
        };
        let key = match &key_value.key {
            ast::PropName::Str(key) => key.value.to_string(),
            ast::PropName::Ident(ident) => ident.sym.to_string(),
            _ => return ImportAssertions::Unknown,
        };
        if key == "assert" {
            had_assert_key = true;
            let assertions_lit = match &*key_value.value {
                ast::Expr::Object(assertions_lit) => assertions_lit,
                _ => return ImportAssertions::Unknown,
            };

            for prop in assertions_lit.props.iter() {
                let prop = match prop {
                    ast::PropOrSpread::Prop(prop) => prop,
                    _ => return ImportAssertions::Unknown,
                };
                let key_value = match &**prop {
                    ast::Prop::KeyValue(key_value) => key_value,
                    _ => return ImportAssertions::Unknown,
                };
                let key = match &key_value.key {
                    ast::PropName::Str(key) => key.value.to_string(),
                    ast::PropName::Ident(ident) => ident.sym.to_string(),
                    _ => return ImportAssertions::Unknown,
                };
                if let ast::Expr::Lit(value_lit) = &*key_value.value {
                    assertions_map.insert(
                        key,
                        if let ast::Lit::Str(str_) = value_lit {
                            ImportAssertion::Known(str_.value.to_string())
                        } else {
                            ImportAssertion::Unknown
                        },
                    );
                } else {
                    assertions_map.insert(key, ImportAssertion::Unknown);
                }
            }
        }
    }

    if had_assert_key {
        ImportAssertions::Known(assertions_map)
    } else {
        ImportAssertions::None
    }
}

#[cfg(test)]
mod tests {
    use ast::EsVersion;
    use pretty_assertions::assert_eq;
    use swc_common::{
        comments::{Comment, CommentKind, SingleThreadedComments},
        BytePos, FileName, Span, SyntaxContext,
    };
    use swc_ecma_parser::{lexer::Lexer, Parser, StringInput, Syntax, TsConfig};

    use super::*;

    fn helper(
        file_name: &str,
        source: &str,
    ) -> Result<(ast::Module, SingleThreadedComments), testing::StdErr> {
        ::testing::run_test(false, |cm, handler| {
            let fm =
                cm.new_source_file(FileName::Custom(file_name.to_string()), source.to_string());

            let comments = SingleThreadedComments::default();
            let lexer: Lexer<StringInput<'_>> = Lexer::new(
                Syntax::Typescript(TsConfig {
                    dts: file_name.ends_with(".d.ts"),
                    tsx: file_name.contains("tsx"),
                    decorators: true,
                    no_early_errors: true,
                }),
                EsVersion::Es2015,
                (&*fm).into(),
                Some(&comments),
            );

            let mut p = Parser::new_from(lexer);

            let res = p
                .parse_module()
                .map_err(|e| e.into_diagnostic(handler).emit());

            for err in p.take_errors() {
                err.into_diagnostic(handler).emit();
            }

            if handler.has_errors() {
                return Err(());
            }

            Ok((res.unwrap(), comments))
        })
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

import foo2 = require("some_package_foo");
import type FooType = require('some_package_foo_type');
export import bar2 = require("some_package_bar");

const foo3 = require.resolve("some_package_resolve");
try {
    const foo4 = require.resolve("some_package_resolve_foo");
} catch (e) {
    // pass
}
      "#;
        let (module, comments) = helper("test.ts", source).unwrap();
        let dependencies = analyze_dependencies(&module, &comments);
        assert_eq!(dependencies.len(), 13);
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
                    import_assertions: Default::default(),
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
                    import_assertions: Default::default(),
                },
                DependencyDescriptor {
                    kind: DependencyKind::Export,
                    is_dynamic: false,
                    leading_comments: vec![Comment {
                        kind: CommentKind::Line,
                        text: r#"/ <reference foo="bar" />"#.to_string(),
                        span: Span::new(BytePos(86), BytePos(113), SyntaxContext::empty()),
                    }],
                    span: Span::new(BytePos(114), BytePos(148), Default::default()),
                    specifier: JsWord::from("./buzz.ts"),
                    specifier_span: Span::new(BytePos(136), BytePos(147), Default::default()),
                    import_assertions: Default::default(),
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
                    import_assertions: Default::default(),
                },
                DependencyDescriptor {
                    kind: DependencyKind::Require,
                    is_dynamic: false,
                    leading_comments: Vec::new(),
                    span: Span::new(BytePos(238), BytePos(253), Default::default()),
                    specifier: JsWord::from("path"),
                    specifier_span: Span::new(BytePos(246), BytePos(252), Default::default()),
                    import_assertions: Default::default(),
                },
                DependencyDescriptor {
                    kind: DependencyKind::Import,
                    is_dynamic: true,
                    leading_comments: Vec::new(),
                    span: Span::new(BytePos(273), BytePos(292), Default::default()),
                    specifier: JsWord::from("./foo1.ts"),
                    specifier_span: Span::new(BytePos(280), BytePos(291), Default::default()),
                    import_assertions: Default::default(),
                },
                DependencyDescriptor {
                    kind: DependencyKind::Import,
                    is_dynamic: true,
                    leading_comments: Vec::new(),
                    span: Span::new(BytePos(323), BytePos(341), Default::default()),
                    specifier: JsWord::from("./foo.ts"),
                    specifier_span: Span::new(BytePos(330), BytePos(340), Default::default()),
                    import_assertions: Default::default(),
                },
                DependencyDescriptor {
                    kind: DependencyKind::Require,
                    is_dynamic: true,
                    leading_comments: Vec::new(),
                    span: Span::new(BytePos(394), BytePos(417), Default::default()),
                    specifier: JsWord::from("some_package"),
                    specifier_span: Span::new(BytePos(402), BytePos(416), Default::default()),
                    import_assertions: Default::default(),
                },
                DependencyDescriptor {
                    kind: DependencyKind::ImportEquals,
                    is_dynamic: false,
                    leading_comments: Vec::new(),
                    span: Span::new(BytePos(448), BytePos(490), Default::default()),
                    specifier: JsWord::from("some_package_foo"),
                    specifier_span: Span::new(BytePos(470), BytePos(488), Default::default()),
                    import_assertions: Default::default(),
                },
                DependencyDescriptor {
                    kind: DependencyKind::ImportType,
                    is_dynamic: false,
                    leading_comments: Vec::new(),
                    span: Span::new(BytePos(491), BytePos(546), Default::default()),
                    specifier: JsWord::from("some_package_foo_type"),
                    specifier_span: Span::new(BytePos(521), BytePos(544), Default::default()),
                    import_assertions: Default::default(),
                },
                DependencyDescriptor {
                    kind: DependencyKind::ExportEquals,
                    is_dynamic: false,
                    leading_comments: Vec::new(),
                    span: Span::new(BytePos(547), BytePos(596), Default::default()),
                    specifier: JsWord::from("some_package_bar"),
                    specifier_span: Span::new(BytePos(576), BytePos(594), Default::default()),
                    import_assertions: Default::default(),
                },
                DependencyDescriptor {
                    kind: DependencyKind::Require,
                    is_dynamic: false,
                    leading_comments: Vec::new(),
                    span: Span::new(BytePos(611), BytePos(650), Default::default()),
                    specifier: JsWord::from("some_package_resolve"),
                    specifier_span: Span::new(BytePos(627), BytePos(649), Default::default()),
                    import_assertions: Default::default(),
                },
                DependencyDescriptor {
                    kind: DependencyKind::Require,
                    is_dynamic: true,
                    leading_comments: Vec::new(),
                    span: Span::new(BytePos(675), BytePos(718), Default::default()),
                    specifier: JsWord::from("some_package_resolve_foo"),
                    specifier_span: Span::new(BytePos(691), BytePos(717), Default::default()),
                    import_assertions: Default::default(),
                },
            ]
        );
    }

    #[test]
    fn test_import_assertions() {
        let source = r#"import * as bar from "./test.ts" assert { "type": "typescript" };
export * from "./test.ts" assert { "type": "typescript" };
export { bar } from "./test.json" assert { "type": "json" };
import foo from "./foo.json" assert { type: "json" };
const fizz = await import("./fizz.json", { "assert": { type: "json" } });
const buzz = await import("./buzz.json", { assert: { "type": "json" } });
const d1 = await import("./d1.json");
const d2 = await import("./d2.json", {});
const d3 = await import("./d3.json", bar);
const d4 = await import("./d4.json", { assert: {} });
const d5 = await import("./d5.json", { assert: bar });
const d6 = await import("./d6.json", { assert: {}, ...bar });
const d7 = await import("./d7.json", { assert: {}, ["assert"]: "bad" });
const d8 = await import("./d8.json", { assert: { type: bar } });
const d9 = await import("./d9.json", { assert: { type: "json", ...bar } });
const d10 = await import("./d10.json", { assert: { type: "json", ["type"]: "bad" } });
      "#;
        let (module, comments) = helper("test.ts", source).unwrap();
        let expected_assertions1 = ImportAssertions::Known({
            let mut map = HashMap::new();
            map.insert(
                "type".to_string(),
                ImportAssertion::Known("typescript".to_string()),
            );
            map
        });
        let expected_assertions2 = ImportAssertions::Known({
            let mut map = HashMap::new();
            map.insert(
                "type".to_string(),
                ImportAssertion::Known("json".to_string()),
            );
            map
        });
        let dynamic_expected_assertions2 = ImportAssertions::Known({
            let mut map = HashMap::new();
            map.insert(
                "type".to_string(),
                ImportAssertion::Known("json".to_string()),
            );
            map
        });
        let dependencies = analyze_dependencies(&module, &comments);
        assert_eq!(dependencies.len(), 16);
        assert_eq!(
            dependencies,
            vec![
                DependencyDescriptor {
                    kind: DependencyKind::Import,
                    is_dynamic: false,
                    leading_comments: Vec::new(),
                    span: Span::new(BytePos(1), BytePos(66), Default::default()),
                    specifier: JsWord::from("./test.ts"),
                    specifier_span: Span::new(BytePos(22), BytePos(33), Default::default()),
                    import_assertions: expected_assertions1.clone(),
                },
                DependencyDescriptor {
                    kind: DependencyKind::Export,
                    is_dynamic: false,
                    leading_comments: Vec::new(),
                    span: Span::new(BytePos(67), BytePos(125), Default::default()),
                    specifier: JsWord::from("./test.ts"),
                    specifier_span: Span::new(BytePos(81), BytePos(92), Default::default()),
                    import_assertions: expected_assertions1,
                },
                DependencyDescriptor {
                    kind: DependencyKind::Export,
                    is_dynamic: false,
                    leading_comments: Vec::new(),
                    span: Span::new(BytePos(126), BytePos(186), Default::default()),
                    specifier: JsWord::from("./test.json"),
                    specifier_span: Span::new(BytePos(146), BytePos(159), Default::default()),
                    import_assertions: expected_assertions2.clone(),
                },
                DependencyDescriptor {
                    kind: DependencyKind::Import,
                    is_dynamic: false,
                    leading_comments: Vec::new(),
                    span: Span::new(BytePos(187), BytePos(240), Default::default()),
                    specifier: JsWord::from("./foo.json"),
                    specifier_span: Span::new(BytePos(203), BytePos(215), Default::default()),
                    import_assertions: expected_assertions2,
                },
                DependencyDescriptor {
                    kind: DependencyKind::Import,
                    is_dynamic: true,
                    leading_comments: Vec::new(),
                    span: Span::new(BytePos(260), BytePos(313), Default::default()),
                    specifier: JsWord::from("./fizz.json"),
                    specifier_span: Span::new(BytePos(267), BytePos(280), Default::default()),
                    import_assertions: dynamic_expected_assertions2.clone(),
                },
                DependencyDescriptor {
                    kind: DependencyKind::Import,
                    is_dynamic: true,
                    leading_comments: Vec::new(),
                    span: Span::new(BytePos(334), BytePos(387), Default::default()),
                    specifier: JsWord::from("./buzz.json"),
                    specifier_span: Span::new(BytePos(341), BytePos(354), Default::default()),
                    import_assertions: dynamic_expected_assertions2,
                },
                DependencyDescriptor {
                    kind: DependencyKind::Import,
                    is_dynamic: true,
                    leading_comments: Vec::new(),
                    span: Span::new(BytePos(406), BytePos(426), Default::default()),
                    specifier: JsWord::from("./d1.json"),
                    specifier_span: Span::new(BytePos(413), BytePos(424), Default::default()),
                    import_assertions: Default::default(),
                },
                DependencyDescriptor {
                    kind: DependencyKind::Import,
                    is_dynamic: true,
                    leading_comments: Vec::new(),
                    span: Span::new(BytePos(444), BytePos(467), Default::default()),
                    specifier: JsWord::from("./d2.json"),
                    specifier_span: Span::new(BytePos(451), BytePos(462), Default::default()),
                    import_assertions: Default::default(),
                },
                DependencyDescriptor {
                    kind: DependencyKind::Import,
                    is_dynamic: true,
                    leading_comments: Vec::new(),
                    span: Span::new(BytePos(486), BytePos(510), Default::default()),
                    specifier: JsWord::from("./d3.json"),
                    specifier_span: Span::new(BytePos(493), BytePos(504), Default::default()),
                    import_assertions: ImportAssertions::Unknown,
                },
                DependencyDescriptor {
                    kind: DependencyKind::Import,
                    is_dynamic: true,
                    leading_comments: Vec::new(),
                    span: Span::new(BytePos(529), BytePos(564), Default::default()),
                    specifier: JsWord::from("./d4.json"),
                    specifier_span: Span::new(BytePos(536), BytePos(547), Default::default()),
                    import_assertions: ImportAssertions::Known(HashMap::new()),
                },
                DependencyDescriptor {
                    kind: DependencyKind::Import,
                    is_dynamic: true,
                    leading_comments: Vec::new(),
                    span: Span::new(BytePos(583), BytePos(619), Default::default()),
                    specifier: JsWord::from("./d5.json"),
                    specifier_span: Span::new(BytePos(590), BytePos(601), Default::default()),
                    import_assertions: ImportAssertions::Unknown,
                },
                DependencyDescriptor {
                    kind: DependencyKind::Import,
                    is_dynamic: true,
                    leading_comments: Vec::new(),
                    span: Span::new(BytePos(638), BytePos(681), Default::default()),
                    specifier: JsWord::from("./d6.json"),
                    specifier_span: Span::new(BytePos(645), BytePos(656), Default::default()),
                    import_assertions: ImportAssertions::Unknown,
                },
                DependencyDescriptor {
                    kind: DependencyKind::Import,
                    is_dynamic: true,
                    leading_comments: Vec::new(),
                    span: Span::new(BytePos(700), BytePos(754), Default::default()),
                    specifier: JsWord::from("./d7.json"),
                    specifier_span: Span::new(BytePos(707), BytePos(718), Default::default()),
                    import_assertions: ImportAssertions::Unknown,
                },
                DependencyDescriptor {
                    kind: DependencyKind::Import,
                    is_dynamic: true,
                    leading_comments: Vec::new(),
                    span: Span::new(BytePos(773), BytePos(819), Default::default()),
                    specifier: JsWord::from("./d8.json"),
                    specifier_span: Span::new(BytePos(780), BytePos(791), Default::default()),
                    import_assertions: ImportAssertions::Known({
                        let mut map = HashMap::new();
                        map.insert("type".to_string(), ImportAssertion::Unknown);
                        map
                    }),
                },
                DependencyDescriptor {
                    kind: DependencyKind::Import,
                    is_dynamic: true,
                    leading_comments: Vec::new(),
                    span: Span::new(BytePos(838), BytePos(895), Default::default()),
                    specifier: JsWord::from("./d9.json"),
                    specifier_span: Span::new(BytePos(845), BytePos(856), Default::default()),
                    import_assertions: ImportAssertions::Unknown,
                },
                DependencyDescriptor {
                    kind: DependencyKind::Import,
                    is_dynamic: true,
                    leading_comments: Vec::new(),
                    span: Span::new(BytePos(915), BytePos(982), Default::default()),
                    specifier: JsWord::from("./d10.json"),
                    specifier_span: Span::new(BytePos(922), BytePos(934), Default::default()),
                    import_assertions: ImportAssertions::Unknown,
                },
            ]
        );
    }
}
