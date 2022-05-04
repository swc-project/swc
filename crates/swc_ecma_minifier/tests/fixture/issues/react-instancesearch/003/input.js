import algoliasearchHelper from "algoliasearch-helper";
import createStore from "./createStore";
import { HIGHLIGHT_TAGS } from "./highlight";
import { hasMultipleIndices } from "./indexUtils";
import { version as ReactVersion } from "react";
import version from "./version";
import { defer } from "./utils";

function createWidgetsManager(onWidgetsUpdate) {
    const widgets = [];
    // Is an update scheduled?
    let scheduled = false;

    // The state manager's updates need to be batched since more than one
    // component can register or unregister widgets during the same tick.
    function scheduleUpdate() {
        if (scheduled) {
            return;
        }
        scheduled = true;
        defer(() => {
            scheduled = false;
            onWidgetsUpdate();
        });
    }

    return {
        registerWidget(widget) {
            widgets.push(widget);
            scheduleUpdate();
            return function unregisterWidget() {
                widgets.splice(widgets.indexOf(widget), 1);
                scheduleUpdate();
            };
        },
        update: scheduleUpdate,
        getWidgets() {
            return widgets;
        },
    };
}

function addAlgoliaAgents(searchClient) {
    if (typeof searchClient.addAlgoliaAgent === "function") {
        searchClient.addAlgoliaAgent(`react (${ReactVersion})`);
        searchClient.addAlgoliaAgent(`react-instantsearch (${version})`);
    }
}

const isMultiIndexContext = (widget) =>
    hasMultipleIndices({
        ais: widget.props.contextValue,
        multiIndexContext: widget.props.indexContextValue,
    });
const isTargetedIndexEqualIndex = (widget, indexId) =>
    widget.props.indexContextValue.targetedIndex === indexId;

// Relying on the `indexId` is a bit brittle to detect the `Index` widget.
// Since it's a class we could rely on `instanceof` or similar. We never
// had an issue though. Works for now.
const isIndexWidget = (widget) => Boolean(widget.props.indexId);
const isIndexWidgetEqualIndex = (widget, indexId) =>
    widget.props.indexId === indexId;

const sortIndexWidgetsFirst = (firstWidget, secondWidget) => {
    const isFirstWidgetIndex = isIndexWidget(firstWidget);
    const isSecondWidgetIndex = isIndexWidget(secondWidget);

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
    const isObjectOrArray = (value) =>
        Object.prototype.toString.call(value) === "[object Object]" ||
        Object.prototype.toString.call(value) === "[object Array]";

    const encode = (format, ...args) => {
        let i = 0;
        return format.replace(/%s/g, () => encodeURIComponent(args[i++]));
    };

    return Object.keys(parameters)
        .map((key) =>
            encode(
                "%s=%s",
                key,
                isObjectOrArray(parameters[key])
                    ? JSON.stringify(parameters[key])
                    : parameters[key]
            )
        )
        .join("&");
}

/**
 * Creates a new instance of the InstantSearchManager which controls the widgets and
 * trigger the search when the widgets are updated.
 * @param {string} indexName - the main index name
 * @param {object} initialState - initial widget state
 * @param {object} SearchParameters - optional additional parameters to send to the algolia API
 * @param {number} stalledSearchDelay - time (in ms) after the search is stalled
 * @return {InstantSearchManager} a new instance of InstantSearchManager
 */
export default function createInstantSearchManager({
    indexName,
    initialState = {},
    searchClient,
    resultsState,
    stalledSearchDelay,
}) {
    const helper = algoliasearchHelper(searchClient, indexName, {
        ...HIGHLIGHT_TAGS,
    });

    addAlgoliaAgents(searchClient);

    helper
        .on("search", handleNewSearch)
        .on("result", handleSearchSuccess({ indexId: indexName }))
        .on("error", handleSearchError);

    let skip = false;
    let stalledSearchTimer = null;
    let initialSearchParameters = helper.state;

    const widgetsManager = createWidgetsManager(onWidgetsUpdate);

    hydrateSearchClient(searchClient, resultsState);

    const store = createStore({
        widgets: initialState,
        metadata: hydrateMetadata(resultsState),
        results: hydrateResultsState(resultsState),
        error: null,
        searching: false,
        isSearchStalled: true,
        searchingForFacetValues: false,
    });

    function skipSearch() {
        skip = true;
    }

    function updateClient(client) {
        addAlgoliaAgents(client);
        helper.setClient(client);
        search();
    }

    function clearCache() {
        helper.clearCache();
        search();
    }

    function getMetadata(state) {
        return widgetsManager
            .getWidgets()
            .filter((widget) => Boolean(widget.getMetadata))
            .map((widget) => widget.getMetadata(state));
    }

    function getSearchParameters() {
        const sharedParameters = widgetsManager
            .getWidgets()
            .filter((widget) => Boolean(widget.getSearchParameters))
            .filter(
                (widget) =>
                    !isMultiIndexContext(widget) && !isIndexWidget(widget)
            )
            .reduce(
                (res, widget) => widget.getSearchParameters(res),
                initialSearchParameters
            );

        const mainParameters = widgetsManager
            .getWidgets()
            .filter((widget) => Boolean(widget.getSearchParameters))
            .filter((widget) => {
                const targetedIndexEqualMainIndex =
                    isMultiIndexContext(widget) &&
                    isTargetedIndexEqualIndex(widget, indexName);

                const subIndexEqualMainIndex =
                    isIndexWidget(widget) &&
                    isIndexWidgetEqualIndex(widget, indexName);

                return targetedIndexEqualMainIndex || subIndexEqualMainIndex;
            })
            // We have to sort the `Index` widgets first so the `index` parameter
            // is correctly set in the `reduce` function for the following widgets
            .sort(sortIndexWidgetsFirst)
            .reduce(
                (res, widget) => widget.getSearchParameters(res),
                sharedParameters
            );

        const derivedIndices = widgetsManager
            .getWidgets()
            .filter((widget) => Boolean(widget.getSearchParameters))
            .filter((widget) => {
                const targetedIndexNotEqualMainIndex =
                    isMultiIndexContext(widget) &&
                    !isTargetedIndexEqualIndex(widget, indexName);

                const subIndexNotEqualMainIndex =
                    isIndexWidget(widget) &&
                    !isIndexWidgetEqualIndex(widget, indexName);

                return (
                    targetedIndexNotEqualMainIndex || subIndexNotEqualMainIndex
                );
            })
            // We have to sort the `Index` widgets first so the `index` parameter
            // is correctly set in the `reduce` function for the following widgets
            .sort(sortIndexWidgetsFirst)
            .reduce((indices, widget) => {
                const indexId = isMultiIndexContext(widget)
                    ? widget.props.indexContextValue.targetedIndex
                    : widget.props.indexId;

                const widgets = indices[indexId] || [];

                return {
                    ...indices,
                    [indexId]: widgets.concat(widget),
                };
            }, {});

        const derivedParameters = Object.keys(derivedIndices).map(
            (indexId) => ({
                parameters: derivedIndices[indexId].reduce(
                    (res, widget) => widget.getSearchParameters(res),
                    sharedParameters
                ),
                indexId,
            })
        );

        return {
            mainParameters,
            derivedParameters,
        };
    }

    function search() {
        if (!skip) {
            const { mainParameters, derivedParameters } = getSearchParameters(
                helper.state
            );

            // We have to call `slice` because the method `detach` on the derived
            // helpers mutates the value `derivedHelpers`. The `forEach` loop does
            // not iterate on each value and we're not able to correctly clear the
            // previous derived helpers (memory leak + useless requests).
            helper.derivedHelpers.slice().forEach((derivedHelper) => {
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

            derivedParameters.forEach(({ indexId, parameters }) => {
                const derivedHelper = helper.derive(() => parameters);

                derivedHelper
                    .on("result", handleSearchSuccess({ indexId }))
                    .on("error", handleSearchError);
            });

            helper.setState(mainParameters);

            helper.search();
        }
    }

    function handleSearchSuccess({ indexId }) {
        return (event) => {
            const state = store.getState();
            const isDerivedHelpersEmpty = !helper.derivedHelpers.length;

            let results = state.results ? state.results : {};

            // Switching from mono index to multi index and vice versa must reset the
            // results to an empty object, otherwise we keep reference of stalled and
            // unused results.
            results =
                !isDerivedHelpersEmpty && results.getFacetByName ? {} : results;

            if (!isDerivedHelpersEmpty) {
                results = { ...results, [indexId]: event.results };
            } else {
                results = event.results;
            }

            const currentState = store.getState();
            let nextIsSearchStalled = currentState.isSearchStalled;
            if (!helper.hasPendingRequests()) {
                clearTimeout(stalledSearchTimer);
                stalledSearchTimer = null;
                nextIsSearchStalled = false;
            }

            const { resultsFacetValues, ...partialState } = currentState;

            store.setState({
                ...partialState,
                results,
                isSearchStalled: nextIsSearchStalled,
                searching: false,
                error: null,
            });
        };
    }

    function handleSearchError({ error }) {
        const currentState = store.getState();

        let nextIsSearchStalled = currentState.isSearchStalled;
        if (!helper.hasPendingRequests()) {
            clearTimeout(stalledSearchTimer);
            nextIsSearchStalled = false;
        }

        const { resultsFacetValues, ...partialState } = currentState;

        store.setState({
            ...partialState,
            isSearchStalled: nextIsSearchStalled,
            error,
            searching: false,
        });
    }

    function handleNewSearch() {
        if (!stalledSearchTimer) {
            stalledSearchTimer = setTimeout(() => {
                const { resultsFacetValues, ...partialState } =
                    store.getState();

                store.setState({
                    ...partialState,
                    isSearchStalled: true,
                });
            }, stalledSearchDelay);
        }
    }

    function hydrateSearchClient(client, results) {
        if (!results) {
            return;
        }

        // Disable cache hydration on:
        // - Algoliasearch API Client < v4 with cache disabled
        // - Third party clients (detected by the `addAlgoliaAgent` function missing)

        if (
            (!client.transporter || client._cacheHydrated) &&
            (!client._useCache || typeof client.addAlgoliaAgent !== "function")
        ) {
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

            const baseMethod = client.search;
            client.search = (requests, ...methodArgs) => {
                const requestsWithSerializedParams = requests.map(
                    (request) => ({
                        ...request,
                        params: serializeQueryParameters(request.params),
                    })
                );

                return client.transporter.responsesCache.get(
                    {
                        method: "search",
                        args: [requestsWithSerializedParams, ...methodArgs],
                    },
                    () => {
                        return baseMethod(requests, ...methodArgs);
                    }
                );
            };
        }

        if (Array.isArray(results.results)) {
            hydrateSearchClientWithMultiIndexRequest(client, results.results);
            return;
        }

        hydrateSearchClientWithSingleIndexRequest(client, results);
    }

    function hydrateSearchClientWithMultiIndexRequest(client, results) {
        // Algoliasearch API Client >= v4
        // Populate the cache with the data from the server
        if (client.transporter) {
            client.transporter.responsesCache.set(
                {
                    method: "search",
                    args: [
                        results.reduce(
                            (acc, result) =>
                                acc.concat(
                                    result.rawResults.map((request) => ({
                                        indexName: request.index,
                                        params: request.params,
                                    }))
                                ),
                            []
                        ),
                    ],
                },
                {
                    results: results.reduce(
                        (acc, result) => acc.concat(result.rawResults),
                        []
                    ),
                }
            );
            return;
        }

        // Algoliasearch API Client < v4
        // Prior to client v4 we didn't have a proper API to hydrate the client
        // cache from the outside. The following code populates the cache with
        // a single-index result. You can find more information about the
        // computation of the key inside the client (see link below).
        // https://github.com/algolia/algoliasearch-client-javascript/blob/c27e89ff92b2a854ae6f40dc524bffe0f0cbc169/src/AlgoliaSearchCore.js#L232-L240
        const key = `/1/indexes/*/queries_body_${JSON.stringify({
            requests: results.reduce(
                (acc, result) =>
                    acc.concat(
                        result.rawResults.map((request) => ({
                            indexName: request.index,
                            params: request.params,
                        }))
                    ),
                []
            ),
        })}`;

        client.cache = {
            ...client.cache,
            [key]: JSON.stringify({
                results: results.reduce(
                    (acc, result) => acc.concat(result.rawResults),
                    []
                ),
            }),
        };
    }

    function hydrateSearchClientWithSingleIndexRequest(client, results) {
        // Algoliasearch API Client >= v4
        // Populate the cache with the data from the server
        if (client.transporter) {
            client.transporter.responsesCache.set(
                {
                    method: "search",
                    args: [
                        results.rawResults.map((request) => ({
                            indexName: request.index,
                            params: request.params,
                        })),
                    ],
                },
                {
                    results: results.rawResults,
                }
            );
            return;
        }
        // Algoliasearch API Client < v4
        // Prior to client v4 we didn't have a proper API to hydrate the client
        // cache from the outside. The following code populates the cache with
        // a single-index result. You can find more information about the
        // computation of the key inside the client (see link below).
        // https://github.com/algolia/algoliasearch-client-javascript/blob/c27e89ff92b2a854ae6f40dc524bffe0f0cbc169/src/AlgoliaSearchCore.js#L232-L240
        const key = `/1/indexes/*/queries_body_${JSON.stringify({
            requests: results.rawResults.map((request) => ({
                indexName: request.index,
                params: request.params,
            })),
        })}`;

        client.cache = {
            ...client.cache,
            [key]: JSON.stringify({
                results: results.rawResults,
            }),
        };
    }

    function hydrateResultsState(results) {
        if (!results) {
            return null;
        }

        if (Array.isArray(results.results)) {
            return results.results.reduce(
                (acc, result) => ({
                    ...acc,
                    [result._internalIndexId]:
                        new algoliasearchHelper.SearchResults(
                            new algoliasearchHelper.SearchParameters(
                                result.state
                            ),
                            result.rawResults
                        ),
                }),
                {}
            );
        }

        return new algoliasearchHelper.SearchResults(
            new algoliasearchHelper.SearchParameters(results.state),
            results.rawResults
        );
    }

    // Called whenever a widget has been rendered with new props.
    function onWidgetsUpdate() {
        const metadata = getMetadata(store.getState().widgets);

        store.setState({
            ...store.getState(),
            metadata,
            searching: true,
        });

        // Since the `getSearchParameters` method of widgets also depends on props,
        // the result search parameters might have changed.
        search();
    }

    function transitionState(nextSearchState) {
        const searchState = store.getState().widgets;

        return widgetsManager
            .getWidgets()
            .filter((widget) => Boolean(widget.transitionState))
            .reduce(
                (res, widget) => widget.transitionState(searchState, res),
                nextSearchState
            );
    }

    function onExternalStateUpdate(nextSearchState) {
        const metadata = getMetadata(nextSearchState);

        store.setState({
            ...store.getState(),
            widgets: nextSearchState,
            metadata,
            searching: true,
        });

        search();
    }

    function onSearchForFacetValues({ facetName, query, maxFacetHits = 10 }) {
        // The values 1, 100 are the min / max values that the engine accepts.
        // see: https://www.algolia.com/doc/api-reference/api-parameters/maxFacetHits
        const maxFacetHitsWithinRange = Math.max(
            1,
            Math.min(maxFacetHits, 100)
        );

        store.setState({
            ...store.getState(),
            searchingForFacetValues: true,
        });

        helper
            .searchForFacetValues(facetName, query, maxFacetHitsWithinRange)
            .then(
                (content) => {
                    store.setState({
                        ...store.getState(),
                        error: null,
                        searchingForFacetValues: false,
                        resultsFacetValues: {
                            ...store.getState().resultsFacetValues,
                            [facetName]: content.facetHits,
                            query,
                        },
                    });
                },
                (error) => {
                    store.setState({
                        ...store.getState(),
                        searchingForFacetValues: false,
                        error,
                    });
                }
            )
            .catch((error) => {
                // Since setState is synchronous, any error that occurs in the render of a
                // component will be swallowed by this promise.
                // This is a trick to make the error show up correctly in the console.
                // See http://stackoverflow.com/a/30741722/969302
                setTimeout(() => {
                    throw error;
                });
            });
    }

    function updateIndex(newIndex) {
        initialSearchParameters = initialSearchParameters.setIndex(newIndex);
        // No need to trigger a new search here as the widgets will also update and trigger it if needed.
    }

    function getWidgetsIds() {
        return store
            .getState()
            .metadata.reduce(
                (res, meta) =>
                    typeof meta.id !== "undefined" ? res.concat(meta.id) : res,
                []
            );
    }

    return {
        store,
        widgetsManager,
        getWidgetsIds,
        getSearchParameters,
        onSearchForFacetValues,
        onExternalStateUpdate,
        transitionState,
        updateClient,
        updateIndex,
        clearCache,
        skipSearch,
    };
}

function hydrateMetadata(resultsState) {
    if (!resultsState) {
        return [];
    }

    // add a value noop, which gets replaced once the widgets are mounted
    return resultsState.metadata.map((datum) => ({
        value: () => ({}),
        ...datum,
        items:
            datum.items &&
            datum.items.map((item) => ({
                value: () => ({}),
                ...item,
                items:
                    item.items &&
                    item.items.map((nestedItem) => ({
                        value: () => ({}),
                        ...nestedItem,
                    })),
            })),
    }));
}
