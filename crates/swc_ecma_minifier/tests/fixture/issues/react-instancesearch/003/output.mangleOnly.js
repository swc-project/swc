import e from "algoliasearch-helper";
import t from "./createStore";
import { HIGHLIGHT_TAGS as r } from "./highlight";
import { hasMultipleIndices as s } from "./indexUtils";
import { version as a } from "react";
import n from "./version";
import { defer as c } from "./utils";
function o(e) {
    const t = [];
    let r = false;
    function s() {
        if (r) {
            return;
        }
        r = true;
        c(()=>{
            r = false;
            e();
        });
    }
    return {
        registerWidget (e) {
            t.push(e);
            s();
            return function r() {
                t.splice(t.indexOf(e), 1);
                s();
            };
        },
        update: s,
        getWidgets () {
            return t;
        }
    };
}
function i(e) {
    if (typeof e.addAlgoliaAgent === "function") {
        e.addAlgoliaAgent(`react (${a})`);
        e.addAlgoliaAgent(`react-instantsearch (${n})`);
    }
}
const u = (e)=>s({
        ais: e.props.contextValue,
        multiIndexContext: e.props.indexContextValue
    });
const l = (e, t)=>e.props.indexContextValue.targetedIndex === t;
const d = (e)=>Boolean(e.props.indexId);
const f = (e, t)=>e.props.indexId === t;
const g = (e, t)=>{
    const r = d(e);
    const s = d(t);
    if (r && !s) {
        return -1;
    }
    if (!r && s) {
        return 1;
    }
    return 0;
};
function m(e) {
    const t = (e)=>Object.prototype.toString.call(e) === "[object Object]" || Object.prototype.toString.call(e) === "[object Array]";
    const r = (e, ...t)=>{
        let r = 0;
        return e.replace(/%s/g, ()=>encodeURIComponent(t[r++]));
    };
    return Object.keys(e).map((s)=>r("%s=%s", s, t(e[s]) ? JSON.stringify(e[s]) : e[s])).join("&");
}
export default function p({ indexName: s , initialState: a = {} , searchClient: n , resultsState: c , stalledSearchDelay: p ,  }) {
    const S = e(n, s, {
        ...r
    });
    i(n);
    S.on("search", _).on("result", P({
        indexId: s
    })).on("error", b);
    let x = false;
    let y = null;
    let w = S.state;
    const R = o(q);
    j(n, c);
    const A = t({
        widgets: a,
        metadata: h(c),
        results: W(c),
        error: null,
        searching: false,
        isSearchStalled: true,
        searchingForFacetValues: false
    });
    function F() {
        x = true;
    }
    function C(e) {
        i(e);
        S.setClient(e);
        N();
    }
    function I() {
        S.clearCache();
        N();
    }
    function O(e) {
        return R.getWidgets().filter((e)=>Boolean(e.getMetadata)).map((t)=>t.getMetadata(e));
    }
    function V() {
        const e = R.getWidgets().filter((e)=>Boolean(e.getSearchParameters)).filter((e)=>!u(e) && !d(e)).reduce((e, t)=>t.getSearchParameters(e), w);
        const t = R.getWidgets().filter((e)=>Boolean(e.getSearchParameters)).filter((e)=>{
            const t = u(e) && l(e, s);
            const r = d(e) && f(e, s);
            return t || r;
        }).sort(g).reduce((e, t)=>t.getSearchParameters(e), e);
        const r = R.getWidgets().filter((e)=>Boolean(e.getSearchParameters)).filter((e)=>{
            const t = u(e) && !l(e, s);
            const r = d(e) && !f(e, s);
            return (t || r);
        }).sort(g).reduce((e, t)=>{
            const r = u(t) ? t.props.indexContextValue.targetedIndex : t.props.indexId;
            const s = e[r] || [];
            return {
                ...e,
                [r]: s.concat(t)
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
    function N() {
        if (!x) {
            const { mainParameters: e , derivedParameters: t  } = V(S.state);
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
                results: a,
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
        const { resultsFacetValues: s , ...a } = t;
        A.setState({
            ...a,
            isSearchStalled: r,
            error: e,
            searching: false
        });
    }
    function _() {
        if (!y) {
            y = setTimeout(()=>{
                const { resultsFacetValues: e , ...t } = A.getState();
                A.setState({
                    ...t,
                    isSearchStalled: true
                });
            }, p);
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
            e.search = (t, ...s)=>{
                const a = t.map((e)=>({
                        ...e,
                        params: m(e.params)
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
    function W(t) {
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
    function q() {
        const e = O(A.getState().widgets);
        A.setState({
            ...A.getState(),
            metadata: e,
            searching: true
        });
        N();
    }
    function H(e) {
        const t = A.getState().widgets;
        return R.getWidgets().filter((e)=>Boolean(e.transitionState)).reduce((e, r)=>r.transitionState(t, e), e);
    }
    function J(e) {
        const t = O(e);
        A.setState({
            ...A.getState(),
            widgets: e,
            metadata: t,
            searching: true
        });
        N();
    }
    function M({ facetName: e , query: t , maxFacetHits: r = 10  }) {
        const s = Math.max(1, Math.min(r, 100));
        A.setState({
            ...A.getState(),
            searchingForFacetValues: true
        });
        S.searchForFacetValues(e, t, s).then((r)=>{
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
    function $() {
        return A.getState().metadata.reduce((e, t)=>typeof t.id !== "undefined" ? e.concat(t.id) : e, []);
    }
    return {
        store: A,
        widgetsManager: R,
        getWidgetsIds: $,
        getSearchParameters: V,
        onSearchForFacetValues: M,
        onExternalStateUpdate: J,
        transitionState: H,
        updateClient: C,
        updateIndex: T,
        clearCache: I,
        skipSearch: F
    };
}
function h(e) {
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
