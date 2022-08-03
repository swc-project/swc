import e from "algoliasearch-helper";
import t from "./createStore";
import { HIGHLIGHT_TAGS as r } from "./highlight";
import { hasMultipleIndices as s } from "./indexUtils";
import { version as a } from "react";
import n from "./version";
import { defer as c } from "./utils";
function i(e) {
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
function o(e) {
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
function p(e) {
    const t = (e)=>Object.prototype.toString.call(e) === "[object Object]" || Object.prototype.toString.call(e) === "[object Array]";
    const r = (e, ...t)=>{
        let r = 0;
        return e.replace(/%s/g, ()=>encodeURIComponent(t[r++]));
    };
    return Object.keys(e).map((s)=>r("%s=%s", s, t(e[s]) ? JSON.stringify(e[s]) : e[s])).join("&");
}
export default function m({ indexName: s , initialState: a = {} , searchClient: n , resultsState: c , stalledSearchDelay: m ,  }) {
    const S = e(n, s, {
        ...r
    });
    o(n);
    S.on("search", q).on("result", v({
        indexId: s
    })).on("error", W);
    let x = false;
    let y = null;
    let w = S.state;
    const R = i(k);
    H(n, c);
    const F = t({
        widgets: a,
        metadata: h(c),
        results: b(c),
        error: null,
        searching: false,
        isSearchStalled: true,
        searchingForFacetValues: false
    });
    function V() {
        x = true;
    }
    function A(e) {
        o(e);
        S.setClient(e);
        _();
    }
    function C() {
        S.clearCache();
        _();
    }
    function I(e) {
        return R.getWidgets().filter((e)=>Boolean(e.getMetadata)).map((t)=>t.getMetadata(e));
    }
    function P() {
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
    function _() {
        if (!x) {
            const { mainParameters: e , derivedParameters: t  } = P(S.state);
            S.derivedHelpers.slice().forEach((e)=>{
                e.detach();
            });
            t.forEach(({ indexId: e , parameters: t  })=>{
                const r = S.derive(()=>t);
                r.on("result", v({
                    indexId: e
                })).on("error", W);
            });
            S.setState(e);
            S.search();
        }
    }
    function v({ indexId: e  }) {
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
            const { resultsFacetValues: i , ...o } = n;
            F.setState({
                ...o,
                results: a,
                isSearchStalled: c,
                searching: false,
                error: null
            });
        };
    }
    function W({ error: e  }) {
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
    function q() {
        if (!y) {
            y = setTimeout(()=>{
                const { resultsFacetValues: e , ...t } = F.getState();
                F.setState({
                    ...t,
                    isSearchStalled: true
                });
            }, m);
        }
    }
    function H(e, t) {
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
                        params: p(e.params)
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
            N(e, t.results);
            return;
        }
        $(e, t);
    }
    function N(e, t) {
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
    function $(e, t) {
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
    function b(t) {
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
    function k() {
        const e = I(F.getState().widgets);
        F.setState({
            ...F.getState(),
            metadata: e,
            searching: true
        });
        _();
    }
    function E(e) {
        const t = F.getState().widgets;
        return R.getWidgets().filter((e)=>Boolean(e.transitionState)).reduce((e, r)=>r.transitionState(t, e), e);
    }
    function M(e) {
        const t = I(e);
        F.setState({
            ...F.getState(),
            widgets: e,
            metadata: t,
            searching: true
        });
        _();
    }
    function j({ facetName: e , query: t , maxFacetHits: r = 10  }) {
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
        onSearchForFacetValues: j,
        onExternalStateUpdate: M,
        transitionState: E,
        updateClient: A,
        updateIndex: B,
        clearCache: C,
        skipSearch: V
    };
};
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
