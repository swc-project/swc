import e from "algoliasearch-helper";
import t from "./createWidgetsManager";
import r from "./createStore";
import { HIGHLIGHT_TAGS as s } from "./highlight";
import { hasMultipleIndices as a } from "./indexUtils";
import { version as n } from "react";
import c from "./version";
function o(e) {
    if (typeof e.addAlgoliaAgent === "function") {
        e.addAlgoliaAgent(`react (${n})`);
        e.addAlgoliaAgent(`react-instantsearch (${c})`);
    }
}
const i = (e)=>a({
        ais: e.props.contextValue,
        multiIndexContext: e.props.indexContextValue
    });
const u = (e, t)=>e.props.indexContextValue.targetedIndex === t;
const l = (e)=>Boolean(e.props.indexId);
const d = (e, t)=>e.props.indexId === t;
const f = (e, t)=>{
    const r = l(e);
    const s = l(t);
    if (r && !s) {
        return -1;
    }
    if (!r && s) {
        return 1;
    }
    return 0;
};
function g(e) {
    const t = (e)=>Object.prototype.toString.call(e) === "[object Object]" || Object.prototype.toString.call(e) === "[object Array]";
    const r = (e, ...t)=>{
        let r = 0;
        return e.replace(/%s/g, ()=>encodeURIComponent(t[r++]));
    };
    return Object.keys(e).map((s)=>r("%s=%s", s, t(e[s]) ? JSON.stringify(e[s]) : e[s])).join("&");
}
export default function p({ indexName: a , initialState: n = {} , searchClient: c , resultsState: p , stalledSearchDelay: h ,  }) {
    const S = e(c, a, {
        ...s
    });
    o(c);
    S.on("search", H).on("result", _({
        indexId: a
    })).on("error", q);
    let x = false;
    let y = null;
    let w = S.state;
    const R = t(j);
    W(c, p);
    const F = r({
        widgets: n,
        metadata: m(p),
        results: $(p),
        error: null,
        searching: false,
        isSearchStalled: true,
        searchingForFacetValues: false
    });
    function A() {
        x = true;
    }
    function V(e) {
        o(e);
        S.setClient(e);
        v();
    }
    function C() {
        S.clearCache();
        v();
    }
    function I(e) {
        return R.getWidgets().filter((e)=>Boolean(e.getMetadata)).map((t)=>t.getMetadata(e));
    }
    function P() {
        const e = R.getWidgets().filter((e)=>Boolean(e.getSearchParameters)).filter((e)=>!i(e) && !l(e)).reduce((e, t)=>t.getSearchParameters(e), w);
        const t = R.getWidgets().filter((e)=>Boolean(e.getSearchParameters)).filter((e)=>{
            const t = i(e) && u(e, a);
            const r = l(e) && d(e, a);
            return t || r;
        }).sort(f).reduce((e, t)=>t.getSearchParameters(e), e);
        const r = R.getWidgets().filter((e)=>Boolean(e.getSearchParameters)).filter((e)=>{
            const t = i(e) && !u(e, a);
            const r = l(e) && !d(e, a);
            return (t || r);
        }).sort(f).reduce((e, t)=>{
            const r = i(t) ? t.props.indexContextValue.targetedIndex : t.props.indexId;
            const s = e[r] || [];
            return {
                ...e,
                [r]: s.concat(t)
            };
        }, {});
        const s = Object.keys(r).map((t)=>({
                parameters: r[t].reduce((e, t)=>t.getSearchParameters(e), e),
                indexId: t
            }));
        return {
            mainParameters: t,
            derivedParameters: s
        };
    }
    function v() {
        if (!x) {
            const { mainParameters: e , derivedParameters: t  } = P(S.state);
            S.derivedHelpers.slice().forEach((e)=>{
                e.detach();
            });
            t.forEach(({ indexId: e , parameters: t  })=>{
                const r = S.derive(()=>t);
                r.on("result", _({
                    indexId: e
                })).on("error", q);
            });
            S.setState(e);
            S.search();
        }
    }
    function _({ indexId: e  }) {
        return (t)=>{
            const r = F.getState();
            const s = !S.derivedHelpers.length;
            let a = r.results ? r.results : {};
            a = !s && a.getFacetByName ? {} : a;
            if (!s) {
                a = {
                    ...a,
                    [e]: t.results
                };
            } else {
                a = t.results;
            }
            const n = F.getState();
            let c = n.isSearchStalled;
            if (!S.hasPendingRequests()) {
                clearTimeout(y);
                y = null;
                c = false;
            }
            const { resultsFacetValues: o , ...i } = n;
            F.setState({
                ...i,
                results: a,
                isSearchStalled: c,
                searching: false,
                error: null
            });
        };
    }
    function q({ error: e  }) {
        const t = F.getState();
        let r = t.isSearchStalled;
        if (!S.hasPendingRequests()) {
            clearTimeout(y);
            r = false;
        }
        const { resultsFacetValues: s , ...a } = t;
        F.setState({
            ...a,
            isSearchStalled: r,
            error: e,
            searching: false
        });
    }
    function H() {
        if (!y) {
            y = setTimeout(()=>{
                const { resultsFacetValues: e , ...t } = F.getState();
                F.setState({
                    ...t,
                    isSearchStalled: true
                });
            }, h);
        }
    }
    function W(e, t) {
        if (!t) {
            return;
        }
        if ((!e.transporter || e._cacheHydrated) && (!e._useCache || typeof e.addAlgoliaAgent !== "function")) {
            return;
        }
        if (e.transporter && !e._cacheHydrated) {
            e._cacheHydrated = true;
            const r = e.search;
            e.search = (t, ...s)=>{
                const a = t.map((e)=>({
                        ...e,
                        params: g(e.params)
                    }));
                return e.transporter.responsesCache.get({
                    method: "search",
                    args: [
                        a,
                        ...s
                    ]
                }, ()=>{
                    return r(t, ...s);
                });
            };
        }
        if (Array.isArray(t.results)) {
            b(e, t.results);
            return;
        }
        N(e, t);
    }
    function b(e, t) {
        if (e.transporter) {
            e.transporter.responsesCache.set({
                method: "search",
                args: [
                    t.reduce((e, t)=>e.concat(t.rawResults.map((e)=>({
                                indexName: e.index,
                                params: e.params
                            }))), []), 
                ]
            }, {
                results: t.reduce((e, t)=>e.concat(t.rawResults), [])
            });
            return;
        }
        const r = `/1/indexes/*/queries_body_${JSON.stringify({
            requests: t.reduce((e, t)=>e.concat(t.rawResults.map((e)=>({
                        indexName: e.index,
                        params: e.params
                    }))), [])
        })}`;
        e.cache = {
            ...e.cache,
            [r]: JSON.stringify({
                results: t.reduce((e, t)=>e.concat(t.rawResults), [])
            })
        };
    }
    function N(e, t) {
        if (e.transporter) {
            e.transporter.responsesCache.set({
                method: "search",
                args: [
                    t.rawResults.map((e)=>({
                            indexName: e.index,
                            params: e.params
                        })), 
                ]
            }, {
                results: t.rawResults
            });
            return;
        }
        const r = `/1/indexes/*/queries_body_${JSON.stringify({
            requests: t.rawResults.map((e)=>({
                    indexName: e.index,
                    params: e.params
                }))
        })}`;
        e.cache = {
            ...e.cache,
            [r]: JSON.stringify({
                results: t.rawResults
            })
        };
    }
    function $(t) {
        if (!t) {
            return null;
        }
        if (Array.isArray(t.results)) {
            return t.results.reduce((t, r)=>({
                    ...t,
                    [r._internalIndexId]: new e.SearchResults(new e.SearchParameters(r.state), r.rawResults)
                }), {});
        }
        return new e.SearchResults(new e.SearchParameters(t.state), t.rawResults);
    }
    function j() {
        const e = I(F.getState().widgets);
        F.setState({
            ...F.getState(),
            metadata: e,
            searching: true
        });
        v();
    }
    function M(e) {
        const t = F.getState().widgets;
        return R.getWidgets().filter((e)=>Boolean(e.transitionState)).reduce((e, r)=>r.transitionState(t, e), e);
    }
    function k(e) {
        const t = I(e);
        F.setState({
            ...F.getState(),
            widgets: e,
            metadata: t,
            searching: true
        });
        v();
    }
    function E({ facetName: e , query: t , maxFacetHits: r = 10  }) {
        const s = Math.max(1, Math.min(r, 100));
        F.setState({
            ...F.getState(),
            searchingForFacetValues: true
        });
        S.searchForFacetValues(e, t, s).then((r)=>{
            F.setState({
                ...F.getState(),
                error: null,
                searchingForFacetValues: false,
                resultsFacetValues: {
                    ...F.getState().resultsFacetValues,
                    [e]: r.facetHits,
                    query: t
                }
            });
        }, (e)=>{
            F.setState({
                ...F.getState(),
                searchingForFacetValues: false,
                error: e
            });
        }).catch((e)=>{
            setTimeout(()=>{
                throw e;
            });
        });
    }
    function B(e) {
        w = w.setIndex(e);
    }
    function O() {
        return F.getState().metadata.reduce((e, t)=>typeof t.id !== "undefined" ? e.concat(t.id) : e, []);
    }
    return {
        store: F,
        widgetsManager: R,
        getWidgetsIds: O,
        getSearchParameters: P,
        onSearchForFacetValues: E,
        onExternalStateUpdate: k,
        transitionState: M,
        updateClient: V,
        updateIndex: B,
        clearCache: C,
        skipSearch: A
    };
};
function m(e) {
    if (!e) {
        return [];
    }
    return e.metadata.map((e)=>({
            value: ()=>({}),
            ...e,
            items: e.items && e.items.map((e)=>({
                    value: ()=>({}),
                    ...e,
                    items: e.items && e.items.map((e)=>({
                            value: ()=>({}),
                            ...e
                        }))
                }))
        }));
}
