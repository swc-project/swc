async function singleLabel(stream) {
  const visited = [];
  outer: for await (const item of stream) {
    if (item === 1) continue outer;
    visited.push(item);
  }
  return visited;
}

async function nestedLabels(stream) {
  const visited = [];
  outer: second: for await (const item of stream) {
    if (item === 1) continue outer;
    if (item === 2) break second;
    visited.push(item);
  }
  return visited;
}

Promise.all([singleLabel([1, 2, 3]), nestedLabels([1, 2, 3])]).then(([single, nested]) => {
  if (single.join(",") !== "2,3") {
    throw new Error(`singleLabel visited unexpected items: ${single}`);
  }
  if (nested.join(",") !== "") {
    throw new Error(`nestedLabels visited unexpected items: ${nested}`);
  }
  console.log("labeled for-await control flow passed");
});
