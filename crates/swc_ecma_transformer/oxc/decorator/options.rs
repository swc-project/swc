use serde::Deserialize;

#[derive(Debug, Default, Clone, Copy, Deserialize)]
#[serde(default, rename_all = "camelCase", deny_unknown_fields)]
pub struct DecoratorOptions {
    /// Enables experimental support for decorators, which is a version of decorators that predates the TC39 standardization process.
    ///
    /// Decorators are a language feature which hasn’t yet been fully ratified into the JavaScript specification.
    /// This means that the implementation version in TypeScript may differ from the implementation in JavaScript when it is decided by TC39.
    ///
    /// <https://www.typescriptlang.org/tsconfig#experimentalDecorators>
    #[serde(skip)]
    pub legacy: bool,

    /// Enables emitting decorator metadata.
    ///
    /// This option is the same as [emitDecoratorMetadata](https://www.typescriptlang.org/tsconfig/#emitDecoratorMetadata)
    /// in TypeScript, and it only works when `legacy` is true.
    pub emit_decorator_metadata: bool,
}
