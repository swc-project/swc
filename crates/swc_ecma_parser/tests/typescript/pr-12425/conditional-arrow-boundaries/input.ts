a ? b ? ({["m"](){}}) : c => d : e;
a ? b ? ({...obj, m(){}}) : c => d : e;
a ? b ? ([{get m(){return 1}}, ...xs]) : c => d : e;
a ? b ? (x, y, {z: {set m(x){}}}) : c => d : e;
a ? b ? ({m(){return (x): T => x;}}) : c => d : e;
a ? b ? ({m(){}}) : c => ({get value(){return 1}}) : e;
a ? b ? ({m(){}}) : async c => d : e;
a ? (x, ...rest): T => x : e;
a ? async ({x} = obj): Promise<T> => x : e;
