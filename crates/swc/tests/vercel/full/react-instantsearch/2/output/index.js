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
    var o, l, S = u.indexName, v = u.initialState, x = u.searchClient, y = u.resultsState, w = u.stalledSearchDelay, F = function() {
        E = !0;
    }, _ = function(e) {
        d(e), J.setClient(e), b();
    }, V = function() {
        J.clearCache(), b();
    }, I = function(e) {
        return U.getWidgets().filter(function(e) {
            return Boolean(e.getMetadata);
        }).map(function(t) {
            return t.getMetadata(e);
        });
    }, j = function() {
        var a = U.getWidgets().filter(function(e) {
            return Boolean(e.getSearchParameters);
        }).filter(function(e) {
            return !f(e) && !p(e);
        }).reduce(function(e, t) {
            return t.getSearchParameters(e);
        }, k), n = U.getWidgets().filter(function(e) {
            return Boolean(e.getSearchParameters);
        }).filter(function(e) {
            var t = f(e) && m(e, S), r = p(e) && g(e, S);
            return t || r;
        }).sort(h).reduce(function(e, t) {
            return t.getSearchParameters(e);
        }, a), s = U.getWidgets().filter(function(e) {
            return Boolean(e.getSearchParameters);
        }).filter(function(e) {
            var t = f(e) && !m(e, S), r = p(e) && !g(e, S);
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
    }, b = function() {
        if (!E) {
            var e = j(J.state), t = e.mainParameters, r = e.derivedParameters;
            J.derivedHelpers.slice().forEach(function(e) {
                e.detach();
            }), r.forEach(function(e) {
                var t = e.indexId, r = e.parameters;
                J.derive(function() {
                    return r;
                }).on("result", A({
                    indexId: t
                })).on("error", P);
            }), J.setState(t), J.search();
        }
    }, A = function(n) {
        var s = n.indexId;
        return function(n) {
            var c = D.getState(), i = !J.derivedHelpers.length, u = c.results ? c.results : {};
            u = !i && u.getFacetByName ? {} : u, u = i ? n.results : r(t({}, u), e({}, s, n.results));
            var o = D.getState(), l = o.isSearchStalled;
            J.hasPendingRequests() || (clearTimeout(T), T = null, l = !1), o.resultsFacetValues;
            var d = a(o, [
                "resultsFacetValues"
            ]);
            D.setState(r(t({}, d), {
                results: u,
                isSearchStalled: l,
                searching: !1,
                error: null
            }));
        };
    }, P = function(e) {
        var n = e.error, s = D.getState(), c = s.isSearchStalled;
        J.hasPendingRequests() || (clearTimeout(T), c = !1), s.resultsFacetValues;
        var i = a(s, [
            "resultsFacetValues"
        ]);
        D.setState(r(t({}, i), {
            isSearchStalled: c,
            error: n,
            searching: !1
        }));
    }, R = function() {
        T || (T = setTimeout(function() {
            var e = D.getState(), n = (e.resultsFacetValues, a(e, [
                "resultsFacetValues"
            ]));
            D.setState(r(t({}, n), {
                isSearchStalled: !0
            }));
        }, w));
    }, C = function(a, n) {
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
    }, N = function(a, n) {
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
    }, O = function() {
        var e = I(D.getState().widgets);
        D.setState(r(t({}, D.getState()), {
            metadata: e,
            searching: !0
        })), b();
    }, q = function(e) {
        var t = D.getState().widgets;
        return U.getWidgets().filter(function(e) {
            return Boolean(e.transitionState);
        }).reduce(function(e, r) {
            return r.transitionState(t, e);
        }, e);
    }, B = function(e) {
        var a = I(e);
        D.setState(r(t({}, D.getState()), {
            widgets: e,
            metadata: a,
            searching: !0
        })), b();
    }, H = function(a) {
        var n = a.facetName, s = a.query, c = a.maxFacetHits;
        D.setState(r(t({}, D.getState()), {
            searchingForFacetValues: !0
        })), J.searchForFacetValues(n, s, Math.max(1, Math.min(void 0 === c ? 10 : c, 100))).then(function(a) {
            var c;
            D.setState(r(t({}, D.getState()), {
                error: null,
                searchingForFacetValues: !1,
                resultsFacetValues: r(t({}, D.getState().resultsFacetValues), (e(c = {}, n, a.facetHits), e(c, "query", s), c))
            }));
        }, function(e) {
            D.setState(r(t({}, D.getState()), {
                searchingForFacetValues: !1,
                error: e
            }));
        }).catch(function(e) {
            setTimeout(function() {
                throw e;
            });
        });
    }, W = function(e) {
        k = k.setIndex(e);
    }, M = function() {
        return D.getState().metadata.reduce(function(e, t) {
            return void 0 !== t.id ? e.concat(t.id) : e;
        }, []);
    }, J = s(x, S, t({}, i));
    d(x), J.on("search", R).on("result", A({
        indexId: S
    })).on("error", P);
    var E = !1, T = null, k = J.state, U = c(O);
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
                C(e, a.results);
                return;
            }
            N(e, a);
        }
    }(x, y);
    var D = (o = {
        widgets: void 0 === v ? {} : v,
        metadata: y ? y.metadata.map(function(e) {
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
        results: y ? Array.isArray(y.results) ? y.results.reduce(function(a, n) {
            return r(t({}, a), e({}, n._internalIndexId, new s.SearchResults(new s.SearchParameters(n.state), n.rawResults)));
        }, {}) : new s.SearchResults(new s.SearchParameters(y.state), y.rawResults) : null,
        error: null,
        searching: !1,
        isSearchStalled: !0,
        searchingForFacetValues: !1
    }, l = [], {
        getState: function() {
            return o;
        },
        setState: function(e) {
            o = e, l.forEach(function(e) {
                return e();
            });
        },
        subscribe: function(e) {
            return l.push(e), function() {
                l.splice(l.indexOf(e), 1);
            };
        }
    });
    return {
        store: D,
        widgetsManager: U,
        getWidgetsIds: M,
        getSearchParameters: j,
        onSearchForFacetValues: H,
        onExternalStateUpdate: B,
        transitionState: q,
        updateClient: _,
        updateIndex: W,
        clearCache: V,
        skipSearch: F
    };
}
