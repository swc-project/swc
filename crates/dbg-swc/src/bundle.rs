use std::{
    process::{Command, Stdio},
    sync::Arc,
};

use anyhow::{bail, Context, Result};
use swc_common::{FileName, SourceMap};
use swc_timer::timer;

use crate::util::{parse_js, wrap_task, ModuleRecord};

pub fn bundle(cm: Arc<SourceMap>, entry_url: &str) -> Result<ModuleRecord> {
    wrap_task(|| {
        let _timer = timer!("bundle");

        let mut cmd = Command::new("deno");
        cmd.arg("bundle");
        cmd.arg(entry_url);

        cmd.stderr(Stdio::inherit());

        let output = cmd.output().context("failed to invoke `deno bundle`")?;

        if !output.status.success() {
            bail!("`deno bundle` failed with status code {}", output.status);
        }

        let code =
            String::from_utf8(output.stdout).context("deno bundle emitted non-utf8 output")?;

        let fm = cm.new_source_file(FileName::Anon.into(), code);
        parse_js(fm).context("failed to parse js filed emitted by `deno bundle`")
    })
    .with_context(|| format!("failed to bundle `{}`", entry_url))
}
