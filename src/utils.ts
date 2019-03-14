import queryString from 'query-string'
import { Location } from 'history'

export const getDateFromLocation = (location: Location) => {
  const { search } = location
  let { date = '' } = queryString.parse(search)

  if (date instanceof Array) {
    date = date[0]
  }

  return new Date(date)
}
