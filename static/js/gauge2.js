var myGauge2; // Declare myGauge22 globally

function updateGaugeData2() {
    // Fetch gauge data from the server
    fetch('/get_gauge_humid')
        .then(response => response.json())
        .then(data => {
       
            console.log(data)
            // Assuming 'value' is the value for the gauge
            myGauge2.data.datasets[0].data = [data.datos[0],100-data.datos[0]];

            const humid_ext= document.getElementById("ext_humid");
            humid_ext.innerText = data.datos[0]+"%";
    
            myGauge2.update();
        })
        .catch(error => console.error('Error fetching data:', error));
}


document.addEventListener('DOMContentLoaded', function () {
    // Your Chart.js configuration goes here
    var gaugeCtx2 = document.getElementById("myGauge2").getContext("2d");
    myGauge2 = new Chart(gaugeCtx2, {
        type: 'doughnut',
        data:{
            labels: ["External Humidity percentage"],
            datasets: [{
                data: [0, 100],
                backgroundColor: ['#69c929', 'rgba(0, 0, 0, 0.1)'],
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
    updateGaugeData2();

    // Set up interval for data update every 1 minute (60000 milliseconds)
    setInterval(updateGaugeData2, 66000);
});
