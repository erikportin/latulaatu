import {IonContent, IonPage, IonButton, IonFab, IonFabButton, IonIcon, IonActionSheet} from '@ionic/react';
import React, {useEffect, useState} from 'react';
import './Venue.css';
import {RouteComponentProps} from "react-router";
import {getVenue, addRating, VENUE} from "../utils/db";
import {
    close,
    heartOutline,
    heartDislikeCircleOutline,
    heartHalfOutline,
    locateOutline,
    pulseOutline, addOutline, arrowBack
} from "ionicons/icons";import {POSITION} from "../components/Map/MapRenderer";
import {VENUE_WITH_DISTANCE} from "./Venues";
import {getSearchFromUrl} from "../utils/url";
import {QUERY} from "../utils/constants";

interface PageProps extends RouteComponentProps<{
    id: string;
}> {}

enum ACTIONSHEET_TYPE {
    RATING = 'rating'
}

interface VIEW {
    venue?: VENUE;
    actionSheetType?: ACTIONSHEET_TYPE | undefined;
}

const Venue: React.FC<PageProps> = ({match, location}) => {
    const [view, setView] = useState<VIEW>({
        venue: undefined,
        actionSheetType: undefined
    });
    const venueId = match.params.id;
    useEffect(() => {
        async function fetch(){
            const venue = await getVenue(venueId);
            const search = getSearchFromUrl(location.search);
            setView({
                actionSheetType: search[QUERY.RATE] ? ACTIONSHEET_TYPE.RATING : undefined,
                venue
            })
        }
        fetch()
    }, [venueId]);

    async function vote(score: number){
        const venue = await addRating(venueId, score);
        console.log("view", view)
        setView({
            actionSheetType: undefined,
            venue
        })
    }
    
    return (
        <IonPage>
            <IonContent className="content">
                <IonFab vertical="top" horizontal="start" slot="fixed">
                    <IonFabButton routerLink={`/venues?${QUERY.SHOW_LIST}=true`}>
                        <IonIcon icon={arrowBack} />
                    </IonFabButton>
                </IonFab>
                {view.venue &&
                    <>
                        <h1>{view.venue.name}</h1>
                        <p>Rating: {view.venue.rating.reduce((acc, {score}) => acc + score, 0)}</p>

                    </>
                }
            </IonContent>
            <IonActionSheet
                header={'Hur var spåren idag?'}
                isOpen={view.actionSheetType === ACTIONSHEET_TYPE.RATING}
                onDidDismiss={() => setView({
                    ...view,
                    actionSheetType: undefined
                })}
                buttons={[
                    {
                        text: 'Bra',
                        icon: heartOutline,
                        handler: () => {
                            vote(5)
                        }
                    },
                    {
                        text: 'Okej',
                        icon: heartHalfOutline,
                        handler: () => {
                            vote(5)
                        }
                    },
                    {
                        text: 'Dåliga',
                        icon: heartDislikeCircleOutline,
                        handler: () => {
                            vote(0)
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

export default Venue;
