const getStatusLabel = () => {
  return (
    <div>
      {disabled ? <StyledComponent className={({ theme }): { [key: string]: any } => ({ color: theme.blue })} /> : null}
    </div>
  );
};
export default getStatusLabel;
