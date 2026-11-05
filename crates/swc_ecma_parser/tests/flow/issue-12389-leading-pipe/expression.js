// @flow
function isRelevant(kind: string): boolean {
  return match (kind) {
    | 'start'
    | 'move' => true,
    _ => false,
  };
}
