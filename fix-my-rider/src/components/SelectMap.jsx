import { useEffect, useRef, useState } from "react";
import Map from "ol/Map";
import View from "ol/View";
import TileLayer from "ol/layer/Tile";
import OSM from "ol/source/OSM";
import { fromLonLat, toLonLat } from "ol/proj";
import VectorLayer from "ol/layer/Vector";
import VectorSource from "ol/source/Vector";
import Feature from "ol/Feature";
import Point from "ol/geom/Point";
import { Icon, Style } from "ol/style";

export function SelectMap(props) {
  const { lat, lng, setLat, setLng } = props;
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);

  useEffect(() => {
    const successCallback = (position) => {
      setLat(position.coords.latitude);

      setLng(position.coords.longitude);
    };
    const errorCallback = (error) => {
      console.log(error);
    };
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  }, []);

  useEffect(() => {
    if (lng && lat && !map) {
      const markerSource = new VectorSource();
      const markerLayer = new VectorLayer({
        source: markerSource,
        style: new Style({
          image: new Icon({
            anchor: [0.5, 1],
            src: "https://openlayers.org/en/latest/examples/data/icon.png",
          }),
        }),
      });

      const newMap = new Map({
        target: mapRef.current,
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
          markerLayer,
        ],
        view: new View({
          center: fromLonLat([lng, lat]),
          zoom: 16,
        }),
      });

      newMap.on("click", function (event) {
        markerSource.clear();
        const markerFeature = new Feature({
          geometry: new Point(event.coordinate),
        });
        markerSource.addFeature(markerFeature);
        const [newLng, newLat] = toLonLat(event.coordinate);
        setLat(newLat);
        setLng(newLng);
      });

      setMap(newMap);
      console.log(map);
    }
  }, [lng, lat, map]);

  return (
    <div
      ref={mapRef}
      style={{ width: "100%", height: "100%", borderRadius: "8px" }}
    />
  );
}
