---
name: Crash report
about: Use this when swc panics
title: "panic: "
labels: C-bug
assignees: ""
---

<!--
If you are using swc at work, please considering adding your company to https://swc.rs/users/
If then, your issue will be fixed more quickly.
-->

1. Source code

2. `.swcrc` file

3. Error message gained from `swc --sync <input.js>`
   (--sync is required to get panic message)

4. Backtrace

(You can get it by invoking swc by setting an environment varaible`SWC_DEBUG` to `1`, invoke swc like `SWC_DEBUG=1 npx swc foo.js` on linux / darwin)
