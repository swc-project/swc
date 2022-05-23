import yield from "bar";
yield = 123;
while (true) {
    yield: for (;;) break yield;
    foo();
}
while (true) yield: for (;;) continue yield;
function yield() {}
function foo(...yield) {}
try {
    new Error("");
} catch (yield) {}
var yield = "foo";
