use std::cmp::Ordering;

pub(crate) fn is_sorted_by<I, T, F>(mut items: I, mut compare: F) -> bool
where
    I: Iterator<Item = T>,
    T: Copy,
    F: FnMut(&T, &T) -> Option<Ordering>,
{
    let last = match items.next() {
        Some(e) => e,
        None => return true,
    };

    items
        .try_fold(last, |last, curr| {
            if let Some(Ordering::Greater) | None = compare(&last, &curr) {
                return Err(());
            }
            Ok(curr)
        })
        .is_ok()
}
