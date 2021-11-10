use std::cmp::Ordering;

pub(crate) fn is_sorted_by<T, F>(mut items: impl Iterator<Item = T>, mut compare: F) -> bool
where
    T: Copy,
    F: FnMut(&T, &T) -> Option<Ordering>,
{
    let mut last = match items.next() {
        Some(e) => e,
        None => return true,
    };

    while let Some(curr) = items.next() {
        if let Some(Ordering::Greater) | None = compare(&last, &curr) {
            return false;
        }
        last = curr;
    }

    true
}

pub(crate) fn is_sorted_by_key<T, F, K>(items: impl Iterator<Item = T>, key: F) -> bool
where
    T: Copy,
    F: FnMut(T) -> K,
    K: Copy + PartialOrd,
{
    is_sorted_by(items.map(key), PartialOrd::partial_cmp)
}
