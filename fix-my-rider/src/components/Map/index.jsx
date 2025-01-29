import "mapbox-gl/dist/mapbox-gl.css";
import Map, {
  Marker,
  NavigationControl,
  FullscreenControl,
  GeolocateControl,
} from "react-map-gl";
import { useState, useEffect } from "react";
import { useContext } from "react";
import Card from "./Card";
import mainContext from "../../context/mainContext";

function MapComponent() {
  const context = useContext(mainContext);
  const { mechanics, setMechanics, lng, setLng, lat, setLat } = context;

  useEffect(() => {
    const successCallback = (position) => {
      setLat(position.coords.latitude);
      setLng(position.coords.longitude);
      console.log("lat " + position.coords.latitude);
      console.log("long " + position.coords.longitude);
    };

    const errorCallback = (error) => {
      console.log(error);
    };
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);

    var token = localStorage.getItem("token");
  }, []);

  return (
    <>
      {lat && (
        <Map
          mapboxAccessToken={process.env.REACT_APP_MAP_KEY}
          style={{
            width: "100%",
            height: "80vh",
            marginTop: "3.5rem",
            borderRadius: "8px",
          }}
          initialViewState={{
            longitude: lng,
            latitude: lat,
            zoom: 14,
          }}
          mapStyle="mapbox://styles/mapbox/outdoors-v12"
        >
          {mechanics?.length >= 0 &&
            mechanics.map((data) => {
              return <Card data={data} />;
            })}
          <Marker longitude={lng} latitude={lat} />
          <NavigationControl position="bottom-right" />
          <FullscreenControl />
          <GeolocateControl />
        </Map>
      )}
    </>
  );
}

export default MapComponent;
