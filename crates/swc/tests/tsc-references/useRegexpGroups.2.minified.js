//// [useRegexpGroups.ts]
import { _ as _wrap_reg_exp } from "@swc/helpers/_/_wrap_reg_exp";
var result = _wrap_reg_exp(RegExp("(\\d{4})-(\\d{2})-(\\d{2})", "u"), {
    year: 1,
    month: 2,
    day: 3
}).exec("2015-01-02");
result[0], result.groups.year, result[1], result.groups.month, result[2], result.groups.day, result[3], "foo".match(_wrap_reg_exp(/(foo)/, {
    bar: 1
})).groups.foo;
