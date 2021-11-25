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
            a.retain(|key, a_v| {
                normalize(&key, a_v);

                if let Some(b_v) = b.get_mut(key) {
                    normalize(&key, b_v);

                    if diff_json_value(a_v, b_v, normalize) {
                        b.remove(key);
                        return false;
                    }
                }

                true
            });
        }

        (Value::Array(a), Value::Array(b)) => {
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
