use crate::{Atom, AtomStore};

fn store_with_atoms(texts: Vec<&str>) -> (AtomStore, Vec<Atom>) {
    let mut store = AtomStore::default();

    let atoms = { texts.into_iter().map(|text| store.atom(text)).collect() };

    (store, atoms)
}

#[test]
fn simple_usage() {
    let (s, atoms) = store_with_atoms(vec!["Hello, world!", "Hello, world!"]);

    drop(s);

    let a1 = atoms[0].clone();

    let a2 = atoms[1].clone();

    assert_eq!(a1.unsafe_data, a2.unsafe_data);
}

#[test]
fn eager_drop() {
    let (_, atoms1) = store_with_atoms(vec!["Hello, world!!!!"]);
    let (_, atoms2) = store_with_atoms(vec!["Hello, world!!!!"]);

    dbg!(&atoms1);
    dbg!(&atoms2);

    let a1 = atoms1[0].clone();
    let a2 = atoms2[0].clone();

    assert_ne!(
        a1.unsafe_data, a2.unsafe_data,
        "Different stores should have different addresses"
    );
    assert_eq!(a1.get_hash(), a2.get_hash(), "Same string should be equal");
    assert_eq!(a1, a2, "Same string should be equal");
}

#[test]
fn store_multiple() {
    let (_s1, atoms1) = store_with_atoms(vec!["Hello, world!!!!"]);
    let (_s2, atoms2) = store_with_atoms(vec!["Hello, world!!!!"]);

    let a1 = atoms1[0].clone();
    let a2 = atoms2[0].clone();

    assert_ne!(
        a1.unsafe_data, a2.unsafe_data,
        "Different stores should have different addresses"
    );
    assert_eq!(a1.get_hash(), a2.get_hash(), "Same string should be equal");
    assert_eq!(a1, a2, "Same string should be equal");
}

#[test]
fn store_ref_count() {
    let (store, atoms) = store_with_atoms(vec!["Hello, world!!!!"]);

    assert_eq!(atoms[0].ref_count(), 2);
    drop(store);
    assert_eq!(atoms[0].ref_count(), 1);
}
