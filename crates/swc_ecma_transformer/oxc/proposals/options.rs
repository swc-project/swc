/// Configuration options for JavaScript proposals transformations.
///
/// This struct provides configuration for transforming Stage 2 and Stage 3
/// TC39 proposals that are not yet part of the ECMAScript standard.
#[derive(Debug, Clone, Copy, Default)]
pub struct ProposalOptions {
    /// Enable Stage 3 decorators transformation.
    ///
    /// Stage: 3
    /// Proposal: <https://github.com/tc39/proposal-decorators>
    ///
    /// Transforms decorator syntax for classes and class members according to
    /// the current Stage 3 decorators proposal. This is different from legacy
    /// decorators.
    pub decorators_2024: bool,

    /// Enable explicit resource management transformation.
    ///
    /// Stage: 3
    /// Proposal: <https://github.com/tc39/proposal-explicit-resource-management>
    ///
    /// Transforms `using` and `await using` declarations for managing resources
    /// that need explicit disposal.
    pub explicit_resource_management: bool,

    /// Enable pipeline operator transformation.
    ///
    /// Stage: 2
    /// Proposal: <https://github.com/tc39/proposal-pipeline-operator>
    ///
    /// Transforms the pipeline operator `|>` for chaining operations.
    /// Note: This is a Stage 2 proposal and syntax may change.
    pub pipeline_operator: bool,
}
