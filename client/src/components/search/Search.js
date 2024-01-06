import React, { useEffect, useState } from "react";
import Map from "../map/Map";
const Search = (props) => {
  const data = props.data;
  const [map, setMap] = useState([]);
  const [selectedMarker, setSelectedMarker] = useState(null);
  useEffect(() => {
    if (data.length !== 0) {
      const mapArray = [];
      data.forEach((el) => {
        mapArray.push({
          id: el.id,
          lat: el.gmapLat,
          lng: el.gmapLen,
        });
      });
      setMap(mapArray);
    }
  }, [data]);

  if (data.length === 0) {
    return (
      <div className="search-results">
        <div className="cards">
          <div className="card">
            <h2>Aucun résultat trouvé</h2>
          </div>
        </div>
        <div className="map">
          <Map height="91vh" data={[]}></Map>
        </div>
      </div>
    );
  } else {
    return (
      <div className="search-results">
        <div className="cards">
          {/* Card 1 */}
          {data.map((item, index) => (
            <div
              className="card"
              key={index}
              onMouseOver={() => setSelectedMarker(item)}
              onMouseLeave={() => setSelectedMarker([])}
            >
              <h2>{item.name}</h2>
              <p>Address: {item.address}</p>
              <p>Phone: {item.phone}</p>
              <a href="#">Visit Website</a>
            </div>
          ))}
        </div>
        <div className="map">
          <Map
            data={map}
            marker={selectedMarker}
            townName={props.town}
            height="91vh"
          />
        </div>
      </div>
    );
  }
};

export default Search;
