import * as swcHelpers from "@swc/helpers";
import algoliasearchHelper from 'algoliasearch-helper';
import createWidgetsManager from './createWidgetsManager';
import { HIGHLIGHT_TAGS } from './highlight';
import { hasMultipleIndices } from './indexUtils';
import { version as ReactVersion } from 'react';
import version from './version';
function addAlgoliaAgents(searchClient) {
    if (typeof searchClient.addAlgoliaAgent === 'function') {
        searchClient.addAlgoliaAgent("react (".concat(ReactVersion, ")"));
        searchClient.addAlgoliaAgent("react-instantsearch (".concat(version, ")"));
    }
}
var isMultiIndexContext = function (widget) {
    return hasMultipleIndices({
        ais: widget.props.contextValue,
        multiIndexContext: widget.props.indexContextValue
    });
};
var isTargetedIndexEqualIndex = function (widget, indexId) {
    return widget.props.indexContextValue.targetedIndex === indexId;
};
// Relying on the `indexId` is a bit brittle to detect the `Index` widget.
// Since it's a class we could rely on `instanceof` or similar. We never
// had an issue though. Works for now.
var isIndexWidget = function (widget) {
    return Boolean(widget.props.indexId);
};
var isIndexWidgetEqualIndex = function (widget, indexId) {
    return widget.props.indexId === indexId;
};
var sortIndexWidgetsFirst = function (firstWidget, secondWidget) {
    var isFirstWidgetIndex = isIndexWidget(firstWidget);
    var isSecondWidgetIndex = isIndexWidget(secondWidget);
    if (isFirstWidgetIndex && !isSecondWidgetIndex) {
        return -1;
    }
    if (!isFirstWidgetIndex && isSecondWidgetIndex) {
        return 1;
    }
    return 0;
};
// This function is copied from the algoliasearch v4 API Client. If modified,
// consider updating it also in `serializeQueryParameters` from `@algolia/transporter`.
function serializeQueryParameters(parameters) {
    var isObjectOrArray = function (value) {
        return Object.prototype.toString.call(value) === '[object Object]' || Object.prototype.toString.call(value) === '[object Array]';
    };
    var encode = function (format) {
        for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
            args[_key - 1] = arguments[_key];
        }
        var i = 0;
        return format.replace(/%s/g, function () {
            return encodeURIComponent(args[i++]);
        });
    };
    return Object.keys(parameters).map(function (key) {
        return encode('%s=%s', key, isObjectOrArray(parameters[key]) ? JSON.stringify(parameters[key]) : parameters[key]);
    }).join('&');
}
var _obj;
/**
 * Creates a new instance of the InstantSearchManager which controls the widgets and
 * trigger the search when the widgets are updated.
 * @param {string} indexName - the main index name
 * @param {object} initialState - initial widget state
 * @param {object} SearchParameters - optional additional parameters to send to the algolia API
 * @param {number} stalledSearchDelay - time (in ms) after the search is stalled
 * @return {InstantSearchManager} a new instance of InstantSearchManager
 */ export default function createInstantSearchManager(param) {
    var indexName = param.indexName, _initialState = param.initialState, initialState = _initialState === void 0 ? {
    } : _initialState, searchClient = param.searchClient, resultsState = param.resultsState, stalledSearchDelay = param.stalledSearchDelay;
    var createStore = function createStore(initialState) {
        var state = initialState;
        var listeners = [];
        return {
            getState: function () {
                return state;
            },
            setState: function (nextState) {
                state = nextState;
                listeners.forEach(function (listener) {
                    return listener();
                });
            },
            subscribe: function (listener) {
                listeners.push(listener);
                return function unsubscribe() {
                    listeners.splice(listeners.indexOf(listener), 1);
                };
            }
        };
    };
    var skipSearch = function skipSearch() {
        skip = true;
    };
    var updateClient = function updateClient(client) {
        addAlgoliaAgents(client);
        helper.setClient(client);
        search();
    };
    var clearCache = function clearCache() {
        helper.clearCache();
        search();
    };
    var getMetadata = function getMetadata(state) {
        return widgetsManager.getWidgets().filter(function (widget) {
            return Boolean(widget.getMetadata);
        }).map(function (widget) {
            return widget.getMetadata(state);
        });
    };
    var getSearchParameters = function getSearchParameters() {
        var sharedParameters = widgetsManager.getWidgets().filter(function (widget) {
            return Boolean(widget.getSearchParameters);
        }).filter(function (widget) {
            return !isMultiIndexContext(widget) && !isIndexWidget(widget);
        }).reduce(function (res, widget) {
            return widget.getSearchParameters(res);
        }, initialSearchParameters);
        var mainParameters = widgetsManager.getWidgets().filter(function (widget) {
            return Boolean(widget.getSearchParameters);
        }).filter(function (widget) {
            var targetedIndexEqualMainIndex = isMultiIndexContext(widget) && isTargetedIndexEqualIndex(widget, indexName);
            var subIndexEqualMainIndex = isIndexWidget(widget) && isIndexWidgetEqualIndex(widget, indexName);
            return targetedIndexEqualMainIndex || subIndexEqualMainIndex;
        })// We have to sort the `Index` widgets first so the `index` parameter
            // is correctly set in the `reduce` function for the following widgets
            .sort(sortIndexWidgetsFirst).reduce(function (res, widget) {
                return widget.getSearchParameters(res);
            }, sharedParameters);
        var derivedIndices = widgetsManager.getWidgets().filter(function (widget) {
            return Boolean(widget.getSearchParameters);
        }).filter(function (widget) {
            var targetedIndexNotEqualMainIndex = isMultiIndexContext(widget) && !isTargetedIndexEqualIndex(widget, indexName);
            var subIndexNotEqualMainIndex = isIndexWidget(widget) && !isIndexWidgetEqualIndex(widget, indexName);
            return targetedIndexNotEqualMainIndex || subIndexNotEqualMainIndex;
        })// We have to sort the `Index` widgets first so the `index` parameter
            // is correctly set in the `reduce` function for the following widgets
            .sort(sortIndexWidgetsFirst).reduce(function (indices, widget) {
                var indexId = isMultiIndexContext(widget) ? widget.props.indexContextValue.targetedIndex : widget.props.indexId;
                var widgets = indices[indexId] || [];
                return swcHelpers.objectSpread({
                }, indices, swcHelpers.defineProperty({
                }, indexId, widgets.concat(widget)));
            }, {
            });
        var derivedParameters = Object.keys(derivedIndices).map(function (indexId) {
            return {
                parameters: derivedIndices[indexId].reduce(function (res, widget) {
                    return widget.getSearchParameters(res);
                }, sharedParameters),
                indexId: indexId
            };
        });
        return {
            mainParameters: mainParameters,
            derivedParameters: derivedParameters
        };
    };
    var search = function search() {
        if (!skip) {
            var ref = getSearchParameters(helper.state), mainParameters = ref.mainParameters, derivedParameters = ref.derivedParameters;
            // We have to call `slice` because the method `detach` on the derived
            // helpers mutates the value `derivedHelpers`. The `forEach` loop does
            // not iterate on each value and we're not able to correctly clear the
            // previous derived helpers (memory leak + useless requests).
            helper.derivedHelpers.slice().forEach(function (derivedHelper) {
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
            });
            derivedParameters.forEach(function (param) {
                var indexId = param.indexId, parameters = param.parameters;
                var derivedHelper = helper.derive(function () {
                    return parameters;
                });
                derivedHelper.on('result', handleSearchSuccess({
                    indexId: indexId
                })).on('error', handleSearchError);
            });
            helper.setState(mainParameters);
            helper.search();
        }
    };
    var handleSearchSuccess = function handleSearchSuccess(param) {
        var indexId = param.indexId;
        return function (event) {
            var state = store.getState();
            var isDerivedHelpersEmpty = !helper.derivedHelpers.length;
            var results = state.results ? state.results : {
            };
            // Switching from mono index to multi index and vice versa must reset the
            // results to an empty object, otherwise we keep reference of stalled and
            // unused results.
            results = !isDerivedHelpersEmpty && results.getFacetByName ? {
            } : results;
            if (!isDerivedHelpersEmpty) {
                results = swcHelpers.objectSpread({
                }, results, swcHelpers.defineProperty({
                }, indexId, event.results));
            } else {
                results = event.results;
            }
            var currentState = store.getState();
            var nextIsSearchStalled = currentState.isSearchStalled;
            if (!helper.hasPendingRequests()) {
                clearTimeout(stalledSearchTimer);
                stalledSearchTimer = null;
                nextIsSearchStalled = false;
            }
            var resultsFacetValues = currentState.resultsFacetValues, partialState = swcHelpers.objectWithoutProperties(currentState, ["resultsFacetValues"]);
            store.setState(swcHelpers.objectSpread({
            }, partialState, {
                results: results,
                isSearchStalled: nextIsSearchStalled,
                searching: false,
                error: null
            }));
        };
    };
    var handleSearchError = function handleSearchError(param) {
        var error = param.error;
        var currentState = store.getState();
        var nextIsSearchStalled = currentState.isSearchStalled;
        if (!helper.hasPendingRequests()) {
            clearTimeout(stalledSearchTimer);
            nextIsSearchStalled = false;
        }
        var resultsFacetValues = currentState.resultsFacetValues, partialState = swcHelpers.objectWithoutProperties(currentState, ["resultsFacetValues"]);
        store.setState(swcHelpers.objectSpread({
        }, partialState, {
            isSearchStalled: nextIsSearchStalled,
            error: error,
            searching: false
        }));
    };
    var handleNewSearch = function handleNewSearch() {
        if (!stalledSearchTimer) {
            stalledSearchTimer = setTimeout(function () {
                var _ref = store.getState(), resultsFacetValues = _ref.resultsFacetValues, partialState = swcHelpers.objectWithoutProperties(_ref, ["resultsFacetValues"]);
                store.setState(swcHelpers.objectSpread({
                }, partialState, {
                    isSearchStalled: true
                }));
            }, stalledSearchDelay);
        }
    };
    var hydrateSearchClient = function hydrateSearchClient(client, results) {
        if (!results) {
            return;
        }
        // Disable cache hydration on:
        // - Algoliasearch API Client < v4 with cache disabled
        // - Third party clients (detected by the `addAlgoliaAgent` function missing)
        if ((!client.transporter || client._cacheHydrated) && (!client._useCache || typeof client.addAlgoliaAgent !== 'function')) {
            return;
        }
        // Algoliasearch API Client >= v4
        // To hydrate the client we need to populate the cache with the data from
        // the server (done in `hydrateSearchClientWithMultiIndexRequest` or
        // `hydrateSearchClientWithSingleIndexRequest`). But since there is no way
        // for us to compute the key the same way as `algoliasearch-client` we need
        // to populate it on a custom key and override the `search` method to
        // search on it first.
        if (client.transporter && !client._cacheHydrated) {
            client._cacheHydrated = true;
            var baseMethod = client.search;
            client.search = function (requests) {
                for (var _len = arguments.length, methodArgs = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
                    methodArgs[_key - 1] = arguments[_key];
                }
                var requestsWithSerializedParams = requests.map(function (request) {
                    return swcHelpers.objectSpread({
                    }, request, {
                        params: serializeQueryParameters(request.params)
                    });
                });
                return client.transporter.responsesCache.get({
                    method: 'search',
                    args: [
                        requestsWithSerializedParams
                    ].concat(swcHelpers.toConsumableArray(methodArgs))
                }, function () {
                    return baseMethod.apply(void 0, [
                        requests
                    ].concat(swcHelpers.toConsumableArray(methodArgs)));
                });
            };
        }
        if (Array.isArray(results.results)) {
            hydrateSearchClientWithMultiIndexRequest(client, results.results);
            return;
        }
        hydrateSearchClientWithSingleIndexRequest(client, results);
    };
    var hydrateSearchClientWithMultiIndexRequest = function hydrateSearchClientWithMultiIndexRequest(client, results) {
        // Algoliasearch API Client >= v4
        // Populate the cache with the data from the server
        if (client.transporter) {
            client.transporter.responsesCache.set({
                method: 'search',
                args: [
                    results.reduce(function (acc, result) {
                        return acc.concat(result.rawResults.map(function (request) {
                            return {
                                indexName: request.index,
                                params: request.params
                            };
                        }));
                    }, []),
                ]
            }, {
                results: results.reduce(function (acc, result) {
                    return acc.concat(result.rawResults);
                }, [])
            });
            return;
        }
        // Algoliasearch API Client < v4
        // Prior to client v4 we didn't have a proper API to hydrate the client
        // cache from the outside. The following code populates the cache with
        // a single-index result. You can find more information about the
        // computation of the key inside the client (see link below).
        // https://github.com/algolia/algoliasearch-client-javascript/blob/c27e89ff92b2a854ae6f40dc524bffe0f0cbc169/src/AlgoliaSearchCore.js#L232-L240
        var key = "/1/indexes/*/queries_body_".concat(JSON.stringify({
            requests: results.reduce(function (acc, result) {
                return acc.concat(result.rawResults.map(function (request) {
                    return {
                        indexName: request.index,
                        params: request.params
                    };
                }));
            }, [])
        }));
        client.cache = swcHelpers.objectSpread({
        }, client.cache, swcHelpers.defineProperty({
        }, key, JSON.stringify({
            results: results.reduce(function (acc, result) {
                return acc.concat(result.rawResults);
            }, [])
        })));
    };
    var hydrateSearchClientWithSingleIndexRequest = function hydrateSearchClientWithSingleIndexRequest(client, results) {
        // Algoliasearch API Client >= v4
        // Populate the cache with the data from the server
        if (client.transporter) {
            client.transporter.responsesCache.set({
                method: 'search',
                args: [
                    results.rawResults.map(function (request) {
                        return {
                            indexName: request.index,
                            params: request.params
                        };
                    }),
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
        var key = "/1/indexes/*/queries_body_".concat(JSON.stringify({
            requests: results.rawResults.map(function (request) {
                return {
                    indexName: request.index,
                    params: request.params
                };
            })
        }));
        client.cache = swcHelpers.objectSpread({
        }, client.cache, swcHelpers.defineProperty({
        }, key, JSON.stringify({
            results: results.rawResults
        })));
    };
    var hydrateResultsState = function hydrateResultsState(results) {
        if (!results) {
            return null;
        }
        if (Array.isArray(results.results)) {
            return results.results.reduce(function (acc, result) {
                return swcHelpers.objectSpread({
                }, acc, swcHelpers.defineProperty({
                }, result._internalIndexId, new algoliasearchHelper.SearchResults(new algoliasearchHelper.SearchParameters(result.state), result.rawResults)));
            }, {
            });
        }
        return new algoliasearchHelper.SearchResults(new algoliasearchHelper.SearchParameters(results.state), results.rawResults);
    };
    var onWidgetsUpdate = // Called whenever a widget has been rendered with new props.
        function onWidgetsUpdate() {
            var metadata = getMetadata(store.getState().widgets);
            store.setState(swcHelpers.objectSpread({
            }, store.getState(), {
                metadata: metadata,
                searching: true
            }));
            // Since the `getSearchParameters` method of widgets also depends on props,
            // the result search parameters might have changed.
            search();
        };
    var transitionState = function transitionState(nextSearchState) {
        var searchState = store.getState().widgets;
        return widgetsManager.getWidgets().filter(function (widget) {
            return Boolean(widget.transitionState);
        }).reduce(function (res, widget) {
            return widget.transitionState(searchState, res);
        }, nextSearchState);
    };
    var onExternalStateUpdate = function onExternalStateUpdate(nextSearchState) {
        var metadata = getMetadata(nextSearchState);
        store.setState(swcHelpers.objectSpread({
        }, store.getState(), {
            widgets: nextSearchState,
            metadata: metadata,
            searching: true
        }));
        search();
    };
    var onSearchForFacetValues = function onSearchForFacetValues(param) {
        var facetName = param.facetName, query = param.query, _maxFacetHits = param.maxFacetHits, maxFacetHits = _maxFacetHits === void 0 ? 10 : _maxFacetHits;
        // The values 1, 100 are the min / max values that the engine accepts.
        // see: https://www.algolia.com/doc/api-reference/api-parameters/maxFacetHits
        var maxFacetHitsWithinRange = Math.max(1, Math.min(maxFacetHits, 100));
        store.setState(swcHelpers.objectSpread({
        }, store.getState(), {
            searchingForFacetValues: true
        }));
        helper.searchForFacetValues(facetName, query, maxFacetHitsWithinRange).then(function (content) {
            store.setState(swcHelpers.objectSpread({
            }, store.getState(), {
                error: null,
                searchingForFacetValues: false,
                resultsFacetValues: swcHelpers.objectSpread({
                }, store.getState().resultsFacetValues, (_obj = {
                }, swcHelpers.defineProperty(_obj, facetName, content.facetHits), swcHelpers.defineProperty(_obj, "query", query), _obj))
            }));
        }, function (error) {
            store.setState(swcHelpers.objectSpread({
            }, store.getState(), {
                searchingForFacetValues: false,
                error: error
            }));
        }).catch(function (error) {
            // Since setState is synchronous, any error that occurs in the render of a
            // component will be swallowed by this promise.
            // This is a trick to make the error show up correctly in the console.
            // See http://stackoverflow.com/a/30741722/969302
            setTimeout(function () {
                throw error;
            });
        });
    };
    var updateIndex = function updateIndex(newIndex) {
        initialSearchParameters = initialSearchParameters.setIndex(newIndex);
        // No need to trigger a new search here as the widgets will also update and trigger it if needed.
    };
    var getWidgetsIds = function getWidgetsIds() {
        return store.getState().metadata.reduce(function (res, meta) {
            return typeof meta.id !== 'undefined' ? res.concat(meta.id) : res;
        }, []);
    };
    var helper = algoliasearchHelper(searchClient, indexName, swcHelpers.objectSpread({
    }, HIGHLIGHT_TAGS));
    addAlgoliaAgents(searchClient);
    helper.on('search', handleNewSearch).on('result', handleSearchSuccess({
        indexId: indexName
    })).on('error', handleSearchError);
    var skip = false;
    var stalledSearchTimer = null;
    var initialSearchParameters = helper.state;
    var widgetsManager = createWidgetsManager(onWidgetsUpdate);
    hydrateSearchClient(searchClient, resultsState);
    var store = createStore({
        widgets: initialState,
        metadata: hydrateMetadata(resultsState),
        results: hydrateResultsState(resultsState),
        error: null,
        searching: false,
        isSearchStalled: true,
        searchingForFacetValues: false
    });
    return {
        store: store,
        widgetsManager: widgetsManager,
        getWidgetsIds: getWidgetsIds,
        getSearchParameters: getSearchParameters,
        onSearchForFacetValues: onSearchForFacetValues,
        onExternalStateUpdate: onExternalStateUpdate,
        transitionState: transitionState,
        updateClient: updateClient,
        updateIndex: updateIndex,
        clearCache: clearCache,
        skipSearch: skipSearch
    };
};
function hydrateMetadata(resultsState) {
    if (!resultsState) {
        return [];
    }
    // add a value noop, which gets replaced once the widgets are mounted
    return resultsState.metadata.map(function (datum) {
        return swcHelpers.objectSpread({
            value: function () {
                return {
                };
            }
        }, datum, {
            items: datum.items && datum.items.map(function (item) {
                return swcHelpers.objectSpread({
                    value: function () {
                        return {
                        };
                    }
                }, item, {
                    items: item.items && item.items.map(function (nestedItem) {
                        return swcHelpers.objectSpread({
                            value: function () {
                                return {
                                };
                            }
                        }, nestedItem);
                    })
                });
            })
        });
    });
}
