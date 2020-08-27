use anyhow::{Context as _, Error};
use napi::JsFunction;
use std::sync::{mpsc::channel, Arc};
use swc_bundler::Load;
use swc_common::{FileName, SourceFile};
use swc_ecma_ast::{Module, Program};

/// Loader provided by user.
pub struct NeonLoader {
    pub swc: Arc<swc::Compiler>,
    pub handler: Arc<JsFunction>,
}

impl Load for NeonLoader {
    fn load(&self, name: &FileName) -> Result<(Arc<SourceFile>, Module), Error> {
        let path = name.to_string();
        let (tx, rx) = channel();

        self.handler.schedule_with(move |cx, _value, f| {
            //
            let this = cx.undefined();
            let path = cx.string(path);

            let res = f.call(cx, this, vec![path]);
            let res = match res {
                Ok(v) => v,
                Err(err) => {
                    let _ = tx.send(Err(Error::msg(format!(
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

            let _ = tx.send(Err(Error::msg("failed to invoke js laoder")));
        });

        let code = rx
            .recv()
            .context("failed to receive output from js loader")?;
        let code = code?;

        let fm = self.swc.cm.new_source_file(name.clone(), code);

        let config = self.swc.config_for_file(
            &swc::config::Options {
                swcrc: true,
                ..Default::default()
            },
            &fm.name,
        )?;
        let module = self
            .swc
            .parse_js(fm.clone(), config.target, config.syntax, true, true)?;
        let module = match module {
            Program::Module(v) => v,
            Program::Script(_) => unreachable!("script"),
        };
        Ok((fm, module))
    }
}
