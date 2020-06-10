import {IonIcon} from '@ionic/react';
import React, {useEffect, useLayoutEffect, useRef, useState} from 'react';
import './Venue.css';
import {RouteComponentProps} from "react-router";
import {getVenue, addRating, VENUE} from "../utils/db";
import {
    heartOutline,
    heartDislikeCircleOutline,
    heartHalfOutline,
} from "ionicons/icons";
import {getSearchFromUrl} from "../utils/url";
import {QUERY} from "../utils/constants";
import {getRatingByDay} from "../utils/rating";
import {pretty} from "../utils/date";
import Page from "../components/Page/Page";
import {List, ListItem} from "../components/Animated/Animated";
import {PATHS} from "../App";

interface PageProps extends RouteComponentProps<{
    id: string;
}> {}

enum ACTIONSHEET_TYPE {
    RATING = 'rating'
}

interface VIEW {
    venue?: VENUE;
    actionSheetType?: ACTIONSHEET_TYPE | undefined;
}

function getIconForRating(rating: number): string{
    if(rating > 4) {
        return heartOutline
    }

    if(rating > 2){
        return heartHalfOutline
    }

    return heartDislikeCircleOutline
}

const Venue: React.FC<PageProps> = ({ match: { params: { id: venueId } }, location: { search, pathname }}) => {
    const [view, setView] = useState<VIEW>({
        venue: undefined,
        actionSheetType: undefined
    });

    let prevPath = useRef(pathname);

    useLayoutEffect(() => {
        if(pathname.startsWith(PATHS.VENUE) && pathname !== prevPath.current){
            setView({
                actionSheetType: undefined,
                venue: undefined
            })
        }
    }, [pathname])

    useEffect(() => {
        if(pathname.startsWith(PATHS.VENUE)){
            prevPath.current = pathname;
        }
    }, [pathname])

    useEffect(() => {
        async function fetch() {
            const venue = await getVenue(venueId);
            const searchFromUrl = getSearchFromUrl(search);
            setView({
                actionSheetType: searchFromUrl[QUERY.RATE] ? ACTIONSHEET_TYPE.RATING : undefined,
                venue
            })
        }

        fetch();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [venueId])

    async function vote(score: number){
        const venue = await addRating(venueId, score);
        setView({
            actionSheetType: undefined,
            venue
        })
    }

    return (
        <Page title={view.venue?.name}
              backUrl={`/venues?${QUERY.SHOW_LIST}=true`}
              actionSheet={{
                  header: 'Hur var spåren idag?',
                  isOpen: view.actionSheetType === ACTIONSHEET_TYPE.RATING,
                  onDidDismiss: () => setView({
                      ...view,
                      actionSheetType: undefined
                  }),
                  buttons: [
                      {
                          text: 'Bra',
                          icon: heartOutline,
                          handler: () => {
                              vote(5)
                          }
                      },
                      {
                          text: 'Okej',
                          icon: heartHalfOutline,
                          handler: () => {
                              vote(5)
                          }
                      },
                      {
                          text: 'Dåliga',
                          icon: heartDislikeCircleOutline,
                          handler: () => {
                              vote(0)
                          }
                      }]
              }}
              actionBtn={{
                  onClick: () => {
                      setView({
                          ...view,
                          actionSheetType: ACTIONSHEET_TYPE.RATING
                      })
                  },
                  icon: heartOutline
              }}
              className="venue"
        >
            <>
                {view.venue &&
                <List className="ratings">
                    {getRatingByDay(view.venue.rating).map(({ rating, date }, index) =>
                        <ListItem key={index} className="rating">
                            <span className="date">{pretty(date)}</span>
                            <span className="score">
                                    <IonIcon icon={getIconForRating(rating)} />
                                </span>
                        </ListItem>
                    )}
                </List>
                }
            </>
        </Page>
    );
};

export default Venue;
