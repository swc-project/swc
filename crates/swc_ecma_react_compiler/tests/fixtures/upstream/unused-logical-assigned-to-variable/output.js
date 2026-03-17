function Component(props) {
  const obj = makeObject();
  const obj2 = makeObject();
  (obj.a ?? obj2.b) || props.c;
  return null;
}
