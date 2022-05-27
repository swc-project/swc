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
var m = function(c, d) {
    var a = k(c);
    var b = k(d);
    if (a && !b) {
        return -1;
    }
    if (!a && b) {
        return 1;
    }
    return 0;
};
function n(a) {
    var b = function(a) {
        return (Object.prototype.toString.call(a) === "[object Object]" || Object.prototype.toString.call(a) === "[object Array]");
    };
    var c = function(c) {
        for(var b = arguments.length, d = new Array(b > 1 ? b - 1 : 0), a = 1; a < b; a++){
            d[a - 1] = arguments[a];
        }
        var e = 0;
        return c.replace(/%s/g, function() {
            return encodeURIComponent(d[e++]);
        });
    };
    return Object.keys(a).map(function(d) {
        return c("%s=%s", d, b(a[d]) ? JSON.stringify(a[d]) : a[d]);
    }).join("&");
}
var o;
export default function p(e) {
    var p = e.indexName, r = e.initialState, t = r === void 0 ? {} : r, f = e.searchClient, g = e.resultsState, M = e.stalledSearchDelay;
    var u = function b(a) {
        var c = a;
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
        R = true;
    };
    var w = function b(a) {
        h(a);
        s.setClient(a);
        O();
    };
    var x = function a() {
        s.clearCache();
        O();
    };
    var N = function a(b) {
        return K.getWidgets().filter(function(a) {
            return Boolean(a.getMetadata);
        }).map(function(a) {
            return a.getMetadata(b);
        });
    };
    var y = function f() {
        var b = K.getWidgets().filter(function(a) {
            return Boolean(a.getSearchParameters);
        }).filter(function(a) {
            return !i(a) && !k(a);
        }).reduce(function(a, b) {
            return b.getSearchParameters(a);
        }, T);
        var c = K.getWidgets().filter(function(a) {
            return Boolean(a.getSearchParameters);
        }).filter(function(a) {
            var b = i(a) && j(a, p);
            var c = k(a) && l(a, p);
            return b || c;
        }).sort(m).reduce(function(a, b) {
            return b.getSearchParameters(a);
        }, b);
        var d = K.getWidgets().filter(function(a) {
            return Boolean(a.getSearchParameters);
        }).filter(function(a) {
            var b = i(a) && !j(a, p);
            var c = k(a) && !l(a, p);
            return (b || c);
        }).sort(m).reduce(function(c, b) {
            var d = i(b) ? b.props.indexContextValue.targetedIndex : b.props.indexId;
            var e = c[d] || [];
            return a.objectSpread({}, c, a.defineProperty({}, d, e.concat(b)));
        }, {});
        var e = Object.keys(d).map(function(a) {
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
    };
    var O = function d() {
        if (!R) {
            var a = y(s.state), b = a.mainParameters, c = a.derivedParameters;
            s.derivedHelpers.slice().forEach(function(a) {
                a.detach();
            });
            c.forEach(function(a) {
                var b = a.indexId, d = a.parameters;
                var c = s.derive(function() {
                    return d;
                });
                c.on("result", z({
                    indexId: b
                })).on("error", A);
            });
            s.setState(b);
            s.search();
        }
    };
    var z = function c(b) {
        var d = b.indexId;
        return function(e) {
            var f = L.getState();
            var g = !s.derivedHelpers.length;
            var b = f.results ? f.results : {};
            b = !g && b.getFacetByName ? {} : b;
            if (!g) {
                b = a.objectSpread({}, b, a.defineProperty({}, d, e.results));
            } else {
                b = e.results;
            }
            var c = L.getState();
            var h = c.isSearchStalled;
            if (!s.hasPendingRequests()) {
                clearTimeout(S);
                S = null;
                h = false;
            }
            var j = c.resultsFacetValues, i = a.objectWithoutProperties(c, [
                "resultsFacetValues"
            ]);
            L.setState(a.objectSpread({}, i, {
                results: b,
                isSearchStalled: h,
                searching: false,
                error: null
            }));
        };
    };
    var A = function g(d) {
        var e = d.error;
        var b = L.getState();
        var c = b.isSearchStalled;
        if (!s.hasPendingRequests()) {
            clearTimeout(S);
            c = false;
        }
        var h = b.resultsFacetValues, f = a.objectWithoutProperties(b, [
            "resultsFacetValues", 
        ]);
        L.setState(a.objectSpread({}, f, {
            isSearchStalled: c,
            error: e,
            searching: false
        }));
    };
    var B = function b() {
        if (!S) {
            S = setTimeout(function() {
                var b = L.getState(), d = b.resultsFacetValues, c = a.objectWithoutProperties(b, [
                    "resultsFacetValues", 
                ]);
                L.setState(a.objectSpread({}, c, {
                    isSearchStalled: true
                }));
            }, M);
        }
    };
    var C = function d(b, c) {
        if (!c) {
            return;
        }
        if ((!b.transporter || b._cacheHydrated) && (!b._useCache || typeof b.addAlgoliaAgent !== "function")) {
            return;
        }
        if (b.transporter && !b._cacheHydrated) {
            b._cacheHydrated = true;
            var e = b.search;
            b.search = function(g) {
                for(var d = arguments.length, f = new Array(d > 1 ? d - 1 : 0), c = 1; c < d; c++){
                    f[c - 1] = arguments[c];
                }
                var h = g.map(function(b) {
                    return a.objectSpread({}, b, {
                        params: n(b.params)
                    });
                });
                return b.transporter.responsesCache.get({
                    method: "search",
                    args: [
                        h
                    ].concat(a.toConsumableArray(f))
                }, function() {
                    return e.apply(void 0, [
                        g
                    ].concat(a.toConsumableArray(f)));
                });
            };
        }
        if (Array.isArray(c.results)) {
            P(b, c.results);
            return;
        }
        Q(b, c);
    };
    var P = function e(b, c) {
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
    };
    var Q = function e(b, c) {
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
    };
    var D = function d(c) {
        if (!c) {
            return null;
        }
        if (Array.isArray(c.results)) {
            return c.results.reduce(function(d, c) {
                return a.objectSpread({}, d, a.defineProperty({}, c._internalIndexId, new b.SearchResults(new b.SearchParameters(c.state), c.rawResults)));
            }, {});
        }
        return new b.SearchResults(new b.SearchParameters(c.state), c.rawResults);
    };
    var E = function c() {
        var b = N(L.getState().widgets);
        L.setState(a.objectSpread({}, L.getState(), {
            metadata: b,
            searching: true
        }));
        O();
    };
    var F = function b(a) {
        var c = L.getState().widgets;
        return K.getWidgets().filter(function(a) {
            return Boolean(a.transitionState);
        }).reduce(function(a, b) {
            return b.transitionState(c, a);
        }, a);
    };
    var G = function d(b) {
        var c = N(b);
        L.setState(a.objectSpread({}, L.getState(), {
            widgets: b,
            metadata: c,
            searching: true
        }));
        O();
    };
    var H = function h(b) {
        var d = b.facetName, e = b.query, c = b.maxFacetHits, f = c === void 0 ? 10 : c;
        var g = Math.max(1, Math.min(f, 100));
        L.setState(a.objectSpread({}, L.getState(), {
            searchingForFacetValues: true
        }));
        s.searchForFacetValues(d, e, g).then(function(b) {
            L.setState(a.objectSpread({}, L.getState(), {
                error: null,
                searchingForFacetValues: false,
                resultsFacetValues: a.objectSpread({}, L.getState().resultsFacetValues, ((o = {}), a.defineProperty(o, d, b.facetHits), a.defineProperty(o, "query", e), o))
            }));
        }, function(b) {
            L.setState(a.objectSpread({}, L.getState(), {
                searchingForFacetValues: false,
                error: b
            }));
        }).catch(function(a) {
            setTimeout(function() {
                throw a;
            });
        });
    };
    var I = function b(a) {
        T = T.setIndex(a);
    };
    var J = function a() {
        return L.getState().metadata.reduce(function(a, b) {
            return typeof b.id !== "undefined" ? a.concat(b.id) : a;
        }, []);
    };
    var s = b(f, p, a.objectSpread({}, d));
    h(f);
    s.on("search", B).on("result", z({
        indexId: p
    })).on("error", A);
    var R = false;
    var S = null;
    var T = s.state;
    var K = c(E);
    C(f, g);
    var L = u({
        widgets: t,
        metadata: q(g),
        results: D(g),
        error: null,
        searching: false,
        isSearchStalled: true,
        searchingForFacetValues: false
    });
    return {
        store: L,
        widgetsManager: K,
        getWidgetsIds: J,
        getSearchParameters: y,
        onSearchForFacetValues: H,
        onExternalStateUpdate: G,
        transitionState: F,
        updateClient: w,
        updateIndex: I,
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
