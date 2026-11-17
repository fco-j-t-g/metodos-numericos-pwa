function validateInputs(f, a, b, tolerance, maxIterations){
    if(typeof f !== "function"){
        throw new Error("La función proporcionada no es válida.");
    }

    if(isNaN(a)){
        throw new Error("Debe ingresar un valor válido para a.");
    }

    if(isNaN(b)){
        throw new Error("Debe ingresar un valor válido para b.");
    }

    if(a >= b){
        throw new Error("El valor de a debe ser menor que b.");
    }

    if(isNaN(tolerance) || tolerance <= 0){
        throw new Error("La tolerancia debe ser mayor que cero.");
    }

    if(isNaN(maxIterations) || maxIterations <= 0){
        throw new Error(
            "El número máximo de iteraciones es inválido."
        );
    }
}

export function bisection(f, a, b, tolerance = 0.0001, maxIterations = 100){
    validateInputs(f, a, b, tolerance, maxIterations)
    
    const fa = f(a);
    const fb = f(b);

    if(fa * fb > 0){
        throw new Error("f(a) y f(b) deben tener signos opuestos.");
    }

    const iterations = [];

    let previousXr = null;

    let xr;
    let error = null;

    for(let iteration = 1; iteration <= maxIterations; iteration++){
        xr = (a + b) / 2.0;

        const fxr = f(xr);

        if(previousXr !== null){
            error = Math.abs(xr - previousXr);
        }

        iterations.push({
            iteration,
            a,
            b,
            xr,
            fxr,
            error
        });

        if(error !== null && error < tolerance){
            break;
        }

        if(fa * fxr < 0){
            b = xr;
        }
        else{
            a = xr;
        }

        previousXr = xr;
    }

    return {
        root: xr,
        iterations,
        totalIterations:
        iterations.length,

        finalError:
        error
    };
}