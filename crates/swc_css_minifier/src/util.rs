use std::mem::take;

use swc_common::EqIgnoreSpan;

pub(crate) fn dedup<T>(v: &mut Vec<T>)
where
    T: EqIgnoreSpan,
{
    let mut remove_list = Vec::new();

    for (i, i1) in v.iter().enumerate() {
        for (j, j1) in v.iter().enumerate() {
            if i < j && i1.eq_ignore_span(j1) {
                remove_list.push(j);
            }
        }
    }

    // Fast path. We don't face real duplicates in most cases.
    if remove_list.is_empty() {
        return;
    }

    let new = take(v)
        .into_iter()
        .enumerate()
        .filter_map(|(idx, value)| {
            if remove_list.contains(&idx) {
                None
            } else {
                Some(value)
            }
        })
        .collect::<Vec<_>>();

    *v = new;
}
