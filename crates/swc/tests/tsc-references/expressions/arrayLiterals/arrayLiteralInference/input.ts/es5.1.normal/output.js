export var AppType;
(function(AppType1) {
    AppType1["HeaderDetail"] = "HeaderDetail";
    AppType1["HeaderMultiDetail"] = "HeaderMultiDetail";
    AppType1["AdvancedList"] = "AdvancedList";
    AppType1["Standard"] = "Standard";
    AppType1["Relationship"] = "Relationship";
    AppType1["Report"] = "Report";
    AppType1["Composite"] = "Composite";
    AppType1["ListOnly"] = "ListOnly";
    AppType1["ModuleSettings"] = "ModuleSettings";
})(AppType || (AppType = {
}));
export var AppStyle;
(function(AppStyle1) {
    AppStyle1[AppStyle1["Tree"] = 0] = "Tree";
    AppStyle1[AppStyle1["TreeEntity"] = 1] = "TreeEntity";
    AppStyle1[AppStyle1["Standard"] = 2] = "Standard";
    AppStyle1[AppStyle1["MiniApp"] = 3] = "MiniApp";
    AppStyle1[AppStyle1["PivotTable"] = 4] = "PivotTable";
})(AppStyle || (AppStyle = {
}));
var appTypeStylesWithError = new Map([
    [
        AppType.Standard,
        [
            AppStyle.Standard,
            AppStyle.MiniApp
        ]
    ],
    [
        AppType.Relationship,
        [
            AppStyle.Standard,
            AppStyle.Tree,
            AppStyle.TreeEntity
        ]
    ],
    [
        AppType.AdvancedList,
        [
            AppStyle.Standard,
            AppStyle.MiniApp
        ]
    ]
]);
var b1 = foo({
    x: true
}, {
    x: false
});
var b2 = foo([
    true
], [
    false
]);
