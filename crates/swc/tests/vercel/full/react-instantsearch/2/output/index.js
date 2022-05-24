import a from "@swc/helpers/lib/_define_property.js";
import b from "@swc/helpers/lib/_object_spread.js";
import c from "@swc/helpers/lib/_object_without_properties.js";
import d from "@swc/helpers/lib/_to_consumable_array.js";
import e from "algoliasearch-helper";
import f from "./createWidgetsManager";
import { HIGHLIGHT_TAGS as g } from "./highlight";
import { hasMultipleIndices as h } from "./indexUtils";
import { version as i } from "react";
import j from "./version";
function k(a) {
    "function" == typeof a.addAlgoliaAgent && (a.addAlgoliaAgent("react (".concat(i, ")")), a.addAlgoliaAgent("react-instantsearch (".concat(j, ")")));
}
var l = function(a) {
    return h({
        ais: a.props.contextValue,
        multiIndexContext: a.props.indexContextValue
    });
}, m = function(a, b) {
    return a.props.indexContextValue.targetedIndex === b;
}, n = function(a) {
    return Boolean(a.props.indexId);
}, o = function(a, b) {
    return a.props.indexId === b;
}, p = function(c, d) {
    var a = n(c), b = n(d);
    return a && !b ? -1 : !a && b ? 1 : 0;
};
export default function q(h) {
    var s = h.indexName, t = h.initialState, j = h.searchClient, q = h.resultsState, C = h.stalledSearchDelay, D = function(a) {
        return A.getWidgets().filter(function(a) {
            return Boolean(a.getMetadata);
        }).map(function(b) {
            return b.getMetadata(a);
        });
    }, v = function() {
        var c = A.getWidgets().filter(function(a) {
            return Boolean(a.getSearchParameters);
        }).filter(function(a) {
            return !l(a) && !n(a);
        }).reduce(function(a, b) {
            return b.getSearchParameters(a);
        }, K), d = A.getWidgets().filter(function(a) {
            return Boolean(a.getSearchParameters);
        }).filter(function(a) {
            var b = l(a) && m(a, s), c = n(a) && o(a, s);
            return b || c;
        }).sort(p).reduce(function(a, b) {
            return b.getSearchParameters(a);
        }, c), e = A.getWidgets().filter(function(a) {
            return Boolean(a.getSearchParameters);
        }).filter(function(a) {
            var b = l(a) && !m(a, s), c = n(a) && !o(a, s);
            return b || c;
        }).sort(p).reduce(function(d, c) {
            var e = l(c) ? c.props.indexContextValue.targetedIndex : c.props.indexId, f = d[e] || [];
            return b({}, d, a({}, e, f.concat(c)));
        }, {}), f = Object.keys(e).map(function(a) {
            return {
                parameters: e[a].reduce(function(a, b) {
                    return b.getSearchParameters(a);
                }, c),
                indexId: a
            };
        });
        return {
            mainParameters: d,
            derivedParameters: f
        };
    }, E = function() {
        if (!I) {
            var a = v(u.state), b = a.mainParameters, c = a.derivedParameters;
            u.derivedHelpers.slice().forEach(function(a) {
                a.detach();
            }), c.forEach(function(a) {
                var b = a.indexId, d = a.parameters, c = u.derive(function() {
                    return d;
                });
                c.on("result", w({
                    indexId: b
                })).on("error", x);
            }), u.setState(b), u.search();
        }
    }, w = function(d) {
        var e = d.indexId;
        return function(g) {
            var h = B.getState(), i = !u.derivedHelpers.length, d = h.results ? h.results : {};
            d = !i && d.getFacetByName ? {} : d, d = i ? g.results : b({}, d, a({}, e, g.results));
            var f = B.getState(), j = f.isSearchStalled;
            u.hasPendingRequests() || (clearTimeout(J), J = null, j = !1), f.resultsFacetValues;
            var k = c(f, [
                "resultsFacetValues"
            ]);
            B.setState(b({}, k, {
                results: d,
                isSearchStalled: j,
                searching: !1,
                error: null
            }));
        };
    }, x = function(e) {
        var f = e.error, a = B.getState(), d = a.isSearchStalled;
        u.hasPendingRequests() || (clearTimeout(J), d = !1), a.resultsFacetValues;
        var g = c(a, [
            "resultsFacetValues"
        ]);
        B.setState(b({}, g, {
            isSearchStalled: d,
            error: f,
            searching: !1
        }));
    }, F = function(c, d) {
        if (c.transporter) {
            c.transporter.responsesCache.set({
                method: "search",
                args: [
                    d.reduce(function(a, b) {
                        return a.concat(b.rawResults.map(function(a) {
                            return {
                                indexName: a.index,
                                params: a.params
                            };
                        }));
                    }, []), 
                ]
            }, {
                results: d.reduce(function(a, b) {
                    return a.concat(b.rawResults);
                }, [])
            });
            return;
        }
        var e = "/1/indexes/*/queries_body_".concat(JSON.stringify({
            requests: d.reduce(function(a, b) {
                return a.concat(b.rawResults.map(function(a) {
                    return {
                        indexName: a.index,
                        params: a.params
                    };
                }));
            }, [])
        }));
        c.cache = b({}, c.cache, a({}, e, JSON.stringify({
            results: d.reduce(function(a, b) {
                return a.concat(b.rawResults);
            }, [])
        })));
    }, G = function(c, d) {
        if (c.transporter) {
            c.transporter.responsesCache.set({
                method: "search",
                args: [
                    d.rawResults.map(function(a) {
                        return {
                            indexName: a.index,
                            params: a.params
                        };
                    }), 
                ]
            }, {
                results: d.rawResults
            });
            return;
        }
        var e = "/1/indexes/*/queries_body_".concat(JSON.stringify({
            requests: d.rawResults.map(function(a) {
                return {
                    indexName: a.index,
                    params: a.params
                };
            })
        }));
        c.cache = b({}, c.cache, a({}, e, JSON.stringify({
            results: d.rawResults
        })));
    }, u = e(j, s, b({}, g));
    k(j), u.on("search", function() {
        !J && (J = setTimeout(function() {
            var a = B.getState(), d = (a.resultsFacetValues, c(a, [
                "resultsFacetValues"
            ]));
            B.setState(b({}, d, {
                isSearchStalled: !0
            }));
        }, C));
    }).on("result", w({
        indexId: s
    })).on("error", x);
    var i, H, y, z, I = !1, J = null, K = u.state, A = f(function() {
        var a = D(B.getState().widgets);
        B.setState(b({}, B.getState(), {
            metadata: a,
            searching: !0
        })), E();
    });
    !function(a, c) {
        if (c && (a.transporter && !a._cacheHydrated || a._useCache && "function" == typeof a.addAlgoliaAgent)) {
            if (a.transporter && !a._cacheHydrated) {
                a._cacheHydrated = !0;
                var e = a.search;
                a.search = function(h) {
                    for(var f = arguments.length, g = new Array(f > 1 ? f - 1 : 0), c = 1; c < f; c++)g[c - 1] = arguments[c];
                    var i = h.map(function(a) {
                        var c, d;
                        return b({}, a, {
                            params: (c = a.params, d = function(c) {
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
                    return a.transporter.responsesCache.get({
                        method: "search",
                        args: [
                            i
                        ].concat(d(g))
                    }, function() {
                        return e.apply(void 0, [
                            h
                        ].concat(d(g)));
                    });
                };
            }
            if (Array.isArray(c.results)) {
                F(a, c.results);
                return;
            }
            G(a, c);
        }
    }(j, q);
    var B = (y = {
        widgets: void 0 === t ? {} : t,
        metadata: r(q),
        results: (i = q) ? Array.isArray(i.results) ? i.results.reduce(function(d, c) {
            return b({}, d, a({}, c._internalIndexId, new e.SearchResults(new e.SearchParameters(c.state), c.rawResults)));
        }, {}) : new e.SearchResults(new e.SearchParameters(i.state), i.rawResults) : null,
        error: null,
        searching: !1,
        isSearchStalled: !0,
        searchingForFacetValues: !1
    }, z = [], {
        getState: function() {
            return y;
        },
        setState: function(a) {
            y = a, z.forEach(function(a) {
                return a();
            });
        },
        subscribe: function(a) {
            return z.push(a), function() {
                z.splice(z.indexOf(a), 1);
            };
        }
    });
    return {
        store: B,
        widgetsManager: A,
        getWidgetsIds: function() {
            return B.getState().metadata.reduce(function(a, b) {
                return void 0 !== b.id ? a.concat(b.id) : a;
            }, []);
        },
        getSearchParameters: v,
        onSearchForFacetValues: function(c) {
            var e = c.facetName, f = c.query, d = c.maxFacetHits;
            B.setState(b({}, B.getState(), {
                searchingForFacetValues: !0
            })), u.searchForFacetValues(e, f, Math.max(1, Math.min(void 0 === d ? 10 : d, 100))).then(function(d) {
                var c;
                B.setState(b({}, B.getState(), {
                    error: null,
                    searchingForFacetValues: !1,
                    resultsFacetValues: b({}, B.getState().resultsFacetValues, (a(c = {}, e, d.facetHits), a(c, "query", f), c))
                }));
            }, function(a) {
                B.setState(b({}, B.getState(), {
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
            var c = D(a);
            B.setState(b({}, B.getState(), {
                widgets: a,
                metadata: c,
                searching: !0
            })), E();
        },
        transitionState: function(a) {
            var b = B.getState().widgets;
            return A.getWidgets().filter(function(a) {
                return Boolean(a.transitionState);
            }).reduce(function(a, c) {
                return c.transitionState(b, a);
            }, a);
        },
        updateClient: function(a) {
            k(a), u.setClient(a), E();
        },
        updateIndex: function(a) {
            K = K.setIndex(a);
        },
        clearCache: function() {
            u.clearCache(), E();
        },
        skipSearch: function() {
            I = !0;
        }
    };
};
function r(a) {
    return a ? a.metadata.map(function(a) {
        return b({
            value: function() {
                return {};
            }
        }, a, {
            items: a.items && a.items.map(function(a) {
                return b({
                    value: function() {
                        return {};
                    }
                }, a, {
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
