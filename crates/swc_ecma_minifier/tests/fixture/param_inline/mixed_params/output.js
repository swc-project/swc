// Mixed parameters - some inlinable, some not
function mixed(foo, callback) {
  const debug = undefined;
  if (debug) {
    console.log("Debug:", foo);
  }
  return callback(foo);
}

// callback varies, debug is always undefined
mixed("a", x => x * 2);
mixed("b", x => x + 1);
mixed("c", x => x - 1);
