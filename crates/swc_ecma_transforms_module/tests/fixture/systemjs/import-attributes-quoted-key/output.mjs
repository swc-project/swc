System.register([
    "./data.json",
    "./load.js",
    "./proto.json"
], function(_export, _context) {
    "use strict";
    var data, load, proto;
    _export({
        data: void 0,
        load: void 0,
        proto: void 0
    });
    return {
        setters: [
            function(_datajson_ns) {
                data = _datajson_ns.default;
                _export("data", data);
            },
            function(_load_ns) {
                load = _load_ns.default;
                _export("load", load);
            },
            function(_protojson_ns) {
                proto = _protojson_ns.default;
                _export("proto", proto);
            }
        ],
        execute: function() {}
    };
}, [
    {
        assert: {
            "resolution-mode": "import",
            type: "json"
        }
    },
    {},
    {
        assert: {
            ["__proto__"]: "x"
        }
    }
]);
