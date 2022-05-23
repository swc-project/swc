export function Nj(a) {
    a: for(;;){
        for(; null === a.sibling;){
            if (null === a.return || Mj(a.return)) return null;
            a = a.return;
        }
        for(a.sibling.return = a.return, a = a.sibling; 5 !== a.tag && 6 !== a.tag && 18 !== a.tag;){
            if (2 & a.flags || null === a.child || 4 === a.tag) continue a;
            a.child.return = a, a = a.child;
        }
        if (!(2 & a.flags)) return a.stateNode;
    }
}
