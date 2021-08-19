Visitor pattern implementation for Babel AST.

### Example

```rust
// Visit all Identifier nodes in the Babel AST and change the optional field to 
// Some(true) for each of them.

use swc_babel_visit::{VisitMut, VisitMutWith};
use swc_babel_ast::{Identifier, File};

struct Visitor;

impl VisitMut for Visitor {
    fn visit_mut_identifier(&mut self, node: &mut Identifier) {
        node.optional = Some(true);
    }
}

let ast: File = get_babel_ast();
let mut v = Visitor {};
ast.visit_mut_with(&mut v);
```

