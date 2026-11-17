export function lagrange(points, targetX){
    let result = 0;
    const n = points.length;

    for(let i=0; i<n; i++){
        let term = points[i].y;
        for(let j=0; j<n; j++){
            if(i !== j){
                term *= (targetX - points[j].x) / (points[i].x - points[j].x);
            }
        }
        result += term;
    }
    return result;
}

export function lagrangePolynomial(points){
    const n = points.length;
    let coefficients = Array(n).fill(0);

    for(let i = 0; i < n; i++){
        let basis = [1];
        for(let j = 0; j < n; j++){
            if(i === j) continue;
            const denominator =
                points[i].x - points[j].x;
            const next = Array(basis.length + 1).fill(0);
            for(let k = 0; k < basis.length; k++){
                next[k] += (-points[j].x * basis[k]) / denominator;
                next[k + 1] += basis[k] / denominator;
            }
            basis = next;
        }
        for(let k = 0; k < basis.length; k++){
            coefficients[k] += points[i].y * basis[k];
        }
    }
    return coefficients;
}

export function polynomialToString(coefficients){
    let expression = "";

    for(let i = coefficients.length - 1; i >= 0; i--){
        const c = coefficients[i];
        if(Math.abs(c) < 1e-10) continue;
        const sign = c >= 0 ? (expression ? " + " : ""): " - ";

        const value = Math.abs(c).toFixed(6);

        if(i === 0){
            expression += `${sign}${value}`;
        }
        else if(i === 1){
            expression += `${sign}${value}x`;
        }
        else{
            expression += `${sign}${value}x^${i}`;
        }
    }
    return expression || "0";
}