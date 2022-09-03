import React, { useState } from "react";
import {
  GoogleMap,
  InfoWindow,
  Marker,
  MarkerClusterer,
  useJsApiLoader,
} from "@react-google-maps/api";

import data from "./data.json";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const center = {
  lat: 46.800663464,
  lng: 8.222665776,
};

function MyComponent() {
  const [showTooltipId, setShowTooltipId] = useState(null);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    // @ts-expect-error
    googleMapsApiKey: process.env.GOOGLE_MAPS_API_KEY_CLIENT,
  });

  const [map, setMap] = React.useState(null);

  const onLoad = React.useCallback(function callback(map) {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(function callback(map) {
    setMap(null);
  }, []);

  const options = {
    imagePath:
      "https://raw.githubusercontent.com/googlemaps/v3-utility-library/master/markerclusterer/images/m", // so you must have m1.png, m2.png, m3.png, m4.png, m5.png and m6.png in that folder
  };

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={8}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      <MarkerClusterer options={options}>
        {(clusterer) =>
          data.map((museum) => {
            const { id } = museum;
            const { lat, lng } = museum.data.geometry.location;
            return (
              <Marker
                key={id}
                position={{ lat, lng }}
                clusterer={clusterer}
                onClick={() => {
                  setShowTooltipId(id);
                }}
              >
                {showTooltipId === id && (
                  <InfoWindow onCloseClick={() => setShowTooltipId(null)}>
                    <MuseumInfo museum={museum} />
                  </InfoWindow>
                )}
              </Marker>
            );
          })
        }
      </MarkerClusterer>
    </GoogleMap>
  ) : (
    <></>
  );
}

export default React.memo(MyComponent);

const MuseumInfo = ({ museum }) => (
  <div>
    <strong>{museum.name}</strong>
    <pre>{museum.address}</pre>
    <pre>{museum.data.opening_hours?.weekday_text.join("\n")}</pre>
    <pre>{museum.openingTime.join("\n")}</pre>
  </div>
);
