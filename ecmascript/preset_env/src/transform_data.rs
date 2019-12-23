use crate::{BrowserData, Versions};
use hashbrown::HashMap;
use once_cell::sync::Lazy;
use semver::Version;
use string_enum::StringEnum;

impl Feature {
    pub fn should_enable(self, c: &Versions, default: bool) -> bool {
        let f = &FEATURES[&self];

        if c.as_ref()
            .iter()
            .zip(f.iter())
            .all(|((_, target_version), (_, f))| target_version.is_none() && f.is_none())
        {
            return default;
        }

        c.as_ref()
            .iter()
            .zip(f.iter())
            .any(|((_, target_version), (_, f))| {
                if target_version.is_none() {
                    return false;
                }

                if f.is_none() {
                    return true;
                }

                let f = f.as_ref().unwrap();
                let target = target_version.unwrap();

                *f >= *target
            })
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
}

pub fn parse_version(v: &str) -> Version {
    if !v.contains(".") {
        return Version {
            major: v.parse().unwrap(),
            minor: 0,
            patch: 0,
            pre: vec![],
            build: vec![],
        };
    }

    if v.split(".").count() == 2 {
        let mut s = v.split(".");
        return Version {
            major: s.next().unwrap().parse().unwrap(),
            minor: s.next().unwrap().parse().unwrap(),
            patch: 0,
            pre: vec![],
            build: vec![],
        };
    }

    v.parse()
        .unwrap_or_else(|err| panic!("failed to parse {} as semver: {}", v, err))
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
                    version.map_value(|version| version.map(|v| parse_version(&*v))),
                )
            })
            .collect()
    });

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn arrow() {
        assert!(Feature::ArrowFunctions.should_enable(
            &BrowserData {
                ie: Some("11.0.0".parse().unwrap()),
                ..Default::default()
            },
            false
        ));
    }

    #[test]
    fn tpl_lit() {
        assert!(!Feature::TemplateLiterals.should_enable(
            &BrowserData {
                chrome: Some("71.0.0".parse().unwrap()),
                ..Default::default()
            },
            true
        ));
    }
}
