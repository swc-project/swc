System.register([
    "./data.json",
    "./more.json",
    "./all.json"
], function(_export, _context) {
    "use strict";
    var data;
    _export({
        data: void 0,
        more: void 0
    });
    return {
        setters: [
            function(_datajson_ns) {
                data = _datajson_ns.default;
                _export("data", data);
            },
            function(_morejson_ns) {
                _export("more", _morejson_ns.default);
            },
            function(_alljson_ns) {
                var exportObj = {
                    __proto__: null
                };
                for(var key in _alljson_ns)if (key !== "default" && key !== "__esModule") exportObj[key] = _alljson_ns[key];
                _export(exportObj);
            }
        ],
        execute: function() {}
    };
}, [
    {
        assert: {
            type: "json"
        }
    },
    {
        assert: {
            type: "json"
        }
    },
    {
        assert: {
            type: "json"
        }
    }
]);
