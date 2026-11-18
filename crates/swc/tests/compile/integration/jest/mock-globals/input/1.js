
import { setTimeout } from 'timers/promises';

import { describe, expect, it, jest } from '@jest/globals';

jest.mock('timers/promises', () => ({
    setTimeout: jest.fn(() => Promise.resolve())
}));

describe('suite', () => {
    it('my-test', () => {
        const totalDelay = jest
            .mocked(setTimeout)
            .mock.calls.reduce((agg, call) => agg + (call[0] as number), 0);
        expect(totalDelay).toStrictEqual(0);
    })
})