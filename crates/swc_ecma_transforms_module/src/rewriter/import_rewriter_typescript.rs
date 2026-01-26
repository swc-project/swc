use std::path::Path;

use swc_atoms::{Atom, Wtf8Atom};
use swc_common::{util::take::Take, DUMMY_SP};
use swc_ecma_ast::*;
use swc_ecma_transforms_base::helper;
use swc_ecma_visit::{visit_mut_pass, VisitMut, VisitMutWith};

/// This is the implementation of rewriteRelativeImportExtensions in TypeScript
pub fn typescript_import_rewriter() -> impl Pass {
    visit_mut_pass(Rewriter)
}

struct Rewriter;

impl VisitMut for Rewriter {
    fn visit_mut_call_expr(&mut self, e: &mut CallExpr) {
        e.visit_mut_children_with(self);

        // In TypeScript, `require` is handled only in JavaScript files.
        // I don't know how to check if the current file is a JavaScript file in swc,
        // So I'll temporarily just simplify.
        if !e.callee.is_import()
            && !e
                .callee
                .as_expr()
                .and_then(|e| e.as_ident())
                .is_some_and(|i| i.sym == "require")
        {
            return;
        }

        if let Some(ExprOrSpread { spread: None, expr }) = &mut e.args.get_mut(0) {
            if let Expr::Lit(Lit::Str(s)) = &mut **expr {
                if let Some(src) = get_output_extension_wtf8(&s.value) {
                    s.raw = None;
                    s.value = src;
                }
            } else {
                let importee = expr.take();
                *expr = Box::new(Expr::Call(CallExpr {
                    span: DUMMY_SP,
                    callee: helper!(ts_rewrite_relative_import_extension),
                    args: vec![ExprOrSpread {
                        spread: None,
                        expr: importee,
                    }],
                    ..Default::default()
                }));
            }
        }
    }

    fn visit_mut_import_decl(&mut self, i: &mut ImportDecl) {
        if let Some(src) = get_output_extension_wtf8(&i.src.value) {
            i.src.value = src;
            i.src.raw = None;
        }
    }

    fn visit_mut_named_export(&mut self, e: &mut NamedExport) {
        if let Some(src) = &mut e.src {
            if let Some(new_src) = get_output_extension_wtf8(&src.value) {
                src.value = new_src;
                src.raw = None;
            }
        }
    }

    fn visit_mut_export_all(&mut self, n: &mut ExportAll) {
        if let Some(new_src) = get_output_extension_wtf8(&n.src.value) {
            n.src.value = new_src;
            n.src.raw = None;
        }
    }
}

fn get_output_extension(specifier: &Atom) -> Option<Atom> {
    // https://github.com/microsoft/TypeScript/blob/3eb7b6a1794a6d2cde7948a3016c57e628b104b9/src/compiler/utilities.ts#L4331
    let path = Path::new(specifier.as_str());
    if !(path.starts_with("./")
        || path.starts_with("../")
        || path.starts_with(".\\")
        || path.starts_with("..\\"))
    {
        return None;
    }

    // https://github.com/microsoft/TypeScript/blob/3eb7b6a1794a6d2cde7948a3016c57e628b104b9/src/compiler/parser.ts#L10556
    if path.file_name()?.to_str()?.contains(".d.") {
        return None;
    }

    // https://github.com/microsoft/TypeScript/blob/3eb7b6a1794a6d2cde7948a3016c57e628b104b9/src/compiler/emitter.ts#L540
    let ext = path.extension()?.to_str()?;
    let ext = match ext {
        "json" => "json",
        "jsx" | "tsx" => "jsx",
        "mjs" | "mts" => "mjs",
        "cjs" | "cts" => "cjs",
        _ => "js",
    };

    Some(Atom::new(path.with_extension(ext).to_str()?))
}

fn get_output_extension_wtf8(specifier: &Wtf8Atom) -> Option<Wtf8Atom> {
    let normalized = specifier.to_atom_lossy();
    get_output_extension(normalized.as_ref()).map(Into::into)
}
