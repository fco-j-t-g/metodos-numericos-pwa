export function linearRegression(points){

    if(points.length < 2){
        throw new Error(
            "Se requieren al menos 2 puntos."
        );
    }

    const n = points.length;

    const sumX =
        points.reduce((acc, p) => acc + p.x, 0);

    const sumY =
        points.reduce((acc, p) => acc + p.y, 0);

    const sumXY =
        points.reduce(
            (acc, p) => acc + p.x * p.y,
            0
        );

    const sumX2 =
        points.reduce(
            (acc, p) => acc + p.x * p.x,
            0
        );

    const denominator =
        n * sumX2 - sumX * sumX;

    if(denominator === 0){
        throw new Error(
            "No se puede calcular la regresión."
        );
    }

    const m =
        (n * sumXY - sumX * sumY) /
        denominator;

    const b =
        (sumY - m * sumX) / n;

    const predict = x => m * x + b;

    const meanY = sumY / n;

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

    const equation =
        `y = ${m.toFixed(6)}x ${
            b >= 0 ? "+" : "-"
        } ${Math.abs(b).toFixed(6)}`;

    return {
        coefficients: [b, m],
        equation,
        r2,
        predict
    };
}