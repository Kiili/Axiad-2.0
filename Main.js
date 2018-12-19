
console.log("Starting..");
const fetch = require("node-fetch"),
    fs = require("fs"),
    bodyParser = require("body-parser"),
    express = require("express"),
    app = express(),
    port = 8080,
    apikey = "W94GLMLUDBL7TFZ8";

var userData = [];
//[stockindex][name, quantity, boughtFor, dates&prices]
//[stockindex][3][date, price]

updateUserData()
    .then(loadPrices) //initialize stocks&prices
    .then(() => { //start server
        
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));

        app.use(express.static("public"));

        app.get("/", function (req, res) {
            res.sendFile(__dirname + "/index.html");
        })

        app.post("/", addStock);

        app.post("/delete", function (req, res) {
            req.on("data", function (row) {
                deleteData(row - 1) //data[i]; i == row-1
                    .then(updateUserData)
                    .then(() => {
                        res.end();
                    });
            });
        })

        app.get("/prices", function (req, res) {
            updateUserData()
                .then(loadPrices)
                .then(() => {
                    if (userData != undefined) {
                        res.send(JSON.stringify(userData));
                    }
                });
        })

        app.post("/refresh", refreshPrices)

        app.listen(port, function () {
            console.log("Ready");
        })
    })
    .catch(err => console.log(err));

function refreshPrices(req, res) { //sets all prices to "not_loaded"
    for (let i = 0; i < userData.length; i++) {
        userData[i][3] = "not_loaded";
    }
    loadPrices().then(() => {
        res.end();
    });

}

function addStock(req, res) { //retrieves data from form

    let formdata = req.body.name + " " + req.body.qty + " " + req.body.price + "\n";
    fs.appendFile('userdata.txt', formdata, function (err) {
        updateUserData()
            .then(() => {
                loadPrices();
                res.sendFile(__dirname + "/index.html");
            });
    });
}

function url(symbol) {
    return "https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol="
        + symbol + "&apikey=" + apikey;
}

function getPrices(symbol) { //returns [date, price] arr
    return fetch(url(symbol))
        .then(result => {
            return result.json();
        }).then(json => {
            let dates = Object.keys(json["Time Series (Daily)"]);
            let arr = [];
            for (let i = 0; i < dates.length; i++) {
                arr.push([dates[i], json["Time Series (Daily)"][dates[i]]["4. close"]])
                if (i == dates.length - 1) { //last cycle
                    return arr;
                }
            }
        }).catch(err => {
            //Price unavailable from api
            return "err";
        })
}

function loadPrices() { //loads all prices, that are "not_loaded" or not set
    return new Promise(async function (resolve, reject) {
        if (userData != undefined && userData != [] && userData.length != 0) {
            for (let i = 0; i < userData.length; i++) {
                if (userData[i][3] == undefined || userData[i][3] == "not_loaded") {
                    let prices = await getPrices(userData[i][0]);
                    if (prices == "err") {
                        userData[i][3] = "not_loaded";
                    } else {
                        userData[i][3] = prices;
                    }
                }
                if (i == userData.length - 1) { //on last cycle
                    resolve();
                }
            }
        } else {
            resolve();
        }
    });
}

function deleteData(row) {
    return new Promise(function (resolve, reject) {

        getDataFile()
            .then(text => {
                let data = text.toString().split("\n");
                data.splice(row, 1);
                return data;

            }).then(data => {
                let result = "";
                for (let i = 0; i < data.length; i++) {
                    result += data[i].toString();
                    if (i != data.length - 1) {
                        result += "\n";
                        if (i == data.length - 2) { //on last cycle
                            return result;
                        }
                    }
                }

            }).then(result => {
                if (result == undefined) { //if userdata.txt empty
                    result = "";
                }

                fs.writeFile("./userdata.txt", result, 'utf8', function (err) {
                    if (err) {
                        console.log(err)
                    }
                    return;
                });

            }).then(() => {
                userData.splice(row, 1); //remove array from userData
                resolve();

            }).then(() => {


            }).catch(err => {
                console.log(err);
                reject();
            });
    });
}

function getDataFile() { //returns userdata.txt
    return new Promise(function (resolve, reject) {

        fs.readFile("./userdata.txt", (err, data) => {
            if (err) { //if cannot find userdata.txt

                console.log("creating userdata.txt")
                fs.writeFile("./userdata.txt", "", function (err) {

                    if (err) { //if cannot write, terminate
                        process.exit(-1);
                    } else {
                        console.log("userdata.txt created");
                        resolve("");
                    }
                });


            } else {
                resolve(data);
            }
        });
    });
}

function updateUserData() { //compares userData to userdata.txt (keeps prices)

    return new Promise(function (resolve, reject) {

        getDataFile()
            .then((data) => {
                if (data == "") { //Ära küsi pls
                    return getDataFile().then((temp) => temp.toString().split("\n"))
                }

                return data.toString().split("\n");
            })
            .then(arr => {
                arr.splice(arr.length - 1, 1);
                let data = [];
                for (let i = 0; i < arr.length; i++) {
                    data.push(arr[i].split(" "));
                    if (i == arr.length - 1) { //if on last cycle
                        return data;
                    }
                }
            })
            .then(data => { //data is array of userdata.txt file; compare it to userData

                if (data == undefined) { // if all removed
                    userData = [];
                    return;
                } else if (userData == undefined || userData.length == 0) { //if all is already removed and 1st one added
                    userData = data;
                    return;
                } else if (userData.length < data.length) { //if an element is added
                    userData.push(data[data.length - 1]); //push the added element
                    return;
                }
            })
            .then(() => {
                resolve();
            })
            .catch(err => {
                console.log(err);
                reject();
            });
    });
}
