use std::collections::HashMap;

use syn::{
    parse_quote,
    visit_mut::{visit_file_mut, VisitMut},
    File, Ident, ItemUse, Path, PathSegment, TypePath, UseTree,
};

pub fn qualify_types(mut file: File) -> File {
    let use_items = collect_use_items(&file);

    let mut map = HashMap::new();

    for item in use_items {
        // e.g. use swc_allocator::boxed::Box;
        // becomes `Box: "swc_allocator::boxed::Box"` in the map.

        for_each_use_item(&[], &item.tree, &mut |local_name, path| {
            map.insert(local_name.to_string(), path);
        });
    }

    map.entry("Option".into())
        .or_insert_with(|| parse_quote!(::std::option::Option));

    map.entry("Box".into())
        .or_insert_with(|| parse_quote!(::std::boxed::Box));

    map.entry("Vec".into())
        .or_insert_with(|| parse_quote!(::std::vec::Vec));

    visit_file_mut(&mut Folder { map }, &mut file);

    file
}

fn for_each_use_item(path: &[Ident], tree: &UseTree, op: &mut impl FnMut(Ident, Path)) {
    match tree {
        UseTree::Path(p) => {
            if p.ident == "self" || p.ident == "super" || p.ident == "crate" {
                return;
            }

            let mut path = path.to_vec();
            path.push(p.ident.clone());

            for_each_use_item(&path, &p.tree, op);
        }
        UseTree::Name(name) => {
            let mut path = path.to_vec();
            path.push(name.ident.clone());
            op(
                name.ident.clone(),
                Path {
                    leading_colon: None,
                    segments: path.into_iter().map(PathSegment::from).collect(),
                },
            );
        }
        UseTree::Rename(..) => {}
        UseTree::Glob(_) => {}
        UseTree::Group(g) => {
            for item in &g.items {
                for_each_use_item(path, item, op);
            }
        }
    }
}

fn collect_use_items(file: &File) -> Vec<ItemUse> {
    let mut use_items = Vec::new();
    for item in &file.items {
        if let syn::Item::Use(item_use) = item {
            use_items.push(item_use.clone());
        }
    }
    use_items
}

struct Folder {
    /// e.g. `("Box", "std::boxed::Box")`
    map: HashMap<String, Path>,
}

impl VisitMut for Folder {
    fn visit_type_path_mut(&mut self, i: &mut TypePath) {
        if let Some(id) = i.path.get_ident() {
            if let Some(path) = self.map.get(&id.to_string()) {
                i.path = path.clone();
            }
        }

        syn::visit_mut::visit_type_path_mut(self, i);
    }
}
