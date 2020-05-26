import {IonContent, IonPage, IonButton} from '@ionic/react';
import React, {useEffect, useState} from 'react';
import './Venue.css';
import {RouteComponentProps} from "react-router";
import {getVenue, addRating, VENUE} from "../utils/db";

interface UserDetailPageProps extends RouteComponentProps<{
    id: string;
}> {}

const Venue: React.FC<UserDetailPageProps> = ({match}) => {
    const [venue, setVenue] = useState<VENUE | null>(null);
    const venueId = match.params.id;
    useEffect(() => {
        async function fetch(){
            const venue = await getVenue(venueId);
            setVenue(venue)
        }
        fetch()
    }, [venueId]);
    
    async function vote(score: number){
        const venue = await addRating(venueId, score);
        setVenue(venue)
    }
    
    return (
        <IonPage>
            <IonContent className="content">
                {venue &&
                    <>
                        <h1>{venue.name}</h1>
                        <p>Rating: {venue.rating.reduce((acc, {score}) => acc + score, 0)}</p>
                        <section>
                            <IonButton color="danger" onClick={() => {
                                vote(0)
                            }}>Dålig</IonButton>
                            <IonButton color="warning" onClick={() => {
                                vote(3)
                            }}>Okej</IonButton>
                            <IonButton color="success" onClick={() => {
                                vote(5)
                            }}>Bra</IonButton>
                        </section>
                    </>
                }
            </IonContent>
        </IonPage>
    );
};

export default Venue;
