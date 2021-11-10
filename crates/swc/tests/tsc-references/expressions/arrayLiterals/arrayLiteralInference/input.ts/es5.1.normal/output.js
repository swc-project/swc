var AppType1;
export { AppType1 as AppType };
(function(AppType) {
    AppType["HeaderDetail"] = "HeaderDetail";
    AppType["HeaderMultiDetail"] = "HeaderMultiDetail";
    AppType["AdvancedList"] = "AdvancedList";
    AppType["Standard"] = "Standard";
    AppType["Relationship"] = "Relationship";
    AppType["Report"] = "Report";
    AppType["Composite"] = "Composite";
    AppType["ListOnly"] = "ListOnly";
    AppType["ModuleSettings"] = "ModuleSettings";
})(AppType1 || (AppType1 = {
}));
var AppStyle1;
export { AppStyle1 as AppStyle };
(function(AppStyle) {
    AppStyle[AppStyle["Tree"] = 0] = "Tree";
    AppStyle[AppStyle["TreeEntity"] = 1] = "TreeEntity";
    AppStyle[AppStyle["Standard"] = 2] = "Standard";
    AppStyle[AppStyle["MiniApp"] = 3] = "MiniApp";
    AppStyle[AppStyle["PivotTable"] = 4] = "PivotTable";
})(AppStyle1 || (AppStyle1 = {
}));
var appTypeStylesWithError = new Map([
    [
        AppType1.Standard,
        [
            AppStyle1.Standard,
            AppStyle1.MiniApp
        ]
    ],
    [
        AppType1.Relationship,
        [
            AppStyle1.Standard,
            AppStyle1.Tree,
            AppStyle1.TreeEntity
        ]
    ],
    [
        AppType1.AdvancedList,
        [
            AppStyle1.Standard,
            AppStyle1.MiniApp
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
