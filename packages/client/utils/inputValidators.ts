export function runCallbackIfInteger(
  possiblyIntegerString: string,
  callback: (value: number) => void,
) {
  const regex = /(^(?!0)\d+$)|^0$/;
  if (regex.exec(possiblyIntegerString) !== null) {
    callback(parseInt(possiblyIntegerString, 10));
  }
}
