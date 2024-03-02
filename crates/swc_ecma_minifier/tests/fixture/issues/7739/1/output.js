const formatterOpt = {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
};
withCurrency && (formatterOpt.style = 'currency'), console.log(new Intl.NumberFormat('en', formatterOpt).format(amount));
