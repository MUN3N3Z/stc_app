import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import axios from 'axios';

export function PrinterMap() {
    const style = {
        height: "600px",
        width: "100%"
    };
    const center = {
        lat: 41.3117,
        lng: -72.9256
    };
    
    const [markers, setMarkers] = useState(null);
    const [printers, setPrinters] = useState([]);
    const [loadState, setLoadState] = useState(true);

    useEffect(() => {
        const fetchPrinters = async () => {
        try{
            await axios.get('http://127.0.0.1:5000/printers')
            .then(response => {
                setPrinters(response.data);
                setLoadState(false);
            });
        }
        catch (error) {
            console.error('Error fetching printer data:', error);
            setLoadState(false);
        }}
        fetchPrinters();
    }, []);

    const geocodeAddress = (address) => {
        return new Promise((resolve, reject) => {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ address: address }, (results, status) => {
            if (status === 'OK') {
                const location = results[0].geometry.location;
                resolve(location);
            } else {
                console.error('Address not found:' + address);
                //reject(new Error('Geocoding failed: ' + status));
                resolve(undefined);
            }});
        });
    };

    const geocodeAddresses = async () => {
        if (!loadState){
            const promises = printers.map(async (item) => {
            const location = await geocodeAddress(item.addr);
            return (
            <Marker
                key={item.name}
                position={location}
                icon={item.status === 0 ? 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' : 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'}
            />
            );
        });
        const resolvedMarkers = await Promise.all(promises);
        setMarkers(resolvedMarkers);
        }
    };


    return (
        <>
            {!loadState ? 
            (<LoadScript googleMapsApiKey='AIzaSyBiQbVIpUF5kiFmxUD9IrAtvfYYMsCdnAo' onLoad={geocodeAddresses}>
                <GoogleMap mapContainerStyle={style} zoom={15} center={center} options={{disableDefaultUI:true}}>
                    {markers}
                </GoogleMap>
            </LoadScript>) :
            (<div className="loader">
            </div>)
            }
        </>
    )
}