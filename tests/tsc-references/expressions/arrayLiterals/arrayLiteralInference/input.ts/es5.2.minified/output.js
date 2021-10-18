var AppType, AppStyle, AppType1, AppStyle1;
(AppType = AppType1 || (AppType1 = {
})).HeaderDetail = "HeaderDetail", AppType.HeaderMultiDetail = "HeaderMultiDetail", AppType.AdvancedList = "AdvancedList", AppType.Standard = "Standard", AppType.Relationship = "Relationship", AppType.Report = "Report", AppType.Composite = "Composite", AppType.ListOnly = "ListOnly", AppType.ModuleSettings = "ModuleSettings", (AppStyle = AppStyle1 || (AppStyle1 = {
}))[AppStyle.Tree = 0] = "Tree", AppStyle[AppStyle.TreeEntity = 1] = "TreeEntity", AppStyle[AppStyle.Standard = 2] = "Standard", AppStyle[AppStyle.MiniApp = 3] = "MiniApp", AppStyle[AppStyle.PivotTable = 4] = "PivotTable", new Map([
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
]), foo({
    x: !0
}, {
    x: !1
}), foo([
    !0
], [
    !1
]);
