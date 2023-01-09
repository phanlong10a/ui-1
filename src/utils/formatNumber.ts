export function numberWithDots(x: number) {
  if (!x) return 0;
  const arrStr = x.toString().split('.');
  let res = arrStr[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  return arrStr.length === 1 ? res : `${res},${arrStr[1].slice(0, 2)}`;
}
