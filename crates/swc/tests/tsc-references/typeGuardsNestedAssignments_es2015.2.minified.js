const re = /./g;
let match;
for(; null != (match = re.exec("xxx"));)match[1].length, match[2].length;
