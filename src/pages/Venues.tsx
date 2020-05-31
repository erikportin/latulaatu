import {
    IonContent,
    IonPage,
    IonButton,
    IonList,
    IonItem,
    IonLabel, IonLoading, IonActionSheet, IonFabButton, IonIcon, IonFab, IonNote
} from '@ionic/react';
import React, {useEffect, useState} from 'react';
import classNames from 'classnames';
import './Venues.css';
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
import {RouteComponentProps} from "react-router";
import {QUERY} from "../utils/constants";
import {getSearchFromUrl} from "../utils/url";
interface PageProps extends RouteComponentProps<{
    history: string;
}> {}

export interface VENUE_WITH_DISTANCE {
    id: string;
    name: string;
    rating: RATING[];
    location: POSITION,
    distance: number
}

function sortVenuesByDistanceVenues(venues: VENUE[] = [], currentPosition: POSITION): VENUE_WITH_DISTANCE[]{
    return venues
        .map(venue => {
            return {
                ...venue,
                distance: distance(
                    currentPosition,
                    venue.location
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

enum ACTIONSHEET_TYPE {
    MULTIPLE_VENUES = 'multiple venues',
    NO_VENUE = 'no venue'
}

enum USER_ACTION {
    SHOW_VENUES = 'show venues'
}

interface VIEW {
    venues: VENUE_WITH_DISTANCE[];
    nearbyVenues: VENUE_WITH_DISTANCE[];
    searchingForPosition: SEARCHING_FOR_POSITION
    currentPosition?: POSITION;
    actionSheetType: ACTIONSHEET_TYPE | undefined;
}

const Venues: React.FC<PageProps> = ({ history, location }) => {
    const [view, setView] = useState<VIEW>({
        venues: [],
        nearbyVenues: [],
        searchingForPosition: SEARCHING_FOR_POSITION.SEARCHING,
        actionSheetType: undefined
    });

    useEffect(() => {
        async function fetch(){
            try{
                const currentPosition = toPositionFromGeoposition(await Geolocation.getCurrentPosition());
                const venues = await getVenues();
                const sortedVenues = sortVenuesByDistanceVenues(venues, currentPosition);
                const nearbyVenues = sortedVenues.filter(venue => venue.distance < 1);

                let actionSheetType: ACTIONSHEET_TYPE | undefined = ACTIONSHEET_TYPE.NO_VENUE;
                if(getSearchFromUrl(location.search)[QUERY.SHOW_LIST]) {
                    actionSheetType = undefined
                } else {
                    if(nearbyVenues.length === 1){
                        history.push(`/venue/${nearbyVenues[0].id}?rate=true`)
                    } else if(nearbyVenues.length > 1){
                        actionSheetType = ACTIONSHEET_TYPE.MULTIPLE_VENUES
                    }
                }

                console.log("nearbyVenues", nearbyVenues)
                console.log("actionSheetType", actionSheetType)

                setView({
                    venues: sortedVenues,
                    nearbyVenues,
                    currentPosition,
                    searchingForPosition: SEARCHING_FOR_POSITION.SUCCESS,
                    actionSheetType
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

    useEffect(() => {
        console.log("view", view)
    }, [view])

    const venuesListClassName = classNames('venues-list', {
        ['is-loading']: !!view.actionSheetType
    });

    return (
        <IonPage>
            <IonContent className="content">
                <IonLoading
                    isOpen={view.searchingForPosition === SEARCHING_FOR_POSITION.SEARCHING}
                    message={'Söker skidspår'}
                />
                <h1>Skidspår</h1>
                {view.venues.length > 0 && <IonList className={venuesListClassName}>
                    {view.venues.map(({name, id, distance}, index) => <IonItem key={index} routerLink={`/venue/${id}`}>
                        <IonLabel>{name}</IonLabel>
                        <IonNote slot="end" color="primary">{`${Math.round(distance)}km`}</IonNote>
                    </IonItem>)}
                </IonList>}
                {view.searchingForPosition === SEARCHING_FOR_POSITION.SUCCESS && !view.actionSheetType &&
                    <IonFab vertical="bottom" horizontal="end" slot="fixed">
                        <IonFabButton routerLink={'/add-venue'}>
                            <IonIcon icon={addOutline} />
                        </IonFabButton>
                    </IonFab>
                }
            </IonContent>

            {/* MULTIPLE VENUES */}
            <IonActionSheet
                header={'Flera skidspår hittade i din närheten. Välj ett.'}
                isOpen={view.actionSheetType === ACTIONSHEET_TYPE.MULTIPLE_VENUES}
                onDidDismiss={() => {
                    setView(({
                        ...view,
                        actionSheetType: undefined
                    }))
                }}
                buttons={[
                    ...view.nearbyVenues.map(({name, id}) => {
                        return {
                            text: name,
                            handler: () => {
                                history.push(`/venue/${id}?${QUERY.RATE}=true`)
                            }
                        }
                    }),
                    {
                        text: 'Stäng och visa alla skidspår',
                        icon: close,
                        role: 'cancel'
                    }
                ]}
            >
            </IonActionSheet>
        </IonPage>
    );
};

export default Venues;
