import {
    IonContent,
    IonPage,
    IonButton,
    IonInput,
    IonItem
} from '@ionic/react';
import React, {useState} from 'react';
import './Venue.css';
import {addVenue} from "../utils/db";
import {RouteComponentProps} from "react-router";
interface UserDetailPageProps extends RouteComponentProps<{
    history: string;
}> {}

const AddVenue: React.FC<UserDetailPageProps> = ({history}) => {
    const [name, setName] = useState('');

    async function add(){
        const venue = await addVenue(name);
        console.log(`/venue/${venue.id}`,`/venue/${venue.id}` )
        history.push(`/venue/${venue.id}`);
    }
    
    return (
        <IonPage>
            <IonContent className="content">
                <IonItem>
                    <IonInput
                        value={name}
                        placeholder="Enter Input"
                        onIonChange={e => setName(e.detail.value!)}
                        clearInput />
                </IonItem>
                <IonButton routerLink={`/venues`}>Cancel</IonButton>
                <IonButton onClick={add} disabled={!name}>Ok</IonButton>
            </IonContent>
        </IonPage>
    );
};

export default AddVenue;
