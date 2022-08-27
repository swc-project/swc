//// [exhaustiveSwitchStatements1.ts]
var E, MyEnum, Level, Animal;
!function(E) {
    E[E.A = 0] = "A", E[E.B = 1] = "B";
}(E || (E = {})), function(MyEnum) {
    MyEnum[MyEnum.A = 0] = "A", MyEnum[MyEnum.B = 1] = "B";
}(MyEnum || (MyEnum = {})), function(Level) {
    Level[Level.One = 0] = "One", Level[Level.Two = 1] = "Two";
}(Level || (Level = {})), function(Animal) {
    Animal[Animal.DOG = 0] = "DOG", Animal[Animal.CAT = 1] = "CAT";
}(Animal || (Animal = {}));
