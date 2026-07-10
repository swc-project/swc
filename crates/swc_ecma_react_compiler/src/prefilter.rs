// Copyright (c) Meta Platforms, Inc. and affiliates.
//
// This source code is licensed under the MIT license found in the
// LICENSE file in the root directory of this source tree.

use swc_ecma_ast as swc;
use swc_ecma_visit::{Visit, VisitWith};

/// Whether the program contains `using` or `await using` declarations.
pub fn has_resource_management_declarations(program: &swc::Program) -> bool {
    let mut visitor = ResourceManagementVisitor { found: false };
    program.visit_with(&mut visitor);
    visitor.found
}

struct ResourceManagementVisitor {
    found: bool,
}

impl Visit for ResourceManagementVisitor {
    fn visit_var_decl(&mut self, decl: &swc::VarDecl) {
        if self.found {
            return;
        }
        decl.visit_children_with(self);
    }

    fn visit_using_decl(&mut self, decl: &swc::UsingDecl) {
        if self.found {
            return;
        }
        self.found = true;
        let _ = decl;
    }
}
