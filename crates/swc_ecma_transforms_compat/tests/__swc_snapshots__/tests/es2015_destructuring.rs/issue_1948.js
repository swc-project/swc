var fn2 = function(arg1, param, arg2, param1) {
    var opt1 = param.opt1, opt2 = param.opt2, opt3 = param1.opt3, opt4 = param1.opt4;
    for(var _len = arguments.length, arg3 = new Array(_len > 4 ? _len - 4 : 0), _key = 4; _key < _len; _key++){
        arg3[_key - 4] = arguments[_key];
    }
    console.log(arg1, opt1, opt2, arg2, opt3, opt4, arg3);
};
function fn3(arg1, param, arg2, param1) {
    var opt1 = param.opt1, opt2 = param.opt2, opt3 = param1.opt3, opt4 = param1.opt4;
    for(var _len = arguments.length, arg3 = new Array(_len > 4 ? _len - 4 : 0), _key = 4; _key < _len; _key++){
        arg3[_key - 4] = arguments[_key];
    }
    console.log(arg1, opt1, opt2, arg2, opt3, opt4, arg3);
}
;
class cls {
    fn4(arg1, param, arg2, param1) {
        var opt1 = param.opt1, opt2 = param.opt2, opt3 = param1.opt3, opt4 = param1.opt4;
        for(var _len = arguments.length, arg3 = new Array(_len > 4 ? _len - 4 : 0), _key = 4; _key < _len; _key++){
            arg3[_key - 4] = arguments[_key];
        }
        console.log(arg1, opt1, opt2, arg2, opt3, opt4, arg3);
    }
    fn5(arg1, arg2) {
        console.log(arg1, arg2);
    }
}
