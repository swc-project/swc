//! Pinned upstream configuration and repository-local paths.

use std::{
    env, fmt, fs,
    path::{Path, PathBuf},
    str::FromStr,
};

use anyhow::{bail, Context, Result};
use serde::{de, Deserialize, Deserializer, Serialize, Serializer};

/// Name of the file that pins the external conformance repositories.
pub const UPSTREAMS_FILE: &str = "upstreams.toml";

/// Directory containing managed, untracked upstream checkouts.
pub const VENDOR_DIRECTORY: &str = "vendor";

/// A full Git object ID.
///
/// Test262 repositories are deliberately pinned to complete object IDs so an
/// upstream branch or abbreviated hash cannot silently change what CI runs.
#[derive(Clone, Debug, Eq, Hash, Ord, PartialEq, PartialOrd)]
pub struct Revision(String);

impl Revision {
    /// Validates and creates a pinned revision.
    pub fn new(value: impl Into<String>) -> Result<Self> {
        let value = value.into();
        if value.len() != 40 {
            bail!("revision must contain exactly 40 hexadecimal characters");
        }
        if !value.bytes().all(|byte| byte.is_ascii_hexdigit()) {
            bail!("revision must contain only hexadecimal characters");
        }

        Ok(Self(value.to_ascii_lowercase()))
    }

    /// Returns the normalized lowercase object ID.
    pub fn as_str(&self) -> &str {
        &self.0
    }
}

impl fmt::Display for Revision {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        formatter.write_str(self.as_str())
    }
}

impl FromStr for Revision {
    type Err = anyhow::Error;

    fn from_str(value: &str) -> Result<Self, Self::Err> {
        Self::new(value)
    }
}

impl Serialize for Revision {
    fn serialize<S>(&self, serializer: S) -> Result<S::Ok, S::Error>
    where
        S: Serializer,
    {
        serializer.serialize_str(self.as_str())
    }
}

impl<'de> Deserialize<'de> for Revision {
    fn deserialize<D>(deserializer: D) -> Result<Self, D::Error>
    where
        D: Deserializer<'de>,
    {
        let value = String::deserialize(deserializer)?;
        Self::new(value).map_err(de::Error::custom)
    }
}

/// The external repositories consumed by the conformance runner.
#[derive(Clone, Copy, Debug, Deserialize, Eq, Hash, Ord, PartialEq, PartialOrd, Serialize)]
#[serde(rename_all = "snake_case")]
pub enum UpstreamId {
    /// TC39's official Test262 repository.
    Test262,
}

impl UpstreamId {
    /// All managed upstreams in deterministic setup order.
    pub const ALL: [Self; 1] = [Self::Test262];

    /// Returns the TOML table name used for this upstream.
    pub const fn config_key(self) -> &'static str {
        match self {
            Self::Test262 => "test262",
        }
    }

    /// Returns the fixed directory name below [`VENDOR_DIRECTORY`].
    pub const fn vendor_dir(self) -> &'static str {
        match self {
            Self::Test262 => "test262",
        }
    }
}

impl fmt::Display for UpstreamId {
    fn fmt(&self, formatter: &mut fmt::Formatter<'_>) -> fmt::Result {
        formatter.write_str(self.vendor_dir())
    }
}

impl FromStr for UpstreamId {
    type Err = anyhow::Error;

    fn from_str(value: &str) -> Result<Self, Self::Err> {
        match value {
            "test262" => Ok(Self::Test262),
            _ => bail!("unknown upstream `{value}`"),
        }
    }
}

/// URL and immutable revision of one external repository.
#[derive(Clone, Debug, Deserialize, Eq, PartialEq, Serialize)]
#[serde(deny_unknown_fields)]
pub struct UpstreamConfig {
    /// Git fetch URL.
    pub url: String,
    /// Full commit object ID to check out.
    pub revision: Revision,
}

/// Contents of `upstreams.toml`.
#[derive(Clone, Debug, Deserialize, Eq, PartialEq, Serialize)]
#[serde(deny_unknown_fields)]
pub struct Upstreams {
    /// Official Test262 source and harness.
    pub test262: UpstreamConfig,
}

impl Upstreams {
    /// Loads the configuration belonging to `paths`.
    pub fn load(paths: &ProjectPaths) -> Result<Self> {
        Self::load_from(paths.upstreams_file())
    }

    /// Loads and validates an upstream configuration file.
    pub fn load_from(path: &Path) -> Result<Self> {
        let source = fs::read_to_string(path).with_context(|| {
            format!("failed to read upstream configuration `{}`", path.display())
        })?;
        let config = toml::from_str(&source).with_context(|| {
            format!(
                "failed to parse upstream configuration `{}`",
                path.display()
            )
        })?;
        Ok(config)
    }

    /// Writes a validated configuration in deterministic TOML form.
    pub fn save(&self, paths: &ProjectPaths) -> Result<()> {
        let mut source =
            toml::to_string_pretty(self).context("failed to serialize upstream pins")?;
        source.push('\n');
        fs::write(paths.upstreams_file(), source).with_context(|| {
            format!(
                "failed to write upstream configuration `{}`",
                paths.upstreams_file().display()
            )
        })
    }

    /// Returns the configuration for a typed upstream identifier.
    pub const fn get(&self, id: UpstreamId) -> &UpstreamConfig {
        match id {
            UpstreamId::Test262 => &self.test262,
        }
    }
}

/// Stable paths used by the Test262 tool.
///
/// The tool root is canonicalized when this value is constructed. Managed
/// checkout paths can therefore only be derived as direct children of its
/// `vendor` directory.
#[derive(Clone, Debug, Eq, PartialEq)]
pub struct ProjectPaths {
    workspace_root: PathBuf,
    tool_root: PathBuf,
    vendor_root: PathBuf,
    upstreams_file: PathBuf,
}

impl ProjectPaths {
    /// Locates paths from this crate's Cargo manifest directory.
    pub fn discover() -> Result<Self> {
        Self::from_tool_root(Path::new(env!("CARGO_MANIFEST_DIR")))
    }

    /// Locates the enclosing Cargo workspace from a Test262 tool directory.
    ///
    /// This constructor is also useful for isolated integration tests. The
    /// supplied directory must exist and have an ancestor Cargo manifest with
    /// a `[workspace]` table.
    pub fn from_tool_root(tool_root: &Path) -> Result<Self> {
        let tool_root = tool_root.canonicalize().with_context(|| {
            format!(
                "failed to locate Test262 tool root `{}`",
                tool_root.display()
            )
        })?;
        let workspace_root = find_workspace_root(&tool_root)?;
        let vendor_root = tool_root.join(VENDOR_DIRECTORY);
        let upstreams_file = tool_root.join(UPSTREAMS_FILE);

        Ok(Self {
            workspace_root,
            tool_root,
            vendor_root,
            upstreams_file,
        })
    }

    /// Root of the enclosing Cargo workspace.
    pub fn workspace_root(&self) -> &Path {
        &self.workspace_root
    }

    /// Root of the `tools/test262` crate.
    pub fn tool_root(&self) -> &Path {
        &self.tool_root
    }

    /// Root reserved for managed external repositories.
    pub fn vendor_root(&self) -> &Path {
        &self.vendor_root
    }

    /// Path to the pinned upstream configuration.
    pub fn upstreams_file(&self) -> &Path {
        &self.upstreams_file
    }

    /// Returns the only checkout path allowed for an upstream.
    pub fn upstream_dir(&self, id: UpstreamId) -> PathBuf {
        self.vendor_root.join(id.vendor_dir())
    }
}

fn find_workspace_root(tool_root: &Path) -> Result<PathBuf> {
    for ancestor in tool_root.ancestors() {
        let manifest = ancestor.join("Cargo.toml");
        let Ok(source) = fs::read_to_string(&manifest) else {
            continue;
        };
        let Ok(value) = toml::from_str::<toml::Value>(&source) else {
            continue;
        };
        if value.get("workspace").is_some() {
            return Ok(ancestor.to_path_buf());
        }
    }

    bail!(
        "failed to find a Cargo workspace containing `{}`",
        tool_root.display()
    )
}

#[cfg(test)]
mod tests {
    use std::fs;

    use tempfile::TempDir;

    use super::{ProjectPaths, Revision, UpstreamId, Upstreams};

    #[test]
    fn validates_complete_revisions() {
        let revision = Revision::new("ABCDEF0123456789abcdef0123456789abcdef01").unwrap();
        assert_eq!(
            revision.as_str(),
            "abcdef0123456789abcdef0123456789abcdef01"
        );

        assert!(Revision::new("abcdef").is_err());
        assert!(Revision::new("zbcdef0123456789abcdef0123456789abcdef01").is_err());
    }

    #[test]
    fn loads_typed_upstreams() {
        let directory = TempDir::new().unwrap();
        let path = directory.path().join("upstreams.toml");
        fs::write(
            &path,
            r#"
[test262]
url = "https://example.test/test262.git"
revision = "1111111111111111111111111111111111111111"

"#,
        )
        .unwrap();

        let upstreams = Upstreams::load_from(&path).unwrap();
        assert_eq!(
            upstreams.get(UpstreamId::Test262).revision.as_str(),
            "1111111111111111111111111111111111111111"
        );
    }

    #[test]
    fn discovers_workspace_and_managed_paths() {
        let directory = TempDir::new().unwrap();
        fs::write(directory.path().join("Cargo.toml"), "[workspace]\n").unwrap();
        let tool_root = directory.path().join("tools/test262");
        fs::create_dir_all(&tool_root).unwrap();

        let paths = ProjectPaths::from_tool_root(&tool_root).unwrap();
        assert_eq!(
            paths.workspace_root(),
            directory.path().canonicalize().unwrap()
        );
        assert_eq!(
            paths.upstream_dir(UpstreamId::Test262),
            tool_root.canonicalize().unwrap().join("vendor/test262")
        );
    }
}
