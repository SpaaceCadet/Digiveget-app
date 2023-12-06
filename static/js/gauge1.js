var myGauge; // Declare myGauge globally
var moist;
var status_moist ; 

function updateGaugeData() {
    // Fetch gauge data from the server
    fetch('/get_gauge_data')
        .then(response => response.json())
        .then(data => { 
          console.log(data)
            // Assuming 'value' is the value for the gauge
            moist = data.datos[0];
            myGauge.data.datasets[0].data = [moist,100-moist];

        
            status_moist = {"watering" : ""  , "soil_status":"" , "actions": "" ,"pct":moist , "color":""};
            
            myGauge.update();
           if((moist>=40) && (moist <= 65)){
            status_moist.watering = "do not need watering";
            status_moist.soil_status ="humid" ;
            status_moist.actions="The flow of water is good" ; 
            status_moist.color="#69c929";
           }
           else if(moist < 40){
            status_moist.watering = "Need watering";
            status_moist.soil_status ="Dry" ; 
            status_moist.actions="Consider increasing your pump pressure as soon as possible ! " ;
            status_moist.color="#c70000"; 
           }
           else if(moist > 65){
            status_moist.watering = "do not need watering";
            status_moist.soil_status ="Very Humid" ; 
            status_moist.actions="Consider Stopping or downgrading the flow of water !" ; 
            status_moist.color="#0050c7";
           }

 // Update span elements based on conditions
 updateSpan(status_moist);

        })
        .catch(error => console.error('Error fetching data:', error));
}

function updateSpan(status_moist) {
    // Get the span element by id
    const watering = document.getElementById("watering");
    const soil_status= document.getElementById("soil_status");
    const actions = document.getElementById("actions");
    const pct = document.getElementById("moist_pct");

    // Change text content 

    watering.innerText  = status_moist.watering;
    soil_status.innerText = status_moist.soil_status;
    actions.innerText = status_moist.actions;
    pct.innerText = status_moist.pct+"%";  
    

    // Change color style 

    watering.style.color = status_moist.color;
    soil_status.style.color  =status_moist.color;
    actions.style.color = status_moist.color;
    pct.style.color = status_moist.color;
}

document.addEventListener('DOMContentLoaded', function () {
    // Your Chart.js configuration goes here
    var gaugeCtx = document.getElementById("myGauge").getContext("2d");
    myGauge = new Chart(gaugeCtx, {
        type: 'doughnut',
        data:{
            labels: ["Moisture Percentage"],
            datasets: [{
                data: [0, 100],
                backgroundColor: ['#69c929', 'rgba(0, 0, 0, 0.1)'],
                borderWidth: 0
            }]
        },options: {
            responsive: true,
            maintainAspectRatio: false,
            cutoutPercentage: 20,
            rotation: 120,
            circumference: 360      ,
            tooltips: {
                enabled: false
            },
            legend: {
                display: false
            },
           
            title: {
                display: true,
                text: data.label,
                fontSize: 16
            }
        }
      
    });

    // Initial data update
    updateGaugeData();

    // Set up interval for data update every 1 minute (60000 milliseconds)
    setInterval(updateGaugeData, 66000);
});
