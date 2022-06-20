use std::{collections::HashSet, hash::Hash, str::FromStr};

use anyhow::Context as _;

pub(crate) fn parse_hash_set<T>(
    s: &str,
) -> Result<HashSet<T>, Box<dyn std::error::Error + Send + Sync + 'static>>
where
    T: FromStr + Eq + Hash,
    T::Err: std::error::Error + Send + Sync + 'static,
{
    let mut set = HashSet::new();
    for s in s.split(',').map(|s| s.trim()) {
        let item = s
            .parse::<T>()
            .with_context(|| format!("Failed to parse '{}' into a valid type", s))?;
        set.insert(item);
    }
    Ok(set)
}
