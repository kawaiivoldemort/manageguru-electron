function loadLineChart(labels, data, max) {
    Chart.defaults.global.defaultFontColor = '#75787c';
    var LINECHARTEXMPLE   = $('#lineChartCustom1');
    console.log(labels)
    console.log(data)
    var lineChartExample = new Chart(LINECHARTEXMPLE, {
        type: 'line',
        options: {
            legend: {labels:{fontColor:"#777", fontSize: 12}},
            scales: {
                xAxes: [{
                    display: false,
                    gridLines: {
                        color: 'transparent'
                    }
                }],
                yAxes: [{
                    ticks: {
                        max: max,
                        min: 0
                    },
                    display: true,
                    gridLines: {
                        color: 'transparent'
                    }
                }]
            },
        },
        data: {
            labels: labels,
            datasets: [
                {
                    label: "Sales (in rupees)",
                    fill: true,
                    lineTension: 0,
                    backgroundColor: "rgba(134, 77, 217, 0.88)",
                    borderColor: "rgba(134, 77, 217, 088)",
                    borderCapStyle: 'butt',
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: 'miter',
                    borderWidth: 1,
                    pointBorderColor: "rgba(134, 77, 217, 0.88)",
                    pointBackgroundColor: "#fff",
                    pointBorderWidth: 1,
                    pointHoverRadius: 5,
                    pointHoverBackgroundColor: "rgba(134, 77, 217, 0.88)",
                    pointHoverBorderColor: "rgba(134, 77, 217, 0.88)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: data,
                    spanGaps: false
                }
            ]
        }
    })
}

function loadPiChart(labels, data, backgroundColor, hoverBackgroundColor) {
     // ------------------------------------------------------- //
    // Pie Chart Custom 1
    // ------------------------------------------------------ //
    var PIECHARTEXMPLE    = $('#pieChartCustom1');
    var pieChartExample = new Chart(PIECHARTEXMPLE, {
        type: 'pie',
        options: {
            legend: {
                display: true,
                position: "left"
            }
        },
        data: {
            labels: labels,
            datasets: [
                {
                    data: data,
                    borderWidth: 0,
                    backgroundColor: backgroundColor,
                    hoverBackgroundColor: hoverBackgroundColor
                }]
            }
    });
    var pieChartExample = {
        responsive: true
    };
}

function lightenDarkenColor(col) {
    var usePound = false;
    if ( col[0] == "#" ) {
        col = col.slice(1);
        usePound = true;
    }
    var num = parseInt(col,16);
    var r = (num >> 16) + 10;
    if ( r > 255 ) r = 255;
    else if  (r < 0) r = 0;
    var b = ((num >> 8) & 0x00FF) + 10;
    if ( b > 255 ) b = 255;
    else if  (b < 0) b = 0;
    var g = (num & 0x0000FF) + 10;
    if ( g > 255 ) g = 255;
    else if  ( g < 0 ) g = 0;
    return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);
}

function getFoodTrends() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) {
            var data = JSON.parse(xhr.responseText)
            console.log(data)
            var arr = []
            var arr_hover = []
            for(var i = 0; i < data[0].length; i++) {
                var c = "#"+((1<<24)*Math.random()|0).toString(16)
                arr.push(c)
                arr_hover.push(lightenDarkenColor(c))
            }            
            loadPiChart(data[0], data[1], arr, arr_hover)
            setTimeout(getSalesTrend, 60000)
        }
    }
    xhr.open("GET", "https://manageguru.azurewebsites.net/dish_trends.php", true)
    xhr.send()
}

function getSalesTrend() {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if(xhr.readyState == 4 && xhr.status == 200) {
            var data = JSON.parse(xhr.responseText)
            loadLineChart(data[0], data[1], 1.5*Math.max(...data[1]))
            getFoodTrends()
        }
    }
    xhr.open("GET", "https://manageguru.azurewebsites.net/salesgraph2.php", true)
    xhr.send()
}

window.onload = getSalesTrend