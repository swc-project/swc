use super::Checker;
use crate::{
    analyzer::{ExportInfo, ImportInfo},
    errors::Error,
    resolver::Resolve,
};
use fxhash::FxHashMap;
use std::{path::PathBuf, sync::Arc};
use swc_atoms::JsWord;

pub trait Load: Send + Sync {
    fn load(
        &self,
        base: Arc<PathBuf>,
        import: &ImportInfo,
    ) -> Result<FxHashMap<JsWord, Arc<ExportInfo>>, Error>;
}

impl Load for Checker<'_> {
    fn load(
        &self,
        base: Arc<PathBuf>,
        import: &ImportInfo,
    ) -> Result<FxHashMap<JsWord, Arc<ExportInfo>>, Error> {
        let mut result = FxHashMap::default();
        let mut errors = vec![];

        let path = self
            .resolver
            .resolve((*base).clone(), import.span, &import.src)?;
        let module = self.load_module(path);

        if import.all {
            result.extend(module.1.exports.clone())
        } else {
            for &(ref sym, span) in import.items.iter().map(|v| &v.export) {
                if let Some(exported) = module.1.exports.get(&sym) {
                    result.insert(sym.clone(), exported.clone());
                } else {
                    errors.push((sym.clone(), span));
                }
            }
        }

        if !module.1.errors.is_empty() {
            let module = Arc::try_unwrap(module).unwrap();
            return Err(Error::ModuleLoadFailed {
                span: import.span,
                errors: module.1.errors,
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
    ) -> Result<FxHashMap<JsWord, Arc<ExportInfo>>, Error> {
        (**self).load(base, import)
    }
}
