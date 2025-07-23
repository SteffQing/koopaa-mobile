export function trimWhole(amount: number) {
  if (amount >= 1e9) return amount / 1e9 + 'B'
  else if (amount >= 1e6) return amount / 1e6 + 'M'
  else return amount
}

export function getPosition(position: number) {
  const j = position % 10,
    k = position % 100

  if (j === 1 && k !== 11) return `${position}st`
  if (j === 2 && k !== 12) return `${position}nd`
  if (j === 3 && k !== 13) return `${position}rd`
  return `${position}th`
}
