#[cfg(feature = "serde-impl")]
use serde::{Deserialize, Serialize};
use swc_ecma_ast::EsVersion;

#[derive(Debug, Clone, Copy)]
#[cfg_attr(feature = "serde-impl", derive(Serialize, Deserialize))]
#[cfg_attr(feature = "serde-impl", serde(rename_all = "camelCase"))]
#[non_exhaustive]
pub struct Config {
    /// The target runtime environment.
    ///
    /// This defaults to [EsVersion::latest] because it preserves input as much
    /// as possible.
    ///
    /// Note: This does not verifies if output is valid for the target runtime.
    /// e.g. `const foo = 1;` with [EsVersion::Es3] will emitted as `const foo =
    /// 1` without verification.
    /// This is because it's not a concern of the code generator.
    #[cfg_attr(feature = "serde-impl", serde(default = "EsVersion::latest"))]
    pub target: EsVersion,

    /// Forces the code generator to use only ascii characters.
    ///
    /// This is useful for environments that do not support unicode.
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub ascii_only: bool,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub minify: bool,

    /// If true, the code generator will emit the lastest semicolon.
    ///
    /// Defaults to `false`.
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub omit_last_semi: bool,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub emit_assert_for_import_attributes: bool,

    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub inline_script: bool,

    /// If true, this will ignore all typescript related nodes and as such
    /// print valid javascript.
    ///
    /// Defaults to `false`,
    #[cfg_attr(feature = "serde-impl", serde(default))]
    pub ignore_typescript: bool,
}

impl Default for Config {
    fn default() -> Self {
        Self {
            target: EsVersion::latest(),
            minify: false,
            ascii_only: false,
            omit_last_semi: false,
            emit_assert_for_import_attributes: false,
            inline_script: false,
            ignore_typescript: false,
        }
    }
}

impl Config {
    pub fn with_target(mut self, target: EsVersion) -> Self {
        self.target = target;
        self
    }

    pub fn with_minify(mut self, minify: bool) -> Self {
        self.minify = minify;
        self
    }

    pub fn with_ascii_only(mut self, ascii_only: bool) -> Self {
        self.ascii_only = ascii_only;
        self
    }

    pub fn with_omit_last_semi(mut self, omit_last_semi: bool) -> Self {
        self.omit_last_semi = omit_last_semi;
        self
    }

    pub fn with_emit_assert_for_import_attributes(
        mut self,
        emit_assert_for_import_attributes: bool,
    ) -> Self {
        self.emit_assert_for_import_attributes = emit_assert_for_import_attributes;
        self
    }

    pub fn with_inline_script(mut self, inline_script: bool) -> Self {
        self.inline_script = inline_script;
        self
    }

    pub fn with_ignore_typescript(mut self, ignore_typescript: bool) -> Self {
        self.ignore_typescript = ignore_typescript;
        self
    }
}
