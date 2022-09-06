var l;
l = "<tpl>PASS</tpl>";
for (var p, t = /<tpl>(.*)<\/tpl>/; (p = l.match(t)); )
    l = l.replace(p[0], p[1]);
console.log(l);
