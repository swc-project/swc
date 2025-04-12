async function httpServerStreamingResponse() {
  function periodicStream() {
    console.log(counter);
  }

  let counter = 0;
  await using server = test;
}

function periodicStream() {
  console.log(counter);
}

export function periodicStream2() {
  console.log(counter);
}

let counter = 0;
await using server = test;
