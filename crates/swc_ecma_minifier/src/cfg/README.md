# Control Flow Graph Analyzer

This module provides a Control Flow Graph (CFG) analyzer for JavaScript/TypeScript code in the SWC minifier.

## Overview

The CFG analyzer consists of three main components:

1. **Graph Structure** (`graph.rs`): Defines the basic CFG nodes, edges, and graph structure
2. **Builder** (`builder.rs`): Implements a visitor pattern to construct CFGs from AST nodes
3. **Analyzer** (`analyzer.rs`): Provides various analysis algorithms on the CFG

## Features

### CFG Construction
- Handles all JavaScript control flow constructs:
  - Conditional statements (if/else)
  - Loops (while, do-while, for, for-in, for-of)
  - Switch statements
  - Try-catch-finally blocks
  - Break and continue statements (including labeled)
  - Return and throw statements
  - Function declarations

### Analysis Capabilities
- **Reachability Analysis**: Detect unreachable code
- **Dominance Analysis**: Compute dominators and dominance frontiers
- **Loop Detection**: Find and analyze loop structures
- **Dead Code Detection**: Identify unreachable statements
- **Infinite Loop Detection**: Find loops without exit conditions
- **Redundant Condition Detection**: Find duplicate condition checks

## Usage

```rust
use swc_ecma_ast::Program;
use swc_ecma_minifier::cfg::{CfgBuilder, CfgAnalyzer};

// Build CFG from a program
let cfg = CfgBuilder::new().build(&program);

// Create analyzer
let analyzer = CfgAnalyzer::new(&cfg);

// Find dead code
let dead_code = analyzer.find_dead_code();

// Find loops
let loops = analyzer.find_loops();

// Check reachability
if analyzer.is_reachable(node_id) {
    // Node is reachable from entry
}
```

## Implementation Notes

- Each function has its own CFG with separate entry/exit nodes
- The CFG preserves the original AST nodes for easy reference
- Edge types indicate the kind of control flow (normal, conditional, exceptional)
- The analyzer computes various properties lazily for efficiency

## Future Improvements

- Inter-procedural analysis
- More sophisticated dead code detection
- Data flow analysis capabilities
- Integration with the minifier's optimization passes