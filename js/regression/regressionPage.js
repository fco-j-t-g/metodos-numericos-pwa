import {linearRegression} from "./linearRegression.js";
import {polynomialRegression} from "./polynomialRegression.js";

const methodSelect =
    document.getElementById("methodSelect");

const degreeContainer =
    document.getElementById("degreeContainer");

const degreeInput =
    document.getElementById("degreeInput");

const addPointBtn =
    document.getElementById("addPointBtn");

const removePointBtn =
    document.getElementById("removePointBtn");

const pointsTableBody =
    document.querySelector("#pointsTable tbody");

const calculateBtn =
    document.getElementById("calculateBtn");

const resultBox =
    document.getElementById("resultBox");

let regressionChart = null;

methodSelect.addEventListener(
    "change",
    () => {
        degreeContainer.style.display =
            methodSelect.value === "polynomial"
                ? "block"
                : "none";
    }
);

function addRow(x = "", y = ""){

    const row =
        document.createElement("tr");

    row.innerHTML = `
        <td>
            <input
                type="number"
                step="any"
                value="${x}">
        </td>
        <td>
            <input
                type="number"
                step="any"
                value="${y}">
        </td>
    `;

    pointsTableBody.appendChild(row);
}

function getPoints(){

    const rows =
        pointsTableBody.querySelectorAll("tr");

    const points = [];

    rows.forEach(row => {

        const inputs =
            row.querySelectorAll("input");

        const x =
            parseFloat(inputs[0].value);

        const y =
            parseFloat(inputs[1].value);

        if(
            !isNaN(x) &&
            !isNaN(y)
        ){
            points.push({x, y});
        }
    });

    return points;
}

function validatePoints(points){

    if(points.length < 2){
        throw new Error(
            "Se requieren al menos 2 puntos."
        );
    }
}

function renderRegressionChart(
    points,
    regression
){

    const canvas =
        document.getElementById(
            "regressionChart"
        );

    if(regressionChart){
        regressionChart.destroy();
    }

    const sorted =
        [...points].sort(
            (a, b) => a.x - b.x
        );

    const minX =
        sorted[0].x;

    const maxX =
        sorted[
            sorted.length - 1
        ].x;

    const curve = [];

    const steps = 100;

    for(
        let i = 0;
        i <= steps;
        i++
    ){

        const x =
            minX +
            (maxX - minX) *
            i / steps;

        curve.push({
            x,
            y: regression.predict(x)
        });
    }

    regressionChart =
        new Chart(canvas, {
            type: "scatter",
            data: {
                datasets: [
                    {
                        label: "Datos",
                        data: points,
                        backgroundColor:
                            "rgb(54,162,235)"
                    },
                    {
                        label: "Ajuste",
                        data: curve,
                        type: "line",
                        borderColor:
                            "rgb(255,99,132)",
                        borderWidth: 2,
                        pointRadius: 0,
                        fill: false
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: "linear",
                        position: "bottom"
                    }
                }
            }
        });
}

calculateBtn.addEventListener(
    "click",
    () => {

        try{

            const method =
                methodSelect.value;

            const points =
                getPoints();

            validatePoints(points);

            let regression;

            if(
                method === "linear"
            ){

                regression =
                    linearRegression(
                        points
                    );

            }
            else{

                const degree =
                    parseInt(
                        degreeInput.value
                    );

                if(
                    isNaN(degree) ||
                    degree < 1
                ){
                    throw new Error(
                        "Ingrese un grado válido."
                    );
                }

                regression =
                    polynomialRegression(
                        points,
                        degree
                    );
            }

            resultBox.innerHTML = `
                <strong>Ecuación:</strong>
                <br>
                ${regression.equation}
                <br><br>

                <strong>R²:</strong>
                <br>
                ${regression.r2.toFixed(6)}
            `;

            renderRegressionChart(
                points,
                regression
            );

        }
        catch(error){

            resultBox.innerHTML = `
                <span style="color:red;">
                    ${error.message}
                </span>
            `;
        }
    }
);

addPointBtn.addEventListener(
    "click",
    () => addRow()
);

removePointBtn.addEventListener(
    "click",
    () => {

        const rows =
            pointsTableBody.querySelectorAll(
                "tr"
            );

        if(rows.length > 2){
            rows[
                rows.length - 1
            ].remove();
        }
    }
);

addRow(1, 2);
addRow(2, 4);
addRow(3, 7);

methodSelect.dispatchEvent(
    new Event("change")
);