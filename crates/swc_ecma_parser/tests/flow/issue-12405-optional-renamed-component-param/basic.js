component RenamedParameter(
  required as requiredLocal: number,
  optional?: number,
  optionalBefore? as beforeLocal: number,
  optionalAfter as afterLocal?: number,
  'data-testid' as dataTestId?: string,
  'defaulted' as defaulted?: number = 3,
) {
  return null;
}
