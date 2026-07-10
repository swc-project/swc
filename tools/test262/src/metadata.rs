//! Strict parser for Test262 frontmatter.

use std::collections::HashSet;

use anyhow::{anyhow, bail, Context, Result};
use saphyr::{LoadableYamlNode, Yaml};

use crate::model::{Metadata, Negative, NegativePhase, TestFlag};

pub fn parse(code: &str) -> Result<Metadata> {
    let Some(start) = code.find("/*---") else {
        bail!("missing Test262 metadata start marker");
    };
    let Some(relative_end) = code[start + 5..].find("---*/") else {
        bail!("missing Test262 metadata end marker");
    };
    let end = start + 5 + relative_end;
    let yaml_source = code[start + 5..end]
        .replace("\r\n", "\n")
        .replace('\r', "\n");
    let documents = Yaml::load_from_str(&yaml_source).context("invalid Test262 YAML metadata")?;
    if documents.len() != 1 {
        bail!("Test262 metadata must contain exactly one YAML document");
    }
    let yaml = documents
        .first()
        .ok_or_else(|| anyhow!("empty Test262 YAML metadata"))?;
    if !yaml.is_mapping() {
        bail!("Test262 metadata must be a YAML mapping");
    }

    let features = strings(yaml, "features")?;
    let includes = strings(yaml, "includes")?;
    let flags = strings(yaml, "flags")?
        .into_iter()
        .map(|flag| TestFlag::parse(&flag).ok_or_else(|| anyhow!("unknown Test262 flag `{flag}`")))
        .collect::<Result<Vec<_>>>()?;
    validate_flags(&flags)?;

    let negative = yaml
        .as_mapping_get("negative")
        .filter(|value| !value.is_null() && !value.is_badvalue())
        .map(|value| {
            if !value.is_mapping() {
                bail!("negative must be a YAML mapping");
            }
            let phase = value["phase"]
                .as_str()
                .ok_or_else(|| anyhow!("negative.phase must be a string"))?;
            let phase = NegativePhase::parse(phase)
                .ok_or_else(|| anyhow!("unknown Test262 negative phase `{phase}`"))?;
            let error_type = value["type"]
                .as_str()
                .ok_or_else(|| anyhow!("negative.type must be a string"))?;
            Ok(Negative {
                phase,
                error_type: error_type.to_owned(),
            })
        })
        .transpose()?;

    let esid = yaml
        .as_mapping_get("esid")
        .and_then(Yaml::as_str)
        .map(ToOwned::to_owned);

    Ok(Metadata {
        esid,
        features,
        includes,
        flags,
        negative,
    })
}

fn validate_flags(flags: &[TestFlag]) -> Result<()> {
    let unique = flags.iter().copied().collect::<HashSet<_>>();
    if unique.len() != flags.len() {
        bail!("Test262 metadata contains duplicate flags");
    }

    let only_strict = unique.contains(&TestFlag::OnlyStrict);
    let no_strict = unique.contains(&TestFlag::NoStrict);
    if only_strict && no_strict {
        bail!("Test262 metadata cannot combine `onlyStrict` and `noStrict`");
    }
    if unique.contains(&TestFlag::Raw) && (only_strict || no_strict) {
        bail!("Test262 `raw` tests cannot request strictness injection");
    }
    if unique.contains(&TestFlag::Module) && (only_strict || no_strict) {
        bail!("Test262 module tests are inherently strict");
    }
    Ok(())
}

fn strings(yaml: &Yaml, key: &str) -> Result<Vec<String>> {
    let Some(value) = yaml.as_mapping_get(key) else {
        return Ok(Vec::new());
    };
    if value.is_null() || value.is_badvalue() {
        return Ok(Vec::new());
    }
    let values = value
        .as_vec()
        .ok_or_else(|| anyhow!("`{key}` must be a YAML sequence"))?;
    values
        .iter()
        .map(|value| {
            value
                .as_str()
                .map(ToOwned::to_owned)
                .ok_or_else(|| anyhow!("`{key}` entries must be strings"))
        })
        .collect()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn parses_metadata() {
        let metadata = parse(
            r#"/*---
esid: sec-example
features: [class]
includes: [compareArray.js]
flags: [onlyStrict, async]
negative:
  phase: runtime
  type: TypeError
---*/"#,
        )
        .unwrap();
        assert_eq!(metadata.esid.as_deref(), Some("sec-example"));
        assert_eq!(metadata.features, ["class"]);
        assert_eq!(metadata.includes, ["compareArray.js"]);
        assert!(metadata.flags.contains(&TestFlag::OnlyStrict));
        assert_eq!(metadata.negative.unwrap().phase, NegativePhase::Runtime);
    }

    #[test]
    fn rejects_unknown_flags() {
        let error = parse("/*---\nflags: [futureFlag]\n---*/").unwrap_err();
        assert!(error.to_string().contains("futureFlag"));
    }

    #[test]
    fn rejects_conflicting_strictness_flags() {
        let error = parse("/*---\nflags: [onlyStrict, noStrict]\n---*/").unwrap_err();
        assert!(error.to_string().contains("onlyStrict"));
    }

    #[test]
    fn rejects_non_mapping_metadata() {
        let error = parse("/*---\n- only-a-sequence\n---*/").unwrap_err();
        assert!(error.to_string().contains("mapping"));
    }
}
