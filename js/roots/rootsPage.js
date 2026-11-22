import {bisection} from "./bisection.js";
import {secant} from "./secant.js";
import {newtonRaphson} from "./newtonRaphson.js";

const methodSelect = document.getElementById("methodSelect");
const dynamicInputs = document.getElementById("dynamicInputs");
const plotBtn = document.getElementById("plotBtn");
const calculateBtn = document.getElementById("calculateBtn");
const table = document.getElementById("iterationsTable");
const resultBox = document.getElementById("resultBox");
let chart = null;
let functionChart = null;

// Datos según el método
function renderInputs(){
    const method = methodSelect.value;

    if(method === "bisection"){
        dynamicInputs.innerHTML = `
        <div class="form-group">
            <label>a</label>
            <input id="aInput">
        </div>

        <div class="form-group">
            <label>b</label>
            <input id="bInput">
        </div>
        `;
    }

    if(method === "newton"){
        dynamicInputs.innerHTML = `
        <div class="form-group">
            <label>x₀</label>
            <input id="x0Input">
        </div>
        `;
    }

    if(method === "secant"){
        dynamicInputs.innerHTML = `
        <div class="form-group">
            <label>x₀</label>
            <input id="x0Input">
        </div>

        <div class="form-group">
            <label>x₁</label>
            <input id="x1Input">
        </div>
        `;
    }
}

function createFunction(expression){
    return function(x){
        return math.evaluate(expression, {x});
    };
}

// Tabla de Bisección
function renderBisectionIterations(iterations){
    let html = `
    <tr>
        <th>Iteración</th>
        <th>a</th>
        <th>b</th>
        <th>xr</th>
        <th>f(xr)</th>
        <th>Error</th>
    </tr>
    `;

    iterations.forEach(item =>{
            html += `
            <tr>
                <td>${item.iteration}</td>
                <td>${item.a.toFixed(6)}</td>
                <td>${item.b.toFixed(6)}</td>
                <td>${item.xr.toFixed(6)}</td>
                <td>${item.fxr.toExponential(3)}</td>

                <td>${item.error == null ? "-": item.error.toExponential(3)}</td>
            </tr>
            `;
        }
    );
    table.innerHTML = html;
}

// Tabla de Newton Raphson
function renderNewtonIterations(iterations){
    let html = `
    <tr>
        <th>Iter</th>
        <th>x</th>
        <th>f(x)</th>
        <th>f'(x)</th>
        <th>Error</th>
    </tr>
    `;

    iterations.forEach(item => {html += `
        <tr>
            <td>${item.iteration}</td>
            <td>${item.x.toFixed(6)}</td>
            <td>${item.fx.toExponential(3)}</td>
            <td>${item.dfx.toExponential(3)}</td>
            <td>${item.error.toExponential(3)}</td>
        </tr>
        `;
        }
    );

    table.innerHTML = html;
}

// Tabla de Secante
function renderSecantIterations(iterations){
    let html = `
    <tr>
        <th>Iter</th>
        <th>x</th>
        <th>f(x)</th>
        <th>Error</th>
    </tr>
    `;

    iterations.forEach(item => {
        html += `
        <tr>
            <td>${item.iteration}</td>
            <td>${item.x.toFixed(6)}</td>
            <td>${item.fx.toExponential(3)}</td>
            <td>${item.error.toExponential(3)}</td>
        </tr>
        `;
        }
    );

    table.innerHTML = html;
}

function renderChart(iterations, property){
    if(chart){
        chart.destroy();
    }

    const ctx = document.getElementById("rootChart");
    const labels = iterations.map(item => item.iteration);
    const values = iterations.map(item => item[property]);

    chart = new Chart(ctx, {
        type: "line", data: {
            labels, datasets: [{
                label: property, data: values, borderColor: "#2563eb", fill:false, tension:0.2
            }]
        }, options: {responsive:true}
    });
}

function renderFunctionChart(f){

    if(functionChart){
        functionChart.destroy();
    }

    const ctx = document.getElementById("functionChart");
    const curve = [];
    const xMin = -3;
    const xMax = 3;
    tension = 0
    const steps = 300;

    for(let i = 0; i <= steps; i++){
        const x =xMin + (xMax - xMin) * i / steps;

        try{
            const y = f(x);
            if(Number.isFinite(y)){
                curve.push({x, y});
            }
        }
        catch{
            // ignorar discontinuidades
        }
    }

    functionChart = new Chart(ctx, {type: "scatter",
        data: {
            datasets: [{
                label: "f(x)", data: curve, showLine: true, borderColor: "#2563eb", borderWidth: 2, pointRadius: 0, tension: tension
            }, {
                label: "Eje X", data: [{x:xMin,y:0}, {x:xMax,y:0}], showLine: true, borderColor: "#666", borderWidth: 1, pointRadius: 0
            }]
        },
        options: {
            responsive: true, scales: {
                x: {type: "linear", title: {display: true, text: "x"}},
                y: {title: {display: true, text: "f(x)"}}
            }
        }
    });
}

function clearResults(){
    resultBox.innerHTML = "";
    table.innerHTML = "";
    if(chart){
        chart.destroy();
        chart = null;
    }
}

// Botón gráficar
plotBtn.addEventListener("click", () => {
        try{
            const expression = document.getElementById("functionInput").value;
            if(!expression.trim()){
                throw new Error("Debe ingresar una función.");
            }
            const f = createFunction(expression);
            renderFunctionChart(f);
        }
        catch(error){
            resultBox.innerHTML = error.message;
        }
    }
);

// Botón Resolver
calculateBtn.addEventListener("click", () => {
        try{
            clearResults();

            const method = methodSelect.value;
            const expression = document.getElementById("functionInput").value;
            const tolerance = parseFloat(document.getElementById("toleranceInput").value);
            if(isNaN(tolerance) || tolerance <= 0){
                throw new Error("La tolerancia debe ser mayor que cero.");
            }
            if(!expression.trim()){
                throw new Error("Debe ingresar una función.");
            }
            const f = createFunction(expression);

            if(method === "bisection"){
                const a = parseFloat(document.getElementById("aInput").value);
                const b = parseFloat(document.getElementById("bInput").value);
                const result = bisection(f, a, b, tolerance);

                resultBox.innerHTML =
                `
                <h3>Resultado</h3>
                <p>Raíz: ${result.root.toFixed(6)}</p>
                <p>Iteraciones: ${result.totalIterations}</p>
                <p>Error Final: ${result.finalError === null ? "-": result.finalError.toExponential(3)}</p>
                `;

                renderBisectionIterations(result.iterations);
                renderChart(result.iterations, "xr");
            }
            else if(method === "newton"){
                const x0 = parseFloat(document.getElementById("x0Input").value);
                const result =newtonRaphson(expression, x0, tolerance);

                resultBox.innerHTML =
                `
                <h3>Resultado</h3>
                <p>Derivada: ${result.derivative}</p>
                <p>Raíz: ${result.root.toFixed(6)}</p>
                <p>Iteraciones: ${result.totalIterations}</p>
                <p>Error Final: ${result.finalError.toExponential(3)}</p>
                `;

                renderNewtonIterations(result.iterations);
                renderChart(result.iterations, "x");
            }
            else if(method === "secant"){
                const x0 = parseFloat(document.getElementById("x0Input").value);
                const x1 = parseFloat(document.getElementById("x1Input").value);
                const result = secant(f, x0, x1, tolerance);

                resultBox.innerHTML =
                `
                <h3>Resultado</h3>
                <p>Raíz: ${result.root.toFixed(6)}</p>
                <p>Iteraciones: ${result.totalIterations}</p>
                <p>Error Final: ${result.finalError.toExponential(3)}</p>
                `;

                renderSecantIterations(result.iterations);
                renderChart(result.iterations, "x");
            }
        }
        catch(error){
            resultBox.innerHTML = error.message;
        }
    }
);
methodSelect.addEventListener("change", () => {
    renderInputs(); 
    clearResults();
});
renderInputs();
