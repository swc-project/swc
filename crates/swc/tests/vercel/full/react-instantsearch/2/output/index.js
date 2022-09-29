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
    var o, l, S, v, x, y = u.indexName, w = u.initialState, F = u.searchClient, _ = u.resultsState, V = u.stalledSearchDelay, I = function() {
        U = !0;
    }, j = function(e) {
        d(e), k.setClient(e), R();
    }, b = function() {
        k.clearCache(), R();
    }, A = function(e) {
        return G.getWidgets().filter(function(e) {
            return Boolean(e.getMetadata);
        }).map(function(t) {
            return t.getMetadata(e);
        });
    }, P = function() {
        var a = G.getWidgets().filter(function(e) {
            return Boolean(e.getSearchParameters);
        }).filter(function(e) {
            return !f(e) && !p(e);
        }).reduce(function(e, t) {
            return t.getSearchParameters(e);
        }, z), n = G.getWidgets().filter(function(e) {
            return Boolean(e.getSearchParameters);
        }).filter(function(e) {
            var t = f(e) && m(e, y), r = p(e) && g(e, y);
            return t || r;
        }).sort(h).reduce(function(e, t) {
            return t.getSearchParameters(e);
        }, a), s = G.getWidgets().filter(function(e) {
            return Boolean(e.getSearchParameters);
        }).filter(function(e) {
            var t = f(e) && !m(e, y), r = p(e) && !g(e, y);
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
    }, R = function() {
        if (!U) {
            var e = P(k.state), t = e.mainParameters, r = e.derivedParameters;
            k.derivedHelpers.slice().forEach(function(e) {
                e.detach();
            }), r.forEach(function(e) {
                var t = e.indexId, r = e.parameters;
                k.derive(function() {
                    return r;
                }).on("result", C({
                    indexId: t
                })).on("error", N);
            }), k.setState(t), k.search();
        }
    }, C = function(n) {
        var s = n.indexId;
        return function(n) {
            var c = K.getState(), i = !k.derivedHelpers.length, u = c.results ? c.results : {};
            u = !i && u.getFacetByName ? {} : u, u = i ? n.results : r(t({}, u), e({}, s, n.results));
            var o = K.getState(), l = o.isSearchStalled;
            k.hasPendingRequests() || (clearTimeout(D), D = null, l = !1), o.resultsFacetValues;
            var d = a(o, [
                "resultsFacetValues"
            ]);
            K.setState(r(t({}, d), {
                results: u,
                isSearchStalled: l,
                searching: !1,
                error: null
            }));
        };
    }, N = function(e) {
        var n = e.error, s = K.getState(), c = s.isSearchStalled;
        k.hasPendingRequests() || (clearTimeout(D), c = !1), s.resultsFacetValues;
        var i = a(s, [
            "resultsFacetValues"
        ]);
        K.setState(r(t({}, i), {
            isSearchStalled: c,
            error: n,
            searching: !1
        }));
    }, O = function() {
        if (!D) {
            var e;
            D = setTimeout(function() {
                var e = K.getState(), n = (e.resultsFacetValues, a(e, [
                    "resultsFacetValues"
                ]));
                K.setState(r(t({}, n), {
                    isSearchStalled: !0
                }));
            }, V);
        }
    }, q = function(a, n) {
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
    }, B = function(a, n) {
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
    }, H = function() {
        var e = A(K.getState().widgets);
        K.setState(r(t({}, K.getState()), {
            metadata: e,
            searching: !0
        })), R();
    }, W = function(e) {
        var t = K.getState().widgets;
        return G.getWidgets().filter(function(e) {
            return Boolean(e.transitionState);
        }).reduce(function(e, r) {
            return r.transitionState(t, e);
        }, e);
    }, M = function(e) {
        var a = A(e);
        K.setState(r(t({}, K.getState()), {
            widgets: e,
            metadata: a,
            searching: !0
        })), R();
    }, J = function(a) {
        var n = a.facetName, s = a.query, c = a.maxFacetHits;
        K.setState(r(t({}, K.getState()), {
            searchingForFacetValues: !0
        })), k.searchForFacetValues(n, s, Math.max(1, Math.min(void 0 === c ? 10 : c, 100))).then(function(a) {
            var c;
            K.setState(r(t({}, K.getState()), {
                error: null,
                searchingForFacetValues: !1,
                resultsFacetValues: r(t({}, K.getState().resultsFacetValues), (e(c = {}, n, a.facetHits), e(c, "query", s), c))
            }));
        }, function(e) {
            K.setState(r(t({}, K.getState()), {
                searchingForFacetValues: !1,
                error: e
            }));
        }).catch(function(e) {
            setTimeout(function() {
                throw e;
            });
        });
    }, E = function(e) {
        z = z.setIndex(e);
    }, T = function() {
        return K.getState().metadata.reduce(function(e, t) {
            return void 0 !== t.id ? e.concat(t.id) : e;
        }, []);
    }, k = s(F, y, t({}, i));
    d(F), k.on("search", O).on("result", C({
        indexId: y
    })).on("error", N);
    var U = !1, D = null, z = k.state, G = c(H);
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
                q(e, a.results);
                return;
            }
            B(e, a);
        }
    }(F, _);
    var K = (v = {
        widgets: void 0 === w ? {} : w,
        metadata: (o = _) ? o.metadata.map(function(e) {
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
        results: _ ? Array.isArray(_.results) ? _.results.reduce(function(a, n) {
            return r(t({}, a), e({}, n._internalIndexId, new s.SearchResults(new s.SearchParameters(n.state), n.rawResults)));
        }, {}) : new s.SearchResults(new s.SearchParameters(_.state), _.rawResults) : null,
        error: null,
        searching: !1,
        isSearchStalled: !0,
        searchingForFacetValues: !1
    }, x = [], {
        getState: function() {
            return v;
        },
        setState: function(e) {
            v = e, x.forEach(function(e) {
                return e();
            });
        },
        subscribe: function(e) {
            return x.push(e), function() {
                x.splice(x.indexOf(e), 1);
            };
        }
    });
    return {
        store: K,
        widgetsManager: G,
        getWidgetsIds: T,
        getSearchParameters: P,
        onSearchForFacetValues: J,
        onExternalStateUpdate: M,
        transitionState: W,
        updateClient: j,
        updateIndex: E,
        clearCache: b,
        skipSearch: I
    };
}
