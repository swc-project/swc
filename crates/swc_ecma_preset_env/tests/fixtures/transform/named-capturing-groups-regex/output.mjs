var re = _wrap_reg_exp(/(\d{4})-(\d{2})-(\d{2})/, {
    year: 1,
    month: 2,
    day: 3
});
var result = "2017-12-23".match(re);
var re2 = _wrap_reg_exp(/IJobHeader\[\[([A-Za-z]+)\]\]/, {
    moduleName: 1
});
var re3 = _wrap_reg_exp(RegExp("<(\\d)+>.*?<\\/\\1>", "su"), {
    tag: 1
});
var re4 = _wrap_reg_exp(/(unnamed)(\d+)/, {
    named: 2
});
var re5 = _wrap_reg_exp(/((\d+))/, {
    outer: 1,
    inner: 2
});
var re6 = _wrap_reg_exp(/(x)|(y)/, {
    a: 1,
    b: 2
});
