use std::{cell::RefCell, rc::Rc};

use swc_common::collections::AHashSet;
use swc_ecma_ast::EsVersion::{self, *};

#[derive(Clone, Copy, PartialEq, Eq, Hash)]
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

    /// `proposal-export-namespace-from`
    ExportNamespaceFrom,

    /// `proposal-nullish-coalescing-operator`
    NullishCoalescing,

    /// `proposal-logical-assignment-operators`
    LogicalAssignmentOperators,

    /// `proposal-optional-chaining`
    OptionalChaining,

    /// `proposal-class-properties`
    ClassProperties,

    /// `proposal-numeric-separator`
    NumericSeparator,

    /// `proposal-private-methods`
    PrivateMethods,

    /// `proposal-class-static-block`
    ClassStaticBlock,

    /// `proposal-private-property-in-object`
    PrivatePropertyInObject,

    /// `transform-unicode-escapes`
    UnicodeEscapes,

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
}

pub type FeatureSet = Rc<RefCell<AHashSet<Feature>>>;

pub fn enable_available_feature_from_es_version(set: FeatureSet, version: EsVersion) {
    if version < Es5 {
        return;
    }

    set.borrow_mut().extend(vec![
        Feature::PropertyLiterals,
        Feature::MemberExpressionLiterals,
        Feature::ReservedWords,
    ]);

    if version < Es2015 {
        return;
    }

    set.borrow_mut().extend(vec![
        Feature::ArrowFunctions,
        Feature::BlockScopedFunctions,
        Feature::BlockScoping,
        Feature::Classes,
        Feature::ComputedProperties,
        Feature::Destructuring,
        Feature::DuplicateKeys,
        Feature::ForOf,
        Feature::FunctionName,
        Feature::NewTarget,
        Feature::ObjectSuper,
        Feature::Parameters,
        Feature::Regenerator,
        Feature::ShorthandProperties,
        Feature::Spread,
        Feature::StickyRegex,
        Feature::TemplateLiterals,
        Feature::TypeOfSymbol,
        Feature::UnicodeRegex,
    ]);

    if version < Es2016 {
        return;
    }

    set.borrow_mut().insert(Feature::ExponentiationOperator);

    if version < Es2017 {
        return;
    }

    // support `async`
    set.borrow_mut().insert(Feature::AsyncToGenerator);

    if version < Es2018 {
        return;
    }

    set.borrow_mut().extend(vec![
        Feature::ObjectRestSpread,
        Feature::DotAllRegex,
        Feature::NamedCapturingGroupsRegex,
        Feature::UnicodePropertyRegex,
    ]);

    if version < Es2019 {
        return;
    }

    set.borrow_mut().insert(Feature::OptionalCatchBinding);

    if version < Es2020 {
        return;
    }

    set.borrow_mut().extend(vec![
        Feature::ExportNamespaceFrom,
        Feature::NullishCoalescing,
        Feature::OptionalChaining,
    ]);

    if version < Es2021 {
        return;
    }

    set.borrow_mut().insert(Feature::LogicalAssignmentOperators);

    if version < Es2022 {
        return;
    }

    set.borrow_mut().extend(vec![
        Feature::ClassProperties,
        Feature::ClassStaticBlock,
        Feature::PrivatePropertyInObject,
    ]);
}
