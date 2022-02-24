use serde::{Deserialize, Serialize};

/// Alternative for https://babeljs.io/docs/en/assumptions
///
/// All fields default to `false`.
#[derive(
    Debug, Default, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Hash, Serialize, Deserialize,
)]
#[non_exhaustive]
#[serde(rename_all = "camelCase", deny_unknown_fields)]
pub struct Assumptions {
    /// https://babeljs.io/docs/en/assumptions#arraylikeisiterable
    pub array_like_is_iterable: bool,

    /// https://babeljs.io/docs/en/assumptions#constantreexports
    pub constant_reexports: bool,

    /// https://babeljs.io/docs/en/assumptions#constantsuper
    pub constant_super: bool,

    /// https://babeljs.io/docs/en/assumptions#enumerablemodulemeta
    pub enumerable_module_meta: bool,

    /// https://babeljs.io/docs/en/assumptions#ignorefunctionlength
    pub ignore_function_length: bool,

    /// https://babeljs.io/docs/en/assumptions#ignoretoprimitivehint
    pub ignore_to_primitive_hint: bool,

    /// https://babeljs.io/docs/en/assumptions#iterableisarray
    pub iterable_is_array: bool,

    /// https://babeljs.io/docs/en/assumptions#mutabletemplateobject
    pub mutable_template_object: bool,

    /// https://babeljs.io/docs/en/assumptions#noclasscalls
    pub no_class_calls: bool,

    /// https://babeljs.io/docs/en/assumptions#nodocumentall
    pub no_document_all: bool,

    /// https://babeljs.io/docs/en/assumptions#noincompletensimportdetection
    pub no_incomplete_ns_import_detection: bool,

    /// https://babeljs.io/docs/en/assumptions#nonewarrows
    pub no_new_arrows: bool,
    /// https://babeljs.io/docs/en/assumptions#objectrestnosymbols
    pub object_rest_no_symbols: bool,

    /// https://babeljs.io/docs/en/assumptions#privatefieldsasproperties
    pub private_fields_as_properties: bool,

    /// https://babeljs.io/docs/en/assumptions#puregetters
    pub pure_getters: bool,

    /// https://babeljs.io/docs/en/assumptions#setclassmethods
    pub set_class_methods: bool,

    /// https://babeljs.io/docs/en/assumptions#setcomputedproperties
    pub set_computed_properties: bool,

    /// https://babeljs.io/docs/en/assumptions#setpublicclassfields
    pub set_public_class_fields: bool,

    /// https://babeljs.io/docs/en/assumptions#setspreadproperties
    pub set_spread_properties: bool,

    /// https://babeljs.io/docs/en/assumptions#skipforofiteratorclosing
    pub skip_for_of_iterator_closing: bool,

    /// https://babeljs.io/docs/en/assumptions#superiscallableconstructor
    pub super_is_callable_constructor: bool,

    pub ts_enum_is_readonly: bool,
}

impl Assumptions {
    pub fn all() -> Self {
        Self {
            array_like_is_iterable: true,
            constant_reexports: true,
            constant_super: true,
            enumerable_module_meta: true,
            ignore_function_length: true,
            ignore_to_primitive_hint: true,
            iterable_is_array: true,
            mutable_template_object: true,
            no_class_calls: true,
            no_document_all: true,
            no_incomplete_ns_import_detection: true,
            no_new_arrows: true,
            object_rest_no_symbols: true,
            private_fields_as_properties: true,
            pure_getters: true,
            set_class_methods: true,
            set_computed_properties: true,
            set_public_class_fields: true,
            set_spread_properties: true,
            skip_for_of_iterator_closing: true,
            super_is_callable_constructor: true,
            ts_enum_is_readonly: true,
        }
    }
}
