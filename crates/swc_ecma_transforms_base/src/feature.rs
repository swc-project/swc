#![allow(non_upper_case_globals)]
use bitflags::bitflags;
use swc_ecma_ast::EsVersion::{self, *};

bitflags! {
    pub struct FeatureFlag: u64 {
        /// `transform-template-literals`
        const TemplateLiterals = 1 << 1;

        /// `transform-literals`
        const Literals = 1 << 2;

        /// `transform-function-name`
        const FunctionName = 1 << 3;

        /// `transform-arrow-functions`
        const ArrowFunctions = 1 << 4;

        /// `transform-block-scoped-functions`
        const BlockScopedFunctions = 1 << 5;

        /// `transform-classes`
        const Classes = 1 << 6;

        /// `transform-object-super`
        const ObjectSuper = 1 << 7;

        /// `transform-shorthand-properties`
        const ShorthandProperties = 1 << 8;

        /// `transform-duplicate-keys`
        const DuplicateKeys = 1 << 9;

        /// `transform-computed-properties`
        const ComputedProperties = 1 << 10;

        /// `transform-for-of`
        const ForOf = 1 << 11;

        /// `transform-sticky-regex`
        const StickyRegex = 1 << 12;

        /// `transform-dotall-regex`
        const DotAllRegex = 1 << 13;

        /// `transform-unicode-regex`
        const UnicodeRegex = 1 << 14;

        /// `transform-spread`
        const Spread = 1 << 15;

        /// `transform-parameters`
        const Parameters = 1 << 16;

        /// `transform-destructuring`
        const Destructuring = 1 << 17;

        /// `transform-block-scoping`
        const BlockScoping = 1 << 18;

        /// `transform-typeof-symbol`
        const TypeOfSymbol = 1 << 19;

        /// `transform-new-target`
        const NewTarget = 1 << 20;

        /// `transform-regenerator`
        const Regenerator = 1 << 21;

        /// `transform-exponentiation-operator`
        const ExponentiationOperator = 1 << 22;

        /// `transform-async-to-generator`
        const AsyncToGenerator = 1 << 23;

        /// `proposal-async-generator-functions`
        const AsyncGeneratorFunctions = 1 << 24;

        /// `proposal-object-rest-spread`
        const ObjectRestSpread = 1 << 25;

        /// `proposal-unicode-property-regex`
        const UnicodePropertyRegex = 1 << 26;

        /// `proposal-json-strings`
        const JsonStrings = 1 << 27;

        /// `proposal-optional-catch-binding`
        const OptionalCatchBinding = 1 << 28;

        /// `transform-named-capturing-groups-regex`
        const NamedCapturingGroupsRegex = 1 << 29;

        /// `transform-member-expression-literals`
        const MemberExpressionLiterals = 1 << 30;

        /// `transform-property-literals`
        const PropertyLiterals = 1 << 31;

        /// `transform-reserved-words`
        const ReservedWords = 1 << 32;

        /// `proposal-export-namespace-from`
        const ExportNamespaceFrom = 1 << 33;

        /// `proposal-nullish-coalescing-operator`
        const NullishCoalescing = 1 << 34;

        /// `proposal-logical-assignment-operators`
        const LogicalAssignmentOperators = 1 << 35;

        /// `proposal-optional-chaining`
        const OptionalChaining = 1 << 36;

        /// `proposal-class-properties`
        const ClassProperties = 1 << 37;

        /// `proposal-numeric-separator`
        const NumericSeparator = 1 << 38;

        /// `proposal-private-methods`
        const PrivateMethods = 1 << 39;

        /// `proposal-class-static-block`
        const ClassStaticBlock = 1 << 40;

        /// `proposal-private-property-in-object`
        const PrivatePropertyInObject = 1 << 41;

        /// `transform-unicode-escapes`
        const UnicodeEscapes = 1 << 42;

        /// `bugfix/transform-async-arrows-in-class`
        const BugfixAsyncArrowsInClass = 1 << 43;

        /// `bugfix/transform-edge-default-parameters`
        const BugfixEdgeDefaultParam = 1 << 44;

        /// `bugfix/transform-tagged-template-caching`
        const BugfixTaggedTemplateCaching = 1 << 45;

        /// `bugfix/transform-safari-id-destructuring-collision-in-function-expression`
        const BugfixSafariIdDestructuringCollisionInFunctionExpression = 1 << 46;

        /// `bugfix/transform-edge-function-name`
        const BugfixTransformEdgeFunctionName = 1 << 47; // TODO

        /// `bugfix/transform-safari-block-shadowing`
        const BugfixTransformSafariBlockShadowing = 1 << 48; // TODO

        /// `bugfix/transform-safari-for-shadowing`
        const BugfixTransformSafariForShadowing = 1 << 49; // TODO

        /// `bugfix/transform-v8-spread-parameters-in-optional-chaining`
        const BugfixTransformV8SpreadParametersInOptionalChaining = 1 << 50; // TODO
    }
}

pub fn enable_available_feature_from_es_version(version: EsVersion) -> FeatureFlag {
    if version == EsVersion::latest() {
        return FeatureFlag::all();
    }

    let mut feature = FeatureFlag::empty();

    if version < Es5 {
        return feature;
    }

    feature |= FeatureFlag::PropertyLiterals
        | FeatureFlag::MemberExpressionLiterals
        | FeatureFlag::ReservedWords;

    if version < Es2015 {
        return feature;
    }

    feature |= FeatureFlag::ArrowFunctions
        | FeatureFlag::BlockScopedFunctions
        | FeatureFlag::BlockScoping
        | FeatureFlag::Classes
        | FeatureFlag::ComputedProperties
        | FeatureFlag::Destructuring
        | FeatureFlag::DuplicateKeys
        | FeatureFlag::ForOf
        | FeatureFlag::FunctionName
        | FeatureFlag::NewTarget
        | FeatureFlag::ObjectSuper
        | FeatureFlag::Parameters
        | FeatureFlag::Regenerator
        | FeatureFlag::ShorthandProperties
        | FeatureFlag::Spread
        | FeatureFlag::StickyRegex
        | FeatureFlag::TemplateLiterals
        | FeatureFlag::TypeOfSymbol
        | FeatureFlag::UnicodeRegex;

    if version < Es2016 {
        return feature;
    }

    feature |= FeatureFlag::ExponentiationOperator;

    if version < Es2017 {
        return feature;
    }

    // support `async`
    feature |= FeatureFlag::AsyncToGenerator;

    if version < Es2018 {
        return feature;
    }

    feature |= FeatureFlag::ObjectRestSpread
        | FeatureFlag::DotAllRegex
        | FeatureFlag::NamedCapturingGroupsRegex
        | FeatureFlag::UnicodePropertyRegex;

    if version < Es2019 {
        return feature;
    }

    feature |= FeatureFlag::OptionalCatchBinding;

    if version < Es2020 {
        return feature;
    }

    feature |= FeatureFlag::ExportNamespaceFrom
        | FeatureFlag::NullishCoalescing
        | FeatureFlag::OptionalChaining;

    if version < Es2021 {
        return feature;
    }

    feature |= FeatureFlag::LogicalAssignmentOperators;

    if version < Es2022 {
        return feature;
    }

    feature |= FeatureFlag::ClassProperties
        | FeatureFlag::ClassStaticBlock
        | FeatureFlag::PrivatePropertyInObject;

    feature
}
