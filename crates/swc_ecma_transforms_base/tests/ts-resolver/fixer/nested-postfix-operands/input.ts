export {};

(((value as T)))!;
(((value satisfies T)))<U>;
(((value as const)))!;
(((f<T>)))!;
((((value as T)<U>)))!;
((((left, right) as T)))!;
((((condition ? left : right) as T)))<U>;

++(((value as T)));
(((value satisfies T)))--;
(((f<T>)))++;
--(((f<T>)));
++(((f<T>))) + other;
(((f<T>)))-- < other;
((((value as T)<U>)))++;
(((((f<T>)!))))++;

(((<number>value)))++;
++(((<number>value)));
(((<number>(value as unknown))))--;
(((<number>value)))!;

(((value)))++;
++(((value)));
(((value as T)));
(((f<T>)));
