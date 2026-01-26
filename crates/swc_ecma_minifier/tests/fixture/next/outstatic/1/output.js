(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
    [
        285
    ],
    {
        1973: function(module) {
            eval(module.code);
        },
        1985: function(e, n, u) {
            "use strict";
            var t = 0;
            function c(e = {}) {
                ({
                    ...e
                });
            }
            n.useForm = function(e = {}) {
                let n = t.default.useRef();
                n.current ? n.current.control._options = e : n.current = {
                    ...c(e)
                };
            };
        }
    }
]);
