import { _ as e } from "@swc/helpers/_/_define_property";
import { _ as t } from "@swc/helpers/_/_object_spread";
import { _ as r } from "@swc/helpers/_/_object_spread_props";
import { _ as a } from "@swc/helpers/_/_object_without_properties";
import { _ as n } from "@swc/helpers/_/_to_consumable_array";
import s from "algoliasearch-helper";
import i from "./createWidgetsManager";
import { HIGHLIGHT_TAGS as c } from "./highlight";
import { hasMultipleIndices as u } from "./indexUtils";
import { version as o } from "react";
import l from "./version";
function d(e) {
    "function" == typeof e.addAlgoliaAgent && (e.addAlgoliaAgent("react (".concat(o, ")")), e.addAlgoliaAgent("react-instantsearch (".concat(l, ")")));
}
var f = function(e) {
    return u({
        ais: e.props.contextValue,
        multiIndexContext: e.props.indexContextValue
    });
}, m = function(e, t) {
    return e.props.indexContextValue.targetedIndex === t;
}, p = function(e) {
    return !!e.props.indexId;
}, g = function(e, t) {
    return e.props.indexId === t;
}, h = function(r, a) {
    var e = p(r), t = p(a);
    return e && !t ? -1 : !e && t ? 1 : 0;
};
export default function S(u) {
    var v, o, w, F, x = u.indexName, _ = u.initialState, l = u.searchClient, S = u.resultsState, R = u.stalledSearchDelay, y = s(l, x, t({}, c));
    d(l), y.on("search", function() {
        N || (N = setTimeout(function() {
            var e = I.getState(), n = (e.resultsFacetValues, a(e, [
                "resultsFacetValues"
            ]));
            I.setState(r(t({}, n), {
                isSearchStalled: !0
            }));
        }, R));
    }).on("result", A({
        indexId: x
    })).on("error", P);
    var C = !1, N = null, j = y.state, V = i(function() {
        var e = O(I.getState().widgets);
        I.setState(r(t({}, I.getState()), {
            metadata: e,
            searching: !0
        })), q();
    });
    !function(a, s) {
        if (s && (a.transporter && !a._cacheHydrated || a._useCache && "function" == typeof a.addAlgoliaAgent)) {
            if (a.transporter && !a._cacheHydrated) {
                a._cacheHydrated = !0;
                var i = a.search;
                a.search = function(e) {
                    for(var u = arguments.length, s = Array(u > 1 ? u - 1 : 0), o = 1; o < u; o++)s[o - 1] = arguments[o];
                    var c = e.map(function(e) {
                        var a, n;
                        return r(t({}, e), {
                            params: (a = e.params, n = function(e) {
                                for(var t = arguments.length, r = Array(t > 1 ? t - 1 : 0), a = 1; a < t; a++)r[a - 1] = arguments[a];
                                var n = 0;
                                return e.replace(/%s/g, function() {
                                    return encodeURIComponent(r[n++]);
                                });
                            }, Object.keys(a).map(function(e) {
                                var t;
                                return n("%s=%s", e, (t = a[e], "[object Object]" === Object.prototype.toString.call(t) || "[object Array]" === Object.prototype.toString.call(t)) ? JSON.stringify(a[e]) : a[e]);
                            }).join("&"))
                        });
                    });
                    return a.transporter.responsesCache.get({
                        method: "search",
                        args: [
                            c
                        ].concat(n(s))
                    }, function() {
                        return i.apply(void 0, [
                            e
                        ].concat(n(s)));
                    });
                };
            }
            if (Array.isArray(s.results)) {
                !function(a, n) {
                    if (a.transporter) {
                        a.transporter.responsesCache.set({
                            method: "search",
                            args: [
                                n.reduce(function(e, t) {
                                    return e.concat(t.rawResults.map(function(e) {
                                        return {
                                            indexName: e.index,
                                            params: e.params
                                        };
                                    }));
                                }, [])
                            ]
                        }, {
                            results: n.reduce(function(e, t) {
                                return e.concat(t.rawResults);
                            }, [])
                        });
                        return;
                    }
                    var s = "/1/indexes/*/queries_body_".concat(JSON.stringify({
                        requests: n.reduce(function(e, t) {
                            return e.concat(t.rawResults.map(function(e) {
                                return {
                                    indexName: e.index,
                                    params: e.params
                                };
                            }));
                        }, [])
                    }));
                    a.cache = r(t({}, a.cache), e({}, s, JSON.stringify({
                        results: n.reduce(function(e, t) {
                            return e.concat(t.rawResults);
                        }, [])
                    })));
                }(a, s.results);
                return;
            }
            !function(a, n) {
                if (a.transporter) {
                    a.transporter.responsesCache.set({
                        method: "search",
                        args: [
                            n.rawResults.map(function(e) {
                                return {
                                    indexName: e.index,
                                    params: e.params
                                };
                            })
                        ]
                    }, {
                        results: n.rawResults
                    });
                    return;
                }
                var s = "/1/indexes/*/queries_body_".concat(JSON.stringify({
                    requests: n.rawResults.map(function(e) {
                        return {
                            indexName: e.index,
                            params: e.params
                        };
                    })
                }));
                a.cache = r(t({}, a.cache), e({}, s, JSON.stringify({
                    results: n.rawResults
                })));
            }(a, s);
        }
    }(l, S);
    var I = (w = {
        widgets: void 0 === _ ? {} : _,
        metadata: (v = S) ? v.metadata.map(function(e) {
            return r(t({
                value: function() {
                    return {};
                }
            }, e), {
                items: e.items && e.items.map(function(e) {
                    return r(t({
                        value: function() {
                            return {};
                        }
                    }, e), {
                        items: e.items && e.items.map(function(e) {
                            return t({
                                value: function() {
                                    return {};
                                }
                            }, e);
                        })
                    });
                })
            });
        }) : [],
        results: (o = S) ? Array.isArray(o.results) ? o.results.reduce(function(n, a) {
            return r(t({}, n), e({}, a._internalIndexId, new s.SearchResults(new s.SearchParameters(a.state), a.rawResults)));
        }, {}) : new s.SearchResults(new s.SearchParameters(o.state), o.rawResults) : null,
        error: null,
        searching: !1,
        isSearchStalled: !0,
        searchingForFacetValues: !1
    }, F = [], {
        getState: function() {
            return w;
        },
        setState: function(e) {
            w = e, F.forEach(function(e) {
                return e();
            });
        },
        subscribe: function(e) {
            return F.push(e), function() {
                F.splice(F.indexOf(e), 1);
            };
        }
    });
    function O(e) {
        return V.getWidgets().filter(function(e) {
            return !!e.getMetadata;
        }).map(function(t) {
            return t.getMetadata(e);
        });
    }
    function b() {
        var a = V.getWidgets().filter(function(e) {
            return !!e.getSearchParameters;
        }).filter(function(e) {
            return !f(e) && !p(e);
        }).reduce(function(e, t) {
            return t.getSearchParameters(e);
        }, j), n = V.getWidgets().filter(function(e) {
            return !!e.getSearchParameters;
        }).filter(function(e) {
            var t = f(e) && m(e, x), r = p(e) && g(e, x);
            return t || r;
        }).sort(h).reduce(function(e, t) {
            return t.getSearchParameters(e);
        }, a), s = V.getWidgets().filter(function(e) {
            return !!e.getSearchParameters;
        }).filter(function(e) {
            var t = f(e) && !m(e, x), r = p(e) && !g(e, x);
            return t || r;
        }).sort(h).reduce(function(n, a) {
            var s = f(a) ? a.props.indexContextValue.targetedIndex : a.props.indexId, i = n[s] || [];
            return r(t({}, n), e({}, s, i.concat(a)));
        }, {});
        return {
            mainParameters: n,
            derivedParameters: Object.keys(s).map(function(e) {
                return {
                    parameters: s[e].reduce(function(e, t) {
                        return t.getSearchParameters(e);
                    }, a),
                    indexId: e
                };
            })
        };
    }
    function q() {
        if (!C) {
            var e = b(y.state), t = e.mainParameters, r = e.derivedParameters;
            y.derivedHelpers.slice().forEach(function(e) {
                e.detach();
            }), r.forEach(function(e) {
                var t = e.indexId, r = e.parameters;
                y.derive(function() {
                    return r;
                }).on("result", A({
                    indexId: t
                })).on("error", P);
            }), y.setState(t), y.search();
        }
    }
    function A(n) {
        var s = n.indexId;
        return function(c) {
            var u = I.getState(), o = !y.derivedHelpers.length, n = u.results ? u.results : {};
            n = !o && n.getFacetByName ? {} : n, n = o ? c.results : r(t({}, n), e({}, s, c.results));
            var i = I.getState(), l = i.isSearchStalled;
            y.hasPendingRequests() || (clearTimeout(N), N = null, l = !1), i.resultsFacetValues;
            var d = a(i, [
                "resultsFacetValues"
            ]);
            I.setState(r(t({}, d), {
                results: n,
                isSearchStalled: l,
                searching: !1,
                error: null
            }));
        };
    }
    function P(s) {
        var i = s.error, e = I.getState(), n = e.isSearchStalled;
        y.hasPendingRequests() || (clearTimeout(N), n = !1), e.resultsFacetValues;
        var c = a(e, [
            "resultsFacetValues"
        ]);
        I.setState(r(t({}, c), {
            isSearchStalled: n,
            error: i,
            searching: !1
        }));
    }
    return {
        store: I,
        widgetsManager: V,
        getWidgetsIds: function() {
            return I.getState().metadata.reduce(function(e, t) {
                return void 0 !== t.id ? e.concat(t.id) : e;
            }, []);
        },
        getSearchParameters: b,
        onSearchForFacetValues: function(a) {
            var s = a.facetName, i = a.query, n = a.maxFacetHits, c = Math.max(1, Math.min(void 0 === n ? 10 : n, 100));
            I.setState(r(t({}, I.getState()), {
                searchingForFacetValues: !0
            })), y.searchForFacetValues(s, i, c).then(function(n) {
                var a;
                I.setState(r(t({}, I.getState()), {
                    error: null,
                    searchingForFacetValues: !1,
                    resultsFacetValues: r(t({}, I.getState().resultsFacetValues), (e(a = {}, s, n.facetHits), e(a, "query", i), a))
                }));
            }, function(e) {
                I.setState(r(t({}, I.getState()), {
                    searchingForFacetValues: !1,
                    error: e
                }));
            }).catch(function(e) {
                setTimeout(function() {
                    throw e;
                });
            });
        },
        onExternalStateUpdate: function(e) {
            var a = O(e);
            I.setState(r(t({}, I.getState()), {
                widgets: e,
                metadata: a,
                searching: !0
            })), q();
        },
        transitionState: function(e) {
            var t = I.getState().widgets;
            return V.getWidgets().filter(function(e) {
                return !!e.transitionState;
            }).reduce(function(e, r) {
                return r.transitionState(t, e);
            }, e);
        },
        updateClient: function(e) {
            d(e), y.setClient(e), q();
        },
        updateIndex: function(e) {
            j = j.setIndex(e);
        },
        clearCache: function() {
            y.clearCache(), q();
        },
        skipSearch: function() {
            C = !0;
        }
    };
}
