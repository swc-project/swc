/*
 * Copyright (c) 2020, J2 Innovations. All Rights Reserved
 */

/* eslint @typescript-eslint/no-explicit-any: "off", @typescript-eslint/explicit-module-boundary-types: "off" */

function out(text: string): void {
    console.log(text);
}

function profileFunc(
    targetName: string,
    propertyKey: string,
    description: string,
    func: () => any
): unknown {
    // Date.now() has it's issues but it's good enough for the use case and works in a
    // browser, node and deno.
    const t0 = Date.now();

    function profileEnd(): void {
        const t1 = Date.now();
        out(
            `Profiled ${targetName ? `${targetName}.` : ""}${propertyKey}${
                description ? ` - ${description} ` : ""
            }: ${t1 - t0}ms`
        );
    }

    let isAsync = false;
    try {
        const retVal = func();

        // Attempt to detect whether a promise is being returned or not.
        if (
            retVal &&
            typeof retVal === "object" &&
            typeof retVal.then === "function" &&
            typeof retVal.finally === "function"
        ) {
            isAsync = true;

            // If a promise is returned then latch onto it so we can measure the time.
            return retVal.finally(profileEnd);
        }

        return retVal;
    } finally {
        if (!isAsync) {
            profileEnd();
        }
    }
}

/**
 * A property accessor decorator used for profiling method call, getters and setters.
 *
 * This API is considered experimental.
 */
export function profile(
    description = ""
): (target: any, propertyKey: string, descriptor: PropertyDescriptor) => void {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor
    ): PropertyDescriptor {
        // The original getter.
        const get = descriptor?.get;
        const set = descriptor?.set;
        const value = descriptor?.value;

        const targetName = target?.constructor?.name || "";

        if (typeof get === "function") {
            return {
                get(): any {
                    return profileFunc(
                        targetName,
                        propertyKey,
                        description,
                        () => get.call(this)
                    );
                },
            };
        } else if (typeof set === "function") {
            return {
                set(arg: any): any {
                    return profileFunc(
                        targetName,
                        propertyKey,
                        description,
                        () => set.call(this, arg)
                    );
                },
            };
        } else if (typeof value === "function") {
            return {
                value(...args: any[]): any {
                    return profileFunc(
                        targetName,
                        propertyKey,
                        description,
                        () => value.apply(this, args)
                    );
                },
            };
        } else {
            throw new Error(`Unsupported profile call for ${propertyKey}`);
        }
    };
}
