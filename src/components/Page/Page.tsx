import React from 'react';
import {
    IonActionSheet,
    IonContent, IonFab, IonFabButton, IonIcon, IonLoading,
    IonPage,
    useIonViewDidEnter,
    useIonViewDidLeave,
    useIonViewWillEnter,
    useIonViewWillLeave
} from "@ionic/react";
import './Page.css';
import {arrowBack, close} from "ionicons/icons";
import {QUERY} from "../../utils/constants";

interface IProps {
    children: JSX.Element[] | JSX.Element;
    title?: string;
    className?: string;
    loader?: {
        isLoading: boolean,
        text: string
    },
    actionSheet?: {
        header: string,
        isOpen: boolean,
        onDidDismiss: () => void,
        buttons: {
            text: string,
            icon?: string,
            handler: () => void
        }[],
        cancel: string;
    },
    backUrl?: string
}
const Page: React.FC<IProps> = ({ title, className, children, loader, actionSheet, backUrl}) => {
    useIonViewDidEnter(() => {
        console.log('ionViewDidEnter event fired', title);
    });

    useIonViewDidLeave(() => {
        console.log('ionViewDidLeave event fired', title);
    });

    useIonViewWillEnter(() => {
        console.log('ionViewWillEnter event fired', title);
    });

    useIonViewWillLeave(() => {
        console.log('ionViewWillLeave event fired', title);
    });
    return (
        <IonPage className={`page ${className}`}>
            {loader && <IonLoading
                cssClass={"loader"}
                isOpen={loader.isLoading}
                message={loader.text}
            />}
            <IonContent>
                {title && <h1 className="title">{title}</h1>}
                {children}
            </IonContent>
            {actionSheet && <IonActionSheet
                cssClass={'action-sheet'}
                header={actionSheet.header}
                isOpen={actionSheet.isOpen}
                onDidDismiss={actionSheet.onDidDismiss}
                buttons={[
                    ...actionSheet.buttons,
                    {
                        text: actionSheet.cancel,
                        icon: close,
                        role: 'cancel'
                    }
                ]}
            >
            </IonActionSheet>}
            {backUrl && <IonFab vertical="bottom" horizontal="start" slot="fixed">
                <IonFabButton color={'secondary'} routerLink={backUrl}>
                    <IonIcon icon={arrowBack} />
                </IonFabButton>
            </IonFab>}
        </IonPage>
    )
}

export default Page;
