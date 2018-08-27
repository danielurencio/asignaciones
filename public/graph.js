function DatosGrales() {

  var str =
  "<div class='ficha' style='position:relative;width:100%;height:100%;background-color:transparent;'>" +
    "<div style='display:table;position:absolute;width:100%;height:100%;'>" +
      "<div style='display:table-cell;width:100%;vertical-align:middle;text-align:center;'>" + // <- 'vertical-align:middle' para centrar

          "<div class='NOMBRE' style='margin:6px;font-weight:700;font-size:14px'></div>" +
/*
            "<table style='width:100%; marginLeft:0%;paddingRight:0%;maxHeight:50%'>" +
              "<tbody style='height:70%;fontWeight:900'>" +

                "<tr>" +
                  "<td>Vigencia (años):</td>" +
                  "<td class='VIG_ANIOS'></td>" +
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
                  "<td class='TIPO'></td>" +
                "</tr>" +
              "</tbody>" +
            "</table>" +
*/
            "<div style='text-align:center;padding:0px;font-weight:800;position:relative;top:12px'>" +
                "<div style='display:table;width:100%'>" +

                  "<div style='width:50%,display:table-cell; background-color:white; vertical-align:middle;position:relative'>" +
                    "<div id='titulo' style='width:70%;padding:2px;left:20%;position:relative;margin:0px;color:white;border-radius:2px;vertical-align:middle;background:url() rgb(13,180,190) no-repeat 20px 3px;cursor:pointer'>" +
                      "Ver título" +
                    "</div>" +
                  "</div>" +

                  "<div style='width:50%;display:table-cell;background-color:white;vertical-align:middle;position:relative'>" +
                    "<div style='width:70%;padding:2px;left:10%;position:relative;color:white;border-radius:2px;vertical-align:middle;background:url() gray no-repeat 20px 3px'>" +
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

function LineChart(data) {
    var asig_id = $('.asignacion>option:selected').attr('id');

            var mods = _.uniq( data.map(function(d) { return d.nombre; }) );

            function Series (str,axis) {
                    var hidrocarburo = str.split('_');
                    hidrocarburo = hidrocarburo[0].toUpperCase() + ' (' + hidrocarburo[1] + ')';


                    var series = mods.map(function(d) {
                        var dato = data.filter(function(e) { return e.nombre == d; });
                        dato = _.sortBy(dato,function(d) { return d.fecha })
                                  .map(function(d) {
                                    var obj =  {
                                      'x':d.fecha,
                                      'y':d[str],
                                      'ID':asig_id,
                                      'hidrocarburo':hidrocarburo,
                                      'nombre':d.nombre
                                    };

                                    return obj;
                                  });

                        var serie = {
                          showInNavigator:true,
                          name:hidrocarburo,
                          data:dato,
                          tooltip: { valueDecimals:2 }
                        };

                        if(axis) {
                          serie['yAxis'] = 1;
                        } else {
                          serie['dashStyle'] = 'ShortDash';
                        }

                        return serie;
                    });

                    return series;
            };

            // Create the chart
            Highcharts.StockChart('visor', {
                legend: {
                  enabled:false
                },
                navigator: {
                  enabled:true
                },
                yAxis: [
                  {
                    title:{
                      text:'Aceite (mbd)'
                    },
                    opposite:false,
                  },
                  {
                    title: {
                      text:'Gas (mmpcd)'
                    },
                  }
                ],
                credits:false,

                rangeSelector: {
                    enabled:true
                },
                title: {
                    text: null//$('.asignacion>option:selected').text()
                },
                subtitle: {
                    text: null//'Producción'
                },

                series: Series('aceite_mbd',1).concat(Series('gas_mmpcd')),
                rangeSelector: {
                  enabled:true,
                  buttons: [
                    {
                      type:'month',
                      count:6,
                      text:'6m'
                    },
                    {
                      type:'year',
                      count:1,
                      text:'12m'
                    },
                    {
                      type:'all',
                      text:'Todo'
                    }
                  ]
                },
                tooltip: {
                  useHTML:true,
                  shared:true,
                  split:false,
                  formatter: function() {

                      var points = this.points.map(function(d) {
                          return {
                            'color':d.color,
                            'valor':d.y,
                            'fecha':d.x,
                            'hidrocarburo':d.point.hidrocarburo,
                            'ID':d.point.ID,
                            'nombre':d.point.nombre
                          };
                      });

                      var str =
                        '<div class="customTooltip">' +
                          '<div>'
                              + points[0].nombre +
                          '</div>' +
                          '<div style="padding-bottom:8px;padding-left:8px;font-weight:600;font-size:11px;">'
                              + parseDate(points[0].fecha) +
                          '</div>' +
                              points.map(function(d) {
                                return '<div style="padding-left:8px;">'
                                          + '<b style="color:'+ d.color +'">' + d.hidrocarburo + ':</b> ' + d.valor.toFixed(2) +
                                       '</div>';
                              }).join('');
                        '</div>';

                      return str;
                  }
                },
                plotOptions: {
                  line: {
                    marker: {
                      enabled:false
                    }
                  }
                }
            });

}


function BarChart(data) {

      function stacks(groups,stackName) {

            var stack = groups.map(function(g) {
              var group = data.filter(function(d) { return d.descriptor == g; })
                              .map(function(d) {

                                  var type = {
                                    'nombre': d.nombre,
                                    'id': d.id,
                                    'x': d.fecha,
                                    'y': d.valor,
                                    'name':g,
                                    'stack':stackName
                                  };

                                  return type;
                              });

              var obj = {};
              obj['stack'] = stackName;
              obj['name'] = g;
              obj['data'] = group;

              return obj;
            });

            return stack;
      };

     var groups = [
       { 'stackName':'Desarrollo','groups':['Perforaciones desarrollo','Terminaciones desarrollo'] },
       { 'stackName':'Reparaciones','groups':['Reparaciones menores','Repraciones mayores'] },
       { 'stackName':'Taponamientos','groups':['Taponamientos'] },
       { 'stackName':'Pozos operando','groups':['Pozos operando'] }
     ];

     var stack = groups.map(function(g) { return stacks(g.groups,g.stackName); });

     var stack_ = [];

     for(var i in stack ) {
       if( i == 0 ) {
          stack_ = stack_.concat(stack[i]);
       } else {
          stack_ = stack_.concat(stack[i]);
       }
     }

     console.log(stack_)

      Highcharts.chart('visor', {
          credits:false,
          chart: {
              type: 'column'
          },
          title: {
              text: 'Pozos'
          },
          subtitle: {
              text:''
          },
          xAxis: {
            type:'datetime',
            dateTimeLabelFormats: {
              month:'%b \ %Y'
            }
          },
          tooltip: {
              formatter: function() {

                var str = "<b>" + parseDate(this.x) + '</b>:<br> ' + this.points.map(function(d) { return "  " + d.key + ': ' + d.y }).join('<br>');
                return str;
              },
              shared: true,
              useHTML: true
          },
          plotOptions: {
              column: {
                  pointPadding: 0.2,
                  borderWidth: 0,
                  stacking:'normal'
              }
          },
          series: stack_,
          rangeSelector: {
            enabled:true,
            buttons: [
              {
                type:'month',
                count:6,
                text:'6m'
              },
              {
                type:'year',
                count:1,
                text:'12m'
              },
              {
                type:'all',
                text:'Todo'
              }
            ]
          }
      });

}

function enConstruccion() {
  var str =
  "<div class='ficha' style='position:relative;width:100%;height:100%;background-color:transparent;'>" +
    "<div style='display:table;position:absolute;width:100%;height:100%;'>" +
      "<div style='display:table-cell;width:100%;vertical-align:middle;text-align:center;font-size:30px;font-weight:800;'>" + // <- 'vertical-align:middle' para centrar
        ' EN CONSTRUCCIÓN &#9874;' +
      "</div>" +
    "</div>" +
  "</div>"

  $('#visor').html(str);
}
