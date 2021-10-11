import * as a from "@swc/helpers";
import b from "algoliasearch-helper";
import c from "./createWidgetsManager";
import { HIGHLIGHT_TAGS as d } from "./highlight";
import { hasMultipleIndices as e } from "./indexUtils";
import { version as f } from "react";
import g from "./version";
function h(i) {
    "function" == typeof i.addAlgoliaAgent && (i.addAlgoliaAgent("react (".concat(f, ")")), i.addAlgoliaAgent("react-instantsearch (".concat(g, ")")));
}
var j, k = function(l) {
    return e({
        ais: l.props.contextValue,
        multiIndexContext: l.props.indexContextValue
    });
}, m = function(n, o) {
    return n.props.indexContextValue.targetedIndex === o;
}, p = function(q) {
    return Boolean(q.props.indexId);
}, r = function(s, t) {
    return s.props.indexId === t;
}, u = function(v, w) {
    var x = p(v), y = p(w);
    return x && !y ? -1 : !x && y ? 1 : 0;
};
export default function createInstantSearchManager(z) {
    var A = z.indexName, B = z.initialState, C = z.searchClient, D = z.resultsState, E = z.stalledSearchDelay, F = function(G) {
        return H.getWidgets().filter(function(I) {
            return Boolean(I.getMetadata);
        }).map(function(J) {
            return J.getMetadata(G);
        });
    }, K = function() {
        var L = H.getWidgets().filter(function(M) {
            return Boolean(M.getSearchParameters);
        }).filter(function(N) {
            return !k(N) && !p(N);
        }).reduce(function(O, P) {
            return P.getSearchParameters(O);
        }, Q), R = H.getWidgets().filter(function(S) {
            return Boolean(S.getSearchParameters);
        }).filter(function(T) {
            var U = k(T) && m(T, A), V = p(T) && r(T, A);
            return U || V;
        }).sort(u).reduce(function(W, X) {
            return X.getSearchParameters(W);
        }, L), Y = H.getWidgets().filter(function(Z) {
            return Boolean(Z.getSearchParameters);
        }).filter(function($) {
            var _ = k($) && !m($, A), aa = p($) && !r($, A);
            return _ || aa;
        }).sort(u).reduce(function(ba, ca) {
            var da = k(ca) ? ca.props.indexContextValue.targetedIndex : ca.props.indexId, ea = ba[da] || [];
            return a.objectSpread({
            }, ba, a.defineProperty({
            }, da, ea.concat(ca)));
        }, {
        });
        return {
            mainParameters: R,
            derivedParameters: Object.keys(Y).map(function(fa) {
                return {
                    parameters: Y[fa].reduce(function(ga, ha) {
                        return ha.getSearchParameters(ga);
                    }, L),
                    indexId: fa
                };
            })
        };
    }, ia = function() {
        if (!ja) {
            var ka = K(la.state), ma = ka.mainParameters, na = ka.derivedParameters;
            la.derivedHelpers.slice().forEach(function(oa) {
                oa.detach();
            }), na.forEach(function(pa) {
                var qa = pa.indexId, ra = pa.parameters;
                la.derive(function() {
                    return ra;
                }).on("result", sa({
                    indexId: qa
                })).on("error", ta);
            }), la.setState(ma), la.search();
        }
    }, sa = function(ua) {
        var va = ua.indexId;
        return function(wa) {
            var xa = ya.getState(), za = !la.derivedHelpers.length, Aa = xa.results ? xa.results : {
            };
            Aa = !za && Aa.getFacetByName ? {
            } : Aa, Aa = za ? wa.results : a.objectSpread({
            }, Aa, a.defineProperty({
            }, va, wa.results));
            var Ba = ya.getState(), Ca = Ba.isSearchStalled;
            la.hasPendingRequests() || (clearTimeout(Da), Da = null, Ca = !1), Ba.resultsFacetValues;
            var Ea = a.objectWithoutProperties(Ba, ["resultsFacetValues"]);
            ya.setState(a.objectSpread({
            }, Ea, {
                results: Aa,
                isSearchStalled: Ca,
                searching: !1,
                error: null
            }));
        };
    }, ta = function(Fa) {
        var Ga = Fa.error, Ha = ya.getState(), Ia = Ha.isSearchStalled;
        la.hasPendingRequests() || (clearTimeout(Da), Ia = !1), Ha.resultsFacetValues;
        var Ja = a.objectWithoutProperties(Ha, ["resultsFacetValues"]);
        ya.setState(a.objectSpread({
        }, Ja, {
            isSearchStalled: Ia,
            error: Ga,
            searching: !1
        }));
    }, Ka = function(La, Ma) {
        if (La.transporter) {
            La.transporter.responsesCache.set({
                method: "search",
                args: [
                    Ma.reduce(function(Na, Oa) {
                        return Na.concat(Oa.rawResults.map(function(Pa) {
                            return {
                                indexName: Pa.index,
                                params: Pa.params
                            };
                        }));
                    }, []), 
                ]
            }, {
                results: Ma.reduce(function(Qa, Ra) {
                    return Qa.concat(Ra.rawResults);
                }, [])
            });
            return;
        }
        var Sa = "/1/indexes/*/queries_body_".concat(JSON.stringify({
            requests: Ma.reduce(function(Ta, Ua) {
                return Ta.concat(Ua.rawResults.map(function(Va) {
                    return {
                        indexName: Va.index,
                        params: Va.params
                    };
                }));
            }, [])
        }));
        La.cache = a.objectSpread({
        }, La.cache, a.defineProperty({
        }, Sa, JSON.stringify({
            results: Ma.reduce(function(Wa, Xa) {
                return Wa.concat(Xa.rawResults);
            }, [])
        })));
    }, Ya = function(Za, $a) {
        if (Za.transporter) {
            Za.transporter.responsesCache.set({
                method: "search",
                args: [
                    $a.rawResults.map(function(_a) {
                        return {
                            indexName: _a.index,
                            params: _a.params
                        };
                    }), 
                ]
            }, {
                results: $a.rawResults
            });
            return;
        }
        var ab = "/1/indexes/*/queries_body_".concat(JSON.stringify({
            requests: $a.rawResults.map(function(bb) {
                return {
                    indexName: bb.index,
                    params: bb.params
                };
            })
        }));
        Za.cache = a.objectSpread({
        }, Za.cache, a.defineProperty({
        }, ab, JSON.stringify({
            results: $a.rawResults
        })));
    }, la = b(C, A, a.objectSpread({
    }, d));
    h(C), la.on("search", function() {
        Da || (Da = setTimeout(function() {
            var cb = ya.getState(), db = cb.resultsFacetValues, eb = a.objectWithoutProperties(cb, ["resultsFacetValues"]);
            ya.setState(a.objectSpread({
            }, eb, {
                isSearchStalled: !0
            }));
        }, E));
    }).on("result", sa({
        indexId: A
    })).on("error", ta);
    var ja = !1, Da = null, Q = la.state, H = c(function() {
        var fb = F(ya.getState().widgets);
        ya.setState(a.objectSpread({
        }, ya.getState(), {
            metadata: fb,
            searching: !0
        })), ia();
    });
    !function(gb, hb) {
        if (hb && (gb.transporter && !gb._cacheHydrated || gb._useCache && "function" == typeof gb.addAlgoliaAgent)) {
            if (gb.transporter && !gb._cacheHydrated) {
                gb._cacheHydrated = !0;
                var ib = gb.search;
                gb.search = function(jb) {
                    for(var kb = arguments.length, lb = new Array(kb > 1 ? kb - 1 : 0), mb = 1; mb < kb; mb++)lb[mb - 1] = arguments[mb];
                    var nb = jb.map(function(ob) {
                        return a.objectSpread({
                        }, ob, {
                            params: function(pb) {
                                var qb = function(rb) {
                                    for(var sb = arguments.length, tb = new Array(sb > 1 ? sb - 1 : 0), ub = 1; ub < sb; ub++)tb[ub - 1] = arguments[ub];
                                    var vb = 0;
                                    return rb.replace(/%s/g, function() {
                                        return encodeURIComponent(tb[vb++]);
                                    });
                                };
                                return Object.keys(pb).map(function(wb) {
                                    var xb;
                                    return qb("%s=%s", wb, (xb = pb[wb], "[object Object]" === Object.prototype.toString.call(xb) || "[object Array]" === Object.prototype.toString.call(xb)) ? JSON.stringify(pb[wb]) : pb[wb]);
                                }).join("&");
                            }(ob.params)
                        });
                    });
                    return gb.transporter.responsesCache.get({
                        method: "search",
                        args: [
                            nb
                        ].concat(a.toConsumableArray(lb))
                    }, function() {
                        return ib.apply(void 0, [
                            jb
                        ].concat(a.toConsumableArray(lb)));
                    });
                };
            }
            if (Array.isArray(hb.results)) {
                Ka(gb, hb.results);
                return;
            }
            Ya(gb, hb);
        }
    }(C, D);
    var yb, zb, Ab, ya = (zb = {
        widgets: void 0 === B ? {
        } : B,
        metadata: Bb(D),
        results: (yb = D) ? Array.isArray(yb.results) ? yb.results.reduce(function(Cb, Db) {
            return a.objectSpread({
            }, Cb, a.defineProperty({
            }, Db._internalIndexId, new b.SearchResults(new b.SearchParameters(Db.state), Db.rawResults)));
        }, {
        }) : new b.SearchResults(new b.SearchParameters(yb.state), yb.rawResults) : null,
        error: null,
        searching: !1,
        isSearchStalled: !0,
        searchingForFacetValues: !1
    }, Ab = [], {
        getState: function() {
            return zb;
        },
        setState: function(Eb) {
            zb = Eb, Ab.forEach(function(Fb) {
                return Fb();
            });
        },
        subscribe: function(Gb) {
            return Ab.push(Gb), function() {
                Ab.splice(Ab.indexOf(Gb), 1);
            };
        }
    });
    return {
        store: ya,
        widgetsManager: H,
        getWidgetsIds: function() {
            return ya.getState().metadata.reduce(function(Hb, Ib) {
                return void 0 !== Ib.id ? Hb.concat(Ib.id) : Hb;
            }, []);
        },
        getSearchParameters: K,
        onSearchForFacetValues: function(Jb) {
            var Kb = Jb.facetName, Lb = Jb.query, Mb = Jb.maxFacetHits;
            ya.setState(a.objectSpread({
            }, ya.getState(), {
                searchingForFacetValues: !0
            })), la.searchForFacetValues(Kb, Lb, Math.max(1, Math.min(void 0 === Mb ? 10 : Mb, 100))).then(function(Nb) {
                ya.setState(a.objectSpread({
                }, ya.getState(), {
                    error: null,
                    searchingForFacetValues: !1,
                    resultsFacetValues: a.objectSpread({
                    }, ya.getState().resultsFacetValues, (j = {
                    }, a.defineProperty(j, Kb, Nb.facetHits), a.defineProperty(j, "query", Lb), j))
                }));
            }, function(Ob) {
                ya.setState(a.objectSpread({
                }, ya.getState(), {
                    searchingForFacetValues: !1,
                    error: Ob
                }));
            }).catch(function(Pb) {
                setTimeout(function() {
                    throw Pb;
                });
            });
        },
        onExternalStateUpdate: function(Qb) {
            var Rb = F(Qb);
            ya.setState(a.objectSpread({
            }, ya.getState(), {
                widgets: Qb,
                metadata: Rb,
                searching: !0
            })), ia();
        },
        transitionState: function(Sb) {
            var Tb = ya.getState().widgets;
            return H.getWidgets().filter(function(Ub) {
                return Boolean(Ub.transitionState);
            }).reduce(function(Vb, Wb) {
                return Wb.transitionState(Tb, Vb);
            }, Sb);
        },
        updateClient: function(Xb) {
            h(Xb), la.setClient(Xb), ia();
        },
        updateIndex: function(Yb) {
            Q = Q.setIndex(Yb);
        },
        clearCache: function() {
            la.clearCache(), ia();
        },
        skipSearch: function() {
            ja = !0;
        }
    };
};
function Bb(Zb) {
    return Zb ? Zb.metadata.map(function($b) {
        return a.objectSpread({
            value: function() {
                return {
                };
            }
        }, $b, {
            items: $b.items && $b.items.map(function(_b) {
                return a.objectSpread({
                    value: function() {
                        return {
                        };
                    }
                }, _b, {
                    items: _b.items && _b.items.map(function(ac) {
                        return a.objectSpread({
                            value: function() {
                                return {
                                };
                            }
                        }, ac);
                    })
                });
            })
        });
    }) : [];
}
