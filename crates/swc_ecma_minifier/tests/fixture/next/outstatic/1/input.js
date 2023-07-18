(self["webpackChunk_N_E"] = self["webpackChunk_N_E"] || []).push([
  [285], {
    1973:
      (function (module) {
        eval(module.code)
      }),

    1985:
      (function (__unused_webpack_module, exports, __webpack_require__) {

        "use strict";

        function e(e) {
          return e && "object" == typeof e && "default" in e ? e : {
            default: e
          }
        }
        Object.defineProperty(exports, "__esModule", ({
          value: !0
        }));
        var t = e(__webpack_require__(2983)),
          r = e => "checkbox" === e.type,
          s = e => e instanceof Date,
          a = e => null == e;
        const n = e => "object" == typeof e;
        var i = e => !a(e) && !Array.isArray(e) && n(e) && !s(e),
          o = e => i(e) && e.target ? r(e.target) ? e.target.checked : e.target.value : e,
          u = (e, t) => e.has((e => e.substring(0, e.search(/\.\d+(\.|$)/)) || e)(t)),
          l = e => Array.isArray(e) ? e.filter(Boolean) : [],
          c = e => void 0 === e,
          d = (e, t, r) => {
            if (!t || !i(e)) return r;
            const s = l(t.split(/[,[\].]+?/)).reduce((e, t) => a(e) ? e : e[t], e);
            return c(s) || s === e ? c(e[t]) ? r : e[t] : s
          };
        const f = "blur",
          m = "focusout",
          y = "change",
          g = "onBlur",
          h = "onChange",
          p = "onSubmit",
          _ = "onTouched",
          v = "all",
          k = t.default.createContext(null),
          D = () => t.default.useContext(k);
        var C = (e, t, r, s = !0) => {
          const a = {};
          for (const n in e) Object.defineProperty(a, n, {
            get: () => {
              const a = n;
              return t[a] !== v && (t[a] = !s || v), r && (r[a] = !0), e[a]
            }
          });
          return a
        },
          j = 0,
          E = 0,
          O = 0,
          U = 0;

        function B(e) {
          const r = t.default.useRef(e);
          r.current = e, t.default.useEffect(() => {
            const t = !e.disabled && r.current.subject.subscribe({
              next: r.current.callback
            });
            return () => (e => {
              e && e.unsubscribe()
            })(t)
          }, [e.disabled])
        }

        function T(e) {
          const r = D(),
            {
              control: s = r.control,
              disabled: a,
              name: n,
              exact: i
            } = e || {},
            [o, u] = t.default.useState(s._formState),
            l = t.default.useRef({
              isDirty: !1,
              dirtyFields: !1,
              touchedFields: !1,
              isValidating: !1,
              isValid: !1,
              errors: !1
            }),
            c = t.default.useRef(n),
            d = t.default.useRef(!0);
          c.current = n;
          return B({
            disabled: a,
            callback: t.default.useCallback(e => d.current && U(c.current, e.name, i) && E(e, l.current) && u({
              ...s._formState,
              ...e
            }), [s, i]),
            subject: s._subjects.state
          }), t.default.useEffect(() => (d.current = !0, () => {
            d.current = !1
          }), []), C(o, s._proxyFormState, l.current, !1)
        }
        var M = e => "string" == typeof e,
          N = (e, t, r, s) => {
            const a = Array.isArray(e);
            return M(e) ? (s && t.watch.add(e), d(r, e)) : a ? e.map(e => (s && t.watch.add(e), d(r, e))) : (s && (t.watchAll = !0), r)
          },
          L = e => "function" == typeof e,
          R = e => {
            for (const t in e)
              if (L(e[t])) return !0;
            return !1
          };

        function q(e) {
          const r = D(),
            {
              control: s = r.control,
              name: a,
              defaultValue: n,
              disabled: o,
              exact: u
            } = e || {},
            l = t.default.useRef(a);
          l.current = a;
          const d = t.default.useCallback(e => {
            if (U(l.current, e.name, u)) {
              const t = N(l.current, s._names, e.values || s._formValues);
              m(c(l.current) || i(t) && !R(t) ? {
                ...t
              } : Array.isArray(t) ? [...t] : c(t) ? n : t)
            }
          }, [s, u, n]);
          B({
            disabled: o,
            subject: s._subjects.watch,
            callback: d
          });
          const [f, m] = t.default.useState(c(n) ? s._getWatch(a) : n);
          return t.default.useEffect(() => {
            s._removeUnmounted()
          }), f
        }

        function W(e) {
          const r = D(),
            {
              name: s,
              control: a = r.control,
              shouldUnregister: n
            } = e,
            i = u(a._names.array, s),
            l = q({
              control: a,
              name: s,
              defaultValue: d(a._formValues, s, d(a._defaultValues, s, e.defaultValue)),
              exact: !0
            }),
            c = T({
              control: a,
              name: s
            }),
            m = t.default.useRef(a.register(s, {
              ...e.rules,
              value: l
            }));
          return t.default.useEffect(() => {
            const e = (e, t) => {
              const r = d(a._fields, e);
              r && (r._f.mount = t)
            };
            return e(s, !0), () => {
              const t = a._options.shouldUnregister || n;
              (i ? t && !a._stateFlags.action : t) ? a.unregister(s) : e(s, !1)
            }
          }, [s, a, i, n]), {
            field: {
              name: s,
              value: l,
              onChange: t.default.useCallback(e => {
                m.current.onChange({
                  target: {
                    value: o(e),
                    name: s
                  },
                  type: y
                })
              }, [s]),
              onBlur: t.default.useCallback(() => {
                m.current.onBlur({
                  target: {
                    value: d(a._formValues, s),
                    name: s
                  },
                  type: f
                })
              }, [s, a]),
              ref: t.default.useCallback(e => {
                const t = d(a._fields, s);
                e && t && e.focus && (t._f.ref = {
                  focus: () => e.focus(),
                  select: () => e.select(),
                  setCustomValidity: t => e.setCustomValidity(t),
                  reportValidity: () => e.reportValidity()
                })
              }, [s, a._fields])
            },
            formState: c,
            fieldState: Object.defineProperties({}, {
              invalid: {
                get: () => !!d(c.errors, s)
              },
              isDirty: {
                get: () => !!d(c.dirtyFields, s)
              },
              isTouched: {
                get: () => !!d(c.touchedFields, s)
              },
              error: {
                get: () => d(c.errors, s)
              }
            })
          }
        }
        var P = (e, t, r, s, a) => t ? {
          ...r[e],
          types: {
            ...r[e] && r[e].types ? r[e].types : {},
            [s]: a || !0
          }
        } : {},
          $ = e => /^\w*$/.test(e),
          I = e => l(e.replace(/["|']|\]/g, "").split(/\.|\[/));

        function H(e, t, r) {
          let s = -1;
          const a = $(t) ? [t] : I(t),
            n = a.length,
            o = n - 1;
          for (; ++s < n;) {
            const t = a[s];
            let n = r;
            if (s !== o) {
              const r = e[t];
              n = i(r) || Array.isArray(r) ? r : isNaN(+a[s + 1]) ? {} : []
            }
            e[t] = n, e = e[t]
          }
          return e
        }
        const z = (e, t, r) => {
          for (const s of r || Object.keys(e)) {
            const r = d(e, s);
            if (r) {
              const {
                _f: e,
                ...s
              } = r;
              if (e && t(e.name)) {
                if (e.ref.focus && c(e.ref.focus())) break;
                if (e.refs) {
                  e.refs[0].focus();
                  break
                }
              } else i(s) && z(s, t)
            }
          }
        };
        var G = () => {
          const e = "undefined" == typeof performance ? Date.now() : 1e3 * performance.now();
          return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, t => {
            const r = (16 * Math.random() + e) % 16 | 0;
            return ("x" == t ? r : 3 & r | 8).toString(16)
          })
        },
          K = (e, t, r) => !r && (t.watchAll || t.watch.has(e) || [...t.watch].some(t => e.startsWith(t) && /^\.\w+/.test(e.slice(t.length)))),
          Q = (e, t, r) => {
            const s = l(d(e, r));
            return H(s, "root", t[r]), H(e, r, s), e
          },
          X = e => "boolean" == typeof e,
          Y = e => "file" === e.type,
          Z = e => M(e) || t.default.isValidElement(e),
          ee = e => "radio" === e.type,
          te = e => e instanceof RegExp;
        const re = {
          value: !1,
          isValid: !1
        },
          se = {
            value: !0,
            isValid: !0
          };
        var ae = e => {
          if (Array.isArray(e)) {
            if (e.length > 1) {
              const t = e.filter(e => e && e.checked && !e.disabled).map(e => e.value);
              return {
                value: t,
                isValid: !!t.length
              }
            }
            return e[0].checked && !e[0].disabled ? e[0].attributes && !c(e[0].attributes.value) ? c(e[0].value) || "" === e[0].value ? se : {
              value: e[0].value,
              isValid: !0
            } : se : re
          }
          return re
        };
        const ne = {
          isValid: !1,
          value: null
        };
        var ie = e => Array.isArray(e) ? e.reduce((e, t) => t && t.checked && !t.disabled ? {
          isValid: !0,
          value: t.value
        } : e, ne) : ne;

        var le = 0;

        var de = "undefined" != typeof window && void 0 !== window.HTMLElement && "undefined" != typeof document;

        function fe(e) {
          let t;
          const r = Array.isArray(e);
          if (e instanceof Date) t = new Date(e);
          else if (e instanceof Set) t = new Set(e);
          else {
            if (de && (e instanceof Blob || e instanceof FileList) || !r && !i(e)) return e;
            t = r ? [] : {};
            for (const r in e) {
              if (L(e[r])) {
                t = e;
                break
              }
              t[r] = fe(e[r])
            }
          }
          return t
        }
        var ye = e => ({
          isOnSubmit: !e || e === p,
          isOnBlur: e === g,
          isOnChange: e === h,
          isOnAll: e === v,
          isOnTouch: e === _
        });



        function be(e) {
          for (const t in e)
            if (!c(e[t])) return !1;
          return !0
        }

        function xe(e, t) {
          const r = $(t) ? [t] : I(t),
            s = 1 == r.length ? e : function () {
            }(e, r),
            a = r[r.length - 1];
          let n;
          s && delete s[a];
          for (let t = 0; t < r.slice(0, -1).length; t++) {
            let s, a = -1;
            const o = r.slice(0, -(t + 1)),
              u = o.length - 1;
            for (t > 0 && (n = e); ++a < o.length;) {
              const t = o[a];
              s = s ? s[t] : e[t], u === a && (i(s) && j(s) || Array.isArray(s) && be(s)) && (n ? delete n[t] : delete e[t]), n = s
            }
          }
          return e
        }

        var Ve = e => a(e) || !n(e);

        function Se(e, t) {
          if (Ve(e) || Ve(t)) return e === t;
          if (s(e) && s(t)) return e.getTime() === t.getTime();
          const r = Object.keys(e),
            a = Object.keys(t);
          if (r.length !== a.length) return !1;
          for (const n of r) {
            const r = e[n];
            if (!a.includes(n)) return !1;
            if ("ref" !== n) {
              const e = t[n];
              if (s(r) && s(e) || i(r) && i(e) || Array.isArray(r) && Array.isArray(e) ? !Se(r, e) : r !== e) return !1
            }
          }
          return !0
        }
        var we = e => {
          const t = e ? e.ownerDocument : 0;
          return e instanceof (t && t.defaultView ? t.defaultView.HTMLElement : HTMLElement)
        },
          ke = e => "select-multiple" === e.type,
          De = e => we(e) && e.isConnected;

        function Ce(e, t = {}) {
          const r = Array.isArray(e);
          if (i(e) || r)
            for (const r in e) Array.isArray(e[r]) || i(e[r]) && !R(e[r]) ? (t[r] = Array.isArray(e[r]) ? [] : {}, Ce(e[r], t[r])) : a(e[r]) || (t[r] = !0);
          return t
        }
        var je = (e, t) => function e(t, r, s) {
          const n = Array.isArray(t);
          if (i(t) || n)
            for (const n in t) Array.isArray(t[n]) || i(t[n]) && !R(t[n]) ? c(r) || Ve(s[n]) ? s[n] = Array.isArray(t[n]) ? Ce(t[n], []) : {
              ...Ce(t[n])
            } : e(t[n], a(r) ? {} : r[n], s[n]) : s[n] = !Se(t[n], r[n]);
          return s
        }(e, t, Ce(t)),
          Ee = (e, {
            valueAsNumber: t,
            valueAsDate: r,
            setValueAs: s
          }) => c(e) ? e : t ? "" === e || a(e) ? NaN : +e : r && M(e) ? new Date(e) : s ? s(e) : e;

        function Oe(e) {
          const t = e.ref;
          if (!(e.refs ? e.refs.every(e => e.disabled) : t.disabled)) return Y(t) ? t.files : ee(t) ? ie(e.refs).value : ke(t) ? [...t.selectedOptions].map(({
            value: e
          }) => e) : r(t) ? ae(e.refs).value : Ee(c(t.value) ? e.ref.value : t.value, e)
        }
        var Ue = e => c(e) ? void 0 : te(e) ? e.source : i(e) ? te(e.value) ? e.value.source : e.value : e;

        function Be(e, t, r) {
          const s = d(e, r);
          if (s || $(r)) return {
            error: s,
            name: r
          };
          const a = r.split(".");
          for (; a.length;) {
            const s = a.join("."),
              n = d(t, s),
              i = d(e, s);
            if (n && !Array.isArray(n) && r !== s) return {
              name: r
            };
            if (i && i.type) return {
              name: s,
              error: i
            };
            a.pop()
          }
          return {
            name: r
          }
        }
        const Te = {
          mode: p,
          reValidateMode: h,
          shouldFocusError: !0
        };

        function Me(e = {}) {
          let t, n = {
            ...Te,
            ...e
          },
            i = {
              isDirty: !1,
              isValidating: !1,
              dirtyFields: {},
              isSubmitted: !1,
              submitCount: 0,
              touchedFields: {},
              isSubmitting: !1,
              isSubmitSuccessful: !1,
              isValid: !1,
              errors: {}
            },
            y = {},
            g = fe(n.defaultValues) || {},
            h = n.shouldUnregister ? {} : fe(g),
            p = {
              action: !1,
              mount: !1,
              watch: !1
            },
            _ = {
              mount: new Set,
              unMount: new Set,
              array: new Set,
              watch: new Set
            },
            b = 0,
            x = {};
          const A = {
            isDirty: !1,
            dirtyFields: !1,
            touchedFields: !1,
            isValidating: !1,
            isValid: !1,
            errors: !1
          },
            F = {
            },
            V = ye(n.mode),
            S = ye(n.reValidateMode),
            w = n.criteriaMode === v,
            k = async e => {
              let t = !1;
              return A.isValid && (t = n.resolver ? j((await U()).errors) : await B(y, !0), e || t === i.isValid || (i.isValid = t, F.state.next({
                isValid: t
              }))), t
            }, D = (e, t, r, s) => {
              const a = d(y, e);
              if (a) {
                const n = d(h, e, c(r) ? d(g, e) : r);
                c(n) || s && s.defaultChecked || t ? H(h, e, t ? n : Oe(a._f)) : q(e, n), p.mount && k()
              }
            }, C = (e, t, r, s, a) => {
              let n = !1;
              const o = {
                name: e
              },
                u = d(i.touchedFields, e);
              if (A.isDirty) {
                const e = i.isDirty;
                i.isDirty = o.isDirty = T(), n = e !== o.isDirty
              }
              if (A.dirtyFields && (!r || s)) {
                const r = d(i.dirtyFields, e);
                Se(d(g, e), t) ? xe(i.dirtyFields, e) : H(i.dirtyFields, e, !0), o.dirtyFields = i.dirtyFields, n = n || r !== d(i.dirtyFields, e)
              }
              return r && !u && (H(i.touchedFields, e, r), o.touchedFields = i.touchedFields, n = n || A.touchedFields && u !== r), n && a && F.state.next(o), n ? o : {}
            }, E = async (r, s, a, n) => {
              const o = d(i.errors, r),
                u = A.isValid && i.isValid !== s;
              var l;
              if (e.delayError && a ? (l = () => ((e, t) => {
                H(i.errors, e, t), F.state.next({
                  errors: i.errors
                })
              })(r, a), t = e => {
                clearTimeout(b), b = window.setTimeout(l, e)
              }, t(e.delayError)) : (clearTimeout(b), t = null, a ? H(i.errors, r, a) : xe(i.errors, r)), (a ? !Se(o, a) : o) || !j(n) || u) {
                const e = {
                  ...n,
                  ...u ? {
                    isValid: s
                  } : {},
                  errors: i.errors,
                  name: r
                };
                i = {
                  ...i,
                  ...e
                }, F.state.next(e)
              }
              x[r]--, A.isValidating && !Object.values(x).some(e => e) && (F.state.next({
                isValidating: !1
              }), x = {})
            }, U = async e => n.resolver ? await n.resolver({
              ...h
            }, n.context, ((e, t, r, s) => {
              const a = {};
              for (const r of e) {
                const e = d(t, r);
                e && H(a, r, e._f)
              }
              return {
                criteriaMode: r,
                names: [...e],
                fields: a,
                shouldUseNativeValidation: s
              }
            })(e || _.mount, y, n.criteriaMode, n.shouldUseNativeValidation)) : {}, B = async (e, t, r = {
              valid: !0
            }) => {

            }, T = (e, t) => (e && t && H(h, e, t), !Se(G(), g)), q = (e, t, s = {}) => {
              const n = d(y, e);
              let i = t;
              if (n) {
                const s = n._f;
                s && (!s.disabled && H(h, e, Ee(t, s)), i = de && we(s.ref) && a(t) ? "" : t, ke(s.ref) ? [...s.ref.options].forEach(e => e.selected = i.includes(e.value)) : s.refs ? r(s.ref) ? s.refs.length > 1 ? s.refs.forEach(e => !e.disabled && (e.checked = Array.isArray(i) ? !!i.find(t => t === e.value) : i === e.value)) : s.refs[0] && (s.refs[0].checked = !!i) : s.refs.forEach(e => e.checked = e.value === i) : Y(s.ref) ? s.ref.value = "" : (s.ref.value = i, s.ref.type || F.watch.next({
                  name: e
                })))
              } (s.shouldDirty || s.shouldTouch) && C(e, i, s.shouldTouch, s.shouldDirty, !0), s.shouldValidate && I(e)
            }, W = (e, t, r) => {
              for (const a in t) {
                const n = t[a],
                  i = `${e}.${a}`,
                  o = d(y, i);
                !_.array.has(e) && Ve(n) && (!o || o._f) || s(n) ? q(i, n, r) : W(i, n, r)
              }
            }, $ = async e => {
              const r = e.target;
              let s = r.name;
              const a = d(y, s);
              if (a) {
                let l, c;
                const g = r.type ? Oe(a._f) : o(e),
                  p = e.type === f || e.type === m,
                  v = !((u = a._f).mount && (u.required || u.min || u.max || u.maxLength || u.minLength || u.pattern || u.validate) || n.resolver || d(i.errors, s) || a._f.deps) || ((e, t, r, s, a) => !a.isOnAll && (!r && a.isOnTouch ? !(t || e) : (r ? s.isOnBlur : a.isOnBlur) ? !e : !(r ? s.isOnChange : a.isOnChange) || e))(p, d(i.touchedFields, s), i.isSubmitted, S, V),
                  b = K(s, _, p);
                H(h, s, g), p ? (a._f.onBlur && a._f.onBlur(e), t && t(0)) : a._f.onChange && a._f.onChange(e);
                const A = C(s, g, p, !1),
                  D = !j(A) || b;
                if (!p && F.watch.next({
                  name: s,
                  type: e.type
                }), v) return D && F.state.next({
                  name: s,
                  ...b ? {} : A
                });
                if (!p && b && F.state.next({}), x[s] = (x[s], 1), F.state.next({
                  isValidating: !0
                }), n.resolver) {
                  const {
                    errors: e
                  } = await U([s]), t = Be(i.errors, y, s), r = Be(e, y, t.name || s);
                  l = r.error, s = r.name, c = j(e)
                } else l = (await le(a, d(h, s), w, n.shouldUseNativeValidation))[s], c = await k(!0);
                a._f.deps && I(a._f.deps), E(s, c, l, A)
              }
              var u
            }, I = async (e, t = {}) => {
              let r, s;
              const a = O(e);
              if (F.state.next({
                isValidating: !0
              }), n.resolver) {
                const t = await (async e => {
                  const {
                    errors: t
                  } = await U();
                  if (e)
                    for (const r of e) {
                      const e = d(t, r);
                      e ? H(i.errors, r, e) : xe(i.errors, r)
                    } else i.errors = t;
                  return t
                })(c(e) ? e : a);
                r = j(t), s = e ? !a.some(e => d(t, e)) : r
              } else e ? (s = (await Promise.all(a.map(async e => {
                const t = d(y, e);
                return await B(t && t._f ? {
                  [e]: t
                } : t)
              }))).every(Boolean), (s || i.isValid) && k()) : s = r = await B(y);
              return F.state.next({
                ...!M(e) || A.isValid && r !== i.isValid ? {} : {
                  name: e
                },
                ...n.resolver ? {
                  isValid: r
                } : {},
                errors: i.errors,
                isValidating: !1
              }), t.shouldFocus && !s && z(y, e => d(i.errors, e), e ? a : _.mount), s
            }, G = e => {
              const t = {
                ...g,
                ...p.mount ? h : {}
              };
              return c(e) ? t : M(e) ? d(t, e) : e.map(e => d(t, e))
            }, te = (e, t = {}) => {
              let s = d(y, e);
              const a = X(t.disabled);
              return H(y, e, {
                _f: {
                  ...s && s._f ? s._f : {
                    ref: {
                      name: e
                    }
                  },
                  name: e,
                  mount: !0,
                  ...t
                }
              }), _.mount.add(e), s ? a && H(h, e, t.disabled ? void 0 : d(h, e, Oe(s._f))) : D(e, !0, t.value), {
                ...a ? {
                  disabled: t.disabled
                } : {},
                ...n.shouldUseNativeValidation ? {
                  required: !!t.required,
                  min: Ue(t.min),
                  max: Ue(t.max),
                  minLength: Ue(t.minLength),
                  maxLength: Ue(t.maxLength),
                  pattern: Ue(t.pattern)
                } : {},
                name: e,
                onChange: $,
                onBlur: $,
                ref: a => {
                  if (a) {
                    te(e, t), s = d(y, e);
                    const n = c(a.value) && a.querySelectorAll && a.querySelectorAll("input,select,textarea")[0] || a,
                      i = (e => ee(e) || r(e))(n),
                      o = s._f.refs || [];
                    if (i ? o.find(e => e === n) : n === s._f.ref) return;
                    H(y, e, {
                      _f: {
                        ...s._f,
                        ...i ? {
                          refs: [...o.filter(De), n, ...Array.isArray(d(g, e)) ? [{}] : []],
                          ref: {
                            type: n.type,
                            name: e
                          }
                        } : {
                          ref: n
                        }
                      }
                    }), D(e, !1, void 0, n)
                  } else s = d(y, e, {}), s._f && (s._f.mount = !1), (n.shouldUnregister || t.shouldUnregister) && (!u(_.array, e) || !p.action) && _.unMount.add(e)
                }
              }
            };

        }
        exports.Controller = e => e.render(W(e)), exports.FormProvider = e => {
          const {
            children: r,
            ...s
          } = e;
          return t.default.createElement(k.Provider, {
            value: s
          }, r)
        }, exports.appendErrors = P, exports.get = d, exports.set = H, exports.useController = W, exports.useFieldArray = function (e) {
          const r = D(),
            {
              control: s = r.control,
              name: a,
              keyName: n = "id",
              shouldUnregister: i
            } = e,
            [o, u] = t.default.useState(s._getFieldArray(a)),
            l = t.default.useRef(s._getFieldArray(a).map(G)),
            c = t.default.useRef(o),
            f = t.default.useRef(a),
            m = t.default.useRef(!1);
          f.current = a, c.current = o, s._names.array.add(a), e.rules && s.register(a, e.rules), B({
            callback: t.default.useCallback(({
              values: e,
              name: t
            }) => {
              if (t === f.current || !t) {
                const t = d(e, f.current, []);
                u(t), l.current = t.map(G)
              }
            }, []),
            subject: s._subjects.array
          });
          return t.default.useEffect(() => {
            if (s._stateFlags.action = !1, K(a, s._names) && s._subjects.state.next({}), m.current)
              if (s._options.resolver) s._executeSchema([a]).then(e => {
                const t = d(e.errors, a),
                  r = d(s._formState.errors, a);
                (r ? !t && r.type : t && t.type) && (t ? H(s._formState.errors, a, t) : xe(s._formState.errors, a), s._subjects.state.next({
                  errors: s._formState.errors
                }))
              });
              else {
                const e = d(s._fields, a);
                (!ye(s._options.mode).isOnSubmit || s._formState.isSubmitted) && e && e._f && le(e, d(s._formValues, a), s._options.criteriaMode === v, s._options.shouldUseNativeValidation, !0).then(e => !j(e) && s._subjects.state.next({
                  errors: Q(s._formState.errors, e, a)
                }))
              } s._subjects.watch.next({
                name: a,
                values: s._formValues
              }), s._names.focus && z(s._fields, e => e.startsWith(s._names.focus)), s._names.focus = "", s._proxyFormState.isValid && s._updateValid()
          }, [o, a, s]), t.default.useEffect(() => (!d(s._formValues, a) && s._updateFieldArray(a), () => {
            (s._options.shouldUnregister || i) && s.unregister(a)
          }), [a, s, n, i]), {
          }
        }, exports.useForm = function (e = {}) {
          const r = t.default.useRef(),
            [s, a] = t.default.useState({
              isDirty: !1,
              isValidating: !1,
              dirtyFields: {},
              isSubmitted: !1,
              submitCount: 0,
              touchedFields: {},
              isSubmitting: !1,
              isSubmitSuccessful: !1,
              isValid: !1,
              errors: {}
            });
          r.current ? r.current.control._options = e : r.current = {
            ...Me(e),
            formState: s
          };
          const n = r.current.control,
            i = t.default.useCallback(e => {
              E(e, n._proxyFormState, !0) && (n._formState = {
                ...n._formState,
                ...e
              }, a({
                ...n._formState
              }))
            }, [n]);
          return B({
            subject: n._subjects.state,
            callback: i
          }), t.default.useEffect(() => {
            n._stateFlags.mount || (n._proxyFormState.isValid && n._updateValid(), n._stateFlags.mount = !0), n._stateFlags.watch && (n._stateFlags.watch = !1, n._subjects.state.next({})), n._removeUnmounted()
          }), r.current.formState = C(s, n._proxyFormState), r.current
        }, exports.useFormContext = D, exports.useFormState = T, exports.useWatch = q;
        //# sourceMappingURL=index.cjs.js.map


        /***/
      }),


  }
]);