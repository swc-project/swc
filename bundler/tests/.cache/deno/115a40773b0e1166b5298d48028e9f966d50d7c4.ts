// Loaded from https://deno.land/x/graphql_deno@v15.0.0/lib/utilities/separateOperations.js


import { Kind } from '../language/kinds.js';
import { visit } from '../language/visitor.js';

/**
 * separateOperations accepts a single AST document which may contain many
 * operations and fragments and returns a collection of AST documents each of
 * which contains a single operation as well the fragment definitions it
 * refers to.
 */
export function separateOperations(documentAST) {
  const operations = [];
  const depGraph = Object.create(null);
  let fromName; // Populate metadata and build a dependency graph.

  visit(documentAST, {
    OperationDefinition(node) {
      fromName = opName(node);
      operations.push(node);
    },

    FragmentDefinition(node) {
      fromName = node.name.value;
    },

    FragmentSpread(node) {
      const toName = node.name.value;
      let dependents = depGraph[fromName];

      if (dependents === undefined) {
        dependents = depGraph[fromName] = Object.create(null);
      }

      dependents[toName] = true;
    }

  }); // For each operation, produce a new synthesized AST which includes only what
  // is necessary for completing that operation.

  const separatedDocumentASTs = Object.create(null);

  for (const operation of operations) {
    const operationName = opName(operation);
    const dependencies = Object.create(null);
    collectTransitiveDependencies(dependencies, depGraph, operationName); // The list of definition nodes to be included for this operation, sorted
    // to retain the same order as the original document.

    separatedDocumentASTs[operationName] = {
      kind: Kind.DOCUMENT,
      definitions: documentAST.definitions.filter(node => node === operation || node.kind === Kind.FRAGMENT_DEFINITION && dependencies[node.name.value])
    };
  }

  return separatedDocumentASTs;
}

// Provides the empty string for anonymous operations.
function opName(operation) {
  return operation.name ? operation.name.value : '';
} // From a dependency graph, collects a list of transitive dependencies by
// recursing through a dependency graph.


function collectTransitiveDependencies(collected, depGraph, fromName) {
  const immediateDeps = depGraph[fromName];

  if (immediateDeps) {
    for (const toName of Object.keys(immediateDeps)) {
      if (!collected[toName]) {
        collected[toName] = true;
        collectTransitiveDependencies(collected, depGraph, toName);
      }
    }
  }
}