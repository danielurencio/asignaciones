 function GRAPH() {
 var info = {"serie":{"name":"Petróleo (Mbd)","data":[["2018/Abr",1882.6],["2018/Mar",1861.1],["2018/Feb",1891.2],["2018/Ene",1925.1],["2017/Dic",1877.1],["2017/Nov",1868.6],["2017/Oct",1903.7],["2017/Sep",1732],["2017/Ago",1932.1],["2017/Jul",1987.9],["2017/Jun",2009.6]],"showInLegend":false,"color":"rgb(13,180,190)","_symbolIndex":0},"grandparent":"NACIONAL","parent":"PRODUCCIÓN","tema":"Petróleo (Mbd)","subtema":"","fechas":["2017/Jun","2017/Jul","2017/Ago","2017/Sep","2017/Oct","2017/Nov","2017/Dic","2018/Ene","2018/Feb","2018/Mar","2018/Abr"]}
 Highcharts.chart('visor', {
        lang: {
            'img': 'Descargar imagen'
        },
        exporting: {
            enabled: true,
            buttons: {
                contextButton: {
                    symbolX: 19,
                    symbolY: 18,
                    //symbol: 'url(img/download.svg)',
                    _titleKey: 'img',
                    menuItems: [{
                            textKey: 'downloadPNG',
                            //onclick: descargarPNG,
                            text: "PNG"
                        },
                        {
                            textKey: 'downloadCSV',
                            //onclick: descargarSerie,
                            text: "CSV"
                        }
                    ]
                }
            }
        },
        chart: {
            style: {
                fontFamily: 'Open Sans'
            },
            inverted: false,
            //marginBottom: marginCred//window.innerWidth > 640 ? marginCred : 40
        },
        tooltip: {
            useHTML: true,
            backgroundColor: null,
            borderWidth: 0,
            style: {
                fontWeight: 800
            },
            formatter: function() {
                var t =
                    "<div style='text-align:center;'>"
		   + "<span style='font-size:11px;font-weight:800;color:"
		   + 'black' + ";'>" +
                    this.point.name +
                    "</span>" +
                    "<br>" +
                    "<span style='font-weight:300;font-size:18px;'>" +
                    this.y.toLocaleString("es-MX") +
                    "</span></div>";
                return t;
            }
        },
        credits:false,
/*
        {

            enabled: true,//window.innerWidth > 640 ? true : false,
            
            text: NOTAS,
            position: {
                align: "left",
                x: 50,
                y: marginCred > 100 ? -75 * offsetCred : -50
            },
            style: {
                fontSize: '10px',
                fontWeight: 300,
                color: "black"
            },
            href: null
            
        },
*/
        title: {
            text: info.subtema ? info.subtema : info.tema
        },
        subtitle: {
            text: null//info.grandparent + " - " + info.parent
        },
        xAxis: {
            labels: {
                enabled: true,
                formatter: function() {
                    return info.fechas[this.value];
                }
            }
        },
        yAxis: {
            gridLineWidth: 1,
            labels: {
                formatter: function() {
                    return this.value.toLocaleString('es-MX');
                },
            },
            title: {
                style: {
                    fontWeight: 700
                },
                text: info.tema
            },
            min:0
        },
        plotOptions: {
            series: {
		turboThreshold:0,
                label: {
                    connectorAllowed: false
                },
                marker: {
                    radius: 0,
                    states: {
                        hover: {
                            radius: 5
                        }
                    }
                }
            }
        },
        series: [info.serie],
        responsive: {
            rules: [{
                condition: {
                    maxWidth: 500
                },
                chartOptions: {
                    legend: {
                        layout: 'horizontal',
                        align: 'center',
                        verticalAlign: 'bottom'
                    }
                }
            }]
        }

    });
}

function LineChart() {
    $.getJSON('aapl-c.json', function (data) {
    // Create the chart
        Highcharts.stockChart('visor', {

            credits:false,
            rangeSelector: {
                selected: 1,
                inputEnabled:true,
                buttonTheme: {
                    visibility:'hidden'
                },
                labelStyle:{
                    visibility:'hidden'
                }

            },

            title: {
                text: 'Producción'
            },

            series: [{
                name: 'AAPL',
                data: data,
                tooltip: {
                    valueDecimals: 2
                }
            }],
        });
    });
}


function BarChart() {
Highcharts.chart('visor', {
    credits:false,
    chart: {
        type: 'column'
    },
    title: {
        text: 'Reservas'
    },
    subtitle: {
        text:''
    },
    xAxis: {
        categories: [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec'
        ],
        crosshair: true
    },
    yAxis: {
        min: 0,
        title: {
            text: ''
        }
    },
    tooltip: {
        headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
        pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
            '<td style="padding:0"><b>{point.y:.1f} mm</b></td></tr>',
        footerFormat: '</table>',
        shared: true,
        useHTML: true
    },
    plotOptions: {
        column: {
            pointPadding: 0.2,
            borderWidth: 0
        }
    },
    series: [{
        name: '1P',
        data: [49.9, 71.5, 106.4, 129.2, 144.0, 176.0, 135.6, 148.5, 216.4, 194.1, 95.6, 54.4]

    }, {
        name: '2P',
        data: [83.6, 78.8, 98.5, 93.4, 106.0, 84.5, 105.0, 104.3, 91.2, 83.5, 106.6, 92.3]

    }, {
        name: '3P',
        data: [48.9, 38.8, 39.3, 41.4, 47.0, 48.3, 59.0, 59.6, 52.4, 65.2, 59.3, 51.2]

    }]
});

}