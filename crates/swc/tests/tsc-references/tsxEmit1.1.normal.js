//// [file.tsx]
import { _ as _class_call_check } from "@swc/helpers/_/_class_call_check";
import { _ as _to_consumable_array } from "@swc/helpers/_/_to_consumable_array";
var p;
var selfClosed1 = <div/>;
var selfClosed2 = <div x="1"/>;
var selfClosed3 = <div x='1'/>;
var selfClosed4 = <div x="1" y='0'/>;
var selfClosed5 = <div x={0} y='0'/>;
var selfClosed6 = <div x={"1"} y='0'/>;
var selfClosed7 = <div x={p} y='p'/>;
var openClosed1 = <div></div>;
var openClosed2 = <div n='m'>foo</div>;
var openClosed3 = <div n='m'>{p}</div>;
var openClosed4 = <div n='m'>{p < p}</div>;
var openClosed5 = <div n='m'>{p > p}</div>;
var SomeClass = /*#__PURE__*/ function() {
    "use strict";
    function SomeClass() {
        _class_call_check(this, SomeClass);
    }
    var _proto = SomeClass.prototype;
    _proto.f = function f() {
        var _this = this;
        var rewrites1 = <div>{function() {
            return _this;
        }}</div>;
        var rewrites2 = <div>{[
            p
        ].concat(_to_consumable_array(p), [
            p
        ])}</div>;
        var rewrites3 = <div>{{
            p: p
        }}</div>;
        var rewrites4 = <div a={function() {
            return _this;
        }}></div>;
        var rewrites5 = <div a={[
            p
        ].concat(_to_consumable_array(p), [
            p
        ])}></div>;
        var rewrites6 = <div a={{
            p: p
        }}></div>;
    };
    return SomeClass;
}();
var whitespace1 = <div>      </div>;
var whitespace2 = <div>  {p}    </div>;
var whitespace3 = <div>  
      {p}    
      </div>;
