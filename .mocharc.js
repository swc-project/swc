/**
 * https://github.com/swc-project/swc/pull/3009
 *
 * There are 2 test runners in this repo:
 * - jest is being used for unit testing node-swc packages with javascript test cases
 * - mocha is being used for cargo's test requires js runtime to validate its transform.
 *
 * This config is for the mocha test runner invoked by cargo to resolve its global setup file.
 */
module.exports = {
    require: require.resolve("./.mocha.setup.js"),
};
