pub use swc_ecma_ast as ast;
#[cfg(feature = "codegen")]
pub use swc_ecma_codegen as codegen;
#[cfg(feature = "parser")]
pub use swc_ecma_parser as parser;
#[cfg(feature = "transforms")]
pub use swc_ecma_transforms as transforms;
#[cfg(feature = "utils")]
pub use swc_ecma_utils as utils;
#[cfg(feature = "visit")]
pub use swc_ecma_visit as visit;
