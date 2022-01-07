macro_rules! gen_ext_helper_name {
    (apply_decorated_descriptor) => {
        Some("applyDecoratedDescriptor")
    };

    (array_like_to_array) => {
        Some("arrayLikeToArray")
    };

    (array_with_holes) => {
        Some("arrayWithHoles")
    };

    (array_without_holes) => {
        Some("arrayWithoutHoles")
    };

    (assert_this_initialized) => {
        Some("assertThisInitialized")
    };

    (async_generator) => {
        Some("asyncGenerator")
    };

    (async_generator_delegate) => {
        Some("asyncGeneratorDelegate")
    };

    (async_iterator) => {
        Some("asyncIterator")
    };

    (async_to_generator) => {
        Some("asyncToGenerator")
    };

    (await_async_generator) => {
        Some("awaitAsyncGenerator")
    };

    (await_value) => {
        Some("awaitValue")
    };

    (class_call_check) => {
        Some("classCallCheck")
    };

    (class_name_tdz_error) => {
        Some("classNameTDZError")
    };

    (class_private_field_get) => {
        Some("classPrivateFieldGet")
    };

    (class_private_field_loose_base) => {
        Some("classPrivateFieldLooseBase")
    };

    (class_private_field_set) => {
        Some("classPrivateFieldSet")
    };

    (class_private_method_get) => {
        Some("classPrivateMethodGet")
    };

    (class_private_method_set) => {
        Some("classPrivateMethodSet")
    };

    (class_static_private_field_spec_get) => {
        Some("classStaticPrivateFieldSpecGet")
    };

    (class_static_private_field_spec_set) => {
        Some("classStaticPrivateFieldSpecSet")
    };

    (construct) => {
        Some("construct")
    };

    (create_class) => {
        Some("createClass")
    };

    (create_super) => {
        Some("createSuper")
    };

    (decorate) => {
        Some("decorate")
    };

    (defaults) => {
        Some("defaults")
    };

    (define_enumerable_properties) => {
        Some("defineEnumerableProperties")
    };

    (define_property) => {
        Some("defineProperty")
    };

    (extends) => {
        Some("extends")
    };

    (get) => {
        Some("get")
    };

    (get_prototype_of) => {
        Some("getPrototypeOf")
    };

    (inherits) => {
        Some("inherits")
    };

    (inherits_loose) => {
        Some("inheritsLoose")
    };

    (initializer_define_property) => {
        Some("initializerDefineProperty")
    };

    (initializer_warning_helper) => {
        Some("initializerWarningHelper")
    };

    (instanceof) => {
        Some("_instanceof")
    };

    (interop_require_default) => {
        Some("interopRequireDefault")
    };

    (interop_require_wildcard) => {
        Some("interopRequireWildcard")
    };

    (is_native_function) => {
        Some("isNativeFunction")
    };

    (is_native_reflect_construct) => {
        Some("isNativeReflectConstruct")
    };

    (iterable_to_array) => {
        Some("iterableToArray")
    };

    (iterable_to_array_limit) => {
        Some("iterableToArrayLimit")
    };

    (iterable_to_array_limit_loose) => {
        Some("iterableToArrayLimitLoose")
    };

    (jsx) => {
        Some("jsx")
    };

    (new_arrow_check) => {
        Some("newArrowCheck")
    };

    (non_iterable_rest) => {
        Some("nonIterableRest")
    };

    (non_iterable_spread) => {
        Some("nonIterableSpread")
    };

    (object_spread) => {
        Some("objectSpread")
    };

    (object_without_properties) => {
        Some("objectWithoutProperties")
    };

    (object_without_properties_loose) => {
        Some("objectWithoutPropertiesLoose")
    };

    (possible_constructor_return) => {
        Some("possibleConstructorReturn")
    };

    (read_only_error) => {
        Some("readOnlyError")
    };

    (set) => {
        Some("set")
    };

    (set_prototype_of) => {
        Some("setPrototypeOf")
    };

    (skip_first_generator_next) => {
        Some("skipFirstGeneratorNext")
    };

    (sliced_to_array) => {
        Some("slicedToArray")
    };

    (sliced_to_array_loose) => {
        Some("slicedToArrayLoose")
    };

    (super_prop_base) => {
        Some("superPropBase")
    };

    (tagged_template_literal) => {
        Some("taggedTemplateLiteral")
    };

    (tagged_template_literal_loose) => {
        Some("taggedTemplateLiteralLoose")
    };

    (throw) => {
        Some("_throw")
    };

    (to_array) => {
        Some("toArray")
    };

    (to_consumable_array) => {
        Some("toConsumableArray")
    };

    (to_primitive) => {
        Some("toPrimitive")
    };

    (to_property_key) => {
        Some("toPropertyKey")
    };

    (type_of) => {
        Some("typeOf")
    };

    (unsupported_iterable_to_array) => {
        Some("unsupportedIterableToArray")
    };

    (wrap_async_generator) => {
        Some("wrapAsyncGenerator")
    };

    (wrap_native_super) => {
        Some("wrapNativeSuper")
    };

    ($name:ident) => {
        None
    };
}
