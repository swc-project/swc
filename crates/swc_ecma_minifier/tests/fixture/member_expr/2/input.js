// Invalid
[][0];
[][1];
[][-1];

[].invalid;
[]["invalid"];
[][[]];
[][0+[]];

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
