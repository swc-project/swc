use std::{collections::BTreeSet, env, process::Command};

use anyhow::{bail, Context, Result};

use crate::{config::ProjectPaths, model::Suite};

const CHILD_ENV: &str = "SWC_TEST262_CHILD";

pub fn ensure_features(paths: &ProjectPaths, suites: &[Suite]) -> Result<bool> {
    if env::var_os(CHILD_ENV).is_some() || suites.iter().all(|suite| feature_is_enabled(*suite)) {
        return Ok(false);
    }

    let features = suites
        .iter()
        .map(|suite| suite.required_feature())
        .collect::<BTreeSet<_>>()
        .into_iter()
        .collect::<Vec<_>>()
        .join(",");
    let cargo = env::var_os("CARGO").unwrap_or_else(|| "cargo".into());
    let mut command = Command::new(cargo);
    command
        .current_dir(paths.workspace_root())
        .args([
            "run",
            "--package",
            "swc_test262",
            "--no-default-features",
            "--features",
            &features,
            "--",
        ])
        .args(env::args_os().skip(1))
        .env(CHILD_ENV, "1");
    let status = command
        .status()
        .context("failed to restart cargo test262 with suite features")?;
    if !status.success() {
        bail!("suite runner exited with {status}");
    }
    Ok(true)
}

fn feature_is_enabled(suite: Suite) -> bool {
    match suite {
        Suite::Parser => cfg!(feature = "suite-parser"),
        Suite::Lexer => cfg!(feature = "suite-lexer"),
        Suite::Codegen | Suite::SourceMap => cfg!(feature = "suite-codegen"),
        Suite::Transforms => cfg!(feature = "suite-transforms"),
        Suite::Minifier => cfg!(feature = "suite-minifier"),
        Suite::Runtime => cfg!(feature = "suite-runtime"),
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn deduplicates_feature_names() {
        let features = [Suite::Codegen, Suite::SourceMap]
            .iter()
            .map(|suite| suite.required_feature())
            .collect::<BTreeSet<_>>();
        assert_eq!(features.into_iter().collect::<Vec<_>>(), ["suite-codegen"]);
    }
}
