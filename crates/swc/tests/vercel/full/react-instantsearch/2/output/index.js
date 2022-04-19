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
}, m = function(c, d) {
    var a = k(c), b = k(d);
    return a && !b ? -1 : !a && b ? 1 : 0;
};
export default function n(e) {
    var p = e.indexName, q = e.initialState, g = e.searchClient, n = e.resultsState, z = e.stalledSearchDelay, A = function(a) {
        return x.getWidgets().filter(function(a) {
            return Boolean(a.getMetadata);
        }).map(function(b) {
            return b.getMetadata(a);
        });
    }, s = function() {
        var b = x.getWidgets().filter(function(a) {
            return Boolean(a.getSearchParameters);
        }).filter(function(a) {
            return !i(a) && !k(a);
        }).reduce(function(a, b) {
            return b.getSearchParameters(a);
        }, H), c = x.getWidgets().filter(function(a) {
            return Boolean(a.getSearchParameters);
        }).filter(function(a) {
            var b = i(a) && j(a, p), c = k(a) && l(a, p);
            return b || c;
        }).sort(m).reduce(function(a, b) {
            return b.getSearchParameters(a);
        }, b), d = x.getWidgets().filter(function(a) {
            return Boolean(a.getSearchParameters);
        }).filter(function(a) {
            var b = i(a) && !j(a, p), c = k(a) && !l(a, p);
            return b || c;
        }).sort(m).reduce(function(c, b) {
            var d = i(b) ? b.props.indexContextValue.targetedIndex : b.props.indexId, e = c[d] || [];
            return a.objectSpread({}, c, a.defineProperty({}, d, e.concat(b)));
        }, {}), e = Object.keys(d).map(function(a) {
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
    }, B = function() {
        if (!F) {
            var a = s(r.state), b = a.mainParameters, c = a.derivedParameters;
            r.derivedHelpers.slice().forEach(function(a) {
                a.detach();
            }), c.forEach(function(a) {
                var b = a.indexId, d = a.parameters, c = r.derive(function() {
                    return d;
                });
                c.on("result", t({
                    indexId: b
                })).on("error", u);
            }), r.setState(b), r.search();
        }
    }, t = function(b) {
        var c = b.indexId;
        return function(e) {
            var f = y.getState(), g = !r.derivedHelpers.length, b = f.results ? f.results : {};
            b = !g && b.getFacetByName ? {} : b, b = g ? e.results : a.objectSpread({}, b, a.defineProperty({}, c, e.results));
            var d = y.getState(), h = d.isSearchStalled;
            r.hasPendingRequests() || (clearTimeout(G), G = null, h = !1), d.resultsFacetValues;
            var i = a.objectWithoutProperties(d, [
                "resultsFacetValues"
            ]);
            y.setState(a.objectSpread({}, i, {
                results: b,
                isSearchStalled: h,
                searching: !1,
                error: null
            }));
        };
    }, u = function(d) {
        var e = d.error, b = y.getState(), c = b.isSearchStalled;
        r.hasPendingRequests() || (clearTimeout(G), c = !1), b.resultsFacetValues;
        var f = a.objectWithoutProperties(b, [
            "resultsFacetValues"
        ]);
        y.setState(a.objectSpread({}, f, {
            isSearchStalled: c,
            error: e,
            searching: !1
        }));
    }, C = function(b, c) {
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
        b.cache = a.objectSpread({}, b.cache, a.defineProperty({}, d, JSON.stringify({
            results: c.reduce(function(a, b) {
                return a.concat(b.rawResults);
            }, [])
        })));
    }, D = function(b, c) {
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
        b.cache = a.objectSpread({}, b.cache, a.defineProperty({}, d, JSON.stringify({
            results: c.rawResults
        })));
    }, r = b(g, p, a.objectSpread({}, d));
    h(g), r.on("search", function() {
        !G && (G = setTimeout(function() {
            var b = y.getState(), c = (b.resultsFacetValues, a.objectWithoutProperties(b, [
                "resultsFacetValues"
            ]));
            y.setState(a.objectSpread({}, c, {
                isSearchStalled: !0
            }));
        }, z));
    }).on("result", t({
        indexId: p
    })).on("error", u);
    var f, E, v, w, F = !1, G = null, H = r.state, x = c(function() {
        var b = A(y.getState().widgets);
        y.setState(a.objectSpread({}, y.getState(), {
            metadata: b,
            searching: !0
        })), B();
    });
    !function(b, c) {
        if (c && (b.transporter && !b._cacheHydrated || b._useCache && "function" == typeof b.addAlgoliaAgent)) {
            if (b.transporter && !b._cacheHydrated) {
                b._cacheHydrated = !0;
                var d = b.search;
                b.search = function(g) {
                    for(var e = arguments.length, f = new Array(e > 1 ? e - 1 : 0), c = 1; c < e; c++)f[c - 1] = arguments[c];
                    var h = g.map(function(b) {
                        var c, d;
                        return a.objectSpread({}, b, {
                            params: (c = b.params, d = function(c) {
                                for(var b = arguments.length, d = new Array(b > 1 ? b - 1 : 0), a = 1; a < b; a++)d[a - 1] = arguments[a];
                                var e = 0;
                                return c.replace(/%s/g, function() {
                                    return encodeURIComponent(d[e++]);
                                });
                            }, Object.keys(c).map(function(a) {
                                var b;
                                return d("%s=%s", a, (b = c[a], "[object Object]" === Object.prototype.toString.call(b) || "[object Array]" === Object.prototype.toString.call(b)) ? JSON.stringify(c[a]) : c[a]);
                            }).join("&"))
                        });
                    });
                    return b.transporter.responsesCache.get({
                        method: "search",
                        args: [
                            h
                        ].concat(a.toConsumableArray(f))
                    }, function() {
                        return d.apply(void 0, [
                            g
                        ].concat(a.toConsumableArray(f)));
                    });
                };
            }
            if (Array.isArray(c.results)) {
                C(b, c.results);
                return;
            }
            D(b, c);
        }
    }(g, n);
    var y = (v = {
        widgets: void 0 === q ? {} : q,
        metadata: o(n),
        results: (f = n) ? Array.isArray(f.results) ? f.results.reduce(function(d, c) {
            return a.objectSpread({}, d, a.defineProperty({}, c._internalIndexId, new b.SearchResults(new b.SearchParameters(c.state), c.rawResults)));
        }, {}) : new b.SearchResults(new b.SearchParameters(f.state), f.rawResults) : null,
        error: null,
        searching: !1,
        isSearchStalled: !0,
        searchingForFacetValues: !1
    }, w = [], {
        getState: function() {
            return v;
        },
        setState: function(a) {
            v = a, w.forEach(function(a) {
                return a();
            });
        },
        subscribe: function(a) {
            return w.push(a), function() {
                w.splice(w.indexOf(a), 1);
            };
        }
    });
    return {
        store: y,
        widgetsManager: x,
        getWidgetsIds: function() {
            return y.getState().metadata.reduce(function(a, b) {
                return void 0 !== b.id ? a.concat(b.id) : a;
            }, []);
        },
        getSearchParameters: s,
        onSearchForFacetValues: function(b) {
            var d = b.facetName, e = b.query, c = b.maxFacetHits;
            y.setState(a.objectSpread({}, y.getState(), {
                searchingForFacetValues: !0
            })), r.searchForFacetValues(d, e, Math.max(1, Math.min(void 0 === c ? 10 : c, 100))).then(function(c) {
                var b;
                y.setState(a.objectSpread({}, y.getState(), {
                    error: null,
                    searchingForFacetValues: !1,
                    resultsFacetValues: a.objectSpread({}, y.getState().resultsFacetValues, (b = {}, a.defineProperty(b, d, c.facetHits), a.defineProperty(b, "query", e), b))
                }));
            }, function(b) {
                y.setState(a.objectSpread({}, y.getState(), {
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
            var c = A(b);
            y.setState(a.objectSpread({}, y.getState(), {
                widgets: b,
                metadata: c,
                searching: !0
            })), B();
        },
        transitionState: function(a) {
            var b = y.getState().widgets;
            return x.getWidgets().filter(function(a) {
                return Boolean(a.transitionState);
            }).reduce(function(a, c) {
                return c.transitionState(b, a);
            }, a);
        },
        updateClient: function(a) {
            h(a), r.setClient(a), B();
        },
        updateIndex: function(a) {
            H = H.setIndex(a);
        },
        clearCache: function() {
            r.clearCache(), B();
        },
        skipSearch: function() {
            F = !0;
        }
    };
};
function o(b) {
    return b ? b.metadata.map(function(b) {
        return a.objectSpread({
            value: function() {
                return {};
            }
        }, b, {
            items: b.items && b.items.map(function(b) {
                return a.objectSpread({
                    value: function() {
                        return {};
                    }
                }, b, {
                    items: b.items && b.items.map(function(b) {
                        return a.objectSpread({
                            value: function() {
                                return {};
                            }
                        }, b);
                    })
                });
            })
        });
    }) : [];
}
