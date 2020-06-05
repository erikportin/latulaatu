import {RATING} from "./db";

export interface RATING_DAY {
    rating: number,
    numberOfRaters: number,
    date: string
}

export function getRatingByDay(rating: RATING[] = []):RATING_DAY[]{
    console.log("rating", rating)
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
            ret.push({
                date,
                numberOfRaters,
                rating: days[date].reduce((r, acc) => r + acc, 0) / numberOfRaters
            })
        }
    }

    console.log("ret", ret.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()))

    return ret.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
