import * as core from '@actions/core'
import * as dayjs from 'dayjs'
import tz from 'dayjs/plugin/timezone'
import {HolidayType, holidays} from './holiday'

dayjs.extend(tz)

async function run(): Promise<void> {
  const date = new dayjs.Dayjs().tz('Asia/Shanghai')
  const dateKey = date.format('YYYY-MM-DD')
  let holiday: HolidayType = HolidayType.WORKDAY

  if (holidays[dateKey] != null) {
    holiday = holidays[dateKey]
  } else if (date.day() === 0 || date.day() === 6) {
    holiday = HolidayType.WEEKEND
  }

  switch (holiday) {
    case HolidayType.WEEKEND:
      core.setFailed(`Skip build: Weekend(${dateKey})`)
      break
    case HolidayType.HOLIDAY:
      core.setFailed(`Skip build: Holiday(${dateKey})`)
      break
    case HolidayType.WORKDAY:
      core.info(`Build: Workday(${dateKey})`)
      break
    case HolidayType.MAKEUP:
      core.info(`Build: Makeup(${dateKey})`)
      break
  }
}

run()
