function init() {
  globalThis.ready = true;
  return 1;
}
function main() {
  var r = init();
  console.log(globalThis.ready, r);
}
globalThis.ready = false;
main();
