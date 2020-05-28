import {
    IonContent,
    IonPage,
    IonButton,
    IonList,
    IonItem,
    IonLabel, IonLoading, IonActionSheet, IonFabButton, IonIcon, IonFab
} from '@ionic/react';
import React, {useEffect, useState} from 'react';
import './Venue.css';
import {addRating, getVenues, RATING, VENUE} from '../utils/db';
import {Geolocation} from "@ionic-native/geolocation";
import {distance, toPositionFromFirebaseGeoPoint, toPositionFromGeoposition} from "../utils/map";
import {POSITION} from "../components/Map/MapRenderer";
import {
    close,
    heartOutline,
    heartDislikeCircleOutline,
    heartHalfOutline,
    locateOutline,
    pulseOutline, addOutline
} from "ionicons/icons";
import Map from "../components/Map/Map";

interface VENUE_WITH_DISTANCE {
    id: string;
    name: string;
    rating: RATING[];
    location: POSITION,
    distance: number
}

function sortVenuesByDistanceVenues(venues: VENUE[] = [], currentPosition: POSITION): VENUE_WITH_DISTANCE[]{
    return venues
        .map(venue => {
            const location = toPositionFromFirebaseGeoPoint(venue.location);
            return {
                ...venue,
                location,
                distance: distance(
                    currentPosition,
                    toPositionFromFirebaseGeoPoint(venue.location)
                )
            }
        })
        .sort((venueA, venueB) => venueA.distance - venueB.distance);
}

enum SEARCHING_FOR_POSITION {
    SEARCHING = 'searching',
    SUCCESS = 'success',
    FAILED = 'failed',
}

interface VIEW {
    venues: VENUE_WITH_DISTANCE[];
    searchingForPosition: SEARCHING_FOR_POSITION
    currentPosition?: POSITION;
    currentVenue?: VENUE_WITH_DISTANCE | undefined;
    showActionSheet: boolean
}

const Venues: React.FC = () => {
    const [view, setView] = useState<VIEW>({
        venues: [],
        searchingForPosition: SEARCHING_FOR_POSITION.SEARCHING,
        showActionSheet: false
    });

    useEffect(() => {
        async function fetch(){
            try{
                const currentPosition = toPositionFromGeoposition(await Geolocation.getCurrentPosition());
                const venues = await getVenues();
                const sortedVenues = sortVenuesByDistanceVenues(venues, currentPosition);
                let currentVenue = undefined;
                let showActionSheet = false;
                if(sortedVenues[0] && sortedVenues[0].distance < 1){
                    currentVenue = sortedVenues[0];
                    showActionSheet = true;
                }
                setView({
                    venues: sortedVenues,
                    currentPosition,
                    currentVenue,
                    searchingForPosition: SEARCHING_FOR_POSITION.SUCCESS,
                    showActionSheet
                })

            } catch(error){
                console.log("Geolocation error", error.message)
                setView({
                    ...view,
                    searchingForPosition: SEARCHING_FOR_POSITION.FAILED
                })
            }
        }

        fetch()
    }, [])

    async function vote(id: string | undefined, score: number){
        if(id){
            const { rating } = await addRating(id, score);
            const prevVenue =  view.currentVenue;
            if(prevVenue){
                setView({
                    ...view,
                    currentVenue: {
                        ...prevVenue,
                        rating
                    }
                })
            }
        }
    }

    return (
        <IonPage>
            <IonContent className="content">
                <IonLoading
                    isOpen={view.searchingForPosition === SEARCHING_FOR_POSITION.SEARCHING}
                    message={'Söker skidspår'}
                    duration={5000}
                />
                {view.currentVenue && <>
                    <h1>{view.currentVenue.name}</h1>
                    {view.showActionSheet && <h2>Hur var spåren idag?</h2>}
                    {!view.showActionSheet && <h2>Betyg: {view.currentVenue.rating.reduce((abbr, {score}) => score + abbr, 0)}</h2>}
                    <Map position={view.currentVenue.location} />
                </>}
                {view.searchingForPosition === SEARCHING_FOR_POSITION.SUCCESS && !view.showActionSheet && <IonFab vertical="bottom" horizontal="end" slot="fixed">
                    <IonFabButton href={'/add-venue'}>
                        <IonIcon icon={addOutline} />
                    </IonFabButton>
                </IonFab>}
            </IonContent>
            <IonActionSheet
                isOpen={view.showActionSheet}
                onDidDismiss={() => setView({
                    ...view,
                    showActionSheet: false
                })}
                buttons={[
                    {
                        text: 'Bra',
                        icon: heartOutline,
                        handler: () => {
                            vote(view.currentVenue?.id, 5)
                        }
                    },
                    {
                        text: 'Okej',
                        icon: heartHalfOutline,
                        handler: () => {
                            vote(view.currentVenue?.id, 5)
                        }
                    },
                    {
                        text: 'Dåliga',
                        icon: heartDislikeCircleOutline,
                        handler: () => {
                            vote(view.currentVenue?.id, 0)
                        }
                    },
                    {
                        text: 'Stäng och visa mig spårinfo',
                        icon: close,
                        role: 'cancel',
                        handler: () => {
                            console.log('Cancel clicked');
                        }
                    }]}
            >
            </IonActionSheet>
        </IonPage>
    );
};

export default Venues;
