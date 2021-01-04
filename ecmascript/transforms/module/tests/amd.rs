// for_of_as_array_for_of_import_amd
test!(
    syntax(),
    |_| chain!(
        for_of(Config { assume_array: true }),
        amd(Default::default())
    ),
    for_of_as_array_for_of_import_amd,
    r#"
import { array } from "foo";

for (const elm of array) {
  console.log(elm);
}

"#,
    r#"
define(["foo"], function (_foo) {
  "use strict";

  for(let _i = 0; _i < _foo.array.length; _i++){
    const elm = _foo.array[_i];
    console.log(elm);
  }
});

"#
);
