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
function d(d) {
    "function" == typeof d.addAlgoliaAgent && (d.addAlgoliaAgent("react (".concat(o, ")")), d.addAlgoliaAgent("react-instantsearch (".concat(l, ")")));
}
var f = function(d) {
    return u({
        ais: d.props.contextValue,
        multiIndexContext: d.props.indexContextValue
    });
}, m = function(d, f) {
    return d.props.indexContextValue.targetedIndex === f;
}, p = function(d) {
    return !!d.props.indexId;
}, g = function(d, f) {
    return d.props.indexId === f;
}, h = function(d, f) {
    var m = p(d), g = p(f);
    return m && !g ? -1 : !m && g ? 1 : 0;
};
export default function S(S) {
    var v, x, _ = S.indexName, y = S.initialState, w = S.searchClient, F = S.resultsState, V = S.stalledSearchDelay, I = function(e) {
        return W.getWidgets().filter(function(e) {
            return !!e.getMetadata;
        }).map(function(t) {
            return t.getMetadata(e);
        });
    }, b = function() {
        var a = W.getWidgets().filter(function(e) {
            return !!e.getSearchParameters;
        }).filter(function(e) {
            return !f(e) && !p(e);
        }).reduce(function(e, t) {
            return t.getSearchParameters(e);
        }, H), n = W.getWidgets().filter(function(e) {
            return !!e.getSearchParameters;
        }).filter(function(e) {
            var t = f(e) && m(e, _), r = p(e) && g(e, _);
            return t || r;
        }).sort(h).reduce(function(e, t) {
            return t.getSearchParameters(e);
        }, a), s = W.getWidgets().filter(function(e) {
            return !!e.getSearchParameters;
        }).filter(function(e) {
            var t = f(e) && !m(e, _), r = p(e) && !g(e, _);
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
    }, A = function() {
        if (!O) {
            var e = b(j.state), t = e.mainParameters, r = e.derivedParameters;
            j.derivedHelpers.slice().forEach(function(e) {
                e.detach();
            }), r.forEach(function(e) {
                var t = e.indexId, r = e.parameters;
                j.derive(function() {
                    return r;
                }).on("result", P({
                    indexId: t
                })).on("error", R);
            }), j.setState(t), j.search();
        }
    }, P = function(n) {
        var s = n.indexId;
        return function(n) {
            var i = M.getState(), c = !j.derivedHelpers.length, u = i.results ? i.results : {};
            u = !c && u.getFacetByName ? {} : u, u = c ? n.results : r(t({}, u), e({}, s, n.results));
            var o = M.getState(), l = o.isSearchStalled;
            j.hasPendingRequests() || (clearTimeout(q), q = null, l = !1), o.resultsFacetValues;
            var d = a(o, [
                "resultsFacetValues"
            ]);
            M.setState(r(t({}, d), {
                results: u,
                isSearchStalled: l,
                searching: !1,
                error: null
            }));
        };
    }, R = function(e) {
        var n = e.error, s = M.getState(), i = s.isSearchStalled;
        j.hasPendingRequests() || (clearTimeout(q), i = !1), s.resultsFacetValues;
        var c = a(s, [
            "resultsFacetValues"
        ]);
        M.setState(r(t({}, c), {
            isSearchStalled: i,
            error: n,
            searching: !1
        }));
    }, C = function(a, n) {
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
    }, N = function(a, n) {
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
    }, j = s(w, _, t({}, c));
    d(w), j.on("search", function() {
        q || (q = setTimeout(function() {
            var e = M.getState(), n = (e.resultsFacetValues, a(e, [
                "resultsFacetValues"
            ]));
            M.setState(r(t({}, n), {
                isSearchStalled: !0
            }));
        }, V));
    }).on("result", P({
        indexId: _
    })).on("error", R);
    var O = !1, q = null, H = j.state, W = i(function() {
        var e = I(M.getState().widgets);
        M.setState(r(t({}, M.getState()), {
            metadata: e,
            searching: !0
        })), A();
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
                C(e, a.results);
                return;
            }
            N(e, a);
        }
    }(w, F);
    var M = (v = {
        widgets: void 0 === y ? {} : y,
        metadata: F ? F.metadata.map(function(e) {
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
        results: F ? Array.isArray(F.results) ? F.results.reduce(function(a, n) {
            return r(t({}, a), e({}, n._internalIndexId, new s.SearchResults(new s.SearchParameters(n.state), n.rawResults)));
        }, {}) : new s.SearchResults(new s.SearchParameters(F.state), F.rawResults) : null,
        error: null,
        searching: !1,
        isSearchStalled: !0,
        searchingForFacetValues: !1
    }, x = [], {
        getState: function() {
            return v;
        },
        setState: function(e) {
            v = e, x.forEach(function(e) {
                return e();
            });
        },
        subscribe: function(e) {
            return x.push(e), function() {
                x.splice(x.indexOf(e), 1);
            };
        }
    });
    return {
        store: M,
        widgetsManager: W,
        getWidgetsIds: function() {
            return M.getState().metadata.reduce(function(e, t) {
                return void 0 !== t.id ? e.concat(t.id) : e;
            }, []);
        },
        getSearchParameters: b,
        onSearchForFacetValues: function(a) {
            var n = a.facetName, s = a.query, i = a.maxFacetHits;
            M.setState(r(t({}, M.getState()), {
                searchingForFacetValues: !0
            })), j.searchForFacetValues(n, s, Math.max(1, Math.min(void 0 === i ? 10 : i, 100))).then(function(a) {
                var i;
                M.setState(r(t({}, M.getState()), {
                    error: null,
                    searchingForFacetValues: !1,
                    resultsFacetValues: r(t({}, M.getState().resultsFacetValues), (e(i = {}, n, a.facetHits), e(i, "query", s), i))
                }));
            }, function(e) {
                M.setState(r(t({}, M.getState()), {
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
            var a = I(e);
            M.setState(r(t({}, M.getState()), {
                widgets: e,
                metadata: a,
                searching: !0
            })), A();
        },
        transitionState: function(e) {
            var t = M.getState().widgets;
            return W.getWidgets().filter(function(e) {
                return !!e.transitionState;
            }).reduce(function(e, r) {
                return r.transitionState(t, e);
            }, e);
        },
        updateClient: function(e) {
            d(e), j.setClient(e), A();
        },
        updateIndex: function(e) {
            H = H.setIndex(e);
        },
        clearCache: function() {
            j.clearCache(), A();
        },
        skipSearch: function() {
            O = !0;
        }
    };
}
