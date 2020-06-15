import {RATING} from "./db";

export interface RATING_DAY {
    rating: number,
    numberOfRaters: number,
    date: Date
}

export function getRatingByDay(rating: RATING[] = []):RATING_DAY[]{
    let days: Record<string, number[]> = {};
    let ret: RATING_DAY[] = []

    rating.forEach(({ date, score}) => {
        const dateString = date.toDateString();
        if(days[dateString]){
            days[dateString].push(score)
        } else {
            days[dateString] = [score]
        }
    });

    for (const date in days) {
        if (days.hasOwnProperty(date)) {
            const numberOfRaters = days[date].length;
            const rating = days[date].reduce((r, acc) => r + acc, 0) / numberOfRaters;
            ret.push({
                date: new Date(date),
                numberOfRaters,
                rating: parseFloat(rating.toFixed(3)),
            })
        }
    }

    return ret.sort((a, b) => b.date.getTime() - a.date.getTime());
}
