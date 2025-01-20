/* 1.1 L decl var */ declare /* 1.2 L decl var */ var /* 1.3 L id */ x /* 1.4 T id */ : /* 1.5 L mixed */ mixed /* 1.6 T mixed */ ; /* 1.7 T decl var */

{
  /* 2.1 L decl */ declare var name: mixed /* 2.2 T mixed */
  /* 2.3 L decl */ declare var name: mixed
  /* 2.4 T mixed */
}

{
  /* 3.1 L decl */ declare var name /* 3.2 T id */
  /* 3.3 L decl */ declare var name
  /* 3.4 T id */
}
