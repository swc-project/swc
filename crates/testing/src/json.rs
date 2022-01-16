use serde_json::Value;

fn normalize_value_recursively(v: &mut Value, normalize: &mut dyn FnMut(&str, &mut Value)) {
    match v {
        Value::Array(arr) => {
            for v in arr {
                normalize_value_recursively(v, normalize);
            }
        }

        Value::Object(obj) => {
            for (k, v) in obj.iter_mut() {
                normalize(k, v);
            }

            for (_, v) in obj.iter_mut() {
                normalize_value_recursively(v, normalize);
            }
        }

        _ => {}
    }
}

/// Remove common properties, recursively. You can optionally normalize more by
/// passing a closure.
///
/// Closure takes `(key, value)`.
///
/// Returns `true` if `actual` and `expected` are equal.
pub fn diff_json_value(
    a: &mut Value,
    b: &mut Value,
    normalize: &mut dyn FnMut(&str, &mut Value),
) -> bool {
    normalize_value_recursively(a, normalize);
    normalize_value_recursively(b, normalize);

    remove_common(a, b)
}

fn remove_common(a: &mut Value, b: &mut Value) -> bool {
    if *a == *b {
        return true;
    }

    match (&mut *a, &mut *b) {
        (Value::Object(a), Value::Object(b)) => {
            if a.is_empty() && b.is_empty() {
                return true;
            }

            a.retain(|key, a_v| {
                if let Some(b_v) = b.get_mut(key) {
                    if remove_common(a_v, b_v) {
                        // Remove from both
                        b.remove(key);
                        return false;
                    }
                } else {
                    // Remove if a.foo is null and b does not have foo
                    if a_v == &Value::Null {
                        return false;
                    }
                }

                // Preserve by default
                true
            });
            b.retain(|key, b_v| {
                // Remove if b.foo is null and a does not have foo
                if b_v == &Value::Null && !a.contains_key(key) {
                    return false;
                }

                // Preserve by default

                true
            });
        }

        (Value::Array(a), Value::Array(b)) => {
            if a.len() == b.len() {
                for (a_v, b_v) in a.iter_mut().zip(b.iter_mut()) {
                    remove_common(a_v, b_v);
                }
            }
        }

        _ => {}
    }

    false
}
