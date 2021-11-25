use serde_json::Value;

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
    if *a == *b {
        return true;
    }

    match (&mut *a, &mut *b) {
        (Value::Object(a), Value::Object(b)) => {
            // Normalize all properties
            for (k, v) in &mut *a {
                normalize(&k, v);
            }
            for (k, v) in &mut *b {
                normalize(&k, v);
            }

            if a.is_empty() && b.is_empty() {
                return true;
            }

            a.retain(|key, a_v| {
                if let Some(b_v) = b.get_mut(key) {
                    if diff_json_value(a_v, b_v, normalize) {
                        // Remove from both
                        b.remove(key);
                        return false;
                    }
                } else {
                    // Remove if a.foo is null and b does not have foo
                    match a_v {
                        Value::Null => return false,
                        _ => {}
                    }
                }

                // Preserve by default
                true
            });
            b.retain(|key, b_v| {
                // Remove if b.foo is null and a does not have foo
                match b_v {
                    Value::Null => {
                        if !a.contains_key(key) {
                            return false;
                        }
                    }
                    _ => {}
                }

                // Preserve by default

                true
            });
        }

        (Value::Array(a), Value::Array(b)) => {
            for v in a.iter_mut().chain(b.iter_mut()) {
                match v {
                    Value::Object(v) => {
                        for (k, v) in v {
                            normalize(&k, v);
                        }
                    }

                    _ => {}
                }
            }

            if a.len() == b.len() {
                for (a_v, b_v) in a.iter_mut().zip(b.iter_mut()) {
                    diff_json_value(a_v, b_v, normalize);
                }
            }
        }

        _ => {}
    }

    false
}
