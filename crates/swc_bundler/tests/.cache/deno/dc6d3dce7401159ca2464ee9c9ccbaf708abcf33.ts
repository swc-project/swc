// Loaded from https://deno.land/x/graphql_deno@v15.0.0/lib/validation/rules/NoFragmentCyclesRule.js


import { GraphQLError } from '../../error/GraphQLError.js';
export function NoFragmentCyclesRule(context) {
  // Tracks already visited fragments to maintain O(N) and to ensure that cycles
  // are not redundantly reported.
  const visitedFrags = Object.create(null); // Array of AST nodes used to produce meaningful errors

  const spreadPath = []; // Position in the spread path

  const spreadPathIndexByName = Object.create(null);
  return {
    OperationDefinition: () => false,

    FragmentDefinition(node) {
      detectCycleRecursive(node);
      return false;
    }

  }; // This does a straight-forward DFS to find cycles.
  // It does not terminate when a cycle was found but continues to explore
  // the graph to find all possible cycles.

  function detectCycleRecursive(fragment) {
    if (visitedFrags[fragment.name.value]) {
      return;
    }

    const fragmentName = fragment.name.value;
    visitedFrags[fragmentName] = true;
    const spreadNodes = context.getFragmentSpreads(fragment.selectionSet);

    if (spreadNodes.length === 0) {
      return;
    }

    spreadPathIndexByName[fragmentName] = spreadPath.length;

    for (const spreadNode of spreadNodes) {
      const spreadName = spreadNode.name.value;
      const cycleIndex = spreadPathIndexByName[spreadName];
      spreadPath.push(spreadNode);

      if (cycleIndex === undefined) {
        const spreadFragment = context.getFragment(spreadName);

        if (spreadFragment) {
          detectCycleRecursive(spreadFragment);
        }
      } else {
        const cyclePath = spreadPath.slice(cycleIndex);
        const viaPath = cyclePath.slice(0, -1).map(s => '"' + s.name.value + '"').join(', ');
        context.reportError(new GraphQLError(`Cannot spread fragment "${spreadName}" within itself` + (viaPath !== '' ? ` via ${viaPath}.` : '.'), cyclePath));
      }

      spreadPath.pop();
    }

    spreadPathIndexByName[fragmentName] = undefined;
  }
}