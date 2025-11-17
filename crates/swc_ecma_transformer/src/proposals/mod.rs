//! JavaScript proposals transformations.
//!
//! This module implements transformations for TC39 proposals that are not yet
//! part of the ECMAScript standard. Each proposal is at different stages:
//!
//! - **Stage 3**: Proposals that have achieved broad consensus and are ready
//!   for standardization.
//! - **Stage 2**: Proposals that describe the syntax and semantics but may
//!   still change.
//!
//! # Implemented Proposals
//!
//! ## Stage 3
//!
//! - **Decorators (2024)**: Transforms decorator syntax for classes and class
//!   members according to the current Stage 3 proposal. See
//!   [`decorators_2024`].
//! - **Explicit Resource Management**: Transforms `using` and `await using`
//!   declarations for managing resources. See [`explicit_resource_management`].
//!
//! ## Stage 2
//!
//! - **Pipeline Operator**: Transforms the pipeline operator `|>` for chaining
//!   operations. See [`pipeline_operator`].
//!
//! # References
//!
//! - TC39 Proposals: <https://github.com/tc39/proposals>
//! - Oxc Transformer: <https://github.com/oxc-project/oxc/tree/main/crates/oxc_transformer/src/proposals>

mod decorators_2024;
mod explicit_resource_management;
mod pipeline_operator;

pub use decorators_2024::Decorators2024;
pub use explicit_resource_management::ExplicitResourceManagement;
pub use pipeline_operator::PipelineOperator;
