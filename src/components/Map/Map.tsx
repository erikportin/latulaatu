import React from 'react';
import './Map.css';
import MapRenderer, {POSITION} from "./MapRenderer";

interface ContainerProps {
    onClick?: (data: any) => void;
    position?: POSITION
    showMap?: boolean;
}

const LOCAL_MAP_API_KEY = "AIzaSyBFHx9_WHhJBqzroTCozrMt40aMerF99-I";

const Map: React.FC<ContainerProps> = ({onClick, position, showMap = true}) => {
    if(!showMap){
        return null;
    }
    return (
        <>
            <MapRenderer
                googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${LOCAL_MAP_API_KEY}&v=3.exp&librarie=geometry,drawing,places`}
                loadingElement={<div style={{ height: `100%` }} />}
                containerElement={<div style={{ height: `100vh`, width: '100%'}} />}
                mapElement={<div style={{ height: `100%` }} />}
                onClick={onClick}
                position={position}
            >
            </MapRenderer>
        </>
    );
};

export default Map;
