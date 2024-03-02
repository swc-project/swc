use std::{env, fs, path::PathBuf, process::Command};

use anyhow::{bail, Context, Result};
use sha2::{Digest, Sha256};
use testing::CARGO_TARGET_DIR;
use tracing::debug;

#[derive(Debug, Default, Clone, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct JsExecOptions {
    /// Cache the result of the execution.
    ///
    /// If `true`, the result of the execution will be cached.
    /// Cache is not removed and it will be reused if the source code is
    /// identical.
    ///
    /// Note that this cache is stored in cargo target directory and will be
    /// removed by `cargo clean`.
    ///
    /// You can change the cache directory name by setting the
    /// `SWC_ECMA_TESTING_CACHE_DIR`
    pub cache: bool,

    /// If true, `--input-type=module` will be added.
    pub module: bool,

    /// The arguments passed to the node.js process.
    pub args: Vec<String>,
}

fn cargo_cache_root() -> PathBuf {
    env::var("SWC_ECMA_TESTING_CACHE_DIR")
        .map(PathBuf::from)
        .unwrap_or_else(|_| CARGO_TARGET_DIR.clone())
}

/// Executes `js_code` and capture thw output.
pub fn exec_node_js(js_code: &str, opts: JsExecOptions) -> Result<String> {
    if opts.cache {
        let hash = calc_hash(&format!("{:?}:{}", opts.args, js_code));
        let cache_dir = cargo_cache_root().join(".swc-node-exec-cache");
        let cache_path = cache_dir.join(format!("{}.stdout", hash));

        if let Ok(s) = fs::read_to_string(&cache_path) {
            return Ok(s);
        }

        let output = exec_node_js(
            js_code,
            JsExecOptions {
                cache: false,
                ..opts
            },
        )?;

        fs::create_dir_all(&cache_dir).context("failed to create cache directory")?;

        fs::write(&cache_path, output.as_bytes()).context("failed to write cache")?;

        return Ok(output);
    }

    debug!("Executing nodejs:\n{}", js_code);

    let mut c = Command::new("node");

    if opts.module {
        c.arg("--input-type=module");
    } else {
        c.arg("--input-type=commonjs");
    }

    c.arg("-e").arg(js_code);

    for arg in opts.args {
        c.arg(arg);
    }

    let output = c.output().context("failed to execute output of minifier")?;

    if !output.status.success() {
        bail!(
            "failed to execute:\n{}\n{}",
            String::from_utf8_lossy(&output.stdout),
            String::from_utf8_lossy(&output.stderr)
        )
    }

    String::from_utf8(output.stdout).context("output is not utf8")
}

fn calc_hash(s: &str) -> String {
    let mut hasher = Sha256::default();
    hasher.update(s.as_bytes());
    let sum = hasher.finalize();

    hex::encode(sum)
}
