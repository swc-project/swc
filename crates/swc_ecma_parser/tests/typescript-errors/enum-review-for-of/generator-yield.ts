enum E { A = (function* () { for (yield of [1]) {} })() }
