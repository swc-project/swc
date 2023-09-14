use serde::{Deserialize, Serialize};

#[derive(Debug, Default, Serialize, Deserialize)]
pub struct Config {
    #[serde(default)]
    pub verbatim_module_syntax: bool,

    #[serde(default)]
    pub import_not_used_as_values: ImportsNotUsedAsValues,

    /// Don't create `export {}`.
    /// By default, strip creates `export {}` for modules to preserve module
    /// context.
    ///
    /// https://github.com/swc-project/swc/issues/1698
    #[serde(default)]
    pub no_empty_export: bool,

    #[serde(default)]
    pub import_export_assign_config: TsImportExportAssignConfig,
}

#[derive(Debug, Default, Serialize, Deserialize)]
pub struct TsxConfig {
    /// Note: this pass handle jsx directives in comments
    #[serde(default)]
    pub pragma: Option<String>,

    /// Note: this pass handle jsx directives in comments
    #[serde(default)]
    pub pragma_frag: Option<String>,
}

#[derive(Default, Clone, Copy, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub enum TsImportExportAssignConfig {
    /// - Rewrite `import foo = require("foo")` to `var foo = require("foo")`
    /// - Rewrite `export =` to `module.exports = `
    /// Note: This option is deprecated as all CJS/AMD/UMD can handle it
    /// themselves.
    #[default]
    Classic,

    /// preserve for CJS/AMD/UMD
    Preserve,

    /// Rewrite `import foo = require("foo")` to
    /// ```javascript
    /// import { createRequire as _createRequire } from "module";
    /// const __require = _createRequire(import.meta.url);
    /// const foo = __require("foo");
    /// ```
    ///
    /// Report error for `export =`
    NodeNext,

    /// Both `import =` and `export =` are disabled.
    /// An error will be reported if an import/export assignment is found.
    EsNext,
}

#[derive(Debug, Default, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
#[non_exhaustive]
pub enum ImportsNotUsedAsValues {
    #[serde(rename = "remove")]
    #[default]
    Remove,
    #[serde(rename = "preserve")]
    Preserve,
}

#[deprecated = "ImportNotUsedAsValues is renamed to ImportsNotUsedAsValues"]
pub type ImportNotUsedAsValues = ImportsNotUsedAsValues;
