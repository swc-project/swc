/// A serializable, wrapped struct for the diagnostics information
/// included in plugin binaries.
/// TODO: Must implement forward-compatible validation for schema changes to
/// prevent handshake failure.
#[derive(Debug, Clone, PartialEq, Eq)]
#[cfg_attr(
    feature = "encoding-impl",
    derive(::ast_node::Encode, ::ast_node::Decode)
)]
pub struct PluginCorePkgDiagnostics {
    pub pkg_version: String,
    pub git_sha: String,
    pub cargo_features: String,
    pub ast_schema_version: u32,
}
