import dayjs from  'dayjs';

export function pretty(date: Date){
    return dayjs(date).format('DD/MM/YYYY')
}
export function prettyDay(date: Date){
    return dayjs(date).format('HH:mm')
}

export function isSameDay(date1: Date, date2: Date): boolean {
    return dayjs(date1).isSame(date2, 'day')
}
