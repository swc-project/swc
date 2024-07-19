use swc_graph_analyzer::{DepGraph, GraphAnalyzer};

struct Deps<'a> {
    deps: &'a [(usize, Vec<usize>)],
}

impl DepGraph for Deps<'_> {
    type ModuleId = usize;

    fn deps_of(&self, module_id: Self::ModuleId) -> Vec<Self::ModuleId> {
        self.deps
            .iter()
            .find_map(|(id, deps)| {
                if *id == module_id {
                    Some(deps.clone())
                } else {
                    None
                }
            })
            .unwrap()
    }
}

fn assert_cycles(deps: &[(usize, Vec<usize>)], cycles: Vec<Vec<usize>>) {
    let _logger = testing::init();

    {
        let mut analyzer = GraphAnalyzer::new(Deps { deps });

        analyzer.load(0);

        let res = analyzer.into_result();

        assert_eq!(res.cycles, cycles);
    }

    {
        // Ensure that multiple load does not affect cycle detection.

        let mut analyzer = GraphAnalyzer::new(Deps { deps });

        for idx in 0..deps.len() {
            analyzer.load(idx);
        }

        let res = analyzer.into_result();

        assert_eq!(res.cycles, cycles);
    }
}

#[test]
fn stc_1() {
    assert_cycles(
        &[
            (0, vec![2]),
            (1, Vec::new()),
            (2, vec![1]),
            (3, vec![0]),
            (4, vec![2, 3]),
        ],
        Vec::new(),
    );
}
