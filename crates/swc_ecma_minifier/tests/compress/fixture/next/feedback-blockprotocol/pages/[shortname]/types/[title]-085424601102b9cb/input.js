(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[941],{

/***/ 80:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


    (window.__NEXT_P = window.__NEXT_P || []).push([
      "/[shortname]/types/[title]",
      function () {
        return __webpack_require__(9344);
      }
    ]);
    if(false) {}
  

/***/ }),

/***/ 9344:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": function() { return /* binding */ _title_page; }
});

// EXTERNAL MODULE: ../node_modules/react/jsx-runtime.js
var jsx_runtime = __webpack_require__(4246);
// EXTERNAL MODULE: ../node_modules/next/head.js
var head = __webpack_require__(8038);
// EXTERNAL MODULE: ../node_modules/twind/twind.js + 1 modules
var twind = __webpack_require__(4209);
// EXTERNAL MODULE: ../node_modules/next/error.js
var error = __webpack_require__(377);
// EXTERNAL MODULE: ../node_modules/next/router.js
var next_router = __webpack_require__(6677);
// EXTERNAL MODULE: ../node_modules/react/index.js
var react = __webpack_require__(7378);
// EXTERNAL MODULE: ../node_modules/@mui/material/Container/Container.js + 1 modules
var Container = __webpack_require__(6456);
// EXTERNAL MODULE: ../node_modules/@mui/material/Typography/Typography.js + 1 modules
var Typography = __webpack_require__(2750);
// EXTERNAL MODULE: ../node_modules/@mui/material/Box/Box.js + 1 modules
var Box = __webpack_require__(5310);
// EXTERNAL MODULE: ../node_modules/lodash/lodash.js
var lodash = __webpack_require__(8784);
// EXTERNAL MODULE: ../node_modules/@mui/material/MenuItem/MenuItem.js + 1 modules
var MenuItem = __webpack_require__(1606);
// EXTERNAL MODULE: ../node_modules/@mui/material/Select/Select.js + 9 modules
var Select = __webpack_require__(3380);
;// CONCATENATED MODULE: ./src/components/entityTypes/SchemaEditor/SchemaPropertyTypeList.tsx
function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}
function _defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _defineProperty(target, key, source[key]);
        });
    }
    return target;
}
function _objectWithoutProperties(source, excluded) {
    if (source == null) return {};
    var target = _objectWithoutPropertiesLoose(source, excluded);
    var key, i;
    if (Object.getOwnPropertySymbols) {
        var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
        for(i = 0; i < sourceSymbolKeys.length; i++){
            key = sourceSymbolKeys[i];
            if (excluded.indexOf(key) >= 0) continue;
            if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
            target[key] = source[key];
        }
    }
    return target;
}
function _objectWithoutPropertiesLoose(source, excluded) {
    if (source == null) return {};
    var target = {};
    var sourceKeys = Object.keys(source);
    var key, i;
    for(i = 0; i < sourceKeys.length; i++){
        key = sourceKeys[i];
        if (excluded.indexOf(key) >= 0) continue;
        target[key] = source[key];
    }
    return target;
}
function _taggedTemplateLiteral(strings, raw) {
    if (!raw) {
        raw = strings.slice(0);
    }
    return Object.freeze(Object.defineProperties(strings, {
        raw: {
            value: Object.freeze(raw)
        }
    }));
}
function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}
function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}
function _templateObject() {
    var data = _taggedTemplateLiteral([
        "w-32"
    ]);
    _templateObject = function _templateObject() {
        return data;
    };
    return data;
}






var primitiveJsonTypes = [
    "boolean",
    "integer",
    "number",
    "null",
    "string", 
];
var PropertyTypeDisplay = function(param) {
    var $ref = param.$ref, hasSubSchema = param.hasSubSchema, propertyName = param.propertyName, type = param.type;
    var ref;
    var generateAbsoluteSchemaLink = ((ref = (0,react.useContext)(SchemaOptionsContext)) !== null && ref !== void 0 ? ref : {}).generateAbsoluteSchemaLink;
    if (!generateAbsoluteSchemaLink) {
        return null;
    }
    var SchemaLink = generateAbsoluteSchemaLink === null || generateAbsoluteSchemaLink === void 0 ? void 0 : generateAbsoluteSchemaLink($ref !== null && $ref !== void 0 ? $ref : propertyName);
    if ($ref) {
        return SchemaLink;
    }
    return(/*#__PURE__*/ (0,jsx_runtime.jsx)(jsx_runtime.Fragment, {
        children: (Array.isArray(type) ? type : [
            type
        ]).map(function(permittedType) {
            return permittedType === "object" && hasSubSchema ? SchemaLink : /*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
                children: permittedType
            });
        }).reduce(function(prev, curr) {
            return [
                prev,
                ", ",
                curr
            ];
        })
    }));
};
var PropertyTypeSelect = function(param) {
    var $ref = param.$ref, type = param.type, updatePermittedType = param.updatePermittedType;
    var ref;
    var ref1 = (ref = (0,react.useContext)(SchemaOptionsContext)) !== null && ref !== void 0 ? ref : {}, availableEntityTypes = ref1.availableEntityTypes, subSchemas = ref1.subSchemas;
    var currentType = $ref !== null && $ref !== void 0 ? $ref : Array.isArray(type) ? type[0] : type; // @todo support multiple permitted types
    var typeOptions = (0,react.useMemo)(function() {
        var options = [
            {
                disabled: true,
                label: "----- Primitive types -----",
                value: "__primitive_divider"
            }, 
        ].concat(_toConsumableArray(primitiveJsonTypes.map(function(primitiveType) {
            return {
                disabled: false,
                label: primitiveType,
                value: primitiveType
            };
        })));
        if (subSchemas === null || subSchemas === void 0 ? void 0 : subSchemas.length) {
            var _options;
            (_options = options).push.apply(_options, [
                {
                    disabled: true,
                    label: "----- Sub-schemas -----",
                    value: "__subschema_divider"
                }, 
            ].concat(_toConsumableArray(subSchemas.map(function(subSchema) {
                return {
                    disabled: false,
                    label: subSchema[0],
                    value: "#/$defs/".concat(subSchema[0])
                };
            }))));
        }
        if (availableEntityTypes === null || availableEntityTypes === void 0 ? void 0 : availableEntityTypes.length) {
            var _options1;
            (_options1 = options).push.apply(_options1, [
                {
                    disabled: true,
                    label: "---- Other entities ----",
                    value: "__other_type_divider"
                }, 
            ].concat(_toConsumableArray(availableEntityTypes.map(function(entityType) {
                return {
                    disabled: false,
                    label: entityType.title,
                    value: entityType.$id
                };
            }))));
        }
        return options;
    }, [
        availableEntityTypes,
        subSchemas
    ]);
    return(/*#__PURE__*/ (0,jsx_runtime.jsx)(Select/* default */.Z, {
        className: (0,twind.tw)(_templateObject()),
        onChange: function(evt) {
            return updatePermittedType === null || updatePermittedType === void 0 ? void 0 : updatePermittedType(evt.target.value);
        },
        value: currentType,
        children: typeOptions.map(function(option) {
            /*#__PURE__*/ return (0,jsx_runtime.jsx)(MenuItem/* default */.Z, {
                value: option.value,
                disabled: option.disabled,
                children: option.label
            }, option.value);
        })
    }));
};
var SchemaPropertyTypeList = function(_param) {
    var readonly = _param.readonly, props = _objectWithoutProperties(_param, [
        "readonly"
    ]);
    if (!readonly) {
        return(/*#__PURE__*/ (0,jsx_runtime.jsx)(PropertyTypeSelect, _objectSpread({}, props)));
    }
    return(/*#__PURE__*/ (0,jsx_runtime.jsx)(PropertyTypeDisplay, _objectSpread({}, props)));
};


// EXTERNAL MODULE: ../node_modules/@mui/material/Checkbox/Checkbox.js + 6 modules
var Checkbox = __webpack_require__(4614);
// EXTERNAL MODULE: ./src/components/TextField.tsx + 8 modules
var TextField = __webpack_require__(9601);
;// CONCATENATED MODULE: ./src/components/entityTypes/SchemaEditor/Inputs.tsx
function Inputs_defineProperty(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function Inputs_objectSpread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            Inputs_defineProperty(target, key, source[key]);
        });
    }
    return target;
}





var TextInputOrDisplay = function(param) {
    var clearOnUpdate = param.clearOnUpdate, placeholder = param.placeholder, readonly = param.readonly, required = param.required, updateOnBlur = param.updateOnBlur, updateText = param.updateText, value = param.value;
    var ref = (0,react.useState)(value), draftText = ref[0], setDraftText = ref[1];
    (0,react.useEffect)(function() {
        setDraftText(value);
    }, [
        value
    ]);
    if (readonly) {
        return(/*#__PURE__*/ (0,jsx_runtime.jsx)(Typography/* default */.Z, {
            component: "span",
            sx: {
                display: "inline-block",
                overflowWrap: {
                    xs: "anywhere",
                    md: "unset"
                },
                maxWidth: {
                    xs: "125px",
                    md: "unset"
                },
                width: {
                    xs: "max-content",
                    md: "unset"
                }
            },
            children: value
        }));
    }
    var textChangeEvents = {
        onChange: function(evt) {
            return updateText(evt.target.value);
        }
    };
    if (updateOnBlur) {
        textChangeEvents = {
            onBlur: function() {
                updateText(draftText);
                if (clearOnUpdate) {
                    setDraftText("");
                }
            },
            onChange: function(evt) {
                return setDraftText(evt.target.value);
            }
        };
    }
    return(/*#__PURE__*/ (0,jsx_runtime.jsx)(TextField/* TextField */.n, Inputs_objectSpread({}, textChangeEvents, {
        placeholder: placeholder,
        required: required,
        sx: {
            minWidth: "125px"
        },
        value: draftText,
        variant: "outlined"
    })));
};
var ToggleInputOrDisplay = function(param) {
    var checked = param.checked, onChange = param.onChange, readonly = param.readonly;
    if (readonly) {
        return(/*#__PURE__*/ (0,jsx_runtime.jsx)("span", {
            children: checked ? "Yes" : "No"
        }));
    }
    return(/*#__PURE__*/ (0,jsx_runtime.jsx)(Checkbox/* default */.Z, {
        checked: checked,
        onChange: function(_, value) {
            return onChange(value);
        }
    }));
};

// EXTERNAL MODULE: ./src/components/Button.tsx + 3 modules
var Button = __webpack_require__(6437);
;// CONCATENATED MODULE: ./src/components/entityTypes/SchemaEditor/SchemaPropertyRow.tsx







var SchemaPropertyRow = function(param) {
    var dispatchSchemaUpdate = param.dispatchSchemaUpdate, name = param.name, property = param.property, readonly = param.readonly, required = param.required;
    var ref, ref1;
    var ref2;
    var selectedSchema = ((ref2 = (0,react.useContext)(SchemaOptionsContext)) !== null && ref2 !== void 0 ? ref2 : {}).selectedSchema;
    var isArray = property.type === "array";
    var togglePropertyIsArray = function() {
        return dispatchSchemaUpdate({
            type: "togglePropertyIsArray",
            payload: {
                propertyName: name
            }
        });
    };
    var togglePropertyIsRequired = function() {
        return dispatchSchemaUpdate({
            type: "togglePropertyIsRequired",
            payload: {
                propertyName: name
            }
        });
    };
    var updatePropertyDescription = function(newDescription) {
        return dispatchSchemaUpdate({
            type: "updatePropertyDescription",
            payload: {
                propertyName: name,
                newPropertyDescription: newDescription
            }
        });
    };
    var updatePropertySchemaOrgLink = function(newSchemaOrgUri) {
        return dispatchSchemaUpdate({
            type: "updatePropertySchemaOrgLink",
            payload: {
                propertyName: name,
                newSchemaOrgUri: newSchemaOrgUri
            }
        });
    };
    var updatePropertyName = function(newName) {
        return dispatchSchemaUpdate({
            type: "updatePropertyName",
            payload: {
                oldPropertyName: name,
                newPropertyName: newName
            }
        });
    };
    var updatePermittedType = function(newType) {
        return dispatchSchemaUpdate({
            type: "updatePropertyPermittedType",
            payload: {
                newType: newType,
                propertyName: name
            }
        });
    };
    var deleteProperty = function() {
        return dispatchSchemaUpdate({
            type: "deleteProperty",
            payload: {
                propertyName: name
            }
        });
    };
    /**
   * @todo deal with tuples and other array keywords, e.g. preferredItems
   */ var ref3 = isArray ? property.items : property, $ref = ref3.$ref, type = ref3.type, properties = ref3.properties;
    var description = property.description;
    var schemaOrgLink = (ref1 = selectedSchema === null || selectedSchema === void 0 ? void 0 : (ref = selectedSchema["jsonld:context"]) === null || ref === void 0 ? void 0 : ref["jsonld:definition"].find(function(def) {
        return def["jsonld:term"] === name;
    })) === null || ref1 === void 0 ? void 0 : ref1["jsonld:iri"];
    return(/*#__PURE__*/ (0,jsx_runtime.jsxs)("tr", {
        className: trClasses,
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                className: tdClasses,
                children: /*#__PURE__*/ (0,jsx_runtime.jsx)(TextInputOrDisplay, {
                    placeholder: "The property name",
                    readonly: readonly,
                    updateText: updatePropertyName,
                    value: name,
                    updateOnBlur: true
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                className: tdClasses,
                children: /*#__PURE__*/ (0,jsx_runtime.jsx)(SchemaPropertyTypeList, {
                    hasSubSchema: !!properties,
                    propertyName: name,
                    readonly: readonly,
                    $ref: $ref,
                    type: type,
                    updatePermittedType: updatePermittedType
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                className: tdClasses,
                children: /*#__PURE__*/ (0,jsx_runtime.jsx)(TextInputOrDisplay, {
                    placeholder: "Describe the property...",
                    readonly: readonly,
                    updateText: updatePropertyDescription,
                    value: description !== null && description !== void 0 ? description : "",
                    updateOnBlur: true
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                className: tdClasses,
                children: /*#__PURE__*/ (0,jsx_runtime.jsx)(TextInputOrDisplay, {
                    placeholder: "URI to schema.org equivalent property",
                    readonly: readonly,
                    updateText: updatePropertySchemaOrgLink,
                    value: schemaOrgLink !== null && schemaOrgLink !== void 0 ? schemaOrgLink : "",
                    updateOnBlur: true
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                className: tdClasses,
                children: /*#__PURE__*/ (0,jsx_runtime.jsx)(ToggleInputOrDisplay, {
                    checked: isArray,
                    onChange: function() {
                        return togglePropertyIsArray();
                    },
                    readonly: readonly
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                className: tdClasses,
                children: /*#__PURE__*/ (0,jsx_runtime.jsx)(ToggleInputOrDisplay, {
                    checked: required,
                    onChange: function() {
                        return togglePropertyIsRequired();
                    },
                    readonly: readonly
                })
            }),
            !readonly && /*#__PURE__*/ (0,jsx_runtime.jsx)("td", {
                className: tdClasses,
                children: /*#__PURE__*/ (0,jsx_runtime.jsx)(Button/* Button */.z, {
                    onClick: deleteProperty,
                    color: "danger",
                    variant: "secondary",
                    squared: true,
                    children: "Delete"
                })
            })
        ]
    }));
};

;// CONCATENATED MODULE: ./src/components/entityTypes/SchemaEditor/SchemaPropertiesTable.tsx
function SchemaPropertiesTable_arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}
function _instanceof(left, right) {
    if (right != null && typeof Symbol !== "undefined" && right[Symbol.hasInstance]) {
        return right[Symbol.hasInstance](left);
    } else {
        return left instanceof right;
    }
}
function _iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || SchemaPropertiesTable_unsupportedIterableToArray(arr, i) || _nonIterableRest();
}
function SchemaPropertiesTable_taggedTemplateLiteral(strings, raw) {
    if (!raw) {
        raw = strings.slice(0);
    }
    return Object.freeze(Object.defineProperties(strings, {
        raw: {
            value: Object.freeze(raw)
        }
    }));
}
function SchemaPropertiesTable_unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return SchemaPropertiesTable_arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return SchemaPropertiesTable_arrayLikeToArray(o, minLen);
}
function SchemaPropertiesTable_templateObject() {
    var data = SchemaPropertiesTable_taggedTemplateLiteral([
        "sticky first:rounded-tl-2xl last:rounded-tr-2xl ",
        ""
    ]);
    SchemaPropertiesTable_templateObject = function _templateObject() {
        return data;
    };
    return data;
}
function _templateObject1() {
    var data = SchemaPropertiesTable_taggedTemplateLiteral([
        "border border-gray-100 rounded-2xl odd:bg-gray-50 even:bg-gray-100"
    ]);
    _templateObject1 = function _templateObject1() {
        return data;
    };
    return data;
}
function _templateObject2() {
    var data = SchemaPropertiesTable_taggedTemplateLiteral([
        "",
        ""
    ]);
    _templateObject2 = function _templateObject2() {
        return data;
    };
    return data;
}
function _templateObject3() {
    var data = SchemaPropertiesTable_taggedTemplateLiteral([
        "max-w-full w-full text-sm text-left border-separate border border-gray-100 rounded-2xl"
    ]);
    _templateObject3 = function _templateObject3() {
        return data;
    };
    return data;
}
function _templateObject4() {
    var data = SchemaPropertiesTable_taggedTemplateLiteral([
        "font-bold mt-4 mr-12 mb-1"
    ]);
    _templateObject4 = function _templateObject4() {
        return data;
    };
    return data;
}
function _templateObject5() {
    var data = SchemaPropertiesTable_taggedTemplateLiteral([
        "flex"
    ]);
    _templateObject5 = function _templateObject5() {
        return data;
    };
    return data;
}
function _templateObject6() {
    var data = SchemaPropertiesTable_taggedTemplateLiteral([
        "ml-4"
    ]);
    _templateObject6 = function _templateObject6() {
        return data;
    };
    return data;
}






var cellPadding = "pl-4 pr-8 py-4";
var thClasses = (0,twind.tw)(SchemaPropertiesTable_templateObject(), cellPadding);
var trClasses = (0,twind.tw)(_templateObject1());
var tdClasses = (0,twind.tw)(_templateObject2(), cellPadding);
var SchemaPropertiesTable = function(param1) {
    var readonly = param1.readonly, selectedSchema = param1.selectedSchema, dispatchSchemaUpdate = param1.dispatchSchemaUpdate;
    var ref;
    var properties = selectedSchema.properties, required = selectedSchema.required;
    var requiredArray = _instanceof(required, Array) ? required : undefined;
    var addProperty = function(newPropertyName) {
        return dispatchSchemaUpdate({
            type: "addProperty",
            payload: {
                newPropertyName: newPropertyName
            }
        });
    };
    var ref1 = (0,react.useState)(""), newPropertyName1 = ref1[0], setNewPropertyName = ref1[1];
    var onAddPropertyFormSubmit = function(event) {
        event.preventDefault();
        if (!newPropertyName1.trim()) {
            return false;
        }
        addProperty(newPropertyName1);
        setNewPropertyName("");
    };
    return(/*#__PURE__*/ (0,jsx_runtime.jsxs)("table", {
        className: (0,twind.tw)(_templateObject3()),
        style: {
            borderSpacing: 0
        },
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)("thead", {
                children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("tr", {
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("th", {
                            className: thClasses,
                            children: "Property"
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("th", {
                            className: thClasses,
                            children: "Expected Type"
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("th", {
                            className: thClasses,
                            children: "Description"
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("th", {
                            className: thClasses,
                            children: "schema.org equivalent"
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("th", {
                            className: thClasses,
                            children: "Array"
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsx)("th", {
                            className: thClasses,
                            children: "Required"
                        }),
                        !readonly && /*#__PURE__*/ (0,jsx_runtime.jsx)("th", {
                            className: thClasses,
                            children: "Delete"
                        })
                    ]
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)("tbody", {
                children: [
                    (ref = Object.entries(properties !== null && properties !== void 0 ? properties : {})) === null || ref === void 0 ? void 0 : ref.sort(function(a, b) {
                        return a[0].localeCompare(b[0]);
                    }).map(function(param) {
                        var _param = _slicedToArray(param, 2), name = _param[0], propertySchema = _param[1];
                        var isRequired = (requiredArray === null || requiredArray === void 0 ? void 0 : requiredArray.includes(name)) || !!propertySchema.required;
                        return(/*#__PURE__*/ (0,jsx_runtime.jsx)(SchemaPropertyRow, {
                            dispatchSchemaUpdate: dispatchSchemaUpdate,
                            name: name,
                            property: propertySchema,
                            readonly: readonly,
                            required: isRequired
                        }, name));
                    }),
                    !readonly ? /*#__PURE__*/ (0,jsx_runtime.jsx)("tr", {
                        className: trClasses,
                        children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("td", {
                            className: tdClasses,
                            colSpan: 7,
                            children: [
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                                    className: (0,twind.tw)(_templateObject4()),
                                    children: "New property"
                                }),
                                /*#__PURE__*/ (0,jsx_runtime.jsxs)("form", {
                                    onSubmit: onAddPropertyFormSubmit,
                                    className: (0,twind.tw)(_templateObject5()),
                                    children: [
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)(TextInputOrDisplay, {
                                            placeholder: "newProperty",
                                            readonly: false,
                                            updateText: setNewPropertyName,
                                            value: newPropertyName1,
                                            required: true
                                        }),
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)("br", {}),
                                        /*#__PURE__*/ (0,jsx_runtime.jsx)(Button/* Button */.z, {
                                            className: (0,twind.tw)(_templateObject6()),
                                            type: "submit",
                                            variant: "primary",
                                            squared: true,
                                            children: "Create Property"
                                        })
                                    ]
                                })
                            ]
                        })
                    }) : null
                ]
            })
        ]
    }));
};

// EXTERNAL MODULE: ../node_modules/immer/dist/immer.esm.js
var immer_esm = __webpack_require__(8907);
;// CONCATENATED MODULE: ./src/components/entityTypes/SchemaEditor/schemaEditorReducer.ts
function schemaEditorReducer_arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function schemaEditorReducer_arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return schemaEditorReducer_arrayLikeToArray(arr);
}
function schemaEditorReducer_iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function schemaEditorReducer_nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function schemaEditorReducer_toConsumableArray(arr) {
    return schemaEditorReducer_arrayWithoutHoles(arr) || schemaEditorReducer_iterableToArray(arr) || schemaEditorReducer_unsupportedIterableToArray(arr) || schemaEditorReducer_nonIterableSpread();
}
function schemaEditorReducer_unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return schemaEditorReducer_arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return schemaEditorReducer_arrayLikeToArray(o, minLen);
}


var // @todo handle multiple permitted types
_propertyToEdit, _schemaToEdit, _schemaToEdit1, _schemaToEdit2, _draftRootSchema, _schemaToEdit3, _schemaToEdit4, _schemaToEdit5;
var selectSubSchema = function(schema, pathToSubSchema) {
    return pathToSubSchema ? (0,lodash.get)(schema, pathToSubSchema) : schema;
};
var updatePropertyType = function(schemaToEdit, propertyName, newType) {
    var ref;
    var propertyToEdit = (ref = schemaToEdit.properties) === null || ref === void 0 ? void 0 : ref[propertyName];
    if (!propertyToEdit) {
        throw new Error("Property '".concat(propertyName, "' not found."));
    }
    var isArray = propertyToEdit.type === "array";
    var isRef = /^(http|#|\/)/.test(newType);
    if (isArray) {
        if (isRef) {
            propertyToEdit.items = {
                $ref: newType
            };
        } else {
            var _items;
            (_items = (_propertyToEdit = propertyToEdit).items) !== null && _items !== void 0 ? _items : _propertyToEdit.items = {};
            propertyToEdit.items.type = newType;
            delete propertyToEdit.items.$ref;
        }
    } else if (isRef) {
        propertyToEdit = {
            description: propertyToEdit.description,
            $ref: newType
        };
    } else {
        propertyToEdit.type = newType;
        delete propertyToEdit.$ref;
    }
    return propertyToEdit;
};
var getDependentProperties = function(properties, subSchemaNameToDelete, prefix) {
    var dependentProperties = [];
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = Object.keys(properties !== null && properties !== void 0 ? properties : {})[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var propertyName = _step.value;
            var ref, ref1, ref2, ref3;
            var property = properties === null || properties === void 0 ? void 0 : properties[propertyName];
            // @todo revisit when we have multiple types
            // @todo also check for properties of type "object" and check that object's properties
            if ((property === null || property === void 0 ? void 0 : (ref = property.$ref) === null || ref === void 0 ? void 0 : ref.includes(subSchemaNameToDelete)) || (Array.isArray(property === null || property === void 0 ? void 0 : property.items) ? (ref1 = property === null || property === void 0 ? void 0 : property.items[0].$ref) === null || ref1 === void 0 ? void 0 : ref1.includes(subSchemaNameToDelete) : property === null || property === void 0 ? void 0 : (ref2 = property.items) === null || ref2 === void 0 ? void 0 : (ref3 = ref2.$ref) === null || ref3 === void 0 ? void 0 : ref3.includes(subSchemaNameToDelete))) {
                dependentProperties.push(prefix ? [
                    prefix,
                    propertyName
                ] : propertyName);
            }
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
    return dependentProperties;
};
// returns propertyname as string or path to propertyname as string[]
var getSubschemaDependentProperties = function(schema, subSchemaNameToDelete) {
    var _dependentProperties;
    var properties = schema.properties, $defs = schema.$defs;
    var dependentProperties = [];
    (_dependentProperties = dependentProperties).push.apply(_dependentProperties, schemaEditorReducer_toConsumableArray(getDependentProperties(properties, subSchemaNameToDelete)));
    var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;
    try {
        for(var _iterator = Object.keys($defs !== null && $defs !== void 0 ? $defs : {})[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true){
            var subSchemaName = _step.value;
            var _dependentProperties1;
            if (subSchemaName === subSchemaNameToDelete) {
                continue;
            }
            var ref;
            var ref4 = (ref = $defs === null || $defs === void 0 ? void 0 : $defs[subSchemaName]) !== null && ref !== void 0 ? ref : {}, subschemaProperties = ref4.properties;
            (_dependentProperties1 = dependentProperties).push.apply(_dependentProperties1, schemaEditorReducer_toConsumableArray(getDependentProperties(subschemaProperties, subSchemaNameToDelete, subSchemaName)));
        }
    } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
    } finally{
        try {
            if (!_iteratorNormalCompletion && _iterator.return != null) {
                _iterator.return();
            }
        } finally{
            if (_didIteratorError) {
                throw _iteratorError;
            }
        }
    }
    return dependentProperties;
};
var schemaEditorReducer = function(schemaState, action) {
    var pathToSubSchema = action.payload.pathToSubSchema;
    // Get a reference to the target sub-schema, checked against to validate if action should be taken
    var subSchemaToCheck = selectSubSchema(schemaState, pathToSubSchema);
    if (pathToSubSchema && !subSchemaToCheck) {
        throw new Error("Target sub-schema at path ".concat(pathToSubSchema, " does not exist."));
    }
    switch(action.type){
        case "addProperty":
            {
                var ref;
                if ((ref = subSchemaToCheck.properties) === null || ref === void 0 ? void 0 : ref[action.payload.newPropertyName]) {
                    // bail out to prevent people accidentally overwriting an existing property
                    return schemaState;
                }
                return (0,immer_esm/* default */.ZP)(schemaState, function(draftRootSchema) {
                    var schemaToEdit = selectSubSchema(draftRootSchema, pathToSubSchema);
                    var _properties;
                    (_properties = (_schemaToEdit = schemaToEdit).properties) !== null && _properties !== void 0 ? _properties : _schemaToEdit.properties = {};
                    schemaToEdit.properties[action.payload.newPropertyName] = {
                        type: "string"
                    };
                });
            }
        case "addSubSchema":
            {
                var ref5;
                if ((ref5 = subSchemaToCheck.$defs) === null || ref5 === void 0 ? void 0 : ref5[action.payload.newSubSchemaName]) {
                    // bail out to prevent people accidentally overwriting an existing sub-schema
                    return schemaState;
                }
                return (0,immer_esm/* default */.ZP)(schemaState, function(draftRootSchema) {
                    var schemaToEdit = selectSubSchema(draftRootSchema, pathToSubSchema);
                    var _$defs;
                    (_$defs = (_schemaToEdit1 = schemaToEdit).$defs) !== null && _$defs !== void 0 ? _$defs : _schemaToEdit1.$defs = {};
                    schemaToEdit.$defs[action.payload.newSubSchemaName] = {
                        type: "object",
                        required: []
                    };
                });
            }
        case "deleteProperty":
            {
                return (0,immer_esm/* default */.ZP)(schemaState, function(draftRootSchema) {
                    var schemaToEdit = selectSubSchema(draftRootSchema, pathToSubSchema);
                    var _properties;
                    (_properties = (_schemaToEdit2 = schemaToEdit).properties) !== null && _properties !== void 0 ? _properties : _schemaToEdit2.properties = {};
                    delete schemaToEdit.properties[action.payload.propertyName];
                });
            }
        case "deleteSubSchema":
            {
                return (0,immer_esm/* default */.ZP)(schemaState, function(draftRootSchema) {
                    var _payload = action.payload, subSchemaNameToDelete = _payload.subSchemaName;
                    var $defs = draftRootSchema.$defs;
                    var dependentProperties = getSubschemaDependentProperties(draftRootSchema, subSchemaNameToDelete);
                    dependentProperties.forEach(function(dependentProperty) {
                        // Update the subschema property
                        if (Array.isArray(dependentProperty)) {
                            return updatePropertyType($defs[dependentProperty[0]], dependentProperty[1], "string");
                        }
                        // Update the schema property
                        updatePropertyType(draftRootSchema, dependentProperty, "string");
                    });
                    var _$defs;
                    (_$defs = (_draftRootSchema = draftRootSchema).$defs) !== null && _$defs !== void 0 ? _$defs : _draftRootSchema.$defs = {};
                    delete draftRootSchema.$defs[subSchemaNameToDelete];
                });
            }
        case "togglePropertyIsArray":
            {
                return (0,immer_esm/* default */.ZP)(schemaState, function(draftRootSchema) {
                    var ref;
                    var schemaToEdit = selectSubSchema(draftRootSchema, pathToSubSchema);
                    var propertyName = action.payload.propertyName;
                    var propertyToReplace = (ref = schemaToEdit.properties) === null || ref === void 0 ? void 0 : ref[propertyName];
                    if (!propertyToReplace) {
                        throw new Error("Property '".concat(propertyName, "' not found."));
                    }
                    var replacementProperty = {
                        description: propertyToReplace.description
                    };
                    var isCurrentlyArray = propertyToReplace.type === "array";
                    if (isCurrentlyArray) {
                        Object.assign(replacementProperty, Array.isArray(propertyToReplace.items) ? propertyToReplace.items[0] // @todo support multiple permitted types
                         : propertyToReplace.items);
                        if (replacementProperty.$ref) {
                            delete replacementProperty.type;
                        }
                    } else {
                        replacementProperty.type = "array";
                        replacementProperty.items = propertyToReplace;
                        delete replacementProperty.items.description;
                    }
                    schemaToEdit.properties[propertyName] = replacementProperty;
                });
            }
        case "togglePropertyIsRequired":
            {
                return (0,immer_esm/* default */.ZP)(schemaState, function(draftRootSchema) {
                    var ref;
                    var schemaToEdit = selectSubSchema(draftRootSchema, pathToSubSchema);
                    var propertyName = action.payload.propertyName;
                    if (!((ref = schemaToEdit.properties) === null || ref === void 0 ? void 0 : ref[propertyName])) {
                        throw new Error("Property '".concat(propertyName, "' not found."));
                    }
                    schemaToEdit.required = Array.isArray(schemaToEdit.required) ? schemaToEdit.required : [];
                    if (schemaToEdit.required.includes(propertyName)) {
                        schemaToEdit.required = schemaToEdit.required.filter(function(name) {
                            return name !== propertyName;
                        });
                    } else {
                        schemaToEdit.required.push(propertyName);
                    }
                });
            }
        case "updatePropertyDescription":
            {
                var ref6, ref7, ref8;
                var _payload3 = action.payload, propertyName2 = _payload3.propertyName, newPropertyDescription = _payload3.newPropertyDescription;
                if (newPropertyDescription === ((ref6 = subSchemaToCheck.properties) === null || ref6 === void 0 ? void 0 : (ref7 = ref6[propertyName2]) === null || ref7 === void 0 ? void 0 : ref7.description)) {
                    return schemaState;
                } else if (!((ref8 = subSchemaToCheck.properties) === null || ref8 === void 0 ? void 0 : ref8[propertyName2])) {
                    throw new Error("Property '".concat(propertyName2, "' not found."));
                }
                return (0,immer_esm/* default */.ZP)(schemaState, function(draftRootSchema) {
                    var schemaToEdit = selectSubSchema(draftRootSchema, pathToSubSchema);
                    schemaToEdit.properties[propertyName2].description = newPropertyDescription;
                });
            }
        /** @see https://www.w3.org/2019/wot/json-schema#defining-a-json-ld-context-for-data-instances */ case "updatePropertySchemaOrgLink":
            {
                var ref9;
                var _payload1 = action.payload, propertyName1 = _payload1.propertyName, newSchemaOrgUri = _payload1.newSchemaOrgUri;
                if (!((ref9 = subSchemaToCheck.properties) === null || ref9 === void 0 ? void 0 : ref9[propertyName1])) {
                    throw new Error("Property '".concat(propertyName1, "' not found."));
                }
                return (0,immer_esm/* default */.ZP)(schemaState, function(draftRootSchema) {
                    var schemaToEdit = selectSubSchema(draftRootSchema, pathToSubSchema);
                    var ref;
                    (ref = (_schemaToEdit3 = schemaToEdit)["@context"]) !== null && ref !== void 0 ? ref : _schemaToEdit3["@context"] = {
                        jsonld: "http://www.w3.org/ns/json-ld#",
                        "jsonld:iri": {
                            "@type": "@id"
                        }
                    };
                    var ref11;
                    (ref11 = (_schemaToEdit4 = schemaToEdit)["jsonld:context"]) !== null && ref11 !== void 0 ? ref11 : _schemaToEdit4["jsonld:context"] = {
                        "jsonld:definition": []
                    };
                    var schemaOrgLinks = schemaToEdit["jsonld:context"]["jsonld:definition"];
                    var existingLink = schemaOrgLinks.find(function(link) {
                        return link["jsonld:term"] === propertyName1;
                    });
                    if (existingLink) {
                        existingLink["jsonld:iri"] = newSchemaOrgUri;
                    } else {
                        schemaOrgLinks.push({
                            "@type": "jsonld:TermDefinition",
                            "jsonld:term": propertyName1,
                            "jsonld:iri": newSchemaOrgUri
                        });
                    }
                    return schemaToEdit;
                });
            }
        case "updatePropertyName":
            {
                var ref10;
                var _payload2 = action.payload, oldPropertyName = _payload2.oldPropertyName, newPropertyName = _payload2.newPropertyName;
                if (newPropertyName === oldPropertyName) {
                    return schemaState;
                } else if (!((ref10 = subSchemaToCheck.properties) === null || ref10 === void 0 ? void 0 : ref10[oldPropertyName])) {
                    throw new Error("Property '".concat(oldPropertyName, "' not found."));
                }
                return (0,immer_esm/* default */.ZP)(schemaState, function(draftRootSchema) {
                    var schemaToEdit = selectSubSchema(draftRootSchema, pathToSubSchema);
                    var _properties;
                    (_properties = (_schemaToEdit5 = schemaToEdit).properties) !== null && _properties !== void 0 ? _properties : _schemaToEdit5.properties = {};
                    schemaToEdit.properties[newPropertyName] = schemaToEdit.properties[oldPropertyName];
                    delete schemaToEdit.properties[oldPropertyName];
                });
            }
        case "updatePropertyPermittedType":
            {
                return (0,immer_esm/* default */.ZP)(schemaState, function(draftRootSchema) {
                    var ref;
                    var schemaToEdit = selectSubSchema(draftRootSchema, pathToSubSchema);
                    var _payload = action.payload, propertyName = _payload.propertyName, newType = _payload.newType;
                    if (!((ref = schemaToEdit.properties) === null || ref === void 0 ? void 0 : ref[propertyName])) {
                        throw new Error("Property '".concat(propertyName, "' not found."));
                    }
                    schemaToEdit.properties[propertyName] = updatePropertyType(schemaToEdit, propertyName, newType);
                });
            }
        case "updateSchemaDescription":
            {
                var newSchemaDescription = action.payload.newSchemaDescription;
                if (newSchemaDescription === subSchemaToCheck.description) {
                    return schemaState;
                }
                return (0,immer_esm/* default */.ZP)(schemaState, function(draftRootSchema) {
                    var schemaToEdit = selectSubSchema(draftRootSchema, pathToSubSchema);
                    schemaToEdit.description = newSchemaDescription;
                });
            }
        default:
            throw new Error("Invalid action type passed to schemaEditorReducer.");
    }
};

// EXTERNAL MODULE: ./src/components/Link.tsx
var Link = __webpack_require__(1131);
;// CONCATENATED MODULE: ./src/components/entityTypes/SchemaEditor/SchemaEditor.tsx
function SchemaEditor_arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function SchemaEditor_arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return SchemaEditor_arrayLikeToArray(arr);
}
function SchemaEditor_iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
}
function SchemaEditor_nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function SchemaEditor_taggedTemplateLiteral(strings, raw) {
    if (!raw) {
        raw = strings.slice(0);
    }
    return Object.freeze(Object.defineProperties(strings, {
        raw: {
            value: Object.freeze(raw)
        }
    }));
}
function SchemaEditor_toConsumableArray(arr) {
    return SchemaEditor_arrayWithoutHoles(arr) || SchemaEditor_iterableToArray(arr) || SchemaEditor_unsupportedIterableToArray(arr) || SchemaEditor_nonIterableSpread();
}
function SchemaEditor_unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return SchemaEditor_arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return SchemaEditor_arrayLikeToArray(o, minLen);
}
function SchemaEditor_templateObject() {
    var data = SchemaEditor_taggedTemplateLiteral([
        "flex items-center"
    ]);
    SchemaEditor_templateObject = function _templateObject() {
        return data;
    };
    return data;
}
function SchemaEditor_templateObject1() {
    var data = SchemaEditor_taggedTemplateLiteral([
        "mb-7 ml-2"
    ]);
    SchemaEditor_templateObject1 = function _templateObject1() {
        return data;
    };
    return data;
}
function SchemaEditor_templateObject2() {
    var data = SchemaEditor_taggedTemplateLiteral([
        "mb-8"
    ]);
    SchemaEditor_templateObject2 = function _templateObject2() {
        return data;
    };
    return data;
}









// @todo implement subschema handling (or remove this code)
// import { SubSchemaItem } from "./SubSchemaItem";
// import { Button } from "../../Button";
var SchemaOptionsContext = /*#__PURE__*/ (0,react.createContext)(null);
var SchemaEditor = function(param) {
    var aggregateEntityTypes = param.aggregateEntityTypes, entityTypeId = param.entityTypeId, possiblyStaleDbSchema = param.schema, subSchemaReference = param.subSchemaReference, updateEntityTypes = param.updateEntityTypes;
    var ref3 = (0,react.useState)(undefined), availableEntityTypes = ref3[0], setAvailableEntityTypes = ref3[1];
    (0,react.useEffect)(function() {
        if (aggregateEntityTypes) {
            aggregateEntityTypes({
                includeOtherTypesInUse: true
            }).then(function(response) {
                return setAvailableEntityTypes(response.results);
            }).catch(function(err) {
                // eslint-disable-next-line no-console -- TODO: consider using logger
                return console.error("Error fetching entity type options: ".concat(err.message));
            });
        }
    }, [
        aggregateEntityTypes
    ]);
    // The user will be working with a draft in local state, to enable optimistic UI and handle fast/competing updates
    var ref1 = (0,react.useReducer)(schemaEditorReducer, possiblyStaleDbSchema), workingSchemaDraft = ref1[0], dispatch = ref1[1];
    var debouncedUpdate = (0,react.useMemo)(function() {
        return (0,lodash.debounce)(function() {
            for(var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++){
                args[_key] = arguments[_key];
            }
            if (!updateEntityTypes) {
                throw new Error("updateEntityType function not provided. Schema cannot be updated.");
            }
            return updateEntityTypes.apply(void 0, SchemaEditor_toConsumableArray(args));
        }, 500);
    }, [
        updateEntityTypes
    ]);
    (0,react.useEffect)(function() {
        var // Send updates to the API periodically when the draft is updated
        ref;
        if (!entityTypeId) {
            throw new Error("entityId not provided. Schema cannot be updated.");
        }
        if (JSON.stringify(workingSchemaDraft) === JSON.stringify(possiblyStaleDbSchema)) {
            return;
        }
        (ref = debouncedUpdate([
            {
                entityTypeId: entityTypeId,
                schema: workingSchemaDraft
            }, 
        ])) === null || ref === void 0 ? void 0 : ref.catch(function(err) {
            // eslint-disable-next-line no-console -- TODO: consider using logger
            console.error("Error updating schema: ".concat(err.message));
            throw err;
        });
    }, [
        debouncedUpdate,
        entityTypeId,
        possiblyStaleDbSchema,
        workingSchemaDraft, 
    ]);
    (0,react.useEffect)(function() {
        return function() {
            var // fire off any pending updates
            ref;
            (ref = debouncedUpdate.flush()) === null || ref === void 0 ? void 0 : ref.catch(function(err) {
                // eslint-disable-next-line no-console -- TODO: consider using logger
                console.error("Error updating schema: ".concat(err.message));
                throw err;
            });
        };
    }, [
        debouncedUpdate
    ]);
    // Strip the leading #/ and replace namespace separator / with dots, for use in lodash get/set methods
    var pathToSubSchema = subSchemaReference === null || subSchemaReference === void 0 ? void 0 : subSchemaReference.replace(/^#\//, "").replace(/\//g, ".");
    var dispatchSchemaUpdate = (0,react.useCallback)(function(action) {
        if (pathToSubSchema && action.type !== "addSubSchema") {
            // don't support sub-schemas with their own sub-schemas for now. the UI doesn't handle it
            // eslint-disable-next-line no-param-reassign
            action.payload.pathToSubSchema = pathToSubSchema;
        }
        dispatch(action);
    }, [
        dispatch,
        pathToSubSchema
    ]);
    var _$defs, ref2;
    // @todo handle subschemas properly
    var subSchemas = Object.entries((ref2 = (_$defs = workingSchemaDraft.$defs) !== null && _$defs !== void 0 ? _$defs : workingSchemaDraft.definitions) !== null && ref2 !== void 0 ? ref2 : []);
    var schema$id = workingSchemaDraft.$id;
    /**
   * Generate a link for an absolute URI to a schema (or part of a schema), for a given value for $ref
   */ var generateAbsoluteSchemaLink = (0,react.useCallback)(function($ref) {
        var baseUrl = (schema$id === null || schema$id === void 0 ? void 0 : schema$id.startsWith("http")) ? new URL(schema$id).origin : undefined;
        if (!baseUrl && ($ref.startsWith("#") || $ref.startsWith("/"))) {
            throw new Error("Cannot resolve relative $ref '".concat($ref, " as the schema has no absolute $id to resolve it against."));
        }
        var schemaLinkPath = "";
        /**
       * @todo catch links to schemas served from outside blockprotocol.org, and instead of opening their off-site pages,
       *    fetch them and load them into our viewer. Will need to update relative approaches too.
       */ if ($ref.startsWith("#")) {
            /**
         * This is a relative link to a sub-schema of this same schema
         * @see https://json-schema.org/understanding-json-schema/structuring.html#json-pointer
         */ schemaLinkPath = schema$id + $ref;
        } else if ($ref.startsWith("/")) {
            /**
         * This is a relative link to another schema to be resolved against the base URL of this schema.
         * @see https://json-schema.org/understanding-json-schema/structuring.html#ref
         */ schemaLinkPath = baseUrl + $ref;
        } else if ($ref.startsWith("http")) {
            schemaLinkPath = $ref;
        } else {
            /**
         * This could be a property name for an object defined in the tree of the schema or a sub-schema within it.
         * Really these should instead be defined under $defs and referenced as such, but they might exist.
         */ schemaLinkPath = "".concat(schema$id + (subSchemaReference || "#"), "/properties/").concat($ref);
        }
        return(/*#__PURE__*/ (0,jsx_runtime.jsx)(Link/* Link */.rU, {
            href: schemaLinkPath,
            children: /*#__PURE__*/ (0,jsx_runtime.jsx)("a", {
                children: /*#__PURE__*/ (0,jsx_runtime.jsx)("strong", {
                    children: $ref.replace(/#\/\$defs\//g, "")
                })
            })
        }));
    }, [
        schema$id,
        subSchemaReference
    ]);
    /**
   * @todo deal with $anchors https://json-schema.org/understanding-json-schema/structuring.html#anchor
   */ var selectedSchema = pathToSubSchema ? (0,lodash.get)(workingSchemaDraft, pathToSubSchema) : workingSchemaDraft;
    var schemaOptions = (0,react.useMemo)(function() {
        return {
            availableEntityTypes: availableEntityTypes !== null && availableEntityTypes !== void 0 ? availableEntityTypes : [],
            generateAbsoluteSchemaLink: generateAbsoluteSchemaLink,
            selectedSchema: selectedSchema,
            subSchemas: subSchemas
        };
    }, [
        availableEntityTypes,
        generateAbsoluteSchemaLink,
        selectedSchema,
        subSchemas, 
    ]);
    var description = selectedSchema.description;
    var readonly = !updateEntityTypes || !entityTypeId;
    // @todo implement subschema handling (or remove this code)
    // const addSubSchema = (newSubSchemaName: string) =>
    //   dispatchSchemaUpdate({
    //     type: "addSubSchema",
    //     payload: { newSubSchemaName },
    //   });
    //
    // const [newSubSchemaName, setNewSubSchemaName] = useState("");
    // const onNewSubSchemaFormSubmit = (event: FormEvent<HTMLFormElement>) => {
    //   event.preventDefault();
    //
    //   if (!newSubSchemaName.trim()) {
    //     return;
    //   }
    //
    //   addSubSchema(newSubSchemaName);
    //   setNewSubSchemaName("");
    // };
    var updateSchemaDescription = function(newSchemaDescription) {
        return dispatchSchemaUpdate({
            type: "updateSchemaDescription",
            payload: {
                newSchemaDescription: newSchemaDescription
            }
        });
    };
    return(/*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
        children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("section", {
            children: [
                /*#__PURE__*/ (0,jsx_runtime.jsx)("div", {
                    className: (0,twind.tw)(SchemaEditor_templateObject()),
                    children: subSchemaReference ? /*#__PURE__*/ (0,jsx_runtime.jsx)("h3", {
                        className: (0,twind.tw)(SchemaEditor_templateObject1()),
                        children: " > ".concat(subSchemaReference.split("/").pop())
                    }) : null
                }),
                !readonly && description != null && /*#__PURE__*/ (0,jsx_runtime.jsxs)("div", {
                    className: (0,twind.tw)(SchemaEditor_templateObject2()),
                    children: [
                        /*#__PURE__*/ (0,jsx_runtime.jsx)(Typography/* default */.Z, {
                            variant: "bpSmallCopy",
                            children: /*#__PURE__*/ (0,jsx_runtime.jsx)("strong", {
                                children: "Schema description"
                            })
                        }),
                        /*#__PURE__*/ (0,jsx_runtime.jsx)(TextInputOrDisplay, {
                            placeholder: "Describe your schema",
                            readonly: readonly,
                            updateText: updateSchemaDescription,
                            value: description !== null && description !== void 0 ? description : "",
                            updateOnBlur: true
                        })
                    ]
                }),
                /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                    sx: {
                        overflowX: "auto"
                    },
                    children: !availableEntityTypes ? "Loading..." : /*#__PURE__*/ (0,jsx_runtime.jsx)(SchemaOptionsContext.Provider, {
                        value: schemaOptions,
                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)(SchemaPropertiesTable, {
                            selectedSchema: selectedSchema,
                            readonly: readonly,
                            dispatchSchemaUpdate: dispatchSchemaUpdate
                        })
                    })
                })
            ]
        })
    }));
};

// EXTERNAL MODULE: ./src/lib/apiClient.ts
var apiClient = __webpack_require__(3280);
// EXTERNAL MODULE: ./src/context/UserContext.ts
var UserContext = __webpack_require__(505);
;// CONCATENATED MODULE: ./src/pages/[shortname]/types/[title].page.tsx
function _title_page_arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for(var i = 0, arr2 = new Array(len); i < len; i++)arr2[i] = arr[i];
    return arr2;
}
function _title_page_arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
}
function _title_page_iterableToArrayLimit(arr, i) {
    var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"];
    if (_i == null) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _s, _e;
    try {
        for(_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true){
            _arr.push(_s.value);
            if (i && _arr.length === i) break;
        }
    } catch (err) {
        _d = true;
        _e = err;
    } finally{
        try {
            if (!_n && _i["return"] != null) _i["return"]();
        } finally{
            if (_d) throw _e;
        }
    }
    return _arr;
}
function _title_page_nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}
function _title_page_slicedToArray(arr, i) {
    return _title_page_arrayWithHoles(arr) || _title_page_iterableToArrayLimit(arr, i) || _title_page_unsupportedIterableToArray(arr, i) || _title_page_nonIterableRest();
}
function _title_page_taggedTemplateLiteral(strings, raw) {
    if (!raw) {
        raw = strings.slice(0);
    }
    return Object.freeze(Object.defineProperties(strings, {
        raw: {
            value: Object.freeze(raw)
        }
    }));
}
function _title_page_unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _title_page_arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _title_page_arrayLikeToArray(o, minLen);
}
function _title_page_templateObject() {
    var data = _title_page_taggedTemplateLiteral([
        "mb-8"
    ]);
    _title_page_templateObject = function _templateObject() {
        return data;
    };
    return data;
}
function _title_page_templateObject1() {
    var data = _title_page_taggedTemplateLiteral([
        "pt-8 mb-14 w-auto"
    ]);
    _title_page_templateObject1 = function _templateObject1() {
        return data;
    };
    return data;
}











var EntityTypePage = function() {
    var router = (0,next_router.useRouter)();
    var user = (0,UserContext/* useUser */.a)().user;
    var ref2 = (0,react.useState)(true), isLoading = ref2[0], setIsLoading = ref2[1];
    var ref1 = (0,react.useState)(), entityType = ref1[0], setEntityType = ref1[1];
    // shortname and title will be undefined until useRouter populates them
    var _query = router.query, shortname = _query.shortname, title = _query.title;
    var shortnameWithoutLeadingAt = shortname === null || shortname === void 0 ? void 0 : shortname.replace(/^@/, "");
    (0,react.useEffect)(function() {
        if (!shortnameWithoutLeadingAt || !title) {
            return;
        }
        apiClient/* apiClient.getEntityTypeByUserAndTitle */.x.getEntityTypeByUserAndTitle({
            shortname: shortnameWithoutLeadingAt,
            title: title
        }).then(function(param) {
            var data = param.data;
            return setEntityType(data === null || data === void 0 ? void 0 : data.entityType);
        }).catch(function(err) {
            // eslint-disable-next-line no-console -- @todo handle 404s and show to user
            console.error(err);
        }).finally(function() {
            return setIsLoading(false);
        });
    }, [
        shortnameWithoutLeadingAt,
        title,
        setEntityType
    ]);
    var aggregateEntityTypes = function() {
        if (!shortnameWithoutLeadingAt) {
            throw new Error("Aggregate entity types called before shortname available from query.");
        }
        return apiClient/* apiClient.getUserEntityTypes */.x.getUserEntityTypes({
            shortname: shortnameWithoutLeadingAt
        }).then(function(param) {
            var data = param.data;
            var ref;
            return {
                results: (ref = data === null || data === void 0 ? void 0 : data.entityTypes.map(function(type) {
                    return type.schema;
                })) !== null && ref !== void 0 ? ref : [],
                operation: {
                    pageNumber: 1,
                    itemsPerPage: 100
                }
            };
        });
    };
    var updateEntityTypes = function(param1) {
        var _param = _title_page_slicedToArray(param1, 1), ref = _param[0], entityTypeId = ref.entityTypeId, schema = ref.schema;
        return apiClient/* apiClient.updateEntityType */.x.updateEntityType({
            schema: JSON.stringify(schema)
        }, entityTypeId).then(function(param) {
            var data = param.data;
            if (data) {
                return [
                    data.entityType.schema
                ];
            }
            throw new Error("Could not update entity type");
        });
    };
    if (isLoading) {
        // @todo proper loading state
        return null;
    }
    if (!entityType) {
        return(/*#__PURE__*/ (0,jsx_runtime.jsx)(error["default"], {
            statusCode: 404
        }));
    }
    var userCanEdit = user !== "loading" && (user === null || user === void 0 ? void 0 : user.shortname) === shortnameWithoutLeadingAt;
    var uri = entityType.schema.$id;
    return(/*#__PURE__*/ (0,jsx_runtime.jsxs)(jsx_runtime.Fragment, {
        children: [
            /*#__PURE__*/ (0,jsx_runtime.jsx)(head["default"], {
                children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("title", {
                    children: [
                        "Block Protocol - ",
                        shortname,
                        "/",
                        title,
                        " Schema"
                    ]
                })
            }),
            /*#__PURE__*/ (0,jsx_runtime.jsxs)(Container/* default */.Z, {
                sx: {
                    marginTop: {
                        xs: 4,
                        md: 8
                    },
                    marginBottom: {
                        xs: 4,
                        md: 8
                    }
                },
                children: [
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("header", {
                        className: (0,twind.tw)(_title_page_templateObject()),
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Link/* Link */.rU, {
                                href: "/".concat(shortname),
                                children: /*#__PURE__*/ (0,jsx_runtime.jsxs)("a", {
                                    children: [
                                        shortname,
                                        " >"
                                    ]
                                })
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsxs)("h1", {
                                children: [
                                    /*#__PURE__*/ (0,jsx_runtime.jsx)("strong", {
                                        children: title !== null && title !== void 0 ? title : "Unnamed"
                                    }),
                                    " Schema"
                                ]
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsxs)("section", {
                        children: [
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Typography/* default */.Z, {
                                variant: "bpBodyCopy",
                                sx: {
                                    mb: 2
                                },
                                children: "You can use this editor to build basic schemas, representing types of entities."
                            }),
                            /*#__PURE__*/ (0,jsx_runtime.jsx)(Typography/* default */.Z, {
                                variant: "bpBodyCopy",
                                sx: {
                                    mb: 2
                                },
                                children: "You can use these entity types as the expected value for a property in another schema."
                            })
                        ]
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)("main", {
                        className: (0,twind.tw)(_title_page_templateObject1()),
                        children: /*#__PURE__*/ (0,jsx_runtime.jsx)(SchemaEditor, {
                            aggregateEntityTypes: aggregateEntityTypes,
                            entityTypeId: entityType.entityTypeId,
                            schema: entityType.schema,
                            updateEntityTypes: userCanEdit ? updateEntityTypes : undefined
                        })
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                        sx: {
                            mb: 2
                        },
                        children: /*#__PURE__*/ (0,jsx_runtime.jsxs)(Typography/* default */.Z, {
                            variant: "bpSmallCopy",
                            sx: {
                                maxWidth: "100%"
                            },
                            children: [
                                "Link properties to schema.org or other equivalents — e.g.",
                                " ",
                                /*#__PURE__*/ (0,jsx_runtime.jsx)(Link/* Link */.rU, {
                                    href: "https://schema.org/givenName",
                                    children: "https://schema.org/givenName"
                                }),
                                " ",
                                "— to make them interpretable as RDF or JSON-LD."
                            ]
                        })
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                        sx: {
                            mb: 2
                        },
                        children: /*#__PURE__*/ (0,jsx_runtime.jsxs)(Typography/* default */.Z, {
                            variant: "bpSmallCopy",
                            sx: {
                                maxWidth: "100%"
                            },
                            children: [
                                "This schema will always be available at",
                                " ",
                                /*#__PURE__*/ (0,jsx_runtime.jsx)(Link/* Link */.rU, {
                                    href: uri,
                                    children: uri
                                }),
                                " - this is its ",
                                /*#__PURE__*/ (0,jsx_runtime.jsx)("strong", {
                                    children: "$id"
                                }),
                                "."
                            ]
                        })
                    }),
                    /*#__PURE__*/ (0,jsx_runtime.jsx)(Box/* default */.Z, {
                        sx: {
                            mb: 2
                        },
                        children: /*#__PURE__*/ (0,jsx_runtime.jsxs)(Typography/* default */.Z, {
                            variant: "bpSmallCopy",
                            children: [
                                "Looking for the raw JSON? Visit",
                                " ",
                                /*#__PURE__*/ (0,jsx_runtime.jsx)(Link/* Link */.rU, {
                                    href: "".concat(uri, "?json"),
                                    target: "_blank",
                                    children: "this link"
                                }),
                                " ",
                                "or request the $id with \"application/json\" in an \"Accept\" HTTP header."
                            ]
                        })
                    })
                ]
            })
        ]
    }));
};
/* harmony default export */ var _title_page = (EntityTypePage);


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, [80,774,888,179], function() { return __webpack_exec__(80); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);