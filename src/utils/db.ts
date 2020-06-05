import * as firebase from "firebase";
import {POSITION} from "../components/Map/MapRenderer";
import {toPositionFromFirebaseGeoPoint} from "./map";

// Initialize Cloud Firestore through Firebase
firebase.initializeApp({
    apiKey: "AIzaSyC47hADIXNzbqB9LDNLtzgqH_f_ajUp9TE",
    authDomain: "latulaatu.firebaseapp.com",
    databaseURL: "https://latulaatu.firebaseio.com",
    projectId: "latulaatu",
    storageBucket: "latulaatu.appspot.com",
    messagingSenderId: "470047789573",
    appId: "1:470047789573:web:7b279f8d7e5665a20a826c",
    measurementId: "G-GMGEG530XN"
});

const db = firebase.firestore();

enum Collection {
    VENUES = 'venues'
}

interface FIREBASE_RATING {
    date: firebase.firestore.Timestamp,
    score: number
}

interface FIREBASE_VENUE {
    name: string;
    rating: FIREBASE_RATING[];
    location: firebase.firestore.GeoPoint
}

export interface RATING {
    date: Date,
    score: number
}


export interface VENUE{
    name: string;
    rating: RATING[];
    location: POSITION;
    id: string
}

console.info("init db");


function toRating({ score, date }: FIREBASE_RATING): RATING{
    return {
        score,
        date: date.toDate()
    }
}


export async function getVenues(): Promise<VENUE[]>{
    const snapshot = await db.collection(Collection.VENUES).get();
    const venues: VENUE[] = [];
    snapshot.forEach( (doc) => {
        const data = doc.data() as FIREBASE_VENUE;
        venues.push({
            ...data,
            rating: data.rating.map(toRating),
            location: toPositionFromFirebaseGeoPoint(data.location),
            id: doc.id
        })
    });

    return venues;
}

export async function getVenue(id: string): Promise<VENUE>{
    const snapshot = await db.collection(Collection.VENUES).doc(id).get()
    const data = snapshot.data() as FIREBASE_VENUE;

    return {
        ...data,
        rating: data.rating.map(toRating),
        location: toPositionFromFirebaseGeoPoint(data.location),
        id: snapshot.id
    };
}

export async function addRating(id: string, score: number): Promise<VENUE>{
    const venueRef = db.collection(Collection.VENUES).doc(id);

    await venueRef.update({
        rating: firebase.firestore.FieldValue.arrayUnion({
            score,
            date: firebase.firestore.Timestamp.now()
        })
    });

    return getVenue(id)
}

export async function addVenue(name: string, latLng: POSITION): Promise<VENUE>{
    const doc = await db.collection(Collection.VENUES).add({
        name,
        rating: [],
        location: new firebase.firestore.GeoPoint(latLng.lat, latLng.lng)
    });

    return getVenue(doc.id)
}

