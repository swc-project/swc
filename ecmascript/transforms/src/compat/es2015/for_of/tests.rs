use super::*;

test!(::swc_ecma_parser::Syntax::default(),
    ForOf,
    spec_identifier,
    r#"for (i of arr) {
}"#,
    r#"var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;

try {
  for (var _iterator = arr[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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
}"#,ok_if_code_eq
);

test!(::swc_ecma_parser::Syntax::default(),ForOf, spec_ignore_cases, r#"for (var i of foo) {
  switch (i) {
    case 1:
      break;
  }
}"#, r#"var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;

try {
  for (var _iterator = foo[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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
}"#, ok_if_code_eq);

test!(::swc_ecma_parser::Syntax::default(),ForOf, spec_let, r#"for (let i of arr) {

}"#, r#"
var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;

try {
  for (var _iterator = arr[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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
ok_if_code_eq);

test!(::swc_ecma_parser::Syntax::default(),ForOf, spec_member_expr, r#"for (obj.prop of arr) {

}"#, r#"var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;

try {
  for (var _iterator = arr[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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
ok_if_code_eq);

test!(::swc_ecma_parser::Syntax::default(),ForOf, spec_multiple, r#"for (var i of arr) {

}

for (var i of numbers) {

}
"#, r#"var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;

try {
  for (var _iterator = arr[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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
  for (var _iterator1 = numbers[Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true) {
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
}"#, ok_if_code_eq);

test!(::swc_ecma_parser::Syntax::default(),ForOf, spec_nested_label_for_of, r#"b: for (let c of d()) {
  for (let e of f()) {
    continue b;
  }
}"#, r#"var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;

try {
  b: for (var _iterator = d()[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
    let c = _step.value;
    var _iteratorNormalCompletion1 = true, _didIteratorError1 = false, _iteratorError1 = undefined;

    try {
      for (var _iterator1 = f()[Symbol.iterator](), _step1; !(_iteratorNormalCompletion1 = (_step1 = _iterator1.next()).done); _iteratorNormalCompletion1 = true) {
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
}"#, ok_if_code_eq);

test!(::swc_ecma_parser::Syntax::default(),ForOf, spec_var, r#"for (var i of arr) {

}"#, r#"var _iteratorNormalCompletion = true, _didIteratorError = false, _iteratorError = undefined;

try {
  for (var _iterator = arr[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
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
}"#, ok_if_code_eq);
