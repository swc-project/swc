function Component(props) {
  const obj = makeObject();
  obj.a?.b?.(props.c);
  return null;
}
