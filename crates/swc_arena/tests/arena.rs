use swc_arena::Arena;

#[test]
fn insert_get_remove_and_reuse() {
    let mut arena = Arena::new();

    let first = arena.insert(10);
    let second = arena.insert(20);

    assert_eq!(arena.get(first), Some(&10));
    assert_eq!(arena.get(second), Some(&20));

    assert_eq!(arena.remove(first), Some(10));
    assert_eq!(arena.get(first), None);

    let reused = arena.insert(30);
    assert_eq!(arena.get(reused), Some(&30));
    assert_ne!(first, reused);
}

#[test]
fn clear_invalidates_existing_ids() {
    let mut arena = Arena::new();

    let id = arena.insert(1);
    arena.clear();

    assert!(!arena.contains(id));
    assert_eq!(arena.get(id), None);
}

#[test]
fn iter_skips_vacant_slots() {
    let mut arena = Arena::new();

    let id1 = arena.insert("a");
    let _id2 = arena.insert("b");
    let id3 = arena.insert("c");

    assert_eq!(arena.remove(id1), Some("a"));
    assert_eq!(arena.remove(id3), Some("c"));

    let collected = arena.iter().map(|(_, value)| *value).collect::<Vec<_>>();
    assert_eq!(collected, vec!["b"]);
}
