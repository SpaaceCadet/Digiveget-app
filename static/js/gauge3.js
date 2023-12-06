var myGauge3; // Declare myGauge3 globally
function updateGaugeData3() {
    // Fetch gauge data from the server
    fetch('/get_gauge_temp')
        .then(response => response.json())
        .then(data => {
       
            console.log(data)
            // Assuming 'value' is the value for the gauge
            myGauge3.data.datasets[0].data = [data.datos[0],100-data.datos[0]];

    
            myGauge3.update();
            const ext_temp= document.getElementById("ext_temp");
            ext_temp.innerText= data.datos[0]+"°C";


        })
        .catch(error => console.error('Error fetching data:', error));
}


document.addEventListener('DOMContentLoaded', function () {
    // Your Chart.js configuration goes here
    var GaugeCtx3 = document.getElementById("myGauge3").getContext("2d");
    myGauge3 = new Chart(GaugeCtx3, {
        type: 'doughnut',
        data:{
            labels: ["External Temperature °C"],
            datasets: [{
                data: [0, 100],
                backgroundColor: ['#DC143C', 'rgba(0, 0, 0, 0.1)'],
                borderWidth: 0
            }]
        },options: {
            responsive: true,
            maintainAspectRatio: false,
            cutoutPercentage: 85,
            rotation: -90,
            circumference: 360      ,
            tooltips: {
                enabled: false
            },
            legend: {
                display: false
            },
            animation: {
                animateRotate: true,
                animateScale: false
            },
           
            title: {
                display: true,
                text: data.label,
                fontSize: 16
            }
        }
      
    });

    // Initial data update
    updateGaugeData3();

    // Set up interval for data update every 1 minute (60000 milliseconds)
    setInterval(updateGaugeData3, 66000);
});
