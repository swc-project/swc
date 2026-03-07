const regex = /(?<year>\d{4})-(?<month>\d{2})-(?<day>\d{2})/;

expect("2017-12-23".replace(regex, "$<day>.$<month>.$<year>")).toBe("23.12.2017");

expect("2017-12-23".replace(regex, (match, year, month, day, offset, input, groups) => {
  return `${groups.day}.${groups.month}.${groups.year}`;
})).toBe("23.12.2017");
