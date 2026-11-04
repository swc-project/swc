if (a == NaN) {}

switch (NaN as any) {
  case NaN as any:
  case Number.NaN as any:
  case 1:
      baz();
}

if (foo == Number.NaN as any) {}

myArray.lastIndexOf(NaN as any);

myArray.lastIndexOf(Number.NaN as any);

myArray.lastIndexOf(Number['NaN'] as any);
