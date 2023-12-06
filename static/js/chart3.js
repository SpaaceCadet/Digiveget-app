// static/js/chart.js
// static/js/chart.js


// static/js/chart.js
var mychart3;  // Declare myChart globally

function updateChartData3() {
    // Fetch temperature data from the server
    fetch('/get_temperature_data')
        .then(response => response.json())
        .then(data => {
            // Assuming 'datetime' and 'temperature' are lists in the fetched JSON data
            mychart3.data.labels = data.datetime;
            mychart3.data.datasets[0].data = data.moisture;
            mychart3.update();
        })
        .catch(error => console.error('Error fetching data:', error));
}

document.addEventListener('DOMContentLoaded', function () {
    // Your Chart.js configuration goes here
    var ctx3 = document.getElementById("mychart3").getContext("2d");
    mychart3 = new Chart(ctx3, {
        type: 'line',
        data: {
            labels: [],  // Empty initially
            datasets: [
                {
                    data: [],
                    label: "Moisture Percentage",
                    borderColor: "#69c929",
                    fill: false
                }
            ]
        },
        options: {

            title: {
                display: true,
                text: 'Time Series of Moisture Percentage'
            }, x: {
                type: 'linear',
                position: 'bottom',
                max: 200,
                min: 0,
                ticks: {
                    stepSize: 1,
                    autoSkip: false,
                    maxTicksLimit: 10
                }

            },

            plugins: {
                zoom: {
                    zoom: {
                        wheel: {
                            enabled: true,
                            mode: 'x',
                        },
                        drag: {
                            enabled: true,

                        },


                    }
                }
            }



        }
    });


    // Initial data update
    updateChartData3();

    // Set up interval for data update every 1 minute (60000 milliseconds)
    setInterval(updateChartData3, 66000);
}); 


function resetZoomChart3() {

    mychart3.resetZoom();
    updateChartData3();

}

function filterData3() {


    dates = [...mychart3.data.labels];
    data = [...mychart3.data.datasets[0].data];
    const startdate = document.getElementById('startdate');
    const enddate = document.getElementById('enddate');

    // Convert startdate and enddate to Date objects
    const startDateObj = new Date(startdate.value);
    const endDateObj = new Date(enddate.value);


    // Filter the dates array based on the date range
    const filterDate = dates.filter(date => {
        const currentDateObj = new Date(date);
        return currentDateObj >= startDateObj && currentDateObj <= endDateObj;
    });

    // Find the indices in the original dates array
    const indexStartDate = dates.indexOf(filterDate[0]);
    const indexEndDate = dates.indexOf(filterDate[filterDate.length - 1]);

    // Slice the data array based on the indices
    const filterData = data.slice(indexStartDate, indexEndDate + 1);

    // Update the chart data
    if(filterData.length==0 || filterDate.length == 0){
        alert('No data found for the selected date range');

    }
    else {
    mychart3.data.labels = filterDate;
    mychart3.data.datasets[0].data = filterData;
    
    mychart3.update();

}
}