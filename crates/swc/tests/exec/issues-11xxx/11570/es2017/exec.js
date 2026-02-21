const fn = ({ length, ...rest }) => rest;
console.log(fn("hello"));

if (typeof expect !== "undefined") {
  expect(fn("hello")).toEqual({
    "0": "h",
    "1": "e",
    "2": "l",
    "3": "l",
    "4": "o",
  });
}
