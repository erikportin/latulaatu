import {IonRouterLink} from '@ionic/react';
import React, {useEffect, useState} from 'react';
import classNames from 'classnames';
import './Venues.css';
import {getVenues, VENUE} from '../utils/db';
import {Geolocation} from "@ionic-native/geolocation";
import {distance, toPositionFromGeoposition} from "../utils/map";
import {POSITION} from "../components/Map/MapRenderer";
import { addOutline } from "ionicons/icons";
import {RouteComponentProps} from "react-router";
import {QUERY, VENUE_WITH_DISTANCE} from "../utils/constants";
import {getSearchFromUrl} from "../utils/url";
import Page from "../components/Page/Page";
import {List, ListItem} from "../components/Animated/Animated";
interface PageProps extends RouteComponentProps<{
    history: string;
}> {}

function sortVenuesByDistanceVenues(venues: VENUE[] = [], currentPosition: POSITION): VENUE_WITH_DISTANCE[]{
    return venues
        .map(venue => {
            return {
                ...venue,
                distance: distance(
                    currentPosition,
                    venue.location
                )
            }
        })
        .sort((venueA, venueB) => venueA.distance - venueB.distance);
}

enum SEARCHING_FOR_POSITION {
    SEARCHING = 'searching',
    SUCCESS = 'success',
    FAILED = 'failed',
}

enum ACTIONSHEET_TYPE {
    MULTIPLE_VENUES = 'multiple venues',
    NO_VENUE = 'no venue'
}

interface VIEW {
    venues: VENUE_WITH_DISTANCE[];
    nearbyVenues: VENUE_WITH_DISTANCE[];
    searchingForPosition: SEARCHING_FOR_POSITION
    currentPosition?: POSITION;
    actionSheetType: ACTIONSHEET_TYPE | undefined;
}

const Venues: React.FC<PageProps> = ({ history, location: { search }, location  }) => {
    const [view, setView] = useState<VIEW>({
        venues: [],
        nearbyVenues: [],
        searchingForPosition: SEARCHING_FOR_POSITION.SEARCHING,
        actionSheetType: undefined
    });

    const shouldShowList = getSearchFromUrl(search)[QUERY.SHOW_LIST];
    const hasNew = getSearchFromUrl(search)[QUERY.NEW];

    useEffect(() => {
        async function fetch(){
            try{
                const currentPosition = toPositionFromGeoposition(await Geolocation.getCurrentPosition());
                const venues = await getVenues();
                const sortedVenues = sortVenuesByDistanceVenues(venues, currentPosition);
                const nearbyVenues = sortedVenues.filter(venue => venue.distance < 1);

                let actionSheetType: ACTIONSHEET_TYPE | undefined = undefined;
                if(shouldShowList) {
                    actionSheetType = undefined
                } else {
                    if(nearbyVenues.length === 1){
                        history.push(`/venue/${nearbyVenues[0].id}?rate=true`)
                    } else if(nearbyVenues.length > 1){
                        actionSheetType = ACTIONSHEET_TYPE.MULTIPLE_VENUES
                    }
                }

                setView({
                    venues: sortedVenues,
                    nearbyVenues,
                    currentPosition,
                    searchingForPosition: SEARCHING_FOR_POSITION.SUCCESS,
                    actionSheetType
                })

            } catch(error){
                console.log("Geolocation error", error.message)
                setView(view => ({
                    ...view,
                    searchingForPosition: SEARCHING_FOR_POSITION.FAILED
                }))
            }
        }

        fetch()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const venuesListClassName = classNames('venues-list', {
        'is-loading': !!view.actionSheetType //TODO handle navigation
    });

    return (
        <Page title={'Skidspår'}
              className={'venues'}
              actionSheet={{
                  header: 'Flera skidspår hittade i din närheten. Välj ett.',
                  isOpen: view.actionSheetType === ACTIONSHEET_TYPE.MULTIPLE_VENUES,
                  buttons: view.nearbyVenues.map(({name, id}) => {
                      return {
                          text: name,
                          handler: () => {
                              history.push(`/venue/${id}?${QUERY.RATE}=true`)
                          }
                      }
                  }),
                  cancel: 'Stäng och visa alla skidspår',
                  onDidDismiss: () => {
                      setView(({
                          ...view,
                          actionSheetType: undefined
                      }))
                  },

              }}
              loader={{
                  text: 'Söker skidspår',
                  isLoading: view.searchingForPosition === SEARCHING_FOR_POSITION.SEARCHING
              }}
              actionBtn={{
                  isHidden: view.searchingForPosition === SEARCHING_FOR_POSITION.SEARCHING && view.actionSheetType === undefined,
                  link: '/add-venue',
                  icon: addOutline
              }}
        >
            <>
                {view.venues.length > 0 &&
                <List className={venuesListClassName}>
                    <>
                        <h2>Skidspår i närheten</h2>
                        {view.nearbyVenues.map(({name, id, distance}, index) => <ListItem key={index}>
                            <IonRouterLink routerLink={`/venue/${id}`}>{name}</IonRouterLink>
                        </ListItem>)}
                        {view.nearbyVenues.length === 0 && <p>Inga spår i närheten</p>}
                        <h2>Flera skidspår</h2>
                        {view.venues.slice(view.nearbyVenues.length)
                            .map(({name, id, distance}, index) => <ListItem key={index}>
                            <IonRouterLink routerLink={`/venue/${id}`}>{name}</IonRouterLink>
                            <span className="distance">{distance}km</span>
                        </ListItem>)}
                    </>
                </List>
                }
            </>
        </Page>
    );
};

export default Venues;
