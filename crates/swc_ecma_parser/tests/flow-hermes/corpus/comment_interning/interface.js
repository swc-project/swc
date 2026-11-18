/* 1.1 L interface */ interface /* 1.2 L id */ name /* 1.3 L obj */ {} /* 1.4 T obj */

interface name /* 2.1 L tparams */ <T> /* 2.2 L obj */ {}

interface name /* 3.1 T id */ extends /* 3.2 L id */ super1 /* 3.3 T id */, /* 3.4 L id */ super2 /* 3.5 L obj */ {}

{
  interface name {} /* 4.1 T obj */
  /* 4.2 L interface */ interface name {} /* 4.3 T obj */
}

interface name /* 5.1 T id */
  /* 5.2 L tparams */ <T> /* 5.3 T tparams */
  /* 5.4 L obj */ {}

interface name /* 6.1 T id */
  /* 6.2 L obj */ {}

interface name extends Super /* 7.1 T id */
  /* 7.2 L obj */ {}
