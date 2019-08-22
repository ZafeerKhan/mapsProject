var mymap;
var sitesData = [];
var mapMarkers = [];

function onStart() {
    siteLocations = fetchData()
    drawMap();
    //drawMapItems();   
}
onStart();

function drawMap() {
    mymap = L.map('mapid').setView([44.660913, -63.577656], 6);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1IjoiemE2MTAwNDMwIiwiYSI6ImNqd3RpdXc5bzAxdmkzeW14bGl2ZWtpdzcifQ.f6i3NZvDced6xwGUL3alkA'
    }).addTo(mymap);
}

function drawMapItems(month, percentVal) {
    console.log("In drawMapItems")
    console.log(siteLocations.find(object => object.engNum === "J1488"))
    let min = 1000;
    let max = 0;
    let third = 0;
    let twoThird = 0;

    
    for (let i = 0; i < 150; i++) {
        if (siteLocations[i].latitude == null || siteLocations[i].longitude == null || siteLocations[i].engNum == null) {
            continue
        }

        let costObj = siteCosts.find(object => object.eng === siteLocations[i].engNum)
        if (costObj == null) {
            continue
        }

        let value = costObj[month] 
        if (value == null) {
            continue
        }

        if (min > value) {
            min = value
        }

        if (max < value) {
            max = value
        }
    }

    third = ((max - min) / 3) + min
    twoThird = third + ((max - min) / 3)
    console.log(min)
    console.log(max)
    console.log(third)
    console.log(twoThird)

    for (let i = 0; i < 150; i++) {
        if (siteLocations[i].latitude == null || siteLocations[i].longitude == null || siteLocations[i].engNum == null) {
            console.log("Lat NULL or Long NULL or engNum NULL")
            continue
        }

        let costObj = siteCosts.find(object => object.eng === siteLocations[i].engNum)
        if (costObj == null) {
            console.log("No matching eng number")
            continue
        }

        let colour;
        if (costObj[month] > twoThird) {
            colour = "red"
        }
        else if (costObj[month] > third) {
            colour = "yellow"
        }
        else if (costObj[month] == null) {
            continue
        }
        else {
            colour = "green"
        }

        sitesData.push({
            lat: siteLocations[i].latitude,
            long: siteLocations[i].longitude,
            eng: siteLocations[i].engNum,
            type: colour
        })
    }

    addMarker(sitesData);
}

function addMarker(markerList) {

    // var tooltip = $('.leaflet-tooltip');
    // tooltip.css('font-size', 44);

    markerList.forEach(item => {
        var marker = L.marker([item.lat, item.long]).addTo(mymap);

        if (item.type == "red") {
            marker.bindTooltip(item.eng, { className: 'redToolTip', permanent: true }).openTooltip();
        }
        else if (item.type == "yellow") {
            marker.bindTooltip(item.eng, { className: 'yellowToolTip', permanent: true }).openTooltip();
        }
        else if (item.type == "black") {
            marker.bindTooltip(item.eng, { className: 'blackToolTip', permanent: true }).openTooltip();
        }
        else {
            marker.bindTooltip(item.eng, { className: 'greenToolTip', permanent: true }).openTooltip();
        }

        mapMarkers.push(marker)

    });
}

function addCircle(circleList) {
    popupList = [];
    circleList.forEach(circle => {
        var circle = L.circle([circle.lat, circle.long], {
            color: circle.color,
            fillColor: circle.fillColor,
            fillOpacity: circle.fillOpacity,
            radius: circle.radius
        }).addTo(mymap);

        popupList.push(circle);

        circle.bindPopup("I am a circle.");
    });

    for (let i = 1; i <= popupList.length; i++) {
        popupList[i - 1].bindTooltip("Circle " + i).openTooltip();
    }

}

function addPolygon(polyList) {
    popupList = [];
    polyList.forEach(pointArray => {
        polyPoints = [];
        pointArray.forEach(point => {
            polyPoints.push([point.lat, point.long]);
        });
        var polygon = L.polygon(polyPoints).addTo(mymap);

        popupList.push(polygon);
    });

    for (let i = 1; i <= popupList.length; i++) {
        popupList[i - 1].bindTooltip("Polygon " + i).openTooltip();
    }
}

function onMapClick(e) {
    alert("You clicked the map at " + e.latlng);
}

//markerInput = [{ lat: 51.5, long: -0.14 }, { lat: 51.508, long: -0.09 }, { lat: 51.5059, long: -0.04 }];
//addMarker(markerInput);

circleInput = [
    { lat: 51.508, long: -0.13, color: 'red', fillColor: '#f03', fillOpacity: 0.5, radius: 500 },
    { lat: 51.508, long: -0.10, color: 'blue', fillColor: '#f03', fillOpacity: 0.2, radius: 200 },
    { lat: 51.5059, long: -0.06, color: 'black', fillColor: '#f03', fillOpacity: 0.9, radius: 100 }];
//addCircle(circleInput);

polygonInput = [
    [{ lat: 51.514, long: -0.133 }, { lat: 51.519, long: -0.130 }, { lat: 51.515, long: -0.11 }, { lat: 51.514, long: -0.133 }],
    [{ lat: 51.509, long: -0.08 }, { lat: 51.503, long: -0.06 }, { lat: 51.51, long: -0.047 }],
    [{ lat: 51.522, long: -0.05 }, { lat: 51.514, long: -0.06 }, { lat: 51.508, long: -0.05 }, { lat: 51.508, long: -0.045 }, { lat: 51.514, long: -0.04 }]
];
//addPolygon(polygonInput);

mymap.on('click', onMapClick);

function filterMonth(month) {
    let input = document.getElementById('percentVal').value;
    let percentVal = parseInt(input)

    clearMarkers()
    console.log(month)
    drawMapItems(month, percentVal)
    console.log("sitesData.length: " + sitesData.length)
}

function clearMarkers() {
    if (mapMarkers.length > 0) {
        for (var i = 0; i < this.mapMarkers.length; i++) {
            mymap.removeLayer(this.mapMarkers[i]);
        }
        mapMarkers = []
        sitesData = []
        console.log("cleared")
    }
}