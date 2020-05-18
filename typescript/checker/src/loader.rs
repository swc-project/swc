use super::Checker;
use crate::{errors::Error, resolver::Resolve, ImportInfo, ModuleTypeInfo, Specifier};
use std::{path::PathBuf, sync::Arc};

pub trait Load: Send + Sync {
    fn load(&self, base: Arc<PathBuf>, import: &ImportInfo) -> Result<ModuleTypeInfo, Error>;
}

impl Load for Checker {
    fn load(&self, base: Arc<PathBuf>, import: &ImportInfo) -> Result<ModuleTypeInfo, Error> {
        let mut result = ModuleTypeInfo::default();
        let mut errors = vec![];

        let path = self
            .resolver
            .resolve((*base).clone(), import.span, &import.src)
            .map(Arc::new)?;
        let module = self.load_module(path);

        if import.all {
            result.extend(module.1.exports.clone())
        } else {
            for &Specifier {
                ref local,
                ref export,
            } in import.items.iter()
            {
                let mut done = false;
                if let Some(ty) = module.1.exports.types.get(&export) {
                    done = true;
                    result.types.insert(export.clone(), ty.clone());
                }

                if let Some(var) = module.1.exports.vars.get(&export) {
                    done = true;
                    result.vars.insert(export.clone(), var.clone());
                }

                if !done {
                    errors.push(local.clone());
                }
            }
        }

        if !module.1.errors.is_empty() {
            return Err(Error::ModuleLoadFailed {
                span: import.span,
                errors: module.1.errors.clone().into(),
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
    fn load(&self, base: Arc<PathBuf>, import: &ImportInfo) -> Result<ModuleTypeInfo, Error> {
        (**self).load(base, import)
    }
}
