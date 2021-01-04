use swc_ecma_parser::Syntax;
use swc_ecma_transforms_compat::es2015::for_of::for_of;
use swc_ecma_transforms_compat::es2015::for_of::Config;
use swc_ecma_transforms_testing::test;
use swc_ecma_transforms_testing::test_exec;

fn syntax() -> Syntax {
    Default::default()
}

test!(
    syntax(),
    |_| for_of(Default::default()),
    spec_identifier,
    r#"for (i of arr) {
}"#,
    r#"var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;

try {
  for (var _iterator = arr[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step =
      _iterator.next()).done); _iteratorNormalCompletion = true) {
    i = _step.value;
  }
} catch (err) {
  _didIteratorError = true;
  _iteratorError = err;
} finally {
  try {
    if (!_iteratorNormalCompletion && _iterator.return != null) {
      _iterator.return();
    }
  } finally {
    if (_didIteratorError) {
      throw _iteratorError;
    }
  }
}"#,
    ok_if_code_eq
);

test!(
    syntax(),
    |_| for_of(Default::default()),
    spec_ignore_cases,
    r#"for (var i of foo) {
  switch (i) {
    case 1:
      break;
  }
}"#,
    r#"var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;

try {
  for (var _iterator = foo[Symbol.iterator](), _step; !(_iteratorNormalCompletion =
      (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
    var i = _step.value;

    switch (i) {
      case 1:
        break;
    }
  }
} catch (err) {
  _didIteratorError = true;
  _iteratorError = err;
} finally {
  try {
    if (!_iteratorNormalCompletion && _iterator.return != null) {
      _iterator.return();
    }
  } finally {
    if (_didIteratorError) {
      throw _iteratorError;
    }
  }
}"#,
    ok_if_code_eq
);

test!(
    syntax(),
    |_| for_of(Default::default()),
    spec_let,
    r#"for (let i of arr) {

}"#,
    r#"
var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;

try {
  for (var _iterator = arr[Symbol.iterator](), _step; !(_iteratorNormalCompletion =
      (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
    let i = _step.value;
  }
} catch (err) {
  _didIteratorError = true;
  _iteratorError = err;
} finally {
  try {
    if (!_iteratorNormalCompletion && _iterator.return != null) {
      _iterator.return();
    }
  } finally {
    if (_didIteratorError) {
      throw _iteratorError;
    }
  }
}"#,
    ok_if_code_eq
);

test!(
    syntax(),
    |_| for_of(Default::default()),
    spec_member_expr,
    r#"for (obj.prop of arr) {

}"#,
    r#"var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;

try {
  for (var _iterator = arr[Symbol.iterator](), _step; !(_iteratorNormalCompletion =
      (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
    obj.prop = _step.value;
  }
} catch (err) {
  _didIteratorError = true;
  _iteratorError = err;
} finally {
  try {
    if (!_iteratorNormalCompletion && _iterator.return != null) {
      _iterator.return();
    }
  } finally {
    if (_didIteratorError) {
      throw _iteratorError;
    }
  }
}"#,
    ok_if_code_eq
);

test!(
    syntax(),
    |_| for_of(Default::default()),
    spec_multiple,
    r#"for (var i of arr) {

}

for (var i of numbers) {

}
"#,
    r#"var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;

try {
  for (var _iterator = arr[Symbol.iterator](), _step; !(_iteratorNormalCompletion =
      (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
    var i = _step.value;
  }
} catch (err) {
  _didIteratorError = true;
  _iteratorError = err;
} finally {
  try {
    if (!_iteratorNormalCompletion && _iterator.return != null) {
      _iterator.return();
    }
  } finally {
    if (_didIteratorError) {
      throw _iteratorError;
    }
  }
}

var _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;

try {
  for (var _iterator1 = numbers[Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 =
      (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true) {
    var i = _step1.value;
  }
} catch (err) {
  _didIteratorError1 = true;
  _iteratorError1 = err;
} finally {
  try {
    if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
      _iterator1.return();
    }
  } finally {
    if (_didIteratorError1) {
      throw _iteratorError1;
    }
  }
}"#,
    ok_if_code_eq
);

test!(
    syntax(),
    |_| for_of(Default::default()),
    spec_nested_label_for_of,
    r#"b: for (let c of d()) {
  for (let e of f()) {
    continue b;
  }
}"#,
    r#"var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;

try {
  b: for (var _iterator = d()[Symbol.iterator](), _step; !(_iteratorNormalCompletion =
      (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
    let c = _step.value;
    var _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;

    try {
      for (var _iterator1 = f()[Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 =
          (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true) {
        let e = _step1.value;
        continue b;
      }
    } catch (err) {
      _didIteratorError1 = true;
      _iteratorError1 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion1 && _iterator1.return != null) {
          _iterator1.return();
        }
      } finally {
        if (_didIteratorError1) {
          throw _iteratorError1;
        }
      }
    }
  }
} catch (err) {
  _didIteratorError = true;
  _iteratorError = err;
} finally {
  try {
    if (!_iteratorNormalCompletion && _iterator.return != null) {
      _iterator.return();
    }
  } finally {
    if (_didIteratorError) {
      throw _iteratorError;
    }
  }
}"#,
    ok_if_code_eq
);

test!(
    syntax(),
    |_| for_of(Default::default()),
    spec_var,
    r#"for (var i of arr) {

}"#,
    r#"var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;

try {
  for (var _iterator = arr[Symbol.iterator](), _step; !(_iteratorNormalCompletion =
      (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
    var i = _step.value;
  }
} catch (err) {
  _didIteratorError = true;
  _iteratorError = err;
} finally {
  try {
    if (!_iteratorNormalCompletion && _iterator.return != null) {
      _iterator.return();
    }
  } finally {
    if (_didIteratorError) {
      throw _iteratorError;
    }
  }
}"#,
    ok_if_code_eq
);

// for_of_as_array_for_of
test!(
    syntax(),
    |_| for_of(Config { assume_array: true }),
    for_of_as_array_for_of,
    r#"
let elm;

for (elm of array) {
  console.log(elm);
}

"#,
    r#"
let elm;

for(let _i = 0; _i < array.length; _i++){
  elm = array[_i];
  console.log(elm);
}

"#
);

// for_of_as_array_for_of_array_pattern
test!(
    syntax(),
    |_| for_of(Config { assume_array: true }),
    for_of_as_array_for_of_array_pattern,
    r#"
let elm;
for ([elm] of array) {
  console.log(elm);
}

"#,
    r#"
let elm;

for(let _i = 0; _i < array.length; _i++){
  [elm] = array[_i];
  console.log(elm);
}

"#
);

// regression_redeclare_array_8913
test!(
    syntax(),
    |_| for_of(Config { assume_array: true }),
    regression_redeclare_array_8913,
    r#"
function f(...t) {
  for (let o of t) {
    const t = o;
  }
}

"#,
    r#"
function f(...t) {
  for(let _i = 0; _i < t.length; _i++){
    let o = t[_i];
    const t = o;
  }
}

"#
);

// for_of_as_array_for_of_declaration_array_pattern
test!(
    syntax(),
    |_| for_of(Config { assume_array: true }),
    for_of_as_array_for_of_declaration_array_pattern,
    r#"
for (const [elm] of array) {
  console.log(elm);
}

"#,
    r#"
for(let _i = 0; _i < array.length; _i++){
    const [elm] = array[_i];
    console.log(elm);
}
"#
);

// for_of_as_array_for_of_expression
test!(
    syntax(),
    |_| for_of(Config { assume_array: true }),
    for_of_as_array_for_of_expression,
    r#"
let i;
for (i of items) i;

"#,
    r#"
let i;

for(let _i = 0; _i < items.length; _i++){
  i = items[_i];
  i;
}

"#
);

// for_of_as_array_for_of_declaration
test!(
    syntax(),
    |_| for_of(Config { assume_array: true }),
    for_of_as_array_for_of_declaration,
    r#"
for (const elm of array) {
  console.log(elm);
}

"#,
    r#"
for(let _i = 0; _i < array.length; _i++){
  const elm = array[_i];
  console.log(elm);
}

"#
);

// regression_scope_9696
test_exec!(
    syntax(),
    |_| for_of(Config {
        ..Default::default()
    }),
    regression_scope_9696_exec,
    r#"
var arr = [1, 2, 3];
var results = [];

for (let v of arr) {
  results.push(v);
  arr = null;
}

expect(results).toEqual([1, 2, 3]);

"#
);

// for_of_as_array_for_of_static_declaration
test!(
    syntax(),
    |_| for_of(Config { assume_array: true }),
    for_of_as_array_for_of_static_declaration,
    r#"
const array = [];

for (const elm of array) {
  console.log(elm);
}

"#,
    r#"
const array = [];

for(let _i = 0; _i < array.length; _i++){
  const elm = array[_i];
  console.log(elm);
}

"#
);

// for_of_as_array_for_of_static
test!(
    syntax(),
    |_| for_of(Config { assume_array: true }),
    for_of_as_array_for_of_static,
    r#"
const array = [];
let elm;

for (elm of array) {
  console.log(elm);
}

"#,
    r#"
const array = [];
let elm;

for (let _i = 0; _i < array.length; _i++) {
  elm = array[_i];
  console.log(elm);
}

"#
);

// for_of_as_array_for_of_import_es2015
test!(
    syntax(),
    |_| for_of(Config { assume_array: true }),
    for_of_as_array_for_of_import_es2015,
    r#"
import { array } from "foo";

for (const elm of array) {
  console.log(elm);
}

"#,
    r#"
import { array } from "foo";

for(let _i = 0; _i < array.length; _i++){
  const elm = array[_i];
  console.log(elm);
}

"#
);

// regression_label_object_with_comment_4995
test!(
    syntax(),
    |_| for_of(Config {
        ..Default::default()
    }),
    regression_label_object_with_comment_4995,
    r#"
myLabel: //woops
for (let a of b) {
  continue myLabel;
}

"#,
    r#"
var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;

try {
  myLabel: //woops
  for (var _iterator = b[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
    let a = _step.value;
    continue myLabel;
  }
} catch (err) {
  _didIteratorError = true;
  _iteratorError = err;
} finally {
  try {
    if (!_iteratorNormalCompletion && _iterator.return != null) {
      _iterator.return();
    }
  } finally {
    if (_didIteratorError) {
      throw _iteratorError;
    }
  }
}

"#
);

// regression_if_label_3858
test!(
    syntax(),
    |_| for_of(Config { assume_array: true }),
    regression_if_label_3858,
    r#"
if ( true )
  loop: for (let ch of []) {
  }


"#,
    r#"
if (true) loop: for(let _i = 0, _iter = []; _i < _iter.length; _i++){
    let ch = _iter[_i];
  }


"#
);
