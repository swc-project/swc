// foo(), {}.__proto__
f((foo(), ({}).__proto__)), // foo(), bar(), undefined
f((foo(), void bar())), // foo1(), bar(), baz(), foo2(), undefined
f((foo1(), bar(), baz(), void foo2()));
