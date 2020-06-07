import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './style/theme/variables.css';
import './style/base.css';
import Venues from "./pages/Venues";
import Venue from './pages/Venue';
import AddVenue from "./pages/AddVenue";

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet animated={false}>
        <Route path="/venue/:id" component={Venue} exact={true} />
        <Route path="/venues" component={Venues} exact={true} />
        <Route path="/add-venue" component={AddVenue} exact={true} />
        <Route exact path="/" render={() => <Redirect to="/venues" />} />
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
