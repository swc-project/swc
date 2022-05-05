const Benchmark = require("benchmark");
const acorn = require("acorn");
const jsx = require("acorn-jsx");
const parser = acorn.Parser.extend(jsx());

const fs = require("fs");
const path = require("path");

const src = fs.readFileSync(path.join(process.argv[2], "input.js"), "utf8");
const jsonStr = fs.readFileSync(
    path.join(process.argv[2], "output.json"),
    "utf8"
);

{
    parser.parse(src, {
        ecmaVersion: 2020,
        ranges: true,
        allowHashBang: true,
        sourceType: "module",
    });
}
const suite = new Benchmark.Suite();

suite
    .add("acorn", () => {
        parser.parse(src, {
            ecmaVersion: 2020,
            ranges: true,
            allowHashBang: true,
            sourceType: "module",
        });
    })
    .add({
        name: "acorn-real",
        fn: (deferred) => {
            fs.promises
                .readFile(path.join(process.argv[2], "input.js"), "utf8")
                .then((src) => {
                    parser.parse(src, {
                        ecmaVersion: 2020,
                        ranges: true,
                        allowHashBang: true,
                        sourceType: "module",
                    });
                    deferred.resolve();
                });
        },
        defer: true,
        async: true,
        queued: true,
    })
    .add("json", () => {
        JSON.parse(jsonStr);
    })
    .on("cycle", function (event) {
        console.log(String(event.target));
    })
    .on("complete", function () {
        console.log("Fastest is " + this.filter("fastest").map("name"));
    })
    .run({
        async: true,
    });
