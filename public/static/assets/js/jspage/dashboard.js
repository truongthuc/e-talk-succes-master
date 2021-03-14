//Script Chart User
$(document).ready(function() {
 /*
 * Card Advanced - Card
 */
// Màu cơ sở
var color = {
    'thaiha': '#D84315',
    'yenlang': '#FFC107',
    'vooanh': '#4CAF50',
    'huynhlankhanh': '#2196F3',
    'tranphu': '#E91E63'
}

function getDaysInMonth(month, year) {
    var date = new Date(Date.UTC(year, month, 1));
    var days = [];
    while (date.getMonth() === month) {
        var d = new Date(date);
        days.push(d.getDate() + '/' + d.getMonth());
        date.setDate(date.getDate() + 1);
    }
    return days;
}
// Chart.defaults.global.defaultFontFamily = 'Roboto';
var filterTime = document.querySelectorAll('.filter-time');
var totalRevenue = document.getElementsByClassName('chart-revenue-total');

//Trending line chart
var revenueLineChartCTX = $("#revenueChart");
var revenueLineChart;


var weekRevenueDataset = [{
    label: "Doanh thu",
    data: [8733293, 9336293, 8557310, 8752592, 2135633, 7471178, 6961955],
    backgroundColor: 'rgb(105,178,248,.25)',
    borderColor: 'rgb(105,178,248,.8)',
    fill: true,
    lineTension: 0.1,
    pointHoverBorderColor: 'rgb(105,178,248,1)',
    pointBackgroundColor: '#fff',
    pointBorderColor: '#0168fa'
}];

//var monthRevenueDataset = @Html.Raw(ViewBag.datamonth);

var monthRevenueDataset = [{
    label: "Doanh thu",
    data: [4023712, 7002037, 6720802, 7355786, 6788766, 7169305, 2665626, 5536176, 6901654, 2328586, 5284641,
        6214662, 7657952, 8451341, 7504499, 4373241, 7659185, 2994734, 5521773, 5696381, 9508417, 6094465,
        8483373, 6567850, 2326744, 2470435, 8346597, 4783175, 4512745, 3376172, 5674121
    ],
    backgroundColor: 'rgb(105,178,248,.25)',
    borderColor: 'rgb(105,178,248,.8)',
    fill: true,
    lineTension: 0.1,
    pointHoverBorderColor: 'rgb(105,178,248,1)',
    pointBackgroundColor: '#fff',
    pointBorderColor: '#0168fa'
}];

// var yearRevenueDataset =@Html.Raw(ViewBag.datayear);
var yearRevenueDataset = [{
    label: "Doanh thu",
    data: [2000000000, 3500000000, 277000000, 7100000000, 2000000000, 3500000000, 2770000000, 7100000000,
        2000000000, 3500000000, 2770000000, 710000000
    ],
    backgroundColor: 'rgb(105,178,248,.25)',
    borderColor: 'rgb(105,178,248,.8)',
    fill: true,
    lineTension: 0.1,
    pointHoverBorderColor: 'rgb(105,178,248,1)',
    pointBackgroundColor: '#fff',
    pointBorderColor: '#0168fa'
}, ]

var revenueLineChartOptions = {

    responsive: true,
    maintainAspectRatio: false,
    layout: {
        padding: {
            top: 10,
            right: 10,
        }
    },
    legend: {
        display: false,
        labels: {
            fontColor: '#fff',
            padding: 20

        },
        // onClick: function (e, legendItem) {
        //     //   console.log(legendItem);
        //     var index = legendItem.datasetIndex;
        //     var ci = this.chart;
        //     var alreadyHidden = (ci.getDatasetMeta(index).hidden === null) ? false : ci.getDatasetMeta(index).hidden;

        //     totalRevenue[0].innerText = updateTotalRevenue(ci.data.datasets[index].data);
        //     ci.data.datasets.forEach(function (e, i) {
        //         var meta = ci.getDatasetMeta(i);

        //         if (i !== index) {
        //             if (!alreadyHidden) {
        //                 meta.hidden = meta.hidden === null ? !meta.hidden : null;


        //             } else if (meta.hidden === null) {
        //                 meta.hidden = true;

        //             }
        //         } else if (i === index) {

        //             meta.hidden = null;

        //         }
        //     });

        //     ci.update();
        // }

    },
    hover: {
        mode: "label"
    },
    scales: {
        xAxes: [{
            beginAtZero: true,
            display: true,

            gridLines: {
                display: false
            },
            ticks: {
                beginAtZero: true,
                fontColor: "#000",
            }
        }],
        yAxes: [{
            display: true,
            beginAtZero: true,
            fontColor: "#000",
            gridLines: {
                display: true,
                color: "#fff"
            },
            ticks: {
                beginAtZero: true,
                fontColor: "#000",
                callback: function(value, index, values) {
                    if (parseInt(value) >= 1000000 && parseInt(value) < 1000000000) {
                        return (value / 1000000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
                            ' Triệu';
                    } else if ((parseInt(value) >= 1000000000)) {
                        return (value / 1000000000).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
                            ' Tỉ';
                    }
                    return value;
                }
            }
        }]
    },
    tooltips: {
        titleFontSize: 0,
        mode: 'index',
        intersect: false,
        callbacks: {
            label: function(tooltipItem, data) {
                if (parseInt(tooltipItem.yLabel) >= 1000) {
                    return tooltipItem.xLabel + ': ' + tooltipItem.yLabel.toString().replace(
                        /\B(?=(\d{3})+(?!\d))/g, ",") + ' VNĐ';
                } else {
                    return tooltipItem.xLabel + ': ' + tooltipItem.yLabel + ' VNĐ';
                }

            }
        }
    }
};

var revenueLineChartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: yearRevenueDataset
};
var revenueLineChartConfig = {
    type: "line",
    options: revenueLineChartOptions,
    data: revenueLineChartData
};


function updateTotalRevenueAll(listData) {
    var total = 0;
    // console.log(listData);
    listData.forEach(dataset => {
        // console.log(data);
        var reducer = (acc, cur) => acc + cur;
        var totalData = dataset.data.reduce(reducer);
        total += totalData;
    });
    return total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + ' VNĐ';
}

//Update dataset by toggle checkbox
function changeDataset(time) {
    //   console.log(revenueLineChart.options.legend);
    switch (time) {
        case 'week': {
            revenueLineChartData.datasets = weekRevenueDataset;
            revenueLineChartData.labels = ["Mon", "Tue", "Wed", "Thus", "Pri", "Sat", "Sun"];
            revenueLineChart.update();
            break;
        }
        case 'month': {
            revenueLineChartData.datasets = monthRevenueDataset;
            revenueLineChartData.labels = getDaysInMonth((new Date()).getMonth() + 1, (new Date()).getFullYear());
            revenueLineChart.update();
            break;
        }
        case 'year': {
            revenueLineChartData.datasets = yearRevenueDataset;
            revenueLineChartData.labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov",
                "Dec"
            ];
            revenueLineChart.update();
            break;
        }
    }
    //    console.log(revenueLineChartData.datasets);
    totalRevenue[0].innerText = updateTotalRevenueAll(revenueLineChartData.datasets);
}





/* Student Bar chart */

var studentChart = document.getElementById('flotChart2').getContext('2d');
new Chart(studentChart, {
    type: 'bar',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
            data: [150, 110, 90, 115, 125, 160, 160, 140, 100, 110, 120, 120],
            backgroundColor: '#66a4fb'
        }, {
            data: [180, 140, 120, 135, 155, 170, 180, 150, 140, 150, 130, 130],
            backgroundColor: '#65e0e0'
        }]
    },
    options: {
        maintainAspectRatio: false,
        legend: {
            display: false,
            labels: {
                display: false
            }
        },
        scales: {
            xAxes: [{
                display: false,
                barPercentage: 0.5
            }],
            yAxes: [{
                gridLines: {
                    color: '#ebeef3'
                },
                ticks: {
                    fontColor: '#8392a5',
                    fontSize: 10,
                    min: 80,
                    max: 200
                }
            }]
        }
    }
});
$.plot('#flotChart3', [{
    data: df4,
    color: '#9db2c6'
}], {
    series: {
        shadowSize: 0,
        lines: {
            show: true,
            lineWidth: 2,
            fill: true,
            fillColor: {
                colors: [{
                    opacity: 0
                }, {
                    opacity: .5
                }]
            }
        }
    },
    grid: {
        borderWidth: 0,
        labelMargin: 0
    },
    yaxis: {
        show: false,
        min: 0,
        max: 60
    },
    xaxis: {
        show: false
    }
});

$.plot('#flotChart4', [{
    data: df5,
    color: '#9db2c6'
}], {
    series: {
        shadowSize: 0,
        lines: {
            show: true,
            lineWidth: 2,
            fill: true,
            fillColor: {
                colors: [{
                    opacity: 0
                }, {
                    opacity: .5
                }]
            }
        }
    },
    grid: {
        borderWidth: 0,
        labelMargin: 0
    },
    yaxis: {
        show: false,
        min: 0,
        max: 80
    },
    xaxis: {
        show: false
    }
});

$.plot('#flotChart5', [{
    data: df6,
    color: '#9db2c6'
}], {
    series: {
        shadowSize: 0,
        lines: {
            show: true,
            lineWidth: 2,
            fill: true,
            fillColor: {
                colors: [{
                    opacity: 0
                }, {
                    opacity: .5
                }]
            }
        }
    },
    grid: {
        borderWidth: 0,
        labelMargin: 0
    },
    yaxis: {
        show: false,
        min: 0,
        max: 80
    },
    xaxis: {
        show: false
    }
});

$.plot('#flotChart6', [{
    data: df4,
    color: '#9db2c6'
}], {
    series: {
        shadowSize: 0,
        lines: {
            show: true,
            lineWidth: 2,
            fill: true,
            fillColor: {
                colors: [{
                    opacity: 0
                }, {
                    opacity: .5
                }]
            }
        }
    },
    grid: {
        borderWidth: 0,
        labelMargin: 0
    },
    yaxis: {
        show: false,
        min: 0,
        max: 60
    },
    xaxis: {
        show: false
    }
});


window.onload = function() {
    revenueLineChart = new Chart(revenueLineChartCTX, revenueLineChartConfig);

    changeDataset('week');

    var filterItem = $('.filter-time').on('click', function() {
        $(this).addClass('active');
        filterItem.not($(this)).removeClass('active');
        changeDataset($(this).data('time'));
    });
};


    $('.peity-donut').peity('donut');

    //demo data chart
    function getRandom(length){
        const arr = [];
        for(let i = 0; i<= length;i++){
            arr[i] = Math.floor(Math.random() * 10000) * 1000;
        }
        return arr;
    }

    var dataDemo = {
        labels: [],
        datasets:[{
            label: "Doanh thu",
            data: [],
            backgroundColor: 'rgba(0,136,204, 0.35)',
            borderColor: 'rgba(0,136,204, 0.83)',
            fill: true,
            lineTension: .2,
            pointBorderColor: "#fff",
            pointBackgroundColor: "#3e3e3e",
            pointBorderColor: '#fff',
            borderWidth: 2,
            pointBorderWidth: 2,
            pointHoverBorderWidth: 4,
        }]
    }

    function initChart(rowid, data) {
        var ctx = document.getElementById('chart-id-' + rowid);
        var chartOptions = {
            title: {
                text: 'Thống kê doanh thu',
                display: true,
            },
            plugins: {
                datalabels: {
                    clip: false,
                    color: "#000",
                    clamp: false,
                    anchor: "end",
                    align: "top",
                    offset: 1,
                    formatter: (value, ctx) => {
                        return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    },
                    fontSize: 14
                }
            },

            responsive: true,
            maintainAspectRatio: false,
            legend: {
                display: false
            },
            hover: {
                mode: "label"
            },
            scales: {
                xAxes: [{
                    display: true,
                   
                    gridLines: {
                        display: false
                    },
                    ticks: {
                        fontColor: "#000",
                        beginAtZero:false,
                        //  max: Math.max(...data.datasets[0].data) * 1.2,

                    }
                }],
                yAxes: [{
                    display: true,
                    fontColor: "#000",
                    gridLines: {
                        display: false
                    },
                    ticks: {
                        beginAtZero: false,
                        fontColor: "#000",
                        padding: 15,
                        //   max: Math.max(...data.datasets[0].data) * 1.2,
                        callback: function(value, index, values) {
                            if (parseInt(value) >= 1000000 && parseInt(value) < 1000000000) {
                                return (value / 1000000).toString().replace(
                                    /\B(?=(\d{3})+(?!\d))/g,
                                    ",") + ' Triệu';
                            } else if ((parseInt(value) >= 1000000000)) {
                                return (value / 1000000000).toString().replace(
                                    /\B(?=(\d{3})+(?!\d))/g, ",") + ' Tỉ';
                            }
                            return value;
                        }
                    }
                }]
            },
            tooltips: {
                mode: 'index',
                intersect: false,
            }
        };

     
        var chart = new Chart(ctx, {
            type: 'line',
            data: dataDemo,
            options: chartOptions
        });
    }
    
    function updateChartType(rowid, data) {
    
                var chartId = 'chart-id-' + rowid;
                Chart.helpers.each(Chart.instances, function(instance) {
                   
                    var chartJs = instance.chart;
                    if(chartJs.canvas.id === chartId){
                        console.log(chartJs.config.data);
                        chartJs.config.data = data;
                        chartJs.update();
                        return false;
                    }

                });
               
            };

    $('.chart-on-table').on('click', '.view-chart', function() {
        var dataAjax = {
        labels: ["11/2 - 12/3", "23/4 - 30/4", "15/5 - 25/5", "30/6 - 12/6", "11/7 - 20/7", "15/8 - 20/8", "11/9 - 27/9"],
        datasets:[{
            label: "Doanh thu",
            data: getRandom(7),
            backgroundColor: 'rgba(0,136,204, 0.35)',
            borderColor: 'rgba(0,136,204, 0.83)',
            fill: true,
            lineTension: .2,
            pointBorderColor: "#fff",
            pointBackgroundColor: "#3e3e3e",
            pointBorderColor: '#fff',
            borderWidth: 2,
            pointBorderWidth: 2,
            pointHoverBorderWidth: 4,
        }]
    }
        var rowid = $(this).closest('.collapse-row').find('.chart-element').attr('data-chart-id');
        updateChartType(rowid,dataAjax);
    });
    $('.chart-on-table').on('click', '.toggle-collapse', function(e) {
        e.preventDefault();
        var $this = $(this);
        var $collapse = $this.closest('.row-info').next();
        $this.toggleClass('active');
        $collapse.toggleClass('expanded');
        $collapse.find('content-table').toggle();
    });

    $('.chart-element').each(function(index,chart){
        initChart($(chart).attr('data-chart-id'),dataDemo);
    });
    function nonAccentVietnamese(str) {
    str = str.toLowerCase();
    str = str.replace(/\u00E0|\u00E1|\u1EA1|\u1EA3|\u00E3|\u00E2|\u1EA7|\u1EA5|\u1EAD|\u1EA9|\u1EAB|\u0103|\u1EB1|\u1EAF|\u1EB7|\u1EB3|\u1EB5/g, "a");
    str = str.replace(/\u00E8|\u00E9|\u1EB9|\u1EBB|\u1EBD|\u00EA|\u1EC1|\u1EBF|\u1EC7|\u1EC3|\u1EC5/g, "e");
    str = str.replace(/\u00EC|\u00ED|\u1ECB|\u1EC9|\u0129/g, "i");
    str = str.replace(/\u00F2|\u00F3|\u1ECD|\u1ECF|\u00F5|\u00F4|\u1ED3|\u1ED1|\u1ED9|\u1ED5|\u1ED7|\u01A1|\u1EDD|\u1EDB|\u1EE3|\u1EDF|\u1EE1/g, "o");
    str = str.replace(/\u00F9|\u00FA|\u1EE5|\u1EE7|\u0169|\u01B0|\u1EEB|\u1EE9|\u1EF1|\u1EED|\u1EEF/g, "u");
    str = str.replace(/\u1EF3|\u00FD|\u1EF5|\u1EF7|\u1EF9/g, "y");
    str = str.replace(/\u0111/g, "d");
    // Some system encode vietnamese combining accent as individual utf-8 characters
    str = str.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ""); // Huyền sắc hỏi ngã nặng 
    str = str.replace(/\u02C6|\u0306|\u031B/g, ""); // Â, Ê, Ă, Ơ, Ư
    return str;
}
    function searchName(inputEle,tableId) {
      //  debugger;
        var input, filter, table, tr, td, i, txtValue;
        input = inputEle;
        filter = nonAccentVietnamese(input.value).toUpperCase();
        table = document.getElementById(tableId);
        console.log(table);
        tr = table.getElementsByTagName("tr");
        for (i = 0; i < tr.length; i++) {
            td = tr[i].getElementsByTagName("td")[1];
            if (td) {
            txtValue = nonAccentVietnamese(td.textContent) || nonAccentVietnamese(td.innerText);
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                tr[i].style.display = "";
                tr[i+1].style.display = "";
            } else {
                tr[i].style.display = "none";
                tr[i+1].style.display ="none";
            }
            }       
        }
    }
    $('#search-saler').on('keyup',function(){
        searchName($('#search-saler').get(0),'sale-viewer');
    });
    

    //New update 4/12 4h chiều
    var areaOption = {
        title:{
            text:'Các khu vực',
            display:true
        },
        responsive: true,
        maintainAspectRatio: false,
        layout: {
            padding: {
                left: 10,
                right: 5,
                top: 10,
                bottom: 10
            }
        },
        legend: {
            display: true,
            fullWidth:true,
            labels: {
                fontColor: '#252525',

            },
        

        },
        hover: {
            mode: "label"
        },
        scales: {
            xAxes: [{
                display: false,

            }],
            yAxes: [{
                display: false,
  
            }]
        },
        tooltips: {
       
            callbacks: {
                label: function(tooltipItem, data) {
                    // console.log(data);
                     console.log(tooltipItem);
                    var label = data.labels[tooltipItem.index];
                    var value = data.datasets[0].data[tooltipItem.index];
               
                    if (parseInt(value) >= 1000) {
                        return  label + ': ' + value.toString().replace(
                            /\B(?=(\d{3})+(?!\d))/g, ",") + ' Học viên';
                    } else {
                        return  label + ': ' + value + ' Học viên';
                    }

                }
            }
        }
    };
    var areaData = {
        labels: ["Quận Cam","Quận Quýt","Quận Dưa","Quận Táo","Quận Lê"],
        datasets:[{
            data: getRandom(4),
            backgroundColor: [
        "#2ecc71",
        "#3498db",
        "#E74C3C",
        "#9b59b6",
        "#f1c40f"
      ],

           
        }]
    }
    console.log(areaData);
    var areaOptionsConfig = {
        type:'pie',
        options:areaOption,
        data:areaData
    }
    var areaChart = new Chart(document.getElementById('area-chart'),areaOptionsConfig);
    

});