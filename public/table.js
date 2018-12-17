
function table(data) {

    var table = document.createElement("table");
    table.setAttribute("id", "mainTable")

    let tr = []; //rows
    let th = []; //headings
    let td; //tabledata

    for (let i = 0; i < data.length + 1; i++) {
        tr.push(document.createElement("tr"));
    } //create rows equal to stock amount (+1 for heading)

    for (let i = 0; i < 5; i++) {
        th.push(document.createElement("th"))
    } //create headings

    th[1].appendChild(document.createTextNode("Stock"));
    th[2].appendChild(document.createTextNode("Quantity"));
    th[3].appendChild(document.createTextNode("Bought"));
    th[4].appendChild(document.createTextNode("Current"));

    for (let i = 0; i < 5; i++) {
        tr[0].appendChild(th[i]);
    } //add headings to row

    table.appendChild(tr[0]); //add headings to table

    for (let j = 1; j < tr.length; j++) { //each row (heading excluded)

        let button = document.createElement("button");
        button.setAttribute("type", "button");
        button.innerHTML = "X";
        button.addEventListener("click", function (event) {
            removeCell(j);
        });

        tr[j].appendChild(button); //add X button

        for (let i = 0; i < 4; i++) { //each data cell
            td = document.createElement("td");
            if (i == 3) {
                let price = data[j - 1][3][0][1];
                if (price == undefined) {
                    td.appendChild(document.createTextNode("loading..."));
                } else {
                    td.appendChild(document.createTextNode(price)); //set current price
                }
            } else {
                td.appendChild(document.createTextNode(data[j - 1][i])); //set text
            }

            tr[j].appendChild(td); //add data cell to row
        }

        table.appendChild(tr[j]); //add cell rows to table
    }

    var tableNode = document.getElementById("table");
    while (tableNode.firstChild) {
        tableNode.removeChild(tableNode.firstChild);
    }
    tableNode.appendChild(table);

}
