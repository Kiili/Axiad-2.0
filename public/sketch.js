//TODO, draw graphs with array "data[]"

/*
Eo mart, vb peab joonistama ka tabeli canvasesse 
line-dega, sest html tabelisse graafikut vist ei joonista?
Et naq tabeli üldse removeb ja nagu kogu värk on siin canvases vms

vb saab nii et joonistab nagu iga tabeli row taha graphi (vt nagu Capture.jpg)


Kuo tahad näha milline data[] välja näeb ss line 30
*/

var ready = false;
var width = screen.width / 2
var height = screen.height / 2
let myCanvas

function setup() { //cannot see data[];
    myCanvas = createCanvas(displayWidth / 3 * 2 - 100, displayHeight - 200);
    myCanvas.position(displayWidth / 3, 0)
    background(51, 51, 51);
    colorMode(RGB)
    noLoop(); //only draws when new data is recieved

}

function drawGraphs() { //called in HTMLfunctions.js(17) when new data is recieved
    ready = true;
    redraw();
}

function draw() {
    background(51, 51, 51);

    // grid
    fill(102)
    stroke(102)
    strokeWeight(1)
    for (var i = 0; i < height / 40; i++) {
        line(0, i * 40, width - 30, i * 40)
    }

    // price scale
    for (var i = 0; i < height / 40; i++) {
        text((height - i * 40) / 2, width - 25, i * 40 + 5)
    }


    fill(204)
    stroke(204)
    colorMode(HSB, 255)
    if (data.length > 0) {
        console.log(data);
        for (var stock = 0; stock < data.length; stock++) {
            var name = data[stock][0]
            var stockHUE = map(parseInt(name.charAt(0), 36) - 9, 0, 26, 0, 255)
            noFill()
            stroke(stockHUE, 200, 200, 180)
            strokeWeight(3)
            beginShape()
            for (var j = 99; j > 0; j--) {
                if (data[stock][3][j][1] != "not_loaded") {
                    var price = 1 * data[stock][3][99-j][1]
                    vertex(j * (width - 50) / 100, height - price * 2)
                }
            }
            endShape()
            strokeWeight(1)
            stroke(stockHUE, 255, 255, 255)
            text(name, 10, height - (1 * data[stock][3][99][1]) * 2)
        }

    }
    colorMode(RGB)
}