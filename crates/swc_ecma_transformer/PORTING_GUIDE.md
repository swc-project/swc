# Oxc to SWC Transform Porting Guide

This guide provides a comprehensive analysis of transforms implemented in oxc_transformer and their porting status to SWC's VisitMutHook-based architecture.

## Table of Contents

1. [Transform Inventory](#transform-inventory)
2. [Porting Priority Order](#porting-priority-order)
3. [Implementation Patterns](#implementation-patterns)
4. [Testing Strategy](#testing-strategy)
5. [Architecture Comparison](#architecture-comparison)

## Transform Inventory

### ES2015 Transforms

#### Arrow Functions
- **Oxc file**: `es2015/arrow_functions.rs`
- **Babel equivalent**: `@babel/plugin-transform-arrow-functions`
- **Complexity**: Medium to High
- **Status in SWC**: Partially exists in other crates (needs porting to VisitMutHook architecture)
- **AST nodes**: `ArrowFunctionExpression`, `ThisExpression`, `Identifier`
- **Dependencies**: Arrow function converter (common utility)
- **Key features**:
  - Converts arrow functions to regular functions
  - Handles lexical `this` binding (captures in renamed variable like `_this`)
  - Spec mode: wraps in `.bind(this)` with runtime checks
  - Needs handling for: `arguments`, `new.target`, default parameters, class properties, `super`
- **Notes**: Implementation delegates to `ArrowFunctionConverter` in common utilities for reusability

#### Block Scoping
- **Babel equivalent**: `@babel/plugin-transform-block-scoping`
- **Complexity**: High
- **Status**: Not yet in oxc (planned)
- **AST nodes**: `BlockStatement`, `VariableDeclaration` (let/const), `ForStatement`, `ForOfStatement`, `ForInStatement`
- **Dependencies**: None
- **Notes**: Converts `let`/`const` to `var` with proper scoping via IIFEs

#### Classes
- **Babel equivalent**: `@babel/plugin-transform-classes`
- **Complexity**: Very High
- **Status**: Not yet in oxc (planned)
- **AST nodes**: `Class`, `ClassBody`, `MethodDefinition`, `ClassProperty`, `Super`
- **Dependencies**: Helper functions (classCallCheck, createClass, inherits, possibleConstructorReturn)
- **Notes**: Complex transform involving constructor conversion, method hoisting, inheritance chains

#### Computed Properties
- **Babel equivalent**: `@babel/plugin-transform-computed-properties`
- **Complexity**: Medium
- **Status**: Common utility in oxc (`common/computed_key.rs`)
- **AST nodes**: `ObjectExpression`, `Property`, `MethodDefinition`
- **Dependencies**: None
- **Notes**: Extracts computed keys into temporary variables

#### Destructuring
- **Babel equivalent**: `@babel/plugin-transform-destructuring`
- **Complexity**: Very High
- **Status**: Not yet in oxc (planned)
- **AST nodes**: `ObjectPattern`, `ArrayPattern`, `AssignmentPattern`, `RestElement`
- **Dependencies**: Helper functions (extends, toArray, toConsumableArray)
- **Notes**: One of the most complex transforms, handles array/object destructuring in various contexts

#### For-Of
- **Babel equivalent**: `@babel/plugin-transform-for-of`
- **Complexity**: High
- **Status**: Not yet in oxc (planned)
- **AST nodes**: `ForOfStatement`, `VariableDeclaration`, `Expression`
- **Dependencies**: Iterator helpers (createForOfIteratorHelper)
- **Notes**: Converts for-of loops to traditional for loops with iterator protocol

#### Function Name
- **Babel equivalent**: `@babel/plugin-transform-function-name`
- **Complexity**: Medium
- **Status**: Not yet in oxc (planned)
- **AST nodes**: `FunctionExpression`, `ArrowFunctionExpression`, `ObjectProperty`
- **Dependencies**: None
- **Notes**: Infers function names from context for anonymous functions

#### Literals
- **Babel equivalent**: `@babel/plugin-transform-literals`
- **Complexity**: Simple
- **Status**: Not yet in oxc (planned)
- **AST nodes**: `NumericLiteral`, `StringLiteral`
- **Dependencies**: None
- **Notes**: Ensures ES5-compatible literals (removes binary/octal literals)

#### New Target
- **Babel equivalent**: `@babel/plugin-transform-new-target`
- **Complexity**: Medium
- **Status**: Not yet in oxc (planned)
- **AST nodes**: `MetaProperty` (new.target), `FunctionExpression`
- **Dependencies**: None
- **Notes**: Transforms `new.target` to track constructor calls

#### Object Super
- **Babel equivalent**: `@babel/plugin-transform-object-super`
- **Complexity**: High
- **Status**: Not yet in oxc (planned)
- **AST nodes**: `Super`, `ObjectExpression`, `MethodDefinition`
- **Dependencies**: Helper functions (get, set)
- **Notes**: Enables `super` in object methods via helper functions

#### Parameters
- **Babel equivalent**: `@babel/plugin-transform-parameters`
- **Complexity**: High
- **Status**: Not yet in oxc (planned)
- **AST nodes**: `Function`, `RestElement`, `AssignmentPattern`
- **Dependencies**: Helper functions (extends, toArray)
- **Notes**: Handles default parameters, rest parameters

#### Shorthand Properties
- **Babel equivalent**: `@babel/plugin-transform-shorthand-properties`
- **Complexity**: Simple
- **Status**: Not yet in oxc (planned)
- **AST nodes**: `ObjectProperty`
- **Dependencies**: None
- **Notes**: Expands `{x}` to `{x: x}`

#### Spread
- **Babel equivalent**: `@babel/plugin-transform-spread`
- **Complexity**: Medium
- **Status**: Not yet in oxc (planned)
- **AST nodes**: `SpreadElement`, `ArrayExpression`, `CallExpression`
- **Dependencies**: Helper functions (toConsumableArray)
- **Notes**: Converts spread syntax in arrays and function calls

#### Sticky Regex
- **Babel equivalent**: `@babel/plugin-transform-sticky-regex`
- **Complexity**: Simple
- **Status**: Likely in oxc regexp module
- **AST nodes**: `RegExpLiteral`
- **Dependencies**: None
- **Notes**: Transforms sticky (y) flag regex

#### Template Literals
- **Babel equivalent**: `@babel/plugin-transform-template-literals`
- **Complexity**: Medium
- **Status**: Not yet in oxc (planned)
- **AST nodes**: `TemplateLiteral`, `TaggedTemplateExpression`
- **Dependencies**: None
- **Notes**: Converts template literals to string concatenation

#### Typeof Symbol
- **Babel equivalent**: `@babel/plugin-transform-typeof-symbol`
- **Complexity**: Simple
- **Status**: Not yet in oxc (planned)
- **AST nodes**: `UnaryExpression` (typeof)
- **Dependencies**: None
- **Notes**: Wraps typeof to handle Symbol correctly

#### Unicode Regex
- **Babel equivalent**: `@babel/plugin-transform-unicode-regex`
- **Complexity**: Medium
- **Status**: Likely in oxc regexp module
- **AST nodes**: `RegExpLiteral`
- **Dependencies**: None
- **Notes**: Transforms unicode (u) flag regex

### ES2016 Transforms

#### Exponentiation Operator
- **Oxc file**: `es2016/exponentiation_operator.rs`
- **Babel equivalent**: `@babel/plugin-transform-exponentiation-operator`
- **Complexity**: Simple to Medium
- **Status in SWC**: Not yet ported
- **AST nodes**: `BinaryExpression` (** operator)
- **Dependencies**: None (or Math.pow helper)
- **Notes**: Converts `a ** b` to `Math.pow(a, b)`

### ES2017 Transforms

#### Async to Generator
- **Oxc file**: `es2017/async_to_generator.rs`
- **Babel equivalent**: `@babel/plugin-transform-async-to-generator`
- **Complexity**: Very High
- **Status in SWC**: Exists in other crates (needs porting to VisitMutHook)
- **AST nodes**: `FunctionDeclaration`, `FunctionExpression`, `ArrowFunctionExpression` (async), `AwaitExpression`
- **Dependencies**: Helper functions (asyncToGenerator), regenerator runtime
- **Notes**: Converts async/await to generator functions with state machines

### ES2018 Transforms

#### Async Generator Functions
- **Oxc file**: `es2018/async_generator_functions/mod.rs`
- **Babel equivalent**: `@babel/plugin-transform-async-generator-functions`
- **Complexity**: Very High
- **Status in SWC**: Not yet ported
- **AST nodes**: `FunctionDeclaration`, `FunctionExpression` (async generator), `AwaitExpression`, `YieldExpression`, `ForAwaitStatement`
- **Dependencies**:
  - ES2017 async-to-generator transform
  - Helper functions: `WrapAsyncGenerator`, `AwaitAsyncGenerator`, `AsyncIterator`, `AsyncGeneratorDelegate`
- **Implementation approach**:
  - Exit hooks: `exit_expression` (await/yield), `exit_statement` (declarations), `exit_function` (methods)
  - `await expr` → `yield awaitAsyncGenerator(expr)`
  - `yield* expr` → `yield asyncGeneratorDelegate(asyncIterator(expr))`
  - Uses ancestor traversal for scope validation
- **Notes**: Requires regenerator runtime for state machine execution

#### Object Rest Spread
- **Oxc file**: `es2018/object_rest_spread.rs`
- **Babel equivalent**: `@babel/plugin-transform-object-rest-spread`
- **Complexity**: Very High
- **Status in SWC**: Exists in other crates (needs porting to VisitMutHook)
- **AST nodes**:
  - `ObjectExpression` (spread properties)
  - `ObjectPattern`, `ObjectAssignmentTarget` (rest patterns)
  - `AssignmentExpression`, `VariableDeclaration`
  - `ArrowFunctionExpression`, `Function` (parameters)
  - `CatchClause`, `ForInStatement`, `ForOfStatement`
- **Dependencies**: Helper functions: `ObjectSpread2`, `Extends`, `ObjectWithoutProperties`, `ObjectDestructuringEmpty`, `ToPropertyKey`
- **Implementation approach**:
  - Multiple enter hooks for different contexts (expressions, functions, loops)
  - Pattern: Identify rest/spread → generate unique IDs → insert helper calls → maintain scoping
  - Leverages semantic analysis for proper scoping
- **Notes**: Handles both object spread in literals and rest in destructuring

#### Dotall Regex
- **Babel equivalent**: `@babel/plugin-transform-dotall-regex`
- **Complexity**: Simple
- **Status**: Likely in oxc regexp module
- **AST nodes**: `RegExpLiteral`
- **Dependencies**: None
- **Notes**: Transforms dotall (s) flag regex

#### Named Capturing Groups Regex
- **Babel equivalent**: `@babel/plugin-transform-named-capturing-groups-regex`
- **Complexity**: Medium
- **Status**: Likely in oxc regexp module
- **AST nodes**: `RegExpLiteral`
- **Dependencies**: None
- **Notes**: Transforms named capturing groups in regex

#### Unicode Property Regex
- **Babel equivalent**: `@babel/plugin-transform-unicode-property-regex`
- **Complexity**: Medium
- **Status**: Likely in oxc regexp module
- **AST nodes**: `RegExpLiteral`
- **Dependencies**: None
- **Notes**: Transforms unicode property escapes in regex

### ES2019 Transforms

#### Optional Catch Binding
- **Oxc file**: `es2019/optional_catch_binding.rs`
- **Babel equivalent**: `@babel/plugin-transform-optional-catch-binding`
- **Complexity**: Simple
- **Status in SWC**: Not yet ported
- **AST nodes**: `CatchClause`, `CatchParameter`, `BindingPattern`
- **Dependencies**: None
- **Implementation approach**:
  - Single enter hook: `enter_catch_clause`
  - Checks if `clause.param` is None
  - Generates unique identifier via `ctx.generate_uid()`
  - Creates minimal synthetic binding
- **Notes**: Allows `catch {}` without parameter by injecting unused variable

#### JSON Strings
- **Babel equivalent**: `@babel/plugin-transform-json-strings`
- **Complexity**: Simple
- **Status**: Not yet in oxc (planned)
- **AST nodes**: `StringLiteral`
- **Dependencies**: None
- **Notes**: Ensures JSON-compatible string escaping

### ES2020 Transforms

#### Dynamic Import
- **Babel equivalent**: `@babel/plugin-transform-dynamic-import`
- **Complexity**: Medium
- **Status**: Not yet in oxc (planned, module-specific)
- **AST nodes**: `ImportExpression`
- **Dependencies**: Module system helpers
- **Notes**: Transforms dynamic `import()` for various module systems

#### Export Namespace From
- **Oxc file**: `es2020/export_namespace_from.rs`
- **Babel equivalent**: `@babel/plugin-transform-export-namespace-from`
- **Complexity**: Medium
- **Status in SWC**: May exist in module transforms
- **AST nodes**: `ExportNamedDeclaration`, `ExportAllDeclaration`
- **Dependencies**: None
- **Notes**: Handles `export * as ns from 'mod'` syntax

#### Nullish Coalescing Operator
- **Oxc file**: `es2020/nullish_coalescing_operator.rs`
- **Babel equivalent**: `@babel/plugin-transform-nullish-coalescing-operator`
- **Complexity**: Medium to High
- **Status in SWC**: Not yet ported
- **AST nodes**: `LogicalExpression` (??), `ConditionalExpression`, `AssignmentExpression`, `BinaryExpression`
- **Dependencies**: Semantic analysis for reference tracking
- **Implementation approach**:
  - Single enter hook: `enter_expression`
  - Pattern: `a ?? b` → `(temp = a) !== null && temp !== void 0 ? temp : b`
  - Optimizations:
    - Static values: direct reuse
    - Immutable identifiers: no write tracking needed
    - Complex expressions: use temp variables
- **Notes**: Requires careful handling of side effects in left operand

#### Optional Chaining
- **Oxc file**: `es2020/optional_chaining.rs`
- **Babel equivalent**: `@babel/plugin-transform-optional-chaining`
- **Complexity**: Very High
- **Status in SWC**: Not yet ported
- **AST nodes**:
  - `ChainExpression` (root)
  - `StaticMemberExpression`, `ComputedMemberExpression`, `PrivateFieldExpression` (optional)
  - `CallExpression` (optional)
  - `UnaryExpression` (delete)
- **Dependencies**: None (but complex temp binding logic)
- **Implementation approach**:
  - Enter hook: `enter_expression` intercepts `ChainExpression` and delete operations
  - Recursive depth-first traversal for nested chains
  - Pattern: Create temp bindings → inject null/undefined checks → build logical OR chains → wrap in conditional
- **Notes**: One of the most complex transforms, handles deeply nested optional chains

### ES2021 Transforms

#### Logical Assignment Operators
- **Oxc file**: `es2021/logical_assignment_operators.rs`
- **Babel equivalent**: `@babel/plugin-transform-logical-assignment-operators`
- **Complexity**: Medium to High
- **Status in SWC**: Not yet ported
- **AST nodes**: `AssignmentExpression` (&&=, ||=, ??=), `AssignmentTargetIdentifier`, `StaticMemberExpression`, `ComputedMemberExpression`
- **Dependencies**: Semantic analysis for reference flags
- **Implementation approach**:
  - Entry hook: `enter_expression` with hot-path filtering
  - Strategy: Extract left operand → create assignment → wrap in logical expression
  - Duplicates complex expressions to avoid side effects
  - Manages reference semantics through semantic analysis
- **Notes**: Similar complexity to nullish coalescing but for assignments

#### Numeric Separator
- **Babel equivalent**: `@babel/plugin-transform-numeric-separator`
- **Complexity**: Simple
- **Status**: Not yet in oxc (planned, likely lexer-level)
- **AST nodes**: `NumericLiteral`
- **Dependencies**: None
- **Notes**: Removes underscores from numeric literals

### ES2022 Transforms

#### Class Properties
- **Oxc file**: `es2022/class_properties/mod.rs` (directory with multiple files)
- **Babel equivalent**: `@babel/plugin-transform-class-properties`
- **Complexity**: Very High
- **Status in SWC**: Exists in other crates (needs porting to VisitMutHook)
- **AST nodes**: `Class`, `ClassBody`, `PropertyDefinition`, `PrivateIdentifier`, `MethodDefinition`
- **Dependencies**: Helper functions (defineProperty, classPrivateFieldGet, classPrivateFieldSet, WeakMap)
- **Implementation approach**:
  - Three-phase process:
    1. **Entry**: Check for properties/blocks, build hashmap of private keys, extract initializers to constructor
    2. **Traversal**: Transform private field expressions during body traversal
    3. **Exit**: Move static properties, computed keys, temp assignments outside class
  - Public properties: Use `defineProperty` helper or direct assignment (loose mode)
  - Private properties: WeakMap-based helpers
  - Computed keys: Extract to temp variables
- **Notes**: Extremely complex, handles public/private instance/static properties and computed keys

#### Class Static Block
- **Oxc file**: `es2022/class_static_block.rs`
- **Babel equivalent**: `@babel/plugin-transform-class-static-block`
- **Complexity**: Medium to High
- **Status in SWC**: Not yet ported
- **AST nodes**: `StaticBlock`, `PropertyDefinition`, `PrivateIdentifier`, `ArrowFunctionExpression`
- **Dependencies**: None
- **Implementation approach**:
  - Enter hook: `enter_class_body` scans for static blocks and existing private keys
  - Key generation: Fast path uses `#_` (no allocations), fallback generates `#_2`, `#_3`, etc.
  - Single expression: Extract directly
  - Multiple statements: Wrap in arrow function IIFE
- **Notes**: Transforms `static { foo }` → `static #_ = foo` or `static #_ = (() => { statements })()`

#### Private Methods
- **Babel equivalent**: `@babel/plugin-transform-private-methods`
- **Complexity**: Very High
- **Status**: Likely part of class properties in oxc
- **AST nodes**: `MethodDefinition` (private), `PrivateIdentifier`
- **Dependencies**: WeakSet helpers
- **Notes**: Part of the class properties transform suite

#### Private Property In Object
- **Babel equivalent**: `@babel/plugin-transform-private-property-in-object`
- **Complexity**: Medium
- **Status**: Likely part of class properties in oxc
- **AST nodes**: `BinaryExpression` (#prop in obj)
- **Dependencies**: WeakMap/WeakSet helpers
- **Notes**: Transforms `#prop in obj` checks

### ES2026 Transforms

#### Explicit Resource Management
- **Oxc file**: `es2026/explicit_resource_management.rs`
- **Babel equivalent**: `@babel/plugin-transform-explicit-resource-management`
- **Complexity**: Very High
- **Status in SWC**: Exists in proposal crate
- **AST nodes**: `UsingDeclaration`, `AwaitUsingDeclaration`, `DisposableResource`
- **Dependencies**: Helper functions for disposal stack management
- **Notes**: Implements using/await using declarations with automatic disposal

### TypeScript Transforms

#### Annotations
- **Oxc file**: `typescript/annotations.rs`
- **Babel equivalent**: Part of `@babel/plugin-transform-typescript`
- **Complexity**: Medium
- **Status in SWC**: Exists in swc_ecma_transforms_typescript
- **AST nodes**: All type annotation nodes (TSTypeAnnotation, TSTypeParameterDeclaration, etc.)
- **Dependencies**: None
- **Notes**: Strips all TypeScript type annotations

#### Class
- **Oxc file**: `typescript/class.rs`
- **Babel equivalent**: Part of `@babel/plugin-transform-typescript`
- **Complexity**: High
- **Status in SWC**: Exists in swc_ecma_transforms_typescript
- **AST nodes**: `Class`, `ClassProperty`, `PropertyDefinition`, `ParameterProperty`
- **Dependencies**: None
- **Notes**: Handles TS-specific class features (parameter properties, accessibility modifiers)

#### Enum
- **Oxc file**: `typescript/enum.rs`
- **Babel equivalent**: Part of `@babel/plugin-transform-typescript`
- **Complexity**: High
- **Status in SWC**: Exists in swc_ecma_transforms_typescript (ts_enum.rs)
- **AST nodes**: `TSEnumDeclaration`, `TSEnumMember`
- **Dependencies**: None
- **Notes**: Converts TS enums to JavaScript objects/IIFEs

#### Module
- **Oxc file**: `typescript/module.rs`
- **Babel equivalent**: Part of `@babel/plugin-transform-typescript`
- **Complexity**: Medium
- **Status in SWC**: Exists in swc_ecma_transforms_typescript
- **AST nodes**: Import/export declarations with type modifiers
- **Dependencies**: None
- **Notes**: Handles type imports/exports, import assertions

#### Namespace
- **Oxc file**: `typescript/namespace.rs`
- **Babel equivalent**: Part of `@babel/plugin-transform-typescript`
- **Complexity**: High
- **Status in SWC**: Part of existing TypeScript transform
- **AST nodes**: `TSModuleDeclaration`, `TSModuleBlock`
- **Dependencies**: None
- **Notes**: Converts TS namespaces to JavaScript objects/IIFEs

#### Rewrite Extensions
- **Oxc file**: `typescript/rewrite_extensions.rs`
- **Babel equivalent**: Part of TypeScript rewrite extensions
- **Complexity**: Simple to Medium
- **Status in SWC**: Exists in swc_ecma_transforms_typescript
- **AST nodes**: `ImportDeclaration`, `ExportDeclaration`
- **Dependencies**: None
- **Notes**: Rewrites .ts/.tsx extensions in import paths

### React/JSX Transforms

#### JSX
- **Oxc file**: `jsx/jsx_impl.rs`
- **Babel equivalent**: `@babel/plugin-transform-react-jsx`
- **Complexity**: High
- **Status in SWC**: Exists in swc_ecma_transforms_react/jsx
- **AST nodes**: `JSXElement`, `JSXFragment`, `JSXAttribute`, `JSXSpreadAttribute`
- **Dependencies**: React runtime (createElement or jsx/jsxs)
- **Notes**: Core JSX transformation to React.createElement or automatic runtime

#### JSX Self
- **Oxc file**: `jsx/jsx_self.rs`
- **Babel equivalent**: `@babel/plugin-transform-react-jsx-self`
- **Complexity**: Simple
- **Status in SWC**: Exists in swc_ecma_transforms_react/jsx_self
- **AST nodes**: `JSXElement`, `JSXOpeningElement`
- **Dependencies**: None
- **Notes**: Adds __self prop for dev warnings

#### JSX Source
- **Oxc file**: `jsx/jsx_source.rs`
- **Babel equivalent**: `@babel/plugin-transform-react-jsx-source`
- **Complexity**: Simple
- **Status in SWC**: Exists in swc_ecma_transforms_react/jsx_src
- **AST nodes**: `JSXElement`, `JSXOpeningElement`
- **Dependencies**: None
- **Notes**: Adds __source prop for dev warnings

#### Display Name
- **Oxc file**: `jsx/display_name.rs`
- **Babel equivalent**: `@babel/plugin-transform-react-display-name`
- **Complexity**: Medium
- **Status in SWC**: Exists in swc_ecma_transforms_react/display_name
- **AST nodes**: `CallExpression`, `VariableDeclarator`, `AssignmentExpression`
- **Dependencies**: None
- **Notes**: Automatically adds displayName to React components

#### React Refresh
- **Oxc file**: `jsx/refresh.rs`
- **Babel equivalent**: `react-refresh/babel`
- **Complexity**: High
- **Status in SWC**: Exists in swc_ecma_transforms_react/refresh
- **AST nodes**: Various (components, hooks)
- **Dependencies**: React Refresh runtime
- **Notes**: Hot module reloading for React components

### Decorator Transforms

#### Decorators (2022-03)
- **Oxc file**: `decorator/` directory (with legacy subdirectory)
- **Babel equivalent**: `@babel/plugin-transform-decorators`
- **Complexity**: Very High
- **Status in SWC**: Exists in swc_ecma_transforms_proposal/decorator_2022_03.rs
- **AST nodes**: `Decorator`, `Class`, `ClassProperty`, `MethodDefinition`
- **Dependencies**: Helper functions for decorator application
- **Notes**: Implements stage 3 decorator proposal, separate legacy implementation

### Regex Transforms

#### RegExp Module
- **Oxc files**: `regexp/` directory
- **Babel equivalents**: Multiple regex-related plugins
- **Complexity**: Varies (Simple to Medium)
- **Status in SWC**: Various regex support exists
- **Transforms likely included**:
  - Dotall regex (s flag)
  - Named capturing groups
  - Unicode property escapes
  - Unicode sets (v flag)
  - Sticky regex (y flag)
  - Duplicate named capturing groups
  - Regexp modifiers
- **Notes**: Regex transforms are typically simpler, mainly flag/syntax conversions

### Common Utilities

These are shared utilities used by multiple transforms:

#### Arrow Function Converter
- **Oxc file**: `common/arrow_function_converter.rs`
- **Purpose**: Reusable arrow function conversion logic
- **Used by**: ES2015 arrow functions, potentially other transforms
- **Notes**: Centralizes the complex logic for this binding and scope handling

#### Computed Key
- **Oxc file**: `common/computed_key.rs`
- **Purpose**: Handles computed property keys extraction
- **Used by**: ES2015 computed properties, class properties
- **Notes**: Extracts computed keys into temporary variables

#### Helper Loader
- **Oxc file**: `common/helper_loader.rs`
- **Purpose**: Manages injection of helper functions
- **Used by**: Most transforms that need runtime helpers
- **Notes**: Similar to SWC's helper injection system

#### Module Imports
- **Oxc file**: `common/module_imports.rs`
- **Purpose**: Manages import statement additions
- **Used by**: Transforms that need to inject imports (helpers, React, etc.)
- **Notes**: Ensures deduplicated imports

#### Statement Injector
- **Oxc file**: `common/statement_injector.rs`
- **Purpose**: Injects statements into the AST
- **Used by**: Most transforms
- **Notes**: Handles insertion of statements at various scopes

#### Top Level Statements
- **Oxc file**: `common/top_level_statements.rs`
- **Purpose**: Manages top-level statement transformations
- **Used by**: Module-level transforms
- **Notes**: Handles module-level code injection

#### Variable Declarations
- **Oxc file**: `common/var_declarations.rs`
- **Purpose**: Handles variable declaration transformations
- **Used by**: Multiple transforms
- **Notes**: Manages let/const to var conversions, hoisting

## Porting Priority Order

The following prioritization considers:
1. **Foundation first**: Common utilities and simple transforms
2. **Frequency of use**: Most commonly needed transforms
3. **Dependencies**: Transforms that other transforms depend on
4. **Complexity**: Balance of impact vs. implementation effort
5. **Existing SWC coverage**: Focus on gaps

### Phase 1: Foundation (Highest Priority)

These are essential for other transforms and frequently used:

1. **Common utilities** (arrow_function_converter, computed_key, helper_loader, statement_injector, module_imports)
   - Rationale: Required by many other transforms
   - Complexity: Medium
   - Impact: Enables all subsequent transforms

2. **ES2015: Arrow Functions**
   - Rationale: Extremely common, foundational
   - Complexity: Medium to High
   - Impact: High usage in modern code

3. **ES2015: Template Literals**
   - Rationale: Very common, relatively isolated
   - Complexity: Medium
   - Impact: High usage

4. **ES2015: Shorthand Properties**
   - Rationale: Simple, common
   - Complexity: Simple
   - Impact: Frequently used

5. **ES2015: Computed Properties**
   - Rationale: Common, needed by classes
   - Complexity: Medium
   - Impact: Foundational for other transforms

### Phase 2: Core Language Features (High Priority)

6. **ES2015: Block Scoping**
   - Rationale: Very common (let/const)
   - Complexity: High
   - Impact: Extremely high usage

7. **ES2015: Destructuring**
   - Rationale: Extremely common
   - Complexity: Very High
   - Impact: Ubiquitous in modern code

8. **ES2015: Spread**
   - Rationale: Very common
   - Complexity: Medium
   - Impact: High usage

9. **ES2015: Parameters** (default, rest)
   - Rationale: Common, foundational
   - Complexity: High
   - Impact: Frequently used

10. **ES2015: For-Of**
    - Rationale: Common iteration pattern
    - Complexity: High
    - Impact: Commonly used

### Phase 3: Classes and Advanced Features (High Priority)

11. **ES2015: Classes**
    - Rationale: Foundational for modern JS
    - Complexity: Very High
    - Impact: Essential for OOP patterns

12. **ES2022: Class Properties**
    - Rationale: Modern class syntax
    - Complexity: Very High
    - Impact: Standard in modern code

13. **ES2022: Class Static Block**
    - Rationale: Newer class feature
    - Complexity: Medium to High
    - Impact: Growing usage

14. **ES2015: Object Super**
    - Rationale: Required for advanced object patterns
    - Complexity: High
    - Impact: Moderate usage

### Phase 4: Modern Operators (Medium to High Priority)

15. **ES2020: Optional Chaining**
    - Rationale: Extremely popular modern feature
    - Complexity: Very High
    - Impact: Very high usage in modern code

16. **ES2020: Nullish Coalescing**
    - Rationale: Common modern operator
    - Complexity: Medium to High
    - Impact: High usage

17. **ES2021: Logical Assignment Operators**
    - Rationale: Modern convenience feature
    - Complexity: Medium to High
    - Impact: Moderate but growing

18. **ES2016: Exponentiation Operator**
    - Rationale: Simple, isolated
    - Complexity: Simple to Medium
    - Impact: Moderate usage

### Phase 5: ES2018 Features (Medium Priority)

19. **ES2018: Object Rest Spread**
    - Rationale: Very common modern pattern
    - Complexity: Very High
    - Impact: Ubiquitous in modern code

20. **ES2017: Async to Generator**
    - Rationale: Essential for async code
    - Complexity: Very High
    - Impact: Extremely high for older targets

21. **ES2018: Async Generator Functions**
    - Rationale: Advanced async pattern
    - Complexity: Very High
    - Impact: Lower usage but important

### Phase 6: Simpler ES2015+ Features (Medium Priority)

22. **ES2015: Literals**
    - Rationale: Simple, isolated
    - Complexity: Simple
    - Impact: Low but necessary

23. **ES2015: Function Name**
    - Rationale: Debugging/tooling improvement
    - Complexity: Medium
    - Impact: Moderate

24. **ES2015: New Target**
    - Rationale: Advanced feature
    - Complexity: Medium
    - Impact: Lower usage

25. **ES2015: Typeof Symbol**
    - Rationale: Symbol compatibility
    - Complexity: Simple
    - Impact: Low but necessary

26. **ES2019: Optional Catch Binding**
    - Rationale: Simple convenience feature
    - Complexity: Simple
    - Impact: Moderate usage

27. **ES2020: Export Namespace From**
    - Rationale: Module syntax sugar
    - Complexity: Medium
    - Impact: Lower usage

### Phase 7: Regex Transforms (Lower Priority)

28. **Regex transforms** (dotall, named groups, unicode properties, sticky, sets)
    - Rationale: Specialized, lower impact individually
    - Complexity: Simple to Medium each
    - Impact: Niche usage but important for completeness

### Phase 8: Advanced/Specialized Features (Lower Priority)

29. **ES2019: JSON Strings**
    - Rationale: Edge case compatibility
    - Complexity: Simple
    - Impact: Very low usage

30. **ES2021: Numeric Separator**
    - Rationale: Likely handled at lexer level
    - Complexity: Simple
    - Impact: Low

31. **ES2020: Dynamic Import**
    - Rationale: Module system specific
    - Complexity: Medium
    - Impact: Handled at bundler level often

32. **ES2026: Explicit Resource Management**
    - Rationale: Newest feature, low adoption
    - Complexity: Very High
    - Impact: Minimal current usage

### Notes on Existing SWC Coverage

The following transforms already exist in SWC but may need porting to the VisitMutHook architecture:

- **React/JSX transforms**: Mostly complete in `swc_ecma_transforms_react`
- **TypeScript transforms**: Mostly complete in `swc_ecma_transforms_typescript`
- **Decorators**: Exists in `swc_ecma_transforms_proposal`
- **Explicit Resource Management**: Exists in `swc_ecma_transforms_proposal`

These should be evaluated for:
1. Whether they need porting to VisitMutHook
2. Whether they can be composed with other transforms
3. Whether oxc's implementation offers improvements

## Implementation Patterns

### Hook Usage Patterns in Oxc

Oxc uses the `Traverse` trait with enter/exit methods for each AST node type. Here's how this maps to SWC's `VisitMutHook`:

#### Entry Hooks
Most transforms use entry hooks for:
- **Identifying target nodes**: Check if the node needs transformation
- **Collecting context**: Gather information about the node and its surroundings
- **Early transformation**: Transform nodes that don't need exit context

Example from oxc optional catch binding:
```rust
fn enter_catch_clause(&mut self, clause: &mut CatchClause) {
    if clause.param.is_none() {
        // Generate unique identifier
        let binding = self.ctx.generate_uid("unused", SymbolFlags::FunctionScopedVariable);
        clause.param = Some(binding);
    }
}
```

#### Exit Hooks
Exit hooks are used when:
- **Children need to be transformed first**: Process inner nodes before outer
- **Context from children is needed**: Gather info from child nodes
- **Hoisting**: Move code outside the current context

Example pattern from async generator functions:
```rust
fn exit_expression(&mut self, expr: &mut Expression) {
    // Transform await/yield after processing their arguments
    match expr {
        Expression::AwaitExpression(await_expr) => {
            // Transform to yield awaitAsyncGenerator(argument)
        }
        Expression::YieldExpression(yield_expr) if yield_expr.delegate => {
            // Transform to yield asyncGeneratorDelegate(...)
        }
        _ => {}
    }
}
```

#### Multiple Hooks
Complex transforms may use both:
```rust
fn enter_class_body(&mut self, body: &mut ClassBody) {
    // Phase 1: Collect info about properties
}

fn exit_class_body(&mut self, body: &mut ClassBody) {
    // Phase 3: Inject transformed code
}
```

### Mapping to SWC's VisitMutHook

SWC's `VisitMutHook<Ctx>` provides similar capabilities:

```rust
impl<Ctx> VisitMutHook<Ctx> for MyTransform {
    // Entry hook - called before visiting children
    fn visit_mut_catch_clause(&mut self, n: &mut CatchClause, ctx: &mut Ctx) {
        // Transform before children
        if n.param.is_none() {
            n.param = Some(ctx.generate_uid("unused"));
        }
    }

    // Can defer to children then transform on exit
    fn visit_mut_expr(&mut self, n: &mut Expr, ctx: &mut Ctx) {
        // Visit children first
        n.visit_mut_children_with_hook(self, ctx);

        // Then transform
        if let Expr::Await(await_expr) = n {
            // Transform after children processed
        }
    }
}
```

### Common Transform Patterns

#### Pattern 1: Simple Syntax Rewrite
**Example**: Optional catch binding, shorthand properties

```rust
// 1. Check if transformation needed
// 2. Create replacement node
// 3. Swap in place
```

**Complexity**: Low
**Hook type**: Usually entry hook

#### Pattern 2: Expression with Side Effects
**Example**: Nullish coalescing, logical assignment, optional chaining

```rust
// 1. Check if expression can be evaluated multiple times safely
// 2. If not, generate temporary variable
// 3. Extract side-effectful expression to temp
// 4. Build replacement expression using temp
// 5. Track references for semantic correctness
```

**Complexity**: Medium to High
**Hook type**: Entry hook with semantic analysis
**Key consideration**: Preserve side effect order

#### Pattern 3: Multi-phase Transform
**Example**: Class properties, async generators

```rust
// Phase 1 (Enter): Collect information
// - Scan for target nodes
// - Build metadata (private keys, methods, etc.)
// - Plan transformations

// Phase 2 (Visit children): Transform during traversal
// - Process nested structures
// - Apply transformations to expressions

// Phase 3 (Exit): Finalize and inject
// - Move code outside context
// - Inject helper functions
// - Clean up
```

**Complexity**: Very High
**Hook type**: Both entry and exit, multiple contexts
**Key consideration**: Maintain correct scope and ordering

#### Pattern 4: Helper Function Injection
**Example**: Async to generator, object spread, destructuring

```rust
// 1. Detect need for helper
// 2. Mark helper as needed in context
// 3. Transform code to use helper
// 4. At end, inject helper imports/definitions
```

**Complexity**: Medium to High
**Hook type**: Various, with post-processing
**Key consideration**: Deduplicate helpers

#### Pattern 5: Scope-aware Transform
**Example**: Block scoping, destructuring, for-of

```rust
// 1. Enter scope context
// 2. Track bindings and references
// 3. Rename variables if needed
// 4. Wrap in IIFE if scoping needed
// 5. Exit scope context
```

**Complexity**: High to Very High
**Hook type**: Entry/exit with scope tracking
**Key consideration**: Proper scope management via `TraverseCtx`

### Helper Functions

Oxc injects helper functions similar to Babel. Common helpers include:

- **`_extends`**: Object spread/assign
- **`_objectWithoutProperties`**: Object rest
- **`_toConsumableArray`**: Array spread
- **`_asyncToGenerator`**: Async function conversion
- **`_classCallCheck`**, **`_createClass`**, **`_inherits`**: Class transforms
- **`_defineProperty`**: Class properties
- **`_classPrivateFieldGet`**, **`_classPrivateFieldSet`**: Private fields
- **`_wrapAsyncGenerator`**, **`_awaitAsyncGenerator`**: Async generators

SWC should provide similar helpers through its helper system.

### Context Usage (`TraverseCtx`)

Oxc's `TraverseCtx` provides:

1. **`generate_uid(name, flags)`**: Creates unique identifiers
   - SWC equivalent: `TraverseCtx::generate_uid()`

2. **`enter_scope()`/`exit_scope()`**: Scope tracking
   - SWC equivalent: Built into `TraverseCtx`

3. **`current_scope_id()`**: Get current scope
   - SWC equivalent: `TraverseCtx` scope methods

4. **Semantic info**: Symbol resolution, reference tracking
   - SWC equivalent: Semantic analyzer integration

5. **Helper tracking**: Mark helpers as used
   - SWC equivalent: Helper loader

### Testing Approach

Oxc imports Babel's test suites for conformance testing. For SWC:

1. **Use Babel conformance tests**: Import test cases from Babel
2. **Test each transform individually**: Unit tests per transform
3. **Test composition**: Ensure transforms work together
4. **Test with real-world code**: Large codebases for integration testing
5. **Benchmark**: Compare performance with existing SWC and Babel
6. **Snapshot testing**: Compare output with expected transformations

### Error Handling

Transforms should:
1. **Emit diagnostics**: Use diagnostic system for errors/warnings
2. **Fail gracefully**: Don't panic, emit error and continue when possible
3. **Preserve source locations**: Maintain accurate spans for error reporting

## Testing Strategy

### Babel Conformance Tests

Oxc imports Babel's plugin test suites to ensure compatibility. The same approach should be used for SWC:

1. **Location**: Babel tests are in `packages/babel-plugin-transform-*/test/fixtures/`
2. **Format**: Input JavaScript files with expected output files
3. **Import process**: Copy test fixtures to SWC test directories
4. **Automation**: Script to sync tests from Babel repository

Example test structure:
```
tests/
  fixtures/
    arrow-functions/
      basic/
        input.js
        output.js
      this-binding/
        input.js
        output.js
        options.json
```

### Unit Testing

Each transform should have comprehensive unit tests:

```rust
#[test]
fn test_arrow_functions_basic() {
    let input = "const fn = () => 1";
    let expected = "const fn = function() { return 1; }";
    test_transform(ArrowFunctions::default(), input, expected);
}

#[test]
fn test_arrow_functions_this_binding() {
    let input = "const fn = () => this.value";
    let expected = "var _this = this; const fn = function() { return _this.value; }";
    test_transform(ArrowFunctions::default(), input, expected);
}
```

### Integration Testing

Test transforms composed together:

```rust
#[test]
fn test_es2015_preset() {
    let transforms = vec![
        Box::new(ArrowFunctions::default()),
        Box::new(Classes::default()),
        Box::new(Destructuring::default()),
        // ... other ES2015 transforms
    ];
    let input = include_str!("fixtures/es2015-integration/input.js");
    let expected = include_str!("fixtures/es2015-integration/output.js");
    test_transform_chain(transforms, input, expected);
}
```

### Snapshot Testing

Use snapshot tests for complex transforms:

```rust
#[test]
fn test_class_properties_snapshot() {
    insta::assert_snapshot!(
        transform_code(ClassProperties::default(), include_str!("fixtures/complex-class.js"))
    );
}
```

### Performance Testing

Benchmark each transform and compare with:
1. Existing SWC transforms (if any)
2. Babel equivalent
3. Oxc implementation

```rust
#[bench]
fn bench_arrow_functions(b: &mut Bencher) {
    let code = include_str!("fixtures/large-file-with-arrows.js");
    b.iter(|| {
        transform(ArrowFunctions::default(), code)
    });
}
```

### Real-world Testing

Test with popular open-source projects:
- React
- Vue
- Angular
- Next.js
- Popular npm packages

Ensure transforms produce working code and don't break builds.

## Architecture Comparison

### Oxc Architecture

**Traverse Trait**:
```rust
pub trait Traverse<'a> {
    fn enter_expression(&mut self, expr: &mut Expression<'a>) {}
    fn exit_expression(&mut self, expr: &mut Expression<'a>) {}
    fn enter_statement(&mut self, stmt: &mut Statement<'a>) {}
    fn exit_statement(&mut self, stmt: &mut Statement<'a>) {}
    // ... one pair for each AST node type
}
```

**Transform Composition**:
Oxc composes transforms by chaining them in a single pass:
```rust
let mut transformer = Transformer::new(
    options,
    vec![
        Box::new(ArrowFunctions::new()),
        Box::new(Classes::new()),
        // ...
    ]
);
transformer.build(program);
```

**Context**:
```rust
pub struct TransformerCtx<'a> {
    semantic: &'a SemanticAnalysis,
    scopes: ScopeTree,
    symbols: SymbolTable,
    // ...
}
```

### SWC VisitMutHook Architecture

**VisitMutHook Trait**:
```rust
pub trait VisitMutHook<Ctx>: VisitMut {
    fn visit_mut_program(&mut self, n: &mut Program, ctx: &mut Ctx) {
        n.visit_mut_children_with_hook(self, ctx);
    }
    fn visit_mut_expr(&mut self, n: &mut Expr, ctx: &mut Ctx) {
        n.visit_mut_children_with_hook(self, ctx);
    }
    // ... one method for each AST node type
}
```

**Transform Composition**:
```rust
let transformer = Transformer::new(
    CompositeHook::new(vec![
        Box::new(ArrowFunctions::new()),
        Box::new(Classes::new()),
        // ...
    ])
);
```

**Context** (TraverseCtx from #11293):
```rust
pub struct TraverseCtx {
    scope_depth: usize,
    ancestors: Vec<AncestorNode>,
    uid_counter: HashMap<String, usize>,
    // ...
}
```

### Key Differences

1. **Hook Model**:
   - Oxc: Separate enter/exit methods for each node type
   - SWC: Single visit method with explicit child visiting

2. **Default Behavior**:
   - Oxc: Empty enter/exit methods (no traversal by default)
   - SWC: Default impl visits children (must override to prevent)

3. **Composition**:
   - Oxc: Array of transforms, each gets enter/exit calls
   - SWC: CompositeHook chains transforms, hook forwarding

4. **Context**:
   - Oxc: Shared context with semantic analysis
   - SWC: Custom context type (TraverseCtx) with scope tracking

### Similarities

1. **Single-pass**: Both support composing transforms in one AST traversal
2. **Visitor pattern**: Both use visitor pattern for AST traversal
3. **Context sharing**: Both share context across transforms
4. **Helper injection**: Both support injecting helper functions

### Migration Strategy

When porting an oxc transform to SWC:

1. **Identify hooks**: Map enter/exit methods to visit_mut methods
2. **Context usage**: Map oxc context methods to TraverseCtx methods
3. **Helper functions**: Use SWC's helper system for runtime helpers
4. **Semantic analysis**: Integrate with SWC's semantic analyzer
5. **Testing**: Import Babel tests and ensure compatibility

Example mapping:
```rust
// Oxc
impl Traverse for MyTransform {
    fn enter_expression(&mut self, expr: &mut Expression) {
        // Transform before children
    }

    fn exit_expression(&mut self, expr: &mut Expression) {
        // Transform after children
    }
}

// SWC
impl VisitMutHook<TraverseCtx> for MyTransform {
    fn visit_mut_expr(&mut self, n: &mut Expr, ctx: &mut TraverseCtx) {
        // Transform before children (entry logic)

        // Visit children
        n.visit_mut_children_with_hook(self, ctx);

        // Transform after children (exit logic)
    }
}
```

## Notes on Transform Dependencies

Many transforms have dependencies on other transforms or helpers:

1. **Classes** depends on:
   - Computed properties
   - Object super
   - Helper functions

2. **Destructuring** depends on:
   - Object rest spread
   - Array spread
   - Helper functions

3. **Async generators** depends on:
   - Async to generator
   - Helper functions

4. **Class properties** depends on:
   - Classes
   - Computed properties
   - Private methods
   - Helper functions

These dependencies must be considered when implementing and composing transforms.

## Conclusion

This guide provides a comprehensive inventory of transforms from oxc_transformer and their porting priorities to SWC. The recommended approach is:

1. Start with Phase 1 (foundation and common utilities)
2. Progress through phases sequentially
3. Test each transform individually with Babel conformance tests
4. Test composition of multiple transforms
5. Benchmark and optimize
6. Validate with real-world code

Each transform should be implemented as a separate `VisitMutHook`, following the patterns documented here, and should be composable with other transforms for single-pass transformation.
