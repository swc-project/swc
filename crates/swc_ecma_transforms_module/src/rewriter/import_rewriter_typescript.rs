use std::path::Path;

use swc_atoms::Atom;
use swc_ecma_ast::*;
use swc_ecma_visit::{visit_mut_pass, VisitMut, VisitMutWith};

/// This is the implementation of rewriteRelativeImportExtensions in TypeScript
pub fn typescript_import_rewriter() -> impl Pass {
    visit_mut_pass(Rewriter)
}

struct Rewriter;

impl VisitMut for Rewriter {
    fn visit_mut_call_expr(&mut self, e: &mut CallExpr) {
        e.visit_mut_children_with(self);

        if !e.callee.is_import() {
            return;
        }

        if let Some(ExprOrSpread { spread: None, expr }) = &mut e.args.get_mut(0) {
            if let Expr::Lit(Lit::Str(s)) = &mut **expr {
                if let Some(src) = get_output_extension(&s.value) {
                    s.raw = None;
                    s.value = src;
                }
            } else {
                // Add helper shim
            }
        }
    }

    fn visit_mut_import_decl(&mut self, i: &mut ImportDecl) {
        if let Some(src) = get_output_extension(&i.src.value) {
            i.src.value = src;
            i.src.raw = None;
        }
    }

    fn visit_mut_named_export(&mut self, e: &mut NamedExport) {
        if let Some(src) = &mut e.src {
            if let Some(new_src) = get_output_extension(&src.value) {
                src.value = new_src;
                src.raw = None;
            }
        }
    }

    fn visit_mut_export_all(&mut self, n: &mut ExportAll) {
        if let Some(new_src) = get_output_extension(&n.src.value) {
            n.src.value = new_src;
            n.src.raw = None;
        }
    }
}

fn get_output_extension(specifier: &Atom) -> Option<Atom> {
    // https://github.com/microsoft/TypeScript/blob/3eb7b6a1794a6d2cde7948a3016c57e628b104b9/src/compiler/utilities.ts#L4331
    let path = Path::new(specifier.as_str());
    if !path.is_relative() {
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
