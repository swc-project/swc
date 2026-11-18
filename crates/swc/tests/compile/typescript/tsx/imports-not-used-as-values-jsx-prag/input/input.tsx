/** @jsx h */
import html, { h } from "example";
serve((_req) =>
  html({
    body: <div>Hello World!</div>,
  })
);
