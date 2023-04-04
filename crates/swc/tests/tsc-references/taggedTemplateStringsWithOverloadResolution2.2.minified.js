//// [taggedTemplateStringsWithOverloadResolution2.ts]
import { _ as _tagged_template_literal } from "@swc/helpers/_/_tagged_template_literal";
function _templateObject() {
    var data = _tagged_template_literal([
        "",
        ""
    ]);
    return _templateObject = function() {
        return data;
    }, data;
}
function _templateObject1() {
    var data = _tagged_template_literal([
        "",
        ""
    ]);
    return _templateObject1 = function() {
        return data;
    }, data;
}
function foo1() {
    for(var _len = arguments.length, stuff = Array(_len), _key = 0; _key < _len; _key++)stuff[_key] = arguments[_key];
}
function foo2() {
    for(var _len = arguments.length, stuff = Array(_len), _key = 0; _key < _len; _key++)stuff[_key] = arguments[_key];
}
foo1(_templateObject(), 1), foo1([], 1), foo2(_templateObject1(), 1), foo2([], 1);
