// Loaded from https://deno.land/x/ramda@v0.27.2/source/indexBy.js


import reduceBy from './reduceBy.js';


/**
 * Given a function that generates a key, turns a list of objects into an
 * object indexing the objects by the given key. Note that if multiple
 * objects generate the same value for the indexing key only the last value
 * will be included in the generated object.
 *
 * Acts as a transducer if a transformer is given in list position.
 *
 * @func
 * @memberOf R
 * @since v0.19.0
 * @category List
 * @typedefn Idx = String | Int | Symbol
 * @sig Idx a => (b -> a) -> [b] -> {a: b}
 * @param {Function} fn Function :: a -> Idx
 * @param {Array} array The array of objects to index
 * @return {Object} An object indexing each array element by the given property.
 * @see R.groupBy
 * @example
 *
 *      const list = [{id: 'xyz', title: 'A'}, {id: 'abc', title: 'B'}];
 *      R.indexBy(R.prop('id'), list);
 *      //=> {abc: {id: 'abc', title: 'B'}, xyz: {id: 'xyz', title: 'A'}}
 */
var indexBy = reduceBy(function(acc, elem) { return elem; }, null);
export default indexBy;
