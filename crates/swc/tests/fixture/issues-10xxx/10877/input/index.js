for (var value in (() => {
  let { property, ...rest } = foo;
  return rest;
})()) {
  console.log(value);
}

