var callback;
var _loop = function () {
    var value = callback;
    return value
        ? "break"
        : (callback = function () {
              return value;
          });
};

for (; _loop() !== "break"; );
console.log(callback());
