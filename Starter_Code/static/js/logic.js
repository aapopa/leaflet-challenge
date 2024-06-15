// URLs to grab the data
//code completed with help from tutor and peers 
let url = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson`;

// Make request
d3.json(url).then(function (data) {
  console.log(data);
  makeMap(data);
});

function makeMap(data) {
  // Base layers
  let street = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  });

  // Overlay (data) layers
  let markers = [];
  let circles = [];

  // Loop through data
  for (let i = 0; i < data.features.length; i++) {
    let row = data.features[i];

    // Location property
    if (row.geometry) {
      let latitude = row.geometry.coordinates[1];
      let longitude = row.geometry.coordinates[0];
      let depth = row.geometry.coordinates[2];
      let location = [latitude, longitude];

      // New marker
      let mag = row.properties.mag;
      let popup_text = `<h1>${row.properties.title}</h1><hr><a href="${row.properties.url}" target="_blank">Link</a>`;
      let marker = L.marker(location).bindPopup(popup_text);

      // For the marker layer
      markers.push(marker);

      // If statement for the color of the circle
      let color;
      if (depth < 10) {
        color = "#00FF00"; // Lime green
      } else if (depth < 30) {
        color = "#006400"; // Dark green
      } else if (depth < 50) {
        color = "#FFA07A"; // Light salmon (shade of orange)
      } else if (depth < 70) {
        color = "#FF8C00"; // Dark orange
      } else if (depth < 90) {
        color = "#FF4500"; // Orange red
      } else {
        color = "#641E16"; // Dark red
      }

      // Radius
      let radius = 2500 * (mag ** 2);

      // Create a new circle
      let circle = L.circle(location, {
        color: color,
        fillColor: color,
        fillOpacity: 0.5,
        radius: radius
      }).bindPopup(popup_text);

      circles.push(circle);
    }
  }

  let markerLayer = L.layerGroup(markers);
  let circleLayer = L.layerGroup(circles);

  // MAP object

  // make map object, and set the default layers
  let myMap = L.map("map", {
    center: [32.7767, -96.7970],
    zoom: 5,
    layers: [street, circleLayer]
  });

  // Base layers
  let baseMaps = {
    Street: street
  };

  // Overlays that can be toggled on or off
  let overlayMaps = {
    Markers: markerLayer,
    Circles: circleLayer
  };

  // Pass map layers into layer control
  // Add layer control to the map
  L.control.layers(baseMaps, overlayMaps).addTo(myMap);

  // Legend
  let legend = L.control({ position: 'bottomright' });

  // legend content/colors
  legend.onAdd = function (myMap) {
    let div = L.DomUtil.create('div', 'legend');
    let colors = ["#00FF00", "#006400", "#FFA07A", "#FF8C00", "#FF4500", "#641E16"];
    let labels = ["-10-10", "10-30", "30-50", "50-70", "70-90", "90+"];

    // Set the title
    div.innerHTML += "<h3>Earthquake Depth</h3>";

    // Loop through the colors and labels for legend items
    //from chatgpt 
    for (let i = 0; i < colors.length; i++) {
      div.innerHTML +=
        '<i style="background:' + colors[i] + '"></i> ' + labels[i] + '<br>';
    }

    return div;
  };

  // Add the legend control to the map
  legend.addTo(myMap);
}
