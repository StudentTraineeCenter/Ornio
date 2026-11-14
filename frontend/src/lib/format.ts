const datePart = (value: string) => value.slice(0, 10)

const asDate = (value: string) => {
  const date = new Date(`${datePart(value)}T00:00:00`)
  return Number.isNaN(date.getTime()) ? null : date
}

export function cas(value: string) {
  const match = value.match(/T(\d{2}:\d{2})/)
  return match?.[1] ?? ''
}

export function datum(value: string) {
  const date = asDate(value)
  return date
    ? new Intl.DateTimeFormat('cs-CZ', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric',
      }).format(date)
    : ''
}

export function denMesic(value: string) {
  const date = asDate(value)
  if (!date) return { den: '', mesic: '' }

  return {
    den: new Intl.DateTimeFormat('cs-CZ', { day: 'numeric' }).format(date),
    mesic: new Intl.DateTimeFormat('cs-CZ', { month: 'short' }).format(date),
  }
}
