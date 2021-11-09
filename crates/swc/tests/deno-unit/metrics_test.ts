// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { unitTest, assert } from "./test_util.ts";

unitTest(async function metrics(): Promise<void> {
  const m1 = Deno.metrics();
  assert(m1.opsDispatched > 0);
  assert(m1.opsDispatchedSync > 0);
  assert(m1.opsCompleted > 0);
  assert(m1.opsCompletedSync > 0);
  assert(m1.bytesSentControl > 0);
  assert(m1.bytesSentData >= 0);
  assert(m1.bytesReceived > 0);

  // Write to stdout to ensure a "data" message gets sent instead of just
  // control messages.
  const dataMsg = new Uint8Array([13, 13, 13]); // "\r\r\r",
  await Deno.stdout.write(dataMsg);

  const m2 = Deno.metrics();
  assert(m2.opsDispatched > m1.opsDispatched);
  assert(m2.opsDispatchedSync > m1.opsDispatchedSync);
  assert(m2.opsDispatchedAsync > m1.opsDispatchedAsync);
  assert(m2.opsCompleted > m1.opsCompleted);
  assert(m2.opsCompletedSync > m1.opsCompletedSync);
  assert(m2.opsCompletedAsync > m1.opsCompletedAsync);
  assert(m2.bytesSentControl > m1.bytesSentControl);
  assert(m2.bytesSentData >= m1.bytesSentData + dataMsg.byteLength);
  assert(m2.bytesReceived > m1.bytesReceived);
});

unitTest(
  { perms: { write: true } },
  function metricsUpdatedIfNoResponseSync(): void {
    const filename = Deno.makeTempDirSync() + "/test.txt";

    const data = new Uint8Array([41, 42, 43]);
    Deno.writeFileSync(filename, data, { mode: 0o666 });

    const metrics = Deno.metrics();
    assert(metrics.opsDispatched === metrics.opsCompleted);
    assert(metrics.opsDispatchedSync === metrics.opsCompletedSync);
  }
);

unitTest(
  { perms: { write: true } },
  async function metricsUpdatedIfNoResponseAsync(): Promise<void> {
    const filename = Deno.makeTempDirSync() + "/test.txt";

    const data = new Uint8Array([41, 42, 43]);
    await Deno.writeFile(filename, data, { mode: 0o666 });

    const metrics = Deno.metrics();
    assert(metrics.opsDispatched === metrics.opsCompleted);
    assert(metrics.opsDispatchedSync === metrics.opsCompletedSync);
    assert(metrics.opsDispatchedAsync === metrics.opsCompletedAsync);
  }
);
