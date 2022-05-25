use std::{env, fs, path::PathBuf, process::Command};

use anyhow::{bail, Context, Result};
use sha1::{Digest, Sha1};

#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash)]
pub struct JsExecOptions {
    /// Cache the result of the execution.
    ///
    /// If `true`, the result of the execution will be cached.
    /// Cache is not removed and it will be reused if the source code is
    /// identical.
    ///
    /// Note that this cache is stored in cargo target directory and will be
    /// removed by `cargo clean`.
    pub cache: bool,

    /// If true, `--input-type=module` will be added.
    pub is_module: bool,
}

fn cargo_manifest_dir() -> PathBuf {
    env::var("CARGO_MANIFEST_DIR").unwrap().into()
}

fn cargo_target_dir() -> PathBuf {
    env::var("TARGET").map(PathBuf::from).unwrap_or_else(|_| {
        let mut target_dir = cargo_manifest_dir();
        target_dir.push("target");
        target_dir
    })
}

/// Executes `js_code` and capture thw output.
pub fn exec_node_js(js_code: &str, opts: JsExecOptions) -> Result<String> {
    if opts.cache {
        let hash = calc_hash(js_code);
        let cache_dir = cargo_target_dir().join(".swc-node-exec-cache");
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

    let mut c = Command::new("node");

    if opts.is_module {
        c.arg("--input-type=module");
    } else {
        c.arg("--input-type=commonjs");
    }

    let output = c
        .arg("-e")
        .arg(js_code)
        .output()
        .context("failed to execute output of minifier")?;

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
    let mut hasher = Sha1::default();
    hasher.update(s.as_bytes());
    let sum = hasher.finalize();

    hex::encode(sum)
}
