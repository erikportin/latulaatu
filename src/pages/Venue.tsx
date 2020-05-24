import {IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonText, IonButton} from '@ionic/react';
import React from 'react';
import './Venue.css';

const Venue: React.FC = () => {
  return (
    <IonPage>
        <IonContent fullscreen className="content">
            <h1>Elljusspåret - Nykarleby</h1>
            <section>
                <IonButton color="danger">Dålig</IonButton>
                <IonButton color="warning">Okej</IonButton>
                <IonButton color="success">Bra</IonButton>
            </section>
        </IonContent>
    </IonPage>
  );
};

export default Venue;
