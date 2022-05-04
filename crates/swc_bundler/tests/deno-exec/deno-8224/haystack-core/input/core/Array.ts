/*
 * Copyright (c) 2020, J2 Innovations. All Rights Reserved
 */

/* eslint @typescript-eslint/no-unused-vars: "off" */

/**
 * Haystack array extension methods.
 *
 * @module
 */

import { HGrid } from "./HGrid";
import { HList } from "./HList";
import { HDict } from "./HDict";
import { HVal } from "./HVal";
import { makeValue } from "./util";
import { HaysonVal, HaysonDict } from "./hayson";

declare global {
    interface Array<T> {
        toGrid(): HGrid;
        toList(): HList;
        toDict(): HDict;
        toHayson(): HaysonVal;
    }
}

Object.defineProperties(Array.prototype, {
    /**
     * @returns The array as a grid.
     */
    toGrid: {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (): HGrid {
            return HGrid.make(this as HaysonDict[]);
        },
    },

    /**
     * @returns The array as a list.
     */
    toList: {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function <Value extends HVal>(): HList<Value> {
            return HList.make(this as Value[]);
        },
    },

    /**
     * @returns The array as a dict.
     */
    toDict: {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (): HDict {
            return HList.make(this as HaysonVal).toDict();
        },
    },

    /**
     * @returns The array as Hayson.
     */
    toHayson: {
        enumerable: false,
        configurable: true,
        writable: true,
        value: function (): HaysonVal {
            const val = makeValue(this as HaysonVal);
            return val ? val.toJSON() : val;
        },
    },
});

export default Array;
