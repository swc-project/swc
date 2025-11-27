let myObject = { value: 5, isEven: true };

function checkIfEven() {
  if (({ isEven } = myObject).isEven) {
    return "Number is even";
  }
  else {
    return "Number is odd";
  }
}

function func1() {
  return checkIfEven();
}

function main() {
  let res = func1();
  console.log(res);
}

main();