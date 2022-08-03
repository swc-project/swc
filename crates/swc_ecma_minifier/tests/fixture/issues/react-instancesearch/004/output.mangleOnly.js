import * as e from "@swc/helpers";
import t from "algoliasearch-helper";
import r from "./createWidgetsManager";
import { HIGHLIGHT_TAGS as a } from "./highlight";
import { hasMultipleIndices as n } from "./indexUtils";
import { version as s } from "react";
import u from "./version";
function i(e) {
    if (typeof e.addAlgoliaAgent === "function") {
        e.addAlgoliaAgent("react (".concat(s, ")"));
        e.addAlgoliaAgent("react-instantsearch (".concat(u, ")"));
    }
}
var c = function(e) {
    return n({
        ais: e.props.contextValue,
        multiIndexContext: e.props.indexContextValue
    });
};
var o = function(e, t) {
    return e.props.indexContextValue.targetedIndex === t;
};
var f = function(e) {
    return Boolean(e.props.indexId);
};
var d = function(e, t) {
    return e.props.indexId === t;
};
var l = function(e, t) {
    var r = f(e);
    var a = f(t);
    if (r && !a) {
        return -1;
    }
    if (!r && a) {
        return 1;
    }
    return 0;
};
function p(e) {
    var t = function(e) {
        return (Object.prototype.toString.call(e) === "[object Object]" || Object.prototype.toString.call(e) === "[object Array]");
    };
    var r = function(e) {
        for(var t = arguments.length, r = new Array(t > 1 ? t - 1 : 0), a = 1; a < t; a++){
            r[a - 1] = arguments[a];
        }
        var n = 0;
        return e.replace(/%s/g, function() {
            return encodeURIComponent(r[n++]);
        });
    };
    return Object.keys(e).map(function(a) {
        return r("%s=%s", a, t(e[a]) ? JSON.stringify(e[a]) : e[a]);
    }).join("&");
}
var v;
export default function m(n) {
    var s = n.indexName, u = n.initialState, m = u === void 0 ? {} : u, S = n.searchClient, h = n.resultsState, x = n.stalledSearchDelay;
    var y = function e(t) {
        var r = t;
        var a = [];
        return {
            getState: function() {
                return r;
            },
            setState: function(e) {
                r = e;
                a.forEach(function(e) {
                    return e();
                });
            },
            subscribe: function(e) {
                a.push(e);
                return function t() {
                    a.splice(a.indexOf(e), 1);
                };
            }
        };
    };
    var b = function e() {
        D = true;
    };
    var P = function e(t) {
        i(t);
        B.setClient(t);
        I();
    };
    var j = function e() {
        B.clearCache();
        I();
    };
    var w = function e(t) {
        return z.getWidgets().filter(function(e) {
            return Boolean(e.getMetadata);
        }).map(function(e) {
            return e.getMetadata(t);
        });
    };
    var F = function t() {
        var r = z.getWidgets().filter(function(e) {
            return Boolean(e.getSearchParameters);
        }).filter(function(e) {
            return !c(e) && !f(e);
        }).reduce(function(e, t) {
            return t.getSearchParameters(e);
        }, U);
        var a = z.getWidgets().filter(function(e) {
            return Boolean(e.getSearchParameters);
        }).filter(function(e) {
            var t = c(e) && o(e, s);
            var r = f(e) && d(e, s);
            return t || r;
        }).sort(l).reduce(function(e, t) {
            return t.getSearchParameters(e);
        }, r);
        var n = z.getWidgets().filter(function(e) {
            return Boolean(e.getSearchParameters);
        }).filter(function(e) {
            var t = c(e) && !o(e, s);
            var r = f(e) && !d(e, s);
            return (t || r);
        }).sort(l).reduce(function(t, r) {
            var a = c(r) ? r.props.indexContextValue.targetedIndex : r.props.indexId;
            var n = t[a] || [];
            return e.objectSpread({}, t, e.defineProperty({}, a, n.concat(r)));
        }, {});
        var u = Object.keys(n).map(function(e) {
            return {
                parameters: n[e].reduce(function(e, t) {
                    return t.getSearchParameters(e);
                }, r),
                indexId: e
            };
        });
        return {
            mainParameters: a,
            derivedParameters: u
        };
    };
    var I = function e() {
        if (!D) {
            var t = F(B.state), r = t.mainParameters, a = t.derivedParameters;
            B.derivedHelpers.slice().forEach(function(e) {
                e.detach();
            });
            a.forEach(function(e) {
                var t = e.indexId, r = e.parameters;
                var a = B.derive(function() {
                    return r;
                });
                a.on("result", C({
                    indexId: t
                })).on("error", V);
            });
            B.setState(r);
            B.search();
        }
    };
    var C = function t(r) {
        var a = r.indexId;
        return function(t) {
            var r = G.getState();
            var n = !B.derivedHelpers.length;
            var s = r.results ? r.results : {};
            s = !n && s.getFacetByName ? {} : s;
            if (!n) {
                s = e.objectSpread({}, s, e.defineProperty({}, a, t.results));
            } else {
                s = t.results;
            }
            var u = G.getState();
            var i = u.isSearchStalled;
            if (!B.hasPendingRequests()) {
                clearTimeout(O);
                O = null;
                i = false;
            }
            var c = u.resultsFacetValues, o = e.objectWithoutProperties(u, [
                "resultsFacetValues"
            ]);
            G.setState(e.objectSpread({}, o, {
                results: s,
                isSearchStalled: i,
                searching: false,
                error: null
            }));
        };
    };
    var V = function t(r) {
        var a = r.error;
        var n = G.getState();
        var s = n.isSearchStalled;
        if (!B.hasPendingRequests()) {
            clearTimeout(O);
            s = false;
        }
        var u = n.resultsFacetValues, i = e.objectWithoutProperties(n, [
            "resultsFacetValues", 
        ]);
        G.setState(e.objectSpread({}, i, {
            isSearchStalled: s,
            error: a,
            searching: false
        }));
    };
    var R = function t() {
        if (!O) {
            O = setTimeout(function() {
                var t = G.getState(), r = t.resultsFacetValues, a = e.objectWithoutProperties(t, [
                    "resultsFacetValues", 
                ]);
                G.setState(e.objectSpread({}, a, {
                    isSearchStalled: true
                }));
            }, x);
        }
    };
    var _ = function t(r, a) {
        if (!a) {
            return;
        }
        if ((!r.transporter || r._cacheHydrated) && (!r._useCache || typeof r.addAlgoliaAgent !== "function")) {
            return;
        }
        if (r.transporter && !r._cacheHydrated) {
            r._cacheHydrated = true;
            var n = r.search;
            r.search = function(t) {
                for(var a = arguments.length, s = new Array(a > 1 ? a - 1 : 0), u = 1; u < a; u++){
                    s[u - 1] = arguments[u];
                }
                var i = t.map(function(t) {
                    return e.objectSpread({}, t, {
                        params: p(t.params)
                    });
                });
                return r.transporter.responsesCache.get({
                    method: "search",
                    args: [
                        i
                    ].concat(e.toConsumableArray(s))
                }, function() {
                    return n.apply(void 0, [
                        t
                    ].concat(e.toConsumableArray(s)));
                });
            };
        }
        if (Array.isArray(a.results)) {
            A(r, a.results);
            return;
        }
        $(r, a);
    };
    var A = function t(r, a) {
        if (r.transporter) {
            r.transporter.responsesCache.set({
                method: "search",
                args: [
                    a.reduce(function(e, t) {
                        return e.concat(t.rawResults.map(function(e) {
                            return {
                                indexName: e.index,
                                params: e.params
                            };
                        }));
                    }, []), 
                ]
            }, {
                results: a.reduce(function(e, t) {
                    return e.concat(t.rawResults);
                }, [])
            });
            return;
        }
        var n = "/1/indexes/*/queries_body_".concat(JSON.stringify({
            requests: a.reduce(function(e, t) {
                return e.concat(t.rawResults.map(function(e) {
                    return {
                        indexName: e.index,
                        params: e.params
                    };
                }));
            }, [])
        }));
        r.cache = e.objectSpread({}, r.cache, e.defineProperty({}, n, JSON.stringify({
            results: a.reduce(function(e, t) {
                return e.concat(t.rawResults);
            }, [])
        })));
    };
    var $ = function t(r, a) {
        if (r.transporter) {
            r.transporter.responsesCache.set({
                method: "search",
                args: [
                    a.rawResults.map(function(e) {
                        return {
                            indexName: e.index,
                            params: e.params
                        };
                    }), 
                ]
            }, {
                results: a.rawResults
            });
            return;
        }
        var n = "/1/indexes/*/queries_body_".concat(JSON.stringify({
            requests: a.rawResults.map(function(e) {
                return {
                    indexName: e.index,
                    params: e.params
                };
            })
        }));
        r.cache = e.objectSpread({}, r.cache, e.defineProperty({}, n, JSON.stringify({
            results: a.rawResults
        })));
    };
    var W = function r(a) {
        if (!a) {
            return null;
        }
        if (Array.isArray(a.results)) {
            return a.results.reduce(function(r, a) {
                return e.objectSpread({}, r, e.defineProperty({}, a._internalIndexId, new t.SearchResults(new t.SearchParameters(a.state), a.rawResults)));
            }, {});
        }
        return new t.SearchResults(new t.SearchParameters(a.state), a.rawResults);
    };
    var H = function t() {
        var r = w(G.getState().widgets);
        G.setState(e.objectSpread({}, G.getState(), {
            metadata: r,
            searching: true
        }));
        I();
    };
    var N = function e(t) {
        var r = G.getState().widgets;
        return z.getWidgets().filter(function(e) {
            return Boolean(e.transitionState);
        }).reduce(function(e, t) {
            return t.transitionState(r, e);
        }, t);
    };
    var q = function t(r) {
        var a = w(r);
        G.setState(e.objectSpread({}, G.getState(), {
            widgets: r,
            metadata: a,
            searching: true
        }));
        I();
    };
    var E = function t(r) {
        var a = r.facetName, n = r.query, s = r.maxFacetHits, u = s === void 0 ? 10 : s;
        var i = Math.max(1, Math.min(u, 100));
        G.setState(e.objectSpread({}, G.getState(), {
            searchingForFacetValues: true
        }));
        B.searchForFacetValues(a, n, i).then(function(t) {
            G.setState(e.objectSpread({}, G.getState(), {
                error: null,
                searchingForFacetValues: false,
                resultsFacetValues: e.objectSpread({}, G.getState().resultsFacetValues, ((v = {}), e.defineProperty(v, a, t.facetHits), e.defineProperty(v, "query", n), v))
            }));
        }, function(t) {
            G.setState(e.objectSpread({}, G.getState(), {
                searchingForFacetValues: false,
                error: t
            }));
        }).catch(function(e) {
            setTimeout(function() {
                throw e;
            });
        });
    };
    var k = function e(t) {
        U = U.setIndex(t);
    };
    var M = function e() {
        return G.getState().metadata.reduce(function(e, t) {
            return typeof t.id !== "undefined" ? e.concat(t.id) : e;
        }, []);
    };
    var B = t(S, s, e.objectSpread({}, a));
    i(S);
    B.on("search", R).on("result", C({
        indexId: s
    })).on("error", V);
    var D = false;
    var O = null;
    var U = B.state;
    var z = r(H);
    _(S, h);
    var G = y({
        widgets: m,
        metadata: g(h),
        results: W(h),
        error: null,
        searching: false,
        isSearchStalled: true,
        searchingForFacetValues: false
    });
    return {
        store: G,
        widgetsManager: z,
        getWidgetsIds: M,
        getSearchParameters: F,
        onSearchForFacetValues: E,
        onExternalStateUpdate: q,
        transitionState: N,
        updateClient: P,
        updateIndex: k,
        clearCache: j,
        skipSearch: b
    };
};
function g(t) {
    if (!t) {
        return [];
    }
    return t.metadata.map(function(t) {
        return e.objectSpread({
            value: function() {
                return {};
            }
        }, t, {
            items: t.items && t.items.map(function(t) {
                return e.objectSpread({
                    value: function() {
                        return {};
                    }
                }, t, {
                    items: t.items && t.items.map(function(t) {
                        return e.objectSpread({
                            value: function() {
                                return {};
                            }
                        }, t);
                    })
                });
            })
        });
    });
}
