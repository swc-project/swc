(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [
        285
    ],
    {
        1973: function(module) {
            eval(module.code);
        },
        1985: function(n, e, u) {
            "use strict";
            var c = 0;
            function t(n = {}) {
                ({
                    ...n
                });
            }
            e.useForm = function(n = {}) {
                const e = c.default.useRef();
                e.current ? e.current.control._options = n : e.current = {
                    ...t(n)
                };
            };
        }
    }
]);
