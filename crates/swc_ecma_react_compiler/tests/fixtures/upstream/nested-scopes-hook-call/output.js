function component(props) {
  const x = [];
  const y = [];
  y.push(useHook(props.foo));
  x.push(y);
  return x;
}
