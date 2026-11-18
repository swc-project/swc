// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
import { getStackTrace } from 'common/get-stack-trace';

describe('get-stack-trace', () => {
    it("should include the calling function's name in third line", () => {
        let stack: string[] | undefined;
        function namedCallingFunction() {
            stack = getStackTrace();
        }
        namedCallingFunction();

        expect(stack[2]).toContain('namedCallingFunction');
    });
});