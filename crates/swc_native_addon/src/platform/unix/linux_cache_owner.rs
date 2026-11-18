//! Trust an overflow owner only when it cannot identify a user in this
//! namespace.

use std::{cell::OnceCell, fs};

/// Keep proc reads local to one validation: a later call may use another user
/// namespace. Ordinary root/current-user ancestors never need these reads.
#[derive(Default)]
pub(super) struct CacheOwner {
    unmapped_overflow: OnceCell<Option<u32>>,
}

impl CacheOwner {
    pub(super) fn trusted_owner(&self, owner: u32, current: u32) -> u32 {
        if owner == 0 || owner == current {
            return owner;
        }
        let overflow = self.unmapped_overflow.get_or_init(|| {
            let result = (|| {
                let overflow = fs::read_to_string("/proc/sys/kernel/overflowuid").ok()?;
                let mapping = fs::read_to_string("/proc/self/uid_map").ok()?;
                unmapped_overflow_uid(&overflow, &mapping)
            })();
            tracing::debug!(?result, "checked native cache overflow owner mapping");
            result
        });
        if *overflow == Some(owner) {
            // An unmapped owner cannot chmod or rename the ancestor from this
            // namespace. Apply root's mode rules, including sticky protection;
            // this does not relax ownership checks on private cache entries.
            0
        } else {
            owner
        }
    }
}

/// Validate every row before trusting the result. The first column contains
/// namespace UIDs; the second contains parent-namespace UIDs and cannot tell us
/// whether the overflow UID identifies a user in the current namespace.
fn unmapped_overflow_uid(overflow: &str, mapping: &str) -> Option<u32> {
    let overflow: u32 = overflow.trim().parse().ok()?;
    if overflow == u32::MAX {
        return None;
    }
    let mut found = false;
    let mut mapped = false;
    for line in mapping.lines() {
        let mut fields = line.split_whitespace();
        let inside: u32 = fields.next()?.parse().ok()?;
        let outside: u32 = fields.next()?.parse().ok()?;
        let count: u32 = fields.next()?.parse().ok()?;
        if fields.next().is_some() || count == 0 {
            return None;
        }
        let end = inside.checked_add(count)?;
        outside.checked_add(count)?;
        mapped |= (inside..end).contains(&overflow);
        found = true;
    }
    (found && !mapped).then_some(overflow)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn owner_mapping_fixtures() {
        for line in include_str!("../../../tests/fixtures/linux-cache-owner.txt").lines() {
            if line.is_empty() || line.starts_with('#') {
                continue;
            }
            let fields: Vec<_> = line.split('|').collect();
            assert_eq!(fields.len(), 4, "{line}");
            let mapping = fields[2].replace(';', "\n");
            let overflow = unmapped_overflow_uid(fields[1], &mapping);
            let expected = match fields[3] {
                "trusted" => Some(65534),
                "rejected" => None,
                _ => panic!("unknown owner fixture: {line}"),
            };
            assert_eq!(overflow, expected, "{}", fields[0]);
            let namespace = CacheOwner {
                unmapped_overflow: OnceCell::from(overflow),
            };
            for (owner, trusted) in [
                (0, true),
                (1000, true),
                (1001, false),
                (65534, expected.is_some()),
            ] {
                let owner = namespace.trusted_owner(owner, 1000);
                for mode in [0o0755, 0o0555, 0o1777] {
                    assert_eq!(
                        super::super::cache_ancestor_is_secure(mode, owner, 1000),
                        trusted,
                        "{line}: {mode:o}"
                    );
                }
                assert!(!super::super::cache_ancestor_is_secure(0o0777, owner, 1000));
            }
        }
    }
}
