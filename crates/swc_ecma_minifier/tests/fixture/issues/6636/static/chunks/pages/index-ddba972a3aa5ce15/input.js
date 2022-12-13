(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([[405],{

/***/ 8312:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {


    (window.__NEXT_P = window.__NEXT_P || []).push([
      "/",
      function () {
        return __webpack_require__(4186);
      }
    ]);
    if(false) {}
  

/***/ }),

/***/ 4186:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": function() { return /* binding */ Home; }
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893);
/* harmony import */ var _tanstack_react_table__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7060);
/* harmony import */ var _tanstack_react_table__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4094);
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7294);



const defaultData = [
    {
        firstName: "tanner",
        lastName: "linsley",
        age: 24,
        visits: 100,
        status: "In Relationship",
        progress: 50
    },
    {
        firstName: "tandy",
        lastName: "miller",
        age: 40,
        visits: 40,
        status: "Single",
        progress: 80
    },
    {
        firstName: "joe",
        lastName: "dirte",
        age: 45,
        visits: 20,
        status: "Complicated",
        progress: 10
    }
];
const columnHelper = (0,_tanstack_react_table__WEBPACK_IMPORTED_MODULE_2__/* .createColumnHelper */ .Cl)();
const columns = [
    columnHelper.accessor("firstName", {
        cell: (info)=>info.getValue(),
        footer: (info)=>info.column.id
    }),
    columnHelper.accessor((row)=>row.lastName, {
        id: "lastName",
        cell: (info)=>/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("i", {
                children: info.getValue()
            }),
        header: ()=>/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
                children: "Last Name"
            }),
        footer: (info)=>info.column.id
    }),
    columnHelper.accessor("age", {
        header: ()=>"Age",
        cell: (info)=>info.renderValue(),
        footer: (info)=>info.column.id
    }),
    columnHelper.accessor("visits", {
        header: ()=>/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
                children: "Visits"
            }),
        footer: (info)=>info.column.id
    }),
    columnHelper.accessor("status", {
        header: "Status",
        footer: (info)=>info.column.id
    }),
    columnHelper.accessor("progress", {
        header: "Profile Progress",
        footer: (info)=>info.column.id
    })
];
function Home() {
    const [data, setData] = (0,react__WEBPACK_IMPORTED_MODULE_1__.useState)(()=>[
            ...defaultData
        ]);
    const rerender = (0,react__WEBPACK_IMPORTED_MODULE_1__.useReducer)(()=>({}), {})[1];
    const table = (0,_tanstack_react_table__WEBPACK_IMPORTED_MODULE_3__/* .useReactTable */ .b7)({
        data,
        columns,
        getCoreRowModel: (0,_tanstack_react_table__WEBPACK_IMPORTED_MODULE_2__/* .getCoreRowModel */ .sC)()
    });
    return /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
        className: "p-2",
        children: [
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("table", {
                children: [
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("thead", {
                        children: table.getHeaderGroups().map((headerGroup)=>/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("tr", {
                                children: headerGroup.headers.map((header)=>/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("th", {
                                        children: header.isPlaceholder ? null : (0,_tanstack_react_table__WEBPACK_IMPORTED_MODULE_3__/* .flexRender */ .ie)(header.column.columnDef.header, header.getContext())
                                    }, header.id))
                            }, headerGroup.id))
                    }),
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("tbody", {
                        children: table.getRowModel().rows.map((row)=>/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("tr", {
                                children: row.getVisibleCells().map((cell)=>/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("td", {
                                        children: (0,_tanstack_react_table__WEBPACK_IMPORTED_MODULE_3__/* .flexRender */ .ie)(cell.column.columnDef.cell, cell.getContext())
                                    }, cell.id))
                            }, row.id))
                    }),
                    /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("tfoot", {
                        children: table.getFooterGroups().map((footerGroup)=>/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("tr", {
                                children: footerGroup.headers.map((header)=>/*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("th", {
                                        children: header.isPlaceholder ? null : (0,_tanstack_react_table__WEBPACK_IMPORTED_MODULE_3__/* .flexRender */ .ie)(header.column.columnDef.footer, header.getContext())
                                    }, header.id))
                            }, footerGroup.id))
                    })
                ]
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
                className: "h-4"
            }),
            /*#__PURE__*/ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", {
                onClick: ()=>rerender(),
                className: "border p-2",
                children: "Rerender"
            })
        ]
    });
}


/***/ })

},
/******/ function(__webpack_require__) { // webpackRuntimeModules
/******/ var __webpack_exec__ = function(moduleId) { return __webpack_require__(__webpack_require__.s = moduleId); }
/******/ __webpack_require__.O(0, [94,774,888,179], function() { return __webpack_exec__(8312); });
/******/ var __webpack_exports__ = __webpack_require__.O();
/******/ _N_E = __webpack_exports__;
/******/ }
]);