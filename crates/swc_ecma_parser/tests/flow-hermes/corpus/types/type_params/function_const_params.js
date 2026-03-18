function f1<const X>(): void {}
function f2<const X, Y>(): void {}
function f3<X, const Y>(): void {}
function f4<const Y = T>(): void {}
function f5<const Y : T>(): void {}
function f6 < /* comment 1 */ const /* comment 2 */ Y /* comment 3 */ : /* comment 4 */ T /* comment 5 */ >(): void {}
