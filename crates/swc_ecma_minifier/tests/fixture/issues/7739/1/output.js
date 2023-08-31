const formatterOpt = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
};
withCurrency && (formatterOpt.style = 'currency');
const formatter = new Intl.NumberFormat('en', formatterOpt);
console.log(formatter.format(amount));
