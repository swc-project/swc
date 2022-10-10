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
    var o, l = u.indexName, S = u.initialState, v = u.searchClient, x = u.resultsState, y = u.stalledSearchDelay, w = function(e) {
        var t = e, r = [];
        return {
            getState: function() {
                return t;
            },
            setState: function(e) {
                t = e, r.forEach(function(e) {
                    return e();
                });
            },
            subscribe: function(e) {
                return r.push(e), function() {
                    r.splice(r.indexOf(e), 1);
                };
            }
        };
    }, F = function() {
        k = !0;
    }, _ = function(e) {
        d(e), T.setClient(e), b();
    }, V = function() {
        T.clearCache(), b();
    }, I = function(e) {
        return z.getWidgets().filter(function(e) {
            return Boolean(e.getMetadata);
        }).map(function(t) {
            return t.getMetadata(e);
        });
    }, j = function() {
        var a = z.getWidgets().filter(function(e) {
            return Boolean(e.getSearchParameters);
        }).filter(function(e) {
            return !f(e) && !p(e);
        }).reduce(function(e, t) {
            return t.getSearchParameters(e);
        }, D), n = z.getWidgets().filter(function(e) {
            return Boolean(e.getSearchParameters);
        }).filter(function(e) {
            var t = f(e) && m(e, l), r = p(e) && g(e, l);
            return t || r;
        }).sort(h).reduce(function(e, t) {
            return t.getSearchParameters(e);
        }, a), s = z.getWidgets().filter(function(e) {
            return Boolean(e.getSearchParameters);
        }).filter(function(e) {
            var t = f(e) && !m(e, l), r = p(e) && !g(e, l);
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
        if (!k) {
            var e = j(T.state), t = e.mainParameters, r = e.derivedParameters;
            T.derivedHelpers.slice().forEach(function(e) {
                e.detach();
            }), r.forEach(function(e) {
                var t = e.indexId, r = e.parameters;
                T.derive(function() {
                    return r;
                }).on("result", A({
                    indexId: t
                })).on("error", P);
            }), T.setState(t), T.search();
        }
    }, A = function(n) {
        var s = n.indexId;
        return function(n) {
            var c = G.getState(), i = !T.derivedHelpers.length, u = c.results ? c.results : {};
            u = !i && u.getFacetByName ? {} : u, u = i ? n.results : r(t({}, u), e({}, s, n.results));
            var o = G.getState(), l = o.isSearchStalled;
            T.hasPendingRequests() || (clearTimeout(U), U = null, l = !1), o.resultsFacetValues;
            var d = a(o, [
                "resultsFacetValues"
            ]);
            G.setState(r(t({}, d), {
                results: u,
                isSearchStalled: l,
                searching: !1,
                error: null
            }));
        };
    }, P = function(e) {
        var n = e.error, s = G.getState(), c = s.isSearchStalled;
        T.hasPendingRequests() || (clearTimeout(U), c = !1), s.resultsFacetValues;
        var i = a(s, [
            "resultsFacetValues"
        ]);
        G.setState(r(t({}, i), {
            isSearchStalled: c,
            error: n,
            searching: !1
        }));
    }, R = function() {
        !U && (U = setTimeout(function() {
            var e = G.getState(), n = (e.resultsFacetValues, a(e, [
                "resultsFacetValues"
            ]));
            G.setState(r(t({}, n), {
                isSearchStalled: !0
            }));
        }, y));
    }, C = function(e, a) {
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
    }, q = function(a) {
        return a ? Array.isArray(a.results) ? a.results.reduce(function(a, n) {
            return r(t({}, a), e({}, n._internalIndexId, new s.SearchResults(new s.SearchParameters(n.state), n.rawResults)));
        }, {}) : new s.SearchResults(new s.SearchParameters(a.state), a.rawResults) : null;
    }, B = function() {
        var e = I(G.getState().widgets);
        G.setState(r(t({}, G.getState()), {
            metadata: e,
            searching: !0
        })), b();
    }, H = function(e) {
        var t = G.getState().widgets;
        return z.getWidgets().filter(function(e) {
            return Boolean(e.transitionState);
        }).reduce(function(e, r) {
            return r.transitionState(t, e);
        }, e);
    }, W = function(e) {
        var a = I(e);
        G.setState(r(t({}, G.getState()), {
            widgets: e,
            metadata: a,
            searching: !0
        })), b();
    }, M = function(a) {
        var n = a.facetName, s = a.query, c = a.maxFacetHits;
        G.setState(r(t({}, G.getState()), {
            searchingForFacetValues: !0
        })), T.searchForFacetValues(n, s, Math.max(1, Math.min(void 0 === c ? 10 : c, 100))).then(function(a) {
            var c;
            G.setState(r(t({}, G.getState()), {
                error: null,
                searchingForFacetValues: !1,
                resultsFacetValues: r(t({}, G.getState().resultsFacetValues), (e(c = {}, n, a.facetHits), e(c, "query", s), c))
            }));
        }, function(e) {
            G.setState(r(t({}, G.getState()), {
                searchingForFacetValues: !1,
                error: e
            }));
        }).catch(function(e) {
            setTimeout(function() {
                throw e;
            });
        });
    }, J = function(e) {
        D = D.setIndex(e);
    }, E = function() {
        return G.getState().metadata.reduce(function(e, t) {
            return void 0 !== t.id ? e.concat(t.id) : e;
        }, []);
    }, T = s(v, l, t({}, i));
    d(v), T.on("search", R).on("result", A({
        indexId: l
    })).on("error", P);
    var k = !1, U = null, D = T.state, z = c(B);
    C(v, x);
    var G = w({
        widgets: void 0 === S ? {} : S,
        metadata: (o = x) ? o.metadata.map(function(e) {
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
        results: q(x),
        error: null,
        searching: !1,
        isSearchStalled: !0,
        searchingForFacetValues: !1
    });
    return {
        store: G,
        widgetsManager: z,
        getWidgetsIds: E,
        getSearchParameters: j,
        onSearchForFacetValues: M,
        onExternalStateUpdate: W,
        transitionState: H,
        updateClient: _,
        updateIndex: J,
        clearCache: V,
        skipSearch: F
    };
}
