export function polynomialRegression(points, degree){

    if(points.length < degree + 1){
        throw new Error(
            `Se requieren al menos ${
                degree + 1
            } puntos.`
        );
    }

    const X = [];
    const Y = [];

    for(const point of points){

        const row = [];

        for(let j = 0; j <= degree; j++){
            row.push(
                Math.pow(point.x, j)
            );
        }

        X.push(row);
        Y.push([point.y]);
    }

    const XT =
        math.transpose(X);

    const XT_X =
        math.multiply(XT, X);

    const XT_Y =
        math.multiply(XT, Y);

    const coefficients =
        math.lusolve(
            XT_X,
            XT_Y
        )
        .map(row => row[0]);

    function predict(x){

        let y = 0;

        for(
            let i = 0;
            i < coefficients.length;
            i++
        ){
            y +=
                coefficients[i] *
                Math.pow(x, i);
        }

        return y;
    }

    const meanY =
        points.reduce(
            (acc, p) => acc + p.y,
            0
        ) / points.length;

    let ssResidual = 0;
    let ssTotal = 0;

    for(const point of points){

        const predicted =
            predict(point.x);

        ssResidual +=
            (point.y - predicted) ** 2;

        ssTotal +=
            (point.y - meanY) ** 2;
    }

    const r2 =
        1 - (ssResidual / ssTotal);

    let equation = "y = ";

    for(
        let i = coefficients.length - 1;
        i >= 0;
        i--
    ){

        const c = coefficients[i];

        if(Math.abs(c) < 1e-10){
            continue;
        }

        const sign =
            c >= 0
                ? (
                    equation === "y = "
                    ? ""
                    : " + "
                  )
                : " - ";

        const value =
            Math.abs(c).toFixed(6);

        if(i === 0){
            equation +=
                `${sign}${value}`;
        }
        else if(i === 1){
            equation +=
                `${sign}${value}x`;
        }
        else{
            equation +=
                `${sign}${value}x^${i}`;
        }
    }

    return {
        coefficients,
        equation,
        r2,
        predict
    };
}