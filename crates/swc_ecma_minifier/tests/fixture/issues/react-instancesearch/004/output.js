import * as swcHelpers from "@swc/helpers";
import algoliasearchHelper from "algoliasearch-helper";
import createWidgetsManager from "./createWidgetsManager";
import { HIGHLIGHT_TAGS } from "./highlight";
import { hasMultipleIndices } from "./indexUtils";
import { version as ReactVersion } from "react";
import version from "./version";
function addAlgoliaAgents(searchClient) {
    "function" == typeof searchClient.addAlgoliaAgent && (searchClient.addAlgoliaAgent("react (".concat(ReactVersion, ")")), searchClient.addAlgoliaAgent("react-instantsearch (".concat(version, ")")));
}
var _obj, isMultiIndexContext = function(widget) {
    return hasMultipleIndices({
        ais: widget.props.contextValue,
        multiIndexContext: widget.props.indexContextValue
    });
}, isTargetedIndexEqualIndex = function(widget, indexId) {
    return widget.props.indexContextValue.targetedIndex === indexId;
}, isIndexWidget = function(widget) {
    return Boolean(widget.props.indexId);
}, isIndexWidgetEqualIndex = function(widget, indexId) {
    return widget.props.indexId === indexId;
}, sortIndexWidgetsFirst = function(firstWidget, secondWidget) {
    var isFirstWidgetIndex = isIndexWidget(firstWidget), isSecondWidgetIndex = isIndexWidget(secondWidget);
    return isFirstWidgetIndex && !isSecondWidgetIndex ? -1 : !isFirstWidgetIndex && isSecondWidgetIndex ? 1 : 0;
};
export default function createInstantSearchManager(param1) {
    var indexName = param1.indexName, _initialState = param1.initialState, searchClient = param1.searchClient, resultsState = param1.resultsState, stalledSearchDelay = param1.stalledSearchDelay, getMetadata = function(state) {
        return widgetsManager.getWidgets().filter(function(widget) {
            return Boolean(widget.getMetadata);
        }).map(function(widget) {
            return widget.getMetadata(state);
        });
    }, getSearchParameters = function() {
        var sharedParameters = widgetsManager.getWidgets().filter(function(widget) {
            return Boolean(widget.getSearchParameters);
        }).filter(function(widget) {
            return !isMultiIndexContext(widget) && !isIndexWidget(widget);
        }).reduce(function(res, widget) {
            return widget.getSearchParameters(res);
        }, initialSearchParameters), mainParameters = widgetsManager.getWidgets().filter(function(widget) {
            return Boolean(widget.getSearchParameters);
        }).filter(function(widget) {
            var targetedIndexEqualMainIndex = isMultiIndexContext(widget) && isTargetedIndexEqualIndex(widget, indexName), subIndexEqualMainIndex = isIndexWidget(widget) && isIndexWidgetEqualIndex(widget, indexName);
            return targetedIndexEqualMainIndex || subIndexEqualMainIndex;
        }).sort(sortIndexWidgetsFirst).reduce(function(res, widget) {
            return widget.getSearchParameters(res);
        }, sharedParameters), derivedIndices = widgetsManager.getWidgets().filter(function(widget) {
            return Boolean(widget.getSearchParameters);
        }).filter(function(widget) {
            var targetedIndexNotEqualMainIndex = isMultiIndexContext(widget) && !isTargetedIndexEqualIndex(widget, indexName), subIndexNotEqualMainIndex = isIndexWidget(widget) && !isIndexWidgetEqualIndex(widget, indexName);
            return targetedIndexNotEqualMainIndex || subIndexNotEqualMainIndex;
        }).sort(sortIndexWidgetsFirst).reduce(function(indices, widget) {
            var indexId = isMultiIndexContext(widget) ? widget.props.indexContextValue.targetedIndex : widget.props.indexId, widgets = indices[indexId] || [];
            return swcHelpers.objectSpread({}, indices, swcHelpers.defineProperty({}, indexId, widgets.concat(widget)));
        }, {}), derivedParameters = Object.keys(derivedIndices).map(function(indexId) {
            return {
                parameters: derivedIndices[indexId].reduce(function(res, widget) {
                    return widget.getSearchParameters(res);
                }, sharedParameters),
                indexId: indexId
            };
        });
        return {
            mainParameters: mainParameters,
            derivedParameters: derivedParameters
        };
    }, search = function() {
        if (!skip) {
            var ref = getSearchParameters(helper.state), mainParameters = ref.mainParameters, derivedParameters = ref.derivedParameters;
            helper.derivedHelpers.slice().forEach(function(derivedHelper) {
                derivedHelper.detach();
            }), derivedParameters.forEach(function(param) {
                var indexId = param.indexId, parameters = param.parameters, derivedHelper = helper.derive(function() {
                    return parameters;
                });
                derivedHelper.on("result", handleSearchSuccess({
                    indexId: indexId
                })).on("error", handleSearchError);
            }), helper.setState(mainParameters), helper.search();
        }
    }, handleSearchSuccess = function(param) {
        var indexId = param.indexId;
        return function(event) {
            var state = store.getState(), isDerivedHelpersEmpty = !helper.derivedHelpers.length, results = state.results ? state.results : {};
            results = !isDerivedHelpersEmpty && results.getFacetByName ? {} : results, results = isDerivedHelpersEmpty ? event.results : swcHelpers.objectSpread({}, results, swcHelpers.defineProperty({}, indexId, event.results));
            var currentState = store.getState(), nextIsSearchStalled = currentState.isSearchStalled;
            helper.hasPendingRequests() || (clearTimeout(stalledSearchTimer), stalledSearchTimer = null, nextIsSearchStalled = !1), currentState.resultsFacetValues;
            var partialState = swcHelpers.objectWithoutProperties(currentState, [
                "resultsFacetValues"
            ]);
            store.setState(swcHelpers.objectSpread({}, partialState, {
                results: results,
                isSearchStalled: nextIsSearchStalled,
                searching: !1,
                error: null
            }));
        };
    }, handleSearchError = function(param) {
        var error = param.error, currentState = store.getState(), nextIsSearchStalled = currentState.isSearchStalled;
        helper.hasPendingRequests() || (clearTimeout(stalledSearchTimer), nextIsSearchStalled = !1), currentState.resultsFacetValues;
        var partialState = swcHelpers.objectWithoutProperties(currentState, [
            "resultsFacetValues", 
        ]);
        store.setState(swcHelpers.objectSpread({}, partialState, {
            isSearchStalled: nextIsSearchStalled,
            error: error,
            searching: !1
        }));
    }, hydrateSearchClientWithMultiIndexRequest = function(client, results) {
        if (client.transporter) {
            client.transporter.responsesCache.set({
                method: "search",
                args: [
                    results.reduce(function(acc, result) {
                        return acc.concat(result.rawResults.map(function(request) {
                            return {
                                indexName: request.index,
                                params: request.params
                            };
                        }));
                    }, []), 
                ]
            }, {
                results: results.reduce(function(acc, result) {
                    return acc.concat(result.rawResults);
                }, [])
            });
            return;
        }
        var key = "/1/indexes/*/queries_body_".concat(JSON.stringify({
            requests: results.reduce(function(acc, result) {
                return acc.concat(result.rawResults.map(function(request) {
                    return {
                        indexName: request.index,
                        params: request.params
                    };
                }));
            }, [])
        }));
        client.cache = swcHelpers.objectSpread({}, client.cache, swcHelpers.defineProperty({}, key, JSON.stringify({
            results: results.reduce(function(acc, result) {
                return acc.concat(result.rawResults);
            }, [])
        })));
    }, hydrateSearchClientWithSingleIndexRequest = function(client, results) {
        if (client.transporter) {
            client.transporter.responsesCache.set({
                method: "search",
                args: [
                    results.rawResults.map(function(request) {
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
        var key = "/1/indexes/*/queries_body_".concat(JSON.stringify({
            requests: results.rawResults.map(function(request) {
                return {
                    indexName: request.index,
                    params: request.params
                };
            })
        }));
        client.cache = swcHelpers.objectSpread({}, client.cache, swcHelpers.defineProperty({}, key, JSON.stringify({
            results: results.rawResults
        })));
    }, helper = algoliasearchHelper(searchClient, indexName, swcHelpers.objectSpread({}, HIGHLIGHT_TAGS));
    addAlgoliaAgents(searchClient), helper.on("search", function() {
        stalledSearchTimer || (stalledSearchTimer = setTimeout(function() {
            var _ref = store.getState(), partialState = (_ref.resultsFacetValues, swcHelpers.objectWithoutProperties(_ref, [
                "resultsFacetValues", 
            ]));
            store.setState(swcHelpers.objectSpread({}, partialState, {
                isSearchStalled: !0
            }));
        }, stalledSearchDelay));
    }).on("result", handleSearchSuccess({
        indexId: indexName
    })).on("error", handleSearchError);
    var results1, state1, listeners, skip = !1, stalledSearchTimer = null, initialSearchParameters = helper.state, widgetsManager = createWidgetsManager(function() {
        var metadata = getMetadata(store.getState().widgets);
        store.setState(swcHelpers.objectSpread({}, store.getState(), {
            metadata: metadata,
            searching: !0
        })), search();
    });
    !function(client, results) {
        if (results && (client.transporter && !client._cacheHydrated || client._useCache && "function" == typeof client.addAlgoliaAgent)) {
            if (client.transporter && !client._cacheHydrated) {
                client._cacheHydrated = !0;
                var baseMethod = client.search;
                client.search = function(requests) {
                    for(var _len1 = arguments.length, methodArgs = Array(_len1 > 1 ? _len1 - 1 : 0), _key1 = 1; _key1 < _len1; _key1++)methodArgs[_key1 - 1] = arguments[_key1];
                    var requestsWithSerializedParams = requests.map(function(request) {
                        var parameters, encode;
                        return swcHelpers.objectSpread({}, request, {
                            params: (parameters = request.params, encode = function(format) {
                                for(var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++)args[_key - 1] = arguments[_key];
                                var i = 0;
                                return format.replace(/%s/g, function() {
                                    return encodeURIComponent(args[i++]);
                                });
                            }, Object.keys(parameters).map(function(key) {
                                var value;
                                return encode("%s=%s", key, (value = parameters[key], "[object Object]" === Object.prototype.toString.call(value) || "[object Array]" === Object.prototype.toString.call(value)) ? JSON.stringify(parameters[key]) : parameters[key]);
                            }).join("&"))
                        });
                    });
                    return client.transporter.responsesCache.get({
                        method: "search",
                        args: [
                            requestsWithSerializedParams
                        ].concat(swcHelpers.toConsumableArray(methodArgs))
                    }, function() {
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
        }
    }(searchClient, resultsState);
    var store = (state1 = {
        widgets: void 0 === _initialState ? {} : _initialState,
        metadata: hydrateMetadata(resultsState),
        results: (results1 = resultsState) ? Array.isArray(results1.results) ? results1.results.reduce(function(acc, result) {
            return swcHelpers.objectSpread({}, acc, swcHelpers.defineProperty({}, result._internalIndexId, new algoliasearchHelper.SearchResults(new algoliasearchHelper.SearchParameters(result.state), result.rawResults)));
        }, {}) : new algoliasearchHelper.SearchResults(new algoliasearchHelper.SearchParameters(results1.state), results1.rawResults) : null,
        error: null,
        searching: !1,
        isSearchStalled: !0,
        searchingForFacetValues: !1
    }, listeners = [], {
        getState: function() {
            return state1;
        },
        setState: function(nextState) {
            state1 = nextState, listeners.forEach(function(listener) {
                return listener();
            });
        },
        subscribe: function(listener) {
            return listeners.push(listener), function() {
                listeners.splice(listeners.indexOf(listener), 1);
            };
        }
    });
    return {
        store: store,
        widgetsManager: widgetsManager,
        getWidgetsIds: function() {
            return store.getState().metadata.reduce(function(res, meta) {
                return void 0 !== meta.id ? res.concat(meta.id) : res;
            }, []);
        },
        getSearchParameters: getSearchParameters,
        onSearchForFacetValues: function(param) {
            var facetName = param.facetName, query = param.query, _maxFacetHits = param.maxFacetHits;
            store.setState(swcHelpers.objectSpread({}, store.getState(), {
                searchingForFacetValues: !0
            })), helper.searchForFacetValues(facetName, query, Math.max(1, Math.min(void 0 === _maxFacetHits ? 10 : _maxFacetHits, 100))).then(function(content) {
                store.setState(swcHelpers.objectSpread({}, store.getState(), {
                    error: null,
                    searchingForFacetValues: !1,
                    resultsFacetValues: swcHelpers.objectSpread({}, store.getState().resultsFacetValues, (_obj = {}, swcHelpers.defineProperty(_obj, facetName, content.facetHits), swcHelpers.defineProperty(_obj, "query", query), _obj))
                }));
            }, function(error) {
                store.setState(swcHelpers.objectSpread({}, store.getState(), {
                    searchingForFacetValues: !1,
                    error: error
                }));
            }).catch(function(error) {
                setTimeout(function() {
                    throw error;
                });
            });
        },
        onExternalStateUpdate: function(nextSearchState) {
            var metadata = getMetadata(nextSearchState);
            store.setState(swcHelpers.objectSpread({}, store.getState(), {
                widgets: nextSearchState,
                metadata: metadata,
                searching: !0
            })), search();
        },
        transitionState: function(nextSearchState) {
            var searchState = store.getState().widgets;
            return widgetsManager.getWidgets().filter(function(widget) {
                return Boolean(widget.transitionState);
            }).reduce(function(res, widget) {
                return widget.transitionState(searchState, res);
            }, nextSearchState);
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
    return resultsState ? resultsState.metadata.map(function(datum) {
        return swcHelpers.objectSpread({
            value: function() {
                return {};
            }
        }, datum, {
            items: datum.items && datum.items.map(function(item) {
                return swcHelpers.objectSpread({
                    value: function() {
                        return {};
                    }
                }, item, {
                    items: item.items && item.items.map(function(nestedItem) {
                        return swcHelpers.objectSpread({
                            value: function() {
                                return {};
                            }
                        }, nestedItem);
                    })
                });
            })
        });
    }) : [];
}
