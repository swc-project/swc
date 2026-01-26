enum CHAR {
  ["\t"] = 0x09,
  ["\n"] = 0x0A,
  ["\v"] = 0x0B,
  ["\f"] = 0x0C,
  ["\r"] = 0x0D,
  [" "] = 0x20,

  ["-"] = 0x2D,
  ["["] = 0x5B
}

const c = "\n"

console.log(c.charCodeAt(0) === CHAR["\n"]);