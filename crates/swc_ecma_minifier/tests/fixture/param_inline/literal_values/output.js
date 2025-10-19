// Various literal types that can be inlined
function literals() {
  const str = "hello";
  const num = 42;
  const bool = true;
  const nil = null;
  console.log(str, num, bool, nil);
  return str + num;
}

literals();
literals();
literals();
