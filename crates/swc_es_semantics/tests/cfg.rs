use serde::Serialize;
use swc_es_semantics::BasicBlockKind;

mod common;

use common::{
    analyze_fixture, assert_snapshot, edge_kind_to_string, fixture_inputs, root_to_string,
};

#[derive(Debug, Serialize)]
struct BlockSnapshot {
    id: u32,
    kind: String,
}

#[derive(Debug, Serialize)]
struct EdgeSnapshot {
    from: u32,
    to: u32,
    kind: String,
}

#[derive(Debug, Serialize)]
struct CfgSnapshot {
    id: u32,
    root: String,
    entry: u32,
    exit: u32,
    blocks: Vec<BlockSnapshot>,
    edges: Vec<EdgeSnapshot>,
}

#[derive(Debug, Serialize)]
struct Snapshot {
    cfgs: Vec<CfgSnapshot>,
}

fn block_kind_to_string(kind: &BasicBlockKind) -> String {
    match kind {
        BasicBlockKind::Entry => "Entry".to_string(),
        BasicBlockKind::Exit => "Exit".to_string(),
        BasicBlockKind::Statement(_) => "Statement".to_string(),
        BasicBlockKind::Expression(_) => "Expression".to_string(),
        BasicBlockKind::Synthetic => "Synthetic".to_string(),
    }
}

#[test]
fn cfg_fixtures() {
    for input in fixture_inputs("cfg") {
        let semantics = analyze_fixture(&input);

        let cfgs = semantics
            .cfgs()
            .iter()
            .enumerate()
            .map(|(index, cfg)| {
                let blocks = cfg
                    .blocks
                    .iter()
                    .enumerate()
                    .map(|(block_index, block)| BlockSnapshot {
                        id: block_index as u32,
                        kind: block_kind_to_string(&block.kind),
                    })
                    .collect();

                let edges = cfg
                    .edges
                    .iter()
                    .map(|edge| EdgeSnapshot {
                        from: edge.from.as_u32(),
                        to: edge.to.as_u32(),
                        kind: edge_kind_to_string(edge.kind).to_string(),
                    })
                    .collect();

                CfgSnapshot {
                    id: index as u32,
                    root: root_to_string(cfg.root).to_string(),
                    entry: cfg.entry.as_u32(),
                    exit: cfg.exit.as_u32(),
                    blocks,
                    edges,
                }
            })
            .collect();

        let snapshot = Snapshot { cfgs };
        let output = serde_json::to_string_pretty(&snapshot).unwrap_or_else(|err| {
            panic!("failed to serialize snapshot {}: {err}", input.display())
        });

        assert_snapshot(&input.with_file_name("output.json"), output);
    }
}
