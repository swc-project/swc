use anyhow::{bail, Context, Error};
use rustc_hash::FxHashMap;

use crate::source_map_scopes::vlq::{encode_signed_to, encode_unsigned_to};

const TAG_EMPTY: &str = "A";
const TAG_ORIGINAL_SCOPE_START: &str = "B";
const TAG_ORIGINAL_SCOPE_END: &str = "C";
const TAG_ORIGINAL_SCOPE_VARIABLES: &str = "D";
const TAG_GENERATED_RANGE_START: &str = "E";
const TAG_GENERATED_RANGE_END: &str = "F";
const TAG_GENERATED_RANGE_BINDINGS: &str = "G";
const TAG_GENERATED_RANGE_SUBRANGE_BINDING: &str = "H";
const TAG_GENERATED_RANGE_CALL_SITE: &str = "I";

const ORIGINAL_SCOPE_FLAG_HAS_NAME: u32 = 0x1;
const ORIGINAL_SCOPE_FLAG_HAS_KIND: u32 = 0x2;
const ORIGINAL_SCOPE_FLAG_IS_STACK_FRAME: u32 = 0x4;

const GENERATED_RANGE_FLAG_HAS_LINE: u32 = 0x1;
const GENERATED_RANGE_FLAG_HAS_DEFINITION: u32 = 0x2;
const GENERATED_RANGE_FLAG_IS_STACK_FRAME: u32 = 0x4;
const GENERATED_RANGE_FLAG_IS_HIDDEN: u32 = 0x8;

#[derive(Debug, Clone, Copy, Default, PartialEq, Eq, PartialOrd, Ord)]
pub(crate) struct ScopePosition {
    pub line: u32,
    pub column: u32,
}

#[derive(Debug, Clone)]
pub(crate) struct OriginalScope {
    pub id: usize,
    pub start: ScopePosition,
    pub end: ScopePosition,
    pub name: Option<String>,
    pub kind: Option<String>,
    pub is_stack_frame: bool,
    pub variables: Vec<String>,
    pub children: Vec<OriginalScope>,
}

#[derive(Debug, Clone)]
pub(crate) struct GeneratedRange {
    pub start: ScopePosition,
    pub end: ScopePosition,
    pub is_stack_frame: bool,
    pub is_hidden: bool,
    pub original_scope_id: Option<usize>,
    pub callsite: Option<Callsite>,
    pub values: Vec<BindingValue>,
    pub children: Vec<GeneratedRange>,
}

#[derive(Debug, Clone, Copy)]
pub(crate) struct Callsite {
    pub source_idx: u32,
    pub line: u32,
    pub column: u32,
}

#[derive(Debug, Clone)]
pub(crate) enum BindingValue {
    Simple(Option<String>),
    WithSubRanges {
        initial: Option<String>,
        transitions: Vec<BindingTransition>,
    },
}

impl BindingValue {
    fn initial_value(&self) -> Option<&str> {
        match self {
            BindingValue::Simple(value) => value.as_deref(),
            BindingValue::WithSubRanges { initial, .. } => initial.as_deref(),
        }
    }

    fn transitions(&self) -> &[BindingTransition] {
        match self {
            BindingValue::Simple(_) => &[],
            BindingValue::WithSubRanges { transitions, .. } => transitions,
        }
    }
}

#[derive(Debug, Clone)]
pub(crate) struct BindingTransition {
    pub from: ScopePosition,
    pub value: Option<String>,
}

#[derive(Debug, Clone, Default)]
pub(crate) struct ScopeInfo {
    pub scopes: Vec<Option<OriginalScope>>,
    pub ranges: Vec<GeneratedRange>,
}

#[derive(Debug, Clone, Copy, Default)]
struct ScopeState {
    line: i64,
    column: i64,
    name: i64,
    kind: i64,
    variable: i64,
}

#[derive(Debug, Clone, Copy, Default)]
struct RangeState {
    line: i64,
    column: i64,
    definition: i64,
}

#[derive(Debug)]
struct Encoder<'a> {
    names: &'a mut Vec<String>,
    names_to_idx: FxHashMap<String, i64>,

    scope_state: ScopeState,
    range_state: RangeState,

    items: Vec<String>,
    current: String,

    scope_to_definition_idx: FxHashMap<usize, i64>,
    scope_counter: i64,
}

impl<'a> Encoder<'a> {
    fn new(names: &'a mut Vec<String>) -> Self {
        let mut names_to_idx = FxHashMap::default();
        for (idx, name) in names.iter().enumerate() {
            names_to_idx.insert(name.clone(), idx as i64);
        }

        Self {
            names,
            names_to_idx,
            scope_state: ScopeState::default(),
            range_state: RangeState::default(),
            items: Vec::new(),
            current: String::new(),
            scope_to_definition_idx: FxHashMap::default(),
            scope_counter: 0,
        }
    }

    fn encode(mut self, info: &ScopeInfo) -> Result<String, Error> {
        for scope in &info.scopes {
            self.scope_state.line = 0;
            self.scope_state.column = 0;

            match scope {
                Some(scope) => self.encode_original_scope(scope)?,
                None => self.items.push(TAG_EMPTY.to_string()),
            }
        }

        for range in &info.ranges {
            self.encode_generated_range(range)?;
        }

        Ok(self.items.join(","))
    }

    fn encode_original_scope(&mut self, scope: &OriginalScope) -> Result<(), Error> {
        self.current.clear();
        self.current.push_str(TAG_ORIGINAL_SCOPE_START);

        let mut flags = 0;
        if scope.name.is_some() {
            flags |= ORIGINAL_SCOPE_FLAG_HAS_NAME;
        }
        if scope.kind.is_some() {
            flags |= ORIGINAL_SCOPE_FLAG_HAS_KIND;
        }
        if scope.is_stack_frame {
            flags |= ORIGINAL_SCOPE_FLAG_IS_STACK_FRAME;
        }

        encode_unsigned_to(&mut self.current, i64::from(flags));

        let line = i64::from(scope.start.line);
        let col = i64::from(scope.start.column);
        let line_delta = line - self.scope_state.line;
        if line_delta < 0 {
            bail!("original scope starts out of order")
        }
        encode_unsigned_to(&mut self.current, line_delta);
        if line_delta == 0 {
            let col_delta = col - self.scope_state.column;
            if col_delta < 0 {
                bail!("original scope columns out of order")
            }
            encode_unsigned_to(&mut self.current, col_delta);
        } else {
            encode_unsigned_to(&mut self.current, col);
        }
        self.scope_state.line = line;
        self.scope_state.column = col;

        if let Some(name) = &scope.name {
            let idx = self.resolve_name_idx(name);
            encode_signed_to(&mut self.current, idx - self.scope_state.name);
            self.scope_state.name = idx;
        }

        if let Some(kind) = &scope.kind {
            let idx = self.resolve_name_idx(kind);
            encode_signed_to(&mut self.current, idx - self.scope_state.kind);
            self.scope_state.kind = idx;
        }

        self.finish_item();

        self.scope_to_definition_idx
            .insert(scope.id, self.scope_counter);
        self.scope_counter += 1;

        if !scope.variables.is_empty() {
            self.current.clear();
            self.current.push_str(TAG_ORIGINAL_SCOPE_VARIABLES);

            for variable in &scope.variables {
                let idx = self.resolve_name_idx(variable);
                encode_signed_to(&mut self.current, idx - self.scope_state.variable);
                self.scope_state.variable = idx;
            }

            self.finish_item();
        }

        for child in &scope.children {
            self.encode_original_scope(child)?;
        }

        self.current.clear();
        self.current.push_str(TAG_ORIGINAL_SCOPE_END);

        let end_line = i64::from(scope.end.line);
        let end_col = i64::from(scope.end.column);
        let end_line_delta = end_line - self.scope_state.line;
        if end_line_delta < 0 {
            bail!("original scope end out of order")
        }
        encode_unsigned_to(&mut self.current, end_line_delta);
        if end_line_delta == 0 {
            let end_col_delta = end_col - self.scope_state.column;
            if end_col_delta < 0 {
                bail!("original scope end columns out of order")
            }
            encode_unsigned_to(&mut self.current, end_col_delta);
        } else {
            encode_unsigned_to(&mut self.current, end_col);
        }

        self.scope_state.line = end_line;
        self.scope_state.column = end_col;

        self.finish_item();

        Ok(())
    }

    fn encode_generated_range(&mut self, range: &GeneratedRange) -> Result<(), Error> {
        self.current.clear();
        self.current.push_str(TAG_GENERATED_RANGE_START);

        let start_line = i64::from(range.start.line);
        let start_col = i64::from(range.start.column);

        let line_delta = start_line - self.range_state.line;
        if line_delta < 0 {
            bail!("generated range starts out of order")
        }

        let mut flags = 0;
        if line_delta > 0 {
            flags |= GENERATED_RANGE_FLAG_HAS_LINE;
        }
        if range.original_scope_id.is_some() {
            flags |= GENERATED_RANGE_FLAG_HAS_DEFINITION;
        }
        if range.is_stack_frame {
            flags |= GENERATED_RANGE_FLAG_IS_STACK_FRAME;
        }
        if range.is_hidden {
            flags |= GENERATED_RANGE_FLAG_IS_HIDDEN;
        }

        encode_unsigned_to(&mut self.current, i64::from(flags));

        if line_delta > 0 {
            encode_unsigned_to(&mut self.current, line_delta);
            encode_unsigned_to(&mut self.current, start_col);
        } else {
            let col_delta = start_col - self.range_state.column;
            if col_delta < 0 {
                bail!("generated range columns out of order")
            }
            encode_unsigned_to(&mut self.current, col_delta);
        }

        self.range_state.line = start_line;
        self.range_state.column = start_col;

        if let Some(scope_id) = range.original_scope_id {
            let def_idx = *self
                .scope_to_definition_idx
                .get(&scope_id)
                .with_context(|| format!("unknown original scope id: {scope_id}"))?;
            encode_signed_to(&mut self.current, def_idx - self.range_state.definition);
            self.range_state.definition = def_idx;
        }

        self.finish_item();

        self.encode_generated_bindings(range)?;
        self.encode_generated_sub_range_bindings(range)?;

        if let Some(callsite) = range.callsite {
            self.current.clear();
            self.current.push_str(TAG_GENERATED_RANGE_CALL_SITE);
            encode_unsigned_to(&mut self.current, i64::from(callsite.source_idx));
            encode_unsigned_to(&mut self.current, i64::from(callsite.line));
            encode_unsigned_to(&mut self.current, i64::from(callsite.column));
            self.finish_item();
        }

        for child in &range.children {
            self.encode_generated_range(child)?;
        }

        self.current.clear();
        self.current.push_str(TAG_GENERATED_RANGE_END);

        let end_line = i64::from(range.end.line);
        let end_col = i64::from(range.end.column);
        let end_line_delta = end_line - self.range_state.line;
        if end_line_delta < 0 {
            bail!("generated range end out of order")
        }

        if end_line_delta > 0 {
            encode_unsigned_to(&mut self.current, end_line_delta);
            encode_unsigned_to(&mut self.current, end_col);
        } else {
            let end_col_delta = end_col - self.range_state.column;
            if end_col_delta < 0 {
                bail!("generated range end columns out of order")
            }
            encode_unsigned_to(&mut self.current, end_col_delta);
        }

        self.range_state.line = end_line;
        self.range_state.column = end_col;

        self.finish_item();

        Ok(())
    }

    fn encode_generated_bindings(&mut self, range: &GeneratedRange) -> Result<(), Error> {
        if range.values.is_empty() {
            return Ok(());
        }

        if range.original_scope_id.is_none() {
            bail!("generated range has bindings but no original scope definition");
        }

        self.current.clear();
        self.current.push_str(TAG_GENERATED_RANGE_BINDINGS);

        for binding in &range.values {
            let encoded = match binding.initial_value() {
                Some(value) => self.resolve_name_idx(value) + 1,
                None => 0,
            };
            encode_unsigned_to(&mut self.current, encoded);
        }

        self.finish_item();

        Ok(())
    }

    fn encode_generated_sub_range_bindings(&mut self, range: &GeneratedRange) -> Result<(), Error> {
        if range.values.is_empty() {
            return Ok(());
        }

        let mut prev_variable_idx = 0i64;

        for (variable_idx, binding) in range.values.iter().enumerate() {
            let transitions = binding.transitions();
            if transitions.is_empty() {
                continue;
            }

            self.current.clear();
            self.current.push_str(TAG_GENERATED_RANGE_SUBRANGE_BINDING);

            let variable_idx = variable_idx as i64;
            let delta = variable_idx - prev_variable_idx;
            if delta < 0 {
                bail!("generated range sub-range binding index order is invalid");
            }
            encode_unsigned_to(&mut self.current, delta);
            prev_variable_idx = variable_idx;

            let mut prev_line = i64::from(range.start.line);
            let mut prev_col = i64::from(range.start.column);

            for transition in transitions {
                let encoded_binding = match &transition.value {
                    Some(value) => self.resolve_name_idx(value) + 1,
                    None => 0,
                };
                encode_unsigned_to(&mut self.current, encoded_binding);

                let line = i64::from(transition.from.line);
                let col = i64::from(transition.from.column);
                let line_delta = line - prev_line;
                if line_delta < 0 {
                    bail!("generated range sub-range bindings must be sorted");
                }
                encode_unsigned_to(&mut self.current, line_delta);

                if line_delta == 0 {
                    let col_delta = col - prev_col;
                    if col_delta < 0 {
                        bail!("generated range sub-range binding columns must be sorted");
                    }
                    encode_unsigned_to(&mut self.current, col_delta);
                } else {
                    encode_unsigned_to(&mut self.current, col);
                }

                prev_line = line;
                prev_col = col;
            }

            self.finish_item();
        }

        Ok(())
    }

    fn resolve_name_idx(&mut self, value: &str) -> i64 {
        if let Some(idx) = self.names_to_idx.get(value) {
            return *idx;
        }

        let idx = self.names.len() as i64;
        let owned = value.to_string();
        self.names.push(owned.clone());
        self.names_to_idx.insert(owned, idx);
        idx
    }

    fn finish_item(&mut self) {
        self.items.push(std::mem::take(&mut self.current));
    }
}

pub(crate) fn encode_scopes(info: &ScopeInfo, names: &mut Vec<String>) -> Result<String, Error> {
    Encoder::new(names).encode(info)
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn encode_empty_original_scopes() {
        let mut names = Vec::new();
        let info = ScopeInfo {
            scopes: vec![None, None, None],
            ranges: vec![],
        };

        assert_eq!(encode_scopes(&info, &mut names).unwrap(), "A,A,A");
        assert!(names.is_empty());
    }

    #[test]
    fn encode_simple_original_scope() {
        let mut names = Vec::new();
        let info = ScopeInfo {
            scopes: vec![
                Some(OriginalScope {
                    id: 0,
                    start: ScopePosition { line: 0, column: 0 },
                    end: ScopePosition { line: 0, column: 1 },
                    name: None,
                    kind: None,
                    is_stack_frame: false,
                    variables: vec![],
                    children: vec![],
                }),
                Some(OriginalScope {
                    id: 1,
                    start: ScopePosition { line: 0, column: 0 },
                    end: ScopePosition { line: 0, column: 2 },
                    name: None,
                    kind: None,
                    is_stack_frame: false,
                    variables: vec![],
                    children: vec![],
                }),
            ],
            ranges: vec![],
        };

        assert_eq!(
            encode_scopes(&info, &mut names).unwrap(),
            "BAAA,CAB,BAAA,CAC"
        );
    }

    #[test]
    fn encode_bindings_and_sub_ranges() {
        let mut names = Vec::new();
        let info = ScopeInfo {
            scopes: vec![Some(OriginalScope {
                id: 10,
                start: ScopePosition { line: 0, column: 0 },
                end: ScopePosition {
                    line: 0,
                    column: 10,
                },
                name: Some("foo".into()),
                kind: Some("Function".into()),
                is_stack_frame: true,
                variables: vec!["x".into()],
                children: vec![],
            })],
            ranges: vec![GeneratedRange {
                start: ScopePosition { line: 0, column: 0 },
                end: ScopePosition {
                    line: 0,
                    column: 10,
                },
                is_stack_frame: true,
                is_hidden: false,
                original_scope_id: Some(10),
                callsite: None,
                values: vec![BindingValue::WithSubRanges {
                    initial: Some("a".into()),
                    transitions: vec![
                        BindingTransition {
                            from: ScopePosition { line: 0, column: 5 },
                            value: Some("b".into()),
                        },
                        BindingTransition {
                            from: ScopePosition { line: 0, column: 8 },
                            value: None,
                        },
                    ],
                }],
                children: vec![],
            }],
        };

        let encoded = encode_scopes(&info, &mut names).unwrap();

        assert!(encoded.contains('B'));
        assert!(encoded.contains('D'));
        assert!(encoded.contains('E'));
        assert!(encoded.contains('G'));
        assert!(encoded.contains('H'));
        assert!(encoded.contains('F'));

        assert!(names.contains(&"foo".to_string()));
        assert!(names.contains(&"Function".to_string()));
        assert!(names.contains(&"x".to_string()));
        assert!(names.contains(&"a".to_string()));
        assert!(names.contains(&"b".to_string()));
    }
}
