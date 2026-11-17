function validateInputs(f, x0, x1, tolerance, maxIterations){
    if(typeof f !== "function"){
        throw new Error("La función proporcionada no es válida.");
    }

    if(isNaN(x0)){
        throw new Error("Debe ingresar un valor válido para x₀.");
    }

    if(isNaN(x1)){
        throw new Error("Debe ingresar un valor válido para x₁.");
    }

    if(x0 === x1){
        throw new Error(
            "x₀ y x₁ no pueden ser iguales."
        );
    }

    if(isNaN(tolerance) || tolerance <= 0){
        throw new Error("La tolerancia debe ser mayor que cero.");
    }

    if(isNaN(maxIterations) || maxIterations <= 0){
        throw new Error("El número máximo de iteraciones es inválido.");
    }
}

export function secant(f, x0, x1, tolerance = 0.0001, maxIterations = 100){
    validateInputs(f, x0, x1, tolerance, maxIterations)
    
    const iterations = [];

    let previousX = x0;
    let currentX = x1;
    let error = null;

    for(let iteration = 1; iteration <= maxIterations; iteration++){
        const fPrevious =f(previousX);
        const fCurrent =f(currentX);
        const denominator = fCurrent - fPrevious;

        if(denominator === 0){
            throw new Error("División entre cero.");
        }

        const nextX = currentX - (fCurrent * (currentX - previousX)) / denominator;

        error = Math.abs(nextX - currentX);

        iterations.push({
            iteration,
            x: currentX,
            fx: fCurrent,
            error
        });

        if(error < tolerance){
            currentX = nextX;
            break;
        }

        previousX =
        currentX;

        currentX =
        nextX;
    }

    return{
        root: currentX,
        iterations,
        totalIterations:
        iterations.length,
        finalError:
        error
    };
}
