(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
  [285], {
    1973:
      (function (module) {
        eval(module.code)
      }),

    1985:
      (function (__unused_webpack_module, exports, __webpack_require__) {
        "use strict";

        var t = 0,
          r = e => "checkbox" === e.type;
        var u = (e, t) => e.has((e => e.substring(0, e.search(/\.\d+(\.|$)/)) || e)(t)),
          d = () => {
          };

        function H(e, t, r) {
        }
        var ee = e => "radio" === e.type;

        function Me(e = {}) {
          let t, n = {
            ...e
          },
            y = {},
            h = 0,
            p = {
            },
            _ = {
            };
          const E = 0, $ = async e => {
            const r = e.target;
            let s = r.name;
            const a = 0;
            if (a) {
              let l, c;
              const p = 0;
              p ? (a._f.onBlur && a._f.onBlur(e), t && t(0)) : a._f.onChange && a._f.onChange(e);
              const A = 0;

              a._f.deps && E(s, c, l, A)
            }
          }, te = (e, t = {}) => {
            let s = 0;
            const a = 0;
            return s ? a && H(h, e, t.disabled ? void 0 : 0) : 0, {
              onChange: $,
              onBlur: $,
              ref: a => {
                if (a) {
                  te(e, t), s = d(y, e);
                  const n = 0;
                  (e => ee(e) || r(e))(n),
                    s._f.refs;
                } else s = d(y, e, {}), s._f && (s._f.mount = !1), (n.shouldUnregister || t.shouldUnregister) && (!u(_.array, e) || !p.action) && _.unMount.add(e)
              }
            }
          };

        }
        exports.useForm = function (e = {}) {
          const r = t.default.useRef();
          r.current ? r.current.control._options = e : r.current = {
            ...Me(e),
          };

        };
      }),


  }
]);