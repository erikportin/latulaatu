import * as firebase from "firebase";

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

export interface RATING {
    date: number
    score: number
}

interface FIREBASE_VENUE {
    name: string
    rating: RATING[]
}

export interface VENUE extends FIREBASE_VENUE{
    id: string
}

console.info("init db");

export async function getVenues(): Promise<VENUE[]>{
    const snapshot = await db.collection(Collection.VENUES).get();
    const venues: VENUE[] = [];
    snapshot.forEach( (doc) => {
        const data = doc.data() as FIREBASE_VENUE;
        venues.push({
            ...data,
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

export async function addVenue(name: string): Promise<VENUE>{
    const doc = await db.collection(Collection.VENUES).add({
        name,
        rating: []
    });

    return getVenue(doc.id)
}

