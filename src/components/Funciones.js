export const f = x => (4*x**3) - (6*x**2) + (7*x) - 2.3;

export let arrX = [];
export let arrY = [];

export let maxValor;
export let minValor;
export let xMax, xMin;

export function g(x) {
    let rad = x * (Math.PI / 180);  // convertir x a radianes para cos
    return (x**2) * Math.sqrt(Math.abs(Math.cos(x))) - 5;
}

export  function tabula (f, xi, xf, incx){
    arrX = [];
    arrY = [];

    maxValor = -Infinity;
    minValor = Infinity;
    xMax, xMin;
    

    for(let x = xi; x <= xf; x += incx){
        const y = f(x);
        arrX.push(x.toFixed(3));
        arrY.push(y.toFixed(3));

        if(y > maxValor){
            maxValor = y;
            xMax = x;
        }
        if(y < minValor){
            minValor = y;
            xMin = x;
        }
    }
    console.log(arrY)
}