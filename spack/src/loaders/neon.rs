use crate::{load::Load, loaders::swc::SwcLoader};
use anyhow::{Context as _, Error};
use neon::{prelude::*, result::Throw};
use regex::Regex;
use std::{
    path::Path,
    sync::{
        mpsc::{channel, SendError},
        Arc,
    },
};
use swc::config::InputSourceMap;
use swc_common::{FileName, SourceFile, SourceMap};
use swc_ecma_ast::{Module, Program};

/// Loader provided by user.
pub struct NeonLoader {
    pub swc: Arc<swc::Compiler>,
    pub handler: EventHandler,
}

impl Load for NeonLoader {
    fn load(&self, p: &Path) -> Result<(Arc<SourceFile>, Module), Error> {
        let path = p.to_string_lossy().to_string();
        let (tx, rx) = channel();

        self.handler.schedule_with(move |cx, value, f| {
            //
            let this = cx.undefined();
            let path = cx.string(path);

            let res = f.call(cx, this, vec![path]);
            let res = match res {
                Ok(v) => v,
                Err(err) => {
                    tx.send(Err(Error::msg(format!(
                        "failed to invoke js laoder: {}",
                        err
                    ))));
                    return;
                }
            };
            if let Ok(code) = res.downcast::<JsString>() {
                let s = code.value();
                match tx.send(Ok(s)) {
                    Ok(_) => return,
                    Err(err) => {
                        let _ = tx.send(Err(Error::msg(format!(
                            "failed to send result back: {}",
                            err
                        ))));
                        return;
                    }
                }
            }

            tx.send(Err(Error::msg("failed to invoke js laoder")));
        });

        let code = rx
            .recv()
            .context("failed to receive output from js loader")?;
        let code = code?;

        let fm = self
            .swc
            .cm
            .new_source_file(FileName::Real(p.to_path_buf()), code);

        let config = self.swc.config_for_file(
            &swc::config::Options {
                swcrc: true,
                ..Default::default()
            },
            &fm.name,
        )?;
        let (module, _) = self.swc.parse_js(
            fm.clone(),
            config.target,
            config.syntax,
            true,
            true,
            &InputSourceMap::Bool(true),
        )?;
        let module = match module {
            Program::Module(v) => v,
            Program::Script(_) => unreachable!("script"),
        };
        Ok((fm, module))
    }
}
