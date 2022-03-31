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
}, j = function(a) {
    return Boolean(a.props.indexId);
}, k = function(c, d) {
    var a = j(c), b = j(d);
    return a && !b ? -1 : !a && b ? 1 : 0;
};
export default function l(e) {
    var n = e.indexName, o = e.initialState, g = e.searchClient, l = e.resultsState, x = e.stalledSearchDelay, y = function(a) {
        return v.getWidgets().filter(function(a) {
            return Boolean(a.getMetadata);
        }).map(function(b) {
            return b.getMetadata(a);
        });
    }, q = function() {
        var b = v.getWidgets().filter(function(a) {
            return Boolean(a.getSearchParameters);
        }).filter(function(a) {
            return !i(a) && !j(a);
        }).reduce(function(a, b) {
            return b.getSearchParameters(a);
        }, E), c = v.getWidgets().filter(function(a) {
            return Boolean(a.getSearchParameters);
        }).filter(function(a) {
            var b, c, d, e, f = i(a) && (b = a, c = n, b.props.indexContextValue.targetedIndex === c), g = j(a) && (d = a, e = n, d.props.indexId === e);
            return f || g;
        }).sort(k).reduce(function(a, b) {
            return b.getSearchParameters(a);
        }, b), d = v.getWidgets().filter(function(a) {
            return Boolean(a.getSearchParameters);
        }).filter(function(a) {
            var b, c, d, e, f = i(a) && (b = a, c = n, b.props.indexContextValue.targetedIndex !== c), g = j(a) && (d = a, e = n, d.props.indexId !== e);
            return f || g;
        }).sort(k).reduce(function(c, b) {
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
    }, z = function() {
        if (!C) {
            var a = q(p.state), b = a.mainParameters, c = a.derivedParameters;
            p.derivedHelpers.slice().forEach(function(a) {
                a.detach();
            }), c.forEach(function(a) {
                var b = a.indexId, d = a.parameters, c = p.derive(function() {
                    return d;
                });
                c.on("result", r({
                    indexId: b
                })).on("error", s);
            }), p.setState(b), p.search();
        }
    }, r = function(b) {
        var c = b.indexId;
        return function(e) {
            var f = w.getState(), g = !p.derivedHelpers.length, b = f.results ? f.results : {};
            b = !g && b.getFacetByName ? {} : b, b = g ? e.results : a.objectSpread({}, b, a.defineProperty({}, c, e.results));
            var d = w.getState(), h = d.isSearchStalled;
            p.hasPendingRequests() || (clearTimeout(D), D = null, h = !1), d.resultsFacetValues;
            var i = a.objectWithoutProperties(d, [
                "resultsFacetValues"
            ]);
            w.setState(a.objectSpread({}, i, {
                results: b,
                isSearchStalled: h,
                searching: !1,
                error: null
            }));
        };
    }, s = function(d) {
        var e = d.error, b = w.getState(), c = b.isSearchStalled;
        p.hasPendingRequests() || (clearTimeout(D), c = !1), b.resultsFacetValues;
        var f = a.objectWithoutProperties(b, [
            "resultsFacetValues"
        ]);
        w.setState(a.objectSpread({}, f, {
            isSearchStalled: c,
            error: e,
            searching: !1
        }));
    }, A = function(b, c) {
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
    }, B = function(b, c) {
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
    }, p = b(g, n, a.objectSpread({}, d));
    h(g), p.on("search", function() {
        D || (D = setTimeout(function() {
            var b = w.getState(), c = (b.resultsFacetValues, a.objectWithoutProperties(b, [
                "resultsFacetValues"
            ]));
            w.setState(a.objectSpread({}, c, {
                isSearchStalled: !0
            }));
        }, x));
    }).on("result", r({
        indexId: n
    })).on("error", s);
    var f, t, u, C = !1, D = null, E = p.state, v = c(function() {
        var b = y(w.getState().widgets);
        w.setState(a.objectSpread({}, w.getState(), {
            metadata: b,
            searching: !0
        })), z();
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
                A(b, c.results);
                return;
            }
            B(b, c);
        }
    }(g, l);
    var w = (t = {
        widgets: void 0 === o ? {} : o,
        metadata: m(l),
        results: (f = l) ? Array.isArray(f.results) ? f.results.reduce(function(d, c) {
            return a.objectSpread({}, d, a.defineProperty({}, c._internalIndexId, new b.SearchResults(new b.SearchParameters(c.state), c.rawResults)));
        }, {}) : new b.SearchResults(new b.SearchParameters(f.state), f.rawResults) : null,
        error: null,
        searching: !1,
        isSearchStalled: !0,
        searchingForFacetValues: !1
    }, u = [], {
        getState: function() {
            return t;
        },
        setState: function(a) {
            t = a, u.forEach(function(a) {
                return a();
            });
        },
        subscribe: function(a) {
            return u.push(a), function() {
                u.splice(u.indexOf(a), 1);
            };
        }
    });
    return {
        store: w,
        widgetsManager: v,
        getWidgetsIds: function() {
            return w.getState().metadata.reduce(function(a, b) {
                return void 0 !== b.id ? a.concat(b.id) : a;
            }, []);
        },
        getSearchParameters: q,
        onSearchForFacetValues: function(b) {
            var d = b.facetName, e = b.query, c = b.maxFacetHits;
            w.setState(a.objectSpread({}, w.getState(), {
                searchingForFacetValues: !0
            })), p.searchForFacetValues(d, e, Math.max(1, Math.min(void 0 === c ? 10 : c, 100))).then(function(c) {
                var b;
                w.setState(a.objectSpread({}, w.getState(), {
                    error: null,
                    searchingForFacetValues: !1,
                    resultsFacetValues: a.objectSpread({}, w.getState().resultsFacetValues, (b = {}, a.defineProperty(b, d, c.facetHits), a.defineProperty(b, "query", e), b))
                }));
            }, function(b) {
                w.setState(a.objectSpread({}, w.getState(), {
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
            var c = y(b);
            w.setState(a.objectSpread({}, w.getState(), {
                widgets: b,
                metadata: c,
                searching: !0
            })), z();
        },
        transitionState: function(a) {
            var b = w.getState().widgets;
            return v.getWidgets().filter(function(a) {
                return Boolean(a.transitionState);
            }).reduce(function(a, c) {
                return c.transitionState(b, a);
            }, a);
        },
        updateClient: function(a) {
            h(a), p.setClient(a), z();
        },
        updateIndex: function(a) {
            E = E.setIndex(a);
        },
        clearCache: function() {
            p.clearCache(), z();
        },
        skipSearch: function() {
            C = !0;
        }
    };
};
function m(b) {
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
