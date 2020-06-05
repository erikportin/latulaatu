import {
    IonPage,IonLoading, IonActionSheet, IonFabButton, IonIcon, IonFab, IonRouterLink
} from '@ionic/react';
import React, {useEffect, useState} from 'react';
import classNames from 'classnames';
import './Venues.css';
import {getVenues, VENUE} from '../utils/db';
import {Geolocation} from "@ionic-native/geolocation";
import {distance, toPositionFromGeoposition} from "../utils/map";
import {POSITION} from "../components/Map/MapRenderer";
import {
    close,
    addOutline
} from "ionicons/icons";
import {RouteComponentProps} from "react-router";
import {QUERY, VENUE_WITH_DISTANCE} from "../utils/constants";
import {getSearchFromUrl} from "../utils/url";
interface PageProps extends RouteComponentProps<{
    history: string;
}> {}

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

interface VIEW {
    venues: VENUE_WITH_DISTANCE[];
    nearbyVenues: VENUE_WITH_DISTANCE[];
    searchingForPosition: SEARCHING_FOR_POSITION
    currentPosition?: POSITION;
    actionSheetType: ACTIONSHEET_TYPE | undefined;
}

const Venues: React.FC<PageProps> = ({ history, location: { search }, location  }) => {
    const [view, setView] = useState<VIEW>({
        venues: [],
        nearbyVenues: [],
        searchingForPosition: SEARCHING_FOR_POSITION.SEARCHING,
        actionSheetType: undefined
    });

    const shouldShowList = getSearchFromUrl(search)[QUERY.SHOW_LIST];

    useEffect(() => {
        async function fetch(){
            try{
                const currentPosition = toPositionFromGeoposition(await Geolocation.getCurrentPosition());
                const venues = await getVenues();
                const sortedVenues = sortVenuesByDistanceVenues(venues, currentPosition);
                const nearbyVenues = sortedVenues.filter(venue => venue.distance < 1);

                let actionSheetType: ACTIONSHEET_TYPE | undefined = ACTIONSHEET_TYPE.NO_VENUE;
                if(shouldShowList) {
                    actionSheetType = undefined
                } else {
                    if(nearbyVenues.length === 1){
                        history.push(`/venue/${nearbyVenues[0].id}?rate=true`)
                    } else if(nearbyVenues.length > 1){
                        actionSheetType = ACTIONSHEET_TYPE.MULTIPLE_VENUES
                    }
                }

                setView({
                    venues: sortedVenues,
                    nearbyVenues,
                    currentPosition,
                    searchingForPosition: SEARCHING_FOR_POSITION.SUCCESS,
                    actionSheetType
                })

            } catch(error){
                console.log("Geolocation error", error.message)
                setView(view => ({
                    ...view,
                    searchingForPosition: SEARCHING_FOR_POSITION.FAILED
                }))
            }
        }

        fetch()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const venuesListClassName = classNames('venues-list', {
        'is-loading': !!view.actionSheetType //TODO handle navigation
    })

    return (
        <IonPage>
                <IonLoading
                    isOpen={view.searchingForPosition === SEARCHING_FOR_POSITION.SEARCHING}
                    message={'Söker skidspår'}
                />
                <div className="venues">
                    <h1>Skidspår</h1>
                    {view.venues.length > 0 && <ul className={venuesListClassName}>
                        {view.venues.map(({name, id, distance}, index) => <li key={index}>
                            <IonRouterLink routerLink={`/venue/${id}`}>{name}</IonRouterLink>
                        </li>)}
                    </ul>}

                </div>
                {view.searchingForPosition === SEARCHING_FOR_POSITION.SUCCESS && !view.actionSheetType &&
                    <IonFab vertical="bottom" horizontal="end" slot="fixed">
                        <IonFabButton routerLink={'/add-venue'}>
                            <IonIcon icon={addOutline} />
                        </IonFabButton>
                    </IonFab>
                }

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
