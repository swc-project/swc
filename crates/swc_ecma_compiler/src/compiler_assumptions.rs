use serde::Deserialize;

/// Compiler assumptions for optimization.
///
/// These assumptions allow the compiler to generate smaller and faster output
/// by skipping certain runtime checks and edge case handling. However, they
/// require that your code follows specific constraints.
///
/// # Safety
///
/// Enabling these assumptions means you're asserting that your code behaves
/// in certain ways. If your code violates these assumptions, the generated
/// output may not work correctly. Use with caution and thorough testing.
///
/// # References
///
/// * Babel assumptions documentation: <https://babeljs.io/docs/assumptions>
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

    /// Assume that the `length` property of functions is not used.
    ///
    /// When enabled, the compiler can transform functions without worrying
    /// about preserving the correct `length` property value.
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

    /// Assume that `document.all` is not used in the code.
    ///
    /// `document.all` is a legacy API with unusual falsy behavior in
    /// boolean contexts. When this assumption is enabled, the compiler
    /// can optimize code without special handling for this edge case.
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

    /// Assume that object rest spread does not include symbol properties.
    ///
    /// When enabled, object rest/spread operations can skip symbol property
    /// handling, producing smaller and faster code.
    #[serde(default)]
    pub object_rest_no_symbols: bool,

    #[serde(default)]
    #[deprecated = "Not Implemented"]
    pub private_fields_as_symbols: bool,

    /// Transform private fields as properties instead of using WeakMaps.
    ///
    /// This produces simpler output but doesn't provide true privacy and
    /// may have different behavior in edge cases.
    #[serde(default)]
    pub private_fields_as_properties: bool,

    /// Assume that getters have no side effects and can be optimized.
    ///
    /// When enabled, property accesses are assumed to be pure operations,
    /// allowing the compiler to perform more aggressive optimizations.
    #[serde(default)]
    pub pure_getters: bool,

    #[serde(default)]
    #[deprecated = "Not Implemented"]
    pub set_class_methods: bool,

    #[serde(default)]
    #[deprecated = "Not Implemented"]
    pub set_computed_properties: bool,

    /// Assume public class fields don't shadow getters in the class hierarchy.
    ///
    /// When using public class fields, assume that they don't shadow any getter
    /// in the current class, in its subclasses, or in its superclass. This
    /// allows using simple assignment instead of `Object.defineProperty`.
    ///
    /// # Example
    ///
    /// Input code:
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
    /// NOTE: For TypeScript, if you wanted behavior is equivalent to
    /// `useDefineForClassFields: false`, you should
    /// set both `set_public_class_fields` and
    /// [`crate::TypeScriptOptions::remove_class_fields_without_initializer`]
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
