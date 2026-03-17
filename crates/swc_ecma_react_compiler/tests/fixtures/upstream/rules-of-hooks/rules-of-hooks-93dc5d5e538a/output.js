// Valid because the loop doesn't change the order of hooks calls.
function RegressionTest() {
  const res = [];

  for (let i = 0; i !== 10 && true; ++i) {
    res.push(i);
  }

  React.useLayoutEffect(_temp);
}
function _temp() {}
