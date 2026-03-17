function mutate() {}
function cond() {}

function Component(props) {
  const a = {};
  const b = {};
  const c = {};
  const d = {};
  while (true) {
    mutate(a, b);
    if (cond(a)) {
      break;
    }
  }

  if (a) {
  }

  if (b) {
  }

  if (c) {
  }

  if (d) {
  }

  mutate(d, null);
}
