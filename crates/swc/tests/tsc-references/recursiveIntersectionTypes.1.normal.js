//// [recursiveIntersectionTypes.ts]
var entityList;
var s = entityList.name;
var s = entityList.next.name;
var s = entityList.next.next.name;
var s = entityList.next.next.next.name;
var productList;
entityList = productList;
productList = entityList; // Error
