
//TODO, draw graphs with array "data[]"

/*
Eo mart, vb peab joonistama ka tabeli canvasesse 
line-dega, sest html tabelisse graafikut vist ei joonista?
Et naq tabeli üldse removeb ja nagu kogu värk on siin canvases vms

vb saab nii et joonistab nagu iga tabeli row taha graphi (vt nagu Capture.jpg)


Kuo tahad näha milline data[] välja näeb ss line 30
*/

var ready = false;

function setup() { //cannot see data[];
    createCanvas(screen.width / 2, screen.height / 2);
    background(255, 122, 246);
    noLoop(); //only draws when new data is recieved
}

function drawGraphs() { //called in HTMLfunctions.js(17) when new data is recieved
    ready = true;
    redraw();
}

function draw() {
    if (data.length > 0) {
        //console.log(data);





    }
}
