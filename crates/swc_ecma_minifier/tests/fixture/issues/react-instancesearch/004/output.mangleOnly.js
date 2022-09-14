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
var o = function(e) {
    return n({
        ais: e.props.contextValue,
        multiIndexContext: e.props.indexContextValue
    });
};
var c = function(e, t) {
    return e.props.indexContextValue.targetedIndex === t;
};
var l = function(e) {
    return Boolean(e.props.indexId);
};
var f = function(e, t) {
    return e.props.indexId === t;
};
var d = function(e, t) {
    var r = l(e);
    var a = l(t);
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
        T = true;
    };
    var j = function e(t) {
        i(t);
        E.setClient(t);
        V();
    };
    var P = function e() {
        E.clearCache();
        V();
    };
    var w = function e(t) {
        return D.getWidgets().filter(function(e) {
            return Boolean(e.getMetadata);
        }).map(function(e) {
            return e.getMetadata(t);
        });
    };
    var F = function t() {
        var r = D.getWidgets().filter(function(e) {
            return Boolean(e.getSearchParameters);
        }).filter(function(e) {
            return !o(e) && !l(e);
        }).reduce(function(e, t) {
            return t.getSearchParameters(e);
        }, U);
        var a = D.getWidgets().filter(function(e) {
            return Boolean(e.getSearchParameters);
        }).filter(function(e) {
            var t = o(e) && c(e, s);
            var r = l(e) && f(e, s);
            return t || r;
        }).sort(d).reduce(function(e, t) {
            return t.getSearchParameters(e);
        }, r);
        var n = D.getWidgets().filter(function(e) {
            return Boolean(e.getSearchParameters);
        }).filter(function(e) {
            var t = o(e) && !c(e, s);
            var r = l(e) && !f(e, s);
            return (t || r);
        }).sort(d).reduce(function(t, r) {
            var a = o(r) ? r.props.indexContextValue.targetedIndex : r.props.indexId;
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
    var V = function e() {
        if (!T) {
            var t = F(E.state), r = t.mainParameters, a = t.derivedParameters;
            E.derivedHelpers.slice().forEach(function(e) {
                e.detach();
            });
            a.forEach(function(e) {
                var t = e.indexId, r = e.parameters;
                var a = E.derive(function() {
                    return r;
                });
                a.on("result", A({
                    indexId: t
                })).on("error", I);
            });
            E.setState(r);
            E.search();
        }
    };
    var A = function t(r) {
        var a = r.indexId;
        return function(t) {
            var r = z.getState();
            var n = !E.derivedHelpers.length;
            var s = r.results ? r.results : {};
            s = !n && s.getFacetByName ? {} : s;
            if (!n) {
                s = e.objectSpread({}, s, e.defineProperty({}, a, t.results));
            } else {
                s = t.results;
            }
            var u = z.getState();
            var i = u.isSearchStalled;
            if (!E.hasPendingRequests()) {
                clearTimeout(k);
                k = null;
                i = false;
            }
            var o = u.resultsFacetValues, c = e.objectWithoutProperties(u, [
                "resultsFacetValues"
            ]);
            z.setState(e.objectSpread({}, c, {
                results: s,
                isSearchStalled: i,
                searching: false,
                error: null
            }));
        };
    };
    var I = function t(r) {
        var a = r.error;
        var n = z.getState();
        var s = n.isSearchStalled;
        if (!E.hasPendingRequests()) {
            clearTimeout(k);
            s = false;
        }
        var u = n.resultsFacetValues, i = e.objectWithoutProperties(n, [
            "resultsFacetValues", 
        ]);
        z.setState(e.objectSpread({}, i, {
            isSearchStalled: s,
            error: a,
            searching: false
        }));
    };
    var C = function t() {
        if (!k) {
            k = setTimeout(function() {
                var t = z.getState(), r = t.resultsFacetValues, a = e.objectWithoutProperties(t, [
                    "resultsFacetValues", 
                ]);
                z.setState(e.objectSpread({}, a, {
                    isSearchStalled: true
                }));
            }, x);
        }
    };
    var R = function t(r, a) {
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
            N(r, a.results);
            return;
        }
        O(r, a);
    };
    var N = function t(r, a) {
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
    var O = function t(r, a) {
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
    var _ = function t() {
        var r = w(z.getState().widgets);
        z.setState(e.objectSpread({}, z.getState(), {
            metadata: r,
            searching: true
        }));
        V();
    };
    var q = function e(t) {
        var r = z.getState().widgets;
        return D.getWidgets().filter(function(e) {
            return Boolean(e.transitionState);
        }).reduce(function(e, t) {
            return t.transitionState(r, e);
        }, t);
    };
    var B = function t(r) {
        var a = w(r);
        z.setState(e.objectSpread({}, z.getState(), {
            widgets: r,
            metadata: a,
            searching: true
        }));
        V();
    };
    var H = function t(r) {
        var a = r.facetName, n = r.query, s = r.maxFacetHits, u = s === void 0 ? 10 : s;
        var i = Math.max(1, Math.min(u, 100));
        z.setState(e.objectSpread({}, z.getState(), {
            searchingForFacetValues: true
        }));
        E.searchForFacetValues(a, n, i).then(function(t) {
            z.setState(e.objectSpread({}, z.getState(), {
                error: null,
                searchingForFacetValues: false,
                resultsFacetValues: e.objectSpread({}, z.getState().resultsFacetValues, ((v = {}), e.defineProperty(v, a, t.facetHits), e.defineProperty(v, "query", n), v))
            }));
        }, function(t) {
            z.setState(e.objectSpread({}, z.getState(), {
                searchingForFacetValues: false,
                error: t
            }));
        }).catch(function(e) {
            setTimeout(function() {
                throw e;
            });
        });
    };
    var M = function e(t) {
        U = U.setIndex(t);
    };
    var J = function e() {
        return z.getState().metadata.reduce(function(e, t) {
            return typeof t.id !== "undefined" ? e.concat(t.id) : e;
        }, []);
    };
    var E = t(S, s, e.objectSpread({}, a));
    i(S);
    E.on("search", C).on("result", A({
        indexId: s
    })).on("error", I);
    var T = false;
    var k = null;
    var U = E.state;
    var D = r(_);
    R(S, h);
    var z = y({
        widgets: m,
        metadata: g(h),
        results: W(h),
        error: null,
        searching: false,
        isSearchStalled: true,
        searchingForFacetValues: false
    });
    return {
        store: z,
        widgetsManager: D,
        getWidgetsIds: J,
        getSearchParameters: F,
        onSearchForFacetValues: H,
        onExternalStateUpdate: B,
        transitionState: q,
        updateClient: j,
        updateIndex: M,
        clearCache: P,
        skipSearch: b
    };
}
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
