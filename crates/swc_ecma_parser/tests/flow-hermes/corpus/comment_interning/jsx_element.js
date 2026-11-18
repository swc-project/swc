/* 1.1 L JSX element */ <div>test</div> /* 1.2 T JSX element */;

</* 2.1 L JSX id */ div /* 2.2 T JSX id */>test</ /* 2.3 L JSX id */ div /* 2.4 T JSX id */>;

</* 3.1 L JSX id */ Member /* 3.2 T JSX id */ . /* 3.3 L JSX id */ div /* 3.4 JSX id */ />;

</* 4.1 L JSX id */ Namespace /* 4.2 T JSX id */ : /* 4.3 L JSX id */ div /* 4.4 JSX id */ />;

<div /* 5.1 L JSX id */ name /* 5.2 JSX id */ />;

<div /* 6.1 L JSX id */ name /* 6.2 T JSX id */=/* 6.3 L lit */ "test" /* 6.4 T lit */ />;

<div name=/* 7.1 L JSX expr */ {/* 7.2 L num */ 1 /* 7.3 T num */} /* 7.4 T JSX expr */ />;

<div>{/* 8.1 L JSX spread */ ... /* 8.2 L obj */ {} /* 8.3 T obj */}</div>;

<div /* 9.1 L JSX spread */{... /* 9.2 L obj */ {} /* 9.3 T obj */} /* 9.4 T JSX spread */ />;

<div /* 10.1 L id */ name /* 10.2 L id */ name="value" /* 10.3 L id */ name={'value'} /* 10.4 L spread */ {...{}} />;

<div /* 11.1 T id */
  /* 11.2 L id */ name /* 11.3 T id */
  /* 11.4 L id */ name="value" /* 11.5 T lit */
  /* 11.6 L id */ name={'value'} /* 11.7 T expr */
  /* 11.8 L spread */ {...{}} /* 11.9 T spread */
  name />;

// Verify comments at boundary of JSX lex mode change are not duplicated
<div />; // 12.1 T
<div />; // 12.2 T

<div>{/* 13.1 I */}</div>;
