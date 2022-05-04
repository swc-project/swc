/*
 * Copyright (c) 2020, J2 Innovations. All Rights Reserved
 */

/* eslint @typescript-eslint/no-explicit-any: "off" */

/**
 * The global web entry for Haystack Core.
 *
 * This will load the library under the global 'hs' namespace.
 *
 * This is only intended for playing with the Haystack Core library.
 *
 * @module
 */

import * as hs from "./index";
import {} from "./core/Array";

if (typeof window !== "undefined" && window !== null) {
    const anyWindow = window as any;
    anyWindow.hs = hs;
} else {
    const anyGlobal = global as any;
    anyGlobal.hs = hs;
}
