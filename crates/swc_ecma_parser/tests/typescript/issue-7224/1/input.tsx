import React from 'react';

const StyledComponent = ({ className }) => {
  const style = className({ theme: { blue: '#0000ff' } });
  return <div style={style}>Hello</div>;
};

const getStatusLabel = () => {
  const disabled = false;

  return (
    <div>
      {disabled ? <StyledComponent className={({ theme }): { [key: string]: any } => ({ color: theme.blue })} /> : null}
    </div>
  );
};
const Temp = () => <div>{getStatusLabel()}</div>;

export default Temp;
