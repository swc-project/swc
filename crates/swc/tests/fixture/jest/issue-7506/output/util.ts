// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
export function getStackTrace() {
    var rawStack = new Error().stack;
    return rawStack.split("\n");
}
