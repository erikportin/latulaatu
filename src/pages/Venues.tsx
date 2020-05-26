import {
    IonContent,
    IonPage,
    IonButton,
    IonList,
    IonItem,
    IonLabel
} from '@ionic/react';
import React, {useEffect, useState} from 'react';
import './Venue.css';
import {getVenues} from '../utils/db';

const Venues: React.FC = () => {
    const [venues, setVenues] = useState<any[]>([]);

    useEffect(() => {
        async function fetch(){
            const venues = await getVenues();
            setVenues(venues)
        }

        fetch()
    }, [])

    return (
        <IonPage>
            <IonContent className="content">
                <IonList>
                    {venues.map((venue, index) => (
                        <IonItem  key={index} routerLink={`/venue/${venue.id}`}>
                            <IonLabel>{venue.name}</IonLabel>
                        </IonItem>
                    ))}
                </IonList>
                <IonButton routerLink={`/add-venue`}>Lägg till</IonButton>
            </IonContent>
        </IonPage>
    );
};

export default Venues;
