use super::encode::ScopePosition;

#[derive(Debug, Clone)]
pub(crate) struct MappingPoint {
    pub original: ScopePosition,
    pub generated: ScopePosition,
    pub generated_name: Option<String>,
}

#[derive(Debug, Clone, Default)]
pub(crate) struct MappingIndex {
    per_source: Vec<Vec<MappingPoint>>,
}

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub(crate) struct GeneratedInterval {
    pub start: ScopePosition,
    pub end: ScopePosition,
}

impl MappingIndex {
    pub(crate) fn source_points(&self, source_idx: u32) -> &[MappingPoint] {
        self.per_source
            .get(source_idx as usize)
            .map(Vec::as_slice)
            .unwrap_or_default()
    }

    #[cfg(test)]
    pub(crate) fn from_points(per_source: Vec<Vec<MappingPoint>>) -> Self {
        Self { per_source }
    }
}

pub(crate) fn build_mapping_index(
    map: &swc_sourcemap::SourceMap,
    sources_len: usize,
) -> MappingIndex {
    let mut per_source = vec![Vec::new(); sources_len];

    for token in map.tokens() {
        if !token.has_source() {
            continue;
        }

        let source_idx = token.get_src_id() as usize;
        if source_idx >= sources_len {
            continue;
        }

        let src_line = token.get_src_line();
        let src_col = token.get_src_col();
        if src_line == u32::MAX || src_col == u32::MAX {
            continue;
        }

        per_source[source_idx].push(MappingPoint {
            original: ScopePosition {
                line: src_line,
                column: src_col,
            },
            generated: ScopePosition {
                line: token.get_dst_line(),
                column: token.get_dst_col(),
            },
            generated_name: token.get_name().map(|name| name.to_string()),
        });
    }

    for points in &mut per_source {
        points.sort_by(|a, b| {
            a.original
                .cmp(&b.original)
                .then_with(|| a.generated.cmp(&b.generated))
        });
        points.dedup_by(|a, b| {
            a.original == b.original
                && a.generated == b.generated
                && a.generated_name == b.generated_name
        });
    }

    MappingIndex { per_source }
}

pub(crate) fn resolve_generated_interval(
    mappings: &MappingIndex,
    source_idx: u32,
    start: ScopePosition,
    end: ScopePosition,
) -> Option<GeneratedInterval> {
    let points = mappings.source_points(source_idx);
    if points.is_empty() {
        return None;
    }

    let mut min_generated = None;
    let mut max_generated = None;

    for point in points_in_original_range(mappings, source_idx, start, end) {
        min_generated = Some(match min_generated {
            Some(current) => std::cmp::min(current, point.generated),
            None => point.generated,
        });
        max_generated = Some(match max_generated {
            Some(current) => std::cmp::max(current, point.generated),
            None => point.generated,
        });
    }

    let start = min_generated?;
    let mut end = bump_position(max_generated?);
    if end <= start {
        end = bump_position(start);
    }

    Some(GeneratedInterval { start, end })
}

pub(crate) fn points_in_original_range(
    mappings: &MappingIndex,
    source_idx: u32,
    start: ScopePosition,
    end: ScopePosition,
) -> Vec<&MappingPoint> {
    let points = mappings.source_points(source_idx);
    if points.is_empty() {
        return Vec::new();
    }

    let mut rv = Vec::new();
    let mut idx = points.partition_point(|point| point.original < start);

    while idx < points.len() && points[idx].original <= end {
        rv.push(&points[idx]);
        idx += 1;
    }

    rv
}

pub(crate) fn position_in_generated_range(
    pos: ScopePosition,
    start: ScopePosition,
    end: ScopePosition,
) -> bool {
    start <= pos && pos < end
}

fn bump_position(pos: ScopePosition) -> ScopePosition {
    ScopePosition {
        line: pos.line,
        column: pos.column.saturating_add(1),
    }
}
