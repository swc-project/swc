import { c as _c } from "react/compiler-runtime";
function useHook(nodeID, condition) {
  const $ = _c(6);
  const graph = useContext(GraphContext);
  const node = nodeID != null ? graph[nodeID] : null;

  let value;
  let t0;
  if ($[0] !== node?.fields) {
    t0 = Object.keys(node?.fields ?? {});
    $[0] = node?.fields;
    $[1] = t0;
  } else {
    t0 = $[1];
  }
  if ($[2] !== condition || $[3] !== node || $[4] !== t0) {
    for (const key of t0) {
      if (condition) {
        value = new Class(node.fields?.[field]);
        break;
      }
    }
    $[2] = condition;
    $[3] = node;
    $[4] = t0;
    $[5] = value;
  } else {
    value = $[5];
  }

  return value;
}
