function drowAllBarCharts(chartsData) {
    console.log(chartsData)
    let barCharts = document.querySelectorAll('.scale-barChart');
    console.log(barCharts)
    for (let i = 0; i < barCharts.length; i++) {
        console.log(barCharts[i])
        // render init block
        let myChart = new Chart(
            barCharts[i],
            // config 
            config = {
                type: 'bar',
                data: chartsData[i],
                plugins: [ChartDataLabels],
                options: {
                    maintainAspectRatio: false,
                    color: '#000',
                    plugins: {
                        tooltip: {
                            enabled: false
                        },
                        legend: {
                            display: false
                        },
                        datalabels: {
                            color: '#000',
                            anchor: 'end',
                            align: 'top',
                            offset: 0,
                            font: {
                                size: 15
                            }
                        }
                    },
                    scales: {
                        y: {
                            grace: '0.2%',
                            beginAtZero: true,
                            ticks: {
                                display: false,
                                stepSize: 5
                            },
                            grid: {
                                display: false,
                                drawBorder: false
                            }
                        },
                        x: {
                            grid: {
                                display: false,
                                //  drawBorder: false
                            },
                            ticks: {
                                font: {
                                    size: 13,
                                    color: '#000',
                                }
                            }
                        }
                    }
                }
            }
        );
    }
}
drowAllBarCharts(data);

let barChartProgressEl = $('.barChart-progress-box .barChart-progress-colored');

function drowProgressForBarChart(percentageEl, size) {
    for (let i = 0; i < percentageEl.length; i++) {
        const percentageVal = percentageEl[i].getAttribute('data-progress') * 1;
        if (percentageVal < 5 && size < 450) {
            $(percentageEl[i]).find('.progress-average-point').css('opacity', '0');
        }
        if (percentageVal < 2 && size > 450) {
            $(percentageEl[i]).find('.progress-average-point').css('opacity', '0');
        } else {
            $(percentageEl[i]).find('.progress-average-point').css('opacity', '1');
        }
        $(percentageEl[i]).parents('.barChart-progress-box').find('.barChart-progress-colored').css('width', percentageVal + '%');
    }
}

drowProgressForBarChart(barChartProgressEl, windowSize);