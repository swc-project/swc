use crate::{version::should_enable, BrowserData, Version, Versions};
use once_cell::sync::Lazy;
use std::collections::HashMap;
use string_enum::StringEnum;

impl Feature {
    pub fn should_enable(self, target: Versions, bugfixes: bool, default: bool) -> bool {
        let f = if bugfixes {
            &BUGFIX_FEATURES[&self]
        } else {
            if !FEATURES.contains_key(&self) {
                return false;
            }
            &FEATURES[&self]
        };

        should_enable(target, *f, default)
    }
}

#[derive(Clone, Copy, PartialEq, Eq, StringEnum, Hash)]
pub enum Feature {
    /// `transform-template-literals`
    TemplateLiterals,

    /// `transform-literals`
    Literals,

    /// `transform-function-name`
    FunctionName,

    /// `transform-arrow-functions`
    ArrowFunctions,

    /// `transform-block-scoped-functions`
    BlockScopedFunctions,

    /// `transform-classes`
    Classes,

    /// `transform-object-super`
    ObjectSuper,

    /// `transform-shorthand-properties`
    ShorthandProperties,

    /// `transform-duplicate-keys`
    DuplicateKeys,

    /// `transform-computed-properties`
    ComputedProperties,

    /// `transform-for-of`
    ForOf,

    /// `transform-sticky-regex`
    StickyRegex,

    /// `transform-dotall-regex`
    DotAllRegex,

    /// `transform-unicode-regex`
    UnicodeRegex,

    /// `transform-spread`
    Spread,

    /// `transform-parameters`
    Parameters,

    /// `transform-destructuring`
    Destructuring,

    /// `transform-block-scoping`
    BlockScoping,

    /// `transform-typeof-symbol`
    TypeOfSymbol,

    /// `transform-new-target`
    NewTarget,

    /// `transform-regenerator`
    Regenerator,

    /// `transform-exponentiation-operator`
    ExponentiationOperator,

    /// `transform-async-to-generator`
    AsyncToGenerator,

    /// `proposal-async-generator-functions`
    AsyncGeneratorFunctions,

    /// `proposal-object-rest-spread`
    ObjectRestSpread,

    /// `proposal-unicode-property-regex`
    UnicodePropertyRegex,

    /// `proposal-json-strings`
    JsonStrings,

    /// `proposal-optional-catch-binding`
    OptionalCatchBinding,

    /// `transform-named-capturing-groups-regex`
    NamedCapturingGroupsRegex,

    /// `transform-member-expression-literals`
    MemberExpressionLiterals,

    /// `transform-property-literals`
    PropertyLiterals,

    /// `transform-reserved-words`
    ReservedWords,

    /// `proposal-nullish-coalescing-operator`
    NullishCoalescing,

    /// `proposal-optional-chaining`
    OptionalChaining,

    /// `proposal-class-properties`
    ClassProperties,

    /// `proposal-numeric-separator`
    NumericSeparator,

    /// `proposal-private-methods`
    PrivateMethods,

    /// `transform-unicode-escapes`
    UnicodeEscapes,

    /// `bugfix/transform-async-arrows-in-class`
    BugfixAsyncArrowsInClass,

    /// `bugfix/transform-edge-default-parameters`
    BugfixEdgeDefaultParam,

    /// `bugfix/transform-tagged-template-caching`
    BugfixTaggedTemplateCaching,
}

pub(crate) static FEATURES: Lazy<HashMap<Feature, BrowserData<Option<Version>>>> =
    Lazy::new(|| {
        let map: HashMap<Feature, BrowserData<Option<String>>> =
            serde_json::from_str(include_str!("transform_data.json"))
                .expect("failed to parse json");

        map.into_iter()
            .map(|(feature, version)| {
                (
                    feature,
                    version.map_value(|version| version.map(|v| v.parse().unwrap())),
                )
            })
            .collect()
    });

pub(crate) static BUGFIX_FEATURES: Lazy<HashMap<Feature, BrowserData<Option<Version>>>> =
    Lazy::new(|| {
        let map: HashMap<Feature, BrowserData<Option<String>>> =
            serde_json::from_str(include_str!("transform_data_bugfixes.json"))
                .expect("failed to parse json");

        FEATURES
            .clone()
            .into_iter()
            .chain(map.into_iter().map(|(feature, version)| {
                (
                    feature,
                    version.map_value(|version| version.map(|v| v.parse().unwrap())),
                )
            }))
            .collect()
    });

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn arrow() {
        assert!(Feature::ArrowFunctions.should_enable(
            BrowserData {
                ie: Some("11.0.0".parse().unwrap()),
                ..Default::default()
            },
            false,
            false
        ));
    }

    #[test]
    fn tpl_lit() {
        assert!(!Feature::TemplateLiterals.should_enable(
            BrowserData {
                chrome: Some("71.0.0".parse().unwrap()),
                ..Default::default()
            },
            false,
            true
        ));
    }

    #[test]
    fn tpl_lit_bugfixes() {
        // Enable template literals pass in Safari 9 without bugfixes option
        assert!(Feature::TemplateLiterals.should_enable(
            BrowserData {
                safari: Some("9.0.0".parse().unwrap()),
                ..Default::default()
            },
            false,
            false
        ));

        assert!(!Feature::BugfixTaggedTemplateCaching.should_enable(
            BrowserData {
                safari: Some("10.0.0".parse().unwrap()),
                ..Default::default()
            },
            false,
            false
        ));

        // Don't enable it with the bugfixes option. Bugfix pass enabled instead.
        assert!(!Feature::TemplateLiterals.should_enable(
            BrowserData {
                safari: Some("9.0.0".parse().unwrap()),
                ..Default::default()
            },
            true,
            false
        ));

        assert!(Feature::BugfixTaggedTemplateCaching.should_enable(
            BrowserData {
                safari: Some("9.0.0".parse().unwrap()),
                ..Default::default()
            },
            true,
            false
        ));

        assert!(!Feature::BugfixTaggedTemplateCaching.should_enable(
            BrowserData {
                safari: Some("13.0.0".parse().unwrap()),
                ..Default::default()
            },
            true,
            false
        ));
    }

    #[test]
    fn edge_default_param_bug() {
        // Enable params pass in Edge 17 without bugfixes option
        assert!(Feature::Parameters.should_enable(
            BrowserData {
                edge: Some("17.0.0".parse().unwrap()),
                ..Default::default()
            },
            false,
            false
        ));

        assert!(!Feature::BugfixEdgeDefaultParam.should_enable(
            BrowserData {
                edge: Some("17.0.0".parse().unwrap()),
                ..Default::default()
            },
            false,
            false
        ));

        // Don't enable it with the bugfixes option. Bugfix pass enabled instead.
        assert!(!Feature::Parameters.should_enable(
            BrowserData {
                edge: Some("17.0.0".parse().unwrap()),
                ..Default::default()
            },
            true,
            false
        ));

        assert!(Feature::BugfixEdgeDefaultParam.should_enable(
            BrowserData {
                edge: Some("17.0.0".parse().unwrap()),
                ..Default::default()
            },
            true,
            false
        ));

        assert!(!Feature::BugfixEdgeDefaultParam.should_enable(
            BrowserData {
                edge: Some("18.0.0".parse().unwrap()),
                ..Default::default()
            },
            true,
            false
        ));
    }

    #[test]
    fn async_arrows_in_class_bug() {
        // Enable async to generator pass in Safari 10.1 without bugfixes option
        assert!(Feature::AsyncToGenerator.should_enable(
            BrowserData {
                safari: Some("10.1.0".parse().unwrap()),
                ..Default::default()
            },
            false,
            false
        ));

        assert!(!Feature::BugfixAsyncArrowsInClass.should_enable(
            BrowserData {
                safari: Some("10.1.0".parse().unwrap()),
                ..Default::default()
            },
            false,
            false
        ));

        // Don't enable it with the bugfixes option. Bugfix pass enabled instead.
        assert!(!Feature::AsyncToGenerator.should_enable(
            BrowserData {
                safari: Some("10.1.0".parse().unwrap()),
                ..Default::default()
            },
            true,
            false
        ));

        assert!(Feature::BugfixAsyncArrowsInClass.should_enable(
            BrowserData {
                safari: Some("10.1.0".parse().unwrap()),
                ..Default::default()
            },
            true,
            false
        ));

        assert!(!Feature::BugfixAsyncArrowsInClass.should_enable(
            BrowserData {
                safari: Some("11.1.0".parse().unwrap()),
                ..Default::default()
            },
            true,
            false
        ));
    }

    #[test]
    fn block_scoping() {
        // Enable block scoping pass in Safari 10 without bugfixes option
        assert!(Feature::BlockScoping.should_enable(
            BrowserData {
                safari: Some("10.0.0".parse().unwrap()),
                ..Default::default()
            },
            false,
            false
        ));

        // Don't enable it with the bugfixes option.
        assert!(!Feature::BlockScoping.should_enable(
            BrowserData {
                safari: Some("10.0.0".parse().unwrap()),
                ..Default::default()
            },
            true,
            false
        ));
    }
}
