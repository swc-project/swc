use std::collections::HashMap;

use syn::{
    visit_mut::{visit_file_mut, VisitMut},
    File, Ident, ItemUse, Path, TypePath, UseTree,
};

pub fn qualify_types(mut file: File) -> File {
    let use_items = collect_use_items(&file);

    let mut map = HashMap::new();

    for item in use_items {
        // e.g. use swc_allocator::boxed::Box;
        // becomes `Box: "swc_allocator::boxed::Box"` in the map.

        for_each_use_item(&item.tree, |local_name, path| {
            map.insert(local_name, path);
        });
    }

    visit_file_mut(&mut Folder { map }, &mut file);

    file
}

fn for_each_use_item(tree: &UseTree, op: impl FnMut(Ident, Path)) {
    match tree {
        UseTree::Path(_) => todo!(),
        UseTree::Name(_) => todo!(),
        UseTree::Rename(_) => todo!(),
        UseTree::Glob(_) => todo!(),
        UseTree::Group(_) => todo!(),
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
    map: HashMap<Ident, Path>,
}

impl VisitMut for Folder {
    fn visit_type_path_mut(&mut self, i: &mut TypePath) {
        syn::visit_mut::visit_type_path_mut(self, i);

        if let Some(id) = i.path.get_ident() {
            if let Some(path) = self.map.get(id) {
                i.path = path.clone();
            }
        }
    }
}
