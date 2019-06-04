use self::util::{PatExt, TypeExt};
use crate::errors::Error;
use swc_atoms::JsWord;
use swc_common::{Fold, FoldWith, Spanned};
use swc_ecma_ast::*;

mod expr;
#[cfg(test)]
mod tests;
mod util;

#[derive(Debug, Default)]
struct Analyzer {
    info: Info,
    errors: Vec<Error>,
}

#[derive(Debug, Default)]
pub struct Info {
    pub imports: Vec<ImportInfo>,
    pub exports: Vec<ExportInfo>,
    pub errors: Vec<Error>,
}

#[derive(Debug)]
pub struct ImportInfo {
    pub src: JsWord,
}

#[derive(Debug)]
pub struct ExportInfo {}

impl Fold<VarDeclarator> for Analyzer {
    fn fold(&mut self, mut v: VarDeclarator) -> VarDeclarator {
        if let Some(ref init) = v.init {
            //  Check if v_ty is assignable to ty
            let value_ty = self.type_of(&init);

            match v.name.get_ty() {
                Some(ref ty) => {
                    let errors = value_ty.assign_to(ty);

                    self.errors.extend(errors);
                }
                // Infer type from value.
                None => v.name.set_ty(value_ty.map(Box::new)),
            }

            return v;
        }

        // There's no initializer, so undefined is required.
        if !v.name.get_ty().contains_undefined() {
            self.errors.push(Error::ShouldIncludeUndefinedType {
                span: v.name.span(),
            })
        }

        v
    }
}

/// Analyzes a module.
///
/// Constants are propagated, and
pub fn analyze_module(m: Module) -> (Module, Info) {
    let mut a = Analyzer::default();
    let m = m.fold_with(&mut a);

    (m, a.info)
}
