use serde::Deserialize;

/// Compiler assumptions
///
/// For producing smaller output.
///
/// See <https://babeljs.io/docs/assumptions>
#[derive(Debug, Default, Clone, Copy, Deserialize)]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct CompilerAssumptions {
    #[serde(default)]
    #[deprecated = "Not Implemented"]
    pub array_like_is_iterable: bool,

    #[serde(default)]
    #[deprecated = "Not Implemented"]
    pub constant_reexports: bool,

    #[serde(default)]
    #[deprecated = "Not Implemented"]
    pub constant_super: bool,

    #[serde(default)]
    #[deprecated = "Not Implemented"]
    pub enumerable_module_meta: bool,

    #[serde(default)]
    pub ignore_function_length: bool,

    #[serde(default)]
    #[deprecated = "Not Implemented"]
    pub ignore_to_primitive_hint: bool,

    #[serde(default)]
    #[deprecated = "Not Implemented"]
    pub iterable_is_array: bool,

    #[serde(default)]
    #[deprecated = "Not Implemented"]
    pub mutable_template_object: bool,

    #[serde(default)]
    #[deprecated = "Not Implemented"]
    pub no_class_calls: bool,

    #[serde(default)]
    pub no_document_all: bool,

    #[serde(default)]
    #[deprecated = "Not Implemented"]
    pub no_incomplete_ns_import_detection: bool,

    #[serde(default)]
    #[deprecated = "Not Implemented"]
    pub no_new_arrows: bool,

    #[serde(default)]
    #[deprecated = "Not Implemented"]
    pub no_uninitialized_private_field_access: bool,

    #[serde(default)]
    pub object_rest_no_symbols: bool,

    #[serde(default)]
    #[deprecated = "Not Implemented"]
    pub private_fields_as_symbols: bool,

    #[serde(default)]
    pub private_fields_as_properties: bool,

    #[serde(default)]
    pub pure_getters: bool,

    #[serde(default)]
    #[deprecated = "Not Implemented"]
    pub set_class_methods: bool,

    #[serde(default)]
    #[deprecated = "Not Implemented"]
    pub set_computed_properties: bool,

    /// When using public class fields, assume that they don't shadow any getter in the current class,
    /// in its subclasses or in its superclass. Thus, it's safe to assign them rather than using
    /// `Object.defineProperty`.
    ///
    /// For example:
    ///
    /// Input:
    /// ```js
    /// class Test {
    ///  field = 2;
    ///
    ///  static staticField = 3;
    /// }
    /// ```
    ///
    /// When `set_public_class_fields` is `true`, the output will be:
    /// ```js
    /// class Test {
    ///  constructor() {
    ///    this.field = 2;
    ///  }
    /// }
    /// Test.staticField = 3;
    /// ```
    ///
    /// Otherwise, the output will be:
    /// ```js
    /// import _defineProperty from "@oxc-project/runtime/helpers/defineProperty";
    /// class Test {
    ///   constructor() {
    ///     _defineProperty(this, "field", 2);
    ///   }
    /// }
    /// _defineProperty(Test, "staticField", 3);
    /// ```
    ///
    /// NOTE: For TypeScript, if you wanted behavior is equivalent to `useDefineForClassFields: false`, you should
    /// set both `set_public_class_fields` and [`crate::TypeScriptOptions::remove_class_fields_without_initializer`]
    /// to `true`.
    #[serde(default)]
    pub set_public_class_fields: bool,

    #[serde(default)]
    #[deprecated = "Not Implemented"]
    pub set_spread_properties: bool,

    #[serde(default)]
    #[deprecated = "Not Implemented"]
    pub skip_for_of_iterator_closing: bool,

    #[serde(default)]
    #[deprecated = "Not Implemented"]
    pub super_is_callable_constructor: bool,
}
