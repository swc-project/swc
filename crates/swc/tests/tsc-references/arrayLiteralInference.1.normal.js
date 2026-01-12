//// [arrayLiteralInference.ts]
// Repro from #31204
export var AppType = /*#__PURE__*/ function(AppType) {
    AppType["HeaderDetail"] = "HeaderDetail";
    AppType["HeaderMultiDetail"] = "HeaderMultiDetail";
    AppType["AdvancedList"] = "AdvancedList";
    AppType["Standard"] = "Standard";
    AppType["Relationship"] = "Relationship";
    AppType["Report"] = "Report";
    AppType["Composite"] = "Composite";
    AppType["ListOnly"] = "ListOnly";
    AppType["ModuleSettings"] = "ModuleSettings";
    return AppType;
}({});
export var AppStyle = /*#__PURE__*/ function(AppStyle) {
    AppStyle[AppStyle["Tree"] = 0] = "Tree";
    AppStyle[AppStyle["TreeEntity"] = 1] = "TreeEntity";
    AppStyle[AppStyle["Standard"] = 2] = "Standard";
    AppStyle[AppStyle["MiniApp"] = 3] = "MiniApp";
    AppStyle[AppStyle["PivotTable"] = 4] = "PivotTable";
    return AppStyle;
}({});
const appTypeStylesWithError = new Map([
    [
        "Standard",
        [
            2,
            3
        ]
    ],
    [
        "Relationship",
        [
            2,
            0,
            1
        ]
    ],
    [
        "AdvancedList",
        [
            2,
            3
        ]
    ]
]);
let b1 = foo({
    x: true
}, {
    x: false
});
let b2 = foo([
    true
], [
    false
]);
