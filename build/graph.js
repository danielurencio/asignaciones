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



function Wrangler(config, groups_) {

      this.simpleAggregationBy = function(data,key) {
            var result = _.uniq(data.map(function(d) { return d[key]; }))
                      .map(function(d) {
                          return data.filter(function(f) {
                            return f[key] == d;
                          });
                      });

            return result;
      };

      this.aggregate = function(data) {
            var classes = _.uniq(data.map(function(d) { return d[config.aggregator]; }))
                          .map(function(d) {
                              return data.filter(function(f) {
                                return f[config.aggregator] == d;
                              })
                          })
                          .map(function(d) {
                                var subClasses = _.uniq(d.map(function(a) { return a[config.subAggregator]; }));
                                var suma_ = subClasses.map(function(a) {

                                    var ss = d.filter(function(f) { return f[config.subAggregator] == a; })
                                              .map(function(m) { return +m[config.valueToAggregate]; })
                                              .reduce(function(a,b) { return a + b; });

                                    var obj = {};
                                    obj['x'] = typeof(a) == 'number' ? new Date(a,0) : a;
                                    obj['y'] = ss;
                                    obj['nombre'] = d[0].nombre;
                                    obj['id'] = d[0].id;
                                    obj[config.aggregator] = d[0][config.aggregator];

                                    return obj;

                            });

                            return suma_
            });

            if(config.flatten) {
                classes = _.flatten(classes);
                if(config.percentage) {
                    var total = classes.map(function(d) { return d.y; })
                                       .reduce(function(a,b) { return a + b; });

                    classes = classes.map(function(d,i) {
                        d['name'] = d.x;
                        delete d.x;
                        d.y /= total;
                        d.y = d.y*100;
                        //d.y = +d.y.toFixed(1);

                        d.mainColor = Highcharts.getOptions().colors[config.colores[d.actividad]];
                        var brightness = 0.2 - (i / classes.length) / 5;

                        d.color = Highcharts.Color(d.mainColor).brighten(brightness).get()

                        return d;
                    });

                }
            }

            return classes;
      };

      this.stackData = function(data) {

                function stacks(groups,stackName) {

                      var stack = groups.map(function(g) {
                        var group = data.filter(function(d) { return d[config.filter] == g; })
                                        .map(function(d) {

                                            var type = {
                                                'nombre': d[config.nombre],
                                                'id': d[config.id],
                                                'x': String(d[config.x]).length == '4' ? new Date(d[config.x],0).getTime() : d[config.x],
                                                'y': +d[config.y],
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

               var stack = groups_.map(function(g) { return stacks(g.groups,g.stackName); });

               var stack_ = [];

               for(var i in stack ) {
                   if( i == 0 ) {
                      stack_ = stack_.concat(stack[i]);
                   } else {
                      stack_ = stack_.concat(stack[i]);
                   }
               };

               return stack_;
    };

}


function BarChart(config) {

      // Los parámetros de este prototipo pueden cambiar el título, orientación de las barras y demás.
      this.plot = function(data,fn) {
            var stack_ = fn(data);
            Highcharts.chart(config.where, {
                legend: {
                  enabled: (function() {
                    var legend;
                    if(!config.hideLegend) {
                      legend = true;
                    } else {
                      legend = false;
                    }
                    return legend;
                  })()
                },
                exporting:{
                  enabled:false
                },
                credits:false,
                chart: {
                    type: config.type
                },
                title: {
                    text: config.title
                },
                subtitle: {
                    text:config.subtitle
                },
                yAxis: {
                    opposite:config.opposite,
                    title:{
                      text:config.yAxis
                    }
                },
                xAxis: {
                  type:'datetime',
                  dateTimeLabelFormats: {
                    month:'%b \ %Y'
                  }
                },
                tooltip: {
                    formatter: function() {

                      var str = "<div><b>" +
                                    parseDate(this.x) + '</b>:<br> ' +
                                    this.points.map(function(d) { return "  " + d.key + ': ' + d.y }).join('<br>') +
                                "</div>";

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
                  enabled:(function() {
                    var rangeSelector;
                    if(!config.noRange) {
                      rangeSelector = true;
                    } else {
                      rangeSelector = false;
                    }
                    return rangeSelector;
                  })(),
                  buttons: (
                    function() {
                          var b;
                          b = [
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
                        ];

                        var cond = config.timebuttons ? b : null;
                        return cond;
                    }
                  )()
                }
            })
    };
}


function pie(data_,subdata) {
  // Create the chart
  Highcharts.chart('one', {
      credits:false,
      exporting: {
          enabled:false
      },
      chart: {
          type: 'pie'
      },
      title: {
          text: ''
      },
      subtitle: {
          style:{
            fontSize:'11px',
            padding:'0px',
            margin:'0px'
          },
          text: 'Inversión por actividad y sub-actividad a lo largo del proyecto'
      },
      yAxis: {
          title: {
              text: ''
          }
      },
      plotOptions: {
          pie: {
              shadow: false,
              center: ['50%', '50%']
          }
      },
      tooltip: {
          valueSuffix: '%'
      },
      series: [{
          name: 'Actividad',
          data: data_,
          size: '75%',
          innerSize:'45%',
          dataLabels: {
              style: {
                textOutline:0,
                fontWeight:600
              },
              /*
              formatter: function () {
                  return this.y > 5 ? this.point.name : null;
              },
              */
              color: 'black',
              distance: -25
          }
      }, {
          name: 'Sub-actividad',
          data: subdata,
          size: '110%',
          innerSize: '80%',
          dataLabels: {
            color:'black',
            distance:30,
            style:{
              textOutline:0,
              fontWeight:300
            }
            /*
              formatter: function () {
                  // display only if larger than 1
                  return this.y > 1 ? '<b>' + this.point.name + ':</b> ' +
                      this.y + '%' : null;
              }
              */
          },
          id: 'versions'
      }],
      responsive: {
          rules: [{
              condition: {
                  maxWidth: 600
              },
              chartOptions: {
                  series: [{
                      id: 'versions',
                      dataLabels: {
                          enabled: false
                      }
                  }]
              }
          }]
      }
  });

}


function dashboard(data) {
   var str =
   "<div style='width:100%;height:100%;'>"+
        "<div style='width:100%;height:50%;display:table;'>"+
            "<div id='one' style='width:50%;height:100%;display:table-cell;'></div>" +
            "<div id='two' style='width:50%;height:100%;display:table-cell;'></div>" +
        "</div>" +
        "<div id='three' style='width:100%;height:50%;'></div>" +
   "</div>"

   $('#visor').html(str);
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


function noDato() {
  var asig = $('.asignacion>option:selected').val();
  var topic = $('.selectedButton').attr('id');

  var str =
  "<div class='ficha' style='position:relative;width:100%;height:100%;background-color:transparent;'>" +
    "<div style='display:table;position:absolute;width:100%;height:100%;'>" +
      "<div style='display:table-cell;width:100%;vertical-align:middle;text-align:center;font-size:25px;font-weight:400;'>" + // <- 'vertical-align:middle' para centrar
        ' Esta información aún no se encuentra disponible.' +
      "</div>" +
    "</div>" +
  "</div>"

  $('#visor').html(str);
}
