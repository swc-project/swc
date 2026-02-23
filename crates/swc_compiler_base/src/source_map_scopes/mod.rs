use std::{
    any::Any,
    path::{Path, PathBuf},
};

use anyhow::{Context, Error};
use rustc_hash::FxHashMap;
use serde_json::{Map, Value};
use swc_common::{sync::Lrc, BytePos, FileName, SourceMap};
use swc_ecma_ast::{Module, Program, Script};
use swc_ecma_codegen::Node;
use swc_ecma_visit::VisitWith;

use self::{
    bindings::build_scope_bindings,
    collect::{collect_scopes, CollectedScopes, ScopeCollector},
    encode::{encode_scopes, GeneratedRange, OriginalScope, ScopeInfo, ScopePosition},
    positions::{build_mapping_index, resolve_generated_interval, MappingIndex},
};

mod bindings;
pub(crate) mod collect;
mod encode;
mod positions;
#[cfg(test)]
mod tests;
mod vlq;

#[derive(Debug, Clone)]
pub(crate) struct SourceResolver {
    source_file_name: Option<String>,
    output_path: Option<PathBuf>,
    source_to_idx: FxHashMap<String, u32>,
}

impl SourceResolver {
    pub(crate) fn new(
        source_file_name: Option<&str>,
        output_path: Option<&Path>,
        sources: &[String],
    ) -> Self {
        let mut source_to_idx = FxHashMap::default();
        for (idx, source) in sources.iter().enumerate() {
            source_to_idx.entry(source.clone()).or_insert(idx as u32);
        }

        Self {
            source_file_name: source_file_name.map(str::to_string),
            output_path: output_path.map(Path::to_path_buf),
            source_to_idx,
        }
    }

    pub(crate) fn source_index_for_pos(&self, cm: &SourceMap, pos: BytePos) -> Option<u32> {
        let file = cm.try_lookup_source_file(pos).ok().flatten()?;
        if self.skip(&file.name) {
            return None;
        }

        let source = self.file_name_to_source(&file.name);
        self.source_to_idx.get(&source).copied()
    }

    fn file_name_to_source(&self, file_name: &FileName) -> String {
        if let Some(source_file_name) = &self.source_file_name {
            return source_file_name.clone();
        }

        let Some(base_path) = self.output_path.as_ref().and_then(|v| v.parent()) else {
            return file_name.to_string();
        };
        let target = match file_name {
            FileName::Real(path) => path,
            _ => return file_name.to_string(),
        };

        match pathdiff::diff_paths(target, base_path) {
            Some(path) => {
                let path = path.to_string_lossy().to_string();
                if cfg!(target_os = "windows") {
                    path.replace('\\', "/")
                } else {
                    path
                }
            }
            None => file_name.to_string(),
        }
    }

    fn skip(&self, file_name: &FileName) -> bool {
        match file_name {
            FileName::Internal(..) => true,
            FileName::Custom(name) => name.starts_with('<'),
            _ => false,
        }
    }
}

pub(crate) fn augment_source_map_with_scopes(
    cm: Lrc<SourceMap>,
    node: &dyn Any,
    map: &swc_sourcemap::SourceMap,
    serialized_map: &str,
    source_file_name: Option<&str>,
    output_path: Option<&Path>,
) -> Result<String, Error> {
    if let Some(program) = node.downcast_ref::<Program>() {
        return augment_source_map_with_scopes_for_node(
            cm,
            program,
            map,
            serialized_map,
            source_file_name,
            output_path,
        );
    }

    if let Some(module) = node.downcast_ref::<Module>() {
        return augment_source_map_with_scopes_for_node(
            cm,
            module,
            map,
            serialized_map,
            source_file_name,
            output_path,
        );
    }

    if let Some(script) = node.downcast_ref::<Script>() {
        return augment_source_map_with_scopes_for_node(
            cm,
            script,
            map,
            serialized_map,
            source_file_name,
            output_path,
        );
    }

    Ok(serialized_map.to_string())
}

fn augment_source_map_with_scopes_for_node<T>(
    cm: Lrc<SourceMap>,
    node: &T,
    map: &swc_sourcemap::SourceMap,
    serialized_map: &str,
    source_file_name: Option<&str>,
    output_path: Option<&Path>,
) -> Result<String, Error>
where
    T: Node + VisitWith<ScopeCollector>,
{
    let mut json = serde_json::from_str::<Value>(serialized_map)
        .context("failed to parse generated source map json")?;
    let object = json
        .as_object_mut()
        .context("generated source map should be a json object")?;

    let sources = get_string_array(object, "sources");
    let mut names = get_string_array(object, "names");

    let resolver = SourceResolver::new(source_file_name, output_path, &sources);
    let collected = collect_scopes(cm, node, resolver, sources.len());
    let mapping_index = build_mapping_index(map, sources.len());

    let (scopes, original_scope_ids) = build_original_scopes(&collected, sources.len());
    let ranges = build_generated_ranges(&collected, &original_scope_ids, &mapping_index);
    let scope_info = ScopeInfo { scopes, ranges };

    let scopes = encode_scopes(&scope_info, &mut names).context("failed to encode scopes")?;

    object.insert("names".into(), Value::Array(to_value_array(names)));
    object.insert("scopes".into(), Value::String(scopes));

    serde_json::to_string(&json).context("failed to serialize source map with scopes")
}

fn get_string_array(object: &Map<String, Value>, key: &str) -> Vec<String> {
    object
        .get(key)
        .and_then(Value::as_array)
        .into_iter()
        .flatten()
        .filter_map(Value::as_str)
        .map(str::to_string)
        .collect()
}

fn to_value_array(items: Vec<String>) -> Vec<Value> {
    items.into_iter().map(Value::String).collect()
}

fn build_original_scopes(
    collected: &CollectedScopes,
    sources_len: usize,
) -> (Vec<Option<OriginalScope>>, Vec<Option<usize>>) {
    let mut scopes = vec![None; sources_len];
    let mut next_scope_id = 0usize;
    let mut scope_ids = vec![None; collected.scopes.len()];

    for (source_idx, scope_slot) in scopes.iter_mut().enumerate().take(sources_len) {
        let Some(root_idx) = collected.roots_by_source[source_idx] else {
            continue;
        };

        *scope_slot = Some(build_original_scope(
            collected,
            root_idx,
            source_idx as u32,
            &mut next_scope_id,
            &mut scope_ids,
        ));
    }

    (scopes, scope_ids)
}

fn build_original_scope(
    collected: &CollectedScopes,
    scope_idx: usize,
    source_idx: u32,
    next_scope_id: &mut usize,
    scope_ids: &mut [Option<usize>],
) -> OriginalScope {
    let scope = &collected.scopes[scope_idx];
    let current_scope_id = *next_scope_id;
    *next_scope_id += 1;
    scope_ids[scope_idx] = Some(current_scope_id);

    let mut children = scope
        .children
        .iter()
        .copied()
        .filter(|child_idx| collected.scopes[*child_idx].source_idx == Some(source_idx))
        .map(|child_idx| {
            build_original_scope(collected, child_idx, source_idx, next_scope_id, scope_ids)
        })
        .collect::<Vec<_>>();

    children.sort_by(|a, b| a.start.cmp(&b.start).then_with(|| a.end.cmp(&b.end)));

    OriginalScope {
        id: current_scope_id,
        start: scope.start,
        end: scope.end,
        name: scope.name.clone(),
        kind: scope.kind.clone(),
        is_stack_frame: scope.is_stack_frame,
        variables: scope.variables.iter().map(|v| v.name.clone()).collect(),
        children,
    }
}

fn build_generated_ranges(
    collected: &CollectedScopes,
    original_scope_ids: &[Option<usize>],
    mapping_index: &MappingIndex,
) -> Vec<GeneratedRange> {
    let mut ranges = Vec::new();

    for (scope_idx, scope) in collected.scopes.iter().enumerate() {
        let Some(source_idx) = scope.source_idx else {
            continue;
        };
        let Some(original_scope_id) = original_scope_ids[scope_idx] else {
            continue;
        };

        let Some(interval) =
            resolve_generated_interval(mapping_index, source_idx, scope.start, scope.end)
        else {
            continue;
        };

        ranges.push(GeneratedRange {
            start: interval.start,
            end: interval.end,
            is_stack_frame: scope.is_stack_frame,
            is_hidden: false,
            original_scope_id: Some(original_scope_id),
            callsite: None,
            values: build_scope_bindings(
                scope,
                source_idx,
                interval.start,
                interval.end,
                mapping_index,
            ),
            children: Vec::new(),
        });
    }

    ranges.sort_by(|a, b| a.start.cmp(&b.start).then_with(|| b.end.cmp(&a.end)));

    let mut roots = Vec::new();
    for range in ranges {
        insert_generated_range(&mut roots, range);
    }

    roots
}

fn insert_generated_range(target: &mut Vec<GeneratedRange>, mut candidate: GeneratedRange) {
    normalize_range(&mut candidate);

    for child in target.iter_mut() {
        if range_contains(child, &candidate) {
            insert_generated_range(&mut child.children, candidate);
            return;
        }

        if range_overlaps(child, &candidate) {
            return;
        }
    }

    let mut idx = 0;
    while idx < target.len() {
        if range_contains(&candidate, &target[idx]) {
            let existing = target.remove(idx);
            candidate.children.push(existing);
            continue;
        }

        if range_overlaps(&candidate, &target[idx]) {
            return;
        }

        idx += 1;
    }

    candidate
        .children
        .sort_by(|a, b| a.start.cmp(&b.start).then_with(|| b.end.cmp(&a.end)));

    let insert_at = target.partition_point(|item| item.start <= candidate.start);
    target.insert(insert_at, candidate);
}

fn normalize_range(range: &mut GeneratedRange) {
    if range.end <= range.start {
        range.end = bump_position(range.start);
    }
}

fn bump_position(pos: ScopePosition) -> ScopePosition {
    ScopePosition {
        line: pos.line,
        column: pos.column.saturating_add(1),
    }
}

fn range_contains(parent: &GeneratedRange, child: &GeneratedRange) -> bool {
    parent.start <= child.start && child.end <= parent.end
}

fn range_overlaps(lhs: &GeneratedRange, rhs: &GeneratedRange) -> bool {
    lhs.start < rhs.end && rhs.start < lhs.end
}
