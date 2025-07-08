use swc_ecma_ast::Program;
use crate::cfg::{CfgBuilder, CfgAnalyzer};

/// Example usage of the Control Flow Graph analyzer
pub fn analyze_program(program: &Program) {
    // Build the CFG
    let cfg = CfgBuilder::new().build(program);
    
    // Create analyzer
    let analyzer = CfgAnalyzer::new(&cfg);
    
    // Find unreachable code
    let dead_code = analyzer.find_dead_code();
    for dc in dead_code {
        println!("Dead code found at node {:?}: {:?}", dc.node, dc.kind);
    }
    
    // Find loops
    let loops = analyzer.find_loops();
    println!("Found {} loops", loops.len());
    
    // Find infinite loops
    let infinite_loops = analyzer.find_infinite_loops();
    for &loop_id in &infinite_loops {
        println!("Infinite loop detected at node {:?}", loop_id);
    }
    
    // Find redundant conditions
    let redundant = analyzer.find_redundant_conditions();
    for rc in redundant {
        println!(
            "Redundant condition at node {:?}, previously evaluated at {:?}",
            rc.node, rc.previous_node
        );
    }
    
    // Check reachability
    let unreachable_nodes = analyzer.unreachable_code();
    println!("Total unreachable nodes: {}", unreachable_nodes.len());
}