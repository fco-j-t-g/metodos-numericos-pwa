export function gaussJordan(matrix, vector){

    const n = matrix.length;

    if(n === 0){
        throw new Error(
            "La matriz está vacía."
        );
    }

    if(vector.length !== n){
        throw new Error(
            "Las dimensiones no son compatibles."
        );
    }

    const augmented =
        matrix.map(
            (row, i) => [
                ...row,
                vector[i]
            ]
        );

    const steps = [];

    for(let i = 0; i < n; i++){

        let maxRow = i;

        for(let k = i + 1; k < n; k++){

            if(
                Math.abs(
                    augmented[k][i]
                ) >
                Math.abs(
                    augmented[maxRow][i]
                )
            ){
                maxRow = k;
            }
        }

        [
            augmented[i],
            augmented[maxRow]
        ] =
        [
            augmented[maxRow],
            augmented[i]
        ];

        if(
            Math.abs(
                augmented[i][i]
            ) < 1e-12
        ){
            throw new Error(
                "La matriz no tiene solución única."
            );
        }

        const pivot =
            augmented[i][i];

        for(
            let j = 0;
            j <= n;
            j++
        ){
            augmented[i][j] /=
                pivot;
        }

        for(
            let k = 0;
            k < n;
            k++
        ){

            if(k === i){
                continue;
            }

            const factor =
                augmented[k][i];

            for(
                let j = 0;
                j <= n;
                j++
            ){
                augmented[k][j] -=
                    factor *
                    augmented[i][j];
            }
        }

        steps.push({
            iteration: i + 1,
            matrix:
                augmented.map(
                    row => [...row]
                )
        });
    }

    const solution =
        augmented.map(
            row => row[n]
        );

    return {
        solution,
        steps
    };
}