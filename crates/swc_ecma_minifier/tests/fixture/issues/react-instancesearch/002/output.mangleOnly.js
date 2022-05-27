import a from "algoliasearch-helper";
import b from "./createWidgetsManager";
import c from "./createStore";
import { HIGHLIGHT_TAGS as d } from "./highlight";
import { hasMultipleIndices as e } from "./indexUtils";
import { version as f } from "react";
import g from "./version";
function h(a) {
    if (typeof a.addAlgoliaAgent === "function") {
        a.addAlgoliaAgent(`react (${f})`);
        a.addAlgoliaAgent(`react-instantsearch (${g})`);
    }
}
const i = (a)=>e({
        ais: a.props.contextValue,
        multiIndexContext: a.props.indexContextValue
    });
const j = (a, b)=>a.props.indexContextValue.targetedIndex === b;
const k = (a)=>Boolean(a.props.indexId);
const l = (a, b)=>a.props.indexId === b;
const m = (c, d)=>{
    const a = k(c);
    const b = k(d);
    if (a && !b) {
        return -1;
    }
    if (!a && b) {
        return 1;
    }
    return 0;
};
function n(a) {
    const b = (a)=>Object.prototype.toString.call(a) === "[object Object]" || Object.prototype.toString.call(a) === "[object Array]";
    const c = (a, ...b)=>{
        let c = 0;
        return a.replace(/%s/g, ()=>encodeURIComponent(b[c++]));
    };
    return Object.keys(a).map((d)=>c("%s=%s", d, b(a[d]) ? JSON.stringify(a[d]) : a[d])).join("&");
}
export default function o({ indexName: g , initialState: q = {} , searchClient: e , resultsState: f , stalledSearchDelay: C ,  }) {
    const o = a(e, g, {
        ...d
    });
    h(e);
    o.on("search", K).on("result", I({
        indexId: g
    })).on("error", J);
    let D = false;
    let E = null;
    let F = o.state;
    const r = b(P);
    L(e, f);
    const s = c({
        widgets: q,
        metadata: p(f),
        results: O(f),
        error: null,
        searching: false,
        isSearchStalled: true,
        searchingForFacetValues: false
    });
    function t() {
        D = true;
    }
    function u(a) {
        h(a);
        o.setClient(a);
        H();
    }
    function v() {
        o.clearCache();
        H();
    }
    function G(a) {
        return r.getWidgets().filter((a)=>Boolean(a.getMetadata)).map((b)=>b.getMetadata(a));
    }
    function w() {
        const a = r.getWidgets().filter((a)=>Boolean(a.getSearchParameters)).filter((a)=>!i(a) && !k(a)).reduce((a, b)=>b.getSearchParameters(a), F);
        const b = r.getWidgets().filter((a)=>Boolean(a.getSearchParameters)).filter((a)=>{
            const b = i(a) && j(a, g);
            const c = k(a) && l(a, g);
            return b || c;
        }).sort(m).reduce((a, b)=>b.getSearchParameters(a), a);
        const c = r.getWidgets().filter((a)=>Boolean(a.getSearchParameters)).filter((a)=>{
            const b = i(a) && !j(a, g);
            const c = k(a) && !l(a, g);
            return (b || c);
        }).sort(m).reduce((b, a)=>{
            const c = i(a) ? a.props.indexContextValue.targetedIndex : a.props.indexId;
            const d = b[c] || [];
            return {
                ...b,
                [c]: d.concat(a)
            };
        }, {});
        const d = Object.keys(c).map((b)=>({
                parameters: c[b].reduce((a, b)=>b.getSearchParameters(a), a),
                indexId: b
            }));
        return {
            mainParameters: b,
            derivedParameters: d
        };
    }
    function H() {
        if (!D) {
            const { mainParameters: a , derivedParameters: b  } = w(o.state);
            o.derivedHelpers.slice().forEach((a)=>{
                a.detach();
            });
            b.forEach(({ indexId: a , parameters: c  })=>{
                const b = o.derive(()=>c);
                b.on("result", I({
                    indexId: a
                })).on("error", J);
            });
            o.setState(a);
            o.search();
        }
    }
    function I({ indexId: a  }) {
        return (c)=>{
            const d = s.getState();
            const e = !o.derivedHelpers.length;
            let b = d.results ? d.results : {};
            b = !e && b.getFacetByName ? {} : b;
            if (!e) {
                b = {
                    ...b,
                    [a]: c.results
                };
            } else {
                b = c.results;
            }
            const f = s.getState();
            let g = f.isSearchStalled;
            if (!o.hasPendingRequests()) {
                clearTimeout(E);
                E = null;
                g = false;
            }
            const { resultsFacetValues: i , ...h } = f;
            s.setState({
                ...h,
                results: b,
                isSearchStalled: g,
                searching: false,
                error: null
            });
        };
    }
    function J({ error: c  }) {
        const a = s.getState();
        let b = a.isSearchStalled;
        if (!o.hasPendingRequests()) {
            clearTimeout(E);
            b = false;
        }
        const { resultsFacetValues: e , ...d } = a;
        s.setState({
            ...d,
            isSearchStalled: b,
            error: c,
            searching: false
        });
    }
    function K() {
        if (!E) {
            E = setTimeout(()=>{
                const { resultsFacetValues: b , ...a } = s.getState();
                s.setState({
                    ...a,
                    isSearchStalled: true
                });
            }, C);
        }
    }
    function L(a, b) {
        if (!b) {
            return;
        }
        if ((!a.transporter || a._cacheHydrated) && (!a._useCache || typeof a.addAlgoliaAgent !== "function")) {
            return;
        }
        if (a.transporter && !a._cacheHydrated) {
            a._cacheHydrated = true;
            const c = a.search;
            a.search = (b, ...d)=>{
                const e = b.map((a)=>({
                        ...a,
                        params: n(a.params)
                    }));
                return a.transporter.responsesCache.get({
                    method: "search",
                    args: [
                        e,
                        ...d
                    ]
                }, ()=>{
                    return c(b, ...d);
                });
            };
        }
        if (Array.isArray(b.results)) {
            M(a, b.results);
            return;
        }
        N(a, b);
    }
    function M(a, b) {
        if (a.transporter) {
            a.transporter.responsesCache.set({
                method: "search",
                args: [
                    b.reduce((a, b)=>a.concat(b.rawResults.map((a)=>({
                                indexName: a.index,
                                params: a.params
                            }))), []), 
                ]
            }, {
                results: b.reduce((a, b)=>a.concat(b.rawResults), [])
            });
            return;
        }
        const c = `/1/indexes/*/queries_body_${JSON.stringify({
            requests: b.reduce((a, b)=>a.concat(b.rawResults.map((a)=>({
                        indexName: a.index,
                        params: a.params
                    }))), [])
        })}`;
        a.cache = {
            ...a.cache,
            [c]: JSON.stringify({
                results: b.reduce((a, b)=>a.concat(b.rawResults), [])
            })
        };
    }
    function N(a, b) {
        if (a.transporter) {
            a.transporter.responsesCache.set({
                method: "search",
                args: [
                    b.rawResults.map((a)=>({
                            indexName: a.index,
                            params: a.params
                        })), 
                ]
            }, {
                results: b.rawResults
            });
            return;
        }
        const c = `/1/indexes/*/queries_body_${JSON.stringify({
            requests: b.rawResults.map((a)=>({
                    indexName: a.index,
                    params: a.params
                }))
        })}`;
        a.cache = {
            ...a.cache,
            [c]: JSON.stringify({
                results: b.rawResults
            })
        };
    }
    function O(b) {
        if (!b) {
            return null;
        }
        if (Array.isArray(b.results)) {
            return b.results.reduce((c, b)=>({
                    ...c,
                    [b._internalIndexId]: new a.SearchResults(new a.SearchParameters(b.state), b.rawResults)
                }), {});
        }
        return new a.SearchResults(new a.SearchParameters(b.state), b.rawResults);
    }
    function P() {
        const a = G(s.getState().widgets);
        s.setState({
            ...s.getState(),
            metadata: a,
            searching: true
        });
        H();
    }
    function x(a) {
        const b = s.getState().widgets;
        return r.getWidgets().filter((a)=>Boolean(a.transitionState)).reduce((a, c)=>c.transitionState(b, a), a);
    }
    function y(a) {
        const b = G(a);
        s.setState({
            ...s.getState(),
            widgets: a,
            metadata: b,
            searching: true
        });
        H();
    }
    function z({ facetName: a , query: b , maxFacetHits: c = 10  }) {
        const d = Math.max(1, Math.min(c, 100));
        s.setState({
            ...s.getState(),
            searchingForFacetValues: true
        });
        o.searchForFacetValues(a, b, d).then((c)=>{
            s.setState({
                ...s.getState(),
                error: null,
                searchingForFacetValues: false,
                resultsFacetValues: {
                    ...s.getState().resultsFacetValues,
                    [a]: c.facetHits,
                    query: b
                }
            });
        }, (a)=>{
            s.setState({
                ...s.getState(),
                searchingForFacetValues: false,
                error: a
            });
        }).catch((a)=>{
            setTimeout(()=>{
                throw a;
            });
        });
    }
    function A(a) {
        F = F.setIndex(a);
    }
    function B() {
        return s.getState().metadata.reduce((a, b)=>typeof b.id !== "undefined" ? a.concat(b.id) : a, []);
    }
    return {
        store: s,
        widgetsManager: r,
        getWidgetsIds: B,
        getSearchParameters: w,
        onSearchForFacetValues: z,
        onExternalStateUpdate: y,
        transitionState: x,
        updateClient: u,
        updateIndex: A,
        clearCache: v,
        skipSearch: t
    };
};
function p(a) {
    if (!a) {
        return [];
    }
    return a.metadata.map((a)=>({
            value: ()=>({}),
            ...a,
            items: a.items && a.items.map((a)=>({
                    value: ()=>({}),
                    ...a,
                    items: a.items && a.items.map((a)=>({
                            value: ()=>({}),
                            ...a
                        }))
                }))
        }));
}
