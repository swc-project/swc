import e from "@swc/helpers/src/_define_property.mjs";
import t from "@swc/helpers/src/_object_spread.mjs";
import r from "@swc/helpers/src/_object_spread_props.mjs";
import n from "@swc/helpers/src/_object_without_properties.mjs";
import a from "@swc/helpers/src/_to_consumable_array.mjs";
import s from "algoliasearch-helper";
import i from "./createWidgetsManager";
import { HIGHLIGHT_TAGS as u } from "./highlight";
import { hasMultipleIndices as c } from "./indexUtils";
import { version as o } from "react";
import f from "./version";
function l(e) {
    "function" == typeof e.addAlgoliaAgent && (e.addAlgoliaAgent("react (".concat(o, ")")), e.addAlgoliaAgent("react-instantsearch (".concat(f, ")")));
}
var d = function(e) {
    return c({
        ais: e.props.contextValue,
        multiIndexContext: e.props.indexContextValue
    });
}, m = function(e, t) {
    return e.props.indexContextValue.targetedIndex === t;
}, g = function(e) {
    return Boolean(e.props.indexId);
}, p = function(e, t) {
    return e.props.indexId === t;
}, h = function(e, t) {
    var r = g(e), n = g(t);
    return r && !n ? -1 : !r && n ? 1 : 0;
};
export default function S(c) {
    var o = c.indexName, f = c.initialState, S = c.searchClient, x = c.resultsState, _ = c.stalledSearchDelay, w = function() {
        U = !0;
    }, y = function(e) {
        l(e), b.setClient(e), P();
    }, F = function() {
        b.clearCache(), P();
    }, $ = function(e) {
        return J.getWidgets().filter(function(e) {
            return Boolean(e.getMetadata);
        }).map(function(t) {
            return t.getMetadata(e);
        });
    }, I = function() {
        var n = J.getWidgets().filter(function(e) {
            return Boolean(e.getSearchParameters);
        }).filter(function(e) {
            return !d(e) && !g(e);
        }).reduce(function(e, t) {
            return t.getSearchParameters(e);
        }, G), a = J.getWidgets().filter(function(e) {
            return Boolean(e.getSearchParameters);
        }).filter(function(e) {
            var t = d(e) && m(e, o), r = g(e) && p(e, o);
            return t || r;
        }).sort(h).reduce(function(e, t) {
            return t.getSearchParameters(e);
        }, n), s = J.getWidgets().filter(function(e) {
            return Boolean(e.getSearchParameters);
        }).filter(function(e) {
            var t = d(e) && !m(e, o), r = g(e) && !p(e, o);
            return t || r;
        }).sort(h).reduce(function(n, a) {
            var s = d(a) ? a.props.indexContextValue.targetedIndex : a.props.indexId, i = n[s] || [];
            return r(t({}, n), e({}, s, i.concat(a)));
        }, {}), i = Object.keys(s).map(function(e) {
            return {
                parameters: s[e].reduce(function(e, t) {
                    return t.getSearchParameters(e);
                }, n),
                indexId: e
            };
        });
        return {
            mainParameters: a,
            derivedParameters: i
        };
    }, P = function() {
        if (!U) {
            var e = I(b.state), t = e.mainParameters, r = e.derivedParameters;
            b.derivedHelpers.slice().forEach(function(e) {
                e.detach();
            }), r.forEach(function(e) {
                var t = e.indexId, r = e.parameters, n = b.derive(function() {
                    return r;
                });
                n.on("result", V({
                    indexId: t
                })).on("error", R);
            }), b.setState(t), b.search();
        }
    }, V = function(a) {
        var s = a.indexId;
        return function(a) {
            var i = K.getState(), u = !b.derivedHelpers.length, c = i.results ? i.results : {};
            c = !u && c.getFacetByName ? {} : c, c = u ? a.results : r(t({}, c), e({}, s, a.results));
            var o = K.getState(), f = o.isSearchStalled;
            b.hasPendingRequests() || (clearTimeout(z), z = null, f = !1), o.resultsFacetValues;
            var l = n(o, [
                "resultsFacetValues"
            ]);
            K.setState(r(t({}, l), {
                results: c,
                isSearchStalled: f,
                searching: !1,
                error: null
            }));
        };
    }, R = function(e) {
        var a = e.error, s = K.getState(), i = s.isSearchStalled;
        b.hasPendingRequests() || (clearTimeout(z), i = !1), s.resultsFacetValues;
        var u = n(s, [
            "resultsFacetValues"
        ]);
        K.setState(r(t({}, u), {
            isSearchStalled: i,
            error: a,
            searching: !1
        }));
    }, C = function() {
        if (!z) {
            var e;
            z = setTimeout(function() {
                var e = K.getState(), a = (e.resultsFacetValues, n(e, [
                    "resultsFacetValues"
                ]));
                K.setState(r(t({}, a), {
                    isSearchStalled: !0
                }));
            }, _);
        }
    }, A = function(n, a) {
        if (n.transporter) {
            n.transporter.responsesCache.set({
                method: "search",
                args: [
                    a.reduce(function(e, t) {
                        return e.concat(t.rawResults.map(function(e) {
                            return {
                                indexName: e.index,
                                params: e.params
                            };
                        }));
                    }, []), 
                ]
            }, {
                results: a.reduce(function(e, t) {
                    return e.concat(t.rawResults);
                }, [])
            });
            return;
        }
        var s = "/1/indexes/*/queries_body_".concat(JSON.stringify({
            requests: a.reduce(function(e, t) {
                return e.concat(t.rawResults.map(function(e) {
                    return {
                        indexName: e.index,
                        params: e.params
                    };
                }));
            }, [])
        }));
        n.cache = r(t({}, n.cache), e({}, s, JSON.stringify({
            results: a.reduce(function(e, t) {
                return e.concat(t.rawResults);
            }, [])
        })));
    }, H = function(n, a) {
        if (n.transporter) {
            n.transporter.responsesCache.set({
                method: "search",
                args: [
                    a.rawResults.map(function(e) {
                        return {
                            indexName: e.index,
                            params: e.params
                        };
                    }), 
                ]
            }, {
                results: a.rawResults
            });
            return;
        }
        var s = "/1/indexes/*/queries_body_".concat(JSON.stringify({
            requests: a.rawResults.map(function(e) {
                return {
                    indexName: e.index,
                    params: e.params
                };
            })
        }));
        n.cache = r(t({}, n.cache), e({}, s, JSON.stringify({
            results: a.rawResults
        })));
    }, N = function() {
        var e = $(K.getState().widgets);
        K.setState(r(t({}, K.getState()), {
            metadata: e,
            searching: !0
        })), P();
    }, W = function(e) {
        var t = K.getState().widgets;
        return J.getWidgets().filter(function(e) {
            return Boolean(e.transitionState);
        }).reduce(function(e, r) {
            return r.transitionState(t, e);
        }, e);
    }, q = function(e) {
        var n = $(e);
        K.setState(r(t({}, K.getState()), {
            widgets: e,
            metadata: n,
            searching: !0
        })), P();
    }, E = function(n) {
        var a = n.facetName, s = n.query, i = n.maxFacetHits;
        K.setState(r(t({}, K.getState()), {
            searchingForFacetValues: !0
        })), b.searchForFacetValues(a, s, Math.max(1, Math.min(void 0 === i ? 10 : i, 100))).then(function(n) {
            var i;
            K.setState(r(t({}, K.getState()), {
                error: null,
                searchingForFacetValues: !1,
                resultsFacetValues: r(t({}, K.getState().resultsFacetValues), (e(i = {}, a, n.facetHits), e(i, "query", s), i))
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
    }, k = function(e) {
        G = G.setIndex(e);
    }, M = function() {
        return K.getState().metadata.reduce(function(e, t) {
            return void 0 !== t.id ? e.concat(t.id) : e;
        }, []);
    }, b = s(S, o, t({}, u));
    l(S), b.on("search", C).on("result", V({
        indexId: o
    })).on("error", R);
    var j, B, D, O, U = !1, z = null, G = b.state, J = i(N);
    !function(e, n) {
        if (n && (e.transporter && !e._cacheHydrated || e._useCache && "function" == typeof e.addAlgoliaAgent)) {
            if (e.transporter && !e._cacheHydrated) {
                e._cacheHydrated = !0;
                var s = e.search;
                e.search = function(n) {
                    for(var i = arguments.length, u = Array(i > 1 ? i - 1 : 0), c = 1; c < i; c++)u[c - 1] = arguments[c];
                    var o = n.map(function(e) {
                        var n, a;
                        return r(t({}, e), {
                            params: (n = e.params, a = function(e) {
                                for(var t = arguments.length, r = Array(t > 1 ? t - 1 : 0), n = 1; n < t; n++)r[n - 1] = arguments[n];
                                var a = 0;
                                return e.replace(/%s/g, function() {
                                    return encodeURIComponent(r[a++]);
                                });
                            }, Object.keys(n).map(function(e) {
                                var t;
                                return a("%s=%s", e, (t = n[e], "[object Object]" === Object.prototype.toString.call(t) || "[object Array]" === Object.prototype.toString.call(t)) ? JSON.stringify(n[e]) : n[e]);
                            }).join("&"))
                        });
                    });
                    return e.transporter.responsesCache.get({
                        method: "search",
                        args: [
                            o
                        ].concat(a(u))
                    }, function() {
                        return s.apply(void 0, [
                            n
                        ].concat(a(u)));
                    });
                };
            }
            if (Array.isArray(n.results)) {
                A(e, n.results);
                return;
            }
            H(e, n);
        }
    }(S, x);
    var K = (D = B = {
        widgets: void 0 === f ? {} : f,
        metadata: v(x),
        results: (j = x) ? Array.isArray(j.results) ? j.results.reduce(function(n, a) {
            return r(t({}, n), e({}, a._internalIndexId, new s.SearchResults(new s.SearchParameters(a.state), a.rawResults)));
        }, {}) : new s.SearchResults(new s.SearchParameters(j.state), j.rawResults) : null,
        error: null,
        searching: !1,
        isSearchStalled: !0,
        searchingForFacetValues: !1
    }, O = [], {
        getState: function() {
            return D;
        },
        setState: function(e) {
            D = e, O.forEach(function(e) {
                return e();
            });
        },
        subscribe: function(e) {
            return O.push(e), function() {
                O.splice(O.indexOf(e), 1);
            };
        }
    });
    return {
        store: K,
        widgetsManager: J,
        getWidgetsIds: M,
        getSearchParameters: I,
        onSearchForFacetValues: E,
        onExternalStateUpdate: q,
        transitionState: W,
        updateClient: y,
        updateIndex: k,
        clearCache: F,
        skipSearch: w
    };
};
function v(e) {
    return e ? e.metadata.map(function(e) {
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
    }) : [];
}
