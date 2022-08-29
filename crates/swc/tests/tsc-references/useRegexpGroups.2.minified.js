//// [useRegexpGroups.ts]
var result = RegExp("(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})", "u").exec("2015-01-02");
result[0], result.groups.year, result[1], result.groups.month, result[2], result.groups.day, result[3], "foo".match(RegExp("(?<bar>foo)")).groups.foo;
