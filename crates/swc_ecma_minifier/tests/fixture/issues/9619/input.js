var a = (() => {
  switch ("production") {
    case "production":
      return "expected";
    default:
      return "unexpected1";
  }

  switch ("production") {
    case "production":
      return "unexpected2";
    default:
      return "unexpected3";
  }
})();

console.log(a);
