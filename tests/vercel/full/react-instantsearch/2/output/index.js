import * as a from "@swc/helpers";
import b from "algoliasearch-helper";
import c from "./createWidgetsManager";
import { HIGHLIGHT_TAGS as d } from "./highlight";
import { hasMultipleIndices as e } from "./indexUtils";
import { version as f } from "react";
import g from "./version";
function addAlgoliaAgents(h) {
    "function" == typeof h.addAlgoliaAgent && (h.addAlgoliaAgent("react (".concat(f, ")")), h.addAlgoliaAgent("react-instantsearch (".concat(g, ")")));
}
var _obj, isMultiIndexContext = function(i) {
    return e({
        ais: i.props.contextValue,
        multiIndexContext: i.props.indexContextValue
    });
}, isTargetedIndexEqualIndex = function(j, k) {
    return j.props.indexContextValue.targetedIndex === k;
}, isIndexWidget = function(l) {
    return Boolean(l.props.indexId);
}, isIndexWidgetEqualIndex = function(m, n) {
    return m.props.indexId === n;
}, sortIndexWidgetsFirst = function(o, p) {
    var q = isIndexWidget(o), r = isIndexWidget(p);
    return q && !r ? -1 : !q && r ? 1 : 0;
};
function serializeQueryParameters(s) {
    var t = function(u) {
        for(var v = arguments.length, w = new Array(v > 1 ? v - 1 : 0), x = 1; x < v; x++)w[x - 1] = arguments[x];
        var y = 0;
        return u.replace(/%s/g, function() {
            return encodeURIComponent(w[y++]);
        });
    };
    return Object.keys(s).map(function(z) {
        var A;
        return t("%s=%s", z, (A = s[z], "[object Object]" === Object.prototype.toString.call(A) || "[object Array]" === Object.prototype.toString.call(A)) ? JSON.stringify(s[z]) : s[z]);
    }).join("&");
}
export default function createInstantSearchManager(B) {
    var C = B.indexName, D = B.initialState, E = B.searchClient, F = B.resultsState, G = B.stalledSearchDelay, H = function(I) {
        return J.getWidgets().filter(function(K) {
            return Boolean(K.getMetadata);
        }).map(function(L) {
            return L.getMetadata(I);
        });
    }, M = function() {
        var N = J.getWidgets().filter(function(O) {
            return Boolean(O.getSearchParameters);
        }).filter(function(P) {
            return !isMultiIndexContext(P) && !isIndexWidget(P);
        }).reduce(function(Q, R) {
            return R.getSearchParameters(Q);
        }, S), T = J.getWidgets().filter(function(U) {
            return Boolean(U.getSearchParameters);
        }).filter(function(V) {
            var W = isMultiIndexContext(V) && isTargetedIndexEqualIndex(V, C), X = isIndexWidget(V) && isIndexWidgetEqualIndex(V, C);
            return W || X;
        }).sort(sortIndexWidgetsFirst).reduce(function(Y, Z) {
            return Z.getSearchParameters(Y);
        }, N), $ = J.getWidgets().filter(function(_) {
            return Boolean(_.getSearchParameters);
        }).filter(function(aa) {
            var ba = isMultiIndexContext(aa) && !isTargetedIndexEqualIndex(aa, C), ca = isIndexWidget(aa) && !isIndexWidgetEqualIndex(aa, C);
            return ba || ca;
        }).sort(sortIndexWidgetsFirst).reduce(function(da, ea) {
            var fa = isMultiIndexContext(ea) ? ea.props.indexContextValue.targetedIndex : ea.props.indexId, ga = da[fa] || [];
            return a.objectSpread({
            }, da, a.defineProperty({
            }, fa, ga.concat(ea)));
        }, {
        });
        return {
            mainParameters: T,
            derivedParameters: Object.keys($).map(function(ha) {
                return {
                    parameters: $[ha].reduce(function(ia, ja) {
                        return ja.getSearchParameters(ia);
                    }, N),
                    indexId: ha
                };
            })
        };
    }, ka = function() {
        if (!la) {
            var ma = M(na.state), oa = ma.mainParameters, pa = ma.derivedParameters;
            na.derivedHelpers.slice().forEach(function(qa) {
                qa.detach();
            }), pa.forEach(function(ra) {
                var sa = ra.indexId, ta = ra.parameters;
                na.derive(function() {
                    return ta;
                }).on("result", ua({
                    indexId: sa
                })).on("error", va);
            }), na.setState(oa), na.search();
        }
    }, ua = function(wa) {
        var xa = wa.indexId;
        return function(ya) {
            var za = Aa.getState(), Ba = !na.derivedHelpers.length, Ca = za.results ? za.results : {
            };
            Ca = !Ba && Ca.getFacetByName ? {
            } : Ca, Ca = Ba ? ya.results : a.objectSpread({
            }, Ca, a.defineProperty({
            }, xa, ya.results));
            var Da = Aa.getState(), Ea = Da.isSearchStalled;
            na.hasPendingRequests() || (clearTimeout(Fa), Fa = null, Ea = !1), Da.resultsFacetValues;
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
        na.hasPendingRequests() || (clearTimeout(Fa), Ka = !1), Ja.resultsFacetValues;
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
    }, na = b(E, C, a.objectSpread({
    }, d));
    addAlgoliaAgents(E), na.on("search", function() {
        Fa || (Fa = setTimeout(function() {
            var eb = Aa.getState(), fb = eb.resultsFacetValues, gb = a.objectWithoutProperties(eb, ["resultsFacetValues"]);
            Aa.setState(a.objectSpread({
            }, gb, {
                isSearchStalled: !0
            }));
        }, G));
    }).on("result", ua({
        indexId: C
    })).on("error", va);
    var la = !1, Fa = null, S = na.state, J = c(function() {
        var hb = H(Aa.getState().widgets);
        Aa.setState(a.objectSpread({
        }, Aa.getState(), {
            metadata: hb,
            searching: !0
        })), ka();
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
                            params: serializeQueryParameters(qb.params)
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
    }(E, F);
    var rb, sb, tb, Aa = (sb = {
        widgets: void 0 === D ? {
        } : D,
        metadata: hydrateMetadata(F),
        results: (rb = F) ? Array.isArray(rb.results) ? rb.results.reduce(function(ub, vb) {
            return a.objectSpread({
            }, ub, a.defineProperty({
            }, vb._internalIndexId, new b.SearchResults(new b.SearchParameters(vb.state), vb.rawResults)));
        }, {
        }) : new b.SearchResults(new b.SearchParameters(rb.state), rb.rawResults) : null,
        error: null,
        searching: !1,
        isSearchStalled: !0,
        searchingForFacetValues: !1
    }, tb = [], {
        getState: function() {
            return sb;
        },
        setState: function(wb) {
            sb = wb, tb.forEach(function(xb) {
                return xb();
            });
        },
        subscribe: function(yb) {
            return tb.push(yb), function() {
                tb.splice(tb.indexOf(yb), 1);
            };
        }
    });
    return {
        store: Aa,
        widgetsManager: J,
        getWidgetsIds: function() {
            return Aa.getState().metadata.reduce(function(zb, Ab) {
                return void 0 !== Ab.id ? zb.concat(Ab.id) : zb;
            }, []);
        },
        getSearchParameters: M,
        onSearchForFacetValues: function(Bb) {
            var Cb = Bb.facetName, Db = Bb.query, Eb = Bb.maxFacetHits;
            Aa.setState(a.objectSpread({
            }, Aa.getState(), {
                searchingForFacetValues: !0
            })), na.searchForFacetValues(Cb, Db, Math.max(1, Math.min(void 0 === Eb ? 10 : Eb, 100))).then(function(Fb) {
                Aa.setState(a.objectSpread({
                }, Aa.getState(), {
                    error: null,
                    searchingForFacetValues: !1,
                    resultsFacetValues: a.objectSpread({
                    }, Aa.getState().resultsFacetValues, (_obj = {
                    }, a.defineProperty(_obj, Cb, Fb.facetHits), a.defineProperty(_obj, "query", Db), _obj))
                }));
            }, function(Gb) {
                Aa.setState(a.objectSpread({
                }, Aa.getState(), {
                    searchingForFacetValues: !1,
                    error: Gb
                }));
            }).catch(function(Hb) {
                setTimeout(function() {
                    throw Hb;
                });
            });
        },
        onExternalStateUpdate: function(Ib) {
            var Jb = H(Ib);
            Aa.setState(a.objectSpread({
            }, Aa.getState(), {
                widgets: Ib,
                metadata: Jb,
                searching: !0
            })), ka();
        },
        transitionState: function(Kb) {
            var Lb = Aa.getState().widgets;
            return J.getWidgets().filter(function(Mb) {
                return Boolean(Mb.transitionState);
            }).reduce(function(Nb, Ob) {
                return Ob.transitionState(Lb, Nb);
            }, Kb);
        },
        updateClient: function(Pb) {
            addAlgoliaAgents(Pb), na.setClient(Pb), ka();
        },
        updateIndex: function(Qb) {
            S = S.setIndex(Qb);
        },
        clearCache: function() {
            na.clearCache(), ka();
        },
        skipSearch: function() {
            la = !0;
        }
    };
};
function hydrateMetadata(Rb) {
    return Rb ? Rb.metadata.map(function(Sb) {
        return a.objectSpread({
            value: function() {
                return {
                };
            }
        }, Sb, {
            items: Sb.items && Sb.items.map(function(Tb) {
                return a.objectSpread({
                    value: function() {
                        return {
                        };
                    }
                }, Tb, {
                    items: Tb.items && Tb.items.map(function(Ub) {
                        return a.objectSpread({
                            value: function() {
                                return {
                                };
                            }
                        }, Ub);
                    })
                });
            })
        });
    }) : [];
}
