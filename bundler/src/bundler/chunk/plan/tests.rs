use crate::bundler::tests::suite;
use ahash::AHashMap;
use fxhash::FxHashMap;
use std::collections::HashMap;

fn graph(map: FxHashMap<String, String>) {
    let mut tester = suite();

    for (k, v) in map {
        tester = tester.file(&k, &v);
    }

    tester.run(|tester| {
        let mut entries = AHashMap::default();
        entries.insert("main.js".to_string(), tester.module("main.js"));
        let (_plan, _graph, cycles) = tester.bundler.determine_entries(entries).unwrap();

        dbg!(&cycles);

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

    graph(map);

    panic!();
}
