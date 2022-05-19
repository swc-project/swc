((m = 10)=>m + 1)(12), ((n = 10)=>n + 1)(), ((...numbers)=>numbers.every((n)=>n > 0))(5, 6, 7), ((...mixed)=>mixed.every((n)=>!!n))(5, 'oops', 'oh no'), ((...noNumbers)=>noNumbers.some((n)=>n > 0))(), ((first, ...rest)=>[])(8, 9, 10), (({ q  })=>q)({
    q: 13
}), (({ p =14  })=>p)({
    p: 15
}), (({ r =17  } = {
    r: 18
})=>r)({
    r: 19
}), (({ u =22  } = {
    u: 23
})=>u)(), ({
    a: function(n) {
        return n;
    }
}).a(11);
