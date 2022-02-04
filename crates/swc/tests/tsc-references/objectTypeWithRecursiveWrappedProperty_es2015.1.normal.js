// Basic recursive type
class List {
}
var list1 = new List();
var list2 = new List();
var list3 = new List();
list1 = list2; // ok
list1 = list3; // error
