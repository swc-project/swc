/// A serializable, wrapped struct for the diagnostics information
/// included in plugin binaries.
/// TODO: Must implement bytecheck with forward-compatible schema changes to
/// prevent handshake failure.
#[derive(Debug, Clone, PartialEq, Eq)]
#[cfg_attr(
    any(feature = "rkyv-impl"),
    derive(rkyv::Archive, rkyv::Serialize, rkyv::Deserialize)
)]
#[cfg_attr(feature = "rkyv-impl", archive(check_bytes))]

pub struct PluginCorePkgDiagnostics {
    pub pkg_version: String,
    pub git_sha: String,
    pub cargo_features: String,
    pub ast_schema_version: u32,
}
