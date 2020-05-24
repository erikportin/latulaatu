import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonText } from '@ionic/react';
import React from 'react';
import ExploreContainer from '../components/ExploreContainer';
import './Home.css';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Latulaatu</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent>
          <IonText color="secondary">
              <h1>Latulaatu</h1>
          </IonText>
      </IonContent>
    </IonPage>
  );
};

export default Home;
