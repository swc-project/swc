(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
    [
        405
    ],
    {
        8312: function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {
            (window.__NEXT_P = window.__NEXT_P || []).push([
                "/",
                function() {
                    return __webpack_require__(4186);
                }
            ]);
        },
        4186: function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {
            "use strict";
            __webpack_require__.r(__webpack_exports__);
            __webpack_require__.d(__webpack_exports__, {
                default: function() {
                    return Home;
                }
            });
            var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(5893), _tanstack_react_table__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(7060), _tanstack_react_table__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(4094), react__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7294);
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
            ], columnHelper = (0, _tanstack_react_table__WEBPACK_IMPORTED_MODULE_2__.Cl)(), columns = [
                columnHelper.accessor("firstName", {
                    cell: (info)=>info.getValue(),
                    footer: (info)=>info.column.id
                }),
                columnHelper.accessor((row)=>row.lastName, {
                    id: "lastName",
                    cell: (info)=>(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("i", {
                            children: info.getValue()
                        }),
                    header: ()=>(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
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
                    header: ()=>(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("span", {
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
                const [data, setData] = (0, react__WEBPACK_IMPORTED_MODULE_1__.useState)(()=>[
                        ...defaultData
                    ]), rerender = (0, react__WEBPACK_IMPORTED_MODULE_1__.useReducer)(()=>({}), {})[1], table = (0, _tanstack_react_table__WEBPACK_IMPORTED_MODULE_3__.b7)({
                    data,
                    columns,
                    getCoreRowModel: (0, _tanstack_react_table__WEBPACK_IMPORTED_MODULE_2__.sC)()
                });
                return (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("div", {
                    className: "p-2",
                    children: [
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("table", {
                            children: [
                                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("thead", {
                                    children: table.getHeaderGroups().map((headerGroup)=>(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("tr", {
                                            children: headerGroup.headers.map((header)=>(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("th", {
                                                    children: header.isPlaceholder ? null : (0, _tanstack_react_table__WEBPACK_IMPORTED_MODULE_3__.ie)(header.column.columnDef.header, header.getContext())
                                                }, header.id))
                                        }, headerGroup.id))
                                }),
                                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("tbody", {
                                    children: table.getRowModel().rows.map((row)=>(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("tr", {
                                            children: row.getVisibleCells().map((cell)=>(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("td", {
                                                    children: (0, _tanstack_react_table__WEBPACK_IMPORTED_MODULE_3__.ie)(cell.column.columnDef.cell, cell.getContext())
                                                }, cell.id))
                                        }, row.id))
                                }),
                                (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("tfoot", {
                                    children: table.getFooterGroups().map((footerGroup)=>(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("tr", {
                                            children: footerGroup.headers.map((header)=>(0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("th", {
                                                    children: header.isPlaceholder ? null : (0, _tanstack_react_table__WEBPACK_IMPORTED_MODULE_3__.ie)(header.column.columnDef.footer, header.getContext())
                                                }, header.id))
                                        }, footerGroup.id))
                                })
                            ]
                        }),
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
                            className: "h-4"
                        }),
                        (0, react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", {
                            onClick: ()=>rerender(),
                            className: "border p-2",
                            children: "Rerender"
                        })
                    ]
                });
            }
        }
    },
    function(__webpack_require__) {
        __webpack_require__.O(0, [
            94,
            774,
            888,
            179
        ], function() {
            return __webpack_require__(__webpack_require__.s = 8312);
        });
        var __webpack_exports__ = __webpack_require__.O();
        _N_E = __webpack_exports__;
    }
]);
