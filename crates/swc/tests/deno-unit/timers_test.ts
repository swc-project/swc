// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import {
  unitTest,
  createResolvable,
  assert,
  assertEquals,
  assertNotEquals,
} from "./test_util.ts";

function deferred(): {
  promise: Promise<{}>;
  resolve: (value?: {} | PromiseLike<{}>) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  reject: (reason?: any) => void;
} {
  let resolve: (value?: {} | PromiseLike<{}>) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let reject: ((reason?: any) => void) | undefined = undefined;
  const promise = new Promise<{}>((res, rej): void => {
    resolve = res;
    reject = rej;
  });
  return {
    promise,
    resolve: resolve!,
    reject: reject!,
  };
}

function waitForMs(ms: number): Promise<number> {
  return new Promise((resolve: () => void): number => setTimeout(resolve, ms));
}

unitTest(async function timeoutSuccess(): Promise<void> {
  const { promise, resolve } = deferred();
  let count = 0;
  setTimeout((): void => {
    count++;
    resolve();
  }, 500);
  await promise;
  // count should increment
  assertEquals(count, 1);
});

unitTest(async function timeoutArgs(): Promise<void> {
  const { promise, resolve } = deferred();
  const arg = 1;
  setTimeout(
    (a, b, c): void => {
      assertEquals(a, arg);
      assertEquals(b, arg.toString());
      assertEquals(c, [arg]);
      resolve();
    },
    10,
    arg,
    arg.toString(),
    [arg]
  );
  await promise;
});

unitTest(async function timeoutCancelSuccess(): Promise<void> {
  let count = 0;
  const id = setTimeout((): void => {
    count++;
  }, 1);
  // Cancelled, count should not increment
  clearTimeout(id);
  await waitForMs(600);
  assertEquals(count, 0);
});

unitTest(async function timeoutCancelMultiple(): Promise<void> {
  function uncalled(): never {
    throw new Error("This function should not be called.");
  }

  // Set timers and cancel them in the same order.
  const t1 = setTimeout(uncalled, 10);
  const t2 = setTimeout(uncalled, 10);
  const t3 = setTimeout(uncalled, 10);
  clearTimeout(t1);
  clearTimeout(t2);
  clearTimeout(t3);

  // Set timers and cancel them in reverse order.
  const t4 = setTimeout(uncalled, 20);
  const t5 = setTimeout(uncalled, 20);
  const t6 = setTimeout(uncalled, 20);
  clearTimeout(t6);
  clearTimeout(t5);
  clearTimeout(t4);

  // Sleep until we're certain that the cancelled timers aren't gonna fire.
  await waitForMs(50);
});

unitTest(async function timeoutCancelInvalidSilentFail(): Promise<void> {
  // Expect no panic
  const { promise, resolve } = deferred();
  let count = 0;
  const id = setTimeout((): void => {
    count++;
    // Should have no effect
    clearTimeout(id);
    resolve();
  }, 500);
  await promise;
  assertEquals(count, 1);

  // Should silently fail (no panic)
  clearTimeout(2147483647);
});

unitTest(async function intervalSuccess(): Promise<void> {
  const { promise, resolve } = deferred();
  let count = 0;
  const id = setInterval((): void => {
    count++;
    clearInterval(id);
    resolve();
  }, 100);
  await promise;
  // Clear interval
  clearInterval(id);
  // count should increment twice
  assertEquals(count, 1);
  // Similar false async leaking alarm.
  // Force next round of polling.
  await waitForMs(0);
});

unitTest(async function intervalCancelSuccess(): Promise<void> {
  let count = 0;
  const id = setInterval((): void => {
    count++;
  }, 1);
  clearInterval(id);
  await waitForMs(500);
  assertEquals(count, 0);
});

unitTest(async function intervalOrdering(): Promise<void> {
  const timers: number[] = [];
  let timeouts = 0;
  function onTimeout(): void {
    ++timeouts;
    for (let i = 1; i < timers.length; i++) {
      clearTimeout(timers[i]);
    }
  }
  for (let i = 0; i < 10; i++) {
    timers[i] = setTimeout(onTimeout, 1);
  }
  await waitForMs(500);
  assertEquals(timeouts, 1);
});

unitTest(function intervalCancelInvalidSilentFail(): void {
  // Should silently fail (no panic)
  clearInterval(2147483647);
});

unitTest(async function fireCallbackImmediatelyWhenDelayOverMaxValue(): Promise<
  void
> {
  let count = 0;
  setTimeout((): void => {
    count++;
  }, 2 ** 31);
  await waitForMs(1);
  assertEquals(count, 1);
});

unitTest(async function timeoutCallbackThis(): Promise<void> {
  const { promise, resolve } = deferred();
  const obj = {
    foo(): void {
      assertEquals(this, window);
      resolve();
    },
  };
  setTimeout(obj.foo, 1);
  await promise;
});

unitTest(async function timeoutBindThis(): Promise<void> {
  const thisCheckPassed = [null, undefined, window, globalThis];

  const thisCheckFailed = [
    0,
    "",
    true,
    false,
    {},
    [],
    "foo",
    (): void => {},
    Object.prototype,
  ];

  for (const thisArg of thisCheckPassed) {
    const resolvable = createResolvable();
    let hasThrown = 0;
    try {
      setTimeout.call(thisArg, () => resolvable.resolve(), 1);
      hasThrown = 1;
    } catch (err) {
      if (err instanceof TypeError) {
        hasThrown = 2;
      } else {
        hasThrown = 3;
      }
    }
    await resolvable;
    assertEquals(hasThrown, 1);
  }

  for (const thisArg of thisCheckFailed) {
    let hasThrown = 0;
    try {
      setTimeout.call(thisArg, () => {}, 1);
      hasThrown = 1;
    } catch (err) {
      if (err instanceof TypeError) {
        hasThrown = 2;
      } else {
        hasThrown = 3;
      }
    }
    assertEquals(hasThrown, 2);
  }
});

unitTest(function clearTimeoutShouldConvertToNumber(): void {
  let called = false;
  const obj = {
    valueOf(): number {
      called = true;
      return 1;
    },
  };
  clearTimeout((obj as unknown) as number);
  assert(called);
});

unitTest(function setTimeoutShouldThrowWithBigint(): void {
  let hasThrown = 0;
  try {
    setTimeout((): void => {}, (1n as unknown) as number);
    hasThrown = 1;
  } catch (err) {
    if (err instanceof TypeError) {
      hasThrown = 2;
    } else {
      hasThrown = 3;
    }
  }
  assertEquals(hasThrown, 2);
});

unitTest(function clearTimeoutShouldThrowWithBigint(): void {
  let hasThrown = 0;
  try {
    clearTimeout((1n as unknown) as number);
    hasThrown = 1;
  } catch (err) {
    if (err instanceof TypeError) {
      hasThrown = 2;
    } else {
      hasThrown = 3;
    }
  }
  assertEquals(hasThrown, 2);
});

unitTest(function testFunctionName(): void {
  assertEquals(clearTimeout.name, "clearTimeout");
  assertEquals(clearInterval.name, "clearInterval");
});

unitTest(function testFunctionParamsLength(): void {
  assertEquals(setTimeout.length, 1);
  assertEquals(setInterval.length, 1);
  assertEquals(clearTimeout.length, 0);
  assertEquals(clearInterval.length, 0);
});

unitTest(function clearTimeoutAndClearIntervalNotBeEquals(): void {
  assertNotEquals(clearTimeout, clearInterval);
});

unitTest(async function timerMaxCpuBug(): Promise<void> {
  // There was a bug where clearing a timeout would cause Deno to use 100% CPU.
  clearTimeout(setTimeout(() => {}, 1000));
  // We can check this by counting how many ops have triggered in the interim.
  // Certainly less than 10 ops should have been dispatched in next 100 ms.
  const { opsDispatched } = Deno.metrics();
  await waitForMs(100);
  const opsDispatched_ = Deno.metrics().opsDispatched;
  assert(opsDispatched_ - opsDispatched < 10);
});

unitTest(async function timerBasicMicrotaskOrdering(): Promise<void> {
  let s = "";
  let count = 0;
  const { promise, resolve } = deferred();
  setTimeout(() => {
    Promise.resolve().then(() => {
      count++;
      s += "de";
      if (count === 2) {
        resolve();
      }
    });
  });
  setTimeout(() => {
    count++;
    s += "no";
    if (count === 2) {
      resolve();
    }
  });
  await promise;
  assertEquals(s, "deno");
});

unitTest(async function timerNestedMicrotaskOrdering(): Promise<void> {
  let s = "";
  const { promise, resolve } = deferred();
  s += "0";
  setTimeout(() => {
    s += "4";
    setTimeout(() => (s += "A"));
    Promise.resolve()
      .then(() => {
        setTimeout(() => {
          s += "B";
          resolve();
        });
      })
      .then(() => {
        s += "5";
      });
  });
  setTimeout(() => (s += "6"));
  Promise.resolve().then(() => (s += "2"));
  Promise.resolve().then(() =>
    setTimeout(() => {
      s += "7";
      Promise.resolve()
        .then(() => (s += "8"))
        .then(() => {
          s += "9";
        });
    })
  );
  Promise.resolve().then(() => Promise.resolve().then(() => (s += "3")));
  s += "1";
  await promise;
  assertEquals(s, "0123456789AB");
});

unitTest(function testQueueMicrotask() {
  assertEquals(typeof queueMicrotask, "function");
});
