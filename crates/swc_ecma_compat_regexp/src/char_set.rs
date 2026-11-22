//! Sets of code points (or UTF-16 code units in non-unicode mode).

/// The largest code point.
pub(crate) const MAX_CODE_POINT: u32 = 0x10ffff;

/// The largest UTF-16 code unit. Patterns without the `u` or `v` flag match
/// code units, not code points.
pub(crate) const MAX_CODE_UNIT: u32 = 0xffff;

/// A set of code points, stored as sorted inclusive ranges.
///
/// The ranges never overlap and are never adjacent, so two equal sets always
/// have the same representation.
#[derive(Debug, Clone, Default, PartialEq, Eq)]
pub(crate) struct CharSet {
    ranges: Vec<(u32, u32)>,
}

impl CharSet {
    /// Creates a set from ranges in any order. Overlapping and adjacent ranges
    /// are merged.
    pub(crate) fn from_ranges(ranges: impl IntoIterator<Item = (u32, u32)>) -> Self {
        let mut ranges: Vec<(u32, u32)> = ranges.into_iter().collect();
        ranges.sort_unstable();

        let mut merged: Vec<(u32, u32)> = Vec::with_capacity(ranges.len());
        for (start, end) in ranges {
            match merged.last_mut() {
                Some(last) if start <= last.1.saturating_add(1) => {
                    last.1 = last.1.max(end);
                }
                _ => merged.push((start, end)),
            }
        }

        Self { ranges: merged }
    }

    /// Creates a set that contains one code point.
    pub(crate) fn single(cp: u32) -> Self {
        Self {
            ranges: vec![(cp, cp)],
        }
    }

    /// Returns the sorted inclusive ranges of the set.
    pub(crate) fn ranges(&self) -> &[(u32, u32)] {
        &self.ranges
    }

    pub(crate) fn is_empty(&self) -> bool {
        self.ranges.is_empty()
    }

    /// Returns the number of code points in the set.
    pub(crate) fn len(&self) -> u64 {
        self.ranges
            .iter()
            .map(|&(start, end)| u64::from(end - start) + 1)
            .sum()
    }

    pub(crate) fn contains(&self, cp: u32) -> bool {
        self.ranges
            .binary_search_by(|&(start, end)| {
                if end < cp {
                    std::cmp::Ordering::Less
                } else if start > cp {
                    std::cmp::Ordering::Greater
                } else {
                    std::cmp::Ordering::Equal
                }
            })
            .is_ok()
    }

    /// Returns the code points in the set, in ascending order.
    pub(crate) fn iter(&self) -> impl Iterator<Item = u32> + '_ {
        self.ranges.iter().flat_map(|&(start, end)| start..=end)
    }

    pub(crate) fn union(&self, other: &Self) -> Self {
        if other.is_empty() {
            return self.clone();
        }
        if self.is_empty() {
            return other.clone();
        }
        Self::from_ranges(self.ranges.iter().chain(other.ranges.iter()).copied())
    }

    pub(crate) fn intersection(&self, other: &Self) -> Self {
        let mut ranges = Vec::new();
        let (mut i, mut j) = (0, 0);

        while i < self.ranges.len() && j < other.ranges.len() {
            let (a_start, a_end) = self.ranges[i];
            let (b_start, b_end) = other.ranges[j];

            let start = a_start.max(b_start);
            let end = a_end.min(b_end);
            if start <= end {
                ranges.push((start, end));
            }

            if a_end < b_end {
                i += 1;
            } else {
                j += 1;
            }
        }

        Self { ranges }
    }

    pub(crate) fn difference(&self, other: &Self) -> Self {
        if other.is_empty() {
            return self.clone();
        }
        self.intersection(&other.complement(MAX_CODE_POINT))
    }

    /// Returns the code points in `0..=max` that are not in the set.
    pub(crate) fn complement(&self, max: u32) -> Self {
        let mut ranges = Vec::with_capacity(self.ranges.len() + 1);
        let mut next = 0u32;

        for &(start, end) in &self.ranges {
            if start > max {
                break;
            }
            if next < start {
                ranges.push((next, start - 1));
            }
            next = end.saturating_add(1);
        }

        if next <= max {
            ranges.push((next, max));
        }

        Self { ranges }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn from_ranges_merges_overlapping_and_adjacent_ranges() {
        let set = CharSet::from_ranges([(5, 7), (1, 2), (3, 4), (10, 12), (11, 20)]);
        assert_eq!(set.ranges(), &[(1, 7), (10, 20)]);
    }

    #[test]
    fn set_operations() {
        let a = CharSet::from_ranges([(0, 10), (20, 30)]);
        let b = CharSet::from_ranges([(5, 25)]);

        assert_eq!(a.union(&b).ranges(), &[(0, 30)]);
        assert_eq!(a.intersection(&b).ranges(), &[(5, 10), (20, 25)]);
        assert_eq!(a.difference(&b).ranges(), &[(0, 4), (26, 30)]);
        assert_eq!(
            a.complement(MAX_CODE_UNIT).ranges(),
            &[(11, 19), (31, MAX_CODE_UNIT)]
        );
        assert_eq!(a.len(), 22);
        assert!(a.contains(25));
        assert!(!a.contains(15));
    }
}
