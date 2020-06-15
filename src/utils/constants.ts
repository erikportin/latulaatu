import {RATING} from "./db";
import {POSITION} from "../components/Map/MapRenderer";

export enum QUERY {
    SHOW_LIST = 'show-list',
    RATE = 'rate',
    NEW = 'new',
}

export interface VENUE_WITH_DISTANCE {
    id: string;
    name: string;
    rating: RATING[];
    location: POSITION,
    distance: number
}
