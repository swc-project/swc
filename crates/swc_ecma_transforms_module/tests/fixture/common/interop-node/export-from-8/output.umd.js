(function(global, factory) {
    if (typeof module === "object" && typeof module.exports === "object") factory(exports, require("foo"));
    else if (typeof define === "function" && define.amd) define([
        "exports",
        "foo"
    ], factory);
    else if (global = typeof globalThis !== "undefined" ? globalThis : global || self) factory(global.input = {}, global.foo);
})(this, function(exports, _foo) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    function _export(target, all) {
        for(var name in all)Object.defineProperty(target, name, {
            enumerable: true,
            get: Object.getOwnPropertyDescriptor(all, name).get
        });
    }
    _export(exports, {
        get foo () {
            return _foo.foo;
        },
        get foo1 () {
            return _foo.foo1;
        },
        get foo10 () {
            return _foo.foo10;
        },
        get foo100 () {
            return _foo.foo100;
        },
        get foo11 () {
            return _foo.foo11;
        },
        get foo12 () {
            return _foo.foo12;
        },
        get foo13 () {
            return _foo.foo13;
        },
        get foo14 () {
            return _foo.foo14;
        },
        get foo15 () {
            return _foo.foo15;
        },
        get foo16 () {
            return _foo.foo16;
        },
        get foo17 () {
            return _foo.foo17;
        },
        get foo18 () {
            return _foo.foo18;
        },
        get foo19 () {
            return _foo.foo19;
        },
        get foo2 () {
            return _foo.foo2;
        },
        get foo20 () {
            return _foo.foo20;
        },
        get foo21 () {
            return _foo.foo21;
        },
        get foo22 () {
            return _foo.foo22;
        },
        get foo23 () {
            return _foo.foo23;
        },
        get foo24 () {
            return _foo.foo24;
        },
        get foo25 () {
            return _foo.foo25;
        },
        get foo26 () {
            return _foo.foo26;
        },
        get foo27 () {
            return _foo.foo27;
        },
        get foo28 () {
            return _foo.foo28;
        },
        get foo29 () {
            return _foo.foo29;
        },
        get foo3 () {
            return _foo.foo3;
        },
        get foo30 () {
            return _foo.foo30;
        },
        get foo31 () {
            return _foo.foo31;
        },
        get foo32 () {
            return _foo.foo32;
        },
        get foo33 () {
            return _foo.foo33;
        },
        get foo34 () {
            return _foo.foo34;
        },
        get foo35 () {
            return _foo.foo35;
        },
        get foo36 () {
            return _foo.foo36;
        },
        get foo37 () {
            return _foo.foo37;
        },
        get foo38 () {
            return _foo.foo38;
        },
        get foo39 () {
            return _foo.foo39;
        },
        get foo4 () {
            return _foo.foo4;
        },
        get foo40 () {
            return _foo.foo40;
        },
        get foo41 () {
            return _foo.foo41;
        },
        get foo42 () {
            return _foo.foo42;
        },
        get foo43 () {
            return _foo.foo43;
        },
        get foo44 () {
            return _foo.foo44;
        },
        get foo45 () {
            return _foo.foo45;
        },
        get foo46 () {
            return _foo.foo46;
        },
        get foo47 () {
            return _foo.foo47;
        },
        get foo48 () {
            return _foo.foo48;
        },
        get foo49 () {
            return _foo.foo49;
        },
        get foo5 () {
            return _foo.foo5;
        },
        get foo50 () {
            return _foo.foo50;
        },
        get foo51 () {
            return _foo.foo51;
        },
        get foo52 () {
            return _foo.foo52;
        },
        get foo53 () {
            return _foo.foo53;
        },
        get foo54 () {
            return _foo.foo54;
        },
        get foo55 () {
            return _foo.foo55;
        },
        get foo56 () {
            return _foo.foo56;
        },
        get foo57 () {
            return _foo.foo57;
        },
        get foo58 () {
            return _foo.foo58;
        },
        get foo59 () {
            return _foo.foo59;
        },
        get foo6 () {
            return _foo.foo6;
        },
        get foo60 () {
            return _foo.foo60;
        },
        get foo61 () {
            return _foo.foo61;
        },
        get foo62 () {
            return _foo.foo62;
        },
        get foo63 () {
            return _foo.foo63;
        },
        get foo64 () {
            return _foo.foo64;
        },
        get foo65 () {
            return _foo.foo65;
        },
        get foo66 () {
            return _foo.foo66;
        },
        get foo67 () {
            return _foo.foo67;
        },
        get foo68 () {
            return _foo.foo68;
        },
        get foo69 () {
            return _foo.foo69;
        },
        get foo7 () {
            return _foo.foo7;
        },
        get foo70 () {
            return _foo.foo70;
        },
        get foo71 () {
            return _foo.foo71;
        },
        get foo72 () {
            return _foo.foo72;
        },
        get foo73 () {
            return _foo.foo73;
        },
        get foo74 () {
            return _foo.foo74;
        },
        get foo75 () {
            return _foo.foo75;
        },
        get foo76 () {
            return _foo.foo76;
        },
        get foo77 () {
            return _foo.foo77;
        },
        get foo78 () {
            return _foo.foo78;
        },
        get foo79 () {
            return _foo.foo79;
        },
        get foo8 () {
            return _foo.foo8;
        },
        get foo80 () {
            return _foo.foo80;
        },
        get foo81 () {
            return _foo.foo81;
        },
        get foo82 () {
            return _foo.foo82;
        },
        get foo83 () {
            return _foo.foo83;
        },
        get foo84 () {
            return _foo.foo84;
        },
        get foo85 () {
            return _foo.foo85;
        },
        get foo86 () {
            return _foo.foo86;
        },
        get foo87 () {
            return _foo.foo87;
        },
        get foo88 () {
            return _foo.foo88;
        },
        get foo89 () {
            return _foo.foo89;
        },
        get foo9 () {
            return _foo.foo9;
        },
        get foo90 () {
            return _foo.foo90;
        },
        get foo91 () {
            return _foo.foo91;
        },
        get foo92 () {
            return _foo.foo92;
        },
        get foo93 () {
            return _foo.foo93;
        },
        get foo94 () {
            return _foo.foo94;
        },
        get foo95 () {
            return _foo.foo95;
        },
        get foo96 () {
            return _foo.foo96;
        },
        get foo97 () {
            return _foo.foo97;
        },
        get foo98 () {
            return _foo.foo98;
        },
        get foo99 () {
            return _foo.foo99;
        }
    });
});
