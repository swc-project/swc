// Loaded from https://deno.land/x/ramda@v0.27.2/source/internal/_functionName.js


export default function _functionName(f) {
  // String(x => x) evaluates to "x => x", so the pattern may not match.
  var match = String(f).match(/^function (\w*)/);
  return match == null ? '' : match[1];
}
