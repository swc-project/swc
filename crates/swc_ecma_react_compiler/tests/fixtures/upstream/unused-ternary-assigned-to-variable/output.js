function Component(props) {
  const obj = makeObject();
  obj.a ? props.b : props.c;
  return null;
}
