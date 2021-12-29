import * as a from "@swc/helpers";
import b from "algoliasearch-helper";
import c from "./createWidgetsManager";
import { HIGHLIGHT_TAGS as d } from "./highlight";
import { hasMultipleIndices as e } from "./indexUtils";
import { version as f } from "react";
import g from "./version";
function h(a) {
    "function" == typeof a.addAlgoliaAgent && (a.addAlgoliaAgent("react (".concat(f, ")")), a.addAlgoliaAgent("react-instantsearch (".concat(g, ")")));
}
var i = function(a) {
    return e({
        ais: a.props.contextValue,
        multiIndexContext: a.props.indexContextValue
    });
}, j = function(a, b) {
    return a.props.indexContextValue.targetedIndex === b;
}, k = function(a) {
    return Boolean(a.props.indexId);
}, l = function(a, b) {
    return a.props.indexId === b;
}, m = function(a, b) {
    var c = k(a), d = k(b);
    return c && !d ? -1 : !c && d ? 1 : 0;
};
export default function n(e) {
    var f = e.indexName, g = e.initialState, n = e.searchClient, p = e.resultsState, q = e.stalledSearchDelay, r = function(a) {
        return C.getWidgets().filter(function(a) {
            return Boolean(a.getMetadata);
        }).map(function(b) {
            return b.getMetadata(a);
        });
    }, s = function() {
        var b = C.getWidgets().filter(function(a) {
            return Boolean(a.getSearchParameters);
        }).filter(function(a) {
            return !i(a) && !k(a);
        }).reduce(function(a, b) {
            return b.getSearchParameters(a);
        }, B), c = C.getWidgets().filter(function(a) {
            return Boolean(a.getSearchParameters);
        }).filter(function(a) {
            var b = i(a) && j(a, f), c = k(a) && l(a, f);
            return b || c;
        }).sort(m).reduce(function(a, b) {
            return b.getSearchParameters(a);
        }, b), d = C.getWidgets().filter(function(a) {
            return Boolean(a.getSearchParameters);
        }).filter(function(a) {
            var b = i(a) && !j(a, f), c = k(a) && !l(a, f);
            return b || c;
        }).sort(m).reduce(function(b, c) {
            var d = i(c) ? c.props.indexContextValue.targetedIndex : c.props.indexId, e = b[d] || [];
            return a.objectSpread({
            }, b, a.defineProperty({
            }, d, e.concat(c)));
        }, {
        }), e = Object.keys(d).map(function(a) {
            return {
                parameters: d[a].reduce(function(a, b) {
                    return b.getSearchParameters(a);
                }, b),
                indexId: a
            };
        });
        return {
            mainParameters: c,
            derivedParameters: e
        };
    }, t = function() {
        if (!z) {
            var a = s(y.state), b = a.mainParameters, c = a.derivedParameters;
            y.derivedHelpers.slice().forEach(function(a) {
                a.detach();
            }), c.forEach(function(a) {
                var b = a.indexId, c = a.parameters, d = y.derive(function() {
                    return c;
                });
                d.on("result", u({
                    indexId: b
                })).on("error", v);
            }), y.setState(b), y.search();
        }
    }, u = function(b) {
        var c = b.indexId;
        return function(b) {
            var d = G.getState(), e = !y.derivedHelpers.length, f = d.results ? d.results : {
            };
            f = !e && f.getFacetByName ? {
            } : f, f = e ? b.results : a.objectSpread({
            }, f, a.defineProperty({
            }, c, b.results));
            var g = G.getState(), h = g.isSearchStalled;
            y.hasPendingRequests() || (clearTimeout(A), A = null, h = !1), g.resultsFacetValues;
            var i = a.objectWithoutProperties(g, [
                "resultsFacetValues"
            ]);
            G.setState(a.objectSpread({
            }, i, {
                results: f,
                isSearchStalled: h,
                searching: !1,
                error: null
            }));
        };
    }, v = function(b) {
        var c = b.error, d = G.getState(), e = d.isSearchStalled;
        y.hasPendingRequests() || (clearTimeout(A), e = !1), d.resultsFacetValues;
        var f = a.objectWithoutProperties(d, [
            "resultsFacetValues"
        ]);
        G.setState(a.objectSpread({
        }, f, {
            isSearchStalled: e,
            error: c,
            searching: !1
        }));
    }, w = function(b, c) {
        if (b.transporter) {
            b.transporter.responsesCache.set({
                method: "search",
                args: [
                    c.reduce(function(a, b) {
                        return a.concat(b.rawResults.map(function(a) {
                            return {
                                indexName: a.index,
                                params: a.params
                            };
                        }));
                    }, []), 
                ]
            }, {
                results: c.reduce(function(a, b) {
                    return a.concat(b.rawResults);
                }, [])
            });
            return;
        }
        var d = "/1/indexes/*/queries_body_".concat(JSON.stringify({
            requests: c.reduce(function(a, b) {
                return a.concat(b.rawResults.map(function(a) {
                    return {
                        indexName: a.index,
                        params: a.params
                    };
                }));
            }, [])
        }));
        b.cache = a.objectSpread({
        }, b.cache, a.defineProperty({
        }, d, JSON.stringify({
            results: c.reduce(function(a, b) {
                return a.concat(b.rawResults);
            }, [])
        })));
    }, x = function(b, c) {
        if (b.transporter) {
            b.transporter.responsesCache.set({
                method: "search",
                args: [
                    c.rawResults.map(function(a) {
                        return {
                            indexName: a.index,
                            params: a.params
                        };
                    }), 
                ]
            }, {
                results: c.rawResults
            });
            return;
        }
        var d = "/1/indexes/*/queries_body_".concat(JSON.stringify({
            requests: c.rawResults.map(function(a) {
                return {
                    indexName: a.index,
                    params: a.params
                };
            })
        }));
        b.cache = a.objectSpread({
        }, b.cache, a.defineProperty({
        }, d, JSON.stringify({
            results: c.rawResults
        })));
    }, y = b(n, f, a.objectSpread({
    }, d));
    h(n), y.on("search", function() {
        A || (A = setTimeout(function() {
            var b = G.getState(), c = b.resultsFacetValues, d = a.objectWithoutProperties(b, [
                "resultsFacetValues"
            ]);
            G.setState(a.objectSpread({
            }, d, {
                isSearchStalled: !0
            }));
        }, q));
    }).on("result", u({
        indexId: f
    })).on("error", v);
    var z = !1, A = null, B = y.state, C = c(function() {
        var b = r(G.getState().widgets);
        G.setState(a.objectSpread({
        }, G.getState(), {
            metadata: b,
            searching: !0
        })), t();
    });
    !function(b, c) {
        if (c && (b.transporter && !b._cacheHydrated || b._useCache && "function" == typeof b.addAlgoliaAgent)) {
            if (b.transporter && !b._cacheHydrated) {
                b._cacheHydrated = !0;
                var d = b.search;
                b.search = function(c) {
                    for(var e = arguments.length, f = new Array(e > 1 ? e - 1 : 0), g = 1; g < e; g++)f[g - 1] = arguments[g];
                    var h = c.map(function(b) {
                        return a.objectSpread({
                        }, b, {
                            params: function(a) {
                                var b = function(a) {
                                    for(var b = arguments.length, c = new Array(b > 1 ? b - 1 : 0), d = 1; d < b; d++)c[d - 1] = arguments[d];
                                    var e = 0;
                                    return a.replace(/%s/g, function() {
                                        return encodeURIComponent(c[e++]);
                                    });
                                };
                                return Object.keys(a).map(function(c) {
                                    var d;
                                    return b("%s=%s", c, (d = a[c], "[object Object]" === Object.prototype.toString.call(d) || "[object Array]" === Object.prototype.toString.call(d)) ? JSON.stringify(a[c]) : a[c]);
                                }).join("&");
                            }(b.params)
                        });
                    });
                    return b.transporter.responsesCache.get({
                        method: "search",
                        args: [
                            h
                        ].concat(a.toConsumableArray(f))
                    }, function() {
                        return d.apply(void 0, [
                            c
                        ].concat(a.toConsumableArray(f)));
                    });
                };
            }
            if (Array.isArray(c.results)) {
                w(b, c.results);
                return;
            }
            x(b, c);
        }
    }(n, p);
    var D, E, F, G = (E = {
        widgets: void 0 === g ? {
        } : g,
        metadata: o(p),
        results: (D = p) ? Array.isArray(D.results) ? D.results.reduce(function(c, d) {
            return a.objectSpread({
            }, c, a.defineProperty({
            }, d._internalIndexId, new b.SearchResults(new b.SearchParameters(d.state), d.rawResults)));
        }, {
        }) : new b.SearchResults(new b.SearchParameters(D.state), D.rawResults) : null,
        error: null,
        searching: !1,
        isSearchStalled: !0,
        searchingForFacetValues: !1
    }, F = [], {
        getState: function() {
            return E;
        },
        setState: function(a) {
            E = a, F.forEach(function(a) {
                return a();
            });
        },
        subscribe: function(a) {
            return F.push(a), function() {
                F.splice(F.indexOf(a), 1);
            };
        }
    });
    return {
        store: G,
        widgetsManager: C,
        getWidgetsIds: function() {
            return G.getState().metadata.reduce(function(a, b) {
                return void 0 !== b.id ? a.concat(b.id) : a;
            }, []);
        },
        getSearchParameters: s,
        onSearchForFacetValues: function(b) {
            var c = b.facetName, d = b.query, e = b.maxFacetHits;
            G.setState(a.objectSpread({
            }, G.getState(), {
                searchingForFacetValues: !0
            })), y.searchForFacetValues(c, d, Math.max(1, Math.min(void 0 === e ? 10 : e, 100))).then(function(b) {
                var e;
                G.setState(a.objectSpread({
                }, G.getState(), {
                    error: null,
                    searchingForFacetValues: !1,
                    resultsFacetValues: a.objectSpread({
                    }, G.getState().resultsFacetValues, (e = {
                    }, a.defineProperty(e, c, b.facetHits), a.defineProperty(e, "query", d), e))
                }));
            }, function(b) {
                G.setState(a.objectSpread({
                }, G.getState(), {
                    searchingForFacetValues: !1,
                    error: b
                }));
            }).catch(function(a) {
                setTimeout(function() {
                    throw a;
                });
            });
        },
        onExternalStateUpdate: function(b) {
            var c = r(b);
            G.setState(a.objectSpread({
            }, G.getState(), {
                widgets: b,
                metadata: c,
                searching: !0
            })), t();
        },
        transitionState: function(a) {
            var b = G.getState().widgets;
            return C.getWidgets().filter(function(a) {
                return Boolean(a.transitionState);
            }).reduce(function(a, c) {
                return c.transitionState(b, a);
            }, a);
        },
        updateClient: function(a) {
            h(a), y.setClient(a), t();
        },
        updateIndex: function(a) {
            B = B.setIndex(a);
        },
        clearCache: function() {
            y.clearCache(), t();
        },
        skipSearch: function() {
            z = !0;
        }
    };
};
function o(b) {
    return b ? b.metadata.map(function(b) {
        return a.objectSpread({
            value: function() {
                return {
                };
            }
        }, b, {
            items: b.items && b.items.map(function(b) {
                return a.objectSpread({
                    value: function() {
                        return {
                        };
                    }
                }, b, {
                    items: b.items && b.items.map(function(b) {
                        return a.objectSpread({
                            value: function() {
                                return {
                                };
                            }
                        }, b);
                    })
                });
            })
        });
    }) : [];
}
