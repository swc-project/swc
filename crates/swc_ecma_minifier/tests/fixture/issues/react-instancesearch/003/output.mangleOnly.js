import a from "algoliasearch-helper";
import b from "./createStore";
import { HIGHLIGHT_TAGS as c } from "./highlight";
import { hasMultipleIndices as d } from "./indexUtils";
import { version as e } from "react";
import f from "./version";
import { defer as g } from "./utils";
function h(b) {
    const c = [];
    let d = false;
    function a() {
        if (d) {
            return;
        }
        d = true;
        g(()=>{
            d = false;
            b();
        });
    }
    return {
        registerWidget (b) {
            c.push(b);
            a();
            return function d() {
                c.splice(c.indexOf(b), 1);
                a();
            };
        },
        update: a,
        getWidgets () {
            return c;
        }
    };
}
function i(a) {
    if (typeof a.addAlgoliaAgent === "function") {
        a.addAlgoliaAgent(`react (${e})`);
        a.addAlgoliaAgent(`react-instantsearch (${f})`);
    }
}
const j = (a)=>d({
        ais: a.props.contextValue,
        multiIndexContext: a.props.indexContextValue
    });
const k = (a, b)=>a.props.indexContextValue.targetedIndex === b;
const l = (a)=>Boolean(a.props.indexId);
const m = (a, b)=>a.props.indexId === b;
const n = (c, d)=>{
    const a = l(c);
    const b = l(d);
    if (a && !b) {
        return -1;
    }
    if (!a && b) {
        return 1;
    }
    return 0;
};
function o(a) {
    const b = (a)=>Object.prototype.toString.call(a) === "[object Object]" || Object.prototype.toString.call(a) === "[object Array]";
    const c = (a, ...b)=>{
        let c = 0;
        return a.replace(/%s/g, ()=>encodeURIComponent(b[c++]));
    };
    return Object.keys(a).map((d)=>c("%s=%s", d, b(a[d]) ? JSON.stringify(a[d]) : a[d])).join("&");
}
export default function p({ indexName: f , initialState: p = {} , searchClient: d , resultsState: e , stalledSearchDelay: C ,  }) {
    const g = a(d, f, {
        ...c
    });
    i(d);
    g.on("search", K).on("result", I({
        indexId: f
    })).on("error", J);
    let D = false;
    let E = null;
    let F = g.state;
    const r = h(P);
    L(d, e);
    const s = b({
        widgets: p,
        metadata: q(e),
        results: O(e),
        error: null,
        searching: false,
        isSearchStalled: true,
        searchingForFacetValues: false
    });
    function t() {
        D = true;
    }
    function u(a) {
        i(a);
        g.setClient(a);
        H();
    }
    function v() {
        g.clearCache();
        H();
    }
    function G(a) {
        return r.getWidgets().filter((a)=>Boolean(a.getMetadata)).map((b)=>b.getMetadata(a));
    }
    function w() {
        const a = r.getWidgets().filter((a)=>Boolean(a.getSearchParameters)).filter((a)=>!j(a) && !l(a)).reduce((a, b)=>b.getSearchParameters(a), F);
        const b = r.getWidgets().filter((a)=>Boolean(a.getSearchParameters)).filter((a)=>{
            const b = j(a) && k(a, f);
            const c = l(a) && m(a, f);
            return b || c;
        }).sort(n).reduce((a, b)=>b.getSearchParameters(a), a);
        const c = r.getWidgets().filter((a)=>Boolean(a.getSearchParameters)).filter((a)=>{
            const b = j(a) && !k(a, f);
            const c = l(a) && !m(a, f);
            return (b || c);
        }).sort(n).reduce((b, a)=>{
            const c = j(a) ? a.props.indexContextValue.targetedIndex : a.props.indexId;
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
            const { mainParameters: a , derivedParameters: b  } = w(g.state);
            g.derivedHelpers.slice().forEach((a)=>{
                a.detach();
            });
            b.forEach(({ indexId: a , parameters: c  })=>{
                const b = g.derive(()=>c);
                b.on("result", I({
                    indexId: a
                })).on("error", J);
            });
            g.setState(a);
            g.search();
        }
    }
    function I({ indexId: a  }) {
        return (c)=>{
            const d = s.getState();
            const e = !g.derivedHelpers.length;
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
            let h = f.isSearchStalled;
            if (!g.hasPendingRequests()) {
                clearTimeout(E);
                E = null;
                h = false;
            }
            const { resultsFacetValues: j , ...i } = f;
            s.setState({
                ...i,
                results: b,
                isSearchStalled: h,
                searching: false,
                error: null
            });
        };
    }
    function J({ error: c  }) {
        const a = s.getState();
        let b = a.isSearchStalled;
        if (!g.hasPendingRequests()) {
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
                        params: o(a.params)
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
        g.searchForFacetValues(a, b, d).then((c)=>{
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
function q(a) {
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
