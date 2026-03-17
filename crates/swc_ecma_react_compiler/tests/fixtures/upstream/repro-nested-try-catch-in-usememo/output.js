import { c as _c } from "react/compiler-runtime"; // @compilationMode:"infer"
import { useMemo } from "react";

function useFoo(text) {
  const $ = _c(2);
  let t0;
  try {
    let formattedText;
    try {
      let t2;
      if ($[0] !== text) {
        t2 = format(text);
        $[0] = text;
        $[1] = t2;
      } else {
        t2 = $[1];
      }
      formattedText = t2;
    } catch {
      formattedText = text;
    }

    t0 = formattedText || "";
  } catch (t1) {
    t0 = "";
  }
  return t0;
}

function format(text) {
  return text.toUpperCase();
}

function Foo(t0) {
  const $ = _c(2);
  const { text } = t0;
  const result = useFoo(text);
  let t1;
  if ($[0] !== result) {
    t1 = <span>{result}</span>;
    $[0] = result;
    $[1] = t1;
  } else {
    t1 = $[1];
  }
  return t1;
}

export const FIXTURE_ENTRYPOINT = {
  fn: Foo,
  params: [{ text: "hello" }],
  sequentialRenders: [
    { text: "hello" },
    { text: "hello" },
    { text: "world" },
    { text: "" },
  ],
};
