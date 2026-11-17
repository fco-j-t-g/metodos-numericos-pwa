export function linearInterpolation(points, targetX){
    const sorted = [...points].sort((a,b)=> a.x-b.x);

    for(let i=0; i<sorted.length-1; i++){
        const p0 = sorted[i];
        const p1 = sorted[i+1];

        if(targetX >= p0.x && targetX <= p1.x){
            const m = (p1.y - p0.y) / (p1.x - p0.x);
            const b = p0.y - m * p0.x;
            const value = p0.y + ((targetX - p0.x) * (p1.y - p0.y)) / (p1.x - p0.x);
            return {value, slope: m, intercept: b};
        }
    }
    throw new Error("x fuera del rango de datos.");
}