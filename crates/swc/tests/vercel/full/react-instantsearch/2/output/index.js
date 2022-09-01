import e from "@swc/helpers/src/_define_property.mjs";
import t from "@swc/helpers/src/_object_spread.mjs";
import r from "@swc/helpers/src/_object_spread_props.mjs";
import a from "@swc/helpers/src/_object_without_properties.mjs";
import n from "@swc/helpers/src/_to_consumable_array.mjs";
import s from "algoliasearch-helper";
import i from "./createWidgetsManager";
import { HIGHLIGHT_TAGS as c } from "./highlight";
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
    var o = u.indexName, l = u.initialState, S = u.searchClient, v = u.resultsState, x = u.stalledSearchDelay, w = function() {
        D = !0;
    }, y = function(e) {
        d(e), E.setClient(e), $();
    }, _ = function() {
        E.clearCache(), $();
    }, F = function(e) {
        return J.getWidgets().filter(function(e) {
            return Boolean(e.getMetadata);
        }).map(function(t) {
            return t.getMetadata(e);
        });
    }, V = function() {
        var a = J.getWidgets().filter(function(e) {
            return Boolean(e.getSearchParameters);
        }).filter(function(e) {
            return !f(e) && !p(e);
        }).reduce(function(e, t) {
            return t.getSearchParameters(e);
        }, G), n = J.getWidgets().filter(function(e) {
            return Boolean(e.getSearchParameters);
        }).filter(function(e) {
            var t = f(e) && m(e, o), r = p(e) && g(e, o);
            return t || r;
        }).sort(h).reduce(function(e, t) {
            return t.getSearchParameters(e);
        }, a), s = J.getWidgets().filter(function(e) {
            return Boolean(e.getSearchParameters);
        }).filter(function(e) {
            var t = f(e) && !m(e, o), r = p(e) && !g(e, o);
            return t || r;
        }).sort(h).reduce(function(a, n) {
            var s = f(n) ? n.props.indexContextValue.targetedIndex : n.props.indexId, i = a[s] || [];
            return r(t({}, a), e({}, s, i.concat(n)));
        }, {}), i = Object.keys(s).map(function(e) {
            return {
                parameters: s[e].reduce(function(e, t) {
                    return t.getSearchParameters(e);
                }, a),
                indexId: e
            };
        });
        return {
            mainParameters: n,
            derivedParameters: i
        };
    }, $ = function() {
        if (!D) {
            var e = V(E.state), t = e.mainParameters, r = e.derivedParameters;
            E.derivedHelpers.slice().forEach(function(e) {
                e.detach();
            }), r.forEach(function(e) {
                var t = e.indexId, r = e.parameters;
                E.derive(function() {
                    return r;
                }).on("result", I({
                    indexId: t
                })).on("error", P);
            }), E.setState(t), E.search();
        }
    }, I = function(n) {
        var s = n.indexId;
        return function(n) {
            var i = K.getState(), c = !E.derivedHelpers.length, u = i.results ? i.results : {};
            u = !c && u.getFacetByName ? {} : u, u = c ? n.results : r(t({}, u), e({}, s, n.results));
            var o = K.getState(), l = o.isSearchStalled;
            E.hasPendingRequests() || (clearTimeout(z), z = null, l = !1), o.resultsFacetValues;
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
    }, P = function(e) {
        var n = e.error, s = K.getState(), i = s.isSearchStalled;
        E.hasPendingRequests() || (clearTimeout(z), i = !1), s.resultsFacetValues;
        var c = a(s, [
            "resultsFacetValues"
        ]);
        K.setState(r(t({}, c), {
            isSearchStalled: i,
            error: n,
            searching: !1
        }));
    }, R = function() {
        if (!z) {
            var e;
            z = setTimeout(function() {
                var e = K.getState(), n = (e.resultsFacetValues, a(e, [
                    "resultsFacetValues"
                ]));
                K.setState(r(t({}, n), {
                    isSearchStalled: !0
                }));
            }, x);
        }
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
                    }, []), 
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
    }, j = function(a, n) {
        if (a.transporter) {
            a.transporter.responsesCache.set({
                method: "search",
                args: [
                    n.rawResults.map(function(e) {
                        return {
                            indexName: e.index,
                            params: e.params
                        };
                    }), 
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
    }, b = function() {
        var e = F(K.getState().widgets);
        K.setState(r(t({}, K.getState()), {
            metadata: e,
            searching: !0
        })), $();
    }, A = function(e) {
        var t = K.getState().widgets;
        return J.getWidgets().filter(function(e) {
            return Boolean(e.transitionState);
        }).reduce(function(e, r) {
            return r.transitionState(t, e);
        }, e);
    }, q = function(e) {
        var a = F(e);
        K.setState(r(t({}, K.getState()), {
            widgets: e,
            metadata: a,
            searching: !0
        })), $();
    }, H = function(a) {
        var n = a.facetName, s = a.query, i = a.maxFacetHits;
        K.setState(r(t({}, K.getState()), {
            searchingForFacetValues: !0
        })), E.searchForFacetValues(n, s, Math.max(1, Math.min(void 0 === i ? 10 : i, 100))).then(function(a) {
            var i;
            K.setState(r(t({}, K.getState()), {
                error: null,
                searchingForFacetValues: !1,
                resultsFacetValues: r(t({}, K.getState().resultsFacetValues), (e(i = {}, n, a.facetHits), e(i, "query", s), i))
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
    }, N = function(e) {
        G = G.setIndex(e);
    }, W = function() {
        return K.getState().metadata.reduce(function(e, t) {
            return void 0 !== t.id ? e.concat(t.id) : e;
        }, []);
    }, E = s(S, o, t({}, c));
    d(S), E.on("search", R).on("result", I({
        indexId: o
    })).on("error", P);
    var M, k, O, U, B, D = !1, z = null, G = E.state, J = i(b);
    !function(e, a) {
        if (a && (e.transporter && !e._cacheHydrated || e._useCache && "function" == typeof e.addAlgoliaAgent)) {
            if (e.transporter && !e._cacheHydrated) {
                e._cacheHydrated = !0;
                var s = e.search;
                e.search = function(a) {
                    for(var i = arguments.length, c = Array(i > 1 ? i - 1 : 0), u = 1; u < i; u++)c[u - 1] = arguments[u];
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
                        ].concat(n(c))
                    }, function() {
                        return s.apply(void 0, [
                            a
                        ].concat(n(c)));
                    });
                };
            }
            if (Array.isArray(a.results)) {
                C(e, a.results);
                return;
            }
            j(e, a);
        }
    }(S, v);
    var K = (O = k = {
        widgets: void 0 === l ? {} : l,
        metadata: (B = v, B ? B.metadata.map(function(e) {
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
        }) : []),
        results: (M = v) ? Array.isArray(M.results) ? M.results.reduce(function(a, n) {
            return r(t({}, a), e({}, n._internalIndexId, new s.SearchResults(new s.SearchParameters(n.state), n.rawResults)));
        }, {}) : new s.SearchResults(new s.SearchParameters(M.state), M.rawResults) : null,
        error: null,
        searching: !1,
        isSearchStalled: !0,
        searchingForFacetValues: !1
    }, U = [], {
        getState: function() {
            return O;
        },
        setState: function(e) {
            O = e, U.forEach(function(e) {
                return e();
            });
        },
        subscribe: function(e) {
            return U.push(e), function() {
                U.splice(U.indexOf(e), 1);
            };
        }
    });
    return {
        store: K,
        widgetsManager: J,
        getWidgetsIds: W,
        getSearchParameters: V,
        onSearchForFacetValues: H,
        onExternalStateUpdate: q,
        transitionState: A,
        updateClient: y,
        updateIndex: N,
        clearCache: _,
        skipSearch: w
    };
};
