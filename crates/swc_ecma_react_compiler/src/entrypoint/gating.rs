use swc_atoms::Atom;

use crate::{
    error::{CompilerError, CompilerErrorDetail, ErrorCategory},
    options::{DynamicGatingOptions, ExternalFunction, ParsedPluginOptions},
    utils::is_valid_identifier,
};

const DYNAMIC_GATING_PREFIX: &str = "use memo if(";
const DYNAMIC_GATING_SUFFIX: &str = ")";

pub fn find_dynamic_gating(
    directives: &[String],
    opts: &ParsedPluginOptions,
) -> Result<Option<ExternalFunction>, CompilerError> {
    let Some(dynamic_gating) = &opts.dynamic_gating else {
        return Ok(None);
    };

    find_dynamic_gating_with_opts(directives, dynamic_gating)
}

fn find_dynamic_gating_with_opts(
    directives: &[String],
    dynamic_gating: &DynamicGatingOptions,
) -> Result<Option<ExternalFunction>, CompilerError> {
    let mut matches = Vec::new();

    for directive in directives {
        let Some(candidate) = directive
            .strip_prefix(DYNAMIC_GATING_PREFIX)
            .and_then(|value| value.strip_suffix(DYNAMIC_GATING_SUFFIX))
        else {
            continue;
        };

        if !is_valid_identifier(candidate) {
            let mut detail = CompilerErrorDetail::error(
                ErrorCategory::Gating,
                "Dynamic gating directive is not a valid JavaScript identifier",
            );
            detail.description = Some(format!("Found '{directive}'"));
            return Err(CompilerError::with_detail(detail));
        }

        matches.push(candidate.to_string());
    }

    if matches.len() > 1 {
        let mut detail = CompilerErrorDetail::error(
            ErrorCategory::Gating,
            "Multiple dynamic gating directives found",
        );
        detail.description = Some(format!(
            "Expected a single directive but found [{}]",
            matches.join(", ")
        ));
        return Err(CompilerError::with_detail(detail));
    }

    let Some(import_specifier_name) = matches.into_iter().next() else {
        return Ok(None);
    };

    Ok(Some(ExternalFunction {
        source: dynamic_gating.source.clone(),
        import_specifier_name: Atom::from(import_specifier_name),
    }))
}

#[cfg(test)]
mod tests {
    use swc_atoms::Atom;

    use super::*;

    #[test]
    fn parses_dynamic_gating_directive() {
        let opts = ParsedPluginOptions {
            dynamic_gating: Some(DynamicGatingOptions {
                source: Atom::new("my-runtime"),
            }),
            ..crate::options::default_options()
        };

        let gating = find_dynamic_gating(&["use memo if(isEnabled)".into()], &opts)
            .unwrap()
            .unwrap();

        assert_eq!(gating.source, Atom::new("my-runtime"));
        assert_eq!(gating.import_specifier_name, Atom::new("isEnabled"));
    }
}
