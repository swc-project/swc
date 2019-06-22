use super::Checker;
use crate::{
    analyzer::{ImportInfo, Specifier},
    errors::Error,
    resolver::Resolve,
    ty::Type,
};
use fxhash::FxHashMap;
use std::{path::PathBuf, sync::Arc};
use swc_atoms::JsWord;

pub trait Load: Send + Sync {
    fn load(
        &self,
        base: Arc<PathBuf>,
        import: &ImportInfo,
    ) -> Result<FxHashMap<JsWord, Arc<Type<'static>>>, Error>;
}

impl Load for Checker<'_> {
    fn load(
        &self,
        base: Arc<PathBuf>,
        import: &ImportInfo,
    ) -> Result<FxHashMap<JsWord, Arc<Type<'static>>>, Error> {
        let mut result = FxHashMap::default();
        let mut errors = vec![];

        let path = self
            .resolver
            .resolve((*base).clone(), import.span, &import.src)?;
        let module = self.load_module(path);

        if import.all {
            result.extend(module.1.exports.clone())
        } else {
            for &Specifier {
                ref local,
                ref export,
            } in import.items.iter()
            {
                if let Some(exported) = module.1.exports.get(&export.0) {
                    result.insert(local.0.clone(), exported.clone());
                } else {
                    errors.push(local.clone());
                }
            }
        }

        if !module.1.errors.is_empty() {
            return Err(Error::ModuleLoadFailed {
                span: import.span,
                errors: module.1.errors.iter().cloned().collect(),
            });
        }

        if errors.is_empty() {
            return Ok(result);
        }

        Err(Error::NoSuchExport {
            span: import.span,
            items: errors,
        })
    }
}

impl<'a, T> Load for &'a T
where
    T: ?Sized + Load,
{
    fn load(
        &self,
        base: Arc<PathBuf>,
        import: &ImportInfo,
    ) -> Result<FxHashMap<JsWord, Arc<Type<'static>>>, Error> {
        (**self).load(base, import)
    }
}
