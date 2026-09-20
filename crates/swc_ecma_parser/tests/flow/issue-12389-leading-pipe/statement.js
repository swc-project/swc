// @flow
function handle(kind: string): void {
  match (kind) {
    | 'start'
    | 'move' => {
      console.log(kind);
    }
    _ => {}
  }
}
