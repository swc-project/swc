var _wrap_reg_exp = require("@swc/helpers/_/_wrap_reg_exp");
var match = "IJobHeader[[ModuleName]]".match(_wrap_reg_exp._(/IJobHeader\[\[([A-Za-z]+)\]\]/, {
    moduleName: 1
}, "IJobHeader\\[\\[(?<moduleName>[A-Za-z]+)\\]\\]"));
