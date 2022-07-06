import a from "@swc/helpers/src/_define_property.mjs";
import b from "@swc/helpers/src/_object_spread.mjs";
import c from "@swc/helpers/src/_object_spread_props.mjs";
import d from "@swc/helpers/src/_object_without_properties.mjs";
import e from "@swc/helpers/src/_to_consumable_array.mjs";
import f from "algoliasearch-helper";
import g from "./createWidgetsManager";
import { HIGHLIGHT_TAGS as h } from "./highlight";
import { hasMultipleIndices as i } from "./indexUtils";
import { version as j } from "react";
import k from "./version";
function l(a) {
    "function" == typeof a.addAlgoliaAgent && (a.addAlgoliaAgent("react (".concat(j, ")")), a.addAlgoliaAgent("react-instantsearch (".concat(k, ")")));
}
var m = function(a) {
    return i({
        ais: a.props.contextValue,
        multiIndexContext: a.props.indexContextValue
    });
}, n = function(a, b) {
    return a.props.indexContextValue.targetedIndex === b;
}, o = function(a) {
    return Boolean(a.props.indexId);
}, p = function(a, b) {
    return a.props.indexId === b;
}, q = function(a, b) {
    var c = o(a), d = o(b);
    return c && !d ? -1 : !c && d ? 1 : 0;
};
export default function r(i) {
    var j = i.indexName, k = i.initialState, r = i.searchClient, t = i.resultsState, u = i.stalledSearchDelay, v = function() {
        R = !0;
    }, w = function(a) {
        l(a), M.setClient(a), A();
    }, x = function() {
        M.clearCache(), A();
    }, y = function(a) {
        return U.getWidgets().filter(function(a) {
            return Boolean(a.getMetadata);
        }).map(function(b) {
            return b.getMetadata(a);
        });
    }, z = function() {
        var d = U.getWidgets().filter(function(a) {
            return Boolean(a.getSearchParameters);
        }).filter(function(a) {
            return !m(a) && !o(a);
        }).reduce(function(a, b) {
            return b.getSearchParameters(a);
        }, T), e = U.getWidgets().filter(function(a) {
            return Boolean(a.getSearchParameters);
        }).filter(function(a) {
            var b = m(a) && n(a, j), c = o(a) && p(a, j);
            return b || c;
        }).sort(q).reduce(function(a, b) {
            return b.getSearchParameters(a);
        }, d), f = U.getWidgets().filter(function(a) {
            return Boolean(a.getSearchParameters);
        }).filter(function(a) {
            var b = m(a) && !n(a, j), c = o(a) && !p(a, j);
            return b || c;
        }).sort(q).reduce(function(d, e) {
            var f = m(e) ? e.props.indexContextValue.targetedIndex : e.props.indexId, g = d[f] || [];
            return c(b({}, d), a({}, f, g.concat(e)));
        }, {}), g = Object.keys(f).map(function(a) {
            return {
                parameters: f[a].reduce(function(a, b) {
                    return b.getSearchParameters(a);
                }, d),
                indexId: a
            };
        });
        return {
            mainParameters: e,
            derivedParameters: g
        };
    }, A = function() {
        if (!R) {
            var a = z(M.state), b = a.mainParameters, c = a.derivedParameters;
            M.derivedHelpers.slice().forEach(function(a) {
                a.detach();
            }), c.forEach(function(a) {
                var b = a.indexId, c = a.parameters, d = M.derive(function() {
                    return c;
                });
                d.on("result", B({
                    indexId: b
                })).on("error", C);
            }), M.setState(b), M.search();
        }
    }, B = function(e) {
        var f = e.indexId;
        return function(e) {
            var g = V.getState(), h = !M.derivedHelpers.length, i = g.results ? g.results : {};
            i = !h && i.getFacetByName ? {} : i, i = h ? e.results : c(b({}, i), a({}, f, e.results));
            var j = V.getState(), k = j.isSearchStalled;
            M.hasPendingRequests() || (clearTimeout(S), S = null, k = !1), j.resultsFacetValues;
            var l = d(j, [
                "resultsFacetValues"
            ]);
            V.setState(c(b({}, l), {
                results: i,
                isSearchStalled: k,
                searching: !1,
                error: null
            }));
        };
    }, C = function(a) {
        var e = a.error, f = V.getState(), g = f.isSearchStalled;
        M.hasPendingRequests() || (clearTimeout(S), g = !1), f.resultsFacetValues;
        var h = d(f, [
            "resultsFacetValues"
        ]);
        V.setState(c(b({}, h), {
            isSearchStalled: g,
            error: e,
            searching: !1
        }));
    }, D = function() {
        if (!S) {
            var a;
            S = setTimeout(function() {
                var a = V.getState(), e = (a.resultsFacetValues, d(a, [
                    "resultsFacetValues"
                ]));
                V.setState(c(b({}, e), {
                    isSearchStalled: !0
                }));
            }, u);
        }
    }, E = function(d, e) {
        if (d.transporter) {
            d.transporter.responsesCache.set({
                method: "search",
                args: [
                    e.reduce(function(a, b) {
                        return a.concat(b.rawResults.map(function(a) {
                            return {
                                indexName: a.index,
                                params: a.params
                            };
                        }));
                    }, []), 
                ]
            }, {
                results: e.reduce(function(a, b) {
                    return a.concat(b.rawResults);
                }, [])
            });
            return;
        }
        var f = "/1/indexes/*/queries_body_".concat(JSON.stringify({
            requests: e.reduce(function(a, b) {
                return a.concat(b.rawResults.map(function(a) {
                    return {
                        indexName: a.index,
                        params: a.params
                    };
                }));
            }, [])
        }));
        d.cache = c(b({}, d.cache), a({}, f, JSON.stringify({
            results: e.reduce(function(a, b) {
                return a.concat(b.rawResults);
            }, [])
        })));
    }, F = function(d, e) {
        if (d.transporter) {
            d.transporter.responsesCache.set({
                method: "search",
                args: [
                    e.rawResults.map(function(a) {
                        return {
                            indexName: a.index,
                            params: a.params
                        };
                    }), 
                ]
            }, {
                results: e.rawResults
            });
            return;
        }
        var f = "/1/indexes/*/queries_body_".concat(JSON.stringify({
            requests: e.rawResults.map(function(a) {
                return {
                    indexName: a.index,
                    params: a.params
                };
            })
        }));
        d.cache = c(b({}, d.cache), a({}, f, JSON.stringify({
            results: e.rawResults
        })));
    }, G = function() {
        var a = y(V.getState().widgets);
        V.setState(c(b({}, V.getState()), {
            metadata: a,
            searching: !0
        })), A();
    }, H = function(a) {
        var b = V.getState().widgets;
        return U.getWidgets().filter(function(a) {
            return Boolean(a.transitionState);
        }).reduce(function(a, c) {
            return c.transitionState(b, a);
        }, a);
    }, I = function(a) {
        var d = y(a);
        V.setState(c(b({}, V.getState()), {
            widgets: a,
            metadata: d,
            searching: !0
        })), A();
    }, J = function(d) {
        var e = d.facetName, f = d.query, g = d.maxFacetHits;
        V.setState(c(b({}, V.getState()), {
            searchingForFacetValues: !0
        })), M.searchForFacetValues(e, f, Math.max(1, Math.min(void 0 === g ? 10 : g, 100))).then(function(d) {
            var g;
            V.setState(c(b({}, V.getState()), {
                error: null,
                searchingForFacetValues: !1,
                resultsFacetValues: c(b({}, V.getState().resultsFacetValues), (a(g = {}, e, d.facetHits), a(g, "query", f), g))
            }));
        }, function(a) {
            V.setState(c(b({}, V.getState()), {
                searchingForFacetValues: !1,
                error: a
            }));
        }).catch(function(a) {
            setTimeout(function() {
                throw a;
            });
        });
    }, K = function(a) {
        T = T.setIndex(a);
    }, L = function() {
        return V.getState().metadata.reduce(function(a, b) {
            return void 0 !== b.id ? a.concat(b.id) : a;
        }, []);
    }, M = f(r, j, b({}, h));
    l(r), M.on("search", D).on("result", B({
        indexId: j
    })).on("error", C);
    var N, O, P, Q, R = !1, S = null, T = M.state, U = g(G);
    !function(a, d) {
        if (d && (a.transporter && !a._cacheHydrated || a._useCache && "function" == typeof a.addAlgoliaAgent)) {
            if (a.transporter && !a._cacheHydrated) {
                a._cacheHydrated = !0;
                var f = a.search;
                a.search = function(d) {
                    for(var g = arguments.length, h = Array(g > 1 ? g - 1 : 0), i = 1; i < g; i++)h[i - 1] = arguments[i];
                    var j = d.map(function(a) {
                        var d, e;
                        return c(b({}, a), {
                            params: (d = a.params, e = function(a) {
                                for(var b = arguments.length, c = Array(b > 1 ? b - 1 : 0), d = 1; d < b; d++)c[d - 1] = arguments[d];
                                var e = 0;
                                return a.replace(/%s/g, function() {
                                    return encodeURIComponent(c[e++]);
                                });
                            }, Object.keys(d).map(function(a) {
                                var b;
                                return e("%s=%s", a, (b = d[a], "[object Object]" === Object.prototype.toString.call(b) || "[object Array]" === Object.prototype.toString.call(b)) ? JSON.stringify(d[a]) : d[a]);
                            }).join("&"))
                        });
                    });
                    return a.transporter.responsesCache.get({
                        method: "search",
                        args: [
                            j
                        ].concat(e(h))
                    }, function() {
                        return f.apply(void 0, [
                            d
                        ].concat(e(h)));
                    });
                };
            }
            if (Array.isArray(d.results)) {
                E(a, d.results);
                return;
            }
            F(a, d);
        }
    }(r, t);
    var V = (P = O = {
        widgets: void 0 === k ? {} : k,
        metadata: s(t),
        results: (N = t) ? Array.isArray(N.results) ? N.results.reduce(function(d, e) {
            return c(b({}, d), a({}, e._internalIndexId, new f.SearchResults(new f.SearchParameters(e.state), e.rawResults)));
        }, {}) : new f.SearchResults(new f.SearchParameters(N.state), N.rawResults) : null,
        error: null,
        searching: !1,
        isSearchStalled: !0,
        searchingForFacetValues: !1
    }, Q = [], {
        getState: function() {
            return P;
        },
        setState: function(a) {
            P = a, Q.forEach(function(a) {
                return a();
            });
        },
        subscribe: function(a) {
            return Q.push(a), function() {
                Q.splice(Q.indexOf(a), 1);
            };
        }
    });
    return {
        store: V,
        widgetsManager: U,
        getWidgetsIds: L,
        getSearchParameters: z,
        onSearchForFacetValues: J,
        onExternalStateUpdate: I,
        transitionState: H,
        updateClient: w,
        updateIndex: K,
        clearCache: x,
        skipSearch: v
    };
};
function s(a) {
    return a ? a.metadata.map(function(a) {
        return c(b({
            value: function() {
                return {};
            }
        }, a), {
            items: a.items && a.items.map(function(a) {
                return c(b({
                    value: function() {
                        return {};
                    }
                }, a), {
                    items: a.items && a.items.map(function(a) {
                        return b({
                            value: function() {
                                return {};
                            }
                        }, a);
                    })
                });
            })
        });
    }) : [];
}
