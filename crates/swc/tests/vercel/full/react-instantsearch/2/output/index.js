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
}, h = function(e, t) {
    var r = p(e), a = p(t);
    return r && !a ? -1 : !r && a ? 1 : 0;
};
export default function S(u) {
    var o, l, S, v, x = u.indexName, _ = u.initialState, y = u.searchClient, w = u.resultsState, F = u.stalledSearchDelay, V = s(y, x, t({}, c));
    d(y), V.on("search", function() {
        b || (b = setTimeout(function() {
            var e = R.getState(), n = (e.resultsFacetValues, a(e, [
                "resultsFacetValues"
            ]));
            R.setState(r(t({}, n), {
                isSearchStalled: !0
            }));
        }, F));
    }).on("result", O({
        indexId: x
    })).on("error", q);
    var I = !1, b = null, A = V.state, P = i(function() {
        var e = C(R.getState().widgets);
        R.setState(r(t({}, R.getState()), {
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
                    for(var s = arguments.length, c = Array(s > 1 ? s - 1 : 0), u = 1; u < s; u++)c[u - 1] = arguments[u];
                    var o = e.map(function(e) {
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
                            o
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
    }(y, w);
    var R = (S = {
        widgets: void 0 === _ ? {} : _,
        metadata: (o = w) ? o.metadata.map(function(e) {
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
        results: (l = w) ? Array.isArray(l.results) ? l.results.reduce(function(a, n) {
            return r(t({}, a), e({}, n._internalIndexId, new s.SearchResults(new s.SearchParameters(n.state), n.rawResults)));
        }, {}) : new s.SearchResults(new s.SearchParameters(l.state), l.rawResults) : null,
        error: null,
        searching: !1,
        isSearchStalled: !0,
        searchingForFacetValues: !1
    }, v = [], {
        getState: function() {
            return S;
        },
        setState: function(e) {
            S = e, v.forEach(function(e) {
                return e();
            });
        },
        subscribe: function(e) {
            return v.push(e), function() {
                v.splice(v.indexOf(e), 1);
            };
        }
    });
    function C(e) {
        return P.getWidgets().filter(function(e) {
            return !!e.getMetadata;
        }).map(function(t) {
            return t.getMetadata(e);
        });
    }
    function N() {
        var a = P.getWidgets().filter(function(e) {
            return !!e.getSearchParameters;
        }).filter(function(e) {
            return !f(e) && !p(e);
        }).reduce(function(e, t) {
            return t.getSearchParameters(e);
        }, A), n = P.getWidgets().filter(function(e) {
            return !!e.getSearchParameters;
        }).filter(function(e) {
            var t = f(e) && m(e, x), r = p(e) && g(e, x);
            return t || r;
        }).sort(h).reduce(function(e, t) {
            return t.getSearchParameters(e);
        }, a), s = P.getWidgets().filter(function(e) {
            return !!e.getSearchParameters;
        }).filter(function(e) {
            var t = f(e) && !m(e, x), r = p(e) && !g(e, x);
            return t || r;
        }).sort(h).reduce(function(a, n) {
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
        if (!I) {
            var e = N(V.state), t = e.mainParameters, r = e.derivedParameters;
            V.derivedHelpers.slice().forEach(function(e) {
                e.detach();
            }), r.forEach(function(e) {
                var t = e.indexId, r = e.parameters;
                V.derive(function() {
                    return r;
                }).on("result", O({
                    indexId: t
                })).on("error", q);
            }), V.setState(t), V.search();
        }
    }
    function O(n) {
        var s = n.indexId;
        return function(n) {
            var i = R.getState(), c = !V.derivedHelpers.length, u = i.results ? i.results : {};
            u = !c && u.getFacetByName ? {} : u, u = c ? n.results : r(t({}, u), e({}, s, n.results));
            var o = R.getState(), l = o.isSearchStalled;
            V.hasPendingRequests() || (clearTimeout(b), b = null, l = !1), o.resultsFacetValues;
            var d = a(o, [
                "resultsFacetValues"
            ]);
            R.setState(r(t({}, d), {
                results: u,
                isSearchStalled: l,
                searching: !1,
                error: null
            }));
        };
    }
    function q(e) {
        var n = e.error, s = R.getState(), i = s.isSearchStalled;
        V.hasPendingRequests() || (clearTimeout(b), i = !1), s.resultsFacetValues;
        var c = a(s, [
            "resultsFacetValues"
        ]);
        R.setState(r(t({}, c), {
            isSearchStalled: i,
            error: n,
            searching: !1
        }));
    }
    return {
        store: R,
        widgetsManager: P,
        getWidgetsIds: function() {
            return R.getState().metadata.reduce(function(e, t) {
                return void 0 !== t.id ? e.concat(t.id) : e;
            }, []);
        },
        getSearchParameters: N,
        onSearchForFacetValues: function(a) {
            var n = a.facetName, s = a.query, i = a.maxFacetHits, c = Math.max(1, Math.min(void 0 === i ? 10 : i, 100));
            R.setState(r(t({}, R.getState()), {
                searchingForFacetValues: !0
            })), V.searchForFacetValues(n, s, c).then(function(a) {
                var i;
                R.setState(r(t({}, R.getState()), {
                    error: null,
                    searchingForFacetValues: !1,
                    resultsFacetValues: r(t({}, R.getState().resultsFacetValues), (e(i = {}, n, a.facetHits), e(i, "query", s), i))
                }));
            }, function(e) {
                R.setState(r(t({}, R.getState()), {
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
            var a = C(e);
            R.setState(r(t({}, R.getState()), {
                widgets: e,
                metadata: a,
                searching: !0
            })), j();
        },
        transitionState: function(e) {
            var t = R.getState().widgets;
            return P.getWidgets().filter(function(e) {
                return !!e.transitionState;
            }).reduce(function(e, r) {
                return r.transitionState(t, e);
            }, e);
        },
        updateClient: function(e) {
            d(e), V.setClient(e), j();
        },
        updateIndex: function(e) {
            A = A.setIndex(e);
        },
        clearCache: function() {
            V.clearCache(), j();
        },
        skipSearch: function() {
            I = !0;
        }
    };
}
