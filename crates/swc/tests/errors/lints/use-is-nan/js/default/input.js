if (foo == NaN) {}

if (NaN == foo) {}

if (foo != NaN) {}

if (foo == Number.NaN) {}

if (foo != Number.NaN) {}

if (foo == Number['NaN']) {}

if (foo === NaN) {}

if (foo == Number.MAX_SAFE_INTEGER) {}

if (foo == Obj.NaN) {}


myArray.indexOf(NaN);

myArray.lastIndexOf(NaN);

myArray.lastIndexOf(Number.NaN);

myArray.lastIndexOf(Number['NaN']);

myArray.lastIndexOf(NoN);

myArray.lastIndexOf(1);

switch (foo) {
  case NaN:
      bar();
      break;
  case 1:
      baz();
      break;
}

switch (NaN) {
  case a:
      bar();
      break;
  case b:
      baz();
      break;
  // ...
}
