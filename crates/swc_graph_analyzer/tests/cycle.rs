use swc_graph_analyzer::DepGraph;

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

fn assert_cycles(deps: &[(usize, Vec<usize>)], cycles: Vec<Vec<usize>>) {}

#[test]
fn stc_1() {
    assert_cycles(
        &[
            (0, vec![2]),
            (1, vec![]),
            (2, vec![1]),
            (3, vec![0]),
            (4, vec![2, 3]),
        ],
        vec![vec![0, 1, 2]],
    );
}
