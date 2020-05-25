import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonText,
    IonButton,
    IonList,
    IonItem,
    IonLabel,
    IonInput
} from '@ionic/react';
import React, {useEffect, useState} from 'react';
import './Venue.css';
import {addVenue, getVenues} from '../utils/db';

const Venues: React.FC = () => {
    const [venues, setVenues] = useState<any[]>([]);
    const [showAddVenueView, setShowAddVenueView] = useState(false);
    const [name, setName] = useState('');

    useEffect(() => {
        async function fetch(){
            const venues = await getVenues();
            setVenues(venues)
        }

        fetch()
    }, [])


    async function add(){
        await addVenue(name);
        const venues = await getVenues();
        setName('');
        setShowAddVenueView(false);
        setVenues(venues)
    }

    return (
        <IonPage>
            <IonContent fullscreen className="content">
                {!showAddVenueView && <>
                    <IonList>
                        {venues.map((venue, index) => (
                            <IonItem  key={index} routerLink={`/venue/${venue.id}`}>
                                <IonLabel>{venue.name}</IonLabel>
                            </IonItem>
                        ))}
                    </IonList>
                    <IonButton onClick={() => {
                        setShowAddVenueView(true)
                    }}>Lägg till</IonButton>
                </>}
                {showAddVenueView && <>
                    <IonItem>
                        <IonInput
                            value={name}
                            placeholder="Enter Input"
                            onIonChange={e => setName(e.detail.value!)}
                            clearInput />
                    </IonItem>
                    <IonButton onClick={() => {
                        setName('')
                        setShowAddVenueView(false)
                    }}>Cancel</IonButton>
                    <IonButton onClick={add}>Ok</IonButton>
                </>}
            </IonContent>
        </IonPage>
    );
};

export default Venues;
