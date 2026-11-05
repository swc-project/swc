/**
 * The whole files is about testing exclude and test file matching through options
 */
import { hello } from './input';

describe('This file gonna be ignored', () => {
  test('hello return', () => {
    expect(hello()).toBe('Hello SWC!');
  });
});