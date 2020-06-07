import dayjs from  'dayjs';

export function pretty(date: Date){
    return dayjs(date).format('DD/MM/YYYY')
}
