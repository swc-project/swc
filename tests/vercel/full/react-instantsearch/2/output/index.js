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
var i, j = function(a) {
    return e({
        ais: a.props.contextValue,
        multiIndexContext: a.props.indexContextValue
    });
}, k = function(a, b) {
    return a.props.indexContextValue.targetedIndex === b;
}, l = function(a) {
    return Boolean(a.props.indexId);
}, m = function(a, b) {
    return a.props.indexId === b;
}, n = function(a, b) {
    var c = l(a), d = l(b);
    return c && !d ? -1 : !c && d ? 1 : 0;
};
export default function e(f) {
    var g = f.indexName, p = f.initialState, q = f.searchClient, r = f.resultsState, s = f.stalledSearchDelay, t = function(a) {
        return E.getWidgets().filter(function(a) {
            return Boolean(a.getMetadata);
        }).map(function(b) {
            return b.getMetadata(a);
        });
    }, u = function() {
        var b = E.getWidgets().filter(function(a) {
            return Boolean(a.getSearchParameters);
        }).filter(function(a) {
            return !j(a) && !l(a);
        }).reduce(function(a, b) {
            return b.getSearchParameters(a);
        }, D), c = E.getWidgets().filter(function(a) {
            return Boolean(a.getSearchParameters);
        }).filter(function(a) {
            var b = j(a) && k(a, g), c = l(a) && m(a, g);
            return b || c;
        }).sort(n).reduce(function(a, b) {
            return b.getSearchParameters(a);
        }, b), d = E.getWidgets().filter(function(a) {
            return Boolean(a.getSearchParameters);
        }).filter(function(a) {
            var b = j(a) && !k(a, g), c = l(a) && !m(a, g);
            return b || c;
        }).sort(n).reduce(function(b, c) {
            var d = j(c) ? c.props.indexContextValue.targetedIndex : c.props.indexId, e = b[d] || [];
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
    }, v = function() {
        if (!B) {
            var a = u(A.state), b = a.mainParameters, c = a.derivedParameters;
            A.derivedHelpers.slice().forEach(function(a) {
                a.detach();
            }), c.forEach(function(a) {
                var b = a.indexId, c = a.parameters, d = A.derive(function() {
                    return c;
                });
                d.on("result", w({
                    indexId: b
                })).on("error", x);
            }), A.setState(b), A.search();
        }
    }, w = function(b) {
        var c = b.indexId;
        return function(b) {
            var d = I.getState(), e = !A.derivedHelpers.length, f = d.results ? d.results : {
            };
            f = !e && f.getFacetByName ? {
            } : f, f = e ? b.results : a.objectSpread({
            }, f, a.defineProperty({
            }, c, b.results));
            var g = I.getState(), h = g.isSearchStalled;
            A.hasPendingRequests() || (clearTimeout(C), C = null, h = !1), g.resultsFacetValues;
            var i = a.objectWithoutProperties(g, [
                "resultsFacetValues"
            ]);
            I.setState(a.objectSpread({
            }, i, {
                results: f,
                isSearchStalled: h,
                searching: !1,
                error: null
            }));
        };
    }, x = function(b) {
        var c = b.error, d = I.getState(), e = d.isSearchStalled;
        A.hasPendingRequests() || (clearTimeout(C), e = !1), d.resultsFacetValues;
        var f = a.objectWithoutProperties(d, [
            "resultsFacetValues"
        ]);
        I.setState(a.objectSpread({
        }, f, {
            isSearchStalled: e,
            error: c,
            searching: !1
        }));
    }, y = function(b, c) {
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
    }, z = function(b, c) {
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
    }, A = b(q, g, a.objectSpread({
    }, d));
    h(q), A.on("search", function() {
        C || (C = setTimeout(function() {
            var b = I.getState(), c = b.resultsFacetValues, d = a.objectWithoutProperties(b, [
                "resultsFacetValues"
            ]);
            I.setState(a.objectSpread({
            }, d, {
                isSearchStalled: !0
            }));
        }, s));
    }).on("result", w({
        indexId: g
    })).on("error", x);
    var B = !1, C = null, D = A.state, E = c(function() {
        var b = t(I.getState().widgets);
        I.setState(a.objectSpread({
        }, I.getState(), {
            metadata: b,
            searching: !0
        })), v();
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
                y(b, c.results);
                return;
            }
            z(b, c);
        }
    }(q, r);
    var F, G, H, I = (G = {
        widgets: void 0 === p ? {
        } : p,
        metadata: o(r),
        results: (F = r) ? Array.isArray(F.results) ? F.results.reduce(function(c, d) {
            return a.objectSpread({
            }, c, a.defineProperty({
            }, d._internalIndexId, new b.SearchResults(new b.SearchParameters(d.state), d.rawResults)));
        }, {
        }) : new b.SearchResults(new b.SearchParameters(F.state), F.rawResults) : null,
        error: null,
        searching: !1,
        isSearchStalled: !0,
        searchingForFacetValues: !1
    }, H = [], {
        getState: function() {
            return G;
        },
        setState: function(a) {
            G = a, H.forEach(function(a) {
                return a();
            });
        },
        subscribe: function(a) {
            return H.push(a), function() {
                H.splice(H.indexOf(a), 1);
            };
        }
    });
    return {
        store: I,
        widgetsManager: E,
        getWidgetsIds: function() {
            return I.getState().metadata.reduce(function(a, b) {
                return void 0 !== b.id ? a.concat(b.id) : a;
            }, []);
        },
        getSearchParameters: u,
        onSearchForFacetValues: function(b) {
            var c = b.facetName, d = b.query, e = b.maxFacetHits;
            I.setState(a.objectSpread({
            }, I.getState(), {
                searchingForFacetValues: !0
            })), A.searchForFacetValues(c, d, Math.max(1, Math.min(void 0 === e ? 10 : e, 100))).then(function(b) {
                I.setState(a.objectSpread({
                }, I.getState(), {
                    error: null,
                    searchingForFacetValues: !1,
                    resultsFacetValues: a.objectSpread({
                    }, I.getState().resultsFacetValues, (i = {
                    }, a.defineProperty(i, c, b.facetHits), a.defineProperty(i, "query", d), i))
                }));
            }, function(b) {
                I.setState(a.objectSpread({
                }, I.getState(), {
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
            var c = t(b);
            I.setState(a.objectSpread({
            }, I.getState(), {
                widgets: b,
                metadata: c,
                searching: !0
            })), v();
        },
        transitionState: function(a) {
            var b = I.getState().widgets;
            return E.getWidgets().filter(function(a) {
                return Boolean(a.transitionState);
            }).reduce(function(a, c) {
                return c.transitionState(b, a);
            }, a);
        },
        updateClient: function(a) {
            h(a), A.setClient(a), v();
        },
        updateIndex: function(a) {
            D = D.setIndex(a);
        },
        clearCache: function() {
            A.clearCache(), v();
        },
        skipSearch: function() {
            B = !0;
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
