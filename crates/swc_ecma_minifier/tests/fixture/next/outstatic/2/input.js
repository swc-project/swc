import { _ as _async_to_generator } from "@swc/helpers/_/_async_to_generator";
import { _ as _define_property } from "@swc/helpers/_/_define_property";
import { _ as _object_spread } from "@swc/helpers/_/_object_spread";
import { _ as _object_spread_props } from "@swc/helpers/_/_object_spread_props";
import { _ as _object_without_properties } from "@swc/helpers/_/_object_without_properties";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
import { _ as _ts_generator } from "@swc/helpers/_/_ts_generator";
import { EVENTS, VALIDATION_MODE } from "../constants";
import cloneObject from "../utils/cloneObject";
import compact from "../utils/compact";
import convertToArrayPayload from "../utils/convertToArrayPayload";
import createSubject from "../utils/createSubject";
import deepEqual from "../utils/deepEqual";
import get from "../utils/get";
import isBoolean from "../utils/isBoolean";
import isCheckBoxInput from "../utils/isCheckBoxInput";
import isDateObject from "../utils/isDateObject";
import isEmptyObject from "../utils/isEmptyObject";
import isFileInput from "../utils/isFileInput";
import isFunction from "../utils/isFunction";
import isHTMLElement from "../utils/isHTMLElement";
import isMultipleSelect from "../utils/isMultipleSelect";
import isNullOrUndefined from "../utils/isNullOrUndefined";
import isObject from "../utils/isObject";
import isPrimitive from "../utils/isPrimitive";
import isRadioOrCheckbox from "../utils/isRadioOrCheckbox";
import isString from "../utils/isString";
import isUndefined from "../utils/isUndefined";
import isWeb from "../utils/isWeb";
import live from "../utils/live";
import set from "../utils/set";
import unset from "../utils/unset";
import focusFieldBy from "./focusFieldBy";
import generateWatchOutput from "./generateWatchOutput";
import getDirtyFields from "./getDirtyFields";
import getEventValue from "./getEventValue";
import getFieldValue from "./getFieldValue";
import getFieldValueAs from "./getFieldValueAs";
import getResolverOptions from "./getResolverOptions";
import getRuleValue from "./getRuleValue";
import getValidationModes from "./getValidationModes";
import hasValidation from "./hasValidation";
import isNameInFieldArray from "./isNameInFieldArray";
import isWatched from "./isWatched";
import schemaErrorLookup from "./schemaErrorLookup";
import skipValidation from "./skipValidation";
import unsetEmptyArray from "./unsetEmptyArray";
import updateFieldArrayRootError from "./updateFieldArrayRootError";
import validateField from "./validateField";
var defaultOptions = {
    mode: VALIDATION_MODE.onSubmit,
    reValidateMode: VALIDATION_MODE.onChange,
    shouldFocusError: true
};
export function createFormControl() {
    var props = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : {}, flushRootRender = arguments.length > 1 ? arguments[1] : void 0;
    var _options = _object_spread({}, defaultOptions, props);
    var _formState = {
        submitCount: 0,
        isDirty: false,
        isLoading: isFunction(_options.defaultValues),
        isValidating: false,
        isSubmitted: false,
        isSubmitting: false,
        isSubmitSuccessful: false,
        isValid: false,
        touchedFields: {},
        dirtyFields: {},
        errors: {}
    };
    var _fields = {};
    var _defaultValues = isObject(_options.defaultValues) || isObject(_options.values) ? cloneObject(_options.defaultValues || _options.values) || {} : {};
    var _formValues = _options.shouldUnregister ? {} : cloneObject(_defaultValues);
    var _state = {
        action: false,
        mount: false,
        watch: false
    };
    var _names = {
        mount: new Set(),
        unMount: new Set(),
        array: new Set(),
        watch: new Set()
    };
    var delayErrorCallback;
    var timer = 0;
    var _proxyFormState = {
        isDirty: false,
        dirtyFields: false,
        touchedFields: false,
        isValidating: false,
        isValid: false,
        errors: false
    };
    var _subjects = {
        values: createSubject(),
        array: createSubject(),
        state: createSubject()
    };
    var shouldCaptureDirtyFields = props.resetOptions && props.resetOptions.keepDirtyValues;
    var validationModeBeforeSubmit = getValidationModes(_options.mode);
    var validationModeAfterSubmit = getValidationModes(_options.reValidateMode);
    var shouldDisplayAllAssociatedErrors = _options.criteriaMode === VALIDATION_MODE.all;
    var debounce = function (callback) {
        return function (wait) {
            clearTimeout(timer);
            timer = setTimeout(callback, wait);
        };
    };
    var _updateValid = function () {
        var _ref = _async_to_generator(function (shouldUpdateValid) {
            var isValid, _tmp;
            return _ts_generator(this, function (_state) {
                switch (_state.label) {
                    case 0:
                        if (!(_proxyFormState.isValid || shouldUpdateValid)) return [
                            3,
                            5
                        ];
                        if (!_options.resolver) return [
                            3,
                            2
                        ];
                        return [
                            4,
                            _executeSchema()
                        ];
                    case 1:
                        _tmp = isEmptyObject.apply(void 0, [
                            _state.sent().errors
                        ]);
                        return [
                            3,
                            4
                        ];
                    case 2:
                        return [
                            4,
                            executeBuiltInValidation(_fields, true)
                        ];
                    case 3:
                        _tmp = _state.sent();
                        _state.label = 4;
                    case 4:
                        isValid = _tmp;
                        if (isValid !== _formState.isValid) {
                            _subjects.state.next({
                                isValid: isValid
                            });
                        }
                        _state.label = 5;
                    case 5:
                        return [
                            2
                        ];
                }
            });
        });
        return function _updateValid(shouldUpdateValid) {
            return _ref.apply(this, arguments);
        };
    }();
    var _updateIsValidating = function (value1) {
        return _proxyFormState.isValidating && _subjects.state.next({
            isValidating: value1
        });
    };
    var _updateFieldArray = function (name) {
        var values = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : [], method = arguments.length > 2 ? arguments[2] : void 0, args = arguments.length > 3 ? arguments[3] : void 0, shouldSetValues = arguments.length > 4 && arguments[4] !== void 0 ? arguments[4] : true, shouldUpdateFieldsAndState = arguments.length > 5 && arguments[5] !== void 0 ? arguments[5] : true;
        if (args && method) {
            _state.action = true;
            if (shouldUpdateFieldsAndState && Array.isArray(get(_fields, name))) {
                var fieldValues = method(get(_fields, name), args.argA, args.argB);
                shouldSetValues && set(_fields, name, fieldValues);
            }
            if (shouldUpdateFieldsAndState && Array.isArray(get(_formState.errors, name))) {
                var errors = method(get(_formState.errors, name), args.argA, args.argB);
                shouldSetValues && set(_formState.errors, name, errors);
                unsetEmptyArray(_formState.errors, name);
            }
            if (_proxyFormState.touchedFields && shouldUpdateFieldsAndState && Array.isArray(get(_formState.touchedFields, name))) {
                var touchedFields = method(get(_formState.touchedFields, name), args.argA, args.argB);
                shouldSetValues && set(_formState.touchedFields, name, touchedFields);
            }
            if (_proxyFormState.dirtyFields) {
                _formState.dirtyFields = getDirtyFields(_defaultValues, _formValues);
            }
            _subjects.state.next({
                name: name,
                isDirty: _getDirty(name, values),
                dirtyFields: _formState.dirtyFields,
                errors: _formState.errors,
                isValid: _formState.isValid
            });
        } else {
            set(_formValues, name, values);
        }
    };
    var updateErrors = function (name, error) {
        set(_formState.errors, name, error);
        _subjects.state.next({
            errors: _formState.errors
        });
    };
    var updateValidAndValue = function (name, shouldSkipSetValueAs, value1, ref) {
        var field = get(_fields, name);
        if (field) {
            var defaultValue = get(_formValues, name, isUndefined(value1) ? get(_defaultValues, name) : value1);
            isUndefined(defaultValue) || ref && ref.defaultChecked || shouldSkipSetValueAs ? set(_formValues, name, shouldSkipSetValueAs ? defaultValue : getFieldValue(field._f)) : setFieldValue(name, defaultValue);
            _state.mount && _updateValid();
        }
    };
    var updateTouchAndDirty = function (name, fieldValue, isBlurEvent, shouldDirty, shouldRender) {
        var shouldUpdateField = false;
        var isPreviousDirty = false;
        var output = {
            name: name
        };
        if (!isBlurEvent || shouldDirty) {
            if (_proxyFormState.isDirty) {
                isPreviousDirty = _formState.isDirty;
                _formState.isDirty = output.isDirty = _getDirty();
                shouldUpdateField = isPreviousDirty !== output.isDirty;
            }
            var isCurrentFieldPristine = deepEqual(get(_defaultValues, name), fieldValue);
            isPreviousDirty = get(_formState.dirtyFields, name);
            isCurrentFieldPristine ? unset(_formState.dirtyFields, name) : set(_formState.dirtyFields, name, true);
            output.dirtyFields = _formState.dirtyFields;
            shouldUpdateField = shouldUpdateField || _proxyFormState.dirtyFields && isPreviousDirty !== !isCurrentFieldPristine;
        }
        if (isBlurEvent) {
            var isPreviousFieldTouched = get(_formState.touchedFields, name);
            if (!isPreviousFieldTouched) {
                set(_formState.touchedFields, name, isBlurEvent);
                output.touchedFields = _formState.touchedFields;
                shouldUpdateField = shouldUpdateField || _proxyFormState.touchedFields && isPreviousFieldTouched !== isBlurEvent;
            }
        }
        shouldUpdateField && shouldRender && _subjects.state.next(output);
        return shouldUpdateField ? output : {};
    };
    var shouldRenderByError = function (name, isValid, error, fieldState) {
        var previousFieldError = get(_formState.errors, name);
        var shouldUpdateValid = _proxyFormState.isValid && isBoolean(isValid) && _formState.isValid !== isValid;
        if (props.delayError && error) {
            delayErrorCallback = debounce(function () {
                return updateErrors(name, error);
            });
            delayErrorCallback(props.delayError);
        } else {
            clearTimeout(timer);
            delayErrorCallback = null;
            error ? set(_formState.errors, name, error) : unset(_formState.errors, name);
        }
        if ((error ? !deepEqual(previousFieldError, error) : previousFieldError) || !isEmptyObject(fieldState) || shouldUpdateValid) {
            var updatedFormState = _object_spread_props(_object_spread({}, fieldState, shouldUpdateValid && isBoolean(isValid) ? {
                isValid: isValid
            } : {}), {
                errors: _formState.errors,
                name: name
            });
            _formState = _object_spread({}, _formState, updatedFormState);
            _subjects.state.next(updatedFormState);
        }
        _updateIsValidating(false);
    };
    var _executeSchema = function () {
        var _ref = _async_to_generator(function (name) {
            return _ts_generator(this, function (_state) {
                return [
                    2,
                    _options.resolver(_formValues, _options.context, getResolverOptions(name || _names.mount, _fields, _options.criteriaMode, _options.shouldUseNativeValidation))
                ];
            });
        });
        return function _executeSchema(name) {
            return _ref.apply(this, arguments);
        };
    }();
    var executeSchemaAndUpdateState = function () {
        var _ref = _async_to_generator(function (names) {
            var errors, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, name, error;
            return _ts_generator(this, function (_state) {
                switch (_state.label) {
                    case 0:
                        return [
                            4,
                            _executeSchema()
                        ];
                    case 1:
                        errors = _state.sent().errors;
                        if (names) {
                            _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                            try {
                                for (_iterator = names[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                                    name = _step.value;
                                    error = get(errors, name);
                                    error ? set(_formState.errors, name, error) : unset(_formState.errors, name);
                                }
                            } catch (err) {
                                _didIteratorError = true;
                                _iteratorError = err;
                            } finally {
                                try {
                                    if (!_iteratorNormalCompletion && _iterator.return != null) {
                                        _iterator.return();
                                    }
                                } finally {
                                    if (_didIteratorError) {
                                        throw _iteratorError;
                                    }
                                }
                            }
                        } else {
                            _formState.errors = errors;
                        }
                        return [
                            2,
                            errors
                        ];
                }
            });
        });
        return function executeSchemaAndUpdateState(names) {
            return _ref.apply(this, arguments);
        };
    }();
    var executeBuiltInValidation = function () {
        var _ref = _async_to_generator(function (fields, shouldOnlyCheckValid) {
            var context, _tmp, _tmp1, _i, _ref, name, field, _f, fieldValue, isFieldArrayRoot, fieldError, _tmp2;
            var _arguments = arguments;
            return _ts_generator(this, function (_state) {
                switch (_state.label) {
                    case 0:
                        context = _arguments.length > 2 && _arguments[2] !== void 0 ? _arguments[2] : {
                            valid: true
                        };
                        _tmp = [];
                        for (_tmp1 in fields) _tmp.push(_tmp1);
                        _i = 0;
                        _state.label = 1;
                    case 1:
                        if (!(_i < _tmp.length)) return [
                            3,
                            7
                        ];
                        _ref = _tmp[_i];
                        name = _ref;
                        field = fields[name];
                        if (!field) return [
                            3,
                            6
                        ];
                        _f = field._f, fieldValue = _object_without_properties(field, [
                            "_f"
                        ]);
                        if (!_f) return [
                            3,
                            3
                        ];
                        isFieldArrayRoot = _names.array.has(_f.name);
                        return [
                            4,
                            validateField(field, _formValues, shouldDisplayAllAssociatedErrors, _options.shouldUseNativeValidation && !shouldOnlyCheckValid, isFieldArrayRoot)
                        ];
                    case 2:
                        fieldError = _state.sent();
                        if (fieldError[_f.name]) {
                            context.valid = false;
                            if (shouldOnlyCheckValid) {
                                return [
                                    3,
                                    7
                                ];
                            }
                        }
                        !shouldOnlyCheckValid && (get(fieldError, _f.name) ? isFieldArrayRoot ? updateFieldArrayRootError(_formState.errors, fieldError, _f.name) : set(_formState.errors, _f.name, fieldError[_f.name]) : unset(_formState.errors, _f.name));
                        _state.label = 3;
                    case 3:
                        _tmp2 = fieldValue;
                        if (!_tmp2) return [
                            3,
                            5
                        ];
                        return [
                            4,
                            executeBuiltInValidation(fieldValue, shouldOnlyCheckValid, context)
                        ];
                    case 4:
                        _tmp2 = _state.sent();
                        _state.label = 5;
                    case 5:
                        _tmp2;
                        _state.label = 6;
                    case 6:
                        _i++;
                        return [
                            3,
                            1
                        ];
                    case 7:
                        return [
                            2,
                            context.valid
                        ];
                }
            });
        });
        return function executeBuiltInValidation(fields, shouldOnlyCheckValid) {
            return _ref.apply(this, arguments);
        };
    }();
    var _removeUnmounted = function () {
        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
        try {
            for (var _iterator = _names.unMount[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var name = _step.value;
                var field = get(_fields, name);
                field && (field._f.refs ? field._f.refs.every(function (ref) {
                    return !live(ref);
                }) : !live(field._f.ref)) && unregister(name);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return != null) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
        _names.unMount = new Set();
    };
    var _getDirty = function (name, data) {
        return name && data && set(_formValues, name, data), !deepEqual(getValues(), _defaultValues);
    };
    var _getWatch = function (names, defaultValue, isGlobal) {
        return generateWatchOutput(names, _names, _object_spread({}, _state.mount ? _formValues : isUndefined(defaultValue) ? _defaultValues : isString(names) ? _define_property({}, names, defaultValue) : defaultValue), isGlobal, defaultValue);
    };
    var _getFieldArray = function (name) {
        return compact(get(_state.mount ? _formValues : _defaultValues, name, props.shouldUnregister ? get(_defaultValues, name, []) : []));
    };
    var setFieldValue = function (name, value1) {
        var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
        var field = get(_fields, name);
        var fieldValue = value1;
        if (field) {
            var fieldReference = field._f;
            if (fieldReference) {
                !fieldReference.disabled && set(_formValues, name, getFieldValueAs(value1, fieldReference));
                fieldValue = isHTMLElement(fieldReference.ref) && isNullOrUndefined(value1) ? "" : value1;
                if (isMultipleSelect(fieldReference.ref)) {
                    _to_consumable_array(fieldReference.ref.options).forEach(function (optionRef) {
                        return optionRef.selected = fieldValue.includes(optionRef.value);
                    });
                } else if (fieldReference.refs) {
                    if (isCheckBoxInput(fieldReference.ref)) {
                        fieldReference.refs.length > 1 ? fieldReference.refs.forEach(function (checkboxRef) {
                            return (!checkboxRef.defaultChecked || !checkboxRef.disabled) && (checkboxRef.checked = Array.isArray(fieldValue) ? !!fieldValue.find(function (data) {
                                return data === checkboxRef.value;
                            }) : fieldValue === checkboxRef.value);
                        }) : fieldReference.refs[0] && (fieldReference.refs[0].checked = !!fieldValue);
                    } else {
                        fieldReference.refs.forEach(function (radioRef) {
                            return radioRef.checked = radioRef.value === fieldValue;
                        });
                    }
                } else if (isFileInput(fieldReference.ref)) {
                    fieldReference.ref.value = "";
                } else {
                    fieldReference.ref.value = fieldValue;
                    if (!fieldReference.ref.type) {
                        _subjects.values.next({
                            name: name,
                            values: _object_spread({}, _formValues)
                        });
                    }
                }
            }
        }
        (options.shouldDirty || options.shouldTouch) && updateTouchAndDirty(name, fieldValue, options.shouldTouch, options.shouldDirty, true);
        options.shouldValidate && trigger(name);
    };
    var setValues = function (name, value1, options) {
        for (var fieldKey in value1) {
            var fieldValue = value1[fieldKey];
            var fieldName = "".concat(name, ".").concat(fieldKey);
            var field = get(_fields, fieldName);
            (_names.array.has(name) || !isPrimitive(fieldValue) || field && !field._f) && !isDateObject(fieldValue) ? setValues(fieldName, fieldValue, options) : setFieldValue(fieldName, fieldValue, options);
        }
    };
    var setValue = function (name, value1) {
        var options = arguments.length > 2 && arguments[2] !== void 0 ? arguments[2] : {};
        var field = get(_fields, name);
        var isFieldArray = _names.array.has(name);
        var cloneValue = cloneObject(value1);
        set(_formValues, name, cloneValue);
        if (isFieldArray) {
            _subjects.array.next({
                name: name,
                values: _object_spread({}, _formValues)
            });
            if ((_proxyFormState.isDirty || _proxyFormState.dirtyFields) && options.shouldDirty) {
                _subjects.state.next({
                    name: name,
                    dirtyFields: getDirtyFields(_defaultValues, _formValues),
                    isDirty: _getDirty(name, cloneValue)
                });
            }
        } else {
            field && !field._f && !isNullOrUndefined(cloneValue) ? setValues(name, cloneValue, options) : setFieldValue(name, cloneValue, options);
        }
        isWatched(name, _names) && _subjects.state.next(_object_spread({}, _formState));
        _subjects.values.next({
            name: name,
            values: _object_spread({}, _formValues)
        });
        !_state.mount && flushRootRender();
    };
    var onChange = function () {
        var _ref = _async_to_generator(function (event) {
            var target, name, isFieldValueUpdated, field, getCurrentFieldValue, error, isValid, fieldValue, isBlurEvent, shouldSkipValidation, watched, fieldState, shouldRender, errors, previousErrorLookupResult, errorLookupResult;
            return _ts_generator(this, function (_state) {
                switch (_state.label) {
                    case 0:
                        target = event.target;
                        name = target.name;
                        isFieldValueUpdated = true;
                        field = get(_fields, name);
                        getCurrentFieldValue = function () {
                            return target.type ? getFieldValue(field._f) : getEventValue(event);
                        };
                        if (!field) return [
                            3,
                            7
                        ];
                        fieldValue = getCurrentFieldValue();
                        isBlurEvent = event.type === EVENTS.BLUR || event.type === EVENTS.FOCUS_OUT;
                        shouldSkipValidation = !hasValidation(field._f) && !_options.resolver && !get(_formState.errors, name) && !field._f.deps || skipValidation(isBlurEvent, get(_formState.touchedFields, name), _formState.isSubmitted, validationModeAfterSubmit, validationModeBeforeSubmit);
                        watched = isWatched(name, _names, isBlurEvent);
                        set(_formValues, name, fieldValue);
                        if (isBlurEvent) {
                            field._f.onBlur && field._f.onBlur(event);
                            delayErrorCallback && delayErrorCallback(0);
                        } else if (field._f.onChange) {
                            field._f.onChange(event);
                        }
                        fieldState = updateTouchAndDirty(name, fieldValue, isBlurEvent, false);
                        shouldRender = !isEmptyObject(fieldState) || watched;
                        !isBlurEvent && _subjects.values.next({
                            name: name,
                            type: event.type,
                            values: _object_spread({}, _formValues)
                        });
                        if (shouldSkipValidation) {
                            _proxyFormState.isValid && _updateValid();
                            return [
                                2,
                                shouldRender && _subjects.state.next(_object_spread({
                                    name: name
                                }, watched ? {} : fieldState))
                            ];
                        }
                        !isBlurEvent && watched && _subjects.state.next(_object_spread({}, _formState));
                        _updateIsValidating(true);
                        if (!_options.resolver) return [
                            3,
                            2
                        ];
                        return [
                            4,
                            _executeSchema([
                                name
                            ])
                        ];
                    case 1:
                        errors = _state.sent().errors;
                        previousErrorLookupResult = schemaErrorLookup(_formState.errors, _fields, name);
                        errorLookupResult = schemaErrorLookup(errors, _fields, previousErrorLookupResult.name || name);
                        error = errorLookupResult.error;
                        name = errorLookupResult.name;
                        isValid = isEmptyObject(errors);
                        return [
                            3,
                            6
                        ];
                    case 2:
                        return [
                            4,
                            validateField(field, _formValues, shouldDisplayAllAssociatedErrors, _options.shouldUseNativeValidation)
                        ];
                    case 3:
                        error = _state.sent()[name];
                        isFieldValueUpdated = isNaN(fieldValue) || fieldValue === get(_formValues, name, fieldValue);
                        if (!isFieldValueUpdated) return [
                            3,
                            6
                        ];
                        if (!error) return [
                            3,
                            4
                        ];
                        isValid = false;
                        return [
                            3,
                            6
                        ];
                    case 4:
                        if (!_proxyFormState.isValid) return [
                            3,
                            6
                        ];
                        return [
                            4,
                            executeBuiltInValidation(_fields, true)
                        ];
                    case 5:
                        isValid = _state.sent();
                        _state.label = 6;
                    case 6:
                        if (isFieldValueUpdated) {
                            field._f.deps && trigger(field._f.deps);
                            shouldRenderByError(name, isValid, error, fieldState);
                        }
                        _state.label = 7;
                    case 7:
                        return [
                            2
                        ];
                }
            });
        });
        return function onChange(event) {
            return _ref.apply(this, arguments);
        };
    }();
    var trigger = function () {
        var _ref = _async_to_generator(function (name) {
            var options, isValid, validationResult, fieldNames, errors;
            var _arguments = arguments;
            return _ts_generator(this, function (_state) {
                switch (_state.label) {
                    case 0:
                        options = _arguments.length > 1 && _arguments[1] !== void 0 ? _arguments[1] : {};
                        fieldNames = convertToArrayPayload(name);
                        _updateIsValidating(true);
                        if (!_options.resolver) return [
                            3,
                            2
                        ];
                        return [
                            4,
                            executeSchemaAndUpdateState(isUndefined(name) ? name : fieldNames)
                        ];
                    case 1:
                        errors = _state.sent();
                        isValid = isEmptyObject(errors);
                        validationResult = name ? !fieldNames.some(function (name) {
                            return get(errors, name);
                        }) : isValid;
                        return [
                            3,
                            6
                        ];
                    case 2:
                        if (!name) return [
                            3,
                            4
                        ];
                        return [
                            4,
                            Promise.all(fieldNames.map(function () {
                                var _ref = _async_to_generator(function (fieldName) {
                                    var field;
                                    return _ts_generator(this, function (_state) {
                                        switch (_state.label) {
                                            case 0:
                                                field = get(_fields, fieldName);
                                                return [
                                                    4,
                                                    executeBuiltInValidation(field && field._f ? _define_property({}, fieldName, field) : field)
                                                ];
                                            case 1:
                                                return [
                                                    2,
                                                    _state.sent()
                                                ];
                                        }
                                    });
                                });
                                return function (fieldName) {
                                    return _ref.apply(this, arguments);
                                };
                            }()))
                        ];
                    case 3:
                        validationResult = _state.sent().every(Boolean);
                        !(!validationResult && !_formState.isValid) && _updateValid();
                        return [
                            3,
                            6
                        ];
                    case 4:
                        return [
                            4,
                            executeBuiltInValidation(_fields)
                        ];
                    case 5:
                        validationResult = isValid = _state.sent();
                        _state.label = 6;
                    case 6:
                        _subjects.state.next(_object_spread_props(_object_spread({}, !isString(name) || _proxyFormState.isValid && isValid !== _formState.isValid ? {} : {
                            name: name
                        }, _options.resolver || !name ? {
                            isValid: isValid
                        } : {}), {
                            errors: _formState.errors,
                            isValidating: false
                        }));
                        options.shouldFocus && !validationResult && focusFieldBy(_fields, function (key) {
                            return key && get(_formState.errors, key);
                        }, name ? fieldNames : _names.mount);
                        return [
                            2,
                            validationResult
                        ];
                }
            });
        });
        return function trigger(name) {
            return _ref.apply(this, arguments);
        };
    }();
    var getValues = function (fieldNames) {
        var values = _object_spread({}, _defaultValues, _state.mount ? _formValues : {});
        return isUndefined(fieldNames) ? values : isString(fieldNames) ? get(values, fieldNames) : fieldNames.map(function (name) {
            return get(values, name);
        });
    };
    var getFieldState = function (name, formState) {
        return {
            invalid: !!get((formState || _formState).errors, name),
            isDirty: !!get((formState || _formState).dirtyFields, name),
            isTouched: !!get((formState || _formState).touchedFields, name),
            error: get((formState || _formState).errors, name)
        };
    };
    var clearErrors = function (name) {
        name && convertToArrayPayload(name).forEach(function (inputName) {
            return unset(_formState.errors, inputName);
        });
        _subjects.state.next({
            errors: name ? _formState.errors : {}
        });
    };
    var setError = function (name, error, options) {
        var ref = (get(_fields, name, {
            _f: {}
        })._f || {}).ref;
        set(_formState.errors, name, _object_spread_props(_object_spread({}, error), {
            ref: ref
        }));
        _subjects.state.next({
            name: name,
            errors: _formState.errors,
            isValid: false
        });
        options && options.shouldFocus && ref && ref.focus && ref.focus();
    };
    var watch = function (name, defaultValue) {
        return isFunction(name) ? _subjects.values.subscribe({
            next: function (payload) {
                return name(_getWatch(undefined, defaultValue), payload);
            }
        }) : _getWatch(name, defaultValue, true);
    };
    var unregister = function (name) {
        var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
        try {
            for (var _iterator = (name ? convertToArrayPayload(name) : _names.mount)[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var fieldName = _step.value;
                _names.mount.delete(fieldName);
                _names.array.delete(fieldName);
                if (!options.keepValue) {
                    unset(_fields, fieldName);
                    unset(_formValues, fieldName);
                }
                !options.keepError && unset(_formState.errors, fieldName);
                !options.keepDirty && unset(_formState.dirtyFields, fieldName);
                !options.keepTouched && unset(_formState.touchedFields, fieldName);
                !_options.shouldUnregister && !options.keepDefaultValue && unset(_defaultValues, fieldName);
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return != null) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }
        _subjects.values.next({
            values: _object_spread({}, _formValues)
        });
        _subjects.state.next(_object_spread({}, _formState, !options.keepDirty ? {} : {
            isDirty: _getDirty()
        }));
        !options.keepIsValid && _updateValid();
    };
    var register = function (name) {
        var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        var field = get(_fields, name);
        var disabledIsDefined = isBoolean(options.disabled);
        set(_fields, name, _object_spread_props(_object_spread({}, field || {}), {
            _f: _object_spread(_object_spread_props(_object_spread({}, field && field._f ? field._f : {
                ref: {
                    name: name
                }
            }), {
                name: name,
                mount: true
            }), options)
        }));
        _names.mount.add(name);
        if (!isUndefined(options.value)) {
            set(_formValues, name, options.value);
        }
        field ? disabledIsDefined && set(_formValues, name, options.disabled ? undefined : get(_formValues, name, getFieldValue(field._f))) : updateValidAndValue(name, true, options.value);
        return _object_spread_props(_object_spread({}, disabledIsDefined ? {
            disabled: options.disabled
        } : {}, _options.progressive ? {
            required: !!options.required,
            min: getRuleValue(options.min),
            max: getRuleValue(options.max),
            minLength: getRuleValue(options.minLength),
            maxLength: getRuleValue(options.maxLength),
            pattern: getRuleValue(options.pattern)
        } : {}), {
            name: name,
            onChange: onChange,
            onBlur: onChange,
            ref: function (ref) {
                if (ref) {
                    register(name, options);
                    field = get(_fields, name);
                    var fieldRef = isUndefined(ref.value) ? ref.querySelectorAll ? ref.querySelectorAll("input,select,textarea")[0] || ref : ref : ref;
                    var radioOrCheckbox = isRadioOrCheckbox(fieldRef);
                    var refs = field._f.refs || [];
                    if (radioOrCheckbox ? refs.find(function (option) {
                        return option === fieldRef;
                    }) : fieldRef === field._f.ref) {
                        return;
                    }
                    set(_fields, name, {
                        _f: _object_spread({}, field._f, radioOrCheckbox ? {
                            refs: _to_consumable_array(refs.filter(live)).concat([
                                fieldRef
                            ], _to_consumable_array(Array.isArray(get(_defaultValues, name)) ? [
                                {}
                            ] : [])),
                            ref: {
                                type: fieldRef.type,
                                name: name
                            }
                        } : {
                            ref: fieldRef
                        })
                    });
                    updateValidAndValue(name, false, undefined, fieldRef);
                } else {
                    field = get(_fields, name, {});
                    if (field._f) {
                        field._f.mount = false;
                    }
                    (_options.shouldUnregister || options.shouldUnregister) && !(isNameInFieldArray(_names.array, name) && _state.action) && _names.unMount.add(name);
                }
            }
        });
    };
    var _focusError = function () {
        return _options.shouldFocusError && focusFieldBy(_fields, function (key) {
            return key && get(_formState.errors, key);
        }, _names.mount);
    };
    var handleSubmit = function (onValid, onInvalid) {
        return function () {
            var _ref = _async_to_generator(function (e) {
                var fieldValues, _ref, errors, values;
                return _ts_generator(this, function (_state) {
                    switch (_state.label) {
                        case 0:
                            if (e) {
                                e.preventDefault && e.preventDefault();
                                e.persist && e.persist();
                            }
                            fieldValues = cloneObject(_formValues);
                            _subjects.state.next({
                                isSubmitting: true
                            });
                            if (!_options.resolver) return [
                                3,
                                2
                            ];
                            return [
                                4,
                                _executeSchema()
                            ];
                        case 1:
                            _ref = _state.sent(), errors = _ref.errors, values = _ref.values;
                            _formState.errors = errors;
                            fieldValues = values;
                            return [
                                3,
                                4
                            ];
                        case 2:
                            return [
                                4,
                                executeBuiltInValidation(_fields)
                            ];
                        case 3:
                            _state.sent();
                            _state.label = 4;
                        case 4:
                            unset(_formState.errors, "root");
                            if (!isEmptyObject(_formState.errors)) return [
                                3,
                                6
                            ];
                            _subjects.state.next({
                                errors: {}
                            });
                            return [
                                4,
                                onValid(fieldValues, e)
                            ];
                        case 5:
                            _state.sent();
                            return [
                                3,
                                9
                            ];
                        case 6:
                            if (!onInvalid) return [
                                3,
                                8
                            ];
                            return [
                                4,
                                onInvalid(_object_spread({}, _formState.errors), e)
                            ];
                        case 7:
                            _state.sent();
                            _state.label = 8;
                        case 8:
                            _focusError();
                            setTimeout(_focusError);
                            _state.label = 9;
                        case 9:
                            _subjects.state.next({
                                isSubmitted: true,
                                isSubmitting: false,
                                isSubmitSuccessful: isEmptyObject(_formState.errors),
                                submitCount: _formState.submitCount + 1,
                                errors: _formState.errors
                            });
                            return [
                                2
                            ];
                    }
                });
            });
            return function (e) {
                return _ref.apply(this, arguments);
            };
        }();
    };
    var resetField = function (name) {
        var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        if (get(_fields, name)) {
            if (isUndefined(options.defaultValue)) {
                setValue(name, get(_defaultValues, name));
            } else {
                setValue(name, options.defaultValue);
                set(_defaultValues, name, options.defaultValue);
            }
            if (!options.keepTouched) {
                unset(_formState.touchedFields, name);
            }
            if (!options.keepDirty) {
                unset(_formState.dirtyFields, name);
                _formState.isDirty = options.defaultValue ? _getDirty(name, get(_defaultValues, name)) : _getDirty();
            }
            if (!options.keepError) {
                unset(_formState.errors, name);
                _proxyFormState.isValid && _updateValid();
            }
            _subjects.state.next(_object_spread({}, _formState));
        }
    };
    var _reset = function (formValues) {
        var keepStateOptions = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        var updatedValues = formValues || _defaultValues;
        var cloneUpdatedValues = cloneObject(updatedValues);
        var values = formValues && !isEmptyObject(formValues) ? cloneUpdatedValues : _defaultValues;
        if (!keepStateOptions.keepDefaultValues) {
            _defaultValues = updatedValues;
        }
        if (!keepStateOptions.keepValues) {
            if (keepStateOptions.keepDirtyValues || shouldCaptureDirtyFields) {
                var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
                try {
                    for (var _iterator = _names.mount[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var fieldName = _step.value;
                        get(_formState.dirtyFields, fieldName) ? set(values, fieldName, get(_formValues, fieldName)) : setValue(fieldName, get(values, fieldName));
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return != null) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }
            } else {
                if (isWeb && isUndefined(formValues)) {
                    var _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;
                    try {
                        for (var _iterator1 = _names.mount[Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true) {
                            var name = _step1.value;
                            var field = get(_fields, name);
                            if (field && field._f) {
                                var fieldReference = Array.isArray(field._f.refs) ? field._f.refs[0] : field._f.ref;
                                if (isHTMLElement(fieldReference)) {
                                    var form = fieldReference.closest("form");
                                    if (form) {
                                        form.reset();
                                        break;
                                    }
                                }
                            }
                        }
                    } catch (err) {
                        _didIteratorError1 = true;
                        _iteratorError1 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
                                _iterator1.return();
                            }
                        } finally {
                            if (_didIteratorError1) {
                                throw _iteratorError1;
                            }
                        }
                    }
                }
                _fields = {};
            }
            _formValues = props.shouldUnregister ? keepStateOptions.keepDefaultValues ? cloneObject(_defaultValues) : {} : cloneObject(values);
            _subjects.array.next({
                values: _object_spread({}, values)
            });
            _subjects.values.next({
                values: _object_spread({}, values)
            });
        }
        _names = {
            mount: new Set(),
            unMount: new Set(),
            array: new Set(),
            watch: new Set(),
            watchAll: false,
            focus: ""
        };
        !_state.mount && flushRootRender();
        _state.mount = !_proxyFormState.isValid || !!keepStateOptions.keepIsValid;
        _state.watch = !!props.shouldUnregister;
        _subjects.state.next({
            submitCount: keepStateOptions.keepSubmitCount ? _formState.submitCount : 0,
            isDirty: keepStateOptions.keepDirty ? _formState.isDirty : !!(keepStateOptions.keepDefaultValues && !deepEqual(formValues, _defaultValues)),
            isSubmitted: keepStateOptions.keepIsSubmitted ? _formState.isSubmitted : false,
            dirtyFields: keepStateOptions.keepDirtyValues ? _formState.dirtyFields : keepStateOptions.keepDefaultValues && formValues ? getDirtyFields(_defaultValues, formValues) : {},
            touchedFields: keepStateOptions.keepTouched ? _formState.touchedFields : {},
            errors: keepStateOptions.keepErrors ? _formState.errors : {},
            isSubmitting: false,
            isSubmitSuccessful: false
        });
    };
    var reset = function (formValues, keepStateOptions) {
        return _reset(isFunction(formValues) ? formValues(_formValues) : formValues, keepStateOptions);
    };
    var setFocus = function (name) {
        var options = arguments.length > 1 && arguments[1] !== void 0 ? arguments[1] : {};
        var field = get(_fields, name);
        var fieldReference = field && field._f;
        if (fieldReference) {
            var fieldRef = fieldReference.refs ? fieldReference.refs[0] : fieldReference.ref;
            if (fieldRef.focus) {
                fieldRef.focus();
                options.shouldSelect && fieldRef.select();
            }
        }
    };
    var _updateFormState = function (updatedFormState) {
        _formState = _object_spread({}, _formState, updatedFormState);
    };
    var _resetDefaultValues = function () {
        return isFunction(_options.defaultValues) && _options.defaultValues().then(function (values) {
            reset(values, _options.resetOptions);
            _subjects.state.next({
                isLoading: false
            });
        });
    };
    return {
        control: {
            register: register,
            unregister: unregister,
            getFieldState: getFieldState,
            handleSubmit: handleSubmit,
            setError: setError,
            _executeSchema: _executeSchema,
            _getWatch: _getWatch,
            _getDirty: _getDirty,
            _updateValid: _updateValid,
            _removeUnmounted: _removeUnmounted,
            _updateFieldArray: _updateFieldArray,
            _getFieldArray: _getFieldArray,
            _reset: _reset,
            _resetDefaultValues: _resetDefaultValues,
            _updateFormState: _updateFormState,
            _subjects: _subjects,
            _proxyFormState: _proxyFormState,
            get _fields() {
                return _fields;
            },
            get _formValues() {
                return _formValues;
            },
            get _state() {
                return _state;
            },
            set _state(value) {
                _state = value;
            },
            get _defaultValues() {
                return _defaultValues;
            },
            get _names() {
                return _names;
            },
            set _names(value) {
                _names = value;
            },
            get _formState() {
                return _formState;
            },
            set _formState(value) {
                _formState = value;
            },
            get _options() {
                return _options;
            },
            set _options(value) {
                _options = _object_spread({}, _options, value);
            }
        },
        trigger: trigger,
        register: register,
        handleSubmit: handleSubmit,
        watch: watch,
        setValue: setValue,
        getValues: getValues,
        reset: reset,
        resetField: resetField,
        clearErrors: clearErrors,
        unregister: unregister,
        setError: setError,
        setFocus: setFocus,
        getFieldState: getFieldState
    };
}
