const tblValores = document.getElementById("tblValores")
//obtener el elemento tabla 
function cargarDatos() {
    //obtener elemento grafica 
    const grafica = document.getElementById("myChart").getContext("2d")

    axios.get("https://api.coincap.io/v2/assets")
        .then(resultado => {
        // escribir los resultados en la consola            
        console.log(resultado);

        //Las etiquetas son los simbolos de cada moneda. Ejemplo Bitcoin --> BTC
        const etiquetas = resultado.data.data.map(item => {
            return item.symbol.toUpperCase();
        })

        console.log(etiquetas)
        
        //Los valores de comparacion
        const costos = resultado.data.data.map(item => {
            return parseInt(item.priceUsd)
        })
        
        console.log(costos)

        const myChart = new Chart(grafica, {
            type: "line",
            data: {
                labels: etiquetas,
                datasets: [
                    {
                        label: "Valor de Dolar",
                        data: costos,
                        fill: true,
                        backgroundColor: "#ccd9ff",
                        borderColor: "black"
                    },
                ],
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    },
                    title: {
                        display: true,
                        text: "Monedas electronicas"
                    }
                },
                scales: {
                    x: {
                        display: true
                    }
                }
            }
        })


        tblValores.innerHTML = "";
        const data = resultado.data.data.
            sort((a, b)=> parseInt(a.rank) - parseInt(b.rank))
        for (const valor of data) {
                let tr = `<tr>
                <td>${parseInt(valor.rank)}</td>
                <td>${valor.symbol} - ${valor.name}</td>
                <td>${formatNumero(valor.priceUsd)}</td>
                <td>${formatNumero(valor.marketCapUsd)}</td>
                <td>${formatNumero(valor.vwap24Hr)}</td>
                <td>${formatNumero(valor.supply)}</td>
                <td>${formatNumero(valor.volumeUsd24Hr)}</td>
                <td>${parseFloat(valor.changePercent24Hr).toFixed(2)}%</td>
                </tr> `
                tblValores.innerHTML += tr;
        }
    })

}

function formatNumero(numeroStr){
    let numero = parseFloat(numeroStr)

    if (numero < 1000000)
        return convertirNumeroDolar(numero)
    
    if(numero > 1000000 && numero < 1000000000){
        numero = numero / 1000000
        return convertirNumeroDolar(numero) + 'm'
    }
    
    if(numero > 1000000000){
        numero = numero / 1000000000
        return convertirNumeroDolar(numero) + 'b'
    }
}

function convertirNumeroDolar(numero){
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(numero);
}



cargarDatos()