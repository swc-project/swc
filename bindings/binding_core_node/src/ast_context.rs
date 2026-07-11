//! Version selection for the shared AST wire codec.

use swc_api_common::{
    deserialize_program_input as deserialize, serialize_program as serialize, WireVersion,
};
pub use swc_api_common::{prepare_program_with_context, ProgramInput};
use swc_core::{common::SourceFile, ecma::ast::Program};

#[cfg(feature = "api_v1")]
const WIRE_VERSION: WireVersion = WireVersion::V1;

#[cfg(feature = "api_v2")]
const WIRE_VERSION: WireVersion = WireVersion::V2;

pub fn serialize_program(program: Program, fm: &SourceFile) -> Result<String, serde_json::Error> {
    serialize(WIRE_VERSION, program, fm)
}

pub fn deserialize_program_input(json: &str) -> Result<ProgramInput, serde_json::Error> {
    deserialize(WIRE_VERSION, json)
}
