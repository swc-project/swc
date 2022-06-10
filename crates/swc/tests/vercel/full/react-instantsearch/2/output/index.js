import a from "@swc/helpers/lib/_define_property.js";
import b from "@swc/helpers/lib/_object_spread.js";
import c from "@swc/helpers/lib/_object_spread_props.js";
import d from "@swc/helpers/lib/_object_without_properties.js";
import e from "@swc/helpers/lib/_to_consumable_array.js";
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
}, q = function(c, d) {
    var a = o(c), b = o(d);
    return a && !b ? -1 : !a && b ? 1 : 0;
};
export default function r(i) {
    var t = i.indexName, u = i.initialState, k = i.searchClient, r = i.resultsState, D = i.stalledSearchDelay, E = function(a) {
        return B.getWidgets().filter(function(a) {
            return Boolean(a.getMetadata);
        }).map(function(b) {
            return b.getMetadata(a);
        });
    }, w = function() {
        var d = B.getWidgets().filter(function(a) {
            return Boolean(a.getSearchParameters);
        }).filter(function(a) {
            return !m(a) && !o(a);
        }).reduce(function(a, b) {
            return b.getSearchParameters(a);
        }, L), e = B.getWidgets().filter(function(a) {
            return Boolean(a.getSearchParameters);
        }).filter(function(a) {
            var b = m(a) && n(a, t), c = o(a) && p(a, t);
            return b || c;
        }).sort(q).reduce(function(a, b) {
            return b.getSearchParameters(a);
        }, d), f = B.getWidgets().filter(function(a) {
            return Boolean(a.getSearchParameters);
        }).filter(function(a) {
            var b = m(a) && !n(a, t), c = o(a) && !p(a, t);
            return b || c;
        }).sort(q).reduce(function(e, d) {
            var f = m(d) ? d.props.indexContextValue.targetedIndex : d.props.indexId, g = e[f] || [];
            return c(b({}, e), a({}, f, g.concat(d)));
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
    }, F = function() {
        if (!J) {
            var a = w(v.state), b = a.mainParameters, c = a.derivedParameters;
            v.derivedHelpers.slice().forEach(function(a) {
                a.detach();
            }), c.forEach(function(a) {
                var b = a.indexId, d = a.parameters, c = v.derive(function() {
                    return d;
                });
                c.on("result", x({
                    indexId: b
                })).on("error", y);
            }), v.setState(b), v.search();
        }
    }, x = function(e) {
        var f = e.indexId;
        return function(h) {
            var i = C.getState(), j = !v.derivedHelpers.length, e = i.results ? i.results : {};
            e = !j && e.getFacetByName ? {} : e, e = j ? h.results : c(b({}, e), a({}, f, h.results));
            var g = C.getState(), k = g.isSearchStalled;
            v.hasPendingRequests() || (clearTimeout(K), K = null, k = !1), g.resultsFacetValues;
            var l = d(g, [
                "resultsFacetValues"
            ]);
            C.setState(c(b({}, l), {
                results: e,
                isSearchStalled: k,
                searching: !1,
                error: null
            }));
        };
    }, y = function(f) {
        var g = f.error, a = C.getState(), e = a.isSearchStalled;
        v.hasPendingRequests() || (clearTimeout(K), e = !1), a.resultsFacetValues;
        var h = d(a, [
            "resultsFacetValues"
        ]);
        C.setState(c(b({}, h), {
            isSearchStalled: e,
            error: g,
            searching: !1
        }));
    }, G = function(d, e) {
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
    }, H = function(d, e) {
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
    }, v = f(k, t, b({}, h));
    l(k), v.on("search", function() {
        !K && (K = setTimeout(function() {
            var a = C.getState(), e = (a.resultsFacetValues, d(a, [
                "resultsFacetValues"
            ]));
            C.setState(c(b({}, e), {
                isSearchStalled: !0
            }));
        }, D));
    }).on("result", x({
        indexId: t
    })).on("error", y);
    var j, I, z, A, J = !1, K = null, L = v.state, B = g(function() {
        var a = E(C.getState().widgets);
        C.setState(c(b({}, C.getState()), {
            metadata: a,
            searching: !0
        })), F();
    });
    !function(a, d) {
        if (d && (a.transporter && !a._cacheHydrated || a._useCache && "function" == typeof a.addAlgoliaAgent)) {
            if (a.transporter && !a._cacheHydrated) {
                a._cacheHydrated = !0;
                var f = a.search;
                a.search = function(i) {
                    for(var g = arguments.length, h = new Array(g > 1 ? g - 1 : 0), d = 1; d < g; d++)h[d - 1] = arguments[d];
                    var j = i.map(function(a) {
                        var d, e;
                        return c(b({}, a), {
                            params: (d = a.params, e = function(c) {
                                for(var b = arguments.length, d = new Array(b > 1 ? b - 1 : 0), a = 1; a < b; a++)d[a - 1] = arguments[a];
                                var e = 0;
                                return c.replace(/%s/g, function() {
                                    return encodeURIComponent(d[e++]);
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
                            i
                        ].concat(e(h)));
                    });
                };
            }
            if (Array.isArray(d.results)) {
                G(a, d.results);
                return;
            }
            H(a, d);
        }
    }(k, r);
    var C = (z = {
        widgets: void 0 === u ? {} : u,
        metadata: s(r),
        results: (j = r) ? Array.isArray(j.results) ? j.results.reduce(function(e, d) {
            return c(b({}, e), a({}, d._internalIndexId, new f.SearchResults(new f.SearchParameters(d.state), d.rawResults)));
        }, {}) : new f.SearchResults(new f.SearchParameters(j.state), j.rawResults) : null,
        error: null,
        searching: !1,
        isSearchStalled: !0,
        searchingForFacetValues: !1
    }, A = [], {
        getState: function() {
            return z;
        },
        setState: function(a) {
            z = a, A.forEach(function(a) {
                return a();
            });
        },
        subscribe: function(a) {
            return A.push(a), function() {
                A.splice(A.indexOf(a), 1);
            };
        }
    });
    return {
        store: C,
        widgetsManager: B,
        getWidgetsIds: function() {
            return C.getState().metadata.reduce(function(a, b) {
                return void 0 !== b.id ? a.concat(b.id) : a;
            }, []);
        },
        getSearchParameters: w,
        onSearchForFacetValues: function(d) {
            var f = d.facetName, g = d.query, e = d.maxFacetHits;
            C.setState(c(b({}, C.getState()), {
                searchingForFacetValues: !0
            })), v.searchForFacetValues(f, g, Math.max(1, Math.min(void 0 === e ? 10 : e, 100))).then(function(e) {
                var d;
                C.setState(c(b({}, C.getState()), {
                    error: null,
                    searchingForFacetValues: !1,
                    resultsFacetValues: c(b({}, C.getState().resultsFacetValues), (a(d = {}, f, e.facetHits), a(d, "query", g), d))
                }));
            }, function(a) {
                C.setState(c(b({}, C.getState()), {
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
            var d = E(a);
            C.setState(c(b({}, C.getState()), {
                widgets: a,
                metadata: d,
                searching: !0
            })), F();
        },
        transitionState: function(a) {
            var b = C.getState().widgets;
            return B.getWidgets().filter(function(a) {
                return Boolean(a.transitionState);
            }).reduce(function(a, c) {
                return c.transitionState(b, a);
            }, a);
        },
        updateClient: function(a) {
            l(a), v.setClient(a), F();
        },
        updateIndex: function(a) {
            L = L.setIndex(a);
        },
        clearCache: function() {
            v.clearCache(), F();
        },
        skipSearch: function() {
            J = !0;
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
