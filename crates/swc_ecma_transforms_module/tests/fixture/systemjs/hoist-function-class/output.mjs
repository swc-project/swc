System.register([], function(_export, _context) {
    "use strict";
    var HoistedClass, HoistedClassDefaultExport, HoistedClassExport;
    function hoisted() {
        return HoistedClass, HoistedClassExport, HoistedClassDefaultExport;
    }
    _export({
        HoistedClassExport: void 0,
        default: void 0,
        hoisted: hoisted
    });
    return {
        setters: [],
        execute: function() {
            HoistedClass = class HoistedClass {
            };
            _export("HoistedClassExport", HoistedClassExport = class HoistedClassExport {
            });
            _export("default", HoistedClassDefaultExport = class HoistedClassDefaultExport {
            });
        }
    };
});
