/*
 * Copyright (c) 2020, J2 Innovations. All Rights Reserved
 */

/* eslint @typescript-eslint/no-explicit-any: "off", @typescript-eslint/explicit-module-boundary-types: "off" */

interface Cache {
    [prop: string]: any;
}

/**
 * Return the memoize cache.
 *
 * @param obj The object to return the cache from.
 * @returns The memorize cache.
 */
function getCache(obj: any): Cache {
    return obj.$memoizeCache ?? (obj.$memoizeCache = {});
}

/**
 * A property accessor decorator used for memoization of getters and methods.
 */
export function memoize(): (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
) => void {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ): PropertyDescriptor {
        // The original getter.
        const get = descriptor?.get;
        const value = descriptor?.value;

        if (typeof get === "function") {
            return {
                get(): any {
                    const cache = getCache(this);

                    return Object.prototype.hasOwnProperty.call(
                        cache,
                        propertyKey
                    )
                        ? cache[propertyKey]
                        : (cache[propertyKey] = get.call(this));
                },
            };
        } else if (typeof value === "function") {
            return {
                value(...args: any[]): any {
                    const cache = getCache(this);

                    const key = JSON.stringify({ propertyKey, args });

                    return Object.prototype.hasOwnProperty.call(cache, key)
                        ? cache[key]
                        : (cache[key] = value.apply(this, args));
                },
            };
        } else {
            throw new Error("Only methods and getters can be memoized");
        }
    };
}
