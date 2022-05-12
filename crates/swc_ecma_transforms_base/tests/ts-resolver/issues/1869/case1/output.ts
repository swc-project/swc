const ZQLExport__1: IZQL = class ZQL__3 {
    private static requiredMap = {
        [ZQLAction.QUERY]: [
            "tableName"
        ],
        [ZQLAction.SUM]: [
            "tableName",
            "fields",
            "sumBy"
        ],
        [ZQLAction.COUNT]: [
            "tableName"
        ],
        [ZQLAction.GET_API]: [
            "api",
            "output"
        ],
        [ZQLAction.SEARCH]: [
            "keyword"
        ]
    };
    private static zqlQueryTemplate: (...values: any[]) => string = ZQL__3.zqlTemplateParser`query ${"fnName"}${"fnName?.("}${"tableName"}${"fields?.."}${"fields"}${"fnName?.)"} ${"condition?.where"} ${"condition"} ${"restrictBy"} ${"returnWith"} ${"groupBy"} ${"orderBy"} ${"orderDirection"} ${"limit"} ${"offset"} ${"namedAs"}`;
};
