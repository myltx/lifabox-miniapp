import dayjs from 'dayjs'

interface DayData {
  date: string
  count: number
}

export function getCalendarData(): DayData[][] {
  const weeks: DayData[][] = []

  const today = dayjs().endOf('day')
  const startDate = today.subtract(52 * 7, 'day')

  // 补齐从周日开始
  let cursor = startDate.startOf('week')

  for (let w = 0; w < 53; w++) {
    const week: DayData[] = []
    for (let d = 0; d < 7; d++) {
      week.push({
        date: cursor.format('YYYY-MM-DD'),
        count: Math.floor(Math.random() * 6), // 随机次数，可替换为真实数据
      })
      cursor = cursor.add(1, 'day')
    }
    weeks.push(week)
  }

  return weeks
}
