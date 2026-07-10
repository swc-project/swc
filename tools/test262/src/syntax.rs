//! Central mapping from Test262 feature metadata to SWC parser options.

use swc_ecma_parser::{EsSyntax, Syntax};

use crate::model::{Metadata, TestFlag};

/// Returns the latest ECMAScript syntax supported by SWC for one Test262 case.
///
/// Stage-three syntax in Test262 is explicitly annotated. Keeping this mapping
/// in one place prevents individual suites from silently accepting different
/// languages for the same input.
pub fn for_metadata(metadata: &Metadata) -> Syntax {
    let decorators = has_feature(metadata, "decorators");
    let explicit_resource_management = has_feature(metadata, "explicit-resource-management")
        || metadata.has_flag(TestFlag::ExplicitResourceManagement);

    Syntax::Es(EsSyntax {
        decorators,
        decorators_before_export: decorators,
        auto_accessors: decorators,
        explicit_resource_management,
        ..Default::default()
    })
}

fn has_feature(metadata: &Metadata, expected: &str) -> bool {
    metadata.features.iter().any(|feature| feature == expected)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn enables_only_annotated_proposals() {
        let plain = for_metadata(&Metadata::default());
        assert!(!plain.decorators());
        assert!(!plain.explicit_resource_management());

        let proposals = for_metadata(&Metadata {
            features: vec!["decorators".into(), "explicit-resource-management".into()],
            ..Default::default()
        });
        assert!(proposals.decorators());
        assert!(proposals.decorators_before_export());
        assert!(proposals.explicit_resource_management());
    }
}
