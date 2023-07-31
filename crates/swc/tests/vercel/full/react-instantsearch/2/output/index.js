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
    var o, l, S = u.indexName, v = u.initialState, x = u.searchClient, _ = u.resultsState, y = u.stalledSearchDelay, w = function(e) {
        return O.getWidgets().filter(function(e) {
            return !!e.getMetadata;
        }).map(function(t) {
            return t.getMetadata(e);
        });
    }, F = function() {
        var a = O.getWidgets().filter(function(e) {
            return !!e.getSearchParameters;
        }).filter(function(e) {
            return !f(e) && !p(e);
        }).reduce(function(e, t) {
            return t.getSearchParameters(e);
        }, j), n = O.getWidgets().filter(function(e) {
            return !!e.getSearchParameters;
        }).filter(function(e) {
            var t = f(e) && m(e, S), r = p(e) && g(e, S);
            return t || r;
        }).sort(h).reduce(function(e, t) {
            return t.getSearchParameters(e);
        }, a), s = O.getWidgets().filter(function(e) {
            return !!e.getSearchParameters;
        }).filter(function(e) {
            var t = f(e) && !m(e, S), r = p(e) && !g(e, S);
            return t || r;
        }).sort(h).reduce(function(a, n) {
            var s = f(n) ? n.props.indexContextValue.targetedIndex : n.props.indexId, i = a[s] || [];
            return r(t({}, a), e({}, s, i.concat(n)));
        }, {}), i = Object.keys(s).map(function(e) {
            return {
                parameters: s[e].reduce(function(e, t) {
                    return t.getSearchParameters(e);
                }, a),
                indexId: e
            };
        });
        return {
            mainParameters: n,
            derivedParameters: i
        };
    }, V = function() {
        if (!C) {
            var e = F(R.state), t = e.mainParameters, r = e.derivedParameters;
            R.derivedHelpers.slice().forEach(function(e) {
                e.detach();
            }), r.forEach(function(e) {
                var t = e.indexId, r = e.parameters;
                R.derive(function() {
                    return r;
                }).on("result", I({
                    indexId: t
                })).on("error", b);
            }), R.setState(t), R.search();
        }
    }, I = function(n) {
        var s = n.indexId;
        return function(n) {
            var i = q.getState(), c = !R.derivedHelpers.length, u = i.results ? i.results : {};
            u = !c && u.getFacetByName ? {} : u, u = c ? n.results : r(t({}, u), e({}, s, n.results));
            var o = q.getState(), l = o.isSearchStalled;
            R.hasPendingRequests() || (clearTimeout(N), N = null, l = !1), o.resultsFacetValues;
            var d = a(o, [
                "resultsFacetValues"
            ]);
            q.setState(r(t({}, d), {
                results: u,
                isSearchStalled: l,
                searching: !1,
                error: null
            }));
        };
    }, b = function(e) {
        var n = e.error, s = q.getState(), i = s.isSearchStalled;
        R.hasPendingRequests() || (clearTimeout(N), i = !1), s.resultsFacetValues;
        var c = a(s, [
            "resultsFacetValues"
        ]);
        q.setState(r(t({}, c), {
            isSearchStalled: i,
            error: n,
            searching: !1
        }));
    }, A = function(a, n) {
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
    }, P = function(a, n) {
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
    }, R = s(x, S, t({}, c));
    d(x), R.on("search", function() {
        N || (N = setTimeout(function() {
            var e = q.getState(), n = (e.resultsFacetValues, a(e, [
                "resultsFacetValues"
            ]));
            q.setState(r(t({}, n), {
                isSearchStalled: !0
            }));
        }, y));
    }).on("result", I({
        indexId: S
    })).on("error", b);
    var C = !1, N = null, j = R.state, O = i(function() {
        var e = w(q.getState().widgets);
        q.setState(r(t({}, q.getState()), {
            metadata: e,
            searching: !0
        })), V();
    });
    !function(e, a) {
        if (a && (e.transporter && !e._cacheHydrated || e._useCache && "function" == typeof e.addAlgoliaAgent)) {
            if (e.transporter && !e._cacheHydrated) {
                e._cacheHydrated = !0;
                var s = e.search;
                e.search = function(a) {
                    for(var i = arguments.length, c = Array(i > 1 ? i - 1 : 0), u = 1; u < i; u++)c[u - 1] = arguments[u];
                    var o = a.map(function(e) {
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
                    return e.transporter.responsesCache.get({
                        method: "search",
                        args: [
                            o
                        ].concat(n(c))
                    }, function() {
                        return s.apply(void 0, [
                            a
                        ].concat(n(c)));
                    });
                };
            }
            if (Array.isArray(a.results)) {
                A(e, a.results);
                return;
            }
            P(e, a);
        }
    }(x, _);
    var q = (o = {
        widgets: void 0 === v ? {} : v,
        metadata: _ ? _.metadata.map(function(e) {
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
        results: _ ? Array.isArray(_.results) ? _.results.reduce(function(a, n) {
            return r(t({}, a), e({}, n._internalIndexId, new s.SearchResults(new s.SearchParameters(n.state), n.rawResults)));
        }, {}) : new s.SearchResults(new s.SearchParameters(_.state), _.rawResults) : null,
        error: null,
        searching: !1,
        isSearchStalled: !0,
        searchingForFacetValues: !1
    }, l = [], {
        getState: function() {
            return o;
        },
        setState: function(e) {
            o = e, l.forEach(function(e) {
                return e();
            });
        },
        subscribe: function(e) {
            return l.push(e), function() {
                l.splice(l.indexOf(e), 1);
            };
        }
    });
    return {
        store: q,
        widgetsManager: O,
        getWidgetsIds: function() {
            return q.getState().metadata.reduce(function(e, t) {
                return void 0 !== t.id ? e.concat(t.id) : e;
            }, []);
        },
        getSearchParameters: F,
        onSearchForFacetValues: function(a) {
            var n = a.facetName, s = a.query, i = a.maxFacetHits;
            q.setState(r(t({}, q.getState()), {
                searchingForFacetValues: !0
            })), R.searchForFacetValues(n, s, Math.max(1, Math.min(void 0 === i ? 10 : i, 100))).then(function(a) {
                var i;
                q.setState(r(t({}, q.getState()), {
                    error: null,
                    searchingForFacetValues: !1,
                    resultsFacetValues: r(t({}, q.getState().resultsFacetValues), (e(i = {}, n, a.facetHits), e(i, "query", s), i))
                }));
            }, function(e) {
                q.setState(r(t({}, q.getState()), {
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
            var a = w(e);
            q.setState(r(t({}, q.getState()), {
                widgets: e,
                metadata: a,
                searching: !0
            })), V();
        },
        transitionState: function(e) {
            var t = q.getState().widgets;
            return O.getWidgets().filter(function(e) {
                return !!e.transitionState;
            }).reduce(function(e, r) {
                return r.transitionState(t, e);
            }, e);
        },
        updateClient: function(e) {
            d(e), R.setClient(e), V();
        },
        updateIndex: function(e) {
            j = j.setIndex(e);
        },
        clearCache: function() {
            R.clearCache(), V();
        },
        skipSearch: function() {
            C = !0;
        }
    };
}
