function componentA(props) {
  let t = `hello ${props.a}, ${props.b}!`;
  t = t + "";
  return t;
}

function componentB(props) {
  const x = useFoo(`hello ${props.a}`);
  return x;
}
