// void  operator on enum type

enum ENUM { };
enum ENUM1 { A, B, "" };

// enum type var
var ResultIsAny1 = void ENUM;
var ResultIsAny2 = void ENUM1;

// enum type expressions
var ResultIsAny3 = void ENUM1["A"];
var ResultIsAny4 = void (ENUM[0] + ENUM1["B"]);

// multiple void  operators
var ResultIsAny5 = void void ENUM;
var ResultIsAny6 = void void void (ENUM[0] + ENUM1.B);

// miss assignment operators
void ENUM;
void ENUM1;
void ENUM1["B"];
void ENUM, ENUM1;