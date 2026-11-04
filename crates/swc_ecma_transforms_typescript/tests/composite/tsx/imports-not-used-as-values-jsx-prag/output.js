/** @jsx h */ import html, { h } from "example";
serve((_req)=>html({
  body: /*#__PURE__*/ h("div", null, "Hello World!")
}));
