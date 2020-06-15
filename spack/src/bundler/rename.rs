use crate::{Bundle, BundleKind, Bundler};
use anyhow::{Context, Error};
use crc::{crc64, crc64::Digest, Hasher64};
use fxhash::FxHashMap;
use relative_path::RelativePath;
use std::{
    io,
    path::{Path, PathBuf},
};
use swc::config::Options;
use swc_common::{util::move_map::MoveMap, FileName, Fold, FoldWith, Span};
use swc_ecma_ast::{ImportDecl, Module, Str};
use swc_ecma_codegen::{text_writer::WriteJs, Emitter};
use swc_ecma_transforms::noop_fold_type;

impl Bundler<'_> {
    pub(super) fn rename(&self, bundles: Vec<Bundle>) -> Result<Vec<Bundle>, Error> {
        let mut new = Vec::with_capacity(bundles.len());
        let mut renamed = FxHashMap::default();

        for bundle in bundles {
            match bundle.kind {
                BundleKind::Lib { name } => {
                    let hash = self.calc_hash(&bundle.module)?;
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
                    bundler: self,
                    path: &path,
                    renamed: &renamed,
                };
                bundle.module.fold_with(&mut v)
            };

            let module = self.swc.run(|| {
                let opts = Options {
                    ..self.swc_options.clone()
                };
                let file_name = FileName::Real(path);
                let config = self.swc.read_config(&opts, &file_name).unwrap_or_default();
                let mut module_pass = swc::config::ModuleConfig::build(
                    self.swc.cm.clone(),
                    self.top_level_mark,
                    config.module,
                );
                module.fold_with(&mut module_pass)
            });

            Bundle { module, ..bundle }
        });

        Ok(new)
    }

    fn calc_hash(&self, m: &Module) -> Result<String, Error> {
        let digest = crc64::Digest::new(crc64::ECMA);
        let mut buf = Hasher { digest };

        {
            let mut emitter = Emitter {
                cfg: Default::default(),
                cm: self.swc.cm.clone(),
                comments: None,
                wr: box &mut buf as Box<dyn WriteJs>,
                handlers: box Handlers,
            };

            emitter
                .emit_module(&m)
                .context("failed to emit module to calculate hash")?;
        }
        //

        let result = buf.digest.sum64();
        Ok(radix_fmt::radix(result, 36).to_string())
    }
}

/// Import renamer. This pass changes import path.
struct Renamer<'a, 'b> {
    bundler: &'a Bundler<'b>,
    path: &'a Path,
    renamed: &'a FxHashMap<PathBuf, String>,
}

noop_fold_type!(Renamer<'_, '_>);

impl Fold<ImportDecl> for Renamer<'_, '_> {
    fn fold(&mut self, import: ImportDecl) -> ImportDecl {
        let resolved = match self.bundler.resolve(self.path, &import.src.value) {
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

impl swc_ecma_codegen::Handlers for Handlers {}
struct Handlers;

struct Hasher {
    digest: Digest,
}

impl Hasher {
    fn w(&mut self, s: &str) {
        self.digest.write(s.as_bytes());
    }
}

impl WriteJs for &mut Hasher {
    fn increase_indent(&mut self) -> io::Result<()> {
        Ok(())
    }

    fn decrease_indent(&mut self) -> io::Result<()> {
        Ok(())
    }

    fn write_semi(&mut self) -> io::Result<()> {
        self.w(";");
        Ok(())
    }

    fn write_space(&mut self) -> io::Result<()> {
        self.w(" ");
        Ok(())
    }

    fn write_keyword(&mut self, _: Option<Span>, s: &'static str) -> io::Result<()> {
        self.w(s);
        Ok(())
    }

    fn write_operator(&mut self, s: &str) -> io::Result<()> {
        self.w(s);
        Ok(())
    }

    fn write_param(&mut self, s: &str) -> io::Result<()> {
        self.w(s);
        Ok(())
    }

    fn write_property(&mut self, s: &str) -> io::Result<()> {
        self.w(s);
        Ok(())
    }

    fn write_line(&mut self) -> io::Result<()> {
        self.w("\n");
        Ok(())
    }

    fn write_lit(&mut self, _: Span, s: &str) -> io::Result<()> {
        self.w(s);
        Ok(())
    }

    fn write_comment(&mut self, _: Span, s: &str) -> io::Result<()> {
        self.w(s);
        Ok(())
    }

    fn write_str_lit(&mut self, _: Span, s: &str) -> io::Result<()> {
        self.w(s);
        Ok(())
    }

    fn write_str(&mut self, s: &str) -> io::Result<()> {
        self.w(s);
        Ok(())
    }

    fn write_symbol(&mut self, _: Span, s: &str) -> io::Result<()> {
        self.w(s);
        Ok(())
    }

    fn write_punct(&mut self, s: &'static str) -> io::Result<()> {
        self.w(s);
        Ok(())
    }
}
