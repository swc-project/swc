define([
    "require",
    "exports",
    "foo"
], function(require, exports, _foo) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    function __export(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            get: all[name],
            enumerable: true
        });
    }
    __export(exports, {
        default: ()=>NotOK
    });
    _foo = _interopRequireDefault(_foo);
    class OK {
        constructor(){
            console.log(_foo.default);
        }
    }
    class NotOK {
        constructor(){
            console.log(_foo.default);
        }
    }
});
