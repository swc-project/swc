(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[405],{

/***/ 8581:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


    (window.__NEXT_P = window.__NEXT_P || []).push([
      "/",
      function () {
        return __webpack_require__(4369);
      }
    ]);
    if(false) {}
  

/***/ }),

/***/ 4369:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7294);
/* harmony import */ var react_table__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(9521);
/* harmony import */ var react_table__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_table__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var namor__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(1134);
/* harmony import */ var namor__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(namor__WEBPACK_IMPORTED_MODULE_3__);
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

/* eslint-disable react/jsx-key */ 


function Table(param) {
    var columns = param.columns, data = param.data;
    // Use the state and functions returned from useTable to build your UI
    var ref = (0,react_table__WEBPACK_IMPORTED_MODULE_2__.useTable)({
        columns: columns,
        data: data
    }), getTableProps = ref.getTableProps, getTableBodyProps = ref.getTableBodyProps, headerGroups = ref.headerGroups, rows = ref.rows, prepareRow = ref.prepareRow;
    // Render the UI for your table
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("table", _objectSpread({}, getTableProps(), {
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("thead", {
                children: headerGroups.map(function(headerGroup) {
                    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("tr", _objectSpread({}, headerGroup.getHeaderGroupProps(), {
                        children: headerGroup.headers.map(function(column) {
                            return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("th", _objectSpread({}, column.getHeaderProps(), {
                                children: column.render("Header")
                            }));
                        })
                    }));
                })
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("tbody", _objectSpread({}, getTableBodyProps(), {
                children: rows.map(function(row, i) {
                    prepareRow(row);
                    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("tr", _objectSpread({}, row.getRowProps(), {
                        children: row.cells.map(function(cell) {
                            return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("td", _objectSpread({}, cell.getCellProps(), {
                                children: cell.render("Cell")
                            }));
                        })
                    }));
                })
            }))
        ]
    }));
}
function App() {
    var columns = react__WEBPACK_IMPORTED_MODULE_1__.useMemo(function() {
        return [
            {
                Header: "Name",
                columns: [
                    {
                        Header: "First Name",
                        accessor: "firstName"
                    },
                    {
                        Header: "Last Name",
                        accessor: "lastName"
                    }, 
                ]
            },
            {
                Header: "Info",
                columns: [
                    {
                        Header: "Age",
                        accessor: "age"
                    },
                    {
                        Header: "Visits",
                        accessor: "visits"
                    },
                    {
                        Header: "Status",
                        accessor: "status"
                    },
                    {
                        Header: "Profile Progress",
                        accessor: "progress"
                    }, 
                ]
            }, 
        ];
    }, []);
    var data = react__WEBPACK_IMPORTED_MODULE_1__.useMemo(function() {
        return makeData(20);
    }, []);
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)(Table, {
        columns: columns,
        data: data
    });
}
/* harmony default export */ __webpack_exports__["default"] = (App);
var range = function(len) {
    var arr = [];
    for(var i = 0; i < len; i++){
        arr.push(i);
    }
    return arr;
};
var newPerson = function() {
    var statusChance = Math.random();
    return {
        firstName: namor__WEBPACK_IMPORTED_MODULE_3___default().generate({
            words: 1,
            numbers: 0
        }),
        lastName: namor__WEBPACK_IMPORTED_MODULE_3___default().generate({
            words: 1,
            numbers: 0
        }),
        age: Math.floor(Math.random() * 30),
        visits: Math.floor(Math.random() * 100),
        progress: Math.floor(Math.random() * 100),
        status: statusChance > 0.66 ? "relationship" : statusChance > 0.33 ? "complicated" : "single"
    };
};
function makeData() {
    for(var _len = arguments.length, lens = new Array(_len), _key = 0; _key < _len; _key++){
        lens[_key] = arguments[_key];
    }
    var makeDataLevel = function() {
        var depth = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : 0;
        var len = lens[depth];
        return range(len).map(function(d) {
            return _objectSpread({}, newPerson(), {
                subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined
            });
        });
    };
    return makeDataLevel();
}


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, [774,714,185,888,179], function() { return __webpack_exec__(8581); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);