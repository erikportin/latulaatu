import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap, Marker } from "react-google-maps"
import './Map.css';
import theme from './themes/light.json';

export interface MAP_DATA {
    latLng: {
        lat: () => number
        lng: () => number
    }
}

export interface POSITION {
    lat: number,
    lng: number
}

interface ContainerProps {
    options?: any;
    zoom?: number;
    position?: POSITION,
    onClick?: (data: MAP_DATA) => void
}

const MapRenderer: React.FC<ContainerProps> = ({options = {}, zoom, position, onClick}) => {
    return (
        <>
            <GoogleMap
                defaultZoom={zoom || 12}
                defaultCenter={position || { lat: 63.5217687, lng: 22.5216011 }}
                onClick={onClick}
                options={{
                    fullscreenControl: false,
                    locationControl: true,
                    zoomControl: true,
                    streetViewControl: false,
                    mapTypeControl: false,
                    scaleControl: false,
                    scrollwheel: false,
                    styles: theme,
                    ...options
                }}
            >
                {position && <Marker position={position}/>}
            </GoogleMap>
        </>
    );
};

export default withScriptjs(withGoogleMap(MapRenderer));
