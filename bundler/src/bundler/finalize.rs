use crate::{hash::calc_hash, Bundle, BundleKind, Bundler, Load, Resolve};
use anyhow::{Context, Error};
use crc::{crc64, crc64::Digest, Hasher64};
use fxhash::FxHashMap;
use relative_path::RelativePath;
use std::path::{Path, PathBuf};
use swc_common::{sync::Lrc, util::move_map::MoveMap, FileName, SourceMap, Span};
use swc_ecma_ast::{ImportDecl, Module, Str};
use swc_ecma_transforms::noop_fold_type;
use swc_ecma_visit::{Fold, FoldWith};

impl<L, R> Bundler<'_, L, R>
where
    L: Load,
    R: Resolve,
{
    /// This is
    pub fn rename_bundles(
        &self,
        cm: Lrc<SourceMap>,
        bundles: Vec<Bundle>,
    ) -> Result<Vec<Bundle>, Error> {
        let mut new = Vec::with_capacity(bundles.len());
        let mut renamed = FxHashMap::default();

        for mut bundle in bundles {
            match bundle.kind {
                BundleKind::Named { .. } => {
                    // Inject helpers
                    let helpers = self
                        .scope
                        .get_module(bundle.id)
                        .expect("module should exist at this point")
                        .helpers;

                    helpers.append_to(&mut bundle.module.body);

                    new.push(Bundle { ..bundle });
                }
                BundleKind::Lib { name } => {
                    let hash = calc_hash(cm, &bundle.module)?;
                    let mut new_name = PathBuf::from(name);
                    let key = new_name.clone();
                    let file_name = new_name
                        .file_name()
                        .map(|path| -> PathBuf {
                            let path = Path::new(path);
                            let ext = path.extension();
                            if let Some(ext) = ext {
                                return format!(
                                    "{}-{}.{}",
                                    path.file_stem().unwrap().to_string_lossy(),
                                    hash,
                                    ext.to_string_lossy()
                                )
                                .into();
                            }
                            return format!(
                                "{}-{}",
                                path.file_stem().unwrap().to_string_lossy(),
                                hash,
                            )
                            .into();
                        })
                        .expect("javascript file should have name");
                    new_name.pop();
                    new_name = new_name.join(file_name.clone());

                    renamed.insert(key, new_name.to_string_lossy().to_string());

                    new.push(Bundle {
                        kind: BundleKind::Named {
                            name: file_name.display().to_string(),
                        },
                        ..bundle
                    })
                }
                _ => new.push(bundle),
            }
        }

        new = new.move_map(|bundle| {
            let path = match self.scope.get_module(bundle.id).unwrap().fm.name {
                FileName::Real(ref v) => v.clone(),
                _ => {
                    log::error!("Cannot rename: not a real file");
                    return bundle;
                }
            };

            let module = {
                // Change imports
                let mut v = Renamer {
                    resolver: &self.resolver,
                    path: &path,
                    renamed: &renamed,
                };
                bundle.module.fold_with(&mut v)
            };

            Bundle { module, ..bundle }
        });

        Ok(new)
    }
}

/// Import renamer. This pass changes import path.
struct Renamer<'a, R>
where
    R: Resolve,
{
    resolver: R,
    path: &'a Path,
    renamed: &'a FxHashMap<PathBuf, String>,
}

noop_fold_type!(Renamer<'_, '_>);

impl<R> Fold for Renamer<'_, R>
where
    R: Resolve,
{
    fn fold_import_decl(&mut self, import: ImportDecl) -> ImportDecl {
        let resolved = match self.resolver.resolve(self.path, &import.src.value) {
            Ok(v) => v,
            Err(_) => return import,
        };

        if let Some(v) = self.renamed.get(&*resolved) {
            // We use parent because RelativePath uses ../common-[hash].js
            // if we use `entry-a.js` as a base.
            //
            // entry-a.js
            // common.js
            let base = self
                .path
                .parent()
                .unwrap_or(self.path)
                .as_os_str()
                .to_string_lossy();
            let base = RelativePath::new(&*base);
            let v = base.relative(&*v);
            let value = v.as_str();
            return ImportDecl {
                src: Str {
                    value: if value.starts_with(".") {
                        value.into()
                    } else {
                        format!("./{}", value).into()
                    },
                    ..import.src
                },
                ..import
            };
        }

        import
    }
}
