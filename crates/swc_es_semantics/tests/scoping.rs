use serde::Serialize;

mod common;

use common::{analyze_fixture, assert_snapshot, fixture_inputs};

#[derive(Debug, Serialize)]
struct ScopeSnapshot {
    id: u32,
    kind: String,
    parent: Option<u32>,
    enclosing_function: u32,
    parent_function: Option<u32>,
    has_dynamic_lookup: bool,
    symbols: Vec<u32>,
}

#[derive(Debug, Serialize)]
struct SymbolSnapshot {
    id: u32,
    kind: String,
    scope: u32,
    name: String,
    references: Vec<u32>,
}

#[derive(Debug, Serialize)]
struct ReferenceSnapshot {
    id: u32,
    kind: String,
    scope: u32,
    enclosing_function: u32,
    symbol: Option<u32>,
    name: String,
    maybe_dynamic: bool,
}

#[derive(Debug, Serialize)]
struct Snapshot {
    scopes: Vec<ScopeSnapshot>,
    symbols: Vec<SymbolSnapshot>,
    references: Vec<ReferenceSnapshot>,
}

#[test]
fn scoping_fixtures() {
    for input in fixture_inputs("scoping") {
        let semantics = analyze_fixture(&input);

        let scopes = semantics
            .scopes()
            .iter()
            .enumerate()
            .map(|(index, scope)| ScopeSnapshot {
                id: index as u32,
                kind: format!("{:?}", scope.kind),
                parent: scope.parent.map(|id| id.as_u32()),
                enclosing_function: scope.enclosing_function.as_u32(),
                parent_function: scope.parent_function.map(|id| id.as_u32()),
                has_dynamic_lookup: scope.has_dynamic_lookup,
                symbols: scope.symbols.iter().map(|id| id.as_u32()).collect(),
            })
            .collect();

        let symbols = semantics
            .symbols()
            .iter()
            .enumerate()
            .map(|(index, symbol)| SymbolSnapshot {
                id: index as u32,
                kind: format!("{:?}", symbol.kind),
                scope: symbol.scope.as_u32(),
                name: symbol.name.to_string(),
                references: semantics.symbol_references()[index]
                    .iter()
                    .map(|id| id.as_u32())
                    .collect(),
            })
            .collect();

        let references = semantics
            .references()
            .iter()
            .enumerate()
            .map(|(index, reference)| ReferenceSnapshot {
                id: index as u32,
                kind: format!("{:?}", reference.kind),
                scope: reference.scope.as_u32(),
                enclosing_function: reference.enclosing_function.as_u32(),
                symbol: reference.symbol.map(|id| id.as_u32()),
                name: reference.name.to_string(),
                maybe_dynamic: reference.maybe_dynamic,
            })
            .collect();

        let snapshot = Snapshot {
            scopes,
            symbols,
            references,
        };
        let output = serde_json::to_string_pretty(&snapshot).unwrap_or_else(|err| {
            panic!("failed to serialize snapshot {}: {err}", input.display())
        });

        assert_snapshot(&input.with_file_name("output.json"), output);
    }
}
