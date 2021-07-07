const ZQLExport = class ZQL {

    static requiredMap = {
        [ZQLAction.QUERY]: ['tableName'],
        [ZQLAction.SUM]: ['tableName', 'fields', 'sumBy'],
        [ZQLAction.COUNT]: ['tableName'],
        [ZQLAction.GET_API]: ['api', 'output'],
        [ZQLAction.SEARCH]: ['keyword']
    }
    static zqlQueryTemplate = ZQL.zqlTemplateParser`query ${'fnName'}${'fnName?.('}${'tableName'}${'fields?..'}${'fields'}${'fnName?.)'} ${'condition?.where'} ${'condition'} ${'restrictBy'} ${'returnWith'} ${'groupBy'} ${'orderBy'} ${'orderDirection'} ${'limit'} ${'offset'} ${'namedAs'}`
}