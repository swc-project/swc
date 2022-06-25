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
    var j = i.indexName, k = i.initialState, r = i.searchClient, t = i.resultsState, u = i.stalledSearchDelay, v = function(a) {
        return K.getWidgets().filter(function(a) {
            return Boolean(a.getMetadata);
        }).map(function(b) {
            return b.getMetadata(a);
        });
    }, w = function() {
        var d = K.getWidgets().filter(function(a) {
            return Boolean(a.getSearchParameters);
        }).filter(function(a) {
            return !m(a) && !o(a);
        }).reduce(function(a, b) {
            return b.getSearchParameters(a);
        }, J), e = K.getWidgets().filter(function(a) {
            return Boolean(a.getSearchParameters);
        }).filter(function(a) {
            var b = m(a) && n(a, j), c = o(a) && p(a, j);
            return b || c;
        }).sort(q).reduce(function(a, b) {
            return b.getSearchParameters(a);
        }, d), f = K.getWidgets().filter(function(a) {
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
    }, x = function() {
        if (!H) {
            var a = w(C.state), b = a.mainParameters, c = a.derivedParameters;
            C.derivedHelpers.slice().forEach(function(a) {
                a.detach();
            }), c.forEach(function(a) {
                var b = a.indexId, c = a.parameters, d = C.derive(function() {
                    return c;
                });
                d.on("result", y({
                    indexId: b
                })).on("error", z);
            }), C.setState(b), C.search();
        }
    }, y = function(e) {
        var f = e.indexId;
        return function(e) {
            var g = L.getState(), h = !C.derivedHelpers.length, i = g.results ? g.results : {};
            i = !h && i.getFacetByName ? {} : i, i = h ? e.results : c(b({}, i), a({}, f, e.results));
            var j = L.getState(), k = j.isSearchStalled;
            C.hasPendingRequests() || (clearTimeout(I), I = null, k = !1), j.resultsFacetValues;
            var l = d(j, [
                "resultsFacetValues"
            ]);
            L.setState(c(b({}, l), {
                results: i,
                isSearchStalled: k,
                searching: !1,
                error: null
            }));
        };
    }, z = function(a) {
        var e = a.error, f = L.getState(), g = f.isSearchStalled;
        C.hasPendingRequests() || (clearTimeout(I), g = !1), f.resultsFacetValues;
        var h = d(f, [
            "resultsFacetValues"
        ]);
        L.setState(c(b({}, h), {
            isSearchStalled: g,
            error: e,
            searching: !1
        }));
    }, A = function(d, e) {
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
    }, B = function(d, e) {
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
    }, C = f(r, j, b({}, h));
    l(r), C.on("search", function() {
        if (!I) {
            var a;
            I = setTimeout(function() {
                var a = L.getState(), e = (a.resultsFacetValues, d(a, [
                    "resultsFacetValues"
                ]));
                L.setState(c(b({}, e), {
                    isSearchStalled: !0
                }));
            }, u);
        }
    }).on("result", y({
        indexId: j
    })).on("error", z);
    var D, E, F, G, H = !1, I = null, J = C.state, K = g(function() {
        var a = v(L.getState().widgets);
        L.setState(c(b({}, L.getState()), {
            metadata: a,
            searching: !0
        })), x();
    });
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
                A(a, d.results);
                return;
            }
            B(a, d);
        }
    }(r, t);
    var L = (F = E = {
        widgets: void 0 === k ? {} : k,
        metadata: s(t),
        results: (D = t) ? Array.isArray(D.results) ? D.results.reduce(function(d, e) {
            return c(b({}, d), a({}, e._internalIndexId, new f.SearchResults(new f.SearchParameters(e.state), e.rawResults)));
        }, {}) : new f.SearchResults(new f.SearchParameters(D.state), D.rawResults) : null,
        error: null,
        searching: !1,
        isSearchStalled: !0,
        searchingForFacetValues: !1
    }, G = [], {
        getState: function() {
            return F;
        },
        setState: function(a) {
            F = a, G.forEach(function(a) {
                return a();
            });
        },
        subscribe: function(a) {
            return G.push(a), function() {
                G.splice(G.indexOf(a), 1);
            };
        }
    });
    return {
        store: L,
        widgetsManager: K,
        getWidgetsIds: function() {
            return L.getState().metadata.reduce(function(a, b) {
                return void 0 !== b.id ? a.concat(b.id) : a;
            }, []);
        },
        getSearchParameters: w,
        onSearchForFacetValues: function(d) {
            var e = d.facetName, f = d.query, g = d.maxFacetHits;
            L.setState(c(b({}, L.getState()), {
                searchingForFacetValues: !0
            })), C.searchForFacetValues(e, f, Math.max(1, Math.min(void 0 === g ? 10 : g, 100))).then(function(d) {
                var g;
                L.setState(c(b({}, L.getState()), {
                    error: null,
                    searchingForFacetValues: !1,
                    resultsFacetValues: c(b({}, L.getState().resultsFacetValues), (a(g = {}, e, d.facetHits), a(g, "query", f), g))
                }));
            }, function(a) {
                L.setState(c(b({}, L.getState()), {
                    searchingForFacetValues: !1,
                    error: a
                }));
            }).catch(function(a) {
                setTimeout(function() {
                    throw a;
                });
            });
        },
        onExternalStateUpdate: function(a) {
            var d = v(a);
            L.setState(c(b({}, L.getState()), {
                widgets: a,
                metadata: d,
                searching: !0
            })), x();
        },
        transitionState: function(a) {
            var b = L.getState().widgets;
            return K.getWidgets().filter(function(a) {
                return Boolean(a.transitionState);
            }).reduce(function(a, c) {
                return c.transitionState(b, a);
            }, a);
        },
        updateClient: function(a) {
            l(a), C.setClient(a), x();
        },
        updateIndex: function(a) {
            J = J.setIndex(a);
        },
        clearCache: function() {
            C.clearCache(), x();
        },
        skipSearch: function() {
            H = !0;
        }
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
