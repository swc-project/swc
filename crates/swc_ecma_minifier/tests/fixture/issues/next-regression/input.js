import { InvariantError } from '../../shared/lib/invariant-error';
import { postponeWithTracking, throwToInterruptStaticGeneration } from '../app-render/dynamic-rendering';
import { workAsyncStorage } from '../app-render/work-async-storage.external';
import { workUnitAsyncStorage } from '../app-render/work-unit-async-storage.external';
import { makeHangingPromise } from '../dynamic-rendering-utils';
import { describeStringPropertyAccess, wellKnownProperties } from '../../shared/lib/utils/reflect-utils';
const CachedParams = new WeakMap();
export async function unstable_rootParams() {
    const workStore = workAsyncStorage.getStore();
    if (!workStore) {
        throw new InvariantError('Missing workStore in unstable_rootParams');
    }
    const workUnitStore = workUnitAsyncStorage.getStore();
    if (!workUnitStore) {
        throw new Error(`Route ${workStore.route} used \`unstable_rootParams()\` in Pages Router. This API is only available within App Router.`);
    }
    switch (workUnitStore.type) {
        case 'unstable-cache':
        case 'cache':
            {
                throw new Error(`Route ${workStore.route} used \`unstable_rootParams()\` inside \`"use cache"\` or \`unstable_cache\`. Support for this API inside cache scopes is planned for a future version of Next.js.`);
            }
        case 'prerender':
        case 'prerender-ppr':
        case 'prerender-legacy':
            return createPrerenderRootParams(workUnitStore.rootParams, workStore, workUnitStore);
        default:
            return Promise.resolve(workUnitStore.rootParams);
    }
}
function createPrerenderRootParams(underlyingParams, workStore, prerenderStore) {
    const fallbackParams = workStore.fallbackRouteParams;
    if (fallbackParams) {
        let hasSomeFallbackParams = false;
        for (const key in underlyingParams) {
            if (fallbackParams.has(key)) {
                hasSomeFallbackParams = true;
                break;
            }
        }
        if (hasSomeFallbackParams) {
            if (prerenderStore.type === 'prerender') {
                const cachedParams = CachedParams.get(underlyingParams);
                if (cachedParams) {
                    return cachedParams;
                }
                const promise = makeHangingPromise(prerenderStore.renderSignal, '`unstable_rootParams`');
                CachedParams.set(underlyingParams, promise);
                return promise;
            }
            return makeErroringRootParams(underlyingParams, fallbackParams, workStore, prerenderStore);
        }
    }
    return Promise.resolve(underlyingParams);
}
function makeErroringRootParams(underlyingParams, fallbackParams, workStore, prerenderStore) {
    const cachedParams = CachedParams.get(underlyingParams);
    if (cachedParams) {
        return cachedParams;
    }
    const augmentedUnderlying = {
        ...underlyingParams
    };
    const promise = Promise.resolve(augmentedUnderlying);
    CachedParams.set(underlyingParams, promise);
    Object.keys(underlyingParams).forEach((prop) => {
        if (wellKnownProperties.has(prop)) { } else {
            if (fallbackParams.has(prop)) {
                Object.defineProperty(augmentedUnderlying, prop, {
                    get() {
                        const expression = describeStringPropertyAccess('unstable_rootParams', prop);
                        if (prerenderStore.type === 'prerender-ppr') {
                            postponeWithTracking(workStore.route, expression, prerenderStore.dynamicTracking);
                        } else {
                            throwToInterruptStaticGeneration(expression, workStore, prerenderStore);
                        }
                    },
                    enumerable: true
                });
            } else {
                ;
                promise[prop] = underlyingParams[prop];
            }
        }
    });
    return promise;
}
