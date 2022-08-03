var a;
a = "<tpl>PASS</tpl>";
for(var l, r = /<tpl>(.*)<\/tpl>/; (l = a.match(r));)a = a.replace(l[0], l[1]);
console.log(a);
