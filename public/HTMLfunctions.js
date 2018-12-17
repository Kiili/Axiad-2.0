
var data = [];

function loadPrices() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            data = JSON.parse(this.responseText);
            if(refresh()){ //If there are not loaded prices
                setTimeout(loadPrices, 2000);
            }

            //data[index][stockname(0),qty(1),boughtFor(2),prices(3)][priceindex][date(0), price(1)]
            //console.log(data)
            table(data);

        }
    };
    xhttp.open("GET", "http://localhost:8080/prices", true);
    xhttp.send();
}

function removeCell(row) {

    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://localhost:8080/delete", true);
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            loadPrices();
        }
    }
    xhttp.setRequestHeader("Content-type", "text/plain");
    xhttp.send(row);
}

function refreshPrices(){ //reset all prices to not_loaded
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "http://localhost:8080/refresh", true);
    console.log("Sent");
    
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            loadPrices();
        }
    }
    xhttp.send();
}

function refresh(){ //check for unloaded prices
    for(let i = 0; i < data.length; i++){
        if(data[i][3] === "not_loaded"){
            return true;
        }
    }
}

