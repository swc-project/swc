var AppType, AppStyle, AppType1, AppStyle1;
(AppType1 = AppType || (AppType = {
})).HeaderDetail = "HeaderDetail", AppType1.HeaderMultiDetail = "HeaderMultiDetail", AppType1.AdvancedList = "AdvancedList", AppType1.Standard = "Standard", AppType1.Relationship = "Relationship", AppType1.Report = "Report", AppType1.Composite = "Composite", AppType1.ListOnly = "ListOnly", AppType1.ModuleSettings = "ModuleSettings", (AppStyle1 = AppStyle || (AppStyle = {
}))[AppStyle1.Tree = 0] = "Tree", AppStyle1[AppStyle1.TreeEntity = 1] = "TreeEntity", AppStyle1[AppStyle1.Standard = 2] = "Standard", AppStyle1[AppStyle1.MiniApp = 3] = "MiniApp", AppStyle1[AppStyle1.PivotTable = 4] = "PivotTable", new Map([
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
]), foo({
    x: !0
}, {
    x: !1
}), foo([
    !0
], [
    !1
]);
