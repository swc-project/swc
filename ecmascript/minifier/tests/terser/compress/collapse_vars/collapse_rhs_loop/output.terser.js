var s;
s = "<tpl>PASS</tpl>";
for (var m, r = /<tpl>(.*)<\/tpl>/; (m = s.match(r)); )
    s = s.replace(m[0], m[1]);
console.log(s);
