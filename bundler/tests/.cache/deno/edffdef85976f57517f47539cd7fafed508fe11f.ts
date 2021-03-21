// Loaded from https://deno.land/x/ramda@v0.27.2/source/internal/_reduced.js


export default function _reduced(x) {
  return x && x['@@transducer/reduced'] ? x :
    {
      '@@transducer/value': x,
      '@@transducer/reduced': true
    };
}
