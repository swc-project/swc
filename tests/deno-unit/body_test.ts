// Copyright 2018-2020 the Deno authors. All rights reserved. MIT license.
import { unitTest, assertEquals, assert } from "./test_util.ts";

// just a hack to get a body object
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function buildBody(body: any): Body {
  const stub = new Request("", {
    body: body,
  });
  return stub as Body;
}

const intArrays = [
  Int8Array,
  Int16Array,
  Int32Array,
  Uint8Array,
  Uint16Array,
  Uint32Array,
  Uint8ClampedArray,
  Float32Array,
  Float64Array,
];
unitTest(async function arrayBufferFromByteArrays(): Promise<void> {
  const buffer = new TextEncoder().encode("ahoyhoy8").buffer;

  for (const type of intArrays) {
    const body = buildBody(new type(buffer));
    const text = new TextDecoder("utf-8").decode(await body.arrayBuffer());
    assertEquals(text, "ahoyhoy8");
  }
});

//FormData
unitTest(
  { perms: { net: true } },
  async function bodyMultipartFormData(): Promise<void> {
    const response = await fetch(
      "http://localhost:4545/cli/tests/subdir/multipart_form_data.txt"
    );
    const text = await response.text();

    const body = buildBody(text);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (body as any).contentType = "multipart/form-data;boundary=boundary";

    const formData = await body.formData();
    assert(formData.has("field_1"));
    assertEquals(formData.get("field_1")!.toString(), "value_1 \r\n");
    assert(formData.has("field_2"));
  }
);

unitTest(
  { perms: { net: true } },
  async function bodyURLEncodedFormData(): Promise<void> {
    const response = await fetch(
      "http://localhost:4545/cli/tests/subdir/form_urlencoded.txt"
    );
    const text = await response.text();

    const body = buildBody(text);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (body as any).contentType = "application/x-www-form-urlencoded";

    const formData = await body.formData();
    assert(formData.has("field_1"));
    assertEquals(formData.get("field_1")!.toString(), "Hi");
    assert(formData.has("field_2"));
    assertEquals(formData.get("field_2")!.toString(), "<Deno>");
  }
);

unitTest({ perms: {} }, async function bodyURLSearchParams(): Promise<void> {
  const body = buildBody(new URLSearchParams({ hello: "world" }));

  const text = await body.text();
  assertEquals(text, "hello=world");
});

unitTest(async function bodyArrayBufferMultipleParts(): Promise<void> {
  const parts: Uint8Array[] = [];
  let size = 0;
  for (let i = 0; i <= 150000; i++) {
    const part = new Uint8Array([1]);
    parts.push(part);
    size += part.length;
  }

  let offset = 0;
  const stream = new ReadableStream({
    pull(controller): void {
      // parts.shift() takes forever: https://github.com/denoland/deno/issues/5259
      const chunk = parts[offset++];
      if (!chunk) return controller.close();
      controller.enqueue(chunk);
    },
  });

  const body = buildBody(stream);
  assertEquals((await body.arrayBuffer()).byteLength, size);
});
