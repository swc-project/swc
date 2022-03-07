import algoliasearchHelper from "algoliasearch-helper";
import createWidgetsManager from "./createWidgetsManager";
import createStore from "./createStore";
import { HIGHLIGHT_TAGS } from "./highlight";
import { hasMultipleIndices } from "./indexUtils";
import { version as ReactVersion } from "react";
import version from "./version";
function addAlgoliaAgents(searchClient) {
    "function" == typeof searchClient.addAlgoliaAgent && (searchClient.addAlgoliaAgent(`react (${ReactVersion})`), searchClient.addAlgoliaAgent(`react-instantsearch (${version})`));
}
const isMultiIndexContext = (widget)=>hasMultipleIndices({
        ais: widget.props.contextValue,
        multiIndexContext: widget.props.indexContextValue
    })
, isTargetedIndexEqualIndex = (widget, indexId)=>widget.props.indexContextValue.targetedIndex === indexId
, isIndexWidget = (widget)=>Boolean(widget.props.indexId)
, isIndexWidgetEqualIndex = (widget, indexId)=>widget.props.indexId === indexId
, sortIndexWidgetsFirst = (firstWidget, secondWidget)=>{
    const isFirstWidgetIndex = isIndexWidget(firstWidget), isSecondWidgetIndex = isIndexWidget(secondWidget);
    return isFirstWidgetIndex && !isSecondWidgetIndex ? -1 : !isFirstWidgetIndex && isSecondWidgetIndex ? 1 : 0;
};
export default function createInstantSearchManager({ indexName , initialState ={} , searchClient , resultsState , stalledSearchDelay ,  }) {
    var results1;
    const helper = algoliasearchHelper(searchClient, indexName, {
        ...HIGHLIGHT_TAGS
    });
    addAlgoliaAgents(searchClient), helper.on("search", function() {
        stalledSearchTimer || (stalledSearchTimer = setTimeout(()=>{
            const { resultsFacetValues , ...partialState } = store.getState();
            store.setState({
                ...partialState,
                isSearchStalled: !0
            });
        }, stalledSearchDelay));
    }).on("result", handleSearchSuccess({
        indexId: indexName
    })).on("error", handleSearchError);
    let skip = !1, stalledSearchTimer = null, initialSearchParameters = helper.state;
    const widgetsManager = createWidgetsManager(function() {
        const metadata = getMetadata(store.getState().widgets);
        store.setState({
            ...store.getState(),
            metadata,
            searching: !0
        }), search();
    });
    !function(client, results) {
        if (results && (client.transporter && !client._cacheHydrated || client._useCache && "function" == typeof client.addAlgoliaAgent)) {
            if (client.transporter && !client._cacheHydrated) {
                client._cacheHydrated = !0;
                const baseMethod = client.search;
                client.search = (requests, ...methodArgs)=>{
                    const requestsWithSerializedParams = requests.map((request)=>({
                            ...request,
                            params: function(parameters) {
                                const isObjectOrArray = (value)=>"[object Object]" === Object.prototype.toString.call(value) || "[object Array]" === Object.prototype.toString.call(value)
                                , encode = (format, ...args)=>{
                                    let i = 0;
                                    return format.replace(/%s/g, ()=>encodeURIComponent(args[i++])
                                    );
                                };
                                return Object.keys(parameters).map((key)=>encode("%s=%s", key, isObjectOrArray(parameters[key]) ? JSON.stringify(parameters[key]) : parameters[key])
                                ).join("&");
                            }(request.params)
                        })
                    );
                    return client.transporter.responsesCache.get({
                        method: "search",
                        args: [
                            requestsWithSerializedParams,
                            ...methodArgs
                        ]
                    }, ()=>baseMethod(requests, ...methodArgs)
                    );
                };
            }
            if (Array.isArray(results.results)) {
                hydrateSearchClientWithMultiIndexRequest(client, results.results);
                return;
            }
            hydrateSearchClientWithSingleIndexRequest(client, results);
        }
    }(searchClient, resultsState);
    const store = createStore({
        widgets: initialState,
        metadata: hydrateMetadata(resultsState),
        results: (results1 = resultsState) ? Array.isArray(results1.results) ? results1.results.reduce((acc, result)=>({
                ...acc,
                [result._internalIndexId]: new algoliasearchHelper.SearchResults(new algoliasearchHelper.SearchParameters(result.state), result.rawResults)
            })
        , {}) : new algoliasearchHelper.SearchResults(new algoliasearchHelper.SearchParameters(results1.state), results1.rawResults) : null,
        error: null,
        searching: !1,
        isSearchStalled: !0,
        searchingForFacetValues: !1
    });
    function getMetadata(state) {
        return widgetsManager.getWidgets().filter((widget)=>Boolean(widget.getMetadata)
        ).map((widget)=>widget.getMetadata(state)
        );
    }
    function getSearchParameters() {
        const sharedParameters = widgetsManager.getWidgets().filter((widget)=>Boolean(widget.getSearchParameters)
        ).filter((widget)=>!isMultiIndexContext(widget) && !isIndexWidget(widget)
        ).reduce((res, widget)=>widget.getSearchParameters(res)
        , initialSearchParameters), mainParameters = widgetsManager.getWidgets().filter((widget)=>Boolean(widget.getSearchParameters)
        ).filter((widget)=>{
            const targetedIndexEqualMainIndex = isMultiIndexContext(widget) && isTargetedIndexEqualIndex(widget, indexName), subIndexEqualMainIndex = isIndexWidget(widget) && isIndexWidgetEqualIndex(widget, indexName);
            return targetedIndexEqualMainIndex || subIndexEqualMainIndex;
        }).sort(sortIndexWidgetsFirst).reduce((res, widget)=>widget.getSearchParameters(res)
        , sharedParameters), derivedIndices = widgetsManager.getWidgets().filter((widget)=>Boolean(widget.getSearchParameters)
        ).filter((widget)=>{
            const targetedIndexNotEqualMainIndex = isMultiIndexContext(widget) && !isTargetedIndexEqualIndex(widget, indexName), subIndexNotEqualMainIndex = isIndexWidget(widget) && !isIndexWidgetEqualIndex(widget, indexName);
            return targetedIndexNotEqualMainIndex || subIndexNotEqualMainIndex;
        }).sort(sortIndexWidgetsFirst).reduce((indices, widget)=>{
            const indexId = isMultiIndexContext(widget) ? widget.props.indexContextValue.targetedIndex : widget.props.indexId, widgets = indices[indexId] || [];
            return {
                ...indices,
                [indexId]: widgets.concat(widget)
            };
        }, {}), derivedParameters = Object.keys(derivedIndices).map((indexId)=>({
                parameters: derivedIndices[indexId].reduce((res, widget)=>widget.getSearchParameters(res)
                , sharedParameters),
                indexId
            })
        );
        return {
            mainParameters,
            derivedParameters
        };
    }
    function search() {
        if (!skip) {
            const { mainParameters , derivedParameters  } = getSearchParameters(helper.state);
            helper.derivedHelpers.slice().forEach((derivedHelper)=>{
                derivedHelper.detach();
            }), derivedParameters.forEach(({ indexId , parameters  })=>{
                const derivedHelper = helper.derive(()=>parameters
                );
                derivedHelper.on("result", handleSearchSuccess({
                    indexId
                })).on("error", handleSearchError);
            }), helper.setState(mainParameters), helper.search();
        }
    }
    function handleSearchSuccess({ indexId  }) {
        return (event)=>{
            const state = store.getState(), isDerivedHelpersEmpty = !helper.derivedHelpers.length;
            let results = state.results ? state.results : {};
            results = !isDerivedHelpersEmpty && results.getFacetByName ? {} : results, results = isDerivedHelpersEmpty ? event.results : {
                ...results,
                [indexId]: event.results
            };
            const currentState = store.getState();
            let nextIsSearchStalled = currentState.isSearchStalled;
            helper.hasPendingRequests() || (clearTimeout(stalledSearchTimer), stalledSearchTimer = null, nextIsSearchStalled = !1);
            const { resultsFacetValues , ...partialState } = currentState;
            store.setState({
                ...partialState,
                results,
                isSearchStalled: nextIsSearchStalled,
                searching: !1,
                error: null
            });
        };
    }
    function handleSearchError({ error  }) {
        const currentState = store.getState();
        let nextIsSearchStalled = currentState.isSearchStalled;
        helper.hasPendingRequests() || (clearTimeout(stalledSearchTimer), nextIsSearchStalled = !1);
        const { resultsFacetValues , ...partialState } = currentState;
        store.setState({
            ...partialState,
            isSearchStalled: nextIsSearchStalled,
            error,
            searching: !1
        });
    }
    function hydrateSearchClientWithMultiIndexRequest(client, results) {
        if (client.transporter) {
            client.transporter.responsesCache.set({
                method: "search",
                args: [
                    results.reduce((acc, result)=>acc.concat(result.rawResults.map((request)=>({
                                indexName: request.index,
                                params: request.params
                            })
                        ))
                    , []), 
                ]
            }, {
                results: results.reduce((acc, result)=>acc.concat(result.rawResults)
                , [])
            });
            return;
        }
        const key = `/1/indexes/*/queries_body_${JSON.stringify({
            requests: results.reduce((acc, result)=>acc.concat(result.rawResults.map((request)=>({
                        indexName: request.index,
                        params: request.params
                    })
                ))
            , [])
        })}`;
        client.cache = {
            ...client.cache,
            [key]: JSON.stringify({
                results: results.reduce((acc, result)=>acc.concat(result.rawResults)
                , [])
            })
        };
    }
    function hydrateSearchClientWithSingleIndexRequest(client, results) {
        if (client.transporter) {
            client.transporter.responsesCache.set({
                method: "search",
                args: [
                    results.rawResults.map((request)=>({
                            indexName: request.index,
                            params: request.params
                        })
                    ), 
                ]
            }, {
                results: results.rawResults
            });
            return;
        }
        const key = `/1/indexes/*/queries_body_${JSON.stringify({
            requests: results.rawResults.map((request)=>({
                    indexName: request.index,
                    params: request.params
                })
            )
        })}`;
        client.cache = {
            ...client.cache,
            [key]: JSON.stringify({
                results: results.rawResults
            })
        };
    }
    return {
        store,
        widgetsManager,
        getWidgetsIds: function() {
            return store.getState().metadata.reduce((res, meta)=>void 0 !== meta.id ? res.concat(meta.id) : res
            , []);
        },
        getSearchParameters,
        onSearchForFacetValues: function({ facetName , query , maxFacetHits =10  }) {
            store.setState({
                ...store.getState(),
                searchingForFacetValues: !0
            }), helper.searchForFacetValues(facetName, query, Math.max(1, Math.min(maxFacetHits, 100))).then((content)=>{
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
            return widgetsManager.getWidgets().filter((widget)=>Boolean(widget.transitionState)
            ).reduce((res, widget)=>widget.transitionState(searchState, res)
            , nextSearchState);
        },
        updateClient: function(client) {
            addAlgoliaAgents(client), helper.setClient(client), search();
        },
        updateIndex: function(newIndex) {
            initialSearchParameters = initialSearchParameters.setIndex(newIndex);
        },
        clearCache: function() {
            helper.clearCache(), search();
        },
        skipSearch: function() {
            skip = !0;
        }
    };
};
function hydrateMetadata(resultsState) {
    return resultsState ? resultsState.metadata.map((datum)=>({
            value: ()=>({})
            ,
            ...datum,
            items: datum.items && datum.items.map((item)=>({
                    value: ()=>({})
                    ,
                    ...item,
                    items: item.items && item.items.map((nestedItem)=>({
                            value: ()=>({})
                            ,
                            ...nestedItem
                        })
                    )
                })
            )
        })
    ) : [];
}
