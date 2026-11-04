# Default parameter references

The execution fixtures check that moving a function into a default parameter
does not create a new callback on each call. Each default callback has one
reference in its enclosing scope, so the compressor can consider inlining it.
`function-kinds` also enables mangling and two compression passes.

The other cases cover nested destructuring, object and class methods, setters,
constructors, reassigned defaults, parameter scope, computed keys, shared object
defaults, and initializer side effects. `expected.stdout` records the original
program's behavior independently of the generated `output.js` snapshot.

`callback-name-collision` checks separate scopes that use the same local callback
name, with mangling that preserves top-level names. Its `expected.repeat-stdout`
checks the original program and two successive minifications, including whether
the generated code can execute. The expected `output.js` keeps the two callbacks
in distinct bindings so that each reader retains its own default callback.
