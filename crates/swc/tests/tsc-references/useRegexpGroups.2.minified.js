//// [useRegexpGroups.ts]
var re = RegExp("(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})", "u"), result = re.exec("2015-01-02"), date = result[0], year1 = result.groups.year, year2 = result[1], month1 = result.groups.month, month2 = result[2], day1 = result.groups.day, day2 = result[3], foo = "foo".match(RegExp("(?<bar>foo)")).groups.foo;
