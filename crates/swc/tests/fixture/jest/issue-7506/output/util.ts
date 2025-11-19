// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "getStackTrace", {
    enumerable: true,
    get: function() {
        return getStackTrace;
    }
});
function getStackTrace() {
    const rawStack = new Error().stack;
    return rawStack.split('\n');
}
