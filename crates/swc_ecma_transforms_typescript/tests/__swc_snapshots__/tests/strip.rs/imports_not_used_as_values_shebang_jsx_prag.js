#!/usr/bin/env -S deno run -A
import { jsx as _jsx } from "react/jsx-runtime";
/** @jsx h */ import html, { h } from "example";
serve((_req)=>html({
        body: /*#__PURE__*/ _jsx("div", {
            children: "Hello World!"
        })
    }));
