import e from "@swc/helpers/src/_define_property.mjs";
import t from "@swc/helpers/src/_object_spread.mjs";
import r from "@swc/helpers/src/_object_spread_props.mjs";
import a from "@swc/helpers/src/_object_without_properties.mjs";
import n from "@swc/helpers/src/_to_consumable_array.mjs";
import s from "algoliasearch-helper";
import c from "./createWidgetsManager";
import { HIGHLIGHT_TAGS as i } from "./highlight";
import { hasMultipleIndices as u } from "./indexUtils";
import { version as o } from "react";
import l from "./version";
function d(e) {
    "function" == typeof e.addAlgoliaAgent && (e.addAlgoliaAgent("react (".concat(o, ")")), e.addAlgoliaAgent("react-instantsearch (".concat(l, ")")));
}
var f = function(e) {
    return u({
        ais: e.props.contextValue,
        multiIndexContext: e.props.indexContextValue
    });
}, m = function(e, t) {
    return e.props.indexContextValue.targetedIndex === t;
}, p = function(e) {
    return Boolean(e.props.indexId);
}, g = function(e, t) {
    return e.props.indexId === t;
}, h = function(e, t) {
    var r = p(e), a = p(t);
    return r && !a ? -1 : !r && a ? 1 : 0;
};
export default function S(u) {
    var o, l, S, v = u.indexName, x = u.initialState, y = u.searchClient, w = u.resultsState, F = u.stalledSearchDelay, _ = function() {
        T = !0;
    }, V = function(e) {
        d(e), E.setClient(e), A();
    }, I = function() {
        E.clearCache(), A();
    }, j = function(e) {
        return D.getWidgets().filter(function(e) {
            return Boolean(e.getMetadata);
        }).map(function(t) {
            return t.getMetadata(e);
        });
    }, b = function() {
        var a = D.getWidgets().filter(function(e) {
            return Boolean(e.getSearchParameters);
        }).filter(function(e) {
            return !f(e) && !p(e);
        }).reduce(function(e, t) {
            return t.getSearchParameters(e);
        }, U), n = D.getWidgets().filter(function(e) {
            return Boolean(e.getSearchParameters);
        }).filter(function(e) {
            var t = f(e) && m(e, v), r = p(e) && g(e, v);
            return t || r;
        }).sort(h).reduce(function(e, t) {
            return t.getSearchParameters(e);
        }, a), s = D.getWidgets().filter(function(e) {
            return Boolean(e.getSearchParameters);
        }).filter(function(e) {
            var t = f(e) && !m(e, v), r = p(e) && !g(e, v);
            return t || r;
        }).sort(h).reduce(function(a, n) {
            var s = f(n) ? n.props.indexContextValue.targetedIndex : n.props.indexId, c = a[s] || [];
            return r(t({}, a), e({}, s, c.concat(n)));
        }, {}), c = Object.keys(s).map(function(e) {
            return {
                parameters: s[e].reduce(function(e, t) {
                    return t.getSearchParameters(e);
                }, a),
                indexId: e
            };
        });
        return {
            mainParameters: n,
            derivedParameters: c
        };
    }, A = function() {
        if (!T) {
            var e = b(E.state), t = e.mainParameters, r = e.derivedParameters;
            E.derivedHelpers.slice().forEach(function(e) {
                e.detach();
            }), r.forEach(function(e) {
                var t = e.indexId, r = e.parameters;
                E.derive(function() {
                    return r;
                }).on("result", P({
                    indexId: t
                })).on("error", R);
            }), E.setState(t), E.search();
        }
    }, P = function(n) {
        var s = n.indexId;
        return function(n) {
            var c = z.getState(), i = !E.derivedHelpers.length, u = c.results ? c.results : {};
            u = !i && u.getFacetByName ? {} : u, u = i ? n.results : r(t({}, u), e({}, s, n.results));
            var o = z.getState(), l = o.isSearchStalled;
            E.hasPendingRequests() || (clearTimeout(k), k = null, l = !1), o.resultsFacetValues;
            var d = a(o, [
                "resultsFacetValues"
            ]);
            z.setState(r(t({}, d), {
                results: u,
                isSearchStalled: l,
                searching: !1,
                error: null
            }));
        };
    }, R = function(e) {
        var n = e.error, s = z.getState(), c = s.isSearchStalled;
        E.hasPendingRequests() || (clearTimeout(k), c = !1), s.resultsFacetValues;
        var i = a(s, [
            "resultsFacetValues"
        ]);
        z.setState(r(t({}, i), {
            isSearchStalled: c,
            error: n,
            searching: !1
        }));
    }, C = function() {
        !k && (k = setTimeout(function() {
            var e = z.getState(), n = (e.resultsFacetValues, a(e, [
                "resultsFacetValues"
            ]));
            z.setState(r(t({}, n), {
                isSearchStalled: !0
            }));
        }, F));
    }, N = function(a, n) {
        if (a.transporter) {
            a.transporter.responsesCache.set({
                method: "search",
                args: [
                    n.reduce(function(e, t) {
                        return e.concat(t.rawResults.map(function(e) {
                            return {
                                indexName: e.index,
                                params: e.params
                            };
                        }));
                    }, [])
                ]
            }, {
                results: n.reduce(function(e, t) {
                    return e.concat(t.rawResults);
                }, [])
            });
            return;
        }
        var s = "/1/indexes/*/queries_body_".concat(JSON.stringify({
            requests: n.reduce(function(e, t) {
                return e.concat(t.rawResults.map(function(e) {
                    return {
                        indexName: e.index,
                        params: e.params
                    };
                }));
            }, [])
        }));
        a.cache = r(t({}, a.cache), e({}, s, JSON.stringify({
            results: n.reduce(function(e, t) {
                return e.concat(t.rawResults);
            }, [])
        })));
    }, O = function(a, n) {
        if (a.transporter) {
            a.transporter.responsesCache.set({
                method: "search",
                args: [
                    n.rawResults.map(function(e) {
                        return {
                            indexName: e.index,
                            params: e.params
                        };
                    })
                ]
            }, {
                results: n.rawResults
            });
            return;
        }
        var s = "/1/indexes/*/queries_body_".concat(JSON.stringify({
            requests: n.rawResults.map(function(e) {
                return {
                    indexName: e.index,
                    params: e.params
                };
            })
        }));
        a.cache = r(t({}, a.cache), e({}, s, JSON.stringify({
            results: n.rawResults
        })));
    }, q = function() {
        var e = j(z.getState().widgets);
        z.setState(r(t({}, z.getState()), {
            metadata: e,
            searching: !0
        })), A();
    }, B = function(e) {
        var t = z.getState().widgets;
        return D.getWidgets().filter(function(e) {
            return Boolean(e.transitionState);
        }).reduce(function(e, r) {
            return r.transitionState(t, e);
        }, e);
    }, H = function(e) {
        var a = j(e);
        z.setState(r(t({}, z.getState()), {
            widgets: e,
            metadata: a,
            searching: !0
        })), A();
    }, W = function(a) {
        var n = a.facetName, s = a.query, c = a.maxFacetHits;
        z.setState(r(t({}, z.getState()), {
            searchingForFacetValues: !0
        })), E.searchForFacetValues(n, s, Math.max(1, Math.min(void 0 === c ? 10 : c, 100))).then(function(a) {
            var c;
            z.setState(r(t({}, z.getState()), {
                error: null,
                searchingForFacetValues: !1,
                resultsFacetValues: r(t({}, z.getState().resultsFacetValues), (e(c = {}, n, a.facetHits), e(c, "query", s), c))
            }));
        }, function(e) {
            z.setState(r(t({}, z.getState()), {
                searchingForFacetValues: !1,
                error: e
            }));
        }).catch(function(e) {
            setTimeout(function() {
                throw e;
            });
        });
    }, M = function(e) {
        U = U.setIndex(e);
    }, J = function() {
        return z.getState().metadata.reduce(function(e, t) {
            return void 0 !== t.id ? e.concat(t.id) : e;
        }, []);
    }, E = s(y, v, t({}, i));
    d(y), E.on("search", C).on("result", P({
        indexId: v
    })).on("error", R);
    var T = !1, k = null, U = E.state, D = c(q);
    !function(e, a) {
        if (a && (e.transporter && !e._cacheHydrated || e._useCache && "function" == typeof e.addAlgoliaAgent)) {
            if (e.transporter && !e._cacheHydrated) {
                e._cacheHydrated = !0;
                var s = e.search;
                e.search = function(a) {
                    for(var c = arguments.length, i = Array(c > 1 ? c - 1 : 0), u = 1; u < c; u++)i[u - 1] = arguments[u];
                    var o = a.map(function(e) {
                        var a, n;
                        return r(t({}, e), {
                            params: (a = e.params, n = function(e) {
                                for(var t = arguments.length, r = Array(t > 1 ? t - 1 : 0), a = 1; a < t; a++)r[a - 1] = arguments[a];
                                var n = 0;
                                return e.replace(/%s/g, function() {
                                    return encodeURIComponent(r[n++]);
                                });
                            }, Object.keys(a).map(function(e) {
                                var t;
                                return n("%s=%s", e, (t = a[e], "[object Object]" === Object.prototype.toString.call(t) || "[object Array]" === Object.prototype.toString.call(t)) ? JSON.stringify(a[e]) : a[e]);
                            }).join("&"))
                        });
                    });
                    return e.transporter.responsesCache.get({
                        method: "search",
                        args: [
                            o
                        ].concat(n(i))
                    }, function() {
                        return s.apply(void 0, [
                            a
                        ].concat(n(i)));
                    });
                };
            }
            if (Array.isArray(a.results)) {
                N(e, a.results);
                return;
            }
            O(e, a);
        }
    }(y, w);
    var z = (l = {
        widgets: void 0 === x ? {} : x,
        metadata: (o = w) ? o.metadata.map(function(e) {
            return r(t({
                value: function() {
                    return {};
                }
            }, e), {
                items: e.items && e.items.map(function(e) {
                    return r(t({
                        value: function() {
                            return {};
                        }
                    }, e), {
                        items: e.items && e.items.map(function(e) {
                            return t({
                                value: function() {
                                    return {};
                                }
                            }, e);
                        })
                    });
                })
            });
        }) : [],
        results: w ? Array.isArray(w.results) ? w.results.reduce(function(a, n) {
            return r(t({}, a), e({}, n._internalIndexId, new s.SearchResults(new s.SearchParameters(n.state), n.rawResults)));
        }, {}) : new s.SearchResults(new s.SearchParameters(w.state), w.rawResults) : null,
        error: null,
        searching: !1,
        isSearchStalled: !0,
        searchingForFacetValues: !1
    }, S = [], {
        getState: function() {
            return l;
        },
        setState: function(e) {
            l = e, S.forEach(function(e) {
                return e();
            });
        },
        subscribe: function(e) {
            return S.push(e), function() {
                S.splice(S.indexOf(e), 1);
            };
        }
    });
    return {
        store: z,
        widgetsManager: D,
        getWidgetsIds: J,
        getSearchParameters: b,
        onSearchForFacetValues: W,
        onExternalStateUpdate: H,
        transitionState: B,
        updateClient: V,
        updateIndex: M,
        clearCache: I,
        skipSearch: _
    };
}
