async function httpServerStreamingResponse() {
  function periodicStream() {
    console.log(counter);
  }

  let counter = 0;
  await using server = test;
}
