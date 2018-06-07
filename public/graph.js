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