// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

export function getStackTrace(): string[] {
    const rawStack = new Error().stack!;

    return rawStack.split('\n');
}
