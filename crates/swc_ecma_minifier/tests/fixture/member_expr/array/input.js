// Invalid
f([][0]);
f([][1]);
f([][-1]);

f([].invalid);
f([]["invalid"]);
f([][[]]);
f([][0+[]]);

// Object symbols
[].constructor;
[].__proto__;
[].__defineGetter__;
[].__defineSetter__;
[].__lookupGetter__;
[].__lookupSetter__;
[].hasOwnProperty;
[].isPrototypeOf;
[].propertyIsEnumerable;
[].toLocaleString;
[].toString;
[].valueOf;

// Array symbols
[].length;
[].at;
[].concat;
[].copyWithin;
[].entries;
[].every;
[].fill;
[].filter;
[].find;
[].findIndex;
[].findLast;
[].findLastIndex;
[].flat;
[].flatMap;
[].forEach;
[].includes;
[].indexOf;
[].join;
[].keys;
[].lastIndexOf;
[].map;
[].pop;
[].push;
[].reduce;
[].reduceRight;
[].reverse;
[].shift;
[].slice;
[].some;
[].sort;
[].splice;
[].toReversed;
[].toSorted;
[].toSpliced;
[].unshift;
[].values;
[].with;
