
function DatosGrales(data)  {

  var grales = data.grales;//JSON.parse(JSON.stringify(data.grales));
  var params = ['cuenca','ubicacion','tipo','asignacion'].map((d) => [d.toUpperCase(),$('.' + d + '>option:selected').text()])

  params = params.filter((f) => f[1].slice(0,3) != 'Tod');

  params.forEach(function(p) {
    grales = grales.filter((d) => d[p[0]] == p[1])
  });


  var div = new DOMParser().parseFromString('<div></div>','text/html')
                           .querySelector('body>div');



  d3.select(div).append('div')
    .style({
      'table-layout':'fixed',
      'width':'100%',
      'height':'100%',
      'display':'table',
      'position':'relative'
    })
    .selectAll('div')
    .data(['a','b']).enter()
    .append('div')
    .attr('id',function(d) {
      return 'row_' + d;
    })
    .style({
      'display':'table',
      'table-layout':'fixed',
      'width':'100%',
      'height':'50%',
      'position':'relative',
      'padding-bottom': function(d,i) {
          var p = '0px';
          if( d == 'a') p = '10px';
          return p;
      }
    }).each(function(d,i) {
      var cells = i == 0 ? [1,2,3] : [1,2];

      d3.select(this).selectAll('div')
        .data(cells).enter()
        .append('div')
        .attr('id',function(d) { return 'col_' + d; })
        .style({
            width:(100 / cells.length).toFixed(2) + '%',
            height:'50%',
            //'background-color':'purple',
            //border:'1px solid white',
            display:'table-cell'
        })
        .append('div')
    })


  $('#visor').html(div.innerHTML)
  var colors_ = ['rgb(115,194,251)','rgb(87,160,211)','rgb(129,216,208)','rgb(79,151,163)','rgb(70,130,180)','rgb(0,128,129)']

  var ASIG_ = $('.asignacion>option:selected').text()
  var numOnom = ASIG_ != 'Todas' ? ASIG_.split(' - ')[0] : grales.length;
  var numOnomSize = ASIG_ != 'Todas' ? 2 : 5;
  var subtNumOnom = ASIG_ != 'Todas' ? ASIG_.split(' - ')[1] : 'ASIGNACIONES';

  d3.select('div#row_a>div#col_1')
  .html(function(d) {

    var tipos_asigs =
      "<div style='font-weight:700;color:rgb(13,180,190);'>"+ grales.filter((d) => new RegExp('^A-').test(d.NOMBRE)).length +" Extracción</div>"+
      "<div style='font-weight:700;color:rgb(46,112,138);'>"+ grales.filter((d) => new RegExp('^AE-').test(d.NOMBRE)).length +" Exploración</div>"+
      "<div style='font-weight:700;color:rgb(20,50,90);'>"+ grales.filter((d) => new RegExp('^AR-').test(d.NOMBRE)).length +" Resguardo</div>"

    var _tipo_ = "";
    var color = "";
    var un_tipoAsig = "<div>" + _tipo_ + "</div>";

    if(ASIG_ != 'Todas') {
        if(ASIG_.split('-')[0] == 'A') {
          _tipo_ = 'Extracción';
          color = 'rgb(13,180,190)';
        } else if(ASIG_.split('-')[0] == 'AE') {
          _tipo_ = 'Exploración';
          color = 'rgb(46,112,138)';
        } else {
          _tipo_ = 'Resguardo';
          color = 'rgb(20,50,90)';
        }
        un_tipoAsig = '<div style="color:'+color+';font-size:2em;font-weight:700;">' + _tipo_ + '</div>'
    } else {
        un_tipoAsig = tipos_asigs;
    }


    return "<div style='width:100%;height:100%;background-color:white;position:relative;display:table;table-layout:fixed;'>" +
              "<div style='display:table-row;width:100%;height:50%;text-align:center;table-layout:fixed;position:relative;'>" +
                  "<div style='display:table-cell;position:relative;vertical-align:middle;'>" +
                      "<div style='width:100%;height:100%;border-right:1px solid gray;display:table;'>" +
                          "<div style='display:table-cell;vertical-align:middle;'>" +
                              "<div style='font-size:"+ numOnomSize +"em;font-weight:800;color:rgb(13,180,190);'>" + numOnom + "</div>" +
                              "<div style='position:relative:;top:-10px;font-size:1em;font-weight:600;'>"+ subtNumOnom +"</div>" +
                          "</div>" +
                      "</div>" +
                  "</div>" +
              "</div>" +
              "<div style='display:table-row;width:100%;height:50%;text-align:center;table-layout:fixed;position:relative;'>" +
                  "<div style='display:table-cell;position:relative;vertical-align:middle;text-align:center;border-right:1px solid gray;'>" +
                    un_tipoAsig +
                  "</div>" +
              "</div>" +
          "</div>"
  });

  d3.select('div#row_a>div#col_2')
  .html(function(d) {
    var grales_ = ASIG_ != 'Todas' ? data.grales.filter((d) => d.NOMBRE == ASIG_) : grales;
    var seg = _.sortBy(data.ajaxData.seguimiento.ext,function(d) { return d.anio; }).filter((f) => f.tipo_observacion == 'Real');
    var gop = d3.sum(seg.filter((f) => f.concepto == 'G_Op').map((d) => d.valor))/1000;


    return "<div style='width:100%;height:100%;background-color:white;position:relative;display:table;table-layout:fixed;'>" +
              "<div style='display:table-row;width:100%;height:50%;text-align:center;table-layout:fixed;position:relative;'>" +
                  "<div style='display:table-cell;position:relative;vertical-align:middle;'>" +
                      "<div style='display:table;width:100%;height:100%;'>" +
                          "<div style='display:table-cell;vertical-align:middle;color:white;color:"+colors_[0]+"'>" +
                              "<div style='font-size:3em;font-weight:700;'>"+ d3.sum(grales_.map((d) => d.N_CAMPOS_RESERVAS)) +"</div>" +
                              "<div style='position:relative:;top:-10px;font-size:0.85em;font-weight:600;color:black;'>CAMPOS CON RESERVAS</div>" +
                          "</div>" +
                      "</div>" +
                  "</div>" +
              "</div>" +
              "<div style='display:table-row;width:100%;height:50%;text-align:center;table-layout:fixed;position:relative;'>" +
                  "<div style='display:table-cell;position:relative;vertical-align:middle;'>" +
                      "<div style='display:table;width:100%;height:100%;'>" +
                          "<div style='display:table-cell;vertical-align:middle;color:white;color:"+colors_[1]+"'>" +
                              "<div style='font-size:3em;font-weight:700;'>"+ gop.toFixed(1) +"</div>" +
                              "<div style='position:relative:;top:-10px;font-size:0.85em;font-weight:600;color:black'>GASTOS DE OPERACIÓN<br>(miles de millones de pesos)</div>" +
                          "</div>" +
                      "</div>" +
                  "</div>" +
              "</div>" +
          "</div>"
  })

  d3.select('div#row_a>div#col_3')
  .html(function(d) {

    var grales_ = ASIG_ != 'Todas' ? data.grales.filter((d) => d.NOMBRE == ASIG_) : grales;
    var seg = _.sortBy(data.ajaxData.seguimiento.ext,function(d) { return d.anio; }).filter((f) => f.tipo_observacion == 'Real');
    //seg = ASIG_ != 'Todas' ? seg.filter((f) => new RegExp(ASIG_,f)) : '';

    var inv = d3.sum(seg.filter((f) => f.concepto == 'Inv').map((d) => d.valor))/1000;

    return "<div style='width:100%;height:100%;background-color:white;position:relative;display:table;table-layout:fixed;'>" +
              "<div style='display:table-row;width:100%;height:50%;text-align:center;table-layout:fixed;position:relative;'>" +
                  "<div style='display:table-cell;position:relative;vertical-align:middle;'>" +
                      "<div style='display:table;width:100%;height:100%;'>" +
                          "<div style='display:table-cell;vertical-align:middle;color:white;color:"+colors_[2]+"'>" +
                              "<div style='font-size:3em;font-weight:700;'>"+ (d3.sum(grales_.map((d) => d.SUPERFICIE_KM2))/1000).toFixed(1) +"</div>" +
                              "<div style='position:relative:;top:-10px;font-size:0.85em;font-weight:600;color:black;'>MILES DE KM<sup>2</sup></div>" +
                          "</div>" +
                      "</div>" +
                  "</div>" +
              "</div>" +
              "<div style='display:table-row;width:100%;height:50%;text-align:center;table-layout:fixed;position:relative;'>" +
                  "<div style='display:table-cell;position:relative;vertical-align:middle;'>" +
                      "<div style='display:table;width:100%;height:100%;'>" +
                          "<div style='display:table-cell;vertical-align:middle;color:white;color:"+colors_[3]+"'>" +
                              "<div style='font-size:3em;font-weight:700;'>"+ inv.toFixed(1) +"</div>" +
                              "<div style='position:relative:;top:-10px;font-size:0.85em;font-weight:600;color:black;'>INVERSIÓN<br>(miles de millones de pesos)</div>" +
                          "</div>" +
                      "</div>" +
                  "</div>" +
              "</div>" +
          "</div>"
  });

  var meses = {
    '1':'Enero',
    '2':'Febrero',
    '3':'Marzo',
    '4':'Abril',
    '5':'Mayo',
    '6':'Junio',
    '7':'Julio',
    '8':'Agosto',
    '9':'Septiembre',
    '10':'Octubre',
    '11':'Noviembre',
    '12':'Diciembre',
  };

  d3.select('div#row_b>div#col_1')
    .style({
      'background-color':colors_[4],
      'color':'white'
    })
    .html(function(d) {

      var prod = _.sortBy(data.ajaxData.produccion,function (d) { return d.fecha; });
      var prod = prod[prod.length -1 ];

      function fechA(ts) {
        var f = new Date(ts)
        var mes = String(f.getMonth() + 1);
        var anio = f.getFullYear(ts)
        return meses[mes] + ' - ' + anio;
      }

      var _aceite_ = data.ajaxData.produccion.length > 0 ? (+prod.aceite_mbd.toFixed(1)).toLocaleString('es-MX') : 0;
      var _gas_ = data.ajaxData.produccion.length > 0 ? (+prod.gas_mmpcd.toFixed(1)).toLocaleString('es-MX') : 0;
      var _fecha_ = data.ajaxData.produccion.length > 0 ? fechA(prod.fecha) : '-';

      return "<div style='width:100%;height:100%;position:relative;display:table;table-layout:fixed;'>" +
                "<div style='display:table-row;width:100%;height:50%;text-align:center;table-layout:fixed;position:relative;'>" +
                    "<div style='display:table-cell;position:relative;vertical-align:middle;'>" +
                        "<div style='display:table;width:100%;height:100%;'>" +
                            "<div style='display:table-cell;vertical-align:middle;'>" +
                                "<div style='position:relative:;top:-10px;font-size:1.5em;font-weight:700;color:"+colors_[0]+"'>PRODUCCIÓN</div>" +

                                "<div style='text-align:center;'>" +
                                  "<div style='display:inline-block;'>" +

                                      "<div style='display:table;font-weight:800;font-size:2.5em;'>" +
                                          "<div style='display:table-row;'>" +
                                              "<div style='display:table-cell;text-align:right;'><span style='font-weight:400;font-size:0.4em;'>ACEITE&nbsp;</span></div>" +
                                              "<div style='display:table-cell;text-align:center;'>"+ _aceite_ +"</div>" +
                                              "<div style='display:table-cell;text-align:left;'><span style='font-weight:400;font-size:0.4em;'>&nbsp;MBD</span></div>" +
                                          "</div>" +
                                          "<div style='display:table-row;'>" +
                                              "<div style='display:table-cell;text-align:right;'><span style='font-weight:400;font-size:0.4em;'>GAS&nbsp;</span></div>" +
                                              "<div style='display:table-cell;text-align:center;'>"+ _gas_ +"</div>" +
                                              "<div style='display:table-cell;text-align:left;'><span style='font-weight:400;font-size:0.4em;'>&nbsp;MMPCD</span></div>" +
                                          "</div>" +
                                      "</div>" +

                                   "</div>" +
                                "</div>" +

                                "<div style='position:relative:;top:-10px;font-size:1.5em;font-weight:700;color:"+colors_[0]+"'>"+ _fecha_ +"</div>" +
                            "</div>" +
                        "</div>" +
                    "</div>" +
                "</div>" +
              "</div>"
    });


    d3.select('div#row_b>div#col_2')
      .style({
        'background-color':colors_[5],
        'color':'white'
      })
      .html(function(d) {
        var resv_ = _.sortBy(data.ajaxData.reservas,function (d) { return d.fecha; });
        var resv = resv_[resv_.length -1 ];

        var resv_ = resv_.filter((f) => f.fecha == resv.fecha);
        var _fecha_ = data.ajaxData.reservas.length > 0 ? +(new Date(resv.fecha).getFullYear()) + 1 : '-';

        function filas(str_) {
          var _pce_ = data.ajaxData.reservas.length > 0 ? (+resv_.filter((f) => f.tipo == str_)[0].rr_pce_mmbpce.toFixed(1)).toLocaleString('es-MX') : '0';
          var _aceite_ = data.ajaxData.reservas.length > 0 ? (+resv_.filter((f) => f.tipo == str_)[0].rr_aceite_mmb.toFixed(1)).toLocaleString('es-MX') : '0';
          var _gas_ = data.ajaxData.reservas.length > 0 ? (+resv_.filter((f) => f.tipo == str_)[0].rr_gas_natural_mmmpc.toFixed(1)).toLocaleString('es-MX') : '0';


          var style = "display:table-cell;text-align:center;padding:5px;"
          var ff =
          "<div style='"+ style +"border-right:1px solid rgba(255,255,255,.3);'>"+
            _pce_ +
          "</div>" +
          "<div style='"+ style +"border-right:1px solid rgba(255,255,255,.3);'>"+
             _aceite_ +
          "</div>" +
          "<div style='"+ style +"border-right:1px solid rgba(255,255,255,.3);'>"+
             _gas_ +
          "</div>" +
          "<div style='"+ style +"font-weight:400;font-size:.8em;color:"+colors_[2]+"'>"+ str_.toUpperCase() + "</div>"

          return ff;
        }

        return "<div style='width:100%;height:100%;position:relative;display:table;table-layout:fixed;'>" +
                  "<div style='display:table-row;width:100%;height:50%;text-align:center;table-layout:fixed;position:relative;'>" +
                      "<div style='display:table-cell;position:relative;vertical-align:middle;'>" +
                          "<div style='display:table;width:100%;height:100%;'>" +
                              "<div style='display:table-cell;vertical-align:middle;'>" +
                                  "<div style='position:relative:;top:-10px;font-size:1.5em;font-weight:700;color:"+colors_[2]+"'>RESERVAS</div>" +

                                  "<div style='text-align:center;'>" +
                                    "<div style='display:inline-block;'>" +

                                        "<div style='display:table;font-weight:800;font-size:1em;'>" +
                                            "<div style='display:table-row;text-align:center;font-weight:400;color:"+colors_[2]+"'>" +
                                                "<div style='display:table-cell;text-align:center;'>"+ 'PCE' +"</div>" +
                                                "<div style='display:table-cell;text-align:center;'>"+ 'ACEITE' +"</div>" +
                                                "<div style='display:table-cell;text-align:center;'>"+ 'GAS' +"</div>" +
                                                "<div style='display:table-cell;text-align:center;'>"+ '' +"</div>" +
                                            "</div>" +
                                            "<div style='display:table-row;'>" +
                                                filas('probadas') +
                                            "</div>" +
                                            "<div style='display:table-row;'>" +
                                                filas('probables') +
                                            "</div>" +
                                            "<div style='display:table-row;'>" +
                                                filas('posibles') +
                                            "</div>" +
                                            "<div style='display:table-row;font-weight:400;color:"+colors_[2]+"'>" +
                                                  "<div style='display:table-cell;text-align:center;'>"+ 'MMB' +"</div>" +
                                                  "<div style='display:table-cell;text-align:center;'>"+ 'MMB' +"</div>" +
                                                  "<div style='display:table-cell;text-align:center;'>"+ 'MMMPC' +"</div>" +
                                                  "<div style='display:table-cell;text-align:center;'>"+ '' +"</div>" +
                                            "</div>" +
                                        "</div>" +

                                     "</div>" +
                                  "</div>" +

                                  "<div style='position:relative:;top:-10px;font-size:1.5em;font-weight:700;color:"+colors_[2]+"'>"
                                              + _fecha_ +"</div>" +

                              "</div>" +
                          "</div>" +
                      "</div>" +
                  "</div>" +
                "</div>"
      });

}


function DatosGrales_() {

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

            function Series (str,axis,color) {
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
                          tooltip: { valueDecimals:2 },
                          navigatorOptions: {
                            lineColor:color,
                            color:'transparent'
                          },
                          color:color
                          //color:'red'
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
            var chart = Highcharts.StockChart('visor', {
                legend: {
                  enabled:false
                },
                navigator: {
                  enabled:true
                },
                yAxis: [
                  {
                    title:{
                      text:'Gas (mmpcd)'
                    },
                    opposite:false,
                  },
                  {
                    title: {
                      text:'Aceite (mbd)'
                    },
                  }
                ],
                credits:false,

                rangeSelector: {
                    enabled:true
                },
                title: {
                    text: 'Producción',
                    style: {
                      'font-family':'Open Sans',
                      'font-weight':800,
                      'font-size':'2.5em'
                    }//null//$('.asignacion>option:selected').text()
                },
                subtitle: {
                    text: null//'Producción'
                },

                series: Series('aceite_mbd',1,'green').concat(Series('gas_mmpcd',null,'red')),
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
                  borderColor:'transparent',
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

                      var nombre = points[0].nombre ? points[0].nombre : '';
                      
                      var str =
                        '<div class="customTooltip">' +
                          '<div>' +
                               nombre +
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

            return chart;
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
                chart: config.chart,
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
                    },
                    gridLineWidth:0,
                    max: config.yMax ? config.yMax : null,
                    stackLabels: {
                      enabled:config.stackLabels,
                      formatter:function() {
                        var result = Number(this.total.toFixed(1)).toLocaleString('es-MX');
                        return result;
                      }
                    }
                },
                xAxis: config.xAxis/*{
                  type:'datetime',
                  dateTimeLabelFormats: {
                    month:'%b \ %Y'
                  }
                }*/,
                tooltip: {
                    borderColor:'transparent',
                    formatter: function() {
                      var str;

                      if(!config.tooltip) {
                            str = "<div><b>" +
                                          parseDate(this.x) + "</b>:<br> " +
                                          this.points.map(function(d) {
                                            var content = "  <span style=\"font-weight:700;color:"+d.color+"\">&nbsp;&bull;" + d.key + ": " + (d.y).toFixed(1) + "</span>";
                                            return content;
                                          }).join("<br>") +
                                      "</div>";
                      } else {
                            str = eval(config.tooltip);
                      }

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
            });

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

          formatter: function() {
            var str = '<b>' + this.point.name + ': </b>' + this.y.toFixed(1) + '%';
            return str;
          },
          useHTML:true
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

              formatter: function () {
                  return this.y > 5 ? this.point.name : null;
              },

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
            distance:1,
            style:{
              textOutline:0,
              fontWeight:300
            },

              formatter: function () {
                  // display only if larger than 1
                  return this.point.name//'<b>' + this.point.name + ':</b> ' +
                      //this.y.toFixed(1) + '%';
              }

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

function documentos(data) {

  var selects = Array.prototype.slice.call(document.querySelectorAll('select'))
                .map(function(d) {
                  var class_ = d.getAttribute('class');
                  var txt = $('.' + class_ + '>option:selected').text();
                  var obj = {};

                  return [class_.toUpperCase(),txt];
                })
                .filter((f) => !new RegExp(/^Tod/).test(f[1]));


  if(selects.length > 0) {
        var obj = {};

        for(var k in selects) {
            var key = selects[k][0];
            var val = selects[k][1];
            key = key == 'ASIGNACION' ? 'NOMBRE' : key;
            obj[key] = val;
        }

        Object.keys(obj).forEach((key) => {
            data = data.filter((f) => f[key] == obj[key])
        });

  };

  data = _.sortBy(data,(d) => d.NOMBRE);

  var filas = data.map(function(d,i) {
    var str = '<tr width="100%;">'+
                 '<td style="padding:3px;width:50%;">'+ d.NOMBRE +'</td>'+
                 '<td style="padding:3px;width:50%;"><a href="http://localhost:8081/'+d.NOMBRE.split(' - ')[0]+'.pdf" target="_blank" class="hover_hand">Título</a></td>' +
              '</tr>'

    return str;
  }).join('');

  var table_container = '<div style="height:30px;width:100%;">'+
                         '<table style="width:calc(100% - 8px);height:100%;table-layout:fixed;">'+
                           '<tbody style="width:100%;">'+
                             '<tr style="width:100%;font-weight:600;text-align:center;border-bottom:1px solid gray;border-top:1px solid gray;">' +
                               '<td style="width:50%;vertical-align:middle;">Asignacion</td>' +
                               '<td style="width:50%;vertical-align:middle;">Documentos</td>'+
                             '</tr>' +
                           '</tbody>' +
                         '</table>';
                        '</div>';

  var tabla = //table_container +
   '<div id="scroll_table_" style="width:100%;height:calc(' + $('#visor').css('height') + ' - 30px);overflow:auto;border-bottom:1px solid gray;">' +
     '<table style="width:100%;,table-layout:fixed;">' +
       '<tbody id="" style="text-align:center;">' +
       filas +
       '</tbody>'
     '</table>'+
   '</div>';

  var div_table = '<div style="width:100%;height:100%;">'+
                     table_container +
                     tabla +
                  '</div>'

  $('#visor').html(div_table)
}




function CMT(data) {

        function clean_(data) {

            var a = _.uniq(data.map((d) => d.concepto))
                     .map(function(d) {
                            return data.filter((f) => f.concepto == d)
                              .map((d) => d.valor)
                              .every((d) => d) ? d : null;
                    }).filter((f) => f);

            return data.filter((f) => a.some((d) => d == f.concepto));

        };


        var agregados = Object.keys(data).every((d) => !+d) //? true : false;
        var tipoDisponible = agregados ? Object.keys(data).map((d) => JSON.parse(data[d]).length ? d : null).filter((f) => f) : [];

        var nombres = {
            'G_Op': { 'nombre':'Gastos de operación', 'unidades':'Millones de pesos' },
            'Perf':{ 'nombre':'Perforaciones', 'unidades':'Número' },
            'Qg': { 'nombre':'Producción de gas', 'unidades':'MMPCD' },
            'Qo':{ 'nombre':'Producción de aceite', 'unidades':'MBD' },
            'RMA':{ 'nombre':'Reparaciones mayores', 'unidades':'Número' },
            'Term': { 'nombre':'Terminaciones', 'unidades':'Número' },
            'Inv': { 'nombre':'Inversión', 'unidades':'Millones de pesos'},
            'AD_SIS_2D_KM': { 'nombre':'Adquisición sísmica 2D', 'unidades':'KM' },
            'AD_SIS_3D_KM2': { 'nombre':'Adquisición sísmica 3D', 'unidades':'KM<sup>2</sup>' },
            'ELECTROMAG': { 'nombre':'Electromagneticos', 'unidades':'Número' },
            'ESTUDIOS': { 'nombre':'Estudios', 'unidades':'Número' },
            'INV_MMPESOS': { 'nombre':'Inversión', 'unidades':'Millones de pesos' },
            'POZOS': { 'nombre':'Pozos', 'unidades':'Número' },
            'PROCESADO_KM': { 'nombre':'Procesado (km)', 'unidades':'KM' },
            'PROCESADO_KM2': { 'nombre':'Procesado (km<sup>2</sup>)', 'unidades':'KM<sup>2</sup>' }
        };


        function table_(config,a) {

              var data = typeof(config.data) == 'string' ? JSON.parse(config.data) : config.data;
              var sel = $('#botonera_' + config.id + ">option:selected").attr('id');
              var sel_data = data.filter((d) => d.concepto == sel);

              if(a) {
                    sel_data = _.sortBy(sel_data,(d) => d.concepto).filter((d) => d.valor);
                    var rows = sel_data.map((d) => {
                      var str_ = '<tr style="width:100%;">'+
                                    '<td style="width:50%;padding:0px;">'+ d.anio +'</td>'+
                                    '<td style="width:50%;padding:0px;">'+ d.valor.toLocaleString('es-MX') +'</td>'+
                                 '</tr>'
                      return str_;
                    }).join('');
              }
              else {
                    sel_data = _.sortBy(sel_data,(d) => d.concepto).filter((d) => d.valor);

                    var rows = sel_data.map((d) => {
                      var str_ = '<tr style="width:100%;">'+
                                    '<td style="width:50%;padding:0px;">'+ d.anio +'</td>'+
                                    '<td style="width:50%;padding:0px;">'+ d.valor.toLocaleString('es-MX') +'</td>'+
                                 '</tr>'
                      return str_;
                    }).join('');
              }

              var t = '<div style="width:100%;">' +
                        '<table style="width:100%;table-layout:fixed;" align="center">' +
                          '<tbody>'+
                            '<tr style="border-bottom:1px solid '+ config.color +';color:'+ config.color +'">' +
                              '<td>Año</td><td>'+ nombres[sel].unidades +'</td>' +
                            '</tr>' +
                          '</tbody>' +

                       '</table>' +
                      '</div>' +
                      '<div style="width:100%;overlfow:auto;">' +
                        '<table style="width:100%;table-layout:fixed;">' +
                          '<tbody>' +
                            rows +
                          '</tbody>' +
                        '</tbody>' +
                      '</div>'

              $('#CMT_' + config.id).html(t)

        };


        function apartado(config,a) {

                if(a) {
                      var ww = '100'
                      var hh = '50'
                      var disp ='table-row'
                } else {
                      var ww = '50'
                      var hh = '100'
                      var disp = 'table-cell'
                }

                var data = typeof(config.data) == 'string' ? JSON.parse(config.data) : config.data;
                data = clean_(data)
                data = _.sortBy(data,(d) => d.concepto);

                var conceptos = _.uniq(data.map((d) => d.concepto));
                var anios = _.uniq(data.map((d) => d.anio));

                var str__ = '<div style="width:100%; height:100%; display:table; table-layout:fixed">' +
                              '<div style="width:100%;height:20%; ">'+
                                  '<div style="height:50%;width:100%;font-weight:800;color:' + config.color + ';">' + config.titulo + '</div>' +
                                  '<div style="height:10%;width:100%;font-size:13px;font-weight:300;">Compromiso mínimo en:&emsp;'+
                                    '<select id="botonera_'+ config.id +'" style="font-weight:700;color:'+ config.color +';">'
                                        + conceptos.map((d) => '<option id="'+ d +'">'+ nombres[d]['nombre'] +'</option>') +
                                    '</select>'+
                                  '</div>' +
                              '</div>' +
                              '<div style="width:100%;height:80%;">'+

                                  '<div style="width:100%;height:100%;display:table;">' +
                                    '<div style="width:'+ww+'%;height:'+hh+'%;display:'+disp+';vertical-align:top;">'+
                                        '<div style="display:table;width:100%;height:100%;">'+
                                          '<div style="width:100%;height:100%;" class="cmt_table" id="CMT_'+ config.id +'"></div>' +
                                        '</div>'+
                                    '</div>' +
                                    '<div style="width:'+ww+'%;height:'+hh+'%;display:'+disp+';">'+
                                        '<div style="width:100%;height:100%;display:table;">'+
                                          '<div style="width:100%;height:100%;" id="barcmt_'+ config.id +'"></div>' +
                                        '</div>'
                                    '</div>' +
                                  '</div>' +

                              '</div>' +

                            '</div>';

                return str__;
        };

        function barplot_cmt(config,a) {
               var data = typeof(config.data) == 'string' ? JSON.parse(config.data) : config.data;
               var sel = $('select#botonera_'+ config.id +'>option:selected').attr('id');

               if(a) {
                 data = data.filter((f) => f.concepto == sel)
                            .map((d) => [d.anio,d.valor])
                            .filter((f) => f[1]);
               }
               else {
                 data = data.filter((f) => f.concepto == sel)
                            .map((d) => [d.anio,d.valor])
                            .filter((f) => f[1]);
               }


               data = [
                 {
                   data:data,
                   color:config.color
                 }
               ];


               var plot = new BarChart({
                 where:'barcmt_' + config.id,
                 chart: { type:'column' },
                 noRange:1,
                 opposite:true,
                 title:'',
                 xAxis: {
                   categories: data[0].data.map((d) => String(d[0]))
                 },
                 hideLegend:true
                 //tooltip: '<div></div>'
               });

               grapher(plot.plot,data,(d) => d)
        };

        // ----------------- AGREGAR FRAME QUE INCLUYE BOTONES TIPO RADIO --------------------
        var visor_config = {
          'name':'cmt',
          'title':'Compromiso mínimo de trabajo',
          'options': [
              { 'value':'ext', 'text':' Extracción' },
              { 'value':'exp', 'text':' Exploración' }
            ],
          'height':80
        };

        var visor = frameVisor_withRadios(visor_config)

        //$('#visor').html(visor);

        // ----------------- AGREGAR FRAME QUE INCLUYE BOTONES TIPO RADIO --------------------


        if(agregados && tipoDisponible.length == 2) {

              var division = '<div style="width:100%;height:100%;display:table;">' +
                                '<div id="exp" style="width:100%;height:50%;border-bottom:1px solid gray;"></div>' +
                                '<div id="ext" style="width:100%;height:50%;"></div>' +
                             '</div>';

              $('#visor').html(division);

              var config = [
                {
                  'titulo':'Extracción',
                  'color':'rgb(70,130,180)',
                  'id':'ext',
                  'data':data['ext']
                },
                {
                  'titulo':'Exploración',
                  'color':'rgb(0,128,129)',
                  'id':'exp',
                  'data':data['exp']
                }
              ]

              config.forEach((d) => {
                $('#visor #' + d.id).html(apartado(d));
                table_(d);
                barplot_cmt(d);

              });


              $('#botonera_ext,#botonera_exp').on('change',function() {
                var id = $(this).attr('id').split('_')[1];
                var conf = config.filter(function(d) { return d.id == id })
                table_(conf[0])
                barplot_cmt(conf[0])
              });

        } else if(!agregados || tipoDisponible.length == 1){
              console.log('agregados: ',agregados)
              console.log('tipoDisponible: ', tipoDisponible)

              if(!tipoDisponible.length) {
/*
                    var cpts = _.uniq(data.map((d) => d.concepto));

                    var nonZeroConcepts = cpts.map((d) => {
                            return data.filter((f) => f.concepto == d)
                                       .map((m) => m.valores)
                                       .every((e) => e == 0) ? null : d;
                    }).filter((f) => f);


                    data = data.filter((f) => {
                            return nonZeroConcepts.some((s) => s == f.concepto);
                    });
*/

                    data = clean_(data);

                    data = _.sortBy(data,(d) => d.concepto);
                    console.log(data)
              } else {
                    data = JSON.parse(data[tipoDisponible[0]]);

                    data = clean_(data)
                    data = _.sortBy(data,(d) => d.concepto);
                    console.log(data)
              }

              console.log(data)

              var division = '<div style="width:100%;height:100%;display:table;">' +
                                '<div id="x_asig" style="width:100%;height:100%;"></div>' +
                             '</div>';


              var config_ops = {
                  'titulo': {
                    'ext':'Extracción',
                    'exp':'Exploración'
                  },
                  'color': {
                    'ext':'rgb(70,130,180)',
                    'exp':'rgb(0,128,129)'
                  }
              };


              var config = {
                'titulo': !tipoDisponible.length ? 'Compromiso mínimo' : config_ops.titulo[tipoDisponible[0]],
                'id':'x_asig',
                'color': !tipoDisponible.length ? 'purple' : config_ops.color[tipoDisponible[0]],
                'data':typeof(data) == 'string' ? JSON.stringify(data) : data
              };
console.log(config)
              $('#visor').html(division)
              $('#visor #x_asig').html(apartado(config,true))
              table_(config,true)
              barplot_cmt(config,true)

              $('#botonera_x_asig').on('change',function() {
                var id = $(this).attr('id')//.split('_')[1];
                console.log(id)
                //var conf = config.filter(function(d) { return d.id == id })
                table_(config,true)
                barplot_cmt(config,true)
              })
        }

};


function RowPlot(data) {
  this.data = data;

  this.table = () => {

      this.data = this.data.map((d) => {
        var anio = d.anio;

        var keys = Object.keys(d).map((k) => {
            var obj = {}
            obj['anio'] = anio;
            obj['concepto'] = k;
            obj['val'] = d[k];
            return obj;
        }).filter((f) => {
            return typeof(f.val) != 'string';
        });

        return keys;
      });

      this.data = _.flatten(this.data);

      this.data = _(this.data).chain()
                    .sortBy(function(d) { return d.concepto; })
                    .sortBy(function(d) { return d.anio; })
                    .value();

      this.data.forEach(function(d) {
        if(d.concepto.match(/procesado_km2/)) d.concepto = '_procesado_km2';
      })

      var conceptos = _.uniq(this.data.map((d) => d.concepto.split('_real')[0] ));

      this.data = conceptos
                    .map((d) => {
                        return this.data.filter((f) => {
                            var str = f.concepto;
                            var patt = new RegExp('^' + d);
                            return patt.test(str);
                        });
                    });

        this.data = this.data.filter((d) => d.some((e) => e.val));

        var conceptos_dict = {
          'electromag':'Electromagnéticos',
          'estudios':'Estudios',
          'inv_mmpesos':'Inversión (MM de pesos)',
          'pozos':'Pozos',
          'procesado_km':'Longuitud procesada (km)',
          '_procesado_km2':'Área procesada (km<sup>2</sup>)',
          'sis_2d':'Sísmica 2D',
          'sis_3d':'Sísmica 3D'
        }

        var tab = '<div id="visor_table" style="width:100%;height:100%;">' +
                    '<div id="visor_header" style="width:100%;height:15%;border-top:1px solid black;border-bottom:1px solid black;display:table;"></div>' +
                    '<div id="visor_content" style="width:100%;height:85%;display:table;"></div>' +
                  '</div>';

        $('#visor').html(tab);

        d3.select('#visor_header')
          .selectAll('div')
          .data(['Concepto','Compromiso Mínimo de Trabajo','Avance a la Fecha','Avance (%)'])
          .enter()
          .append('div')
          .style({
            'width':'25%',
            'height':'100%',
            'display':'table-cell',
            'vertical-align':'middle',
            'text-align':'center',
            'font-weight':'600'
          })
          .html(function(d) {return d});

        var visor = d3.select('#visor_content')


        visor.selectAll('div')
             .data(this.data)
             .enter()
             .append('div')
          .style({
            'width':'100%',
            'height': () => 100 / this.data.length + '%',
            'display':'table-row'
          })
          .each(function(d,j) {

                let concepto = d[0].concepto;
                //var hh = 100 /  this.data.length + '%';
                var cells_style = [
                    ['display','table-cell'],
                    ['width','25%'],
                    //['height',],
                    ['border-bottom','1px solid silver'],
                    ['vertical-align','middle'],
                    ['font-size','11px']
                ];


                cells_style = cells_style.map(function(d) { return d.join(':'); }).join(';');

                var cells = ['concepto','cmt','avance','avance_pct'].map((d,i) => {
                        var cont = i == 0 ? conceptos_dict[concepto] : '';
                        return '<div id="' + d + '_' + j + '" style="' + cells_style + '">' + cont + '</div>';
                }).join('');

                $(this).html(cells);


                var original = d.filter(function(d) {
                  var patt = new RegExp('real')
                  return !patt.test(d.concepto);
                });

                var real = d.filter(function(d) {
                  var patt = new RegExp('real')
                  return patt.test(d.concepto);
                });


                var cmtPlot = new BarChart({
                  title:'',
                  subtitle:'',
                  yAxis: null,
                  where:'cmt_' + j,
                  chart: {
                    type:'column',
                    margin:[5,5,5,5]
                  },
                  noRange:1,
                  hideLegend:true,
                  xAxis: {
                    categories:original.map((d) => d.anio),
                    labels:{
                      enabled:false
                    },
                    tickWidth:0
                  }
                });

                var avancePlot = new BarChart({
                  title:'',
                  subtitle:'',
                  where:'avance_' + j,
                  yMax: d3.max(original.map((d) => d.val)),
                  chart: {
                    type:'column',
                    margin:[5,5,5,5]
                  },
                  noRange:1,
                  hideLegend:true,
                  xAxis: {
                    categories:real.map((d) => d.anio),
                    labels:{
                      enabled:false
                    },
                    tickWidth:0
                  }
                });

                var avanceMeter = new ProgressMeter({
                  where:'avance_pct_' + j,
                  data: +(( d3.sum(real.map((d) => d.val)) / d3.sum(original.map((d) => d.val)) ) * 100).toFixed(1),
                  margin:[0,0,0,0]
                })

                cmtPlot.plot([{ data:original.map((d) => d.val) }],(data) => data);
                avancePlot.plot([{ data:real.map((d) => d.val), color:'purple' }],(data) => data);
                avanceMeter.plot();

          });

  }


};


var ProgressMeter = function(config) {
        this.plot = function() {
          Highcharts.chart(config.where,
           {
            credits:false,
            exporting: {
                 enabled:false
            },
            chart: {
                type: 'solidgauge',
                margin:config.margin
            },
            title: null,
            pane: {
                center: ['50%', '85%'],
                size: '140%',
                startAngle: -90,
                endAngle: 90,
                background: {
                    backgroundColor: (Highcharts.theme && Highcharts.theme.background2) || '#EEE',
                    innerRadius: '60%',
                    outerRadius: '100%',
                    shape: 'arc'
                }
            },
            tooltip: {
                enabled: false
            },
            // the value axis
            yAxis: {
                stops: [
                    [0.1, '#55BF3B'], // green
                    [0.5, '#DDDF0D'], // yellow
                    [0.9, '#DF5353'] // red
                ],
                lineWidth: 0,
                minorTickInterval: null,
                tickAmount: 0,
                title: {
                    y: 110
                },
                labels: {
                    enabled:false,
                    y: null
                }
            },
            plotOptions: {
                solidgauge: {
                    dataLabels: {
                        y: 5,
                        borderWidth: 0,
                        useHTML: true
                    }
                }
            },
            yAxis: {
                min: 0,
                max: 100,
            },
            credits: {
                enabled: false
            },
            series: [{
                name: 'Avance',
                data: [config.data],
                dataLabels: {
                    format: '<div style="text-align:center"><span style="font-size:1.9em;color:' +
                        ((Highcharts.theme && Highcharts.theme.contrastTextColor) || 'black') + '">{y}%</span><br/>'
                },
                tooltip: {
                    valueSuffix: ' %'
                }
            }]
      })
    }
};


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



function seguimiento(data) {
  var agregados = Object.keys(data).every((d) => !+d) //? true : false;
  var tipoDisponible = agregados ? Object.keys(data).map((d) => data[d].length ? d : null).filter((f) => f) : [];

  console.log('Agregados: ',agregados)
  console.log('Tipo disponible: ',tipoDisponible)
  console.log(data)

  var conceptos_traduccion = {
      Qo: 'Producción de aceite',
      Qg: 'Producción de gas',
      Perf_Des: 'Perforaciones - Desarrollo',
      Perf_Iny: 'Perforaciones - Inyecciones',
      Term_Des: 'Terminaciones - Desarrollo',
      Term_Iny: 'Terminaciones - Inyecciones',
      RMA: 'Reparaciones Mayores',
      RME: 'Reparaciones Menores',
      Tap: 'Taponamientos',
      Inv: 'Inversión',
      G_Op: 'Gastos de Operación',
      Np: 'Producción acumulada de aceite',
      Gp: 'Producción acumulada de gas',
      QgHC: 'Producción de gas hidrocarburo'
  };


  var visor_config = {
    'name':'seg',
    'title':'Seguimiento',
    'options': [
        { 'value':'ext', 'text':' Extracción' },
        { 'value':'exp', 'text':' Exploración' }
      ],
    'height':80
  };

  var visor = frameVisor_withRadios(visor_config);

  $('#visor').html(visor);
  $('input[type=radio]')[1].disabled = true;
  $($('input[type=radio]')[1]).parent().css('color','lightGray')

  $('input[type=radio]').each(function(i,d) {
      $(this).parent().css('padding',0)
      if(i == 0) $(this).parent().css('padding-right','15px')
  });

  // Si es de extracción tomar en cuenta el gas hidrocarburo en el seguimiento
  if(data.ext) {
    if(data.ext.length > 0) {
          data.ext.forEach(function(d,i){
              data.ext[i].valor = +data.ext[i].valor.toFixed(1);

              if(d.concepto == 'QgHC') {
                  data.ext[i].concepto = 'Qg'
              }

          });
    }
  }


  if(tipoDisponible.length > 0) {
    tipoDisponible.some((s) => s == 'ext') ? draw(data,'ext') : noDato();
    //draw(data,'ext')
  } else {

    var tipo_ = Object.keys(data[0]).some((s) => s == 'anio') ? 'ext' : 'exp';
    tipo_ == 'ext' ? draw(data) : noDato();
  }

  function draw(data,type) {
         if(type) {
            data = data[type]
         } else {

         }

         var anios = _.sortBy(_.uniq(data.map(function(d) { return String(d.anio); })));
         var tipo_obs = _.uniq(data.map(function(d) { return d.tipo_observacion; }));
         var conceptos = _.uniq(data.map(function(d) { return d.concepto }));
      //console.log(conceptos,data,tipo_obs)


         // Esto filtra los conceptos que no tienen valores igual a cero.
         conceptos = conceptos.map((d) => data.filter((f) => f.concepto == d).some((e) => e.valor))
                                              .map((m,i) => m ? conceptos[i] : m)
                                              .filter((f) => f)


         var c_ = conceptos.map(function(d) { return '<option style="font-size:12px" id='+d+'>' + conceptos_traduccion[d] + '</option>'; });

         var str =
         "<div style='width:100%;height:100%;'>"+
           "<div style='width:100%;height:30px;display:table;text-align:center;'>" +
              "<select id='botonera'>"
                  + c_ +"</select>&ensp;<input id='acumulado' type='checkbox'></input>&nbsp;Acumulado</div>" +
           "<div style='width:100%; height:calc(100% - 30px)'>" +
              "<div id='one' style='width:100%;height:50%;'></div>" +
              "<div id='two' style='width:100%;'></div>" +
           "</div>" +
         "</div>"

         $('#visor_chart').html(str);


         $('#botonera').on('change',function() {
               ff = processedData();

               chart.series[0].setName($('#botonera>option:selected').text() + ' - Plan');
               chart.series[1].setName($('#botonera>option:selected').text() + ' - Real');

               if($('#acumulado:checked')[0]) {
                   var ff_acum = JSON.parse(JSON.stringify(ff));

                   ff_acum.map((f) => {
                     f.forEach((d,i) => {
                         if(i > 0) {
                           f[i].valor = f[i-1].valor + f[i].valor
                         }
                     });
                     return f;
                   });

                   var max = d3.max( ff_acum.map((d) => d3.max(d.map((d) => d.valor))) );
                   chart.yAxis[0].setExtremes(0,max);

                   chart.series[0].setData(ff_acum[0].map((d) => d.valor ));
                   chart.series[1].setData(ff_acum[1].map((d) => d.valor ));
                   chart.series[0].update({type:'area'});
                   chart.series[1].update({type:'area'});

                   updateTable(ff_acum)
               } else {
                   chart.series[0].setData(ff[0].map(function(d) { return d.valor; }).filter((f) => f))
                   chart.series[1].setData(ff[1].map(function(d) { return d.valor; }))

                   var max = d3.max( ff.map((d) => d3.max(d.map((d) => d.valor))) );
                   chart.yAxis[0].setExtremes(0,max);
                   //chart.yAxis[1].setExtremes(0,yAxis_max);
                   chart.series[0].update({type:'column'});
                   chart.series[1].update({type:'column'});

                   updateTable(ff)
               };

         });

         function updateTable(ff) {
                 var filas = ff[0].map(function(d,i) {
                   var str = '<tr width="100%;">'+
                                '<td style="width:33.33%;">'+ d.anio +'</td>'+
                                '<td style="width:33.33%;">'+ (+d.valor.toFixed(1)).toLocaleString('es-MX') +'</td>'+
                                '<td style="width:33.33%;" id=a_'+ d.anio +'>'+ ' - ' +'</td>'
                             '</tr>'

                   return str;
                 }).join('');

                 var table_container = '<div style="height:30px;width:100%;">'+
                                        '<table style="width:calc(100% - 8px);height:100%;table-layout:fixed;">'+
                                          '<tbody style="width:100%;">'+
                                            '<tr style="width:100%;font-weight:600;text-align:center;border-bottom:1px solid gray;border-top:1px solid gray;">' +
                                              '<td>AÑO</td>' +
                                              '<td>PLAN</td>' +
                                              '<td>REAL</td>' +
                                            '</tr>' +
                                          '</tbody>' +
                                        '</table>';
                                       '</div>';

                 var tabla = //table_container +
                  '<div id="scroll_table_" style="width:100%;height:calc(' + $('#one').css('height') + ' - 30px);overflow:auto;border-bottom:1px solid gray;">' +
                    '<table style="width:100%;,table-layout:fixed;">' +
                    /*'<thead>' +
                     '<tr style="font-weight:600;text-align:center;border-bottom:1px solid gray;border-top:1px solid gray;">' +
                        '<td>AÑO</td>'+
                        '<td>PLAN</td>'+
                        '<td>REAL</td>' +
                     '</tr>' +
                    '</thead>' +
                    */
                      '<tbody id="filas_" style="text-align:center;">' +
                      filas +
                      '</tbody>'
                    '</table>'+
                  '</div>';

                 var div_table = '<div style="width:100%;height:100%;">'+
                                    table_container +
                                    tabla +
                                 '</div>'

                 $('#two').html(div_table);

                 ff[1].forEach(function(d) {
                   $('#a_' + d.anio).text((+d.valor.toFixed(1)).toLocaleString('es-MX'))
                 });
        };

      // -------
         function processedData() {
                 var op_id = $('#botonera>option:selected').attr('id');

                 var ff = tipo_obs.map(function(d) {
                     return data.filter(function(f) {
                       return f.tipo_observacion == d && f.concepto == op_id;
                     })
                 });

                 ff[0] = _.sortBy(ff[0], (d) => d.anio).filter((d) => d.valor)

                 return ff;
          };

          var ff = processedData()

          updateTable(ff)

         $('#acumulado').on('change',function() {
                 if(this.checked) {
                         var ff_acum = JSON.parse(JSON.stringify(ff));

                         ff_acum.map((f) => {
                             f.forEach((d,i) => {
                                 if(i > 0) {
                                   f[i].valor = f[i-1].valor + f[i].valor
                                 }
                             });
                             return f;
                         });



                         var max = d3.max( ff_acum.map((d) => d3.max(d.map((d) => d.valor))) );
                         chart.yAxis[0].setExtremes(0,max);

                         chart.series[0].setData(ff_acum[0].map((d) => d.valor ));
                         chart.series[1].setData(ff_acum[1].map((d) => d.valor ));
                         chart.series[0].update({type:'area'});
                         chart.series[1].update({type:'area'});

                         updateTable(ff_acum)

                 } else {

                         var max = d3.max( ff.map((d) => d3.max(d.map((d) => d.valor))) );
                         chart.yAxis[0].setExtremes(0,max);

                         chart.series[0].setData(ff[0].map((d) => d.valor ));
                         chart.series[1].setData(ff[1].map((d) => d.valor ));
                         chart.series[0].update({type:'column'});
                         chart.series[1].update({type:'column'});

                         updateTable(ff)
                 }

         });

         var chart = Highcharts.chart('one', {
                          chart: {
                              type: 'column'
                          },
                          credits: { enabled:false },
                          title: {
                              text: ''
                          },
                          subtitle:{
                            text:'Actividad Planeada vs Real'
                          },
                          xAxis: {
                              categories: anios//['1998','1999','2000']
                          },
                          yAxis: {
                              tickInterval:2,
                              min: 0,
                              title: {
                                  text: ''
                              },
                              max: d3.max( ff.map((d) => d3.max(d.map((d) => d.valor))) ) //d3.max(ff[0].map(function(d) { return d.valor; })) > d3.max(ff[1].map(function(d) { return d.valor; })) ?
                                //d3.max(ff[0].map(function(d) { return d.valor; })) : d3.max(ff[1].map(function(d) { return d.valor; }))
                          },
                          legend: {
                              shadow: false
                          },
                          tooltip: {
                              shared: true
                          },
                          plotOptions: {
                              series: {
                                marker: {
                                  enabled:false
                                }
                              },
                              column: {
                                  grouping: false,
                                  shadow: false,
                                  borderWidth: 0
                              }
                          },
                          series: [{
                              name: $('#botonera>option:selected').text() + ' - Plan',
                              color: 'rgba(13,180,190,0.6)',
                              data: ff[0].map(function(d) { return d.valor; }),
                              pointPadding: 0.3,
                              pointPlacement: -0.2
                          }, {
                              name: $('#botonera>option:selected').text() + ' - Real',
                              color: 'rgba(126,86,134,.9)',
                              data: ff[1].map(function(d) { return d.valor; }),
                              pointPadding: 0.4,
                              pointPlacement: -0.2
                          }]
          });

    }

}

function aprovechamiento(data) {

    var obj_data = {}

    obj_data['produccion'] = data.produccion.map((d) => {
       var obj = [d.fecha,+d.gas_mmpcd.toFixed(1)];
       return obj;
    });

    obj_data['aprovechamiento'] = data.aprovechamiento.map((d) => {
      var obj = [d.fecha,+d.valor.toFixed(1)];
      return obj;
    });

    obj_data['produccion'] = obj_data['produccion'].filter((d) => {
      return obj_data.aprovechamiento.map((e) => e[0]).some((s) => s == d[0])
    });

    Highcharts.chart('visor', {
        credits:{ enabled:false },
        chart: {
            zoomType: 'x'
        },
        title: {
            text: 'Aprovechamiento de gas',
            style: {
              'font-family':'Open Sans',
              'font-size':'2em',
              'font-weight':800
            }
        },
        subtitle: {
            text: null//document.ontouchstart === undefined ?
                    //'Click and drag in the plot area to zoom in' : 'Pinch the chart to zoom in'
        },
        xAxis: {
            type: 'datetime'
        },
        yAxis: {
            title: {
                text: 'MMPCD'
            }
        },
        legend: {
            enabled: true
        },
        tooltip: {
          //useHTML:true,
          shared:true,
          split:false,
       },
        series: [{
            type: 'area',
            name: 'Gas producido (MMPCD)',
            data: _.sortBy(obj_data.produccion,function(d) { return d[0] }),
            lineWidth: 1,
            //lineColor: 'rgba(46, 112, 138, 1)',
            color:'rgba(13, 180, 190, 1)',
            marker: {
              enabled:false
            },
            fillColor: {
                linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
                stops: [
                    [0, 'rgba(13, 180, 190, 1)'],
                    [1, 'rgba(13, 180, 190, .25)']
                ]
            },
        },
        {
            type: 'area',
            name: 'Gas no aprovechado (MMPCD)',
            data: _.sortBy(obj_data.aprovechamiento,function(d) { return d[0] }),
            lineWidth: 2,
            lineColor: 'white',
            color:'rgba(46, 112, 138, 1)',
            marker: {
              enabled:false
            },
            fillColor: {
                linearGradient: {x1: 0, y1: 0, x2: 0, y2: 1},
                stops: [
                    [0, 'rgba(46, 112, 138, 1)'],
                    [1, 'rgba(46, 112, 138, .7)']
                ]
            }
        }

      ]
});

};



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
};



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
};



function frameVisor_withRadios(config) {

        var options = config.options.map((d,i) => {
          var style = 'style="display:table-cell;padding-right:1%;"'
          var checked = i === 0 ? ' checked' : '';
          var element =
            '<div ' + style + '>' +
              '<input type="radio" name="'+ config.radio_names +'" value="'+ d.value +'"'+ checked +'>'+ d.text +'</input>' +
            '</div>';

          return element;
        }).join('');

        var panel_height = 80;
        var visor = "<div style='width:100%;height:100%;'>" +
                      "<div style='width:100%;height:"+ config.height +"px;' id='visor_panel'>"+
                        "<div style='text-align:center;'>" +
                          "<div style='display:inline-block;'>" +
                            "<div style='font-weight:800;font-size:2em;'>" + config.title + "</div>" +

                              "<div style='display:inline-block;'>" +
                                "<div style='display:table;'>" +

                                    options +

                                "</div>" +
                              "</div>" +

                          "</div>" +
                        "</div>" +
                      "</div>" +
                      "<div style='width:100%;height:calc(100% - "+ config.height +"px);' id='visor_chart'></div>" +
                    "</div>";

        return visor;
};
