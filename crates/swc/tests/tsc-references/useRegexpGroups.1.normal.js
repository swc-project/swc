//// [useRegexpGroups.ts]
import { _ as _wrap_reg_exp } from "@swc/helpers/_/_wrap_reg_exp";
var re = _wrap_reg_exp(RegExp("(\\d{4})-(\\d{2})-(\\d{2})", "u"), {
    year: 1,
    month: 2,
    day: 3
}, "(?<year>\\d{4})-(?<month>\\d{2})-(?<day>\\d{2})");
var result = re.exec("2015-01-02");
var date = result[0];
var year1 = result.groups.year;
var year2 = result[1];
var month1 = result.groups.month;
var month2 = result[2];
var day1 = result.groups.day;
var day2 = result[3];
var foo = "foo".match(_wrap_reg_exp(/(foo)/, {
    bar: 1
}, "(?<bar>foo)")).groups.foo;
