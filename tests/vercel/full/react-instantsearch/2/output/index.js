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
        }), fa = Object.keys(Y).map(function(ga) {
            return {
                parameters: Y[ga].reduce(function(ha, ia) {
                    return ia.getSearchParameters(ha);
                }, L),
                indexId: ga
            };
        });
        return {
            mainParameters: R,
            derivedParameters: fa
        };
    }, ja = function() {
        if (!ka) {
            var la = K(ma.state), na = la.mainParameters, oa = la.derivedParameters;
            ma.derivedHelpers.slice().forEach(function(pa) {
                pa.detach();
            }), oa.forEach(function(qa) {
                var ra = qa.indexId, sa = qa.parameters, ta = ma.derive(function() {
                    return sa;
                });
                ta.on("result", ua({
                    indexId: ra
                })).on("error", va);
            }), ma.setState(na), ma.search();
        }
    }, ua = function(wa) {
        var xa = wa.indexId;
        return function(ya) {
            var za = Aa.getState(), Ba = !ma.derivedHelpers.length, Ca = za.results ? za.results : {
            };
            Ca = !Ba && Ca.getFacetByName ? {
            } : Ca, Ca = Ba ? ya.results : a.objectSpread({
            }, Ca, a.defineProperty({
            }, xa, ya.results));
            var Da = Aa.getState(), Ea = Da.isSearchStalled;
            ma.hasPendingRequests() || (clearTimeout(Fa), Fa = null, Ea = !1), Da.resultsFacetValues;
            var Ga = a.objectWithoutProperties(Da, ["resultsFacetValues"]);
            Aa.setState(a.objectSpread({
            }, Ga, {
                results: Ca,
                isSearchStalled: Ea,
                searching: !1,
                error: null
            }));
        };
    }, va = function(Ha) {
        var Ia = Ha.error, Ja = Aa.getState(), Ka = Ja.isSearchStalled;
        ma.hasPendingRequests() || (clearTimeout(Fa), Ka = !1), Ja.resultsFacetValues;
        var La = a.objectWithoutProperties(Ja, ["resultsFacetValues"]);
        Aa.setState(a.objectSpread({
        }, La, {
            isSearchStalled: Ka,
            error: Ia,
            searching: !1
        }));
    }, Ma = function(Na, Oa) {
        if (Na.transporter) {
            Na.transporter.responsesCache.set({
                method: "search",
                args: [
                    Oa.reduce(function(Pa, Qa) {
                        return Pa.concat(Qa.rawResults.map(function(Ra) {
                            return {
                                indexName: Ra.index,
                                params: Ra.params
                            };
                        }));
                    }, []), 
                ]
            }, {
                results: Oa.reduce(function(Sa, Ta) {
                    return Sa.concat(Ta.rawResults);
                }, [])
            });
            return;
        }
        var Ua = "/1/indexes/*/queries_body_".concat(JSON.stringify({
            requests: Oa.reduce(function(Va, Wa) {
                return Va.concat(Wa.rawResults.map(function(Xa) {
                    return {
                        indexName: Xa.index,
                        params: Xa.params
                    };
                }));
            }, [])
        }));
        Na.cache = a.objectSpread({
        }, Na.cache, a.defineProperty({
        }, Ua, JSON.stringify({
            results: Oa.reduce(function(Ya, Za) {
                return Ya.concat(Za.rawResults);
            }, [])
        })));
    }, $a = function(_a, ab) {
        if (_a.transporter) {
            _a.transporter.responsesCache.set({
                method: "search",
                args: [
                    ab.rawResults.map(function(bb) {
                        return {
                            indexName: bb.index,
                            params: bb.params
                        };
                    }), 
                ]
            }, {
                results: ab.rawResults
            });
            return;
        }
        var cb = "/1/indexes/*/queries_body_".concat(JSON.stringify({
            requests: ab.rawResults.map(function(db) {
                return {
                    indexName: db.index,
                    params: db.params
                };
            })
        }));
        _a.cache = a.objectSpread({
        }, _a.cache, a.defineProperty({
        }, cb, JSON.stringify({
            results: ab.rawResults
        })));
    }, ma = b(C, A, a.objectSpread({
    }, d));
    h(C), ma.on("search", function() {
        Fa || (Fa = setTimeout(function() {
            var eb = Aa.getState(), fb = eb.resultsFacetValues, gb = a.objectWithoutProperties(eb, ["resultsFacetValues"]);
            Aa.setState(a.objectSpread({
            }, gb, {
                isSearchStalled: !0
            }));
        }, E));
    }).on("result", ua({
        indexId: A
    })).on("error", va);
    var ka = !1, Fa = null, Q = ma.state, H = c(function() {
        var hb = F(Aa.getState().widgets);
        Aa.setState(a.objectSpread({
        }, Aa.getState(), {
            metadata: hb,
            searching: !0
        })), ja();
    });
    !function(ib, jb) {
        if (jb && (ib.transporter && !ib._cacheHydrated || ib._useCache && "function" == typeof ib.addAlgoliaAgent)) {
            if (ib.transporter && !ib._cacheHydrated) {
                ib._cacheHydrated = !0;
                var kb = ib.search;
                ib.search = function(lb) {
                    for(var mb = arguments.length, nb = new Array(mb > 1 ? mb - 1 : 0), ob = 1; ob < mb; ob++)nb[ob - 1] = arguments[ob];
                    var pb = lb.map(function(qb) {
                        return a.objectSpread({
                        }, qb, {
                            params: function(rb) {
                                var sb = function(tb) {
                                    for(var ub = arguments.length, vb = new Array(ub > 1 ? ub - 1 : 0), wb = 1; wb < ub; wb++)vb[wb - 1] = arguments[wb];
                                    var xb = 0;
                                    return tb.replace(/%s/g, function() {
                                        return encodeURIComponent(vb[xb++]);
                                    });
                                };
                                return Object.keys(rb).map(function(yb) {
                                    var zb;
                                    return sb("%s=%s", yb, (zb = rb[yb], "[object Object]" === Object.prototype.toString.call(zb) || "[object Array]" === Object.prototype.toString.call(zb)) ? JSON.stringify(rb[yb]) : rb[yb]);
                                }).join("&");
                            }(qb.params)
                        });
                    });
                    return ib.transporter.responsesCache.get({
                        method: "search",
                        args: [
                            pb
                        ].concat(a.toConsumableArray(nb))
                    }, function() {
                        return kb.apply(void 0, [
                            lb
                        ].concat(a.toConsumableArray(nb)));
                    });
                };
            }
            if (Array.isArray(jb.results)) {
                Ma(ib, jb.results);
                return;
            }
            $a(ib, jb);
        }
    }(C, D);
    var Ab, Bb, Cb, Aa = (Bb = {
        widgets: void 0 === B ? {
        } : B,
        metadata: Db(D),
        results: (Ab = D) ? Array.isArray(Ab.results) ? Ab.results.reduce(function(Eb, Fb) {
            return a.objectSpread({
            }, Eb, a.defineProperty({
            }, Fb._internalIndexId, new b.SearchResults(new b.SearchParameters(Fb.state), Fb.rawResults)));
        }, {
        }) : new b.SearchResults(new b.SearchParameters(Ab.state), Ab.rawResults) : null,
        error: null,
        searching: !1,
        isSearchStalled: !0,
        searchingForFacetValues: !1
    }, Cb = [], {
        getState: function() {
            return Bb;
        },
        setState: function(Gb) {
            Bb = Gb, Cb.forEach(function(Hb) {
                return Hb();
            });
        },
        subscribe: function(Ib) {
            return Cb.push(Ib), function() {
                Cb.splice(Cb.indexOf(Ib), 1);
            };
        }
    });
    return {
        store: Aa,
        widgetsManager: H,
        getWidgetsIds: function() {
            return Aa.getState().metadata.reduce(function(Jb, Kb) {
                return void 0 !== Kb.id ? Jb.concat(Kb.id) : Jb;
            }, []);
        },
        getSearchParameters: K,
        onSearchForFacetValues: function(Lb) {
            var Mb = Lb.facetName, Nb = Lb.query, Ob = Lb.maxFacetHits;
            Aa.setState(a.objectSpread({
            }, Aa.getState(), {
                searchingForFacetValues: !0
            })), ma.searchForFacetValues(Mb, Nb, Math.max(1, Math.min(void 0 === Ob ? 10 : Ob, 100))).then(function(Pb) {
                Aa.setState(a.objectSpread({
                }, Aa.getState(), {
                    error: null,
                    searchingForFacetValues: !1,
                    resultsFacetValues: a.objectSpread({
                    }, Aa.getState().resultsFacetValues, (j = {
                    }, a.defineProperty(j, Mb, Pb.facetHits), a.defineProperty(j, "query", Nb), j))
                }));
            }, function(Qb) {
                Aa.setState(a.objectSpread({
                }, Aa.getState(), {
                    searchingForFacetValues: !1,
                    error: Qb
                }));
            }).catch(function(Rb) {
                setTimeout(function() {
                    throw Rb;
                });
            });
        },
        onExternalStateUpdate: function(Sb) {
            var Tb = F(Sb);
            Aa.setState(a.objectSpread({
            }, Aa.getState(), {
                widgets: Sb,
                metadata: Tb,
                searching: !0
            })), ja();
        },
        transitionState: function(Ub) {
            var Vb = Aa.getState().widgets;
            return H.getWidgets().filter(function(Wb) {
                return Boolean(Wb.transitionState);
            }).reduce(function(Xb, Yb) {
                return Yb.transitionState(Vb, Xb);
            }, Ub);
        },
        updateClient: function(Zb) {
            h(Zb), ma.setClient(Zb), ja();
        },
        updateIndex: function($b) {
            Q = Q.setIndex($b);
        },
        clearCache: function() {
            ma.clearCache(), ja();
        },
        skipSearch: function() {
            ka = !0;
        }
    };
};
function Db(_b) {
    return _b ? _b.metadata.map(function(ac) {
        return a.objectSpread({
            value: function() {
                return {
                };
            }
        }, ac, {
            items: ac.items && ac.items.map(function(bc) {
                return a.objectSpread({
                    value: function() {
                        return {
                        };
                    }
                }, bc, {
                    items: bc.items && bc.items.map(function(cc) {
                        return a.objectSpread({
                            value: function() {
                                return {
                                };
                            }
                        }, cc);
                    })
                });
            })
        });
    }) : [];
}
