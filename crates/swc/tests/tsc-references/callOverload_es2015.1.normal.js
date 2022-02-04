var n;
fn(1) // no error
;
fn(1, 2, 3, 4);
takeTwo(1, 2, 3, 4);
withRest('a', ...n); // no error
withRest();
withRest(...n);
