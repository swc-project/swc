cargo run --example transform
for test in es6-createrequire es6 commonjs ; do
    diff ./examples/output-$test-actual.js ./examples/output-$test-expected.js
done
