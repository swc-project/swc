const ZQLExport: IZQL = class ZQL__2 {
    private static requiredMap__0 = {
        [ZQLAction.QUERY]: [
            'tableName'
        ],
        [ZQLAction.SUM]: [
            'tableName',
            'fields',
            'sumBy'
        ],
        [ZQLAction.COUNT]: [
            'tableName'
        ],
        [ZQLAction.GET_API]: [
            'api',
            'output'
        ],
        [ZQLAction.SEARCH]: [
            'keyword'
        ]
    };
    private static zqlQueryTemplate__0: (...values: any[]) => string = ZQL__2.zqlTemplateParser`query ${'fnName'}${'fnName?.('}${'tableName'}${'fields?..'}${'fields'}${'fnName?.)'} ${'condition?.where'} ${'condition'} ${'restrictBy'} ${'returnWith'} ${'groupBy'} ${'orderBy'} ${'orderDirection'} ${'limit'} ${'offset'} ${'namedAs'}`;
};
