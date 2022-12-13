"use strict";
(self.webpackChunk_N_E = self.webpackChunk_N_E || []).push([
    [
        94
    ],
    {
        4094: function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
            __webpack_require__.d(__webpack_exports__, {
                b7: function() {
                    return useReactTable;
                },
                ie: function() {
                    return flexRender;
                }
            });
            var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(7294), _tanstack_table_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(7060);
            function flexRender(Comp, props) {
                return Comp ? 'function' == typeof Comp && (()=>{
                    const proto = Object.getPrototypeOf(Comp);
                    return proto.prototype && proto.prototype.isReactComponent;
                })() || 'function' == typeof Comp || 'object' == typeof Comp && 'symbol' == typeof Comp.$$typeof && [
                    'react.memo',
                    'react.forward_ref'
                ].includes(Comp.$$typeof.description) ? react__WEBPACK_IMPORTED_MODULE_0__.createElement(Comp, props) : Comp : null;
            }
            function useReactTable(options) {
                const resolvedOptions = {
                    state: {},
                    onStateChange: ()=>{},
                    renderFallbackValue: null,
                    ...options
                }, [tableRef] = react__WEBPACK_IMPORTED_MODULE_0__.useState(()=>({
                        current: (0, _tanstack_table_core__WEBPACK_IMPORTED_MODULE_1__.W_)(resolvedOptions)
                    })), [state, setState] = react__WEBPACK_IMPORTED_MODULE_0__.useState(()=>tableRef.current.initialState);
                return tableRef.current.setOptions((prev)=>({
                        ...prev,
                        ...options,
                        state: {
                            ...state,
                            ...options.state
                        },
                        onStateChange: (updater)=>{
                            setState(updater), options.onStateChange?.(updater);
                        }
                    })), tableRef.current;
            }
        },
        7060: function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {
            function functionalUpdate(updater, input) {
                return 'function' == typeof updater ? updater(input) : updater;
            }
            function makeStateUpdater(key, instance) {
                return (updater)=>{
                    instance.setState((old)=>({
                            ...old,
                            [key]: functionalUpdate(updater, old[key])
                        }));
                };
            }
            function isFunction(d) {
                return d instanceof Function;
            }
            function memo(getDeps, fn, opts) {
                let result, deps = [];
                return ()=>{
                    let depTime, resultTime;
                    opts.key && opts.debug && (depTime = Date.now());
                    const newDeps = getDeps(), depsChanged = newDeps.length !== deps.length || newDeps.some((dep, index)=>deps[index] !== dep);
                    if (!depsChanged) return result;
                    if (deps = newDeps, opts.key && opts.debug && (resultTime = Date.now()), result = fn(...newDeps), opts?.onChange?.(result), opts.key && opts.debug && opts?.debug()) {
                        const depEndTime = Math.round((Date.now() - depTime) * 100) / 100, resultEndTime = Math.round((Date.now() - resultTime) * 100) / 100, pad = (str, num)=>{
                            for(str = String(str); str.length < num;)str = ' ' + str;
                            return str;
                        };
                        console.info(`%c⏱ ${pad(resultEndTime, 5)} /${pad(depEndTime, 5)} ms`, `
            font-size: .6rem;
            font-weight: bold;
            color: hsl(${Math.max(0, Math.min(120 - 120 * (resultEndTime / 16), 120))}deg 100% 31%);`, opts?.key);
                    }
                    return result;
                };
            }
            function createHeader(table, column, options) {
                var _options$id;
                const id = null != (_options$id = options.id) ? _options$id : column.id;
                let header = {
                    id,
                    column,
                    index: options.index,
                    isPlaceholder: !!options.isPlaceholder,
                    placeholderId: options.placeholderId,
                    depth: options.depth,
                    subHeaders: [],
                    colSpan: 0,
                    rowSpan: 0,
                    headerGroup: null,
                    getLeafHeaders: ()=>{
                        const leafHeaders = [], recurseHeader = (h)=>{
                            h.subHeaders && h.subHeaders.length && h.subHeaders.map(recurseHeader), leafHeaders.push(h);
                        };
                        return recurseHeader(header), leafHeaders;
                    },
                    getContext: ()=>({
                            table,
                            header: header,
                            column
                        })
                };
                return table._features.forEach((feature)=>{
                    Object.assign(header, feature.createHeader?.(header, table));
                }), header;
            }
            function buildHeaderGroups(allColumns, columnsToGroup, table, headerFamily) {
                var _headerGroups$0$heade;
                let maxDepth = 0;
                const findMaxDepth = function(columns, depth) {
                    void 0 === depth && (depth = 1), maxDepth = Math.max(maxDepth, depth), columns.filter((column)=>column.getIsVisible()).forEach((column)=>{
                        column.columns?.length && findMaxDepth(column.columns, depth + 1);
                    }, 0);
                };
                findMaxDepth(allColumns);
                let headerGroups = [];
                const createHeaderGroup = (headersToGroup, depth)=>{
                    const headerGroup = {
                        depth,
                        id: [
                            headerFamily,
                            `${depth}`
                        ].filter(Boolean).join('_'),
                        headers: []
                    }, pendingParentHeaders = [];
                    headersToGroup.forEach((headerToGroup)=>{
                        let column;
                        const latestPendingParentHeader = [
                            ...pendingParentHeaders
                        ].reverse()[0], isLeafHeader = headerToGroup.column.depth === headerGroup.depth;
                        let isPlaceholder = !1;
                        if (isLeafHeader && headerToGroup.column.parent ? column = headerToGroup.column.parent : (column = headerToGroup.column, isPlaceholder = !0), latestPendingParentHeader && latestPendingParentHeader?.column === column) latestPendingParentHeader.subHeaders.push(headerToGroup);
                        else {
                            const header = createHeader(table, column, {
                                id: [
                                    headerFamily,
                                    depth,
                                    column.id,
                                    headerToGroup?.id
                                ].filter(Boolean).join('_'),
                                isPlaceholder,
                                placeholderId: isPlaceholder ? `${pendingParentHeaders.filter((d)=>d.column === column).length}` : void 0,
                                depth,
                                index: pendingParentHeaders.length
                            });
                            header.subHeaders.push(headerToGroup), pendingParentHeaders.push(header);
                        }
                        headerGroup.headers.push(headerToGroup), headerToGroup.headerGroup = headerGroup;
                    }), headerGroups.push(headerGroup), depth > 0 && createHeaderGroup(pendingParentHeaders, depth - 1);
                }, bottomHeaders = columnsToGroup.map((column, index)=>createHeader(table, column, {
                        depth: maxDepth,
                        index
                    }));
                createHeaderGroup(bottomHeaders, maxDepth - 1), headerGroups.reverse();
                const recurseHeadersForSpans = (headers)=>{
                    const filteredHeaders = headers.filter((header)=>header.column.getIsVisible());
                    return filteredHeaders.map((header)=>{
                        let colSpan = 0, rowSpan = 0, childRowSpans = [
                            0
                        ];
                        header.subHeaders && header.subHeaders.length ? (childRowSpans = [], recurseHeadersForSpans(header.subHeaders).forEach((_ref)=>{
                            let { colSpan: childColSpan , rowSpan: childRowSpan  } = _ref;
                            colSpan += childColSpan, childRowSpans.push(childRowSpan);
                        })) : colSpan = 1;
                        const minChildRowSpan = Math.min(...childRowSpans);
                        return rowSpan += minChildRowSpan, header.colSpan = colSpan, header.rowSpan = rowSpan, {
                            colSpan,
                            rowSpan
                        };
                    });
                };
                return recurseHeadersForSpans(null != (_headerGroups$0$heade = headerGroups[0]?.headers) ? _headerGroups$0$heade : []), headerGroups;
            }
            __webpack_require__.d(__webpack_exports__, {
                Cl: function() {
                    return createColumnHelper;
                },
                W_: function() {
                    return createTable;
                },
                sC: function() {
                    return getCoreRowModel;
                }
            });
            const defaultColumnSizing = {
                size: 150,
                minSize: 20,
                maxSize: Number.MAX_SAFE_INTEGER
            }, getDefaultColumnSizingInfoState = ()=>({
                    startOffset: null,
                    startSize: null,
                    deltaOffset: null,
                    deltaPercentage: null,
                    isResizingColumn: !1,
                    columnSizingStart: []
                });
            let passiveSupported = null;
            function isTouchStartEvent(e) {
                return 'touchstart' === e.type;
            }
            const includesString = (row, columnId, filterValue)=>{
                const search = filterValue.toLowerCase();
                return Boolean(row.getValue(columnId)?.toLowerCase().includes(search));
            };
            includesString.autoRemove = (val)=>testFalsey(val);
            const includesStringSensitive = (row, columnId, filterValue)=>Boolean(row.getValue(columnId)?.includes(filterValue));
            includesStringSensitive.autoRemove = (val)=>testFalsey(val);
            const equalsString = (row, columnId, filterValue)=>row.getValue(columnId)?.toLowerCase() === filterValue.toLowerCase();
            equalsString.autoRemove = (val)=>testFalsey(val);
            const arrIncludes = (row, columnId, filterValue)=>row.getValue(columnId)?.includes(filterValue);
            arrIncludes.autoRemove = (val)=>testFalsey(val) || !val?.length;
            const arrIncludesAll = (row, columnId, filterValue)=>!filterValue.some((val)=>!row.getValue(columnId)?.includes(val));
            arrIncludesAll.autoRemove = (val)=>testFalsey(val) || !val?.length;
            const arrIncludesSome = (row, columnId, filterValue)=>filterValue.some((val)=>row.getValue(columnId)?.includes(val));
            arrIncludesSome.autoRemove = (val)=>testFalsey(val) || !val?.length;
            const equals = (row, columnId, filterValue)=>row.getValue(columnId) === filterValue;
            equals.autoRemove = (val)=>testFalsey(val);
            const weakEquals = (row, columnId, filterValue)=>row.getValue(columnId) == filterValue;
            weakEquals.autoRemove = (val)=>testFalsey(val);
            const inNumberRange = (row, columnId, filterValue)=>{
                let [min, max] = filterValue;
                const rowValue = row.getValue(columnId);
                return rowValue >= min && rowValue <= max;
            };
            inNumberRange.resolveFilterValue = (val)=>{
                let [unsafeMin, unsafeMax] = val, parsedMin = 'number' != typeof unsafeMin ? parseFloat(unsafeMin) : unsafeMin, parsedMax = 'number' != typeof unsafeMax ? parseFloat(unsafeMax) : unsafeMax, min = null === unsafeMin || Number.isNaN(parsedMin) ? -1 / 0 : parsedMin, max = null === unsafeMax || Number.isNaN(parsedMax) ? 1 / 0 : parsedMax;
                if (min > max) {
                    const temp = min;
                    min = max, max = temp;
                }
                return [
                    min,
                    max
                ];
            }, inNumberRange.autoRemove = (val)=>testFalsey(val) || testFalsey(val[0]) && testFalsey(val[1]);
            const filterFns = {
                includesString,
                includesStringSensitive,
                equalsString,
                arrIncludes,
                arrIncludesAll,
                arrIncludesSome,
                equals,
                weakEquals,
                inNumberRange
            };
            function testFalsey(val) {
                return null == val || '' === val;
            }
            function shouldAutoRemoveFilter(filterFn, value, column) {
                return !!filterFn && !!filterFn.autoRemove && filterFn.autoRemove(value, column) || void 0 === value || 'string' == typeof value && !value;
            }
            const sum = (columnId, _leafRows, childRows)=>childRows.reduce((sum, next)=>{
                    const nextValue = next.getValue(columnId);
                    return sum + ('number' == typeof nextValue ? nextValue : 0);
                }, 0), min = (columnId, _leafRows, childRows)=>{
                let min;
                return childRows.forEach((row)=>{
                    const value = row.getValue(columnId);
                    null != value && (min > value || void 0 === min && value >= value) && (min = value);
                }), min;
            }, max = (columnId, _leafRows, childRows)=>{
                let max;
                return childRows.forEach((row)=>{
                    const value = row.getValue(columnId);
                    null != value && (max < value || void 0 === max && value >= value) && (max = value);
                }), max;
            }, extent = (columnId, _leafRows, childRows)=>{
                let min, max;
                return childRows.forEach((row)=>{
                    const value = row.getValue(columnId);
                    null != value && (void 0 === min ? value >= value && (min = max = value) : (min > value && (min = value), max < value && (max = value)));
                }), [
                    min,
                    max
                ];
            }, mean = (columnId, leafRows)=>{
                let count = 0, sum = 0;
                if (leafRows.forEach((row)=>{
                    let value = row.getValue(columnId);
                    null != value && (value = +value) >= value && (++count, sum += value);
                }), count) return sum / count;
            }, median = (columnId, leafRows)=>{
                if (!leafRows.length) return;
                let min = 0, max = 0;
                return leafRows.forEach((row)=>{
                    let value = row.getValue(columnId);
                    'number' == typeof value && (min = Math.min(min, value), max = Math.max(max, value));
                }), (min + max) / 2;
            }, unique = (columnId, leafRows)=>Array.from(new Set(leafRows.map((d)=>d.getValue(columnId))).values()), aggregationFns = {
                sum,
                min,
                max,
                extent,
                mean,
                median,
                unique,
                uniqueCount: (columnId, leafRows)=>new Set(leafRows.map((d)=>d.getValue(columnId))).size,
                count: (_columnId, leafRows)=>leafRows.length
            }, getDefaultPaginationState = ()=>({
                    pageIndex: 0,
                    pageSize: 10
                }), getDefaultPinningState = ()=>({
                    left: [],
                    right: []
                }), mutateRowIsSelected = (selectedRowIds, id, value, table)=>{
                const row = table.getRow(id);
                value ? (row.getCanMultiSelect() || Object.keys(selectedRowIds).forEach((key)=>delete selectedRowIds[key]), row.getCanSelect() && (selectedRowIds[id] = !0)) : delete selectedRowIds[id], row.subRows?.length && row.getCanSelectSubRows() && row.subRows.forEach((row)=>mutateRowIsSelected(selectedRowIds, row.id, value, table));
            };
            function selectRowsFn(table, rowModel) {
                const rowSelection = table.getState().rowSelection, newSelectedFlatRows = [], newSelectedRowsById = {}, recurseRows = function(rows, depth) {
                    return rows.map((row)=>{
                        const isSelected = isRowSelected(row, rowSelection);
                        if (isSelected && (newSelectedFlatRows.push(row), newSelectedRowsById[row.id] = row), row.subRows?.length && (row = {
                            ...row,
                            subRows: recurseRows(row.subRows)
                        }), isSelected) return row;
                    }).filter(Boolean);
                };
                return {
                    rows: recurseRows(rowModel.rows),
                    flatRows: newSelectedFlatRows,
                    rowsById: newSelectedRowsById
                };
            }
            function isRowSelected(row, selection) {
                var _selection$row$id;
                return null != (_selection$row$id = selection[row.id]) && _selection$row$id;
            }
            function isSubRowSelected(row, selection, table) {
                if (row.subRows && row.subRows.length) {
                    let allChildrenSelected = !0, someSelected = !1;
                    return row.subRows.forEach((subRow)=>{
                        (!someSelected || allChildrenSelected) && (isRowSelected(subRow, selection) ? someSelected = !0 : allChildrenSelected = !1);
                    }), allChildrenSelected ? 'all' : !!someSelected && 'some';
                }
                return !1;
            }
            const reSplitAlphaNumeric = /([0-9]+)/gm, alphanumeric = (rowA, rowB, columnId)=>compareAlphanumeric(toString(rowA.getValue(columnId)).toLowerCase(), toString(rowB.getValue(columnId)).toLowerCase()), alphanumericCaseSensitive = (rowA, rowB, columnId)=>compareAlphanumeric(toString(rowA.getValue(columnId)), toString(rowB.getValue(columnId))), text = (rowA, rowB, columnId)=>compareBasic(toString(rowA.getValue(columnId)).toLowerCase(), toString(rowB.getValue(columnId)).toLowerCase()), textCaseSensitive = (rowA, rowB, columnId)=>compareBasic(toString(rowA.getValue(columnId)), toString(rowB.getValue(columnId))), datetime = (rowA, rowB, columnId)=>{
                const a = rowA.getValue(columnId), b = rowB.getValue(columnId);
                return a > b ? 1 : a < b ? -1 : 0;
            }, basic = (rowA, rowB, columnId)=>compareBasic(rowA.getValue(columnId), rowB.getValue(columnId));
            function compareBasic(a, b) {
                return a === b ? 0 : a > b ? 1 : -1;
            }
            function toString(a) {
                return 'number' == typeof a ? isNaN(a) || a === 1 / 0 || a === -1 / 0 ? '' : String(a) : 'string' == typeof a ? a : '';
            }
            function compareAlphanumeric(aStr, bStr) {
                const a = aStr.split(reSplitAlphaNumeric).filter(Boolean), b = bStr.split(reSplitAlphaNumeric).filter(Boolean);
                for(; a.length && b.length;){
                    const aa = a.shift(), bb = b.shift(), an = parseInt(aa, 10), bn = parseInt(bb, 10), combo = [
                        an,
                        bn
                    ].sort();
                    if (isNaN(combo[0])) {
                        if (aa > bb) return 1;
                        if (bb > aa) return -1;
                        continue;
                    }
                    if (isNaN(combo[1])) return isNaN(an) ? -1 : 1;
                    if (an > bn) return 1;
                    if (bn > an) return -1;
                }
                return a.length - b.length;
            }
            const sortingFns = {
                alphanumeric,
                alphanumericCaseSensitive,
                text,
                textCaseSensitive,
                datetime,
                basic
            }, features = [
                {
                    createTable: (table)=>({
                            getHeaderGroups: memo(()=>[
                                    table.getAllColumns(),
                                    table.getVisibleLeafColumns(),
                                    table.getState().columnPinning.left,
                                    table.getState().columnPinning.right
                                ], (allColumns, leafColumns, left, right)=>{
                                var _left$map$filter, _right$map$filter;
                                const leftColumns = null != (_left$map$filter = left?.map((columnId)=>leafColumns.find((d)=>d.id === columnId)).filter(Boolean)) ? _left$map$filter : [], rightColumns = null != (_right$map$filter = right?.map((columnId)=>leafColumns.find((d)=>d.id === columnId)).filter(Boolean)) ? _right$map$filter : [], centerColumns = leafColumns.filter((column)=>!left?.includes(column.id) && !right?.includes(column.id)), headerGroups = buildHeaderGroups(allColumns, [
                                    ...leftColumns,
                                    ...centerColumns,
                                    ...rightColumns
                                ], table);
                                return headerGroups;
                            }, {
                                key: !1,
                                debug: ()=>{
                                    var _table$options$debugA;
                                    return null != (_table$options$debugA = table.options.debugAll) ? _table$options$debugA : table.options.debugHeaders;
                                }
                            }),
                            getCenterHeaderGroups: memo(()=>[
                                    table.getAllColumns(),
                                    table.getVisibleLeafColumns(),
                                    table.getState().columnPinning.left,
                                    table.getState().columnPinning.right
                                ], (allColumns, leafColumns, left, right)=>(leafColumns = leafColumns.filter((column)=>!left?.includes(column.id) && !right?.includes(column.id)), buildHeaderGroups(allColumns, leafColumns, table, 'center')), {
                                key: !1,
                                debug: ()=>{
                                    var _table$options$debugA2;
                                    return null != (_table$options$debugA2 = table.options.debugAll) ? _table$options$debugA2 : table.options.debugHeaders;
                                }
                            }),
                            getLeftHeaderGroups: memo(()=>[
                                    table.getAllColumns(),
                                    table.getVisibleLeafColumns(),
                                    table.getState().columnPinning.left
                                ], (allColumns, leafColumns, left)=>{
                                var _left$map$filter2;
                                const orderedLeafColumns = null != (_left$map$filter2 = left?.map((columnId)=>leafColumns.find((d)=>d.id === columnId)).filter(Boolean)) ? _left$map$filter2 : [];
                                return buildHeaderGroups(allColumns, orderedLeafColumns, table, 'left');
                            }, {
                                key: !1,
                                debug: ()=>{
                                    var _table$options$debugA3;
                                    return null != (_table$options$debugA3 = table.options.debugAll) ? _table$options$debugA3 : table.options.debugHeaders;
                                }
                            }),
                            getRightHeaderGroups: memo(()=>[
                                    table.getAllColumns(),
                                    table.getVisibleLeafColumns(),
                                    table.getState().columnPinning.right
                                ], (allColumns, leafColumns, right)=>{
                                var _right$map$filter2;
                                const orderedLeafColumns = null != (_right$map$filter2 = right?.map((columnId)=>leafColumns.find((d)=>d.id === columnId)).filter(Boolean)) ? _right$map$filter2 : [];
                                return buildHeaderGroups(allColumns, orderedLeafColumns, table, 'right');
                            }, {
                                key: !1,
                                debug: ()=>{
                                    var _table$options$debugA4;
                                    return null != (_table$options$debugA4 = table.options.debugAll) ? _table$options$debugA4 : table.options.debugHeaders;
                                }
                            }),
                            getFooterGroups: memo(()=>[
                                    table.getHeaderGroups()
                                ], (headerGroups)=>[
                                    ...headerGroups
                                ].reverse(), {
                                key: !1,
                                debug: ()=>{
                                    var _table$options$debugA5;
                                    return null != (_table$options$debugA5 = table.options.debugAll) ? _table$options$debugA5 : table.options.debugHeaders;
                                }
                            }),
                            getLeftFooterGroups: memo(()=>[
                                    table.getLeftHeaderGroups()
                                ], (headerGroups)=>[
                                    ...headerGroups
                                ].reverse(), {
                                key: !1,
                                debug: ()=>{
                                    var _table$options$debugA6;
                                    return null != (_table$options$debugA6 = table.options.debugAll) ? _table$options$debugA6 : table.options.debugHeaders;
                                }
                            }),
                            getCenterFooterGroups: memo(()=>[
                                    table.getCenterHeaderGroups()
                                ], (headerGroups)=>[
                                    ...headerGroups
                                ].reverse(), {
                                key: !1,
                                debug: ()=>{
                                    var _table$options$debugA7;
                                    return null != (_table$options$debugA7 = table.options.debugAll) ? _table$options$debugA7 : table.options.debugHeaders;
                                }
                            }),
                            getRightFooterGroups: memo(()=>[
                                    table.getRightHeaderGroups()
                                ], (headerGroups)=>[
                                    ...headerGroups
                                ].reverse(), {
                                key: !1,
                                debug: ()=>{
                                    var _table$options$debugA8;
                                    return null != (_table$options$debugA8 = table.options.debugAll) ? _table$options$debugA8 : table.options.debugHeaders;
                                }
                            }),
                            getFlatHeaders: memo(()=>[
                                    table.getHeaderGroups()
                                ], (headerGroups)=>headerGroups.map((headerGroup)=>headerGroup.headers).flat(), {
                                key: !1,
                                debug: ()=>{
                                    var _table$options$debugA9;
                                    return null != (_table$options$debugA9 = table.options.debugAll) ? _table$options$debugA9 : table.options.debugHeaders;
                                }
                            }),
                            getLeftFlatHeaders: memo(()=>[
                                    table.getLeftHeaderGroups()
                                ], (left)=>left.map((headerGroup)=>headerGroup.headers).flat(), {
                                key: !1,
                                debug: ()=>{
                                    var _table$options$debugA10;
                                    return null != (_table$options$debugA10 = table.options.debugAll) ? _table$options$debugA10 : table.options.debugHeaders;
                                }
                            }),
                            getCenterFlatHeaders: memo(()=>[
                                    table.getCenterHeaderGroups()
                                ], (left)=>left.map((headerGroup)=>headerGroup.headers).flat(), {
                                key: !1,
                                debug: ()=>{
                                    var _table$options$debugA11;
                                    return null != (_table$options$debugA11 = table.options.debugAll) ? _table$options$debugA11 : table.options.debugHeaders;
                                }
                            }),
                            getRightFlatHeaders: memo(()=>[
                                    table.getRightHeaderGroups()
                                ], (left)=>left.map((headerGroup)=>headerGroup.headers).flat(), {
                                key: !1,
                                debug: ()=>{
                                    var _table$options$debugA12;
                                    return null != (_table$options$debugA12 = table.options.debugAll) ? _table$options$debugA12 : table.options.debugHeaders;
                                }
                            }),
                            getCenterLeafHeaders: memo(()=>[
                                    table.getCenterFlatHeaders()
                                ], (flatHeaders)=>flatHeaders.filter((header)=>!header.subHeaders?.length), {
                                key: !1,
                                debug: ()=>{
                                    var _table$options$debugA13;
                                    return null != (_table$options$debugA13 = table.options.debugAll) ? _table$options$debugA13 : table.options.debugHeaders;
                                }
                            }),
                            getLeftLeafHeaders: memo(()=>[
                                    table.getLeftFlatHeaders()
                                ], (flatHeaders)=>flatHeaders.filter((header)=>!header.subHeaders?.length), {
                                key: !1,
                                debug: ()=>{
                                    var _table$options$debugA14;
                                    return null != (_table$options$debugA14 = table.options.debugAll) ? _table$options$debugA14 : table.options.debugHeaders;
                                }
                            }),
                            getRightLeafHeaders: memo(()=>[
                                    table.getRightFlatHeaders()
                                ], (flatHeaders)=>flatHeaders.filter((header)=>!header.subHeaders?.length), {
                                key: !1,
                                debug: ()=>{
                                    var _table$options$debugA15;
                                    return null != (_table$options$debugA15 = table.options.debugAll) ? _table$options$debugA15 : table.options.debugHeaders;
                                }
                            }),
                            getLeafHeaders: memo(()=>[
                                    table.getLeftHeaderGroups(),
                                    table.getCenterHeaderGroups(),
                                    table.getRightHeaderGroups()
                                ], (left, center, right)=>{
                                var _left$0$headers, _center$0$headers, _right$0$headers;
                                return [
                                    ...null != (_left$0$headers = left[0]?.headers) ? _left$0$headers : [],
                                    ...null != (_center$0$headers = center[0]?.headers) ? _center$0$headers : [],
                                    ...null != (_right$0$headers = right[0]?.headers) ? _right$0$headers : []
                                ].map((header)=>header.getLeafHeaders()).flat();
                            }, {
                                key: !1,
                                debug: ()=>{
                                    var _table$options$debugA16;
                                    return null != (_table$options$debugA16 = table.options.debugAll) ? _table$options$debugA16 : table.options.debugHeaders;
                                }
                            })
                        })
                },
                {
                    getInitialState: (state)=>({
                            columnVisibility: {},
                            ...state
                        }),
                    getDefaultOptions: (table)=>({
                            onColumnVisibilityChange: makeStateUpdater('columnVisibility', table)
                        }),
                    createColumn: (column, table)=>({
                            toggleVisibility: (value)=>{
                                column.getCanHide() && table.setColumnVisibility((old)=>({
                                        ...old,
                                        [column.id]: null != value ? value : !column.getIsVisible()
                                    }));
                            },
                            getIsVisible: ()=>{
                                var _table$getState$colum;
                                return null == (_table$getState$colum = table.getState().columnVisibility?.[column.id]) || _table$getState$colum;
                            },
                            getCanHide: ()=>{
                                var _column$columnDef$ena, _table$options$enable;
                                return (null == (_column$columnDef$ena = column.columnDef.enableHiding) || _column$columnDef$ena) && (null == (_table$options$enable = table.options.enableHiding) || _table$options$enable);
                            },
                            getToggleVisibilityHandler: ()=>(e)=>{
                                    column.toggleVisibility?.(e.target.checked);
                                }
                        }),
                    createRow: (row, table)=>({
                            _getAllVisibleCells: memo(()=>[
                                    row.getAllCells(),
                                    table.getState().columnVisibility
                                ], (cells)=>cells.filter((cell)=>cell.column.getIsVisible()), {
                                key: 'row._getAllVisibleCells',
                                debug: ()=>{
                                    var _table$options$debugA;
                                    return null != (_table$options$debugA = table.options.debugAll) ? _table$options$debugA : table.options.debugRows;
                                }
                            }),
                            getVisibleCells: memo(()=>[
                                    row.getLeftVisibleCells(),
                                    row.getCenterVisibleCells(),
                                    row.getRightVisibleCells()
                                ], (left, center, right)=>[
                                    ...left,
                                    ...center,
                                    ...right
                                ], {
                                key: !1,
                                debug: ()=>{
                                    var _table$options$debugA2;
                                    return null != (_table$options$debugA2 = table.options.debugAll) ? _table$options$debugA2 : table.options.debugRows;
                                }
                            })
                        }),
                    createTable: (table)=>{
                        const makeVisibleColumnsMethod = (key, getColumns)=>memo(()=>[
                                    getColumns(),
                                    getColumns().filter((d)=>d.getIsVisible()).map((d)=>d.id).join('_')
                                ], (columns)=>columns.filter((d)=>d.getIsVisible?.()), {
                                key,
                                debug: ()=>{
                                    var _table$options$debugA3;
                                    return null != (_table$options$debugA3 = table.options.debugAll) ? _table$options$debugA3 : table.options.debugColumns;
                                }
                            });
                        return {
                            getVisibleFlatColumns: makeVisibleColumnsMethod('getVisibleFlatColumns', ()=>table.getAllFlatColumns()),
                            getVisibleLeafColumns: makeVisibleColumnsMethod('getVisibleLeafColumns', ()=>table.getAllLeafColumns()),
                            getLeftVisibleLeafColumns: makeVisibleColumnsMethod('getLeftVisibleLeafColumns', ()=>table.getLeftLeafColumns()),
                            getRightVisibleLeafColumns: makeVisibleColumnsMethod('getRightVisibleLeafColumns', ()=>table.getRightLeafColumns()),
                            getCenterVisibleLeafColumns: makeVisibleColumnsMethod('getCenterVisibleLeafColumns', ()=>table.getCenterLeafColumns()),
                            setColumnVisibility: (updater)=>table.options.onColumnVisibilityChange?.(updater),
                            resetColumnVisibility: (defaultState)=>{
                                var _table$initialState$c;
                                table.setColumnVisibility(defaultState ? {} : null != (_table$initialState$c = table.initialState.columnVisibility) ? _table$initialState$c : {});
                            },
                            toggleAllColumnsVisible: (value)=>{
                                var _value;
                                value = null != (_value = value) ? _value : !table.getIsAllColumnsVisible(), table.setColumnVisibility(table.getAllLeafColumns().reduce((obj, column)=>({
                                        ...obj,
                                        [column.id]: value || !column.getCanHide?.()
                                    }), {}));
                            },
                            getIsAllColumnsVisible: ()=>!table.getAllLeafColumns().some((column)=>!column.getIsVisible?.()),
                            getIsSomeColumnsVisible: ()=>table.getAllLeafColumns().some((column)=>column.getIsVisible?.()),
                            getToggleAllColumnsVisibilityHandler: ()=>(e)=>{
                                    table.toggleAllColumnsVisible(e.target?.checked);
                                }
                        };
                    }
                },
                {
                    getInitialState: (state)=>({
                            columnOrder: [],
                            ...state
                        }),
                    getDefaultOptions: (table)=>({
                            onColumnOrderChange: makeStateUpdater('columnOrder', table)
                        }),
                    createTable: (table)=>({
                            setColumnOrder: (updater)=>table.options.onColumnOrderChange?.(updater),
                            resetColumnOrder: (defaultState)=>{
                                var _table$initialState$c;
                                table.setColumnOrder(defaultState ? [] : null != (_table$initialState$c = table.initialState.columnOrder) ? _table$initialState$c : []);
                            },
                            _getOrderColumnsFn: memo(()=>[
                                    table.getState().columnOrder,
                                    table.getState().grouping,
                                    table.options.groupedColumnMode
                                ], (columnOrder, grouping, groupedColumnMode)=>(columns)=>{
                                    let orderedColumns = [];
                                    if (columnOrder?.length) {
                                        const columnOrderCopy = [
                                            ...columnOrder
                                        ], columnsCopy = [
                                            ...columns
                                        ];
                                        for(; columnsCopy.length && columnOrderCopy.length;){
                                            const targetColumnId = columnOrderCopy.shift(), foundIndex = columnsCopy.findIndex((d)=>d.id === targetColumnId);
                                            foundIndex > -1 && orderedColumns.push(columnsCopy.splice(foundIndex, 1)[0]);
                                        }
                                        orderedColumns = [
                                            ...orderedColumns,
                                            ...columnsCopy
                                        ];
                                    } else orderedColumns = columns;
                                    return function(leafColumns, grouping, groupedColumnMode) {
                                        if (!grouping?.length || !groupedColumnMode) return leafColumns;
                                        const nonGroupingColumns = leafColumns.filter((col)=>!grouping.includes(col.id));
                                        if ('remove' === groupedColumnMode) return nonGroupingColumns;
                                        const groupingColumns = grouping.map((g)=>leafColumns.find((col)=>col.id === g)).filter(Boolean);
                                        return [
                                            ...groupingColumns,
                                            ...nonGroupingColumns
                                        ];
                                    }(orderedColumns, grouping, groupedColumnMode);
                                }, {
                                key: !1
                            })
                        })
                },
                {
                    getInitialState: (state)=>({
                            columnPinning: getDefaultPinningState(),
                            ...state
                        }),
                    getDefaultOptions: (table)=>({
                            onColumnPinningChange: makeStateUpdater('columnPinning', table)
                        }),
                    createColumn: (column, table)=>({
                            pin: (position)=>{
                                const columnIds = column.getLeafColumns().map((d)=>d.id).filter(Boolean);
                                table.setColumnPinning((old)=>{
                                    var _old$left3, _old$right3, _old$left, _old$right, _old$left2, _old$right2;
                                    return 'right' === position ? {
                                        left: (null != (_old$left = old?.left) ? _old$left : []).filter((d)=>!columnIds?.includes(d)),
                                        right: [
                                            ...(null != (_old$right = old?.right) ? _old$right : []).filter((d)=>!columnIds?.includes(d)),
                                            ...columnIds
                                        ]
                                    } : 'left' === position ? {
                                        left: [
                                            ...(null != (_old$left2 = old?.left) ? _old$left2 : []).filter((d)=>!columnIds?.includes(d)),
                                            ...columnIds
                                        ],
                                        right: (null != (_old$right2 = old?.right) ? _old$right2 : []).filter((d)=>!columnIds?.includes(d))
                                    } : {
                                        left: (null != (_old$left3 = old?.left) ? _old$left3 : []).filter((d)=>!columnIds?.includes(d)),
                                        right: (null != (_old$right3 = old?.right) ? _old$right3 : []).filter((d)=>!columnIds?.includes(d))
                                    };
                                });
                            },
                            getCanPin: ()=>{
                                const leafColumns = column.getLeafColumns();
                                return leafColumns.some((d)=>{
                                    var _d$columnDef$enablePi, _table$options$enable;
                                    return (null == (_d$columnDef$enablePi = d.columnDef.enablePinning) || _d$columnDef$enablePi) && (null == (_table$options$enable = table.options.enablePinning) || _table$options$enable);
                                });
                            },
                            getIsPinned: ()=>{
                                const leafColumnIds = column.getLeafColumns().map((d)=>d.id), { left , right  } = table.getState().columnPinning, isLeft = leafColumnIds.some((d)=>left?.includes(d)), isRight = leafColumnIds.some((d)=>right?.includes(d));
                                return isLeft ? 'left' : !!isRight && 'right';
                            },
                            getPinnedIndex: ()=>{
                                var _table$getState$colum;
                                const position = column.getIsPinned();
                                return position ? null != (_table$getState$colum = table.getState().columnPinning?.[position]?.indexOf(column.id)) ? _table$getState$colum : -1 : 0;
                            }
                        }),
                    createRow: (row, table)=>({
                            getCenterVisibleCells: memo(()=>[
                                    row._getAllVisibleCells(),
                                    table.getState().columnPinning.left,
                                    table.getState().columnPinning.right
                                ], (allCells, left, right)=>{
                                const leftAndRight = [
                                    ...null != left ? left : [],
                                    ...null != right ? right : []
                                ];
                                return allCells.filter((d)=>!leftAndRight.includes(d.column.id));
                            }, {
                                key: 'row.getCenterVisibleCells',
                                debug: ()=>{
                                    var _table$options$debugA;
                                    return null != (_table$options$debugA = table.options.debugAll) ? _table$options$debugA : table.options.debugRows;
                                }
                            }),
                            getLeftVisibleCells: memo(()=>[
                                    row._getAllVisibleCells(),
                                    table.getState().columnPinning.left,
                                    , 
                                ], (allCells, left)=>{
                                const cells = (null != left ? left : []).map((columnId)=>allCells.find((cell)=>cell.column.id === columnId)).filter(Boolean).map((d)=>({
                                        ...d,
                                        position: 'left'
                                    }));
                                return cells;
                            }, {
                                key: 'row.getLeftVisibleCells',
                                debug: ()=>{
                                    var _table$options$debugA2;
                                    return null != (_table$options$debugA2 = table.options.debugAll) ? _table$options$debugA2 : table.options.debugRows;
                                }
                            }),
                            getRightVisibleCells: memo(()=>[
                                    row._getAllVisibleCells(),
                                    table.getState().columnPinning.right
                                ], (allCells, right)=>{
                                const cells = (null != right ? right : []).map((columnId)=>allCells.find((cell)=>cell.column.id === columnId)).filter(Boolean).map((d)=>({
                                        ...d,
                                        position: 'right'
                                    }));
                                return cells;
                            }, {
                                key: 'row.getRightVisibleCells',
                                debug: ()=>{
                                    var _table$options$debugA3;
                                    return null != (_table$options$debugA3 = table.options.debugAll) ? _table$options$debugA3 : table.options.debugRows;
                                }
                            })
                        }),
                    createTable: (table)=>({
                            setColumnPinning: (updater)=>table.options.onColumnPinningChange?.(updater),
                            resetColumnPinning: (defaultState)=>{
                                var _table$initialState$c;
                                return table.setColumnPinning(defaultState ? getDefaultPinningState() : null != (_table$initialState$c = table.initialState?.columnPinning) ? _table$initialState$c : getDefaultPinningState());
                            },
                            getIsSomeColumnsPinned: (position)=>{
                                const pinningState = table.getState().columnPinning;
                                return position ? Boolean(pinningState[position]?.length) : Boolean(pinningState.left?.length || pinningState.right?.length);
                            },
                            getLeftLeafColumns: memo(()=>[
                                    table.getAllLeafColumns(),
                                    table.getState().columnPinning.left
                                ], (allColumns, left)=>(null != left ? left : []).map((columnId)=>allColumns.find((column)=>column.id === columnId)).filter(Boolean), {
                                key: !1,
                                debug: ()=>{
                                    var _table$options$debugA4;
                                    return null != (_table$options$debugA4 = table.options.debugAll) ? _table$options$debugA4 : table.options.debugColumns;
                                }
                            }),
                            getRightLeafColumns: memo(()=>[
                                    table.getAllLeafColumns(),
                                    table.getState().columnPinning.right
                                ], (allColumns, right)=>(null != right ? right : []).map((columnId)=>allColumns.find((column)=>column.id === columnId)).filter(Boolean), {
                                key: !1,
                                debug: ()=>{
                                    var _table$options$debugA5;
                                    return null != (_table$options$debugA5 = table.options.debugAll) ? _table$options$debugA5 : table.options.debugColumns;
                                }
                            }),
                            getCenterLeafColumns: memo(()=>[
                                    table.getAllLeafColumns(),
                                    table.getState().columnPinning.left,
                                    table.getState().columnPinning.right
                                ], (allColumns, left, right)=>{
                                const leftAndRight = [
                                    ...null != left ? left : [],
                                    ...null != right ? right : []
                                ];
                                return allColumns.filter((d)=>!leftAndRight.includes(d.id));
                            }, {
                                key: !1,
                                debug: ()=>{
                                    var _table$options$debugA6;
                                    return null != (_table$options$debugA6 = table.options.debugAll) ? _table$options$debugA6 : table.options.debugColumns;
                                }
                            })
                        })
                },
                {
                    getDefaultColumnDef: ()=>({
                            filterFn: 'auto'
                        }),
                    getInitialState: (state)=>({
                            columnFilters: [],
                            globalFilter: void 0,
                            ...state
                        }),
                    getDefaultOptions: (table)=>({
                            onColumnFiltersChange: makeStateUpdater('columnFilters', table),
                            onGlobalFilterChange: makeStateUpdater('globalFilter', table),
                            filterFromLeafRows: !1,
                            maxLeafRowFilterDepth: 100,
                            globalFilterFn: 'auto',
                            getColumnCanGlobalFilter: (column)=>{
                                const value = table.getCoreRowModel().flatRows[0]?._getAllCellsByColumnId()[column.id]?.getValue();
                                return 'string' == typeof value || 'number' == typeof value;
                            }
                        }),
                    createColumn: (column, table)=>({
                            getAutoFilterFn: ()=>{
                                const firstRow = table.getCoreRowModel().flatRows[0], value = firstRow?.getValue(column.id);
                                return 'string' == typeof value ? filterFns.includesString : 'number' == typeof value ? filterFns.inNumberRange : 'boolean' == typeof value || null !== value && 'object' == typeof value ? filterFns.equals : Array.isArray(value) ? filterFns.arrIncludes : filterFns.weakEquals;
                            },
                            getFilterFn: ()=>{
                                var _table$options$filter;
                                return isFunction(column.columnDef.filterFn) ? column.columnDef.filterFn : 'auto' === column.columnDef.filterFn ? column.getAutoFilterFn() : null != (_table$options$filter = table.options.filterFns?.[column.columnDef.filterFn]) ? _table$options$filter : filterFns[column.columnDef.filterFn];
                            },
                            getCanFilter: ()=>{
                                var _column$columnDef$ena, _table$options$enable, _table$options$enable2;
                                return (null == (_column$columnDef$ena = column.columnDef.enableColumnFilter) || _column$columnDef$ena) && (null == (_table$options$enable = table.options.enableColumnFilters) || _table$options$enable) && (null == (_table$options$enable2 = table.options.enableFilters) || _table$options$enable2) && !!column.accessorFn;
                            },
                            getCanGlobalFilter: ()=>{
                                var _column$columnDef$ena2, _table$options$enable3, _table$options$enable4, _table$options$getCol;
                                return (null == (_column$columnDef$ena2 = column.columnDef.enableGlobalFilter) || _column$columnDef$ena2) && (null == (_table$options$enable3 = table.options.enableGlobalFilter) || _table$options$enable3) && (null == (_table$options$enable4 = table.options.enableFilters) || _table$options$enable4) && (null == (_table$options$getCol = table.options.getColumnCanGlobalFilter?.(column)) || _table$options$getCol) && !!column.accessorFn;
                            },
                            getIsFiltered: ()=>column.getFilterIndex() > -1,
                            getFilterValue: ()=>table.getState().columnFilters?.find((d)=>d.id === column.id)?.value,
                            getFilterIndex: ()=>{
                                var _table$getState$colum;
                                return null != (_table$getState$colum = table.getState().columnFilters?.findIndex((d)=>d.id === column.id)) ? _table$getState$colum : -1;
                            },
                            setFilterValue: (value)=>{
                                table.setColumnFilters((old)=>{
                                    var _old$filter, _old$map;
                                    const filterFn = column.getFilterFn(), previousfilter = old?.find((d)=>d.id === column.id), newFilter = functionalUpdate(value, previousfilter ? previousfilter.value : void 0);
                                    if (shouldAutoRemoveFilter(filterFn, newFilter, column)) return null != (_old$filter = old?.filter((d)=>d.id !== column.id)) ? _old$filter : [];
                                    const newFilterObj = {
                                        id: column.id,
                                        value: newFilter
                                    };
                                    return previousfilter ? null != (_old$map = old?.map((d)=>d.id === column.id ? newFilterObj : d)) ? _old$map : [] : old?.length ? [
                                        ...old,
                                        newFilterObj
                                    ] : [
                                        newFilterObj
                                    ];
                                });
                            },
                            _getFacetedRowModel: table.options.getFacetedRowModel && table.options.getFacetedRowModel(table, column.id),
                            getFacetedRowModel: ()=>column._getFacetedRowModel ? column._getFacetedRowModel() : table.getPreFilteredRowModel(),
                            _getFacetedUniqueValues: table.options.getFacetedUniqueValues && table.options.getFacetedUniqueValues(table, column.id),
                            getFacetedUniqueValues: ()=>column._getFacetedUniqueValues ? column._getFacetedUniqueValues() : new Map(),
                            _getFacetedMinMaxValues: table.options.getFacetedMinMaxValues && table.options.getFacetedMinMaxValues(table, column.id),
                            getFacetedMinMaxValues: ()=>{
                                if (column._getFacetedMinMaxValues) return column._getFacetedMinMaxValues();
                            }
                        }),
                    createRow: (row, table)=>({
                            columnFilters: {},
                            columnFiltersMeta: {}
                        }),
                    createTable: (table)=>({
                            getGlobalAutoFilterFn: ()=>filterFns.includesString,
                            getGlobalFilterFn: ()=>{
                                var _table$options$filter2;
                                const { globalFilterFn: globalFilterFn  } = table.options;
                                return isFunction(globalFilterFn) ? globalFilterFn : 'auto' === globalFilterFn ? table.getGlobalAutoFilterFn() : null != (_table$options$filter2 = table.options.filterFns?.[globalFilterFn]) ? _table$options$filter2 : filterFns[globalFilterFn];
                            },
                            setColumnFilters: (updater)=>{
                                const leafColumns = table.getAllLeafColumns(), updateFn = (old)=>functionalUpdate(updater, old)?.filter((filter)=>{
                                        const column = leafColumns.find((d)=>d.id === filter.id);
                                        if (column) {
                                            const filterFn = column.getFilterFn();
                                            if (shouldAutoRemoveFilter(filterFn, filter.value, column)) return !1;
                                        }
                                        return !0;
                                    });
                                table.options.onColumnFiltersChange?.(updateFn);
                            },
                            setGlobalFilter: (updater)=>{
                                table.options.onGlobalFilterChange?.(updater);
                            },
                            resetGlobalFilter: (defaultState)=>{
                                table.setGlobalFilter(defaultState ? void 0 : table.initialState.globalFilter);
                            },
                            resetColumnFilters: (defaultState)=>{
                                var _table$initialState$c;
                                table.setColumnFilters(defaultState ? [] : null != (_table$initialState$c = table.initialState?.columnFilters) ? _table$initialState$c : []);
                            },
                            getPreFilteredRowModel: ()=>table.getCoreRowModel(),
                            getFilteredRowModel: ()=>(!table._getFilteredRowModel && table.options.getFilteredRowModel && (table._getFilteredRowModel = table.options.getFilteredRowModel(table)), table.options.manualFiltering || !table._getFilteredRowModel) ? table.getPreFilteredRowModel() : table._getFilteredRowModel(),
                            _getGlobalFacetedRowModel: table.options.getFacetedRowModel && table.options.getFacetedRowModel(table, '__global__'),
                            getGlobalFacetedRowModel: ()=>table.options.manualFiltering || !table._getGlobalFacetedRowModel ? table.getPreFilteredRowModel() : table._getGlobalFacetedRowModel(),
                            _getGlobalFacetedUniqueValues: table.options.getFacetedUniqueValues && table.options.getFacetedUniqueValues(table, '__global__'),
                            getGlobalFacetedUniqueValues: ()=>table._getGlobalFacetedUniqueValues ? table._getGlobalFacetedUniqueValues() : new Map(),
                            _getGlobalFacetedMinMaxValues: table.options.getFacetedMinMaxValues && table.options.getFacetedMinMaxValues(table, '__global__'),
                            getGlobalFacetedMinMaxValues: ()=>{
                                if (table._getGlobalFacetedMinMaxValues) return table._getGlobalFacetedMinMaxValues();
                            }
                        })
                },
                {
                    getInitialState: (state)=>({
                            sorting: [],
                            ...state
                        }),
                    getDefaultColumnDef: ()=>({
                            sortingFn: 'auto'
                        }),
                    getDefaultOptions: (table)=>({
                            onSortingChange: makeStateUpdater('sorting', table),
                            isMultiSortEvent: (e)=>e.shiftKey
                        }),
                    createColumn: (column, table)=>({
                            getAutoSortingFn: ()=>{
                                const firstRows = table.getFilteredRowModel().flatRows.slice(10);
                                let isString = !1;
                                for (const row of firstRows){
                                    const value = row?.getValue(column.id);
                                    if ('[object Date]' === Object.prototype.toString.call(value)) return sortingFns.datetime;
                                    if ('string' == typeof value && (isString = !0, value.split(reSplitAlphaNumeric).length > 1)) return sortingFns.alphanumeric;
                                }
                                return isString ? sortingFns.text : sortingFns.basic;
                            },
                            getAutoSortDir: ()=>{
                                const firstRow = table.getFilteredRowModel().flatRows[0], value = firstRow?.getValue(column.id);
                                return 'string' == typeof value ? 'asc' : 'desc';
                            },
                            getSortingFn: ()=>{
                                var _table$options$sortin;
                                if (!column) throw Error();
                                return isFunction(column.columnDef.sortingFn) ? column.columnDef.sortingFn : 'auto' === column.columnDef.sortingFn ? column.getAutoSortingFn() : null != (_table$options$sortin = table.options.sortingFns?.[column.columnDef.sortingFn]) ? _table$options$sortin : sortingFns[column.columnDef.sortingFn];
                            },
                            toggleSorting: (desc, multi)=>{
                                const nextSortingOrder = column.getNextSortingOrder(), hasManualValue = null != desc;
                                table.setSorting((old)=>{
                                    let sortAction;
                                    const existingSorting = old?.find((d)=>d.id === column.id), existingIndex = old?.findIndex((d)=>d.id === column.id);
                                    let newSorting = [], nextDesc = hasManualValue ? desc : 'desc' === nextSortingOrder;
                                    if (sortAction = old?.length && column.getCanMultiSort() && multi ? existingSorting ? 'toggle' : 'add' : old?.length && existingIndex !== old.length - 1 ? 'replace' : existingSorting ? 'toggle' : 'replace', 'toggle' !== sortAction || hasManualValue || nextSortingOrder || (sortAction = 'remove'), 'add' === sortAction) {
                                        var _table$options$maxMul;
                                        newSorting = [
                                            ...old,
                                            {
                                                id: column.id,
                                                desc: nextDesc
                                            }
                                        ], newSorting.splice(0, newSorting.length - (null != (_table$options$maxMul = table.options.maxMultiSortColCount) ? _table$options$maxMul : Number.MAX_SAFE_INTEGER));
                                    } else newSorting = 'toggle' === sortAction ? old.map((d)=>d.id === column.id ? {
                                            ...d,
                                            desc: nextDesc
                                        } : d) : 'remove' === sortAction ? old.filter((d)=>d.id !== column.id) : [
                                        {
                                            id: column.id,
                                            desc: nextDesc
                                        }
                                    ];
                                    return newSorting;
                                });
                            },
                            getFirstSortDir: ()=>{
                                var _ref, _column$columnDef$sor;
                                const sortDescFirst = null != (_ref = null != (_column$columnDef$sor = column.columnDef.sortDescFirst) ? _column$columnDef$sor : table.options.sortDescFirst) ? _ref : 'desc' === column.getAutoSortDir();
                                return sortDescFirst ? 'desc' : 'asc';
                            },
                            getNextSortingOrder: (multi)=>{
                                var _table$options$enable, _table$options$enable2;
                                const firstSortDirection = column.getFirstSortDir(), isSorted = column.getIsSorted();
                                return isSorted ? (isSorted === firstSortDirection || null != (_table$options$enable = table.options.enableSortingRemoval) && !_table$options$enable || !!multi && null != (_table$options$enable2 = table.options.enableMultiRemove) && !_table$options$enable2) && ('desc' === isSorted ? 'asc' : 'desc') : firstSortDirection;
                            },
                            getCanSort: ()=>{
                                var _column$columnDef$ena, _table$options$enable3;
                                return (null == (_column$columnDef$ena = column.columnDef.enableSorting) || _column$columnDef$ena) && (null == (_table$options$enable3 = table.options.enableSorting) || _table$options$enable3) && !!column.accessorFn;
                            },
                            getCanMultiSort: ()=>{
                                var _ref2, _column$columnDef$ena2;
                                return null != (_ref2 = null != (_column$columnDef$ena2 = column.columnDef.enableMultiSort) ? _column$columnDef$ena2 : table.options.enableMultiSort) ? _ref2 : !!column.accessorFn;
                            },
                            getIsSorted: ()=>{
                                const columnSort = table.getState().sorting?.find((d)=>d.id === column.id);
                                return !!columnSort && (columnSort.desc ? 'desc' : 'asc');
                            },
                            getSortIndex: ()=>{
                                var _table$getState$sorti;
                                return null != (_table$getState$sorti = table.getState().sorting?.findIndex((d)=>d.id === column.id)) ? _table$getState$sorti : -1;
                            },
                            clearSorting: ()=>{
                                table.setSorting((old)=>old?.length ? old.filter((d)=>d.id !== column.id) : []);
                            },
                            getToggleSortingHandler: ()=>{
                                const canSort = column.getCanSort();
                                return (e)=>{
                                    canSort && (e.persist?.(), column.toggleSorting?.(void 0, !!column.getCanMultiSort() && table.options.isMultiSortEvent?.(e)));
                                };
                            }
                        }),
                    createTable: (table)=>({
                            setSorting: (updater)=>table.options.onSortingChange?.(updater),
                            resetSorting: (defaultState)=>{
                                var _table$initialState$s;
                                table.setSorting(defaultState ? [] : null != (_table$initialState$s = table.initialState?.sorting) ? _table$initialState$s : []);
                            },
                            getPreSortedRowModel: ()=>table.getGroupedRowModel(),
                            getSortedRowModel: ()=>(!table._getSortedRowModel && table.options.getSortedRowModel && (table._getSortedRowModel = table.options.getSortedRowModel(table)), table.options.manualSorting || !table._getSortedRowModel) ? table.getPreSortedRowModel() : table._getSortedRowModel()
                        })
                },
                {
                    getDefaultColumnDef: ()=>({
                            aggregatedCell: (props)=>{
                                var _toString;
                                return null != (_toString = props.getValue()?.toString?.()) ? _toString : null;
                            },
                            aggregationFn: 'auto'
                        }),
                    getInitialState: (state)=>({
                            grouping: [],
                            ...state
                        }),
                    getDefaultOptions: (table)=>({
                            onGroupingChange: makeStateUpdater('grouping', table),
                            groupedColumnMode: 'reorder'
                        }),
                    createColumn: (column, table)=>({
                            toggleGrouping: ()=>{
                                table.setGrouping((old)=>old?.includes(column.id) ? old.filter((d)=>d !== column.id) : [
                                        ...null != old ? old : [],
                                        column.id
                                    ]);
                            },
                            getCanGroup: ()=>{
                                var _ref, _ref2, _ref3, _column$columnDef$ena;
                                return null != (_ref = null == (_ref2 = null != (_ref3 = null == (_column$columnDef$ena = column.columnDef.enableGrouping) || _column$columnDef$ena) ? _ref3 : table.options.enableGrouping) || _ref2) ? _ref : !!column.accessorFn;
                            },
                            getIsGrouped: ()=>table.getState().grouping?.includes(column.id),
                            getGroupedIndex: ()=>table.getState().grouping?.indexOf(column.id),
                            getToggleGroupingHandler: ()=>{
                                const canGroup = column.getCanGroup();
                                return ()=>{
                                    canGroup && column.toggleGrouping();
                                };
                            },
                            getAutoAggregationFn: ()=>{
                                const firstRow = table.getCoreRowModel().flatRows[0], value = firstRow?.getValue(column.id);
                                return 'number' == typeof value ? aggregationFns.sum : '[object Date]' === Object.prototype.toString.call(value) ? aggregationFns.extent : void 0;
                            },
                            getAggregationFn: ()=>{
                                var _table$options$aggreg;
                                if (!column) throw Error();
                                return isFunction(column.columnDef.aggregationFn) ? column.columnDef.aggregationFn : 'auto' === column.columnDef.aggregationFn ? column.getAutoAggregationFn() : null != (_table$options$aggreg = table.options.aggregationFns?.[column.columnDef.aggregationFn]) ? _table$options$aggreg : aggregationFns[column.columnDef.aggregationFn];
                            }
                        }),
                    createTable: (table)=>({
                            setGrouping: (updater)=>table.options.onGroupingChange?.(updater),
                            resetGrouping: (defaultState)=>{
                                var _table$initialState$g;
                                table.setGrouping(defaultState ? [] : null != (_table$initialState$g = table.initialState?.grouping) ? _table$initialState$g : []);
                            },
                            getPreGroupedRowModel: ()=>table.getFilteredRowModel(),
                            getGroupedRowModel: ()=>(!table._getGroupedRowModel && table.options.getGroupedRowModel && (table._getGroupedRowModel = table.options.getGroupedRowModel(table)), table.options.manualGrouping || !table._getGroupedRowModel) ? table.getPreGroupedRowModel() : table._getGroupedRowModel()
                        }),
                    createRow: (row)=>({
                            getIsGrouped: ()=>!!row.groupingColumnId,
                            _groupingValuesCache: {}
                        }),
                    createCell: (cell, column, row, table)=>({
                            getIsGrouped: ()=>column.getIsGrouped() && column.id === row.groupingColumnId,
                            getIsPlaceholder: ()=>!cell.getIsGrouped() && column.getIsGrouped(),
                            getIsAggregated: ()=>!cell.getIsGrouped() && !cell.getIsPlaceholder() && !!row.subRows?.length
                        })
                },
                {
                    getInitialState: (state)=>({
                            expanded: {},
                            ...state
                        }),
                    getDefaultOptions: (table)=>({
                            onExpandedChange: makeStateUpdater('expanded', table),
                            paginateExpandedRows: !0
                        }),
                    createTable: (table)=>{
                        let registered = !1, queued = !1;
                        return {
                            _autoResetExpanded: ()=>{
                                var _ref, _table$options$autoRe;
                                if (!registered) {
                                    table._queue(()=>{
                                        registered = !0;
                                    });
                                    return;
                                }
                                if (null != (_ref = null != (_table$options$autoRe = table.options.autoResetAll) ? _table$options$autoRe : table.options.autoResetExpanded) ? _ref : !table.options.manualExpanding) {
                                    if (queued) return;
                                    queued = !0, table._queue(()=>{
                                        table.resetExpanded(), queued = !1;
                                    });
                                }
                            },
                            setExpanded: (updater)=>table.options.onExpandedChange?.(updater),
                            toggleAllRowsExpanded: (expanded)=>{
                                (null != expanded ? expanded : !table.getIsAllRowsExpanded()) ? table.setExpanded(!0) : table.setExpanded({});
                            },
                            resetExpanded: (defaultState)=>{
                                var _table$initialState$e;
                                table.setExpanded(defaultState ? {} : null != (_table$initialState$e = table.initialState?.expanded) ? _table$initialState$e : {});
                            },
                            getCanSomeRowsExpand: ()=>table.getRowModel().flatRows.some((row)=>row.getCanExpand()),
                            getToggleAllRowsExpandedHandler: ()=>(e)=>{
                                    e.persist?.(), table.toggleAllRowsExpanded();
                                },
                            getIsSomeRowsExpanded: ()=>{
                                const expanded = table.getState().expanded;
                                return !0 === expanded || Object.values(expanded).some(Boolean);
                            },
                            getIsAllRowsExpanded: ()=>{
                                const expanded = table.getState().expanded;
                                return 'boolean' == typeof expanded ? !0 === expanded : !(!Object.keys(expanded).length || table.getRowModel().flatRows.some((row)=>!row.getIsExpanded()));
                            },
                            getExpandedDepth: ()=>{
                                let maxDepth = 0;
                                const rowIds = !0 === table.getState().expanded ? Object.keys(table.getRowModel().rowsById) : Object.keys(table.getState().expanded);
                                return rowIds.forEach((id)=>{
                                    const splitId = id.split('.');
                                    maxDepth = Math.max(maxDepth, splitId.length);
                                }), maxDepth;
                            },
                            getPreExpandedRowModel: ()=>table.getSortedRowModel(),
                            getExpandedRowModel: ()=>(!table._getExpandedRowModel && table.options.getExpandedRowModel && (table._getExpandedRowModel = table.options.getExpandedRowModel(table)), table.options.manualExpanding || !table._getExpandedRowModel) ? table.getPreExpandedRowModel() : table._getExpandedRowModel()
                        };
                    },
                    createRow: (row, table)=>({
                            toggleExpanded: (expanded)=>{
                                table.setExpanded((old)=>{
                                    var _expanded;
                                    const exists = !0 === old || !!old?.[row.id];
                                    let oldExpanded = {};
                                    if (!0 === old ? Object.keys(table.getRowModel().rowsById).forEach((rowId)=>{
                                        oldExpanded[rowId] = !0;
                                    }) : oldExpanded = old, expanded = null != (_expanded = expanded) ? _expanded : !exists, !exists && expanded) return {
                                        ...oldExpanded,
                                        [row.id]: !0
                                    };
                                    if (exists && !expanded) {
                                        const { [row.id]: _ , ...rest } = oldExpanded;
                                        return rest;
                                    }
                                    return old;
                                });
                            },
                            getIsExpanded: ()=>{
                                var _table$options$getIsR;
                                const expanded = table.getState().expanded;
                                return !!(null != (_table$options$getIsR = table.options.getIsRowExpanded?.(row)) ? _table$options$getIsR : !0 === expanded || expanded?.[row.id]);
                            },
                            getCanExpand: ()=>{
                                var _table$options$getRow, _table$options$enable;
                                return null != (_table$options$getRow = table.options.getRowCanExpand?.(row)) ? _table$options$getRow : (null == (_table$options$enable = table.options.enableExpanding) || _table$options$enable) && !!row.subRows?.length;
                            },
                            getToggleExpandedHandler: ()=>{
                                const canExpand = row.getCanExpand();
                                return ()=>{
                                    canExpand && row.toggleExpanded();
                                };
                            }
                        })
                },
                {
                    getInitialState: (state)=>({
                            ...state,
                            pagination: {
                                ...getDefaultPaginationState(),
                                ...state?.pagination
                            }
                        }),
                    getDefaultOptions: (table)=>({
                            onPaginationChange: makeStateUpdater('pagination', table)
                        }),
                    createTable: (table)=>{
                        let registered = !1, queued = !1;
                        return {
                            _autoResetPageIndex: ()=>{
                                var _ref, _table$options$autoRe;
                                if (!registered) {
                                    table._queue(()=>{
                                        registered = !0;
                                    });
                                    return;
                                }
                                if (null != (_ref = null != (_table$options$autoRe = table.options.autoResetAll) ? _table$options$autoRe : table.options.autoResetPageIndex) ? _ref : !table.options.manualPagination) {
                                    if (queued) return;
                                    queued = !0, table._queue(()=>{
                                        table.resetPageIndex(), queued = !1;
                                    });
                                }
                            },
                            setPagination: (updater)=>{
                                const safeUpdater = (old)=>{
                                    let newState = functionalUpdate(updater, old);
                                    return newState;
                                };
                                return table.options.onPaginationChange?.(safeUpdater);
                            },
                            resetPagination: (defaultState)=>{
                                var _table$initialState$p;
                                table.setPagination(defaultState ? getDefaultPaginationState() : null != (_table$initialState$p = table.initialState.pagination) ? _table$initialState$p : getDefaultPaginationState());
                            },
                            setPageIndex: (updater)=>{
                                table.setPagination((old)=>{
                                    let pageIndex = functionalUpdate(updater, old.pageIndex);
                                    const maxPageIndex = void 0 === table.options.pageCount || -1 === table.options.pageCount ? Number.MAX_SAFE_INTEGER : table.options.pageCount - 1;
                                    return pageIndex = Math.max(0, Math.min(pageIndex, maxPageIndex)), {
                                        ...old,
                                        pageIndex
                                    };
                                });
                            },
                            resetPageIndex: (defaultState)=>{
                                var _table$initialState$p2;
                                table.setPageIndex(defaultState ? 0 : null != (_table$initialState$p2 = table.initialState?.pagination?.pageIndex) ? _table$initialState$p2 : 0);
                            },
                            resetPageSize: (defaultState)=>{
                                var _table$initialState$p3;
                                table.setPageSize(defaultState ? 10 : null != (_table$initialState$p3 = table.initialState?.pagination?.pageSize) ? _table$initialState$p3 : 10);
                            },
                            setPageSize: (updater)=>{
                                table.setPagination((old)=>{
                                    const pageSize = Math.max(1, functionalUpdate(updater, old.pageSize)), topRowIndex = old.pageSize * old.pageIndex;
                                    return {
                                        ...old,
                                        pageIndex: Math.floor(topRowIndex / pageSize),
                                        pageSize
                                    };
                                });
                            },
                            setPageCount: (updater)=>table.setPagination((old)=>{
                                    var _table$options$pageCo;
                                    let newPageCount = functionalUpdate(updater, null != (_table$options$pageCo = table.options.pageCount) ? _table$options$pageCo : -1);
                                    return 'number' == typeof newPageCount && (newPageCount = Math.max(-1, newPageCount)), {
                                        ...old,
                                        pageCount: newPageCount
                                    };
                                }),
                            getPageOptions: memo(()=>[
                                    table.getPageCount()
                                ], (pageCount)=>{
                                let pageOptions = [];
                                return pageCount && pageCount > 0 && (pageOptions = [
                                    ...Array(pageCount)
                                ].fill(null).map((_, i)=>i)), pageOptions;
                            }, {
                                key: !1,
                                debug: ()=>{
                                    var _table$options$debugA;
                                    return null != (_table$options$debugA = table.options.debugAll) ? _table$options$debugA : table.options.debugTable;
                                }
                            }),
                            getCanPreviousPage: ()=>table.getState().pagination.pageIndex > 0,
                            getCanNextPage: ()=>{
                                const { pageIndex  } = table.getState().pagination, pageCount = table.getPageCount();
                                return -1 === pageCount || 0 !== pageCount && pageIndex < pageCount - 1;
                            },
                            previousPage: ()=>table.setPageIndex((old)=>old - 1),
                            nextPage: ()=>table.setPageIndex((old)=>old + 1),
                            getPrePaginationRowModel: ()=>table.getExpandedRowModel(),
                            getPaginationRowModel: ()=>(!table._getPaginationRowModel && table.options.getPaginationRowModel && (table._getPaginationRowModel = table.options.getPaginationRowModel(table)), table.options.manualPagination || !table._getPaginationRowModel) ? table.getPrePaginationRowModel() : table._getPaginationRowModel(),
                            getPageCount: ()=>{
                                var _table$options$pageCo2;
                                return null != (_table$options$pageCo2 = table.options.pageCount) ? _table$options$pageCo2 : Math.ceil(table.getPrePaginationRowModel().rows.length / table.getState().pagination.pageSize);
                            }
                        };
                    }
                },
                {
                    getInitialState: (state)=>({
                            rowSelection: {},
                            ...state
                        }),
                    getDefaultOptions: (table)=>({
                            onRowSelectionChange: makeStateUpdater('rowSelection', table),
                            enableRowSelection: !0,
                            enableMultiRowSelection: !0,
                            enableSubRowSelection: !0
                        }),
                    createTable: (table)=>({
                            setRowSelection: (updater)=>table.options.onRowSelectionChange?.(updater),
                            resetRowSelection: (defaultState)=>{
                                var _table$initialState$r;
                                return table.setRowSelection(defaultState ? {} : null != (_table$initialState$r = table.initialState.rowSelection) ? _table$initialState$r : {});
                            },
                            toggleAllRowsSelected: (value)=>{
                                table.setRowSelection((old)=>{
                                    value = void 0 !== value ? value : !table.getIsAllRowsSelected();
                                    const rowSelection = {
                                        ...old
                                    }, preGroupedFlatRows = table.getPreGroupedRowModel().flatRows;
                                    return value ? preGroupedFlatRows.forEach((row)=>{
                                        row.getCanSelect() && (rowSelection[row.id] = !0);
                                    }) : preGroupedFlatRows.forEach((row)=>{
                                        delete rowSelection[row.id];
                                    }), rowSelection;
                                });
                            },
                            toggleAllPageRowsSelected: (value)=>table.setRowSelection((old)=>{
                                    const resolvedValue = void 0 !== value ? value : !table.getIsAllPageRowsSelected(), rowSelection = {
                                        ...old
                                    };
                                    return table.getRowModel().rows.forEach((row)=>{
                                        mutateRowIsSelected(rowSelection, row.id, resolvedValue, table);
                                    }), rowSelection;
                                }),
                            getPreSelectedRowModel: ()=>table.getCoreRowModel(),
                            getSelectedRowModel: memo(()=>[
                                    table.getState().rowSelection,
                                    table.getCoreRowModel()
                                ], (rowSelection, rowModel)=>Object.keys(rowSelection).length ? selectRowsFn(table, rowModel) : {
                                    rows: [],
                                    flatRows: [],
                                    rowsById: {}
                                }, {
                                key: !1,
                                debug: ()=>{
                                    var _table$options$debugA;
                                    return null != (_table$options$debugA = table.options.debugAll) ? _table$options$debugA : table.options.debugTable;
                                }
                            }),
                            getFilteredSelectedRowModel: memo(()=>[
                                    table.getState().rowSelection,
                                    table.getFilteredRowModel()
                                ], (rowSelection, rowModel)=>Object.keys(rowSelection).length ? selectRowsFn(table, rowModel) : {
                                    rows: [],
                                    flatRows: [],
                                    rowsById: {}
                                }, {
                                key: 'getFilteredSelectedRowModel',
                                debug: ()=>{
                                    var _table$options$debugA2;
                                    return null != (_table$options$debugA2 = table.options.debugAll) ? _table$options$debugA2 : table.options.debugTable;
                                }
                            }),
                            getGroupedSelectedRowModel: memo(()=>[
                                    table.getState().rowSelection,
                                    table.getSortedRowModel()
                                ], (rowSelection, rowModel)=>Object.keys(rowSelection).length ? selectRowsFn(table, rowModel) : {
                                    rows: [],
                                    flatRows: [],
                                    rowsById: {}
                                }, {
                                key: 'getGroupedSelectedRowModel',
                                debug: ()=>{
                                    var _table$options$debugA3;
                                    return null != (_table$options$debugA3 = table.options.debugAll) ? _table$options$debugA3 : table.options.debugTable;
                                }
                            }),
                            getIsAllRowsSelected: ()=>{
                                const preGroupedFlatRows = table.getFilteredRowModel().flatRows, { rowSelection  } = table.getState();
                                let isAllRowsSelected = Boolean(preGroupedFlatRows.length && Object.keys(rowSelection).length);
                                return isAllRowsSelected && preGroupedFlatRows.some((row)=>row.getCanSelect() && !rowSelection[row.id]) && (isAllRowsSelected = !1), isAllRowsSelected;
                            },
                            getIsAllPageRowsSelected: ()=>{
                                const paginationFlatRows = table.getPaginationRowModel().flatRows, { rowSelection  } = table.getState();
                                let isAllPageRowsSelected = !!paginationFlatRows.length;
                                return isAllPageRowsSelected && paginationFlatRows.some((row)=>!rowSelection[row.id]) && (isAllPageRowsSelected = !1), isAllPageRowsSelected;
                            },
                            getIsSomeRowsSelected: ()=>{
                                var _table$getState$rowSe;
                                const totalSelected = Object.keys(null != (_table$getState$rowSe = table.getState().rowSelection) ? _table$getState$rowSe : {}).length;
                                return totalSelected > 0 && totalSelected < table.getFilteredRowModel().flatRows.length;
                            },
                            getIsSomePageRowsSelected: ()=>{
                                const paginationFlatRows = table.getPaginationRowModel().flatRows;
                                return !table.getIsAllPageRowsSelected() && paginationFlatRows.some((d)=>d.getIsSelected() || d.getIsSomeSelected());
                            },
                            getToggleAllRowsSelectedHandler: ()=>(e)=>{
                                    table.toggleAllRowsSelected(e.target.checked);
                                },
                            getToggleAllPageRowsSelectedHandler: ()=>(e)=>{
                                    table.toggleAllPageRowsSelected(e.target.checked);
                                }
                        }),
                    createRow: (row, table)=>({
                            toggleSelected: (value)=>{
                                const isSelected = row.getIsSelected();
                                table.setRowSelection((old)=>{
                                    if (value = void 0 !== value ? value : !isSelected, isSelected === value) return old;
                                    const selectedRowIds = {
                                        ...old
                                    };
                                    return mutateRowIsSelected(selectedRowIds, row.id, value, table), selectedRowIds;
                                });
                            },
                            getIsSelected: ()=>{
                                const { rowSelection  } = table.getState();
                                return isRowSelected(row, rowSelection);
                            },
                            getIsSomeSelected: ()=>{
                                const { rowSelection  } = table.getState();
                                return 'some' === isSubRowSelected(row, rowSelection);
                            },
                            getIsAllSubRowsSelected: ()=>{
                                const { rowSelection  } = table.getState();
                                return 'all' === isSubRowSelected(row, rowSelection);
                            },
                            getCanSelect: ()=>{
                                var _table$options$enable;
                                return 'function' == typeof table.options.enableRowSelection ? table.options.enableRowSelection(row) : null == (_table$options$enable = table.options.enableRowSelection) || _table$options$enable;
                            },
                            getCanSelectSubRows: ()=>{
                                var _table$options$enable2;
                                return 'function' == typeof table.options.enableSubRowSelection ? table.options.enableSubRowSelection(row) : null == (_table$options$enable2 = table.options.enableSubRowSelection) || _table$options$enable2;
                            },
                            getCanMultiSelect: ()=>{
                                var _table$options$enable3;
                                return 'function' == typeof table.options.enableMultiRowSelection ? table.options.enableMultiRowSelection(row) : null == (_table$options$enable3 = table.options.enableMultiRowSelection) || _table$options$enable3;
                            },
                            getToggleSelectedHandler: ()=>{
                                const canSelect = row.getCanSelect();
                                return (e)=>{
                                    canSelect && row.toggleSelected(e.target?.checked);
                                };
                            }
                        })
                },
                {
                    getDefaultColumnDef: ()=>defaultColumnSizing,
                    getInitialState: (state)=>({
                            columnSizing: {},
                            columnSizingInfo: getDefaultColumnSizingInfoState(),
                            ...state
                        }),
                    getDefaultOptions: (table)=>({
                            columnResizeMode: 'onEnd',
                            onColumnSizingChange: makeStateUpdater('columnSizing', table),
                            onColumnSizingInfoChange: makeStateUpdater('columnSizingInfo', table)
                        }),
                    createColumn: (column, table)=>({
                            getSize: ()=>{
                                var _column$columnDef$min, _ref, _column$columnDef$max;
                                const columnSize = table.getState().columnSizing[column.id];
                                return Math.min(Math.max(null != (_column$columnDef$min = column.columnDef.minSize) ? _column$columnDef$min : defaultColumnSizing.minSize, null != (_ref = null != columnSize ? columnSize : column.columnDef.size) ? _ref : defaultColumnSizing.size), null != (_column$columnDef$max = column.columnDef.maxSize) ? _column$columnDef$max : defaultColumnSizing.maxSize);
                            },
                            getStart: (position)=>{
                                const columns = position ? 'left' === position ? table.getLeftVisibleLeafColumns() : table.getRightVisibleLeafColumns() : table.getVisibleLeafColumns(), index = columns.findIndex((d)=>d.id === column.id);
                                if (index > 0) {
                                    const prevSiblingColumn = columns[index - 1];
                                    return prevSiblingColumn.getStart(position) + prevSiblingColumn.getSize();
                                }
                                return 0;
                            },
                            resetSize: ()=>{
                                table.setColumnSizing((_ref2)=>{
                                    let { [column.id]: _ , ...rest } = _ref2;
                                    return rest;
                                });
                            },
                            getCanResize: ()=>{
                                var _column$columnDef$ena, _table$options$enable;
                                return (null == (_column$columnDef$ena = column.columnDef.enableResizing) || _column$columnDef$ena) && (null == (_table$options$enable = table.options.enableColumnResizing) || _table$options$enable);
                            },
                            getIsResizing: ()=>table.getState().columnSizingInfo.isResizingColumn === column.id
                        }),
                    createHeader: (header, table)=>({
                            getSize: ()=>{
                                let sum = 0;
                                const recurse = (header)=>{
                                    if (header.subHeaders.length) header.subHeaders.forEach(recurse);
                                    else {
                                        var _header$column$getSiz;
                                        sum += null != (_header$column$getSiz = header.column.getSize()) ? _header$column$getSiz : 0;
                                    }
                                };
                                return recurse(header), sum;
                            },
                            getStart: ()=>{
                                if (header.index > 0) {
                                    const prevSiblingHeader = header.headerGroup.headers[header.index - 1];
                                    return prevSiblingHeader.getStart() + prevSiblingHeader.getSize();
                                }
                                return 0;
                            },
                            getResizeHandler: ()=>{
                                const column = table.getColumn(header.column.id), canResize = column.getCanResize();
                                return (e)=>{
                                    if (!canResize || (e.persist?.(), isTouchStartEvent(e) && e.touches && e.touches.length > 1)) return;
                                    const startSize = header.getSize(), columnSizingStart = header ? header.getLeafHeaders().map((d)=>[
                                            d.column.id,
                                            d.column.getSize()
                                        ]) : [
                                        [
                                            column.id,
                                            column.getSize()
                                        ]
                                    ], clientX = isTouchStartEvent(e) ? Math.round(e.touches[0].clientX) : e.clientX, newColumnSizing = {}, updateOffset = (eventType, clientXPos)=>{
                                        'number' == typeof clientXPos && (table.setColumnSizingInfo((old)=>{
                                            var _old$startOffset, _old$startSize;
                                            const deltaOffset = clientXPos - (null != (_old$startOffset = old?.startOffset) ? _old$startOffset : 0), deltaPercentage = Math.max(deltaOffset / (null != (_old$startSize = old?.startSize) ? _old$startSize : 0), -0.999999);
                                            return old.columnSizingStart.forEach((_ref3)=>{
                                                let [columnId, headerSize] = _ref3;
                                                newColumnSizing[columnId] = Math.round(100 * Math.max(headerSize + headerSize * deltaPercentage, 0)) / 100;
                                            }), {
                                                ...old,
                                                deltaOffset,
                                                deltaPercentage
                                            };
                                        }), ('onChange' === table.options.columnResizeMode || 'end' === eventType) && table.setColumnSizing((old)=>({
                                                ...old,
                                                ...newColumnSizing
                                            })));
                                    }, onMove = (clientXPos)=>updateOffset('move', clientXPos), onEnd = (clientXPos)=>{
                                        updateOffset('end', clientXPos), table.setColumnSizingInfo((old)=>({
                                                ...old,
                                                isResizingColumn: !1,
                                                startOffset: null,
                                                startSize: null,
                                                deltaOffset: null,
                                                deltaPercentage: null,
                                                columnSizingStart: []
                                            }));
                                    }, mouseEvents = {
                                        moveHandler: (e)=>onMove(e.clientX),
                                        upHandler: (e)=>{
                                            document.removeEventListener('mousemove', mouseEvents.moveHandler), document.removeEventListener('mouseup', mouseEvents.upHandler), onEnd(e.clientX);
                                        }
                                    }, touchEvents = {
                                        moveHandler: (e)=>(e.cancelable && (e.preventDefault(), e.stopPropagation()), onMove(e.touches[0].clientX), !1),
                                        upHandler: (e)=>{
                                            document.removeEventListener('touchmove', touchEvents.moveHandler), document.removeEventListener('touchend', touchEvents.upHandler), e.cancelable && (e.preventDefault(), e.stopPropagation()), onEnd(e.touches[0]?.clientX);
                                        }
                                    }, passiveIfSupported = !!function() {
                                        if ('boolean' == typeof passiveSupported) return passiveSupported;
                                        let supported = !1;
                                        try {
                                            const options = {
                                                get passive () {
                                                    return supported = !0, !1;
                                                }
                                            }, noop = ()=>{};
                                            window.addEventListener('test', noop, options), window.removeEventListener('test', noop);
                                        } catch (err) {
                                            supported = !1;
                                        }
                                        return passiveSupported = supported;
                                    }() && {
                                        passive: !1
                                    };
                                    isTouchStartEvent(e) ? (document.addEventListener('touchmove', touchEvents.moveHandler, passiveIfSupported), document.addEventListener('touchend', touchEvents.upHandler, passiveIfSupported)) : (document.addEventListener('mousemove', mouseEvents.moveHandler, passiveIfSupported), document.addEventListener('mouseup', mouseEvents.upHandler, passiveIfSupported)), table.setColumnSizingInfo((old)=>({
                                            ...old,
                                            startOffset: clientX,
                                            startSize,
                                            deltaOffset: 0,
                                            deltaPercentage: 0,
                                            columnSizingStart,
                                            isResizingColumn: column.id
                                        }));
                                };
                            }
                        }),
                    createTable: (table)=>({
                            setColumnSizing: (updater)=>table.options.onColumnSizingChange?.(updater),
                            setColumnSizingInfo: (updater)=>table.options.onColumnSizingInfoChange?.(updater),
                            resetColumnSizing: (defaultState)=>{
                                var _table$initialState$c;
                                table.setColumnSizing(defaultState ? {} : null != (_table$initialState$c = table.initialState.columnSizing) ? _table$initialState$c : {});
                            },
                            resetHeaderSizeInfo: (defaultState)=>{
                                var _table$initialState$c2;
                                table.setColumnSizingInfo(defaultState ? getDefaultColumnSizingInfoState() : null != (_table$initialState$c2 = table.initialState.columnSizingInfo) ? _table$initialState$c2 : getDefaultColumnSizingInfoState());
                            },
                            getTotalSize: ()=>{
                                var _table$getHeaderGroup;
                                return null != (_table$getHeaderGroup = table.getHeaderGroups()[0]?.headers.reduce((sum, header)=>sum + header.getSize(), 0)) ? _table$getHeaderGroup : 0;
                            },
                            getLeftTotalSize: ()=>{
                                var _table$getLeftHeaderG;
                                return null != (_table$getLeftHeaderG = table.getLeftHeaderGroups()[0]?.headers.reduce((sum, header)=>sum + header.getSize(), 0)) ? _table$getLeftHeaderG : 0;
                            },
                            getCenterTotalSize: ()=>{
                                var _table$getCenterHeade;
                                return null != (_table$getCenterHeade = table.getCenterHeaderGroups()[0]?.headers.reduce((sum, header)=>sum + header.getSize(), 0)) ? _table$getCenterHeade : 0;
                            },
                            getRightTotalSize: ()=>{
                                var _table$getRightHeader;
                                return null != (_table$getRightHeader = table.getRightHeaderGroups()[0]?.headers.reduce((sum, header)=>sum + header.getSize(), 0)) ? _table$getRightHeader : 0;
                            }
                        })
                }
            ];
            function createTable(options) {
                var _options$initialState;
                (options.debugAll || options.debugTable) && console.info('Creating Table Instance...');
                let table = {
                    _features: features
                };
                const defaultOptions = table._features.reduce((obj, feature)=>Object.assign(obj, feature.getDefaultOptions?.(table)), {}), mergeOptions = (options)=>table.options.mergeOptions ? table.options.mergeOptions(defaultOptions, options) : {
                        ...defaultOptions,
                        ...options
                    };
                let initialState = {
                    ...null != (_options$initialState = options.initialState) ? _options$initialState : {}
                };
                table._features.forEach((feature)=>{
                    var _feature$getInitialSt;
                    initialState = null != (_feature$getInitialSt = feature.getInitialState?.(initialState)) ? _feature$getInitialSt : initialState;
                });
                const queued = [];
                let queuedTimeout = !1;
                const coreInstance = {
                    _features: features,
                    options: {
                        ...defaultOptions,
                        ...options
                    },
                    initialState,
                    _queue: (cb)=>{
                        queued.push(cb), queuedTimeout || (queuedTimeout = !0, Promise.resolve().then(()=>{
                            for(; queued.length;)queued.shift()();
                            queuedTimeout = !1;
                        }).catch((error)=>setTimeout(()=>{
                                throw error;
                            })));
                    },
                    reset: ()=>{
                        table.setState(table.initialState);
                    },
                    setOptions: (updater)=>{
                        const newOptions = functionalUpdate(updater, table.options);
                        table.options = mergeOptions(newOptions);
                    },
                    getState: ()=>table.options.state,
                    setState: (updater)=>{
                        table.options.onStateChange?.(updater);
                    },
                    _getRowId: (row, index, parent)=>{
                        var _table$options$getRow;
                        return null != (_table$options$getRow = table.options.getRowId?.(row, index, parent)) ? _table$options$getRow : `${parent ? [
                            parent.id,
                            index
                        ].join('.') : index}`;
                    },
                    getCoreRowModel: ()=>(table._getCoreRowModel || (table._getCoreRowModel = table.options.getCoreRowModel(table)), table._getCoreRowModel()),
                    getRowModel: ()=>table.getPaginationRowModel(),
                    getRow: (id)=>{
                        const row = table.getRowModel().rowsById[id];
                        if (!row) throw Error();
                        return row;
                    },
                    _getDefaultColumnDef: memo(()=>[
                            table.options.defaultColumn
                        ], (defaultColumn)=>{
                        var _defaultColumn;
                        return defaultColumn = null != (_defaultColumn = defaultColumn) ? _defaultColumn : {}, {
                            header: (props)=>{
                                const resolvedColumnDef = props.header.column.columnDef;
                                return resolvedColumnDef.accessorKey ? resolvedColumnDef.accessorKey : resolvedColumnDef.accessorFn ? resolvedColumnDef.id : null;
                            },
                            cell: (props)=>{
                                var _props$renderValue$to;
                                return null != (_props$renderValue$to = props.renderValue()?.toString?.()) ? _props$renderValue$to : null;
                            },
                            ...table._features.reduce((obj, feature)=>Object.assign(obj, feature.getDefaultColumnDef?.()), {}),
                            ...defaultColumn
                        };
                    }, {
                        debug: ()=>{
                            var _table$options$debugA;
                            return null != (_table$options$debugA = table.options.debugAll) ? _table$options$debugA : table.options.debugColumns;
                        },
                        key: !1
                    }),
                    _getColumnDefs: ()=>table.options.columns,
                    getAllColumns: memo(()=>[
                            table._getColumnDefs()
                        ], (columnDefs)=>{
                        const recurseColumns = function(columnDefs, parent, depth) {
                            return void 0 === depth && (depth = 0), columnDefs.map((columnDef)=>{
                                const column = function(table, columnDef, depth, parent) {
                                    var _ref, _resolvedColumnDef$id;
                                    let accessorFn;
                                    const defaultColumn = table._getDefaultColumnDef(), resolvedColumnDef = {
                                        ...defaultColumn,
                                        ...columnDef
                                    }, accessorKey = resolvedColumnDef.accessorKey;
                                    let id = null != (_ref = null != (_resolvedColumnDef$id = resolvedColumnDef.id) ? _resolvedColumnDef$id : accessorKey ? accessorKey.replace('.', '_') : void 0) ? _ref : 'string' == typeof resolvedColumnDef.header ? resolvedColumnDef.header : void 0;
                                    if (resolvedColumnDef.accessorFn ? accessorFn = resolvedColumnDef.accessorFn : accessorKey && (accessorFn = accessorKey.includes('.') ? (originalRow)=>{
                                        let result = originalRow;
                                        for (const key of accessorKey.split('.'))result = result[key];
                                        return result;
                                    } : (originalRow)=>originalRow[resolvedColumnDef.accessorKey]), !id) throw Error();
                                    let column = {
                                        id: `${String(id)}`,
                                        accessorFn,
                                        parent: parent,
                                        depth,
                                        columnDef: resolvedColumnDef,
                                        columns: [],
                                        getFlatColumns: memo(()=>[
                                                !0
                                            ], ()=>[
                                                column,
                                                ...column.columns?.flatMap((d)=>d.getFlatColumns())
                                            ], {
                                            key: 'column.getFlatColumns',
                                            debug: ()=>{
                                                var _table$options$debugA;
                                                return null != (_table$options$debugA = table.options.debugAll) ? _table$options$debugA : table.options.debugColumns;
                                            }
                                        }),
                                        getLeafColumns: memo(()=>[
                                                table._getOrderColumnsFn()
                                            ], (orderColumns)=>{
                                            if (column.columns?.length) {
                                                let leafColumns = column.columns.flatMap((column)=>column.getLeafColumns());
                                                return orderColumns(leafColumns);
                                            }
                                            return [
                                                column
                                            ];
                                        }, {
                                            key: 'column.getLeafColumns',
                                            debug: ()=>{
                                                var _table$options$debugA2;
                                                return null != (_table$options$debugA2 = table.options.debugAll) ? _table$options$debugA2 : table.options.debugColumns;
                                            }
                                        })
                                    };
                                    return column = table._features.reduce((obj, feature)=>Object.assign(obj, feature.createColumn?.(column, table)), column);
                                }(table, columnDef, depth, parent);
                                return column.columns = columnDef.columns ? recurseColumns(columnDef.columns, column, depth + 1) : [], column;
                            });
                        };
                        return recurseColumns(columnDefs);
                    }, {
                        key: !1,
                        debug: ()=>{
                            var _table$options$debugA2;
                            return null != (_table$options$debugA2 = table.options.debugAll) ? _table$options$debugA2 : table.options.debugColumns;
                        }
                    }),
                    getAllFlatColumns: memo(()=>[
                            table.getAllColumns()
                        ], (allColumns)=>allColumns.flatMap((column)=>column.getFlatColumns()), {
                        key: !1,
                        debug: ()=>{
                            var _table$options$debugA3;
                            return null != (_table$options$debugA3 = table.options.debugAll) ? _table$options$debugA3 : table.options.debugColumns;
                        }
                    }),
                    _getAllFlatColumnsById: memo(()=>[
                            table.getAllFlatColumns()
                        ], (flatColumns)=>flatColumns.reduce((acc, column)=>(acc[column.id] = column, acc), {}), {
                        key: !1,
                        debug: ()=>{
                            var _table$options$debugA4;
                            return null != (_table$options$debugA4 = table.options.debugAll) ? _table$options$debugA4 : table.options.debugColumns;
                        }
                    }),
                    getAllLeafColumns: memo(()=>[
                            table.getAllColumns(),
                            table._getOrderColumnsFn()
                        ], (allColumns, orderColumns)=>{
                        let leafColumns = allColumns.flatMap((column)=>column.getLeafColumns());
                        return orderColumns(leafColumns);
                    }, {
                        key: !1,
                        debug: ()=>{
                            var _table$options$debugA5;
                            return null != (_table$options$debugA5 = table.options.debugAll) ? _table$options$debugA5 : table.options.debugColumns;
                        }
                    }),
                    getColumn: (columnId)=>{
                        const column = table._getAllFlatColumnsById()[columnId];
                        if (!column) throw Error();
                        return column;
                    }
                };
                return Object.assign(table, coreInstance), table._features.forEach((feature)=>Object.assign(table, feature.createTable?.(table))), table;
            }
            const createRow = (table, id, original, rowIndex, depth, subRows)=>{
                let row = {
                    id,
                    index: rowIndex,
                    original,
                    depth,
                    _valuesCache: {},
                    _uniqueValuesCache: {},
                    getValue: (columnId)=>{
                        if (row._valuesCache.hasOwnProperty(columnId)) return row._valuesCache[columnId];
                        const column = table.getColumn(columnId);
                        if (column.accessorFn) return row._valuesCache[columnId] = column.accessorFn(row.original, rowIndex), row._valuesCache[columnId];
                    },
                    getUniqueValues: (columnId)=>{
                        if (row._uniqueValuesCache.hasOwnProperty(columnId)) return row._uniqueValuesCache[columnId];
                        const column = table.getColumn(columnId);
                        return column.accessorFn ? column.columnDef.getUniqueValues ? (row._uniqueValuesCache[columnId] = column.columnDef.getUniqueValues(row.original, rowIndex), row._uniqueValuesCache[columnId]) : (row._uniqueValuesCache[columnId] = [
                            row.getValue(columnId)
                        ], row._uniqueValuesCache[columnId]) : void 0;
                    },
                    renderValue: (columnId)=>{
                        var _row$getValue;
                        return null != (_row$getValue = row.getValue(columnId)) ? _row$getValue : table.options.renderFallbackValue;
                    },
                    subRows: null != subRows ? subRows : [],
                    getLeafRows: ()=>(function(arr, getChildren) {
                            const flat = [], recurse = (subArr)=>{
                                subArr.forEach((item)=>{
                                    flat.push(item);
                                    const children = getChildren(item);
                                    children?.length && recurse(children);
                                });
                            };
                            return recurse(arr), flat;
                        })(row.subRows, (d)=>d.subRows),
                    getAllCells: memo(()=>[
                            table.getAllLeafColumns()
                        ], (leafColumns)=>leafColumns.map((column)=>(function(table, row, column, columnId) {
                                const getRenderValue = ()=>{
                                    var _cell$getValue;
                                    return null != (_cell$getValue = cell.getValue()) ? _cell$getValue : table.options.renderFallbackValue;
                                }, cell = {
                                    id: `${row.id}_${column.id}`,
                                    row,
                                    column,
                                    getValue: ()=>row.getValue(columnId),
                                    renderValue: getRenderValue,
                                    getContext: memo(()=>[
                                            table,
                                            column,
                                            row,
                                            cell
                                        ], (table, column, row, cell)=>({
                                            table,
                                            column,
                                            row,
                                            cell: cell,
                                            getValue: cell.getValue,
                                            renderValue: cell.renderValue
                                        }), {
                                        key: !1,
                                        debug: ()=>table.options.debugAll
                                    })
                                };
                                return table._features.forEach((feature)=>{
                                    Object.assign(cell, feature.createCell?.(cell, column, row, table));
                                }, {}), cell;
                            })(table, row, column, column.id)), {
                        key: !1,
                        debug: ()=>{
                            var _table$options$debugA;
                            return null != (_table$options$debugA = table.options.debugAll) ? _table$options$debugA : table.options.debugRows;
                        }
                    }),
                    _getAllCellsByColumnId: memo(()=>[
                            row.getAllCells()
                        ], (allCells)=>allCells.reduce((acc, cell)=>(acc[cell.column.id] = cell, acc), {}), {
                        key: 'row.getAllCellsByColumnId',
                        debug: ()=>{
                            var _table$options$debugA2;
                            return null != (_table$options$debugA2 = table.options.debugAll) ? _table$options$debugA2 : table.options.debugRows;
                        }
                    })
                };
                for(let i = 0; i < table._features.length; i++){
                    const feature = table._features[i];
                    Object.assign(row, feature?.createRow?.(row, table));
                }
                return row;
            };
            function createColumnHelper() {
                return {
                    accessor: (accessor, column)=>'function' == typeof accessor ? {
                            ...column,
                            accessorFn: accessor
                        } : {
                            ...column,
                            accessorKey: accessor
                        },
                    display: (column)=>column,
                    group: (column)=>column
                };
            }
            function getCoreRowModel() {
                return (table)=>memo(()=>[
                            table.options.data
                        ], (data)=>{
                        const rowModel = {
                            rows: [],
                            flatRows: [],
                            rowsById: {}
                        }, accessRows = function(originalRows, depth, parent) {
                            void 0 === depth && (depth = 0);
                            const rows = [];
                            for(let i = 0; i < originalRows.length; i++){
                                const row = createRow(table, table._getRowId(originalRows[i], i, parent), originalRows[i], i, depth);
                                rowModel.flatRows.push(row), rowModel.rowsById[row.id] = row, rows.push(row), table.options.getSubRows && (row.originalSubRows = table.options.getSubRows(originalRows[i], i), row.originalSubRows?.length && (row.subRows = accessRows(row.originalSubRows, depth + 1, row)));
                            }
                            return rows;
                        };
                        return rowModel.rows = accessRows(data), rowModel;
                    }, {
                        key: !1,
                        debug: ()=>{
                            var _table$options$debugA;
                            return null != (_table$options$debugA = table.options.debugAll) ? _table$options$debugA : table.options.debugTable;
                        },
                        onChange: ()=>{
                            table._autoResetPageIndex();
                        }
                    });
            }
        }
    }
]);
