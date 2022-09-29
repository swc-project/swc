import * as AST from "../lib/ast.js";
import { Compressor } from "../lib/compress/index.js";
import { OutputStream } from "../lib/output.js";
import { parse } from "../lib/parse.js";
import {
    mangle_properties,
    reserve_quoted_keys,
    mangle_private_properties,
} from "../lib/propmangle.js";
import { base54 } from "../lib/scope.js";
import { defaults, string_template } from "../lib/utils/index.js";
import { minify } from "../main.js";
import * as sandbox from "./sandbox.js";
import assert from "assert";
import fs, { mkdirSync } from "fs";
import path from "path";
import semver from "semver";
import { fileURLToPath } from "url";

/* globals module, __dirname, console */
import "source-map-support/register.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

var tests_dir = __dirname;
var failed_files = {};
var minify_options = JSON.parse(
    fs.readFileSync(path.join(__dirname, "ufuzz.json"), "utf-8")
).map(JSON.stringify);

run_compress_tests().catch((e) => {
    console.error(e);
    process.exit(1);
});

/* -----[ utils ]----- */

function HOP(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
}

function tmpl() {
    return string_template.apply(this, arguments);
}

function log() {
    var txt = tmpl.apply(this, arguments);
    console.log("%s", txt);
}

function log_directory(dir) {
    log("*** Entering [{dir}]", { dir: dir });
}

function log_start_file(file) {
    log("--- {file}", { file: file });
}

function log_test(name) {
    log("    Running test [{name}]", { name: name });
}

function find_test_files(dir) {
    var files = fs.readdirSync(dir).filter(function (name) {
        return /\.js$/i.test(name);
    });
    if (process.argv.length > 2) {
        var x = process.argv.slice(2);
        files = files.filter(function (f) {
            return x.includes(f);
        });
    }
    return files;
}

function test_directory(dir) {
    return path.resolve(tests_dir, dir);
}

function as_toplevel(input, mangle_options) {
    if (!(input instanceof AST.AST_BlockStatement))
        throw new Error("Unsupported input syntax");
    for (var i = 0; i < input.body.length; i++) {
        var stat = input.body[i];
        if (
            stat instanceof AST.AST_SimpleStatement &&
            stat.body instanceof AST.AST_String
        )
            input.body[i] = new AST.AST_Directive(stat.body);
        else break;
    }
    var toplevel = new AST.AST_Toplevel(input);
    toplevel.figure_out_scope(mangle_options);
    return toplevel;
}

async function run_compress_tests() {
    var failures = 0;
    var dir = test_directory("compress");
    log_directory("compress");
    var files = find_test_files(dir);
    async function test_file(file) {
        log_start_file(file);
        async function test_case(test) {
            log_test(test.name);
            const dir = path.join(
                __dirname,
                `../output/${file.replace(".js", "")}/${test.name}`
            );
            console.log(dir);
            mkdirSync(dir, { recursive: true });
            var output_options = test.beautify || test.format || {};
            var expect;
            if (test.expect) {
                expect = make_code(
                    as_toplevel(test.expect, test.mangle),
                    output_options
                );
            } else {
                expect = test.expect_exact;
            }
            fs.writeFileSync(path.join(dir, "output.js"), expect || "");
            if (expect) {
                fs.writeFileSync(
                    path.join(dir, "output.terser.js"),
                    expect || ""
                );
            }
            fs.writeFileSync(
                path.join(dir, "config.json"),
                JSON.stringify(test.options, undefined, 4)
            );
            if (
                test.expect_error &&
                (test.expect || test.expect_exact || test.expect_stdout)
            ) {
                log(
                    "!!! Test cannot have an `expect_error` with other expect clauses\n",
                    {}
                );
                return false;
            }
            if (
                test.input instanceof AST.AST_SimpleStatement &&
                test.input.body instanceof AST.AST_TemplateString
            ) {
                if (test.input.body.segments.length == 1) {
                    try {
                        var input = parse(test.input.body.segments[0].value);
                    } catch (ex) {
                        if (!test.expect_error) {
                            log(
                                "!!! Test is missing an `expect_error` clause\n",
                                {}
                            );
                            return false;
                        }
                        if (
                            test.expect_error instanceof
                                AST.AST_SimpleStatement &&
                            test.expect_error.body instanceof AST.AST_Object
                        ) {
                            var expect_error = eval(
                                "(" +
                                    test.expect_error.body.print_to_string() +
                                    ")"
                            );
                            var ex_normalized = JSON.parse(JSON.stringify(ex));
                            ex_normalized.name = ex.name;
                            for (var prop in expect_error) {
                                if (prop == "name" || HOP(expect_error, prop)) {
                                    if (
                                        expect_error[prop] !=
                                        ex_normalized[prop]
                                    ) {
                                        log(
                                            "!!! Failed `expect_error` property `{prop}`:\n\n---expect_error---\n{expect_error}\n\n---ACTUAL exception--\n{actual_ex}\n\n",
                                            {
                                                prop: prop,
                                                expect_error: JSON.stringify(
                                                    expect_error,
                                                    null,
                                                    2
                                                ),
                                                actual_ex: JSON.stringify(
                                                    ex_normalized,
                                                    null,
                                                    2
                                                ),
                                            }
                                        );
                                        return false;
                                    }
                                }
                            }
                            return true;
                        }
                        log(
                            "!!! Test `expect_error` clause must be an object literal\n---expect_error---\n{expect_error}\n\n",
                            {
                                expect_error:
                                    test.expect_error.print_to_string(),
                            }
                        );
                        return false;
                    }
                    var input_code = make_code(input, output_options);
                    var input_formatted = test.input.body.segments[0].value;
                } else {
                    log(
                        "!!! Test input template string cannot use unescaped ${} expressions\n---INPUT---\n{input}\n\n",
                        {
                            input: test.input.body.print_to_string(),
                        }
                    );
                    return false;
                }
            } else if (test.expect_error) {
                log(
                    "!!! Test cannot have an `expect_error` clause without a template string `input`\n",
                    {}
                );
                return false;
            } else {
                var input = as_toplevel(test.input, test.mangle);
                var input_code = make_code(input, output_options);
                var input_formatted = make_code(test.input, {
                    ecma: 2015,
                    beautify: true,
                    quote_style: 3,
                    keep_quoted_props: true,
                });
            }
            try {
                fs.writeFileSync(path.join(dir, "input.js"), input_code);

                parse(input_code);
            } catch (ex) {
                log(
                    "!!! Cannot parse input\n---INPUT---\n{input}\n--PARSE ERROR--\n{error}\n\n",
                    {
                        input: input_formatted,
                        error: ex,
                    }
                );
                return false;
            }
            if (!test.no_mozilla_ast) {
                var ast = input.to_mozilla_ast();
                var mozilla_options = {
                    ecma: output_options.ecma,
                    ascii_only: output_options.ascii_only,
                    comments: false,
                };
                var ast_as_string =
                    AST.AST_Node.from_mozilla_ast(ast).print_to_string(
                        mozilla_options
                    );
                var input_string = input.print_to_string(mozilla_options);
                if (input_string !== ast_as_string) {
                    log(
                        "!!! Mozilla AST I/O corrupted input\n---INPUT---\n{input}\n---OUTPUT---\n{output}\n\n",
                        {
                            input: input_string,
                            output: ast_as_string,
                        }
                    );
                    return false;
                }
            }
            var options = defaults(test.options, {});
            if (test.mangle) {
                fs.writeFileSync(
                    path.join(dir, "mangle.json"),
                    JSON.stringify(test.mangle)
                );
            }
            if (
                test.mangle &&
                test.mangle.properties &&
                test.mangle.properties.keep_quoted
            ) {
                var quoted_props = test.mangle.properties.reserved;
                if (!Array.isArray(quoted_props)) quoted_props = [];
                test.mangle.properties.reserved = quoted_props;
                if (test.mangle.properties.keep_quoted !== "strict") {
                    reserve_quoted_keys(input, quoted_props);
                }
            }
            if (test.rename) {
                input.figure_out_scope(test.mangle);
                input.expand_names(test.mangle);
            }
            var cmp = new Compressor(options, {
                false_by_default:
                    options.defaults === undefined ? true : !options.defaults,
                mangle_options: test.mangle,
            });
            var output = cmp.compress(input);
            output.figure_out_scope(test.mangle);
            if (test.mangle) {
                output.compute_char_frequency(test.mangle);
                (function (cache) {
                    if (!cache) return;
                    if (!("props" in cache)) {
                        cache.props = new Map();
                    } else if (!(cache.props instanceof Map)) {
                        const props = new Map();
                        for (const key in cache.props) {
                            if (
                                HOP(cache.props, key) &&
                                key.charAt(0) === "$"
                            ) {
                                props.set(key.substr(1), cache.props[key]);
                            }
                        }
                        cache.props = props;
                    }
                })(test.mangle.cache);
                output.mangle_names(test.mangle);
                mangle_private_properties(output, test.mangle);
                if (test.mangle.properties) {
                    output = mangle_properties(output, test.mangle.properties);
                }
            }
            output = make_code(output, output_options);
            if (test.expect_stdout && typeof expect == "undefined") {
                fs.writeFileSync(
                    path.join(dir, "expected.stdout"),
                    test.expect_stdout
                );
                // Do not verify generated `output` against `expect` or `expect_exact`.
                // Rely on the pending `expect_stdout` check below.
            } else if (expect != output && !process.env.TEST_NO_COMPARE) {
                log(
                    "!!! failed\n---INPUT---\n{input}\n---OUTPUT---\n{output}\n---EXPECTED---\n{expected}\n\n",
                    {
                        input: input_formatted,
                        output: output,
                        expected: expect,
                    }
                );
                return false;
            }
            try {
                parse(output);
            } catch (ex) {
                log(
                    "!!! Test matched expected result but cannot parse output\n---INPUT---\n{input}\n---OUTPUT---\n{output}\n--REPARSE ERROR--\n{error}\n\n",
                    {
                        input: input_formatted,
                        output: output,
                        error: ex.stack,
                    }
                );
                return false;
            }
            if (
                test.expect_stdout &&
                (!test.node_version ||
                    semver.satisfies(process.version, test.node_version)) &&
                !process.env.TEST_NO_SANDBOX
            ) {
                var stdout = sandbox.run_code(input_code, test.prepend_code);
                if (test.expect_stdout === true) {
                    test.expect_stdout = stdout;
                }
                if (!sandbox.same_stdout(test.expect_stdout, stdout)) {
                    log(
                        "!!! Invalid input or expected stdout\n---INPUT---\n{input}\n---EXPECTED {expected_type}---\n{expected}\n---ACTUAL {actual_type}---\n{actual}\n\n",
                        {
                            input: input_formatted,
                            expected_type:
                                typeof test.expect_stdout == "string"
                                    ? "STDOUT"
                                    : "ERROR",
                            expected: test.expect_stdout,
                            actual_type:
                                typeof stdout == "string" ? "STDOUT" : "ERROR",
                            actual: stdout,
                        }
                    );
                    return false;
                }
                stdout = sandbox.run_code(output, test.prepend_code);
                if (!sandbox.same_stdout(test.expect_stdout, stdout)) {
                    log(
                        "!!! failed\n---INPUT---\n{input}\n---OUTPUT---\n{output}\n---EXPECTED {expected_type}---\n{expected}\n---ACTUAL {actual_type}---\n{actual}\n\n",
                        {
                            input: input_formatted,
                            output: output,
                            expected_type:
                                typeof test.expect_stdout == "string"
                                    ? "STDOUT"
                                    : "ERROR",
                            expected: test.expect_stdout,
                            actual_type:
                                typeof stdout == "string" ? "STDOUT" : "ERROR",
                            actual: stdout,
                        }
                    );
                    return false;
                }
                if (
                    test.reminify &&
                    !(await reminify(test, input_code, input_formatted))
                ) {
                    return false;
                }
            }
            return true;
        }
        var tests = parse_test(path.resolve(dir, file));
        for (var i in tests)
            if (tests.hasOwnProperty(i)) {
                if (!(await test_case(tests[i]))) {
                    failures++;
                    failed_files[file] = 1;
                    if (process.env.TEST_FAIL_FAST) return false;
                }
            }
        return true;
    }
    for (const file of files) {
        if (!(await test_file(file))) {
            break;
        }
    }
    if (failures) {
        console.error("\n!!! Failed " + failures + " test cases.");
        console.error("!!! " + Object.keys(failed_files).join(", "));
        process.exit(1);
    }
}

function parse_test(file) {
    var script = fs.readFileSync(file, "utf8");
    // TODO try/catch can be removed after fixing https://github.com/mishoo/UglifyJS2/issues/348
    try {
        var ast = parse(script, {
            filename: file,
        });
    } catch (e) {
        console.log("Caught error while parsing tests in " + file + "\n");
        console.log(e);
        throw e;
    }
    var tests = {};
    var tw = new AST.TreeWalker(function (node, descend) {
        if (
            node instanceof AST.AST_LabeledStatement &&
            tw.parent() instanceof AST.AST_Toplevel
        ) {
            var name = node.label.name;
            if (name in tests) {
                throw new Error(
                    'Duplicated test name "' + name + '" in ' + file
                );
            }
            tests[name] = get_one_test(name, node.body);
            return true;
        }
        if (node instanceof AST.AST_Directive) return true;
        if (!(node instanceof AST.AST_Toplevel)) croak(node);
    });
    ast.walk(tw);

    const only_tests = Object.entries(tests).filter(
        ([_name, test]) => test.only
    );
    return only_tests.length > 0 ? Object.fromEntries(only_tests) : tests;

    function croak(node) {
        throw new Error(
            tmpl("Can't understand test file {file} [{line},{col}]\n{code}", {
                file: file,
                line: node.start.line,
                col: node.start.col,
                code: make_code(node, { beautify: false }),
            })
        );
    }

    function read_boolean(stat) {
        if (stat.TYPE == "SimpleStatement") {
            var body = stat.body;
            if (body instanceof AST.AST_Boolean) {
                return body.value;
            }
        }
        throw new Error("Should be boolean");
    }

    function read_string(stat) {
        if (stat.TYPE == "SimpleStatement") {
            var body = stat.body;
            switch (body.TYPE) {
                case "String":
                    return body.value;
                case "Array":
                    return body.elements
                        .map(function (element) {
                            if (element.TYPE !== "String")
                                throw new Error("Should be array of strings");
                            return element.value;
                        })
                        .join("\n");
            }
        }
        throw new Error("Should be string or array of strings");
    }

    function get_one_test(name, block) {
        var test = {
            name: name,
            options: {},
            reminify: true,
            only: false,
        };
        var tw = new AST.TreeWalker(function (node, descend) {
            if (node instanceof AST.AST_Assign) {
                if (!(node.left instanceof AST.AST_SymbolRef)) {
                    croak(node);
                }
                var name = node.left.name;
                test[name] = evaluate(node.right);
                return true;
            }
            if (node instanceof AST.AST_LabeledStatement) {
                var label = node.label;
                assert.ok(
                    [
                        "input",
                        "prepend_code",
                        "expect",
                        "expect_error",
                        "expect_exact",
                        "expect_stdout",
                        "node_version",
                        "reminify",
                    ].includes(label.name),
                    tmpl("Unsupported label {name} [{line},{col}]", {
                        name: label.name,
                        line: label.start.line,
                        col: label.start.col,
                    })
                );
                var stat = node.body;
                if (
                    label.name == "expect_exact" ||
                    label.name == "node_version"
                ) {
                    test[label.name] = read_string(stat);
                } else if (label.name == "reminify") {
                    var value = read_boolean(stat);
                    test.reminify = value == null || value;
                } else if (label.name == "expect_stdout") {
                    var body = stat.body;
                    if (body instanceof AST.AST_Boolean) {
                        test[label.name] = body.value;
                    } else if (body instanceof AST.AST_Call) {
                        var ctor = global[body.expression.name];
                        assert.ok(
                            ctor === Error || ctor.prototype instanceof Error,
                            tmpl(
                                "Unsupported expect_stdout format [{line},{col}]",
                                {
                                    line: label.start.line,
                                    col: label.start.col,
                                }
                            )
                        );
                        test[label.name] = ctor.apply(
                            null,
                            body.args.map(function (node) {
                                assert.ok(
                                    node instanceof AST.AST_Constant,
                                    tmpl(
                                        "Unsupported expect_stdout format [{line},{col}]",
                                        {
                                            line: label.start.line,
                                            col: label.start.col,
                                        }
                                    )
                                );
                                return node.value;
                            })
                        );
                    } else {
                        test[label.name] = read_string(stat) + "\n";
                    }
                } else if (label.name === "prepend_code") {
                    test[label.name] = read_string(stat);
                } else {
                    test[label.name] = stat;
                }
                return true;
            }
        });
        block.walk(tw);
        return test;
    }
}

function make_code(ast, options) {
    var stream = OutputStream(options);
    ast.print(stream);
    return stream.get();
}

function evaluate(code) {
    if (code instanceof AST.AST_Node)
        code = make_code(code, { beautify: true });
    return new Function("return(" + code + ")")();
}

// Try to reminify original input with standard options
// to see if it matches expect_stdout.
async function reminify(test, input_code, input_formatted) {
    if (process.env.TEST_NO_REMINIFY) return true;
    const { options: orig_options, expect_stdout } = test;
    for (var i = 0; i < minify_options.length; i++) {
        var options = JSON.parse(minify_options[i]);
        options.keep_fnames = orig_options.keep_fnames;
        options.keep_classnames = orig_options.keep_classnames;
        if (orig_options.compress) {
            options.compress.keep_classnames =
                orig_options.compress.keep_classnames;
            options.compress.keep_fargs = orig_options.compress.keep_fargs;
            options.compress.keep_fnames = orig_options.compress.keep_fnames;
        }
        if (orig_options.mangle) {
            options.mangle.keep_classnames =
                orig_options.mangle.keep_classnames;
            options.mangle.keep_fnames = orig_options.mangle.keep_fnames;
        }
        var options_formatted = JSON.stringify(options, null, 4);
        var result = await minify(input_code, options);
        if (result.error) {
            log(
                "!!! failed input reminify\n---INPUT---\n{input}\n--ERROR---\n{error}\n\n",
                {
                    input: input_formatted,
                    error: result.error.stack,
                }
            );
            return false;
        } else if (!process.env.TEST_NO_SANDBOX) {
            var stdout = sandbox.run_code(result.code, test.prepend_code);
            if (
                typeof expect_stdout != "string" &&
                typeof stdout != "string" &&
                expect_stdout.name == stdout.name
            ) {
                stdout = expect_stdout;
            }
            if (!sandbox.same_stdout(expect_stdout, stdout)) {
                log(
                    "!!! failed running reminified input\n---INPUT---\n{input}\n---OPTIONS---\n{options}\n---OUTPUT---\n{output}\n---EXPECTED {expected_type}---\n{expected}\n---ACTUAL {actual_type}---\n{actual}\n\n",
                    {
                        input: input_formatted,
                        options: options_formatted,
                        output: result.code,
                        expected_type:
                            typeof expect_stdout == "string"
                                ? "STDOUT"
                                : "ERROR",
                        expected: expect_stdout,
                        actual_type:
                            typeof stdout == "string" ? "STDOUT" : "ERROR",
                        actual: stdout,
                    }
                );
                return false;
            }
        }
    }
    return true;
}
