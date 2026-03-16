// Regression test for incorrectly flagged valid code.
function RegressionTest() {
  cond ? a : b;
  useState();
}
