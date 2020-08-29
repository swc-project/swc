// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.

use crate::{msg::MediaType, Result};

use deno_core::{ErrBox, ModuleSpecifier};
use either::Either;
use std::{
    error::Error,
    fmt,
    rc::Rc,
    sync::{Arc, RwLock},
};
use swc_common::{
    chain,
    comments::{Comment, SingleThreadedComments},
    errors::{Diagnostic, DiagnosticBuilder, Emitter, Handler, HandlerFlags},
    FileName, Globals, Loc,
};
pub use swc_common::{SourceMap, Span};
use swc_ecmascript::{
    ast::{Module, Program},
    codegen::{text_writer::JsWriter, Config, Node},
    parser::{lexer::Lexer, EsConfig, JscTarget, StringInput, Syntax, TsConfig},
    transforms::{fixer, helpers, proposals::decorators, react, typescript},
    visit,
    visit::{FoldWith, Visit},
};

pub fn analyze_dependencies(
    module: &Module,
    source_map: SourceMap,
    comments: SingleThreadedComments,
) -> Vec<DependencyDescriptor> {
    let mut v = Analyzer {
        config,
        info: Default::default(),
    };
    module.visit_with(&Invalid { span: DUMMY_SP }, &mut v);
    v.info
}

#[derive(Clone, Debug, PartialEq)]
enum DependencyKind {
    Import,
    ImportType,
    Export,
    ExportType,
}

#[derive(Clone, Debug, Default, Eq, PartialEq)]
pub struct DependencyDescriptor {
    pub kind: DependencyKind,
    /// A flag indicating if the import is dynamic or not.
    pub is_dynamic: bool,
    /// Any leading comments associated with the dependency.  This is used for
    /// further processing of supported pragma that impact the dependency.
    pub leading_comments: Vec<Comment>,
    /// The location of the import/export statement.
    pub location: Location,
    /// The text specifier associated with the import/export statement.
    pub specifier: String,
}

/// Visits a pattern node, recursively looking for any names that end up in the
/// local scope, pushing them onto the passed vector.
fn visit_pat(pat: &swc_ecmascript::ast::Pat, names: &mut Vec<String>) {
    match pat {
        swc_ecmascript::ast::Pat::Ident(ident) => names.push(ident.sym.to_string()),
        swc_ecmascript::ast::Pat::Array(array_pat) => {
            for elem in array_pat.elems.iter() {
                if let Some(pat) = elem {
                    visit_pat(pat, names);
                }
            }
        }
        swc_ecmascript::ast::Pat::Rest(rest_pat) => visit_pat(rest_pat.arg.as_ref(), names),
        swc_ecmascript::ast::Pat::Object(object_pat) => {
            for prop in object_pat.props.iter() {
                match prop {
                    swc_ecmascript::ast::ObjectPatProp::Assign(assign_pat) => {
                        names.push(assign_pat.key.sym.to_string())
                    }
                    swc_ecmascript::ast::ObjectPatProp::KeyValue(key_value) => {
                        visit_pat(key_value.value.as_ref(), names)
                    }
                    swc_ecmascript::ast::ObjectPatProp::Rest(rest_pat) => {
                        visit_pat(rest_pat.arg.as_ref(), names)
                    }
                }
            }
        }
        swc_ecmascript::ast::Pat::Assign(assign_pat) => visit_pat(assign_pat.left.as_ref(), names),
        // Invalid and Expressions are noops
        _ => {}
    }
}

#[derive(Default)]
struct ExportCollector {
    pub names: Vec<String>,
    pub export_all_specifiers: Vec<String>,
}

impl Visit for ExportCollector {
    fn visit_export_decl(
        &mut self,
        node: &swc_ecmascript::ast::ExportDecl,
        _parent: &dyn visit::Node,
    ) {
        match &node.decl {
            swc_ecmascript::ast::Decl::Class(class_decl) => {
                self.names.push(class_decl.ident.sym.to_string());
            }
            swc_ecmascript::ast::Decl::Fn(fn_decl) => {
                self.names.push(fn_decl.ident.sym.to_string());
            }
            swc_ecmascript::ast::Decl::Var(var_decl) => {
                for decl in var_decl.decls.iter() {
                    visit_pat(&decl.name, &mut self.names);
                }
            }
            swc_ecmascript::ast::Decl::TsEnum(ts_enum_decl) => {
                self.names.push(ts_enum_decl.id.sym.to_string());
            }
            // Interfaces, Type Aliases, and TS Module/Namespace decl are noops
            _ => {}
        }
    }

    fn visit_named_export(
        &mut self,
        node: &swc_ecmascript::ast::NamedExport,
        _parent: &dyn visit::Node,
    ) {
        for spec in node.specifiers.iter() {
            match spec {
                swc_ecmascript::ast::ExportSpecifier::Named(named_spec) => {
                    if let Some(ident) = &named_spec.exported {
                        self.names.push(ident.sym.to_string());
                    } else {
                        self.names.push(named_spec.orig.sym.to_string());
                    }
                }
                swc_ecmascript::ast::ExportSpecifier::Namespace(namespace_spec) => {
                    self.names.push(namespace_spec.name.sym.to_string());
                }
                // Default is only proposed syntax, not current supported, so noop
                _ => {}
            }
        }
    }

    fn visit_export_default_decl(
        &mut self,
        node: &swc_ecmascript::ast::ExportDefaultDecl,
        _parent: &dyn visit::Node,
    ) {
        match &node.decl {
            swc_ecmascript::ast::DefaultDecl::Class(_) => self.names.push("default".to_string()),
            swc_ecmascript::ast::DefaultDecl::Fn(_) => self.names.push("default".to_string()),
            // Interface is a noop
            _ => {}
        }
    }

    fn visit_export_default_expr(
        &mut self,
        _node: &swc_ecmascript::ast::ExportDefaultExpr,
        _parent: &dyn visit::Node,
    ) {
        self.names.push("default".to_string());
    }

    fn visit_export_all(
        &mut self,
        node: &swc_ecmascript::ast::ExportAll,
        _parent: &dyn visit::Node,
    ) {
        self.export_all_specifiers.push(node.src.value.to_string());
    }
}

struct DependencyCollector<'a> {
    comments: &'a SingleThreadedComments,
    pub items: Vec<DependencyDescriptor>,
    source_map: &'a SourceMap,
}

impl<'a> Visit for DependencyCollector<'a> {
    fn visit_import_decl(
        &mut self,
        node: &swc_ecmascript::ast::ImportDecl,
        _parent: &dyn visit::Node,
    ) {
        let specifier = node.src.value.to_string();
        let span = node.span;
        let location = self.source_map.lookup_char_pos(span.lo);
        let leading_comments = self
            .comments
            .with_leading(span.lo, |comments| comments.to_vec());
        self.items.push(DependencyDescriptor {
            leading_comments,
            location,
            specifier,
            ..Default::default()
        });
    }

    fn visit_named_export(
        &mut self,
        node: &swc_ecmascript::ast::NamedExport,
        _parent: &dyn visit::Node,
    ) {
        if let Some(src) = &node.src {
            let specifier = src.value.to_string();
            let span = node.span;
            let location = self.source_map.lookup_char_pos(span.lo);
            let leading_comments = self
                .comments
                .with_leading(span.lo, |comments| comments.to_vec());
            self.items.push(DependencyDescriptor {
                leading_comments,
                location,
                specifier,
                ..Default::default()
            });
        }
    }

    fn visit_export_all(
        &mut self,
        node: &swc_ecmascript::ast::ExportAll,
        _parent: &dyn visit::Node,
    ) {
        let specifier = node.src.value.to_string();
        let span = node.span;
        let location = self.source_map.lookup_char_pos(span.lo);
        let leading_comments = self
            .comments
            .with_leading(span.lo, |comments| comments.to_vec());
        self.items.push(DependencyDescriptor {
            leading_comments,
            location,
            specifier,
            ..Default::default()
        });
    }

    fn visit_ts_import_type(
        &mut self,
        node: &swc_ecmascript::ast::TsImportType,
        _parent: &dyn visit::Node,
    ) {
        let specifier = node.arg.value.to_string();
        let span = node.span;
        let location = self.source_map.lookup_char_pos(span.lo);
        let leading_comments = self
            .comments
            .with_leading(span.lo, |comments| comments.to_vec());
        self.items.push(DependencyDescriptor {
            is_type: true,
            leading_comments,
            location,
            specifier,
            ..Default::default()
        });
    }

    fn visit_call_expr(&mut self, node: &swc_ecmascript::ast::CallExpr, _parent: &dyn visit::Node) {
        use swc_ecmascript::ast::{Expr::*, ExprOrSuper::*};

        swc_ecmascript::visit::visit_call_expr(self, node, _parent);
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
                if let swc_ecmascript::ast::Lit::Str(str_) = lit {
                    let specifier = str_.value.to_string();
                    let span = node.span;
                    let location = self.source_map.lookup_char_pos(span.lo);
                    let leading_comments = self
                        .comments
                        .with_leading(span.lo, |comments| comments.to_vec());
                    self.items.push(DependencyDescriptor {
                        is_dynamic: true,
                        leading_comments,
                        location,
                        specifier,
                        ..Default::default()
                    });
                }
            }
        }
    }
}

#[cfg(test)]
mod tests {
    // use super::*;

    // #[test]
    // fn test_parsed_module_get_dependencies() {
    //   let specifier =
    //     ModuleSpecifier::resolve_url_or_path("https://deno.land/x/mod.js")
    //       .unwrap();
    //   let source = r#"import * as bar from "./test.ts";
    //   const foo = await import("./foo.ts");
    //   "#;
    //   let parsed_module = parse(&specifier, source, MediaType::JavaScript)
    //     .expect("could not parse module");
    //   let actual = parsed_module.get_dependencies();
    //   assert_eq!(
    //     actual,
    //     vec![
    //       DependencyDescriptor {
    //         is_dynamic: false,
    //         is_type: false,
    //         leading_comments: Vec::new(),
    //         location: Location {
    //           filename: "https://deno.land/x/mod.js".to_owned(),
    //           col: 0,
    //           line: 1,
    //         },
    //         specifier: "./test.ts".to_owned()
    //       },
    //       DependencyDescriptor {
    //         is_dynamic: true,
    //         is_type: false,
    //         leading_comments: Vec::new(),
    //         location: Location {
    //           filename: "https://deno.land/x/mod.js".to_owned(),
    //           col: 22,
    //           line: 2,
    //         },
    //         specifier: "./foo.ts".to_owned()
    //       }
    //     ]
    //   );
    // }

    // #[test]
    // fn test_parsed_module_get_export_names() {
    //   let specifier =
    //     ModuleSpecifier::resolve_url_or_path("https://deno.land/x/mod.ts")
    //       .unwrap();
    //   let source = r#"
    //   export * from "./a.ts";

    //   export { a, b as c } from "./b.ts";

    //   export default function () {
    //     console.log("hello");
    //   }

    //   export enum C {
    //     A,
    //     B,
    //     C,
    //   }

    //   export const [d, e, ...f] = [1, 2, 3, 4, 5];

    //   export const g = 1;

    //   export const { h, i: j, ...k } = { h: true, i: false, j: 1, k: 2 };

    //   export class A {}

    //   export function l() {}

    //   export * as m from "./m.ts";
    //   "#;
    //   let parsed_module = parse(&specifier, source, MediaType::TypeScript)
    //     .expect("could not parse module");
    //   let (names, export_all_specifiers) = parsed_module.get_export_names();
    //   assert_eq!(
    //     names,
    //     vec![
    //       "a", "c", "default", "C", "d", "e", "f", "g", "h", "j", "k", "A",
    // "l",       "m"
    //     ]
    //   );
    //   assert_eq!(export_all_specifiers, vec!["./a.ts"]);
    // }

    // #[test]
    // fn test_parsed_module_get_leading_comments() {
    //   let specifier =
    //     ModuleSpecifier::resolve_url_or_path("https://deno.land/x/mod.ts")
    //       .unwrap();
    //   let source = r#"// this is the first comment
    //     // this is the second comment
    //     import * as bar from "./test.ts";"#;
    //   let parsed_module = parse(&specifier, source, MediaType::TypeScript)
    //     .expect("could not parse module");
    //   let dependencies = parsed_module.get_dependencies();
    //   let leading_comments: Vec<&str> = dependencies[0]
    //     .leading_comments
    //     .iter()
    //     .map(|c| c.text.as_str())
    //     .collect();
    //   assert_eq!(
    //     leading_comments,
    //     vec![" this is the first comment", " this is the second comment"]
    //   );
    // }
}
