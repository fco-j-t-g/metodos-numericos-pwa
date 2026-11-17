function validateInputs(expression, x0, tolerance, maxIterations){
    if(!expression || expression.trim() === ""){
        throw new Error("Debe ingresar una función.");
    }

    if(isNaN(x0)){
        throw new Error("Debe ingresar un valor válido para x₀.");
    }

    if(isNaN(tolerance) || tolerance <= 0){
        throw new Error("La tolerancia debe ser mayor que cero.");
    }

    if(isNaN(maxIterations) || maxIterations <= 0){
        throw new Error("El número máximo de iteraciones es inválido.");
    }
}

export function newtonRaphson(expression, x0, tolerance = 0.0001, maxIterations = 100){
    validateInputs(expression, x0, tolerance, maxIterations)
     try {
        const functionCompiled =math.compile(expression);
     } catch (error) {
        "La función ingresada tiene errores de sintaxis."
     }
    const derivativeCompiled = math.derivative(expression, "x").compile();
    const iterations = [];
    let currentX = x0;
    let error = null;

    for(let iteration = 1; iteration <= maxIterations; iteration++){
        const fx = functionCompiled.evaluate({x: currentX});

        const dfx = derivativeCompiled.evaluate({x: currentX});

        if(dfx === 0){
            throw new Error(
                "La derivada es cero."
            );
        }

        const nextX = currentX - (fx / dfx);
        error = Math.abs(nextX - currentX);

        iterations.push({
            iteration,
            x: currentX,
            fx,
            dfx,
            error
        });

        if(error < tolerance){
            currentX = nextX;
            break;
        }

        currentX = nextX;
    }

    return {
        root: currentX, iterations,
        totalIterations: iterations.length,
        finalError: error,
        derivative: math.derivative(expression, "x").toString()
    };
}