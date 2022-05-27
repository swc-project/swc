var a;
a = "<tpl>PASS</tpl>";
for(var b, c = /<tpl>(.*)<\/tpl>/; (b = a.match(c));)a = a.replace(b[0], b[1]);
console.log(a);
