function DatosGrales() {

  var str =
  "<div class='ficha' style='position:relative;width:100%;height:100%;background-color:transparent;'>" +
    "<div style='display:table;position:absolute;width:100%;height:100%;'>" +
      "<div style='display:table-cell;width:100%;vertical-align:middle;text-align:center;'>" + // <- 'vertical-align:middle' para centrar

          "<div class='NOMBRE' style='margin:6px;fontWeight:700;fontSize:14px'></div>" +
            "<table style='width:100%; marginLeft:0%;paddingRight:0%;maxHeight:50%'>" +
              "<tbody style='height:70%;fontWeight:900'>" +

                "<tr>" +
                  "<td>Vigencia (años):</td>" +
                  "<td class='VIGENCIA_ANIOS'></td>" +
                "</tr>" +

                "<tr>" +
                  "<td>Inicio de vigencia</td>" +
                  "<td class='VIG_INICIO'></td>" +
                "</tr>" +
                "<tr>" +
                  "<td>Fin de vigencia</td>" +
                  "<td class='VIG_FIN'></td>" +
                "</tr>" +
                "<tr>" +
                  "<td>Superficie (km<sup>2</sup>)</td>"+
                  "<td class='SUPERFICIE_KM2'></td>" +
                "</tr>" +
                "<tr>" +
                  "<td>Tipo de asignación</td>" +
                  "<td class='ESTATUS'></td>" +
                "</tr>" +
              "</tbody>" +
            "</table>" +

            "<div style='text-align:center;padding:0px;font-weight:800;position:relative;top:12px'>" +
                "<div style='display:table;width:100%'>" +

                  "<div style='width:50%,display:table-cell; background-color:white; vertical-align:middle;position:relative'>" +
                    "<div id='titulo' style='width:70%;padding:2px;left:20%;position:relative;margin:0px;color:white;border-radius:2px;vertical-align:middle;background:url() rgb(13,180,190) no-repeat 20px 3px;cursor:pointer'>" +
                      "Ver título" +
                    "</div>" +
                  "</div>" +

                  "<div style='width:50%;display:table-cell;background-color:white;vertical-align:middle;position:relative'>" +
                    "<div style='width:70%;padding:2px;left:10%;position:relative;color:white;border-radius:2px;vertical-align:middle;background:url() rgb(13,180,190) no-repeat 20px 3px'>" +
                      "Resumen" +
                    "</div>" +
                  "</div>" +

                "</div>" +
            "</div>" +

          "</div>"

      "</div>" +
    "</div>" +
  "</div>"

  $('#visor').html(str);
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
