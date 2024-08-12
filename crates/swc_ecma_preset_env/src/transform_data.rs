use once_cell::sync::Lazy;
use preset_env_base::{
    version::{should_enable, Version},
    BrowserData, Versions,
};
use string_enum::StringEnum;
use swc_common::collections::AHashMap;

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
#[non_exhaustive]
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

    /// `transform-async-generator-functions`
    #[string_enum(alias("proposal-async-generator-functions"))]
    AsyncGeneratorFunctions,

    /// `transform-object-rest-spread`
    #[string_enum(alias("proposal-object-rest-spread"))]
    ObjectRestSpread,

    /// `transform-unicode-property-regex`
    #[string_enum(alias("proposal-unicode-property-regex"))]
    UnicodePropertyRegex,

    /// `transform-json-strings`
    #[string_enum(alias("proposal-json-strings"))]
    JsonStrings,

    /// `transform-optional-catch-binding`
    #[string_enum(alias("proposal-optional-catch-binding"))]
    OptionalCatchBinding,

    /// `transform-named-capturing-groups-regex`
    NamedCapturingGroupsRegex,

    /// `transform-member-expression-literals`
    MemberExpressionLiterals,

    /// `transform-property-literals`
    PropertyLiterals,

    /// `transform-reserved-words`
    ReservedWords,

    /// `transform-export-namespace-from`
    #[string_enum(alias("proposal-export-namespace-from"))]
    ExportNamespaceFrom,

    /// `transform-nullish-coalescing-operator`
    #[string_enum(alias("proposal-nullish-coalescing-operator"))]
    NullishCoalescing,

    /// `transform-logical-assignment-operators`
    #[string_enum(alias("proposal-logical-assignment-operators"))]
    LogicalAssignmentOperators,

    /// `transform-optional-chaining`
    #[string_enum(alias("proposal-optional-chaining"))]
    OptionalChaining,

    /// `transform-class-properties`
    #[string_enum(alias("proposal-class-properties"))]
    ClassProperties,

    /// `transform-numeric-separator`
    #[string_enum(alias("proposal-numeric-separator"))]
    NumericSeparator,

    /// `transform-private-methods`
    #[string_enum(alias("proposal-private-methods"))]
    PrivateMethods,

    /// `transform-class-static-block`
    #[string_enum(alias("proposal-class-static-block"))]
    ClassStaticBlock,

    /// `transform-private-property-in-object`
    #[string_enum(alias("proposal-private-property-in-object"))]
    PrivatePropertyInObject,

    /// `transform-unicode-escapes`
    UnicodeEscapes,

    /// `transform-unicode-sets-regex`
    UnicodeSetsRegex,

    /// `transform-duplicate-named-capturing-groups-regex`
    DuplicateNamedCapturingGroupsRegex, // TODO

    /// `bugfix/transform-async-arrows-in-class`
    BugfixAsyncArrowsInClass,

    /// `bugfix/transform-edge-default-parameters`
    BugfixEdgeDefaultParam,

    /// `bugfix/transform-tagged-template-caching`
    BugfixTaggedTemplateCaching,

    /// `bugfix/transform-safari-id-destructuring-collision-in-function-expression`
    BugfixSafariIdDestructuringCollisionInFunctionExpression,

    /// `bugfix/transform-edge-function-name`
    BugfixTransformEdgeFunctionName, // TODO

    /// `bugfix/transform-safari-block-shadowing`
    BugfixTransformSafariBlockShadowing, // TODO

    /// `bugfix/transform-safari-for-shadowing`
    BugfixTransformSafariForShadowing, // TODO

    /// `bugfix/transform-v8-spread-parameters-in-optional-chaining`
    BugfixTransformV8SpreadParametersInOptionalChaining, // TODO

    /// `bugfix/transform-v8-static-class-fields-redefine-readonly`
    BugfixTransformV8StaticClassFieldsRedefineReadonly, // TODO

    /// `bugfix/transform-firefox-class-in-computed-class-key`
    BugfixTransformFirefoxClassInComputedClassKey, // TODO

    /// `bugfix/transform-safari-class-field-initializer-scope`
    BugfixTransformSafariClassFieldInitializerScope, // TODO
}

pub(crate) static FEATURES: Lazy<AHashMap<Feature, BrowserData<Option<Version>>>> =
    Lazy::new(|| {
        let map: AHashMap<Feature, BrowserData<Option<String>>> =
            serde_json::from_str(include_str!("../data/@babel/compat-data/data/plugins.json"))
                .expect("failed to parse json");

        map.into_iter()
            .map(|(feature, version)| {
                (
                    feature,
                    version.map_value(|version| {
                        if matches!(version.as_deref(), Some("tp")) {
                            return None;
                        }

                        version.map(|v| {
                            v.parse().unwrap_or_else(|err| {
                                panic!("failed to parse `{v}` as a version: {err:?}")
                            })
                        })
                    }),
                )
            })
            .collect()
    });

pub(crate) static BUGFIX_FEATURES: Lazy<AHashMap<Feature, BrowserData<Option<Version>>>> =
    Lazy::new(|| {
        let map: AHashMap<Feature, BrowserData<Option<String>>> = serde_json::from_str(
            include_str!("../data/@babel/compat-data/data/plugin-bugfixes.json"),
        )
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
