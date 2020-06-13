use crate::load::Load;
use anyhow::Error;
use std::{path::Path, sync::Arc};
use swc_common::SourceFile;
use swc_ecma_ast::{Module, Program};
use swc_ecma_parser::JscTarget;

/// JavaScript loader
pub struct SwcLoader {
    compiler: Arc<swc::Compiler>,
    options: swc::config::Options,
}

impl SwcLoader {
    pub fn new(compiler: Arc<swc::Compiler>, mut options: swc::config::Options) -> Self {
        if options.config.is_none() {
            options.config = Some(Default::default());
        }

        {
            let v = options.config.as_mut().unwrap();
            // TODO: Some(Esm)
            v.module = None;
            v.minify = Some(false);

            v.jsc.target = JscTarget::Es2019;
        }

        SwcLoader { compiler, options }
    }
}

impl Load for SwcLoader {
    fn load(&self, path: &Path) -> Result<(Arc<SourceFile>, Module), Error> {
        self.compiler.run(|| {
            log::debug!("JsLoader.load({})", path.display());

            let fm = self.compiler.cm.load_file(path)?;

            log::trace!("JsLoader.load: loaded");

            let config = self.compiler.config_for_file(&self.options, &fm.name)?;

            log::trace!("JsLoader.load: loaded config");

            // We run transform at this phase to strip out unused dependencies.
            //
            // Note that we don't apply compat transform at loading phase.
            let program =
                self.compiler
                    .parse_js(fm.clone(), JscTarget::Es2019, config.syntax, true, true)?;

            log::trace!("JsLoader.load: parsed");

            let program = self.compiler.transform(program, true, config.pass);

            log::trace!("JsLoader.load: applied transforms");

            match program {
                Program::Module(module) => Ok((fm, module)),
                _ => unreachable!(),
            }
        })
    }
}
