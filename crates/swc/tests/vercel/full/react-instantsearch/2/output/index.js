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
export default function e(f) {
    var g = f.indexName, o = f.initialState, p = f.searchClient, q = f.resultsState, r = f.stalledSearchDelay, s = function(a) {
        return D.getWidgets().filter(function(a) {
            return Boolean(a.getMetadata);
        }).map(function(b) {
            return b.getMetadata(a);
        });
    }, t = function() {
        var b = D.getWidgets().filter(function(a) {
            return Boolean(a.getSearchParameters);
        }).filter(function(a) {
            return !i(a) && !k(a);
        }).reduce(function(a, b) {
            return b.getSearchParameters(a);
        }, C), c = D.getWidgets().filter(function(a) {
            return Boolean(a.getSearchParameters);
        }).filter(function(a) {
            var b = i(a) && j(a, g), c = k(a) && l(a, g);
            return b || c;
        }).sort(m).reduce(function(a, b) {
            return b.getSearchParameters(a);
        }, b), d = D.getWidgets().filter(function(a) {
            return Boolean(a.getSearchParameters);
        }).filter(function(a) {
            var b = i(a) && !j(a, g), c = k(a) && !l(a, g);
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
    }, u = function() {
        if (!A) {
            var a = t(z.state), b = a.mainParameters, c = a.derivedParameters;
            z.derivedHelpers.slice().forEach(function(a) {
                a.detach();
            }), c.forEach(function(a) {
                var b = a.indexId, c = a.parameters, d = z.derive(function() {
                    return c;
                });
                d.on("result", v({
                    indexId: b
                })).on("error", w);
            }), z.setState(b), z.search();
        }
    }, v = function(b) {
        var c = b.indexId;
        return function(b) {
            var d = H.getState(), e = !z.derivedHelpers.length, f = d.results ? d.results : {
            };
            f = !e && f.getFacetByName ? {
            } : f, f = e ? b.results : a.objectSpread({
            }, f, a.defineProperty({
            }, c, b.results));
            var g = H.getState(), h = g.isSearchStalled;
            z.hasPendingRequests() || (clearTimeout(B), B = null, h = !1), g.resultsFacetValues;
            var i = a.objectWithoutProperties(g, [
                "resultsFacetValues"
            ]);
            H.setState(a.objectSpread({
            }, i, {
                results: f,
                isSearchStalled: h,
                searching: !1,
                error: null
            }));
        };
    }, w = function(b) {
        var c = b.error, d = H.getState(), e = d.isSearchStalled;
        z.hasPendingRequests() || (clearTimeout(B), e = !1), d.resultsFacetValues;
        var f = a.objectWithoutProperties(d, [
            "resultsFacetValues"
        ]);
        H.setState(a.objectSpread({
        }, f, {
            isSearchStalled: e,
            error: c,
            searching: !1
        }));
    }, x = function(b, c) {
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
    }, y = function(b, c) {
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
    }, z = b(p, g, a.objectSpread({
    }, d));
    h(p), z.on("search", function() {
        B || (B = setTimeout(function() {
            var b = H.getState(), c = b.resultsFacetValues, d = a.objectWithoutProperties(b, [
                "resultsFacetValues"
            ]);
            H.setState(a.objectSpread({
            }, d, {
                isSearchStalled: !0
            }));
        }, r));
    }).on("result", v({
        indexId: g
    })).on("error", w);
    var A = !1, B = null, C = z.state, D = c(function() {
        var b = s(H.getState().widgets);
        H.setState(a.objectSpread({
        }, H.getState(), {
            metadata: b,
            searching: !0
        })), u();
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
                x(b, c.results);
                return;
            }
            y(b, c);
        }
    }(p, q);
    var E, F, G, H = (F = {
        widgets: void 0 === o ? {
        } : o,
        metadata: n(q),
        results: (E = q) ? Array.isArray(E.results) ? E.results.reduce(function(c, d) {
            return a.objectSpread({
            }, c, a.defineProperty({
            }, d._internalIndexId, new b.SearchResults(new b.SearchParameters(d.state), d.rawResults)));
        }, {
        }) : new b.SearchResults(new b.SearchParameters(E.state), E.rawResults) : null,
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
        store: H,
        widgetsManager: D,
        getWidgetsIds: function() {
            return H.getState().metadata.reduce(function(a, b) {
                return void 0 !== b.id ? a.concat(b.id) : a;
            }, []);
        },
        getSearchParameters: t,
        onSearchForFacetValues: function(b) {
            var c = b.facetName, d = b.query, e = b.maxFacetHits;
            H.setState(a.objectSpread({
            }, H.getState(), {
                searchingForFacetValues: !0
            })), z.searchForFacetValues(c, d, Math.max(1, Math.min(void 0 === e ? 10 : e, 100))).then(function(b) {
                var e;
                H.setState(a.objectSpread({
                }, H.getState(), {
                    error: null,
                    searchingForFacetValues: !1,
                    resultsFacetValues: a.objectSpread({
                    }, H.getState().resultsFacetValues, (e = {
                    }, a.defineProperty(e, c, b.facetHits), a.defineProperty(e, "query", d), e))
                }));
            }, function(b) {
                H.setState(a.objectSpread({
                }, H.getState(), {
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
            var c = s(b);
            H.setState(a.objectSpread({
            }, H.getState(), {
                widgets: b,
                metadata: c,
                searching: !0
            })), u();
        },
        transitionState: function(a) {
            var b = H.getState().widgets;
            return D.getWidgets().filter(function(a) {
                return Boolean(a.transitionState);
            }).reduce(function(a, c) {
                return c.transitionState(b, a);
            }, a);
        },
        updateClient: function(a) {
            h(a), z.setClient(a), u();
        },
        updateIndex: function(a) {
            C = C.setIndex(a);
        },
        clearCache: function() {
            z.clearCache(), u();
        },
        skipSearch: function() {
            A = !0;
        }
    };
};
function n(b) {
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
