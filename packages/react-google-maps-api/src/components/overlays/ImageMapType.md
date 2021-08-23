# ImageMapType example

The `ImageMapType` component is only meant to be used as an overlay layer. To use it as a basemap, i.e., a basic maptype, you can directly initialize a `ImageMapType` class instance using original Google Maps JavaScript API, and add the instance to the `extraMapTypes` props of the `GoogleMap` component.


```jsx
const { GoogleMap, LoadScript } = require("../../");
const ScriptLoaded = require("../../docs/ScriptLoaded").default;

const mapContainerStyle = {
  height: "100%",
  width: "100%"
};

const center = { 
    lat: 41.85, 
    lng: -87.65 
};



const options = {
    // getTileUrl: (tile, zoom) => {
    //     return "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png".replace('{x}', tile.x).replace('{y}', tile.y)
    //       .replace('{z}', zoom)
    // },
    // getTile: (coord, zoom, ownerDocument) => {
    //     const div = ownerDocument.createElement("div");
    //     div.innerHTML = String(coord);
    //     div.style.width = this.tileSize.width + "px";
    //     div.style.height = this.tileSize.height + "px";
    //     div.style.fontSize = "10";
    //     div.style.borderStyle = "solid";
    //     div.style.borderWidth = "1px";
    //     div.style.borderColor = "#AAAAAA";
    //     return div;
    // },
    tileSize: {x:256, y:256},
};


<ScriptLoaded>
  <GoogleMap
    id="imageMapType-example"
    mapContainerStyle={mapContainerStyle}
    zoom={10}
    center={center}
  >
   <ImageMapType options={options}>
  </GoogleMap>
</ScriptLoaded>
```
