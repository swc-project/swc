{
  /* L array */ [] /* T array */
  /* L str */ 'end of array tests'
}

{
  /* L params */ () => 1 /* T num */
  /* L str */ 'end of arrow tests'
}

{
  /* L arrow */ (() => 1) /* T arrow */
  /* L str */ 'end of parenthesized arrow tests'
}

{
  /* L assign */ (x = 1) /* T assign */
  /* L id */ x = 1 /* T num */
  /* L str */ 'end of assign tests'
}

{
  /* L binary */ (1 + 1) /* T binary */
  /* L num */ 1 + 1 /* T num */
  /* L str */ 'end of binary tests'
}

{
  /* L call */ (f()) /* T call */
  /* L id */ f() /* T args */
  /* L str */ 'end of call tests'
}

{
  /* L class */ (class C {}) /* T class */
  /* L var decl */ let c = class C {} /* T class body */
  /* L str */ 'end of class tests'
}

{
  /* L conditional */ (true ? 1 : 2) /* T conditional */
  /* L bool */ true ? 1 : 2 /* T num */
  /* L str */ 'end of conditional tests'
}

{
  /* L func */ (function(){}) /* T func */
  /* L var decl */ let f = function(){} /* T block */
  /* L str */ 'end of function tests'
}

{
  /* L id */ x /* T id */
  /* L str */ 'end of identifier tests'
}

{
  /* L import */ import('') /* T import */
  /* L str */ 'end of import tests'
}

{
  /* L JSX element */ <div /> /* T JSX element */
  /* L str */ 'end of JSX element tests'
}

{
  /* L JSX fragment */ <><div /></> /* T JSX fragment */
  /* L str */ 'end of JSX fragment tests'
}

{
  /* L num */ 1 /* T num */
  /* L str */ 'end of literal tests'
}

{
  /* L logical */ (true || false) /* T logical */
  /* L bool */ true || false /* T bool */
  /* L str */ 'end of logical tests'
}

{
  /* L member */ (obj.prop) /* T member */
  /* L id */ obj.prop /* T id */
  /* L id */ obj[prop] /* T member */
  /* L str */ 'end of member tests'
}

{
  /* L new */ new Test() /* T args */
  /* L str */ 'end of new tests'
}

{
  /* L obj */ ({}) /* T obj */
  /* L str */ 'end of object tests'
}

{
  /* L sequence */ (1, 1) /* T sequence */
  /* L num */ 1, 1 /* T num */
  /* L str */ 'end of sequence tests'
}

{
  /* L template literal */ `template` /* T template literal */
  /* L str */ 'end of template literal tests'
}

{
  /* L tagged template */ (tag`template`) /* T tagged template */
  /* L id */ tag`template` /* T template literal */
  /* L str */ 'end of tagged template tests'
}

{
  /* L this */ this /* T this */
  /* L str */ 'end of this tests'
}

{
  /* L type cast */ (1: number) /* T type cast */
  /* L str */ 'end of type cast tests'
}

{
  /* L unary */ (!true) /* T unary */
  /* L unary */ !true /* T bool */
  /* L str */ 'end of unary tests'
}

{
  /* L update */ (++x) /* T update */
  /* L update */ ++x /* T id */
  /* L id */ x++ /* T update */
  /* L str */ 'end of update tests'
}

function metaProperty() {
  /* L meta property */ (new.target) /* T meta property */
  /* L id */ new.target /* T id */

  /* L str */ 'end of meta property tests'
}

function* generator() {
  /* Leading yield */ (yield 1) /* Trailing yield */
  /* L yield */ yield 1 /* T num */

  /* L str */ 'end of yield tests'
}
