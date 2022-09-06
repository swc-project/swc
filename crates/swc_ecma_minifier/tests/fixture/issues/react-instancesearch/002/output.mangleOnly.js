import e from "algoliasearch-helper";
import t from "./createWidgetsManager";
import r from "./createStore";
import { HIGHLIGHT_TAGS as a } from "./highlight";
import { hasMultipleIndices as s } from "./indexUtils";
import { version as n } from "react";
import c from "./version";
function o(e) {
    if (typeof e.addAlgoliaAgent === "function") {
        e.addAlgoliaAgent(`react (${n})`);
        e.addAlgoliaAgent(`react-instantsearch (${c})`);
    }
}
const i = (e)=>s({
        ais: e.props.contextValue,
        multiIndexContext: e.props.indexContextValue
    });
const u = (e, t)=>e.props.indexContextValue.targetedIndex === t;
const l = (e)=>Boolean(e.props.indexId);
const d = (e, t)=>e.props.indexId === t;
const f = (e, t)=>{
    const r = l(e);
    const a = l(t);
    if (r && !a) {
        return -1;
    }
    if (!r && a) {
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
    return Object.keys(e).map((a)=>r("%s=%s", a, t(e[a]) ? JSON.stringify(e[a]) : e[a])).join("&");
}
export default function m({ indexName: s , initialState: n = {} , searchClient: c , resultsState: m , stalledSearchDelay: h ,  }) {
    const S = e(c, s, {
        ...a
    });
    o(c);
    S.on("search", $).on("result", P({
        indexId: s
    })).on("error", b);
    let x = false;
    let y = null;
    let w = S.state;
    const R = t(H);
    j(c, m);
    const A = r({
        widgets: n,
        metadata: p(m),
        results: q(m),
        error: null,
        searching: false,
        isSearchStalled: true,
        searchingForFacetValues: false
    });
    function F() {
        x = true;
    }
    function C(e) {
        o(e);
        S.setClient(e);
        O();
    }
    function I() {
        S.clearCache();
        O();
    }
    function V(e) {
        return R.getWidgets().filter((e)=>Boolean(e.getMetadata)).map((t)=>t.getMetadata(e));
    }
    function N() {
        const e = R.getWidgets().filter((e)=>Boolean(e.getSearchParameters)).filter((e)=>!i(e) && !l(e)).reduce((e, t)=>t.getSearchParameters(e), w);
        const t = R.getWidgets().filter((e)=>Boolean(e.getSearchParameters)).filter((e)=>{
            const t = i(e) && u(e, s);
            const r = l(e) && d(e, s);
            return t || r;
        }).sort(f).reduce((e, t)=>t.getSearchParameters(e), e);
        const r = R.getWidgets().filter((e)=>Boolean(e.getSearchParameters)).filter((e)=>{
            const t = i(e) && !u(e, s);
            const r = l(e) && !d(e, s);
            return (t || r);
        }).sort(f).reduce((e, t)=>{
            const r = i(t) ? t.props.indexContextValue.targetedIndex : t.props.indexId;
            const a = e[r] || [];
            return {
                ...e,
                [r]: a.concat(t)
            };
        }, {});
        const a = Object.keys(r).map((t)=>({
                parameters: r[t].reduce((e, t)=>t.getSearchParameters(e), e),
                indexId: t
            }));
        return {
            mainParameters: t,
            derivedParameters: a
        };
    }
    function O() {
        if (!x) {
            const { mainParameters: e , derivedParameters: t  } = N(S.state);
            S.derivedHelpers.slice().forEach((e)=>{
                e.detach();
            });
            t.forEach(({ indexId: e , parameters: t  })=>{
                const r = S.derive(()=>t);
                r.on("result", P({
                    indexId: e
                })).on("error", b);
            });
            S.setState(e);
            S.search();
        }
    }
    function P({ indexId: e  }) {
        return (t)=>{
            const r = A.getState();
            const a = !S.derivedHelpers.length;
            let s = r.results ? r.results : {};
            s = !a && s.getFacetByName ? {} : s;
            if (!a) {
                s = {
                    ...s,
                    [e]: t.results
                };
            } else {
                s = t.results;
            }
            const n = A.getState();
            let c = n.isSearchStalled;
            if (!S.hasPendingRequests()) {
                clearTimeout(y);
                y = null;
                c = false;
            }
            const { resultsFacetValues: o , ...i } = n;
            A.setState({
                ...i,
                results: s,
                isSearchStalled: c,
                searching: false,
                error: null
            });
        };
    }
    function b({ error: e  }) {
        const t = A.getState();
        let r = t.isSearchStalled;
        if (!S.hasPendingRequests()) {
            clearTimeout(y);
            r = false;
        }
        const { resultsFacetValues: a , ...s } = t;
        A.setState({
            ...s,
            isSearchStalled: r,
            error: e,
            searching: false
        });
    }
    function $() {
        if (!y) {
            y = setTimeout(()=>{
                const { resultsFacetValues: e , ...t } = A.getState();
                A.setState({
                    ...t,
                    isSearchStalled: true
                });
            }, h);
        }
    }
    function j(e, t) {
        if (!t) {
            return;
        }
        if ((!e.transporter || e._cacheHydrated) && (!e._useCache || typeof e.addAlgoliaAgent !== "function")) {
            return;
        }
        if (e.transporter && !e._cacheHydrated) {
            e._cacheHydrated = true;
            const r = e.search;
            e.search = (t, ...a)=>{
                const s = t.map((e)=>({
                        ...e,
                        params: g(e.params)
                    }));
                return e.transporter.responsesCache.get({
                    method: "search",
                    args: [
                        s,
                        ...a
                    ]
                }, ()=>{
                    return r(t, ...a);
                });
            };
        }
        if (Array.isArray(t.results)) {
            v(e, t.results);
            return;
        }
        B(e, t);
    }
    function v(e, t) {
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
    function B(e, t) {
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
    function q(t) {
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
    function H() {
        const e = V(A.getState().widgets);
        A.setState({
            ...A.getState(),
            metadata: e,
            searching: true
        });
        O();
    }
    function W(e) {
        const t = A.getState().widgets;
        return R.getWidgets().filter((e)=>Boolean(e.transitionState)).reduce((e, r)=>r.transitionState(t, e), e);
    }
    function J(e) {
        const t = V(e);
        A.setState({
            ...A.getState(),
            widgets: e,
            metadata: t,
            searching: true
        });
        O();
    }
    function M({ facetName: e , query: t , maxFacetHits: r = 10  }) {
        const a = Math.max(1, Math.min(r, 100));
        A.setState({
            ...A.getState(),
            searchingForFacetValues: true
        });
        S.searchForFacetValues(e, t, a).then((r)=>{
            A.setState({
                ...A.getState(),
                error: null,
                searchingForFacetValues: false,
                resultsFacetValues: {
                    ...A.getState().resultsFacetValues,
                    [e]: r.facetHits,
                    query: t
                }
            });
        }, (e)=>{
            A.setState({
                ...A.getState(),
                searchingForFacetValues: false,
                error: e
            });
        }).catch((e)=>{
            setTimeout(()=>{
                throw e;
            });
        });
    }
    function T(e) {
        w = w.setIndex(e);
    }
    function _() {
        return A.getState().metadata.reduce((e, t)=>typeof t.id !== "undefined" ? e.concat(t.id) : e, []);
    }
    return {
        store: A,
        widgetsManager: R,
        getWidgetsIds: _,
        getSearchParameters: N,
        onSearchForFacetValues: M,
        onExternalStateUpdate: J,
        transitionState: W,
        updateClient: C,
        updateIndex: T,
        clearCache: I,
        skipSearch: F
    };
};
function p(e) {
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
