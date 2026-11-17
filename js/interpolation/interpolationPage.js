import {linearInterpolation} from "./linearInterpolation.js";
import {lagrange, lagrangePolynomial, polynomialToString} from "./lagrange.js";

const methodSelect = document.getElementById("methodSelect");
const pointsTable = document.querySelector("#pointsTable tbody");
const addPointBtn = document.getElementById("addPointBtn");
const removePointBtn = document.getElementById("removePointBtn");
const calculateBtn = document.getElementById("calculateBtn");
const targetXInput = document.getElementById("targetXInput");
const resultBox = document.getElementById("resultBox");
const calculationTable = document.getElementById("calculationTable");
let interpolationChart = null;

function clearResults(){
    resultBox.innerHTML = "";
    calculationTable.innerHTML = "";

    if(interpolationChart){
        interpolationChart.destroy();
        interpolationChart = null;
    }
}

function addPointRow(x = "", y = ""){
    const row = document.createElement("tr");
    row.innerHTML =
    `
    <td>
        <input type="number" value="${x}">
    </td>
    <td>
        <input type="number" value="${y}">
    </td>
    `;
    pointsTable.appendChild(row);
}

function removePointRow(){
    const rows = pointsTable.querySelectorAll("tr");

    if(rows.length > 2){
        rows[rows.length - 1].remove();
    }
}

function getPoints(){
    const rows = pointsTable.querySelectorAll("tr");
    const points = [];

    rows.forEach(row => {
            const inputs = row.querySelectorAll("input");
            const x = parseFloat(inputs[0].value);
            const y = parseFloat(inputs[1].value);
            if(!isNaN(x) && !isNaN(y)){
                points.push({x, y});
            }
        }
    );
    return points;
}

function validatePoints(points){
    if(points.length < 2){
        throw new Error("Debe ingresar al menos dos puntos.");
    }

    const xValues = points.map(point => point.x);
    const unique = new Set(xValues);
    if(unique.size !== xValues.length){
        throw new Error("No puede haber valores x repetidos.");
    }
}

function refreshChart(){
    try{
        const points = getPoints();

        if(points.length > 0){
            renderInterpolationChart(points);
        }
    }
    catch{
    }
}

// Interpolación lineal
function renderInterpolationChart(points, targetX = null, targetY = null){
    if(interpolationChart){
        interpolationChart.destroy();
    }

    const ctx = document.getElementById("interpolationChart");
    const datasets = [{
        label:"Datos", data: points, backgroundColor: "#2563eb", pointRadius:6, showLine:false
    }];
    const sorted = [...points].sort((a,b)=>a.x-b.x);
    const method = methodSelect.value;
    const curveData = [];
    const minX = sorted[0].x;
    const maxX = sorted[sorted.length - 1].x;
    const samples = 100;

    if (method === "linear") {
        datasets.push({
            label:"Interpolación Lineal", data: sorted, borderColor: "#2563eb", backgroundColor: "#2563eb", pointRadius: 6, showLine: true, fill: false
        });
    }

    for(let i=0; i<=samples; i++){
        const x = minX + ((maxX-minX) * i / samples);
        let y;
        if(method === "lagrange"){
            y = lagrange(sorted, x);
        }else{
            continue;
        }
        curveData.push({
            x, y
        });
    }

    if(method === "lagrange"){
        datasets.push({
            label: "Polinomio", data: curveData, borderColor: "#16a34a", pointRadius: 0, showLine: true, fill: false, tension: 0.2
        });
    }
    
    if(targetX !== null && targetY !== null){
        datasets.push({
            label:"Resultado", data: [{
                x:targetX, y:targetY
            }], backgroundColor: "red", pointRadius: 8
        });
    }

    interpolationChart = new Chart(ctx, {
        type:"scatter", data: {
            datasets
        }, options: {
            responsive:true, scales: {

                x: {
                    type:"linear", position:"bottom"
                }
            }
        }
    });
}


// Eventos
addPointBtn.addEventListener("click", ()=> {
        addPointRow();
        refreshChart();
    }
);

removePointBtn.addEventListener("click", ()=> {
        removePointRow();
        refreshChart();
    }
);

pointsTable.addEventListener("input", refreshChart);

calculateBtn.addEventListener("click", () => {
    try {
        const method = methodSelect.value;
        const targetX = parseFloat(targetXInput.value);

        if (isNaN(targetX)) {
            throw new Error("Ingrese un valor válido para x.");
        }

        const points = getPoints();
        validatePoints(points);

        let value;
        let polynomial;

        if (method === "linear") {

            const result = linearInterpolation(points, targetX);

            value = result.value;

            polynomial =
                `P(x) = ${result.slope.toFixed(6)}x ${
                    result.intercept >= 0 ? "+" : "-"
                } ${Math.abs(result.intercept).toFixed(6)}`;

        }
        else if (method === "lagrange") {

            value = lagrange(
                points,
                targetX
            );

            const coefficients =
                lagrangePolynomial(points);

            polynomial =
                `P(x) = ${polynomialToString(coefficients)}`;
        }

        resultBox.innerHTML = `
            <strong>P(${targetX}) = ${value.toFixed(6)}</strong>
            <br><br>
            <strong>Polinomio:</strong>
            <br>
            ${polynomial}
        `;

        renderInterpolationChart(points, targetX, value);

    }
    catch (error) {
        resultBox.innerHTML = `
            <span style="color:red;">
                ${error.message}
            </span>
        `;
    }
});

addPointRow(1,2);
addPointRow(2,5);
addPointRow(4,7);
refreshChart();