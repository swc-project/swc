// Invalid
({}[0]);
({}.invalid);
({}["invalid"]);
({}[[]]);
({}[0+[]]);

// Object symbols
({}.constructor);
({}.__proto__);
({}.__defineGetter__);
({}.__defineSetter__);
({}.__lookupGetter__);
({}.__lookupSetter__);
({}.hasOwnProperty);
({}.isPrototypeOf);
({}.propertyIsEnumerable);
({}.toLocaleString);
({}.toString);
({}.valueOf);
