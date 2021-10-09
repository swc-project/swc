use crate::bundler::tests::suite;
use std::collections::HashMap;
use swc_common::collections::{AHashMap, AHashSet};

fn assert_cycles(map: AHashMap<String, String>, cycle_entries: Vec<&str>) {
    let mut tester = suite();

    for (k, v) in map {
        tester = tester.file(&k, &v);
    }

    tester.run(|tester| {
        let mut entries = AHashMap::default();
        entries.insert("main.js".to_string(), tester.module("main.js"));
        let (_plan, _graph, cycles) = tester.bundler.determine_entries(entries).unwrap();

        dbg!(&cycles);

        let actual: AHashSet<_> = cycles.into_iter().flatten().collect();

        let expected: AHashSet<_> = cycle_entries
            .iter()
            .map(|name| tester.module(&name).id)
            .collect();

        assert_eq!(expected, actual);

        Ok(())
    });
}

#[test]
fn deno_10820_1() {
    let mut map = HashMap::default();
    map.insert("main.js".to_string(), "import './router.js'".to_string());
    map.insert("data.js".to_string(), "import './main.js'".to_string());
    map.insert("page1.js".to_string(), "import './data.js'".to_string());
    map.insert("page2.js".to_string(), "import './data.js'".to_string());
    map.insert(
        "router.js".to_string(),
        "
        import './page1.js'
        import './page2.js'
        "
        .to_string(),
    );

    assert_cycles(
        map,
        vec!["main.js", "data.js", "page1.js", "page2.js", "router.js"],
    );
}
