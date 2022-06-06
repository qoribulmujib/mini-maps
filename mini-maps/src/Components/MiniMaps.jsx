import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css"; //import leaftlet css bawan
import axios from "axios";

export const MiniMaps = () => {
  const position = [-6.91774733368014, 107.58467149401622];
  const [geoJson, setGeojson] = useState([
    {
      key: "",
      geometry: {
        coordinates: [null, null],
      },
      properties: {
        Angka: "",
        Nama: "",
        Status: "",
        fill_color: "",
      },
    },
  ]);

  const [ltLg, setLtlg] = useState([]);
  useEffect(() => {
    const getGeoJson = async () => {
      let result = await axios.get(
        `https://server.mapid.io/layers_new/get_layer?api_key=689c2279e0834a3ba82743432605e746&layer_id=628f1d7c84b953e79a7cd896&project_id=611eafa6be8a2635e15c4afc`
      );
      let temp = result.data.geojson.features.map((state) => {
        return {
          key: state.key,

          coordinates: [
            state.geometry.coordinates[0],
            state.geometry.coordinates[1],
          ],
          properties: {
            Angka: state.properties.Angka,
            Nama: state.properties.Nama,
            Status: state.properties.Status,
            fill_color: state.properties.fill_color,
          },
        };
      });

      result.data.geojson.features.map((state) =>
        // console.log(state.geometry.coordinates)
        setLtlg((ltLg) => [
          ...ltLg,
          [
            parseFloat(state.geometry.coordinates[0]),
            parseFloat(state.geometry.coordinates[1]),
          ],
        ])
      );

      setGeojson(temp);
    };
    getGeoJson();
  }, [setGeojson, setLtlg]);

  return (
    <>
      {/* {console.log(geoJson)} */}

      <MapContainer
        center={position}
        zoom={10}
        style={{ width: "100vw", height: "100vh" }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
        />
        {ltLg.map((item, idx) => (
          <Marker
            position={[parseFloat(item[1]), parseFloat(item[0])]}
            key={idx}
          >
            <Popup>
              {geoJson.map((value) => value.coordinates[0] === item[0])}
              {/* <p>{hasil.properties.Nama}</p> */}
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </>
  );
};
