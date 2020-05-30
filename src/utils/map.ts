import {POSITION} from "../components/Map/MapRenderer";
import {Geoposition} from "@ionic-native/geolocation";
import * as firebase from "firebase";

export function toPositionFromGeoposition(location: Geoposition): POSITION{
    return {lat: location.coords.latitude, lng: location.coords.longitude}
}
export function toPositionFromFirebaseGeoPoint(location: firebase.firestore.GeoPoint): POSITION{
    return {lat: location.latitude, lng: location.longitude}
}

export function distance(loc1: POSITION, loc2: POSITION): number {
    if ((loc1.lat == loc2.lat) && (loc1.lng == loc2.lng)) {
        return 0;
    }
    else {
        const radlat1 = Math.PI * loc1.lat/180;
        const radlat2 = Math.PI * loc2.lat/180;
        const theta = loc1.lng - loc2.lng;
        const radtheta = Math.PI * theta/180;
        let dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
        if (dist > 1) {
            dist = 1;
        }
        dist = Math.acos(dist);
        dist = dist * 180/Math.PI;
        dist = dist * 60 * 1.1515;
        dist = dist * 1.609344;

        return dist;
    }
}
