import {gaussJordan} from "./gaussJordan.js";

const sizeInput =
    document.getElementById(
        "sizeInput"
    );

const generateBtn =
    document.getElementById(
        "generateBtn"
    );

const matrixContainer =
    document.getElementById(
        "matrixContainer"
    );

const calculateBtn =
    document.getElementById(
        "calculateBtn"
    );

const resultBox =
    document.getElementById(
        "resultBox"
    );

const stepsTable =
    document.getElementById(
        "stepsTable"
    );

generateBtn.addEventListener(
    "click",
    generateMatrix
);

function generateMatrix(){

    const size =
        parseInt(
            sizeInput.value
        );

    if(
        isNaN(size) ||
        size < 2
    ){
        return;
    }

    let html =
        "<table>";

    for(
        let i = 0;
        i < size;
        i++
    ){

        html += "<tr>";

        for(
            let j = 0;
            j < size;
            j++
        ){

            html += `
                <td>
                    <input
                        class="matrix-cell"
                        type="number"
                        step="any">
                </td>
            `;
        }

        html += `
            <td>
                =
            </td>

            <td>
                <input
                    class="vector-cell"
                    type="number"
                    step="any">
            </td>
        `;

        html += "</tr>";
    }

    html += "</table>";

    matrixContainer.innerHTML =
        html;
}

function readSystem(){

    const size =
        parseInt(
            sizeInput.value
        );

    const matrixInputs =
        matrixContainer.querySelectorAll(
            ".matrix-cell"
        );

    const vectorInputs =
        matrixContainer.querySelectorAll(
            ".vector-cell"
        );

    const matrix = [];
    const vector = [];

    let index = 0;

    for(
        let i = 0;
        i < size;
        i++
    ){

        const row = [];

        for(
            let j = 0;
            j < size;
            j++
        ){

            const value =
                parseFloat(
                    matrixInputs[index]
                    .value
                );

            if(
                isNaN(value)
            ){
                throw new Error(
                    "Complete toda la matriz."
                );
            }

            row.push(value);

            index++;
        }

        matrix.push(row);
    }

    for(
        let i = 0;
        i < size;
        i++
    ){

        const value =
            parseFloat(
                vectorInputs[i]
                .value
            );

        if(
            isNaN(value)
        ){
            throw new Error(
                "Complete el vector independiente."
            );
        }

        vector.push(value);
    }

    return {
        matrix,
        vector
    };
}

function renderSteps(
    steps
){

    let html = "";

    steps.forEach(step => {

        html += `
            <tr>
                <th colspan="100%">
                    Iteración
                    ${step.iteration}
                </th>
            </tr>
        `;

        step.matrix.forEach(row => {

            html += "<tr>";

            row.forEach(value => {

                html += `
                    <td>
                        ${value.toFixed(4)}
                    </td>
                `;
            });

            html += "</tr>";
        });
    });

    stepsTable.innerHTML =
        html;
}

calculateBtn.addEventListener(
    "click",
    () => {

        try{

            const {
                matrix,
                vector
            } = readSystem();

            const result =
                gaussJordan(
                    matrix,
                    vector
                );

            let html =
                "<strong>Solución:</strong><br>";

            result.solution
            .forEach(
                (value, i) => {

                    html += `
                        x${i + 1}
                        =
                        ${value.toFixed(6)}
                        <br>
                    `;
                }
            );

            resultBox.innerHTML =
                html;

            renderSteps(
                result.steps
            );

        }
        catch(error){

            resultBox.innerHTML = `
                <span
                    style="color:red;">
                    ${error.message}
                </span>
            `;
        }
    }
);

generateMatrix();