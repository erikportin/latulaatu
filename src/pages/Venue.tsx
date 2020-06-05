import {IonPage, IonFab, IonFabButton, IonIcon, IonActionSheet} from '@ionic/react';
import React, {useEffect, useState} from 'react';
import './Venue.css';
import {RouteComponentProps} from "react-router";
import {getVenue, addRating, VENUE} from "../utils/db";
import {
    close,
    heartOutline,
    heartDislikeCircleOutline,
    heartHalfOutline,
    arrowBack
} from "ionicons/icons";
import {getSearchFromUrl} from "../utils/url";
import {QUERY} from "../utils/constants";
import {getRatingByDay} from "../utils/rating";

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

const Venue: React.FC<PageProps> = ({match, location: { search }}) => {
    const [view, setView] = useState<VIEW>({
        venue: undefined,
        actionSheetType: undefined
    });
    const venueId = match.params.id;

    useEffect(() => {
        async function fetch(){
            const venue = await getVenue(venueId);
            const searchFromUrl = getSearchFromUrl(search);

            setView({
                actionSheetType: searchFromUrl[QUERY.RATE] ? ACTIONSHEET_TYPE.RATING : undefined,
                venue
            })
        }
        fetch()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [venueId]);

    async function vote(score: number){
        const venue = await addRating(venueId, score);
        setView({
            actionSheetType: undefined,
            venue
        })
    }
    
    return (
        <IonPage>
            <div className="venue">
                {view.venue &&
                    <>
                        <h1>{view.venue.name}</h1>
                        <ul>
                            {getRatingByDay(view.venue.rating).map(({ rating, date, numberOfRaters }) =>
                                <li>
                                    <span className="date">{date}</span>
                                    <span className="score">{rating}</span>
                                </li>
                            )}
                        </ul>
                    </>
                }
            </div>
            <IonFab vertical="bottom" horizontal="start" slot="fixed">
                <IonFabButton routerLink={`/venues?${QUERY.SHOW_LIST}=true`}>
                    <IonIcon icon={arrowBack} />
                </IonFabButton>
            </IonFab>
            <IonFab vertical="bottom" horizontal="end" slot="fixed">
                <IonFabButton onClick={() => {
                    setView({
                        ...view,
                        actionSheetType: ACTIONSHEET_TYPE.RATING
                    })
                }}>
                    <IonIcon icon={heartOutline} />
                </IonFabButton>
            </IonFab>
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
