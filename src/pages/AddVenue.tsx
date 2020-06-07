import {
    IonPage,
    IonButton,
    IonInput,
    IonItem,
    IonActionSheet, IonModal, IonToast, IonLoading, IonIcon, IonFab, IonFabButton
} from '@ionic/react';
import React, {useEffect, useState} from 'react';
import { Geolocation } from '@ionic-native/geolocation/';
import './Venue.css';
import {addVenue} from "../utils/db";
import {RouteComponentProps} from "react-router";
import Map from '../components/Map/Map';
import {MAP_DATA, POSITION} from "../components/Map/MapRenderer";
import {close, add, locateOutline, arrowBack} from "ionicons/icons";
import {QUERY} from "../utils/constants";
interface UserDetailPageProps extends RouteComponentProps<{
    history: string;
}> {}

enum SEARCHING_FOR_POSITION {
    SEARCHING = 'searching',
    SUCCESS = 'success',
    FAILED = 'failed',
}

interface VIEW {
    name: string | undefined;
    latLng: POSITION | undefined;
    searchingForPosition: SEARCHING_FOR_POSITION;
    showAddView: boolean;
    showActionSheet: boolean;

}

const AddVenue: React.FC<UserDetailPageProps> = ({history}) => {
    const [view, setView] = useState<VIEW>({
        name: undefined,
        latLng: undefined,
        searchingForPosition: SEARCHING_FOR_POSITION.SEARCHING,
        showAddView: false,
        showActionSheet: false
    });


    useEffect(() => {
        if(view.searchingForPosition === SEARCHING_FOR_POSITION.SEARCHING){
            find()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    async function find(){
        try{
            const currentPosition = await Geolocation.getCurrentPosition();
            console.log("Geolocation found", currentPosition.coords.latitude)
            setView(view => ({
                ...view,
                latLng: {
                    lat: currentPosition.coords.latitude,
                    lng: currentPosition.coords.longitude
                },
                searchingForPosition: SEARCHING_FOR_POSITION.SUCCESS,
                showActionSheet: true
            }));
        } catch(error){
            setView({
                ...view,
                searchingForPosition: SEARCHING_FOR_POSITION.FAILED,
            });
            console.log("Geolocation error", error.message)
        }
    }

    async function addNewVenue(){
        //TODO refactor away if
        if(view.name && view.latLng){
            const venue = await addVenue(view.name, view.latLng);
            setView({
                ...view,
                showAddView: false
            });
            history.push(`/venue/${venue.id}`);
        }
    }

    function onDropPin({latLng: { lat, lng }}: MAP_DATA){
        setView({
            ...view,
            latLng: {
                lat: lat(),
                lng: lng()
            },
            showActionSheet: true
        });
    }
    
    return (
        <IonPage>
            <div className="content">
                <IonFab vertical="top" horizontal="start" slot="fixed">
                    <IonFabButton routerLink={`/venues?${QUERY.SHOW_LIST}=true`}>
                        <IonIcon icon={arrowBack} />
                    </IonFabButton>
                </IonFab>
                {view.searchingForPosition !== SEARCHING_FOR_POSITION.SEARCHING && <IonFab vertical="top" horizontal="end" slot="fixed">
                    <IonFabButton onClick={find}>
                        <IonIcon icon={locateOutline} />
                    </IonFabButton>
                </IonFab>}
                <IonToast
                    isOpen={view.searchingForPosition === SEARCHING_FOR_POSITION.SUCCESS}
                    message="Position hittad"
                    position={'middle'}
                    duration={200}
                />
                <IonLoading
                    isOpen={view.searchingForPosition === SEARCHING_FOR_POSITION.SEARCHING}
                    message={'Söker position'}
                />
                <Map
                    showMap={view.searchingForPosition !== SEARCHING_FOR_POSITION.SEARCHING}
                    onClick={onDropPin}
                    position={view.latLng}
                />
                <IonModal isOpen={view.showAddView}>
                    <IonItem>
                        <IonInput
                            value={view.name}
                            placeholder="Namn"
                            onIonChange={e => setView({
                                ...view,
                                name: e.detail.value!
                            })}
                            clearInput />
                        <IonButton onClick={addNewVenue} disabled={!view.name}>Lägg till</IonButton>
                    </IonItem>
                    <IonButton onClick={() => setView({
                        ...view,
                        showAddView: false
                    })}>Stäng</IonButton>
                </IonModal>
                <IonActionSheet
                    isOpen={view.showActionSheet}
                    onDidDismiss={() => {
                        setView({
                            ...view,
                            showActionSheet: false
                        })
                    }}
                    buttons={[{
                        text: 'Lägg till spår?',
                        icon: add,
                        handler: () => {
                            setView({
                                ...view,
                                showAddView: true
                            })
                        }
                    }, {
                        text: 'Stäng',
                        icon: close,
                        role: 'cancel',
                        handler: () => {
                            setView({
                                ...view,
                                latLng: undefined,
                                showAddView: false
                            })
                        }
                    }]}
                >
                </IonActionSheet>
            </div>
        </IonPage>
    );
};

export default AddVenue;
