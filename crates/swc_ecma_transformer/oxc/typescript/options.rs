use std::{borrow::Cow, fmt};

use serde::{
    Deserialize, Deserializer,
    de::{self, Visitor},
};

fn default_for_jsx_pragma() -> Cow<'static, str> {
    Cow::Borrowed("React.createElement")
}

fn default_for_jsx_pragma_frag() -> Cow<'static, str> {
    Cow::Borrowed("React.Fragment")
}

fn default_as_true() -> bool {
    true
}

#[derive(Debug, Clone, Deserialize)]
#[serde(default, rename_all = "camelCase", deny_unknown_fields)]
pub struct TypeScriptOptions {
    /// Replace the function used when compiling JSX expressions.
    /// This is so that we know that the import is not a type import, and should not be removed.
    /// defaults to React
    #[serde(default = "default_for_jsx_pragma")]
    pub jsx_pragma: Cow<'static, str>,

    /// Replace the function used when compiling JSX fragment expressions.
    /// This is so that we know that the import is not a type import, and should not be removed.
    /// defaults to React.Fragment
    #[serde(default = "default_for_jsx_pragma_frag")]
    pub jsx_pragma_frag: Cow<'static, str>,

    /// When set to true, the transform will only remove type-only imports (introduced in TypeScript 3.8).
    /// This should only be used if you are using TypeScript >= 3.8.
    pub only_remove_type_imports: bool,

    // Enables compilation of TypeScript namespaces.
    #[serde(default = "default_as_true")]
    pub allow_namespaces: bool,

    /// When enabled, type-only class fields are only removed if they are prefixed with the declare modifier:
    ///
    /// ## Deprecated
    ///
    /// Allowing `declare` fields is built-in support in Oxc without any option. If you want to remove class fields
    /// without initializer, you can use `remove_class_fields_without_initializer: true` instead.
    #[serde(default = "default_as_true")]
    pub allow_declare_fields: bool,

    /// When enabled, class fields without initializers are removed.
    ///
    /// For example:
    /// ```ts
    /// class Foo {
    ///    x: number;
    ///    y: number = 0;
    /// }
    /// ```
    /// // transform into
    /// ```js
    /// class Foo {
    ///    x: number;
    /// }
    /// ```
    ///
    /// The option is used to align with the behavior of TypeScript's `useDefineForClassFields: false` option.
    /// When you want to enable this, you also need to set [`crate::CompilerAssumptions::set_public_class_fields`]
    /// to `true`. The `set_public_class_fields: true` + `remove_class_fields_without_initializer: true` is
    /// equivalent to `useDefineForClassFields: false` in TypeScript.
    ///
    /// When `set_public_class_fields` is true and class-properties plugin is enabled, the above example transforms into:
    ///
    /// ```js
    /// class Foo {
    ///   constructor() {
    ///     this.y = 0;
    ///   }
    /// }
    /// ```
    ///
    /// Defaults to `false`.
    #[serde(default)]
    pub remove_class_fields_without_initializer: bool,

    /// Unused.
    pub optimize_const_enums: bool,

    // Preset options
    /// Modifies extensions in import and export declarations.
    ///
    /// This option, when used together with TypeScript's [`allowImportingTsExtension`](https://www.typescriptlang.org/tsconfig#allowImportingTsExtensions) option,
    /// allows writing complete relative specifiers in import declarations while using the same extension used by the source files.
    ///
    /// When set to `true`, same as [`RewriteExtensionsMode::Rewrite`]. Defaults to `false` (do nothing).
    #[serde(deserialize_with = "deserialize_rewrite_import_extensions")]
    pub rewrite_import_extensions: Option<RewriteExtensionsMode>,
}

impl Default for TypeScriptOptions {
    fn default() -> Self {
        Self {
            jsx_pragma: default_for_jsx_pragma(),
            jsx_pragma_frag: default_for_jsx_pragma_frag(),
            only_remove_type_imports: false,
            allow_namespaces: default_as_true(),
            allow_declare_fields: default_as_true(),
            remove_class_fields_without_initializer: false,
            optimize_const_enums: false,
            rewrite_import_extensions: None,
        }
    }
}

#[derive(Debug, Clone, Copy, Default)]
pub enum RewriteExtensionsMode {
    /// Rewrite `.ts`/`.mts`/`.cts` extensions in import/export declarations to `.js`/`.mjs`/`.cjs`.
    #[default]
    Rewrite,
    /// Remove `.ts`/`.mts`/`.cts`/`.tsx` extensions in import/export declarations.
    Remove,
}

impl RewriteExtensionsMode {
    pub fn is_remove(self) -> bool {
        matches!(self, Self::Remove)
    }
}

pub fn deserialize_rewrite_import_extensions<'de, D>(
    deserializer: D,
) -> Result<Option<RewriteExtensionsMode>, D::Error>
where
    D: Deserializer<'de>,
{
    struct RewriteExtensionsModeVisitor;

    impl Visitor<'_> for RewriteExtensionsModeVisitor {
        type Value = Option<RewriteExtensionsMode>;

        fn expecting(&self, formatter: &mut fmt::Formatter) -> fmt::Result {
            formatter.write_str("true, false, \"rewrite\", or \"remove\"")
        }

        fn visit_bool<E>(self, value: bool) -> Result<Self::Value, E>
        where
            E: de::Error,
        {
            if value { Ok(Some(RewriteExtensionsMode::Rewrite)) } else { Ok(None) }
        }

        fn visit_str<E>(self, value: &str) -> Result<Self::Value, E>
        where
            E: de::Error,
        {
            match value {
                "rewrite" => Ok(Some(RewriteExtensionsMode::Rewrite)),
                "remove" => Ok(Some(RewriteExtensionsMode::Remove)),
                _ => Err(E::custom(format!(
                    "Expected RewriteExtensionsMode is either \"rewrite\" or \"remove\" but found: {value}"
                ))),
            }
        }
    }

    deserializer.deserialize_any(RewriteExtensionsModeVisitor)
}
