import "foo"
with { type: "json" };

import data
    from "foo"
    with { type: "json" };

export { default as value } from "foo"
with { type: "json" };

export * from "foo" /*
*/ with { type: "json" };

import "foo"
assert({});

import other from "foo"
assert({});

export * from "foo"
assert({});
