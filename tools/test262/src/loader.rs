use std::{fs, path::Path};

use anyhow::{Context, Result};
use rayon::prelude::*;
use serde::Serialize;
use walkdir::WalkDir;

use crate::{metadata, model::TestCase};

#[derive(Debug, Clone)]
pub struct CorpusIssue {
    pub path: std::path::PathBuf,
    pub summary: String,
}

#[derive(Debug, Default, Clone, Copy, Serialize)]
pub struct CorpusStats {
    pub discovered: usize,
    pub selected: usize,
    pub excluded_by_policy: usize,
}

pub struct LoadedCorpus {
    pub cases: Vec<TestCase>,
    pub issues: Vec<CorpusIssue>,
    pub stats: CorpusStats,
}

pub fn load(test_root: &Path, filter: Option<&str>) -> Result<LoadedCorpus> {
    let mut discovered = Vec::new();
    let mut excluded_by_policy = 0;

    for entry in WalkDir::new(test_root) {
        let entry = entry.with_context(|| format!("failed to walk {}", test_root.display()))?;
        if !entry.file_type().is_file() {
            continue;
        }
        let path = entry.path();
        if path.extension().is_none() || path.extension().is_some_and(|extension| extension != "js")
        {
            continue;
        }
        if is_excluded(test_root, path) {
            excluded_by_policy += 1;
            continue;
        }
        let relative = path.strip_prefix(test_root).unwrap();
        if filter.is_some_and(|filter| !relative.to_string_lossy().contains(filter)) {
            continue;
        }
        discovered.push(path.to_path_buf());
    }

    discovered.sort();
    let discovered_count = discovered.len() + excluded_by_policy;
    let loaded = discovered
        .into_par_iter()
        .map(|path| {
            let mut code = fs::read_to_string(&path)
                .with_context(|| format!("failed to read {}", path.display()))?;
            if code.starts_with('\u{feff}') {
                code.drain(..'\u{feff}'.len_utf8());
            }
            let path = path.strip_prefix(test_root).unwrap().to_path_buf();
            let result = match metadata::parse(&code) {
                Ok(metadata) => Ok(TestCase {
                    path,
                    code,
                    metadata,
                }),
                Err(error) => Err(CorpusIssue {
                    path,
                    summary: format!("{error:#}"),
                }),
            };
            Ok(result)
        })
        .collect::<Result<Vec<_>>>()?;

    let mut cases = Vec::new();
    let mut issues = Vec::new();
    for result in loaded {
        match result {
            Ok(case) => cases.push(case),
            Err(issue) => issues.push(issue),
        }
    }
    cases.sort_by(|left, right| left.path.cmp(&right.path));
    issues.sort_by(|left, right| left.path.cmp(&right.path));

    let stats = CorpusStats {
        discovered: discovered_count,
        selected: cases.len(),
        excluded_by_policy,
    };
    Ok(LoadedCorpus {
        cases,
        issues,
        stats,
    })
}

fn is_excluded(root: &Path, path: &Path) -> bool {
    let relative = path
        .strip_prefix(root)
        .unwrap()
        .to_string_lossy()
        .replace('\\', "/");
    relative.starts_with("staging/")
        || relative.ends_with("_FIXTURE.js")
        || relative.contains("/_FIXTURE/")
}
