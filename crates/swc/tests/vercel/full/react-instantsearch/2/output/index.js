import { _ as e } from "@swc/helpers/_/_define_property";
import { _ as t } from "@swc/helpers/_/_object_spread";
import { _ as r } from "@swc/helpers/_/_object_spread_props";
import { _ as a } from "@swc/helpers/_/_object_without_properties";
import { _ as n } from "@swc/helpers/_/_to_consumable_array";
import s from "algoliasearch-helper";
import i from "./createWidgetsManager";
import { HIGHLIGHT_TAGS as c } from "./highlight";
import { hasMultipleIndices as o } from "./indexUtils";
import { version as u } from "react";
import l from "./version";
function d(e) {
    "function" == typeof e.addAlgoliaAgent && (e.addAlgoliaAgent("react (".concat(u, ")")), e.addAlgoliaAgent("react-instantsearch (".concat(l, ")")));
}
var f = function(e) {
    return o({
        ais: e.props.contextValue,
        multiIndexContext: e.props.indexContextValue
    });
}, p = function(e, t) {
    return e.props.indexContextValue.targetedIndex === t;
}, m = function(e) {
    return !!e.props.indexId;
}, h = function(e, t) {
    return e.props.indexId === t;
}, g = function(e, t) {
    var r = m(e), a = m(t);
    return r && !a ? -1 : !r && a ? 1 : 0;
};
export default function S(o) {
    var u, l, S = o.indexName, _ = o.initialState, v = o.searchClient, x = o.resultsState, w = o.stalledSearchDelay, y = s(v, S, t({}, c));
    d(v), y.on("search", function() {
        b || (b = setTimeout(function() {
            var e = A.getState(), n = (e.resultsFacetValues, a(e, [
                "resultsFacetValues"
            ]));
            A.setState(r(t({}, n), {
                isSearchStalled: !0
            }));
        }, w));
    }).on("result", C({
        indexId: S
    })).on("error", N);
    var F = !1, b = null, I = y.state, V = i(function() {
        var e = P(A.getState().widgets);
        A.setState(r(t({}, A.getState()), {
            metadata: e,
            searching: !0
        })), j();
    });
    !function(a, s) {
        if (s && (a.transporter && !a._cacheHydrated || a._useCache && "function" == typeof a.addAlgoliaAgent)) {
            if (a.transporter && !a._cacheHydrated) {
                a._cacheHydrated = !0;
                var i = a.search;
                a.search = function(e) {
                    for(var s = arguments.length, c = Array(s > 1 ? s - 1 : 0), o = 1; o < s; o++)c[o - 1] = arguments[o];
                    var u = e.map(function(e) {
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
                            u
                        ].concat(n(c))
                    }, function() {
                        return i.apply(void 0, [
                            e
                        ].concat(n(c)));
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
    }(v, x);
    var A = (u = {
        widgets: void 0 === _ ? {} : _,
        metadata: x ? x.metadata.map(function(e) {
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
        results: x ? Array.isArray(x.results) ? x.results.reduce(function(a, n) {
            return r(t({}, a), e({}, n._internalIndexId, new s.SearchResults(new s.SearchParameters(n.state), n.rawResults)));
        }, {}) : new s.SearchResults(new s.SearchParameters(x.state), x.rawResults) : null,
        error: null,
        searching: !1,
        isSearchStalled: !0,
        searchingForFacetValues: !1
    }, l = [], {
        getState: function() {
            return u;
        },
        setState: function(e) {
            u = e, l.forEach(function(e) {
                return e();
            });
        },
        subscribe: function(e) {
            return l.push(e), function() {
                l.splice(l.indexOf(e), 1);
            };
        }
    });
    function P(e) {
        return V.getWidgets().filter(function(e) {
            return !!e.getMetadata;
        }).map(function(t) {
            return t.getMetadata(e);
        });
    }
    function R() {
        var a = V.getWidgets().filter(function(e) {
            return !!e.getSearchParameters;
        }).filter(function(e) {
            return !f(e) && !m(e);
        }).reduce(function(e, t) {
            return t.getSearchParameters(e);
        }, I), n = V.getWidgets().filter(function(e) {
            return !!e.getSearchParameters;
        }).filter(function(e) {
            var t = f(e) && p(e, S), r = m(e) && h(e, S);
            return t || r;
        }).sort(g).reduce(function(e, t) {
            return t.getSearchParameters(e);
        }, a), s = V.getWidgets().filter(function(e) {
            return !!e.getSearchParameters;
        }).filter(function(e) {
            var t = f(e) && !p(e, S), r = m(e) && !h(e, S);
            return t || r;
        }).sort(g).reduce(function(a, n) {
            var s = f(n) ? n.props.indexContextValue.targetedIndex : n.props.indexId, i = a[s] || [];
            return r(t({}, a), e({}, s, i.concat(n)));
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
    function j() {
        if (!F) {
            var e = R(y.state), t = e.mainParameters, r = e.derivedParameters;
            y.derivedHelpers.slice().forEach(function(e) {
                e.detach();
            }), r.forEach(function(e) {
                var t = e.indexId, r = e.parameters;
                y.derive(function() {
                    return r;
                }).on("result", C({
                    indexId: t
                })).on("error", N);
            }), y.setState(t), y.search();
        }
    }
    function C(n) {
        var s = n.indexId;
        return function(n) {
            var i = A.getState(), c = !y.derivedHelpers.length, o = i.results ? i.results : {};
            o = !c && o.getFacetByName ? {} : o, o = c ? n.results : r(t({}, o), e({}, s, n.results));
            var u = A.getState(), l = u.isSearchStalled;
            y.hasPendingRequests() || (clearTimeout(b), b = null, l = !1), u.resultsFacetValues;
            var d = a(u, [
                "resultsFacetValues"
            ]);
            A.setState(r(t({}, d), {
                results: o,
                isSearchStalled: l,
                searching: !1,
                error: null
            }));
        };
    }
    function N(e) {
        var n = e.error, s = A.getState(), i = s.isSearchStalled;
        y.hasPendingRequests() || (clearTimeout(b), i = !1), s.resultsFacetValues;
        var c = a(s, [
            "resultsFacetValues"
        ]);
        A.setState(r(t({}, c), {
            isSearchStalled: i,
            error: n,
            searching: !1
        }));
    }
    return {
        store: A,
        widgetsManager: V,
        getWidgetsIds: function() {
            return A.getState().metadata.reduce(function(e, t) {
                return void 0 !== t.id ? e.concat(t.id) : e;
            }, []);
        },
        getSearchParameters: R,
        onSearchForFacetValues: function(a) {
            var n = a.facetName, s = a.query, i = a.maxFacetHits, c = Math.max(1, Math.min(void 0 === i ? 10 : i, 100));
            A.setState(r(t({}, A.getState()), {
                searchingForFacetValues: !0
            })), y.searchForFacetValues(n, s, c).then(function(a) {
                var i;
                A.setState(r(t({}, A.getState()), {
                    error: null,
                    searchingForFacetValues: !1,
                    resultsFacetValues: r(t({}, A.getState().resultsFacetValues), (e(i = {}, n, a.facetHits), e(i, "query", s), i))
                }));
            }, function(e) {
                A.setState(r(t({}, A.getState()), {
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
            var a = P(e);
            A.setState(r(t({}, A.getState()), {
                widgets: e,
                metadata: a,
                searching: !0
            })), j();
        },
        transitionState: function(e) {
            var t = A.getState().widgets;
            return V.getWidgets().filter(function(e) {
                return !!e.transitionState;
            }).reduce(function(e, r) {
                return r.transitionState(t, e);
            }, e);
        },
        updateClient: function(e) {
            d(e), y.setClient(e), j();
        },
        updateIndex: function(e) {
            I = I.setIndex(e);
        },
        clearCache: function() {
            y.clearCache(), j();
        },
        skipSearch: function() {
            F = !0;
        }
    };
}
import "@swc/helpers/_/_define_property";
import "@swc/helpers/_/_object_spread";
import "@swc/helpers/_/_object_spread_props";
import "@swc/helpers/_/_object_without_properties";
import "@swc/helpers/_/_to_consumable_array";
import "algoliasearch-helper";
import "./createWidgetsManager";
import "./highlight";
import "./indexUtils";
import "react";
import "./version";
export { S as default };
