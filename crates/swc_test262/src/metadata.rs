//! Test262 metadata parsing
//!
//! This module handles parsing of YAML metadata from test262 test files.
//! Test262 files contain metadata in the following format:
//!
//! ```javascript
//! /*---
//! description: Test description
//! esid: sec-example
//! flags: [onlyStrict]
//! features: [BigInt]
//! ---*/
//! // actual test code
//! ```

use std::fmt;

use serde::{Deserialize, Serialize};

/// Test262 test metadata extracted from YAML frontmatter
#[derive(Debug, Clone, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct Test262Metadata {
    /// Test description
    #[serde(default)]
    pub description: String,

    /// ECMA-262 spec reference (e.g., "sec-array-prototype-map")
    #[serde(default)]
    pub esid: Option<String>,

    /// Test flags (e.g., onlyStrict, noStrict, module, async)
    #[serde(default)]
    pub flags: Vec<Test262Flag>,

    /// Required language features (e.g., BigInt, async-iteration)
    #[serde(default)]
    pub features: Vec<String>,

    /// Include files (harness helpers like assert.js, sta.js)
    #[serde(default)]
    pub includes: Vec<String>,

    /// Expected error for negative tests
    #[serde(default)]
    pub negative: Option<Negative>,

    /// Locale requirements for Intl tests
    #[serde(default)]
    pub locale: Vec<String>,

    /// Author information
    #[serde(default)]
    pub author: Option<String>,

    /// Test information URL
    #[serde(default)]
    pub info: Option<String>,
}

/// Test flags that control how a test should be executed
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum Test262Flag {
    /// Test should only run in strict mode
    OnlyStrict,

    /// Test should only run in non-strict mode
    NoStrict,

    /// Test is a module (automatically strict)
    Module,

    /// Test should not have strict mode directive prepended
    Raw,

    /// Test uses asynchronous execution (requires $DONE callback)
    Async,

    /// Test was auto-generated
    Generated,

    /// Test requires Atomics.waitAsync to return "not-equal"
    /// (agent-CanBlockIsFalse)
    #[serde(rename = "CanBlockIsFalse")]
    CanBlockIsFalse,

    /// Test requires Atomics.waitAsync to return "ok" (agent-CanBlockIsTrue)
    #[serde(rename = "CanBlockIsTrue")]
    CanBlockIsTrue,

    /// Test is non-deterministic
    #[serde(rename = "non-deterministic")]
    NonDeterministic,
}

impl fmt::Display for Test262Flag {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::OnlyStrict => write!(f, "onlyStrict"),
            Self::NoStrict => write!(f, "noStrict"),
            Self::Module => write!(f, "module"),
            Self::Raw => write!(f, "raw"),
            Self::Async => write!(f, "async"),
            Self::Generated => write!(f, "generated"),
            Self::CanBlockIsFalse => write!(f, "CanBlockIsFalse"),
            Self::CanBlockIsTrue => write!(f, "CanBlockIsTrue"),
            Self::NonDeterministic => write!(f, "non-deterministic"),
        }
    }
}

/// Expected error for negative tests
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Negative {
    /// Error phase (parse, early, resolution, runtime)
    pub phase: ErrorPhase,

    /// Error type (e.g., "SyntaxError", "ReferenceError")
    #[serde(rename = "type")]
    pub error_type: String,
}

/// Phase at which an error is expected to occur
#[derive(Debug, Clone, Copy, PartialEq, Eq, Hash, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum ErrorPhase {
    /// Syntax error during parsing
    Parse,

    /// Early semantic error (parse succeeds but code is invalid)
    Early,

    /// Module resolution error
    Resolution,

    /// Runtime error during execution
    Runtime,
}

impl fmt::Display for ErrorPhase {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::Parse => write!(f, "parse"),
            Self::Early => write!(f, "early"),
            Self::Resolution => write!(f, "resolution"),
            Self::Runtime => write!(f, "runtime"),
        }
    }
}

/// Error types for metadata parsing
#[derive(Debug)]
pub enum MetadataError {
    /// No metadata found in file
    NoMetadata,

    /// Malformed metadata block
    MalformedMetadata,

    /// YAML parsing error
    YamlError(serde_yaml::Error),
}

impl fmt::Display for MetadataError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Self::NoMetadata => write!(f, "No metadata block found"),
            Self::MalformedMetadata => write!(f, "Malformed metadata block"),
            Self::YamlError(e) => write!(f, "YAML parsing error: {e}"),
        }
    }
}

impl std::error::Error for MetadataError {}

impl From<serde_yaml::Error> for MetadataError {
    fn from(err: serde_yaml::Error) -> Self {
        Self::YamlError(err)
    }
}

impl Test262Metadata {
    /// Parse metadata from test262 source code
    ///
    /// Extracts and parses the YAML metadata block from test262 test files.
    ///
    /// # Example
    ///
    /// ```rust
    /// use swc_test262::metadata::Test262Metadata;
    ///
    /// let source = r#"
    /// /*---
    /// description: Test BigInt
    /// features: [BigInt]
    /// ---*/
    /// const x = 123n;
    /// "#;
    ///
    /// let metadata = Test262Metadata::parse(source).unwrap();
    /// assert_eq!(metadata.features, vec!["BigInt"]);
    /// ```
    pub fn parse(source_code: &str) -> Result<Self, MetadataError> {
        let yaml_str = Self::extract_yaml_block(source_code)?;
        let metadata: Test262Metadata = serde_yaml::from_str(&yaml_str)?;
        Ok(metadata)
    }

    /// Extract YAML block from source code
    fn extract_yaml_block(source: &str) -> Result<String, MetadataError> {
        let start = source.find("/*---").ok_or(MetadataError::NoMetadata)?;
        let end = source[start..]
            .find("---*/")
            .ok_or(MetadataError::MalformedMetadata)?;

        let yaml = &source[start + 5..start + end];
        Ok(yaml.trim().to_string())
    }

    /// Extract actual test code (without metadata and copyright headers)
    pub fn extract_test_code(source: &str) -> String {
        if let Some(end) = source.find("---*/") {
            source[end + 5..].trim_start().to_string()
        } else {
            source.to_string()
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_parse_metadata() {
        let source = r#"
// Copyright (C) 2021 Ecma International. All rights reserved.
/*---
description: Test BigInt literals
esid: sec-bigint-literals
flags: [onlyStrict]
features: [BigInt]
---*/
const x = 123n;
"#;

        let metadata = Test262Metadata::parse(source).unwrap();
        assert_eq!(metadata.description, "Test BigInt literals");
        assert_eq!(metadata.esid, Some("sec-bigint-literals".to_string()));
        assert_eq!(metadata.flags, vec![Test262Flag::OnlyStrict]);
        assert_eq!(metadata.features, vec!["BigInt".to_string()]);
    }

    #[test]
    fn test_parse_negative_test() {
        let source = r#"
/*---
description: Invalid syntax
negative:
  phase: parse
  type: SyntaxError
---*/
for (let x = 0 x < 10; x++);
"#;

        let metadata = Test262Metadata::parse(source).unwrap();
        assert!(metadata.negative.is_some());
        let negative = metadata.negative.unwrap();
        assert_eq!(negative.phase, ErrorPhase::Parse);
        assert_eq!(negative.error_type, "SyntaxError");
    }

    #[test]
    fn test_extract_test_code() {
        let source = r#"
/*---
description: Test
---*/
const x = 1;
const y = 2;
"#;

        let code = Test262Metadata::extract_test_code(source);
        assert_eq!(code.trim(), "const x = 1;\nconst y = 2;");
    }
}
