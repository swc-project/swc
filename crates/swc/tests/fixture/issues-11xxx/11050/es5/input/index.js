async function complexCompute(num) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(num * 2);
    }, 2000);
  });
}

async function func1() {
  let result;
  let val = 1; // initial assignment
  val = val || await complexCompute(5);

  outer_block: {
    if (!val) {
      result = "No Value";
      break outer_block;
    }

    if (val < 10) {
      switch(val) {
        case 1:
          result = "One";
          break outer_block;
        case 2:
          let temp = await complexCompute(2);
          if (temp > val) {
            result = "Two Modified";
            break outer_block;
          }
          result = "Two";
          break outer_block;
      }
    }

    result = "Out of scope";
  }

  return result;
}

async function main() {
  let res = await func1();
  console.log(res);
}

main();
