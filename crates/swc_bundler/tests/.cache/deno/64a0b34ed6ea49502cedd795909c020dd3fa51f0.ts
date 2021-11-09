// Loaded from https://deno.land/x/ramda@v0.27.2/source/internal/_arrayFromIterator.js


export default function _arrayFromIterator(iter) {
  var list = [];
  var next;
  while (!(next = iter.next()).done) {
    list.push(next.value);
  }
  return list;
}
