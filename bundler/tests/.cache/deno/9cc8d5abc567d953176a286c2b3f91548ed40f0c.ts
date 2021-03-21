// Loaded from https://deno.land/x/ramda@v0.27.2/source/internal/_dropLast.js


import take from '../take.js';

export default function dropLast(n, xs) {
  return take(n < xs.length ? xs.length - n : 0, xs);
}
