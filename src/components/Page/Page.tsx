import React from 'react';
import {
    IonActionSheet,
    IonContent, IonFab, IonFabButton, IonIcon, IonLoading,
    IonPage, IonToast,
    useIonViewDidEnter, useIonViewDidLeave,
    useIonViewWillEnter,
    useIonViewWillLeave
} from "@ionic/react";
import './Page.css';
import {arrowBack, close} from "ionicons/icons";
import {Span} from "../Animated/Animated";

interface ACTION_BTN {
    onClick?: () => void,
    icon: string;
    link?: string,
    position?: 'bottom' | 'top',
    isHidden?: boolean,
}

interface IProps {
    children: JSX.Element[] | JSX.Element;
    title?: string;
    className?: string;
    loader?: {
        isLoading: boolean,
        text: string
    },
    actionSheet?: {
        header?: string,
        isOpen: boolean,
        onDidDismiss: () => void,
        buttons: {
            text: string,
            icon?: string,
            handler: () => void
        }[],
        cancel?: string;
    },
    toast?: {
        isOpen: boolean,
        text: string
    },
    backUrl?: string,
    actionBtn?: ACTION_BTN
    viewWillEnter?: () => void
    viewWillLeave?: () => void
    viewDidEnter?: () => void
    viewDidLeave?: () => void
}

function getActionBtnEl(actionBtn: ACTION_BTN | undefined): JSX.Element | null {
    if(actionBtn && !actionBtn.isHidden) {
        if (actionBtn.link) {
            return <IonFab vertical={actionBtn.position || 'bottom'} horizontal="end" slot="fixed">
                <IonFabButton color={'tertiary'} routerLink={actionBtn.link}>
                    <IonIcon icon={actionBtn.icon}/>
                </IonFabButton>
            </IonFab>
        }
        if (actionBtn.onClick) {
            return <IonFab vertical={actionBtn.position || 'bottom'} horizontal="end" slot="fixed">
                <IonFabButton color={'tertiary'} onClick={actionBtn.onClick}>
                    <IonIcon icon={actionBtn.icon}/>
                </IonFabButton>
            </IonFab>
        }
    }

    return null;
}

const Page: React.FC<IProps> = ({ title, className, children, loader, actionSheet, toast, backUrl, actionBtn, viewWillEnter, viewWillLeave, viewDidEnter, viewDidLeave}) => {
    useIonViewDidEnter(() => {
        if(viewDidEnter){
            viewDidEnter()
        }
    });

    useIonViewWillEnter(() => {
        if(viewWillEnter){
            viewWillEnter()
        }
    });

    useIonViewWillLeave(() => {
        if(viewWillLeave){
            viewWillLeave()
        }
    });

    useIonViewDidLeave(() => {
        if(viewDidLeave){
            viewDidLeave()
        }
    });


    return (
        <IonPage className={`page ${className}`}>
            {loader && <IonLoading
                cssClass={"loader"}
                isOpen={loader.isLoading}
                message={loader.text}
            />}
            {toast && <IonToast
                isOpen={toast.isOpen}
                message={toast.text}
                position={'middle'}
                duration={200}
            />}
            <IonContent>
                <div className="page-inner">
                    {title && <h1 className="title">
                        <Span className="title-inner">{title}</Span>
                    </h1>}
                    <div className="body">
                        {children}
                    </div>
                </div>
            </IonContent>

            {actionSheet && <IonActionSheet
                cssClass={'action-sheet'}
                header={actionSheet.header}
                isOpen={actionSheet.isOpen}
                onDidDismiss={actionSheet.onDidDismiss}
                buttons={[
                    ...actionSheet.buttons,
                    {
                        text: actionSheet.cancel || 'Stäng',
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
            {getActionBtnEl(actionBtn)}
        </IonPage>
    )
};

export default Page;
