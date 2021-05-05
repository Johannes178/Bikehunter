'use strict';


let url = 'https://api.digitransit.fi/routing/v1/routers/hsl/index/graphql';
//we need to tell mapboxgl what kind of collection of markers is this
//so we initialize the collection with the necessary info
let markerCollection = {
    "type": "FeatureCollection",
    "features": []
};

let darkTheme = false;
let map = undefined;
function switchThemes(){
if(darkTheme === true){
map = new mapboxgl.Map({
    container: 'map',
    style: 'https://tiles.stadiamaps.com/styles/alidade_smooth_dark.json',  // Style URL; see our documentation for more options
    center: [24.93, 60.19],  // Initial focus coordinate
    zoom: 10
});

    drawMarkers()
}else if(darkTheme === false){
    map = new mapboxgl.Map({
        container: 'map',
        style: 'https://tiles.stadiamaps.com/styles/alidade_smooth.json',  // Style URL; see our documentation for more options
        center: [24.93, 60.19],  // Initial focus coordinate
        zoom: 10
    });

    drawMarkers()

}
    // Add zoom and rotation controls to the map.
    map.addControl(new mapboxgl.NavigationControl());
//event listener checks if the user clicks somewhere on the map and runs showInfo()
    window.addEventListener("click", showInfo)
}
fetchStations()
window.addEventListener("load", switchThemes)
// Mapbox GL JS has a bug in it's handling of RTL, so we have to grab this dependency as well until they
// combine it with the main library
mapboxgl.setRTLTextPlugin('https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.1/mapbox-gl-rtl-text.js');





async function fetchStations(){
//fetch information of bikes from digitransit.fi api
const response = await fetch(url, {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify({
        query: `
    {
  bikeRentalStations {
    name
    stationId
    bikesAvailable
    spacesAvailable
    lat
    lon
    allowDropoff
  }
}
      `,
    }),
})

    const res = await response.json();

    //loop through the info we collected from the api
        for await (let i of res["data"]["bikeRentalStations"]) {
            //then we parse the info from the api to the correct form for mapboxgl
        let collection = {
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [i.lon, i.lat]
            },
            "properties": {
                "title": i.name,
                "stationId": i.stationId,
                "bikesAvailable": i.bikesAvailable,
                "spacesAvailable": i.spacesAvailable,
                "allowDropoff": i.allowDropoff
            }
        }

        //then we push collection now in the correct form into markerCollection
        markerCollection.features.push((collection))

    }console.log(markerCollection);

drawMarkers()


}

function drawMarkers(){
    console.log("beginning to draw")
    let z = 0;
    // Next, we can add markers to the map
    markerCollection.features.forEach(function(point) {

        // Since these are HTML markers, we create a DOM element first, which we will later
        // pass to the Marker constructor.
        let elem = document.createElement('div');
        elem.className = 'marker';
        //we add a data-id attribute with a unique value to the marker so we can later grab info from the right marker
        elem.setAttribute("data-id", z)

        // Now, we construct a marker and set it's coordinates from the GeoJSON. Note the coordinate order.
        let marker = new mapboxgl.Marker(elem);
        marker.setLngLat(point.geometry.coordinates);

        // You can also create a popup that gets shown when you click on a marker. You can style this using
        // CSS as well if you so desire. A minimal example is shown. The offset will depend on the height of your image.
        let popup = new mapboxgl.Popup({ offset: 24, closeButton: false });
        popup.setHTML('<div>' + point.properties.title + '</div>');

        // Set the marker's popup.
        marker.setPopup(popup);

        // Finally, we add the marker to the map.
        marker.addTo(map);
        z++;

    });
}
const pyoraTulostus = document.querySelector('#pyoraHaku');
// showInfo shows the information of the station in DOM
function showInfo(event) {
    //then we check if the user clicked on a marker
    if(event.target.classList.contains("mapboxgl-marker")){
        console.log("clicked")
        //we grab the unique value from data-id attribute
        const itemKey = event.target.dataset.id;
        console.log(markerCollection.features[itemKey])
        //now with the unique id we can print it on to DOM
        let html = `
                <h3 id="name">Aseman nimi: ${markerCollection.features[itemKey].properties.title}</h3>
    <h4 id="stationid">Aseman numero: ${markerCollection.features[itemKey].properties.stationId}</h4>
    <p id="bikes">Pyörien määrä: ${markerCollection.features[itemKey].properties.bikesAvailable}</p>
    <p id="spaces">Vapaat paikat: ${markerCollection.features[itemKey].properties.spacesAvailable}</p>
    <p id="allow">Pyörän jättäminen sallittu: ${markerCollection.features[itemKey].properties.allowDropoff ? "kyllä" : "ei"}</p>
            `
        pyoraTulostus.innerHTML = html;
    }else{console.log("error")}
}



let chk = document.querySelector('#chk');

chk.addEventListener('change', () => {
    darkTheme = !darkTheme
    switchThemes()
    console.log("checkbox clicked")
    document.body.classList.toggle('dark');
    document.querySelector("#pyoraHaku").classList.toggle('dark');
    document.querySelector(".navbarContent").classList.toggle('dark');

});
