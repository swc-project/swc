import * as a from "@swc/helpers";
import b from "algoliasearch-helper";
import c from "./createWidgetsManager";
import { HIGHLIGHT_TAGS as d } from "./highlight";
import { hasMultipleIndices as e } from "./indexUtils";
import { version as f } from "react";
import g from "./version";
function h(a) {
    if (typeof a.addAlgoliaAgent === "function") {
        a.addAlgoliaAgent("react (".concat(f, ")"));
        a.addAlgoliaAgent("react-instantsearch (".concat(g, ")"));
    }
}
var i = function(a) {
    return e({
        ais: a.props.contextValue,
        multiIndexContext: a.props.indexContextValue
    });
};
var j = function(a, b) {
    return a.props.indexContextValue.targetedIndex === b;
};
var k = function(a) {
    return Boolean(a.props.indexId);
};
var l = function(a, b) {
    return a.props.indexId === b;
};
var m = function(a, b) {
    var c = k(a);
    var d = k(b);
    if (c && !d) {
        return -1;
    }
    if (!c && d) {
        return 1;
    }
    return 0;
};
function n(a) {
    var b = function(a) {
        return (Object.prototype.toString.call(a) === "[object Object]" || Object.prototype.toString.call(a) === "[object Array]");
    };
    var c = function(a) {
        for(var b = arguments.length, c = new Array(b > 1 ? b - 1 : 0), d = 1; d < b; d++){
            c[d - 1] = arguments[d];
        }
        var e = 0;
        return a.replace(/%s/g, function() {
            return encodeURIComponent(c[e++]);
        });
    };
    return Object.keys(a).map(function(d) {
        return c("%s=%s", d, b(a[d]) ? JSON.stringify(a[d]) : a[d]);
    }).join("&");
}
var o;
export default function p(e) {
    var f = e.indexName, g = e.initialState, p = g === void 0 ? {} : g, r = e.searchClient, s = e.resultsState, t = e.stalledSearchDelay;
    var u = function a(b) {
        var c = b;
        var d = [];
        return {
            getState: function() {
                return c;
            },
            setState: function(a) {
                c = a;
                d.forEach(function(a) {
                    return a();
                });
            },
            subscribe: function(a) {
                d.push(a);
                return function b() {
                    d.splice(d.indexOf(a), 1);
                };
            }
        };
    };
    var v = function a() {
        P = true;
    };
    var w = function a(b) {
        h(b);
        O.setClient(b);
        A();
    };
    var x = function a() {
        O.clearCache();
        A();
    };
    var y = function a(b) {
        return S.getWidgets().filter(function(a) {
            return Boolean(a.getMetadata);
        }).map(function(a) {
            return a.getMetadata(b);
        });
    };
    var z = function b() {
        var c = S.getWidgets().filter(function(a) {
            return Boolean(a.getSearchParameters);
        }).filter(function(a) {
            return !i(a) && !k(a);
        }).reduce(function(a, b) {
            return b.getSearchParameters(a);
        }, R);
        var d = S.getWidgets().filter(function(a) {
            return Boolean(a.getSearchParameters);
        }).filter(function(a) {
            var b = i(a) && j(a, f);
            var c = k(a) && l(a, f);
            return b || c;
        }).sort(m).reduce(function(a, b) {
            return b.getSearchParameters(a);
        }, c);
        var e = S.getWidgets().filter(function(a) {
            return Boolean(a.getSearchParameters);
        }).filter(function(a) {
            var b = i(a) && !j(a, f);
            var c = k(a) && !l(a, f);
            return (b || c);
        }).sort(m).reduce(function(b, c) {
            var d = i(c) ? c.props.indexContextValue.targetedIndex : c.props.indexId;
            var e = b[d] || [];
            return a.objectSpread({}, b, a.defineProperty({}, d, e.concat(c)));
        }, {});
        var g = Object.keys(e).map(function(a) {
            return {
                parameters: e[a].reduce(function(a, b) {
                    return b.getSearchParameters(a);
                }, c),
                indexId: a
            };
        });
        return {
            mainParameters: d,
            derivedParameters: g
        };
    };
    var A = function a() {
        if (!P) {
            var b = z(O.state), c = b.mainParameters, d = b.derivedParameters;
            O.derivedHelpers.slice().forEach(function(a) {
                a.detach();
            });
            d.forEach(function(a) {
                var b = a.indexId, c = a.parameters;
                var d = O.derive(function() {
                    return c;
                });
                d.on("result", B({
                    indexId: b
                })).on("error", C);
            });
            O.setState(c);
            O.search();
        }
    };
    var B = function b(c) {
        var d = c.indexId;
        return function(b) {
            var c = T.getState();
            var e = !O.derivedHelpers.length;
            var f = c.results ? c.results : {};
            f = !e && f.getFacetByName ? {} : f;
            if (!e) {
                f = a.objectSpread({}, f, a.defineProperty({}, d, b.results));
            } else {
                f = b.results;
            }
            var g = T.getState();
            var h = g.isSearchStalled;
            if (!O.hasPendingRequests()) {
                clearTimeout(Q);
                Q = null;
                h = false;
            }
            var i = g.resultsFacetValues, j = a.objectWithoutProperties(g, [
                "resultsFacetValues"
            ]);
            T.setState(a.objectSpread({}, j, {
                results: f,
                isSearchStalled: h,
                searching: false,
                error: null
            }));
        };
    };
    var C = function b(c) {
        var d = c.error;
        var e = T.getState();
        var f = e.isSearchStalled;
        if (!O.hasPendingRequests()) {
            clearTimeout(Q);
            f = false;
        }
        var g = e.resultsFacetValues, h = a.objectWithoutProperties(e, [
            "resultsFacetValues", 
        ]);
        T.setState(a.objectSpread({}, h, {
            isSearchStalled: f,
            error: d,
            searching: false
        }));
    };
    var D = function b() {
        if (!Q) {
            Q = setTimeout(function() {
                var b = T.getState(), c = b.resultsFacetValues, d = a.objectWithoutProperties(b, [
                    "resultsFacetValues", 
                ]);
                T.setState(a.objectSpread({}, d, {
                    isSearchStalled: true
                }));
            }, t);
        }
    };
    var E = function b(c, d) {
        if (!d) {
            return;
        }
        if ((!c.transporter || c._cacheHydrated) && (!c._useCache || typeof c.addAlgoliaAgent !== "function")) {
            return;
        }
        if (c.transporter && !c._cacheHydrated) {
            c._cacheHydrated = true;
            var e = c.search;
            c.search = function(b) {
                for(var d = arguments.length, f = new Array(d > 1 ? d - 1 : 0), g = 1; g < d; g++){
                    f[g - 1] = arguments[g];
                }
                var h = b.map(function(b) {
                    return a.objectSpread({}, b, {
                        params: n(b.params)
                    });
                });
                return c.transporter.responsesCache.get({
                    method: "search",
                    args: [
                        h
                    ].concat(a.toConsumableArray(f))
                }, function() {
                    return e.apply(void 0, [
                        b
                    ].concat(a.toConsumableArray(f)));
                });
            };
        }
        if (Array.isArray(d.results)) {
            F(c, d.results);
            return;
        }
        G(c, d);
    };
    var F = function b(c, d) {
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
        c.cache = a.objectSpread({}, c.cache, a.defineProperty({}, e, JSON.stringify({
            results: d.reduce(function(a, b) {
                return a.concat(b.rawResults);
            }, [])
        })));
    };
    var G = function b(c, d) {
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
        c.cache = a.objectSpread({}, c.cache, a.defineProperty({}, e, JSON.stringify({
            results: d.rawResults
        })));
    };
    var H = function c(d) {
        if (!d) {
            return null;
        }
        if (Array.isArray(d.results)) {
            return d.results.reduce(function(c, d) {
                return a.objectSpread({}, c, a.defineProperty({}, d._internalIndexId, new b.SearchResults(new b.SearchParameters(d.state), d.rawResults)));
            }, {});
        }
        return new b.SearchResults(new b.SearchParameters(d.state), d.rawResults);
    };
    var I = function b() {
        var c = y(T.getState().widgets);
        T.setState(a.objectSpread({}, T.getState(), {
            metadata: c,
            searching: true
        }));
        A();
    };
    var J = function a(b) {
        var c = T.getState().widgets;
        return S.getWidgets().filter(function(a) {
            return Boolean(a.transitionState);
        }).reduce(function(a, b) {
            return b.transitionState(c, a);
        }, b);
    };
    var K = function b(c) {
        var d = y(c);
        T.setState(a.objectSpread({}, T.getState(), {
            widgets: c,
            metadata: d,
            searching: true
        }));
        A();
    };
    var L = function b(c) {
        var d = c.facetName, e = c.query, f = c.maxFacetHits, g = f === void 0 ? 10 : f;
        var h = Math.max(1, Math.min(g, 100));
        T.setState(a.objectSpread({}, T.getState(), {
            searchingForFacetValues: true
        }));
        O.searchForFacetValues(d, e, h).then(function(b) {
            T.setState(a.objectSpread({}, T.getState(), {
                error: null,
                searchingForFacetValues: false,
                resultsFacetValues: a.objectSpread({}, T.getState().resultsFacetValues, ((o = {}), a.defineProperty(o, d, b.facetHits), a.defineProperty(o, "query", e), o))
            }));
        }, function(b) {
            T.setState(a.objectSpread({}, T.getState(), {
                searchingForFacetValues: false,
                error: b
            }));
        }).catch(function(a) {
            setTimeout(function() {
                throw a;
            });
        });
    };
    var M = function a(b) {
        R = R.setIndex(b);
    };
    var N = function a() {
        return T.getState().metadata.reduce(function(a, b) {
            return typeof b.id !== "undefined" ? a.concat(b.id) : a;
        }, []);
    };
    var O = b(r, f, a.objectSpread({}, d));
    h(r);
    O.on("search", D).on("result", B({
        indexId: f
    })).on("error", C);
    var P = false;
    var Q = null;
    var R = O.state;
    var S = c(I);
    E(r, s);
    var T = u({
        widgets: p,
        metadata: q(s),
        results: H(s),
        error: null,
        searching: false,
        isSearchStalled: true,
        searchingForFacetValues: false
    });
    return {
        store: T,
        widgetsManager: S,
        getWidgetsIds: N,
        getSearchParameters: z,
        onSearchForFacetValues: L,
        onExternalStateUpdate: K,
        transitionState: J,
        updateClient: w,
        updateIndex: M,
        clearCache: x,
        skipSearch: v
    };
};
function q(b) {
    if (!b) {
        return [];
    }
    return b.metadata.map(function(b) {
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
    });
}
