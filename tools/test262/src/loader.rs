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
    let mut discovered_count = 0;
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
        discovered_count += 1;
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
        selected: cases.len() + issues.len(),
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
        || relative.starts_with("_FIXTURE/")
        || relative.contains("/_FIXTURE/")
}

#[cfg(test)]
mod tests {
    use std::fs;

    use tempfile::TempDir;

    use super::*;

    fn write_case(root: &Path, path: &str, source: &str) {
        let path = root.join(path);
        fs::create_dir_all(path.parent().unwrap()).unwrap();
        fs::write(path, source).unwrap();
    }

    #[test]
    fn filters_without_changing_full_corpus_statistics() {
        let fixture = TempDir::new().unwrap();
        let root = fixture.path();
        write_case(
            root,
            "language/selected.js",
            "/*---\ndescription: selected\n---*/\nlet value;",
        );
        write_case(
            root,
            "language/other.js",
            "\u{feff}/*---\ndescription: other\n---*/\nlet other;",
        );
        write_case(root, "language/value_FIXTURE.js", "export default 1;");
        write_case(root, "_FIXTURE/nested.js", "export default 2;");
        write_case(
            root,
            "staging/proposal.js",
            "/*---\ndescription: staging\n---*/",
        );

        let corpus = load(root, Some("selected.js")).unwrap();
        assert_eq!(corpus.stats.discovered, 5);
        assert_eq!(corpus.stats.selected, 1);
        assert_eq!(corpus.stats.excluded_by_policy, 3);
        assert_eq!(corpus.cases[0].path, Path::new("language/selected.js"));
        assert!(corpus.issues.is_empty());
    }
}
