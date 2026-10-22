var let = [1];
(let)[0] = 2;
(let)[0].x = 3;
x = (let)[0];
for ((let) of [3]) console.log(let);
for ((let) in { a: 1 }) console.log(let);
for ((let)[0] in { a: 1 }) console.log(2);
