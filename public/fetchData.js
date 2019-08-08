var siteLocations;

var HttpClient = function () {
    this.get = function (aUrl, aCallback) {
        var anHttpRequest = new XMLHttpRequest();
        anHttpRequest.onreadystatechange = function () {
            if (anHttpRequest.readyState == 4 && anHttpRequest.status == 200)
                aCallback(anHttpRequest.responseText);
        }

        anHttpRequest.open("GET", aUrl, true);
        anHttpRequest.send(null);
    }
}

var client = new HttpClient();

function fetchData() {
    client.get('http://localhost:3000/siteLocations', function (response) {
        responseArray = JSON.parse(response)
        siteLocations = responseArray;

        console.log("Done fetching site location data");
        console.log(siteLocations.find(object => object.engNum === "J1547"))
        drawMapItems();
    })   
}

