import algoliasearchHelper from "algoliasearch-helper";
import createStore from "./createStore";
import { HIGHLIGHT_TAGS } from "./highlight";
import { hasMultipleIndices } from "./indexUtils";
import { version as ReactVersion } from "react";
import version from "./version";
import { defer } from "./utils";
function addAlgoliaAgents(searchClient) {
    "function" == typeof searchClient.addAlgoliaAgent && (searchClient.addAlgoliaAgent(`react (${ReactVersion})`), searchClient.addAlgoliaAgent(`react-instantsearch (${version})`));
}
const isMultiIndexContext = (widget)=>hasMultipleIndices({
        ais: widget.props.contextValue,
        multiIndexContext: widget.props.indexContextValue
    }), isTargetedIndexEqualIndex = (widget, indexId)=>widget.props.indexContextValue.targetedIndex === indexId, isIndexWidget = (widget)=>!!widget.props.indexId, isIndexWidgetEqualIndex = (widget, indexId)=>widget.props.indexId === indexId, sortIndexWidgetsFirst = (firstWidget, secondWidget)=>{
    const isFirstWidgetIndex = isIndexWidget(firstWidget), isSecondWidgetIndex = isIndexWidget(secondWidget);
    return isFirstWidgetIndex && !isSecondWidgetIndex ? -1 : !isFirstWidgetIndex && isSecondWidgetIndex ? 1 : 0;
};
/**
 * Creates a new instance of the InstantSearchManager which controls the widgets and
 * trigger the search when the widgets are updated.
 * @param {string} indexName - the main index name
 * @param {object} initialState - initial widget state
 * @param {object} SearchParameters - optional additional parameters to send to the algolia API
 * @param {number} stalledSearchDelay - time (in ms) after the search is stalled
 * @return {InstantSearchManager} a new instance of InstantSearchManager
 */ export default function createInstantSearchManager({ indexName, initialState = {}, searchClient, resultsState, stalledSearchDelay }) {
    const helper = algoliasearchHelper(searchClient, indexName, {
        ...HIGHLIGHT_TAGS
    });
    addAlgoliaAgents(searchClient), helper.on("search", function() {
        stalledSearchTimer || (stalledSearchTimer = setTimeout(()=>{
            const { resultsFacetValues, ...partialState } = store.getState();
            store.setState({
                ...partialState,
                isSearchStalled: !0
            });
        }, stalledSearchDelay));
    }).on("result", handleSearchSuccess({
        indexId: indexName
    })).on("error", handleSearchError);
    let skip = !1, stalledSearchTimer = null, initialSearchParameters = helper.state;
    const widgetsManager = function(onWidgetsUpdate) {
        const widgets = [];
        // Is an update scheduled?
        let scheduled = !1;
        // The state manager's updates need to be batched since more than one
        // component can register or unregister widgets during the same tick.
        function scheduleUpdate() {
            scheduled || (scheduled = !0, defer(()=>{
                scheduled = !1, onWidgetsUpdate();
            }));
        }
        return {
            registerWidget: (widget)=>(widgets.push(widget), scheduleUpdate(), function() {
                    widgets.splice(widgets.indexOf(widget), 1), scheduleUpdate();
                }),
            update: scheduleUpdate,
            getWidgets: ()=>widgets
        };
    }(// Called whenever a widget has been rendered with new props.
    function() {
        const metadata = getMetadata(store.getState().widgets);
        store.setState({
            ...store.getState(),
            metadata,
            searching: !0
        }), // Since the `getSearchParameters` method of widgets also depends on props,
        // the result search parameters might have changed.
        search();
    });
    !function(client, results) {
        if (results && (client.transporter && !client._cacheHydrated || client._useCache && "function" == typeof client.addAlgoliaAgent)) {
            // Algoliasearch API Client >= v4
            // To hydrate the client we need to populate the cache with the data from
            // the server (done in `hydrateSearchClientWithMultiIndexRequest` or
            // `hydrateSearchClientWithSingleIndexRequest`). But since there is no way
            // for us to compute the key the same way as `algoliasearch-client` we need
            // to populate it on a custom key and override the `search` method to
            // search on it first.
            if (client.transporter && !client._cacheHydrated) {
                client._cacheHydrated = !0;
                const baseMethod = client.search;
                client.search = (requests, ...methodArgs)=>{
                    const requestsWithSerializedParams = requests.map((request)=>({
                            ...request,
                            params: // This function is copied from the algoliasearch v4 API Client. If modified,
                            // consider updating it also in `serializeQueryParameters` from `@algolia/transporter`.
                            function(parameters) {
                                const isObjectOrArray = (value)=>"[object Object]" === Object.prototype.toString.call(value) || "[object Array]" === Object.prototype.toString.call(value), encode = (format, ...args)=>{
                                    let i = 0;
                                    return format.replace(/%s/g, ()=>encodeURIComponent(args[i++]));
                                };
                                return Object.keys(parameters).map((key)=>encode("%s=%s", key, isObjectOrArray(parameters[key]) ? JSON.stringify(parameters[key]) : parameters[key])).join("&");
                            }(request.params)
                        }));
                    return client.transporter.responsesCache.get({
                        method: "search",
                        args: [
                            requestsWithSerializedParams,
                            ...methodArgs
                        ]
                    }, ()=>baseMethod(requests, ...methodArgs));
                };
            }
            if (Array.isArray(results.results)) {
                !function(client, results) {
                    // Algoliasearch API Client >= v4
                    // Populate the cache with the data from the server
                    if (client.transporter) {
                        client.transporter.responsesCache.set({
                            method: "search",
                            args: [
                                results.reduce((acc, result)=>acc.concat(result.rawResults.map((request)=>({
                                            indexName: request.index,
                                            params: request.params
                                        }))), [])
                            ]
                        }, {
                            results: results.reduce((acc, result)=>acc.concat(result.rawResults), [])
                        });
                        return;
                    }
                    // Algoliasearch API Client < v4
                    // Prior to client v4 we didn't have a proper API to hydrate the client
                    // cache from the outside. The following code populates the cache with
                    // a single-index result. You can find more information about the
                    // computation of the key inside the client (see link below).
                    // https://github.com/algolia/algoliasearch-client-javascript/blob/c27e89ff92b2a854ae6f40dc524bffe0f0cbc169/src/AlgoliaSearchCore.js#L232-L240
                    const key = `/1/indexes/*/queries_body_${JSON.stringify({
                        requests: results.reduce((acc, result)=>acc.concat(result.rawResults.map((request)=>({
                                    indexName: request.index,
                                    params: request.params
                                }))), [])
                    })}`;
                    client.cache = {
                        ...client.cache,
                        [key]: JSON.stringify({
                            results: results.reduce((acc, result)=>acc.concat(result.rawResults), [])
                        })
                    };
                }(client, results.results);
                return;
            }
            !function(client, results) {
                // Algoliasearch API Client >= v4
                // Populate the cache with the data from the server
                if (client.transporter) {
                    client.transporter.responsesCache.set({
                        method: "search",
                        args: [
                            results.rawResults.map((request)=>({
                                    indexName: request.index,
                                    params: request.params
                                }))
                        ]
                    }, {
                        results: results.rawResults
                    });
                    return;
                }
                // Algoliasearch API Client < v4
                // Prior to client v4 we didn't have a proper API to hydrate the client
                // cache from the outside. The following code populates the cache with
                // a single-index result. You can find more information about the
                // computation of the key inside the client (see link below).
                // https://github.com/algolia/algoliasearch-client-javascript/blob/c27e89ff92b2a854ae6f40dc524bffe0f0cbc169/src/AlgoliaSearchCore.js#L232-L240
                const key = `/1/indexes/*/queries_body_${JSON.stringify({
                    requests: results.rawResults.map((request)=>({
                            indexName: request.index,
                            params: request.params
                        }))
                })}`;
                client.cache = {
                    ...client.cache,
                    [key]: JSON.stringify({
                        results: results.rawResults
                    })
                };
            }(client, results);
        }
    }(searchClient, resultsState);
    const store = createStore({
        widgets: initialState,
        metadata: resultsState ? resultsState.metadata.map((datum)=>({
                value: ()=>({}),
                ...datum,
                items: datum.items && datum.items.map((item)=>({
                        value: ()=>({}),
                        ...item,
                        items: item.items && item.items.map((nestedItem)=>({
                                value: ()=>({}),
                                ...nestedItem
                            }))
                    }))
            })) : [],
        results: resultsState ? Array.isArray(resultsState.results) ? resultsState.results.reduce((acc, result)=>({
                ...acc,
                [result._internalIndexId]: new algoliasearchHelper.SearchResults(new algoliasearchHelper.SearchParameters(result.state), result.rawResults)
            }), {}) : new algoliasearchHelper.SearchResults(new algoliasearchHelper.SearchParameters(resultsState.state), resultsState.rawResults) : null,
        error: null,
        searching: !1,
        isSearchStalled: !0,
        searchingForFacetValues: !1
    });
    function getMetadata(state) {
        return widgetsManager.getWidgets().filter((widget)=>!!widget.getMetadata).map((widget)=>widget.getMetadata(state));
    }
    function getSearchParameters() {
        const sharedParameters = widgetsManager.getWidgets().filter((widget)=>!!widget.getSearchParameters).filter((widget)=>!isMultiIndexContext(widget) && !isIndexWidget(widget)).reduce((res, widget)=>widget.getSearchParameters(res), initialSearchParameters), mainParameters = widgetsManager.getWidgets().filter((widget)=>!!widget.getSearchParameters).filter((widget)=>{
            const targetedIndexEqualMainIndex = isMultiIndexContext(widget) && isTargetedIndexEqualIndex(widget, indexName), subIndexEqualMainIndex = isIndexWidget(widget) && isIndexWidgetEqualIndex(widget, indexName);
            return targetedIndexEqualMainIndex || subIndexEqualMainIndex;
        })// We have to sort the `Index` widgets first so the `index` parameter
        // is correctly set in the `reduce` function for the following widgets
        .sort(sortIndexWidgetsFirst).reduce((res, widget)=>widget.getSearchParameters(res), sharedParameters), derivedIndices = widgetsManager.getWidgets().filter((widget)=>!!widget.getSearchParameters).filter((widget)=>{
            const targetedIndexNotEqualMainIndex = isMultiIndexContext(widget) && !isTargetedIndexEqualIndex(widget, indexName), subIndexNotEqualMainIndex = isIndexWidget(widget) && !isIndexWidgetEqualIndex(widget, indexName);
            return targetedIndexNotEqualMainIndex || subIndexNotEqualMainIndex;
        })// We have to sort the `Index` widgets first so the `index` parameter
        // is correctly set in the `reduce` function for the following widgets
        .sort(sortIndexWidgetsFirst).reduce((indices, widget)=>{
            const indexId = isMultiIndexContext(widget) ? widget.props.indexContextValue.targetedIndex : widget.props.indexId, widgets = indices[indexId] || [];
            return {
                ...indices,
                [indexId]: widgets.concat(widget)
            };
        }, {});
        return {
            mainParameters,
            derivedParameters: Object.keys(derivedIndices).map((indexId)=>({
                    parameters: derivedIndices[indexId].reduce((res, widget)=>widget.getSearchParameters(res), sharedParameters),
                    indexId
                }))
        };
    }
    function search() {
        if (!skip) {
            const { mainParameters, derivedParameters } = getSearchParameters(helper.state);
            // We have to call `slice` because the method `detach` on the derived
            // helpers mutates the value `derivedHelpers`. The `forEach` loop does
            // not iterate on each value and we're not able to correctly clear the
            // previous derived helpers (memory leak + useless requests).
            helper.derivedHelpers.slice().forEach((derivedHelper)=>{
                // Since we detach the derived helpers on **every** new search they
                // won't receive intermediate results in case of a stalled search.
                // Only the last result is dispatched by the derived helper because
                // they are not detached yet:
                //
                // - a -> main helper receives results
                // - ap -> main helper receives results
                // - app -> main helper + derived helpers receive results
                //
                // The quick fix is to avoid to detach them on search but only once they
                // received the results. But it means that in case of a stalled search
                // all the derived helpers not detached yet register a new search inside
                // the helper. The number grows fast in case of a bad network and it's
                // not deterministic.
                derivedHelper.detach();
            }), derivedParameters.forEach(({ indexId, parameters })=>{
                helper.derive(()=>parameters).on("result", handleSearchSuccess({
                    indexId
                })).on("error", handleSearchError);
            }), helper.setState(mainParameters), helper.search();
        }
    }
    function handleSearchSuccess({ indexId }) {
        return (event)=>{
            const state = store.getState(), isDerivedHelpersEmpty = !helper.derivedHelpers.length;
            let results = state.results ? state.results : {};
            // Switching from mono index to multi index and vice versa must reset the
            // results to an empty object, otherwise we keep reference of stalled and
            // unused results.
            results = !isDerivedHelpersEmpty && results.getFacetByName ? {} : results, results = isDerivedHelpersEmpty ? event.results : {
                ...results,
                [indexId]: event.results
            };
            const currentState = store.getState();
            let nextIsSearchStalled = currentState.isSearchStalled;
            helper.hasPendingRequests() || (clearTimeout(stalledSearchTimer), stalledSearchTimer = null, nextIsSearchStalled = !1);
            const { resultsFacetValues, ...partialState } = currentState;
            store.setState({
                ...partialState,
                results,
                isSearchStalled: nextIsSearchStalled,
                searching: !1,
                error: null
            });
        };
    }
    function handleSearchError({ error }) {
        const currentState = store.getState();
        let nextIsSearchStalled = currentState.isSearchStalled;
        helper.hasPendingRequests() || (clearTimeout(stalledSearchTimer), nextIsSearchStalled = !1);
        const { resultsFacetValues, ...partialState } = currentState;
        store.setState({
            ...partialState,
            isSearchStalled: nextIsSearchStalled,
            error,
            searching: !1
        });
    }
    return {
        store,
        widgetsManager,
        getWidgetsIds: function() {
            return store.getState().metadata.reduce((res, meta)=>void 0 !== meta.id ? res.concat(meta.id) : res, []);
        },
        getSearchParameters,
        onSearchForFacetValues: function({ facetName, query, maxFacetHits = 10 }) {
            // The values 1, 100 are the min / max values that the engine accepts.
            // see: https://www.algolia.com/doc/api-reference/api-parameters/maxFacetHits
            const maxFacetHitsWithinRange = Math.max(1, Math.min(maxFacetHits, 100));
            store.setState({
                ...store.getState(),
                searchingForFacetValues: !0
            }), helper.searchForFacetValues(facetName, query, maxFacetHitsWithinRange).then((content)=>{
                store.setState({
                    ...store.getState(),
                    error: null,
                    searchingForFacetValues: !1,
                    resultsFacetValues: {
                        ...store.getState().resultsFacetValues,
                        [facetName]: content.facetHits,
                        query
                    }
                });
            }, (error)=>{
                store.setState({
                    ...store.getState(),
                    searchingForFacetValues: !1,
                    error
                });
            }).catch((error)=>{
                // Since setState is synchronous, any error that occurs in the render of a
                // component will be swallowed by this promise.
                // This is a trick to make the error show up correctly in the console.
                // See http://stackoverflow.com/a/30741722/969302
                setTimeout(()=>{
                    throw error;
                });
            });
        },
        onExternalStateUpdate: function(nextSearchState) {
            const metadata = getMetadata(nextSearchState);
            store.setState({
                ...store.getState(),
                widgets: nextSearchState,
                metadata,
                searching: !0
            }), search();
        },
        transitionState: function(nextSearchState) {
            const searchState = store.getState().widgets;
            return widgetsManager.getWidgets().filter((widget)=>!!widget.transitionState).reduce((res, widget)=>widget.transitionState(searchState, res), nextSearchState);
        },
        updateClient: function(client) {
            addAlgoliaAgents(client), helper.setClient(client), search();
        },
        updateIndex: function(newIndex) {
            initialSearchParameters = initialSearchParameters.setIndex(newIndex);
        // No need to trigger a new search here as the widgets will also update and trigger it if needed.
        },
        clearCache: function() {
            helper.clearCache(), search();
        },
        skipSearch: function() {
            skip = !0;
        }
    };
}
