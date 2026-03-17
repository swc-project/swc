function log() {}

function Foo(cond) {
  let str = "";
  if (cond) {
    log("other test");
  } else {
    str = "fallthrough test";
  }

  log(str);
}
