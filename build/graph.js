
function DatosGrales(data)  {

  var grales = data.grales;//JSON.parse(JSON.stringify(data.grales));
  var params = ['cuenca','ubicacion','tipo','asignacion'].map(function(d) { return [d.toUpperCase(),$('.' + d + '>option:selected').text()]})

  params = params.filter(function(f) { return f[1].slice(0,3) != 'Tod' });

  params.forEach(function(p) {
    grales = grales.filter(function(d) { return d[p[0]] == p[1] })
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
  var numOnomSize = ASIG_ != 'Todas' ? 1.4 : 3;
  var subtNumOnom = ASIG_ != 'Todas' ? ASIG_.split(' - ')[1] : 'ASIGNACIONES VIGENTES';

  var order_colors = [
    'rgb(13,180,190)',
    'rgb(13,150,190)',
    'rgb(46,112,138)',
    'rgb(20,70,110)',
    'rgb(20,50,90)'
  ];

  d3.select('div#row_a>div#col_1')
  .html(function(d) {

    var tipos_ = _.uniq(grales.map(function (d) { return d.TIPO }))
      .map(function (d) {
        let obj = {};
        obj['num'] = grales.filter(function(g) { return g.TIPO == d }).length;
        obj['tipo'] = d;

        return obj;
      });

    tipos_ = _.sortBy(tipos_,function(d) { return -d.num })
              .map(function(d,i) {
                return '<div class="lista_tipo_asig" style="color:'+ order_colors[i] +'">'+
                          '<div style="width:2em;text-align:right;display:table-cell;">'+ d.num +'</div>'+
                          '<div style="padding-left:0.8em;display:table-cell;">'+ d.tipo +'</div>'+
                        '</div>'
              }).join('');

    var tipos_asigs = "<div style='display:inline-block;text-align:center;'><div style='display:text-align:center;table-cell;vertical-align:middle;'>"+ tipos_ +"</div></div>";

    var _tipo_ = "";
    var color = "";
    var un_tipoAsig = "<div>" + _tipo_ + "</div>";


    if(ASIG_ != 'Todas') {

        var tipo_asig_temp = data.grales.filter(function(f) { return f.NOMBRE == ASIG_ })[0].TIPO;

        if(ASIG_.split('-')[0] == 'A') {
            color = 'rgb(13,180,190)';
        } else if(ASIG_.split('-')[0] == 'AE') {
            color = 'rgb(46,112,138)';
        } else {
            color = 'rgb(20,50,90)';
        }
        un_tipoAsig = '<div style="color:'+color+';font-size:2em;font-weight:700;">' + tipo_asig_temp + '</div>'
    } else {
        un_tipoAsig = tipos_asigs;
    }


    return "<div style='width:100%;height:100%;background-color:white;position:relative;display:table;table-layout:fixed;'>" +
              "<div style='display:table-row;width:100%;height:50%;text-align:center;table-layout:fixed;position:relative;'>" +
                  "<div style='display:table-cell;position:relative;vertical-align:middle;'>" +
                      "<div style='width:100%;height:100%;border-right:1px solid gray;display:table;'> " +
                          "<div style='display:table-cell;vertical-align:middle;'>" +
                              "<div style='font-size:"+ numOnomSize +"em;font-weight:800;color:rgb(13,180,190);'>" + numOnom + "</div>" +
                              "<div class='dato_duro_subt subt_plus'>"+ subtNumOnom +"</div>" +
                              "<div class='dato_duro_subt subt_plus' style='color:gray;'>"+
                                    data.last_update['Datos generales'].toLowerCase() +
                              "</div>" +
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

    var grales_ = ASIG_ != 'Todas' ? data.grales.filter(function(d) { return d.NOMBRE == ASIG_ }) : grales;

    var n_campos_reservas = _.uniq(_.flatten(grales_.map(function(d) { return d.CAMPOS_CON_RESERVAS ? d.CAMPOS_CON_RESERVAS.split(';') : null })))
                             .filter(function(f) { return f }).length;

    var seg = _.sortBy(data.ajaxData.seguimiento.ext,function(d) { return d.anio; }).filter(function(f) { return f.tipo_observacion == 'Real' });

    var anio_extent = d3.extent(seg.filter(function(f) { return f.concepto == 'G_Op' }).map(function(d) { return d.anio })).join(' - ');

    var gop = Number(d3.sum(seg.filter(function(f) { return f.concepto == 'G_Op' }).map(function(d) { return d.valor })).toFixed(0)).toLocaleString('es-MX');


    return "<div style='width:100%;height:100%;background-color:white;position:relative;display:table;table-layout:fixed;'>" +
              "<div style='display:table-row;width:100%;height:50%;text-align:center;table-layout:fixed;position:relative;'>" +
                  "<div style='display:table-cell;position:relative;vertical-align:middle;'>" +
                      "<div style='display:table;width:100%;height:100%;'>" +
                          "<div style='display:table-cell;vertical-align:middle;color:white;color:"+colors_[0]+"'>" +
                              "<div class='dato_duro'>"+ n_campos_reservas +"</div>" +
                              "<div class='dato_duro_subt'>campos con reservas</div>" +
                          "</div>" +
                      "</div>" +
                  "</div>" +
              "</div>" +
              "<div style='display:table-row;width:100%;height:50%;text-align:center;table-layout:fixed;position:relative;'>" +
                  "<div style='display:table-cell;position:relative;vertical-align:middle;'>" +
                      "<div style='display:table;width:100%;height:100%;'>" +
                          "<div style='display:table-cell;vertical-align:middle;color:white;color:"+colors_[1]+"'>" +
                              "<div class='dato_duro'>"+ gop +"</div>" +
                              "<div class='dato_duro_subt'>millones de pesos</div>" +
                              "<div class='dato_duro_subt subt_plus' style='font-weight:400;color:"+ colors_[4] +"'>GASTOS DE OPERACIÓN</div>" +
                              "<div class='dato_duro_subt subt_plus' style='font-weight:400;color:"+ colors_[4] +"'>("+ anio_extent +")</div>" +
                          "</div>" +
                      "</div>" +
                  "</div>" +
              "</div>" +
          "</div>"
  })

  d3.select('div#row_a>div#col_3')
  .html(function(d) {

    var grales_ = ASIG_ != 'Todas' ? data.grales.filter(function(d) { return d.NOMBRE == ASIG_ }) : grales;

    var agregados = Object.keys(data.ajaxData.seguimiento).every(function(d) { return !+d }) && Object.keys(data.ajaxData.seguimiento).length > 0;
    var seg = data.ajaxData.seguimiento;


    if(agregados) {

          var anio_extent = d3.extent(seg['ext'].filter(function(f) { return new RegExp(/^I(n|N)/).test(f.concepto) && f.tipo_observacion == 'Real' }).map(function(d) { return d.anio }));
          anio_extent = anio_extent.join(' - ');

          var inv = Object.keys(seg).map(function(d) {
              var inv_ = seg[d].filter(function(f) { return new RegExp(/^I(n|N)/).test(f.concepto) && f.tipo_observacion == 'Real' });
              inv_ = inv_.map(function(d) { return d.valor });

              return d3.sum(inv_);
          });

          inv = d3.sum(inv);

    } else {
          var anio_extent = d3.extent(seg.filter(function(f) { return new RegExp(/^I(n|N)/).test(f.concepto) && f.tipo_observacion == 'Real' }).map(function(d) { return d.anio }));
          anio_extent = anio_extent.join(' - ');

          var inv = seg.filter(function(f) { return new RegExp(/^I(n|N)/).test(f.concepto) && f.tipo_observacion == 'Real' })
             .map(function(d) { return d.valor });

          inv = d3.sum(inv);
    }

    //var seg = _.sortBy(data.ajaxData.seguimiento.ext,function(d) { return d.anio; }).filter((f) => f.tipo_observacion == 'Real');
    //seg = ASIG_ != 'Todas' ? seg.filter((f) => new RegExp(ASIG_,f)) : '';

    //var inv = d3.sum(seg.filter((f) => f.concepto == 'Inv').map((d) => d.valor));

    return "<div style='width:100%;height:100%;background-color:white;position:relative;display:table;table-layout:fixed;'>" +
              "<div style='display:table-row;width:100%;height:50%;text-align:center;table-layout:fixed;position:relative;'>" +
                  "<div style='display:table-cell;position:relative;vertical-align:middle;'>" +
                      "<div style='display:table;width:100%;height:100%;'>" +
                          "<div style='display:table-cell;vertical-align:middle;color:white;color:"+colors_[2]+"'>" +
                              "<div class='dato_duro'>"+ Number((d3.sum(grales_.map(function(d) { return d.SUPERFICIE_KM2 }))).toFixed(0)).toLocaleString('es-MX') +"</div>" +
                              "<div class='dato_duro_subt'>kilómetros<sup>2</sup></div>" +
                          "</div>" +
                      "</div>" +
                  "</div>" +
              "</div>" +
              "<div style='display:table-row;width:100%;height:50%;text-align:center;table-layout:fixed;position:relative;'>" +
                  "<div style='display:table-cell;position:relative;vertical-align:middle;'>" +
                      "<div style='display:table;width:100%;height:100%;'>" +
                          "<div style='display:table-cell;vertical-align:middle;color:white;color:" + colors_[3] + "'>" +
                              "<div class='dato_duro'>"+ Number(inv.toFixed(0)).toLocaleString('es-MX') +"</div>" +
                              "<div class='dato_duro_subt'> millones de pesos</div>" +
                              "<div class='dato_duro_subt subt_plus' style='font-weight:400;color:"+ colors_[5] + ";'>INVERSIÓN TOTAL EJERCIDA</div>" +
                              "<div class='dato_duro_subt subt_plus' style='font-weight:400;color:"+ colors_[5] +";'>("+ anio_extent +")</div>" +
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
        var f = new Date(ts).toISOString();
        var mes = +f.split('-')[1]-1//String(f.getMonth() + 1);
        var anio = +f.split('-')[0]//.getFullYear(ts)
        var ff = new Date(anio,mes)
        var mes = String(ff.getMonth() +1)
        var anio = ff.getFullYear();
        return meses[mes].toLowerCase() + ' - ' + anio;
      }

      var _aceite_ = data.ajaxData.produccion.length > 0 ? (+prod.aceite_mbd.toFixed(0)).toLocaleString('es-MX') : 0;
      var _gas_ = data.ajaxData.produccion.length > 0 ? (+prod.gas_mmpcd.toFixed(0)).toLocaleString('es-MX') : 0;
      var _fecha_ = data.ajaxData.produccion.length > 0 ? fechA(prod.fecha) : '-';

      return "<div style='width:100%;height:100%;position:relative;display:table;table-layout:fixed;'>" +
                "<div style='display:table-row;width:100%;height:50%;text-align:center;table-layout:fixed;position:relative;'>" +
                    "<div style='width:100%;display:table-cell;position:relative;vertical-align:middle;'>" +
                        "<div style='display:table;width:100%;height:100%;'>" +
                            "<div style='width:100%;display:table-cell;vertical-align:middle;'>" +
                                "<div class='titulo_cuadro' style='margin:0px;color:"+colors_[0]+"'>PRODUCCIÓN</div>" +
                                "<div class='subtitulo_cuadro' style='color:"+colors_[0]+"'>"+ _fecha_ +"</div>" +

                                "<div style='width:100%;text-align:center;margin:0px;'>" +
                                  "<div style='display:inline-block;'>" +

                                      "<div class='dato_cuadro'>" +
                                          "<div style='display:table-row;'>" +
                                              "<div style='display:table-cell;text-align:right;'><span style='font-weight:600;font-size:0.5em;'>ACEITE&emsp;</span></div>" +
                                              "<div style='display:table-cell;text-align:center;'>"+ _aceite_ +"</div>" +
                                              "<div style='display:table-cell;text-align:left;'><span style='font-weight:300;font-size:0.4em;'>&ensp;MBD</span></div>" +
                                          "</div>" +
                                          "<div style='display:table-row;'>" +
                                              "<div style='display:table-cell;text-align:right;'><span style='font-weight:600;font-size:0.5em;'>GAS&emsp;</span></div>" +
                                              "<div style='display:table-cell;text-align:center;'>"+ _gas_ +"</div>" +
                                              "<div style='display:table-cell;text-align:left;'><span style='font-weight:300;font-size:0.4em;'>&ensp;MMPCD</span></div>" +
                                          "</div>" +
                                      "</div>" +

                                   "</div>" +
                                "</div>" +

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

        var resv_ = resv_.filter(function(f) { return f.fecha == resv.fecha });
        var _fecha_ = data.ajaxData.reservas.length > 0 ? +(new Date(resv.fecha).getFullYear()) + 1 : '-';

        function filas(str_) {
          var _pce_ = data.ajaxData.reservas.length > 0 ? (+resv_.filter(function(f) { return f.tipo == str_ })[0].rr_pce_mmbpce.toFixed(0)).toLocaleString('es-MX') : '0';
          var _aceite_ = data.ajaxData.reservas.length > 0 ? (+resv_.filter(function(f) { return f.tipo == str_ })[0].rr_aceite_mmb.toFixed(0)).toLocaleString('es-MX') : '0';
          var _gas_ = data.ajaxData.reservas.length > 0 ? (+resv_.filter(function(f) { return f.tipo == str_ })[0].rr_gas_natural_mmmpc.toFixed(0)).toLocaleString('es-MX') : '0';


          var style = "display:table-cell;text-align:right;padding:5px;"
          var ff =
          "<div style='border-right:0px solid rgba(255,255,255,.3);"+ style +"font-weight:400;font-size:.9em;color:"+colors_[2]+"'>"+ str_.toUpperCase() + "&ensp;</div>"+
          "<div style='"+ style +"border-right:1px solid rgba(255,255,255,.3);'>"+
            _pce_ +
          "</div>" +
          "<div style='"+ style +"border-right:1px solid rgba(255,255,255,.3);'>"+
             _aceite_ +
          "</div>" +
          "<div style='"+ style +"border-right:0px solid rgba(255,255,255,.3);'>"+
             _gas_ +
          "</div>" //+
          //"<div style='"+ style +"font-weight:400;font-size:.8em;color:"+colors_[2]+"'>"+ str_.toUpperCase() + "</div>"

          return ff;
        }

        return "<div style='width:100%;height:100%;position:relative;display:table;table-layout:fixed;'>" +
                  "<div style='display:table-row;width:100%;height:50%;text-align:center;table-layout:fixed;position:relative;'>" +
                      "<div style='display:table-cell;position:relative;vertical-align:middle;'>" +
                          "<div style='display:table;width:100%;height:100%;'>" +
                              "<div style='display:table-cell;vertical-align:middle;'>" +
                                  "<div class='titulo_cuadro' style='padding:2px;color:"+colors_[2]+"'>RESERVAS</div>" +
                                  "<div class='subtitulo_cuadro' style='color:"+colors_[2]+"'>enero - "
                                              + _fecha_ +"</div>" +

                                  "<div style='text-align:center;'>" +
                                    "<div style='padding:2px;display:inline-block;'>" +

                                        "<div style='margin-right:1.5em;margin-top:.8em;display:table;font-weight:800;font-size:0.8em;'>" +
                                            "<div style='display:table-row;text-align:center;font-weight:400;color:"+colors_[2]+"'>" +
                                                "<div style='display:table-cell;text-align:center;'>"+ '' +"</div>" +
                                                "<div style='display:table-cell;text-align:center;'>"+ 'PCE' +"</div>" +
                                                "<div style='display:table-cell;text-align:center;'>"+ 'ACEITE' +"</div>" +
                                                "<div style='display:table-cell;text-align:center;'>"+ 'GAS' +"</div>" +
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
                                                  "<div style='display:table-cell;text-align:center;'>"+ '' +"</div>" +
                                                  "<div style='display:table-cell;text-align:center;'>"+ 'MMB' +"</div>" +
                                                  "<div style='display:table-cell;text-align:center;'>"+ 'MMB' +"</div>" +
                                                  "<div style='display:table-cell;text-align:center;'>"+ 'MMMPC' +"</div>" +
                                            "</div>" +
                                        "</div>" +

                                     "</div>" +
                                  "</div>" +

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
            var chart = Highcharts.StockChart('visor_chart', {
                exporting: {
                  enabled:true,
                  filename:'datos',
                  buttons: {
                    contextButton:{
                      menuItems: [
                        {
                          textKey:'downloadCSV',
                          onclick:function() { descargarDatos(data) }
                        }
                      ],
                      symbol:'url(download.svg)',
                      symbolX:19,
                      symbolY:18
                    }
                  }
                },
                legend: {
                  enabled:false
                },
                navigator: {
                  enabled:false
                },
                xAxis: {
                  labels:{
                    style:{
                      fontSize:'0.9em'
                    }
                  }
                },
                yAxis: [
                  {
                    title:{
                      text:'Gas (mmpcd)',
                      style:{
                        fontSize:'0.9em',
                        color:'red'
                      }
                    },
                    opposite:true,
                    labels: {
                      align:'left',
                      format: '{value:,.0f}',
                      style: {
                        fontSize:'0.9em'
                        //color:'red'
                      }
                    }
                  },
                  {
                    title: {
                      text:'Aceite (mbd)',
                      style: {
                        fontSize:'0.9em',
                        color:'green'
                      }
                    },
                    opposite:false,
                    labels: {
                      format: '{value:,.0f}',
                      style:{
                        fontSize:'0.9em'
                        //color:'green'
                      }
                    }
                  }
                ],
                credits:false,

                rangeSelector: {
                    enabled:true
                },
                title: {
                    text: '',
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
                                          + '<b style="color:'+ d.color +'">' + d.hidrocarburo + ':</b> ' + Number(d.valor.toFixed(1)).toLocaleString('es-MX') +
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
                                            var isoDate = new Date(d[config.x]).toISOString().split('-');
                                            var isoYear = isoDate[0];
                                            var isoMonth = +isoDate[1] - 1;
                                            var date_ = new Date(isoYear,isoMonth);

                                            var type = {
                                                'nombre': d[config.nombre],
                                                'id': d[config.id],
                                                'x': String(d[config.x]).length == '4' ? new Date(d[config.x],0).getTime() : date_.getTime(),//d[config.x],
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


function BarChart(config,pozos) {
      // Los parámetros de este prototipo pueden cambiar el título, orientación de las barras y demás.
      this.plot = function(data,fn,reservas) {
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
                exporting: {
                  enabled:true,
                  filename:'datos',

                  buttons: {
                    contextButton:{
                      menuItems: [
                        {
                        textKey:'downloadCSV',
                        onclick:function() { descargarDatos(reservas) }
                        }
                      ],
                      symbol:'url(download.svg)',
                      symbolX:19,
                      symbolY:18
                    }
                  }

                },
                credits:false,
                chart: config.chart,
                title: {
                    text: config.title
                },
                subtitle: {
                    text:config.subtitle,
                    style: {
                      fontSize:'0.9em'
                    }
                },
                yAxis: {
                    opposite:config.opposite,
                    title:{
                      text:config.yAxis,
                      style:{
                        fontSize:'0.8em'
                      }
                    },
                    gridLineWidth:0,
                    max: config.yMax ? config.yMax : null,
                    stackLabels: {
                      style: {
                        fontSize:'1em',
                        fontFamily:'Open Sans'
                      },
                      enabled:config.stackLabels,
                      formatter:function() {
                        var result = Number(this.total.toFixed(1)).toLocaleString('es-MX');
                        return result;
                      }
                    },
                    labels: {
                      format: '{value:,.0f}',
                      style: {
                        fontSize:'1em'
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
                    pointFormat:'{value:,.0f}',
                    borderColor:'transparent',
                    formatter: function() {
                      var str;

                      if(!config.tooltip) {
                            str = "<div><b>" +
                                          parseDate(this.x) + "</b>:<br> " +
                                          this.points.map(function(d) {
                                            var content = "  <span style=\"font-weight:700;color:"+d.color+"\">&nbsp;&bull;" + d.key + ": " + Number((d.y).toFixed(1)).toLocaleString('es-MX') + "</span>";
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
                .filter(function(f) { return !new RegExp(/^Tod/).test(f[1]) });


  if(selects.length > 0) {
        var obj = {};

        for(var k in selects) {
            var key = selects[k][0];
            var val = selects[k][1];
            key = key == 'ASIGNACION' ? 'NOMBRE' : key;
            obj[key] = val;
        }

        Object.keys(obj).forEach(function(key) {
            data = data.filter(function(f) { return f[key] == obj[key] })
        });

  };

  data = _.sortBy(data,function(d) { return d.NOMBRE });

  var filas = data.map(function(d,i) {

    var prefijo = d.NOMBRE.split(' - ')[0];

    if(d.NOMBRE.split(' - ')[1] == 'Campo Bacal') {
      prefijo += '_'
    }

    var str = '<tr width="100%;" class="hover_doc" style="margin:15px;font-size:0.8em;">'+
                 '<td style="font-weight:600;padding:5px;width:50%;">'+ d.NOMBRE +'</td>'+
                 '<td style="padding:5px;width:50%;">'+
                    //'<a href="http://localhost:8081/'+d.NOMBRE.split(' - ')[0]+'.pdf" target="_blank" class="hover_hand">'+
                      '<div id="doc_black"><img style="max-height:35px;font-weight:600;" src="doc_black.png"></img>&emsp;Título</div>' +
                      '<div id="doc_purple"><a href="https://asignaciones.energia.gob.mx/_doc/publico/Asignaciones/'+ prefijo +'.pdf" target="_blank" class="hover_hand"><img style="max-height:35px;font-weight:600;" src="doc_purple.png"></img><span>&emsp;Título</span></a></div>' +
                    //'</a>'+
                 '</td>' +
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
   '<div id="scroll_table_" style="width:100%;height:calc(' + $('#visor').css('height') + ' - 90px - '+
                            $('#filtro_cont').css('height') +');overflow:auto;border-bottom:1px solid gray;">' +
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

  var visor_config = {
    'name':'doc',
    'title':'Documentos asociados',
    'options': [
        { 'value':'ext', 'text':' Extracción' },
        { 'value':'exp', 'text':' Exploración' }
      ],
    'height':'60px'
  };

  frameVisor_withRadios(visor_config)

  //$('#visor').html(visor);

  $('input[type=radio]').each(function() {
      $(this).parent().css('display','none')
  })

  $('#visor_chart').html(div_table)
  $('#visor_holder').parent()
      //.append('<div id="filtro_cont" style="top:calc(100% - 120px);width:60%; height:110px; background-color:rgba(0,0,0,0.8);position:absolute;"></div>');

  $('#filtro_cont').css('border')

  $('#filtro_cont input').on('input',function(d) {

      var val = $('#filtro_cont input').val();
      /*
      var tds = document.querySelectorAll('tr.hover_doc>td:first-child')
      tds = Array.prototype.slice.call(tds).map((d) => $(d).text());

      tds = tds.filter((f) => !(new RegExp(val,'i').test(f)));

      $('tr.hover_doc').css('display','table-row')

      var a_l = $('tr.hover_doc').filter((i,f) => {
          return tds.some((s) => s == $(f).children(':first').text())
      }).css('display','none')
      */
      function noAccents(str) {
        var str_ = str//.toLowerCase();

        str_=str_.replace(/á/ig,'a')
            .replace(/é/ig,'e')
            .replace(/í/ig,'i')
            .replace(/ó/ig,'o')
            .replace(/ú/ig,'u')

        return str_
      }

      //val = noAccents(val)

      var text = val.split(' ');

      patts = [];

   		text.forEach(function(d) {
        //var ss = noAccents(d);
   			var rx = new RegExp(d,'i');
   			patts.push(rx);
   		})

      var filas = Array.prototype.slice.call(document.querySelectorAll('tr.hover_doc td:first-child'))
          .map(function(d) {
            var st = $(d).text();
            //st = noAccents(st)
            return st;
          })

      var str_
  		function regexCheck(patt) {
  			return patt.test(str_);
  		}

      var matches = filas.filter(function(f) {
        str_ = f;
        return !patts.every(regexCheck)
      });

      //console.log(matches)

      $('tr.hover_doc').css('display','table-row')

      var a_l = $('tr.hover_doc').filter(function(i,f) {
          return matches.some(function(s) { return s == $(f).children(':first').text() });
      }).css('display','none')


  });
}




function CMT(data) {
        var data_descarga = JSON.parse(JSON.stringify(data));

        function clean_(data) {

            var a = _.uniq(data.map(function(d) { return d.concepto }))
                     .map(function(d) {
                            return data.filter(function(f) { return f.concepto == d })
                              .map(function(d) { return d.valor })
                              .every(function(d) { return d }) ? d : null;
                    }).filter(function(f) { return f });

            return data.filter(function(f) { return a.some(function(d) {return d == f.concepto }) });

        };


        var agregados = Object.keys(data).every(function(d) { return !+d }) //? true : false;
        var tipoDisponible = agregados ? Object.keys(data).map(function(d) { return JSON.parse(data[d]).length ? d : null }).filter(function(f) { return f }) : [];

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
            'PROCESADO_KM': { 'nombre':'Procesamiento sísimica 2D', 'unidades':'KM' },
            'PROCESADO_KM2': { 'nombre':'Procesamiento sísmica 3D', 'unidades':'KM<sup>2</sup>' }
        };


        function table_(config,a) {

              var data = typeof(config.data) == 'string' ? JSON.parse(config.data) : config.data;
              var sel = $('#botonera_' + config.id + ">option:selected").attr('id');
              var sel_data = data.filter(function(d) { return d.concepto == sel });

              if(a) {
                    sel_data = _.sortBy(sel_data,function(d) { return d.concepto }).filter(function(d) { return d.valor });
                    var rows = sel_data.map(function(d) {
                      var str_ = '<tr style="width:100%;">'+
                                    '<td style="width:50%;padding:0px;">'+ d.anio +'</td>'+
                                    '<td style="width:50%;padding:0px;">'+ d.valor.toLocaleString('es-MX') +'</td>'+
                                 '</tr>'
                      return str_;
                    }).join('');
              }
              else {
                    sel_data = _.sortBy(sel_data,function(d) { return d.concepto }).filter(function(d) { return d.valor });

                    var rows = sel_data.map(function(d) {
                      var str_ = '<tr style="width:100%;">'+
                                    '<td style="width:50%;padding:0px;">'+ d.anio +'</td>'+
                                    '<td style="width:50%;padding:0px;">'+ Number(d.valor.toFixed(1)).toLocaleString('es-MX',{ minimumFractionDigits:1 }) +'</td>'+
                                 '</tr>'

                      return str_;
                    }).join('');
              }

              var t = '<div style="width:100%;">' +
                        '<table style="width:100%;table-layout:fixed;font-size:0.8em;" align="center">' +
                          '<tbody>'+
                            '<tr style="border-bottom:1px solid '+ config.color +';color:'+ config.color +'">' +
                              '<td>Año</td><td>'+ nombres[sel].unidades +'</td>' +
                            '</tr>' +
                          '</tbody>' +
                       '</table>' +
                      '</div>' +
                      '<div style="width:100%;overlfow:auto;">' +
                        '<table style="width:100%;table-layout:fixed;font-size:0.7em;">' +
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

                //data = clean_(data);

                data = _.sortBy(data,function(d) { return d.concepto });

                var conceptos = _.uniq(data.map(function(d) { return d.concepto }));

                var anios = _.uniq(data.map(function(d) { return d.anio }));

                var str__ = '<div style="width:100%; height:100%; display:table; table-layout:fixed">' +
                              '<div style="width:100%;height:20%; ">'+
                                  '<div style="font-size:0.8em;height:50%;width:100%;font-weight:800;color:' + config.color + ';">' + config.titulo + '</div>' +
                                  '<div style="height:10%;width:100%;font-size:13px;font-weight:300;">'+
                                    '<select id="botonera_'+ config.id +'" style="font-weight:700;font-size:0.8em;color:'+ config.color +';">'
                                        + conceptos.map(function(d) { return '<option id="'+ d +'">'+ nombres[d]['nombre'] +'</option>' }) +
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

        function barplot_cmt(config,a,data_descarga) {
               var data = typeof(config.data) == 'string' ? JSON.parse(config.data) : config.data;
               var sel = $('select#botonera_'+ config.id +'>option:selected').attr('id');

               if(a) {
                 data = data.filter(function(f) { return f.concepto == sel })
                            .map(function(d) { return [d.anio,d.valor] })
                            .filter(function(f) { return f[1] });
               }
               else {
                 data = data.filter(function(f) { return f.concepto == sel })
                            .map(function(d) { return [d.anio,d.valor] })
                            .filter(function(f) { return f[1] });
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
                 opposite:false,
                 title:'',
                 xAxis: {
                   categories: data[0].data.map(function(d) { return String(d[0]) }),
                   labels: {
                     style: {
                       fontSize:'0.8em'
                     }
                   }
                 },
                 hideLegend:true,
                 tooltip: "'<div style=\"font-weight:300;font-family:Open Sans;text-align:center;\">'+" +
                             "'<span style=\"font-weight:800;\">' + this.x + '</span><br>'+ Number(this.y.toFixed(1)).toLocaleString('es-MX') +" +
                          "'</div>'"
               });

               //grapher(plot.plot,data,function(d) { return d })
               plot.plot(data,function(d) { return d; },data_descarga)
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

        frameVisor_withRadios(visor_config)

        //$('#visor').html(visor);
        $('#visor_panel').css('height','auto');

        $('input[type=radio]').each(function() {
            $(this).parent().css('display','none')
        })

        // ----------------- AGREGAR FRAME QUE INCLUYE BOTONES TIPO RADIO --------------------


        if(agregados && tipoDisponible.length == 2) {

              var division = '<div style="width:100%;height:100%;display:table;">' +
                                '<div id="exp" style="width:100%;height:50%;border-bottom:1px solid gray;"></div>' +
                                '<div id="ext" style="width:100%;height:50%;"></div>' +
                             '</div>';

              $('#visor_chart').html(division);

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

              config.forEach(function(d) {
                $('#visor #' + d.id).html(apartado(d));
                table_(d);
                barplot_cmt(d,null,data_descarga);

              });


              $('#botonera_ext,#botonera_exp').on('change',function() {
                var id = $(this).attr('id').split('_')[1];
                var conf = config.filter(function(d) { return d.id == id })
                table_(conf[0])
                barplot_cmt(conf[0],null,data_descarga)
              });

        } else if(!agregados || tipoDisponible.length == 1){

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

                    //data = clean_(data);

                    data = _.sortBy(data,function(d) { return d.concepto });

              } else {
                    data = JSON.parse(data[tipoDisponible[0]]);

                    //data = clean_(data)
                    data = _.sortBy(data,function(d) { return d.concepto });

              }

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
                'titulo': !tipoDisponible.length ? '' : config_ops.titulo[tipoDisponible[0]],
                'id':'x_asig',
                'color': !tipoDisponible.length ? 'purple' : config_ops.color[tipoDisponible[0]],
                'data':typeof(data) == 'string' ? JSON.stringify(data) : data
              };

              $('#visor_chart').html(division)
              $('#visor #x_asig').html(apartado(config,true))
              table_(config,true)
              barplot_cmt(config,true,data_descarga)

              $('#botonera_x_asig').on('change',function() {
                var id = $(this).attr('id')//.split('_')[1];
                //var conf = config.filter(function(d) { return d.id == id })
                table_(config,true)
                barplot_cmt(config,true,data_descarga)
              })
        }

};


function RowPlot(data) {
  this.data = data;

  this.table = function() {

      this.data = this.data.map(function(d) {
        var anio = d.anio;

        var keys = Object.keys(d).map(function(k) {
            var obj = {}
            obj['anio'] = anio;
            obj['concepto'] = k;
            obj['val'] = d[k];
            return obj;
        }).filter(function(f) {
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

      var conceptos = _.uniq(this.data.map(function(d) { return d.concepto.split('_real')[0] }));

      this.data = conceptos
                    .map(function(d) {
                        return this.data.filter(function(f) {
                            var str = f.concepto;
                            var patt = new RegExp('^' + d);
                            return patt.test(str);
                        });
                    });

        this.data = this.data.filter(function(d) { return d.some(function(e) { return e.val }) });

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
            'height': function() { return 100 / this.data.length + '%' },
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

                var cells = ['concepto','cmt','avance','avance_pct'].map(function(d,i) {
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
                    categories:original.map(function(d) { return d.anio }),
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
                  yMax: d3.max(original.map(function(d) { return d.val })),
                  chart: {
                    type:'column',
                    margin:[5,5,5,5]
                  },
                  noRange:1,
                  hideLegend:true,
                  xAxis: {
                    categories:real.map(function(d) { return d.anio }),
                    labels:{
                      enabled:false
                    },
                    tickWidth:0
                  }
                });

                var avanceMeter = new ProgressMeter({
                  where:'avance_pct_' + j,
                  data: +(( d3.sum(real.map(function(d) { return d.val })) / d3.sum(original.map(function(d) { return d.val })) ) * 100).toFixed(1),
                  margin:[0,0,0,0]
                })

                cmtPlot.plot([{ data:original.map(function(d) { return d.val }) }],function(data) { return data });
                avancePlot.plot([{ data:real.map(function(d) { return d.val }), color:'purple' }], function(data) { return data });
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


function dashboard(data,place) {
   var str =
   "<div style='width:100%;height:100%;'>"+
        "<div id='inv_barchart' style='width:100%;height:70%;'>"+
        "</div>" +
        "<div id='inv_tabla' style='width:100%;height:30%;margin-top:2%;'></div>" +
   "</div>"

   $(place).html(str);
}



function seguimiento(data,tipo_) {

  var agregados = Object.keys(data).every(function(d) { return !+d }) //? true : false;
  var tipoDisponible = agregados ? Object.keys(data).map(function(d) { return data[d].length ? d : null }).filter(function(f) { return f }) : [];

  var conceptos_traduccion = {
      Qo: 'Producción de aceite',
      Qg: 'Producción de gas',
      Perf_Des: 'Perforaciones - Desarrollo',
      Perf_Iny: 'Perforaciones - Inyectores',
      Term_Des: 'Terminaciones - Desarrollo',
      Term_Iny: 'Terminaciones - Inyectores',
      RMA: 'Reparaciones Mayores',
      RME: 'Reparaciones Menores',
      Tap: 'Taponamientos',
      Inv: 'Inversión',
      G_Op: 'Gastos de Operación',
      Np: 'Producción acumulada de aceite',
      Gp: 'Producción acumulada de gas',
      QgHC: 'Producción de gas hidrocarburo',
      AD_SIS_2D_KM: 'Adquisición sísmica 2D',
      AD_SIS_3D_KM2: 'Adquisición sísmica 3D',
      ELECTROMAG: 'Electromagnéticos',
      ESTUDIOS:'Estudios',
      INV_MMPESOS:'Inversión',
      POZOS:'Pozos',
      PROCESADO_KM:'Procesamiento sísmica 2D',
      PROCESADO_KM2:'Procesamiento sísmica 3D'
  };

  var conceptos_unidades = {
      Qo: 'Miles de barriles diarios',
      Qg: 'Millones de pies cúbicos diarios',
      Perf_Des: 'Número de pozos',
      Perf_Iny: 'Número de pozos',
      Term_Des: 'Número de pozos',
      Term_Iny: 'Número de pozos',
      RMA: 'Número de reparaciones',
      RME: 'Número de reparaciones',
      Tap: 'Número de taponamientos',
      Inv: 'Millones de pesos',
      G_Op: 'Millones de pesos',
      Np: '',
      Gp: '',
      QgHC: 'Millones de pies cúbicos diarios',
      AD_SIS_2D_KM: 'Kilómetros',
      AD_SIS_3D_KM2: 'Kilómetros cuadrados',
      ELECTROMAG: 'Número de estudios',
      ESTUDIOS:'Número de estudios',
      INV_MMPESOS:'Millones de pesos',
      POZOS:'Número de pozos',
      PROCESADO_KM:'Kilómetros',
      PROCESADO_KM2:'Kilómetros cuadrados'
  };

  var conditional_title = tipo_ == 'inv' ? 'inversión' : 'actividad';
  var visor_config = {
    'radio_names':'seg',
    'title':'Seguimiento de ' + conditional_title,
    'options': [
        { 'value':'ext', 'text':' Plan de extracción' },
        { 'value':'exp', 'text':' Plan de exploración' }
      ],
    'height':95
  };

  frameVisor_withRadios(visor_config);

  //$('#visor').html(visor);
  $('input[type=radio]').attr('disabled',true);

  $('input[type=radio]').each(function(i,d) {
      $(this).parent().css('color','lightGray')
      $(this).parent().css('padding',0)
      if(i == 0) $(this).parent().css('padding-right','15px')
  });


// MANEJAR TODA LA LÓGICA DE SEGUIMIENTO SEGÚN EL DATO.
//////////------------------------------------------------------------------------------------
// <-- //-----------------------------------------------------------------------------------
////////-----------------------------------------------------------------------------------
  if(tipoDisponible.length > 0) {

        var sel = $('input[type=radio][value='+ tipoDisponible[0] +']');
        sel.prop('checked',true);

        tipoDisponible.forEach(function(d) {
            var sel = $('input[type=radio][value='+ d +']');
            sel.parent().css('color','black');
            sel.attr('disabled',false);
        })


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

        // Si siempre está disponible la información de extracción, que ésta se visualice primero.
        tipoDisponible.some(function(s) { return s == 'ext' }) ? draw(data,'ext') : draw(data,'exp')//noDato();

        $('input[type=radio][name=seg]').on('change',function() {
              $('#extra_panels').remove();
              //$('#visor_panel').css('height','80px');
              draw(data,this.getAttribute('value'))
        });

  } else {
        // ¿Qué tipo es? Si tenemos anio, entonces se trata de la base de extracción.
        // De lo contrario, es exploración.

        var esExtraccion = _.uniq(data.map(function(d) { return d.concepto })).some(function(s) { return s == 'Qo' });

        if(esExtraccion) {

                data.forEach(function(d,i){
                    data[i].valor = +data[i].valor.toFixed(1);

                    if(d.concepto == 'QgHC') {
                        data[i].concepto = 'Qg'
                    }

                });

        }


        var tipo = _.uniq(data.map(function(d) { return d.concepto; })).some(function(s) {
                var result =

                'AD_SIS_2D_KM' == s ||
                'AD_SIS_3D_KM2' == s ||
                'ELECTROMAG' == s ||
                'ESTUDIOS' == s ||
                'INV_MMPESOS' == s ||
                'POZOS' == s ||
                'PROCESADO_KM' == s ||
                'PROCESADO_KM2' == s

                return result;

        }) ? 'exp' : 'ext';


        var radios = Array.prototype.slice.call(document.querySelectorAll('input[type=radio]'));

        $('input[type=radio]').each(function(i,d) {

            if(this.getAttribute('value') == tipo) {
                  $(this).css('display','none');
                  $(this).parent().css('color','black');
            } else {
                  $(this).parent().css('display','none');
            }

        });

        draw(data);

  }
//////////--------------------------------------------------------------------------------
// <-- //----------------------------------------------------------------------------------
////////------------------------------------------------------------------------------------

  function draw(data,type) {
          var periodos = {
            ' Planes (Escenario base 2018-2019)':'2018 - 2019',
            'Real (2018-2021)':'2018 - 2021',
            'Real (sep 2017 -sep 2018)':'2018 - 2019',
            'Real a septiembre 2018':'2016 - 2019',
            'Total Planes (2016-2019)':'2016 - 2019',
            'Total Planes (2018-2021)':'2018 - 2021'
          };

         if(type) {
                data = data[type]

                if(type == 'exp') {
/*
                        data.forEach((d) => {
                          if(d.periodo) {
                            d.anio = periodos[d.periodo];
                            delete d.periodo;
                          }
                        });

                        data = data.filter((f) => f.anio)

                        var periodos_ = _.sortBy(_.uniq(data.map((d) => d.anio)));

                        $('#visor_panel').css('height','auto');

                        var str_html = '<div id="extra_panels" style="display:table;width:100%;height:auto;text-align:center;padding:1em;">'+
                                          '<div style="font-weight:700;padding:.5em;">Periodos:</div>' +
                                          '<div id="panels_periodos" style="width:100%;display:table;text-align:center;"></div>' +
                                       '</div>';

                        $('#visor_panel').append(str_html);

                        d3.select('#panels_periodos')
                          .selectAll('div')
                        .data(periodos_).enter()
                          .append('div')
                          .style('display','table-cell')
                          .html(function(d,i) {
                            var check = i == 0 ? ' checked' : '';
                            return '<div><input type="radio" name="periodos" value="' + d + '"' + check + '></input> ' + d + '</div>';
                          })
*/
                }

         } else {

                   data.forEach(function(d) {
                       if(d.periodo) {
                           d.anio = periodos[d.periodo];
                           delete d.periodo;
                       }
                   });


         }

         var anios = _.sortBy(_.uniq(data.map(function(d) { return String(d.anio); })));
         var tipo_obs = _.uniq(data.map(function(d) { return d.tipo_observacion; }));
         var conceptos = _.uniq(data.map(function(d) { return d.concepto }));


         function ordenarConceptos(x) {
            var arr = [x]
            var num;
            if( x == 'Perf_Des') num = 1
            if( x == 'Perf_Iny') num = 2
            if( x == 'Term_Des') num = 3
            if( x == 'Term_Iny') num = 4
            if( x == 'RMA') num = 5
            if( x == 'RME') num = 6
            if( x == 'Tap') num = 7
            if( x == 'Qo') num = 8
            if( x == 'Qg') num = 9
            if( x == 'QgHC') num = 10
            if( x == 'Inv') num = 11
            if( x == 'G_Op') num = 12

            if( x == 'POZOS' ) num = 1
            if( x == 'ESTUDIOS' ) num = 2
            if( x == 'AD_SIS_2D_KM' ) num = 3
            if( x == 'AD_SIS_3D_KM2' ) num = 4
            if( x == 'PROCESADO_KM' ) num = 5
            if( x == 'PROCESADO_KM2' ) num = 6
            if( x == 'ELECTROMAG' ) num = 7
            arr.push(num)
            return arr;
         }

         conceptos = _.sortBy(conceptos.map(ordenarConceptos),function(d) { return d[1] })
                      .map(function(d) { return d[0] });

         // Esto filtra los conceptos que no tienen valores igual a cero.
         conceptos = conceptos.map(function(d) { return data.filter(function(f) { return f.concepto == d }).some(function(e) { return e.valor }) })
                                              .map(function(m,i) { return m ? conceptos[i] : m })
                                              .filter(function(f) { return f });

         if( tipo_ == 'inv' ) {
           conceptos = conceptos.filter(function(f) { return f == 'Inv' || f == 'G_Op' || f == 'INV_MMPESOS' })
         } else if ( tipo_ == 'act' ) {
           conceptos = conceptos.filter(function(f) { return f != 'Inv' && f != 'G_Op' && f != 'INV_MMPESOS' })
         }


         var c_ = conceptos.map(function(d) { return '<option style="font-size:0.7em;" id='+d+'>' + conceptos_traduccion[d] + '</option>'; });

         var _input_ = "&ensp;<input id='acumulado' type='checkbox'></input>&nbsp;Acumulado";
         var str =
         "<div style='width:100%;height:100%;'>"+
           "<div style='width:100%;height:30px;display:table;text-align:center;font-size:0.7em;'>" +
              "<select id='botonera'>" + c_ + "</select>" +
              _input_ +
          "</div>" +
           "<div style='width:100%; height:calc(100% - 30px)'>" +
              "<div id='one' style='width:100%;height:60%;'></div>" +
              "<div id='two' style='width:100%;'></div>" +
           "</div>" +
         "</div>"

         $('#visor_chart').html(str);


         // -------
            function processedData() {
                    var op_id = $('#botonera>option:selected').attr('id');

                    var ff = tipo_obs.map(function(d) {
                        return data.filter(function(f) {
                          //var checked = $('input[type=radio][name=periodos]:checked').parent().text()
                          //checked = checked.substr(1,checked.length);
                          //var add_bool = type == 'exp' ? f.anio == checked : true;
                          return f.tipo_observacion == d && f.concepto == op_id //&& add_bool;
                        })
                    });

                    ff[0] = _.sortBy(ff[0], function(d) { return d.anio })
                    ff[1] = _.sortBy(ff[1], function(d) { return d.anio })//.filter((d) => d.valor)

                    return ff;
             };

////////////////////////////////////////////
          var ff = processedData();
          updateTable(ff)
////////////////////////////////////////////

          $('input[name=periodos]').on('change',function() {
              var selText = $(this).parent().text();
              selText = selText.substr(1,selText.length);

              var ff = processedData()
              var max = d3.max( ff.map(function(d) { return d3.max(d.map(function(d) { return d.valor })) }) )

              chart.series[0].setData(ff[0].map(function(d) { return d.valor }));
              chart.series[1].setData(ff[1].map(function(d) { return d.valor }));
              chart.xAxis[0].setCategories([selText]);
              chart.yAxis[0].setExtremes(0,max);

              updateTable(ff)
              //cambiar xAxis
          });

         $('#botonera').on('change',function() {
               ff = processedData();

               chart.series[0].setName('Plan');
               chart.series[1].setName('Real');

               chart.setTitle(null,{ text: conceptos_unidades[$('select#botonera>option:selected').attr('id')] })

               if($('#acumulado:checked')[0]) {
                       var ff_acum = JSON.parse(JSON.stringify(ff));

                       ff_acum.map(function(f) {
                         f.forEach(function(d,i) {
                             if(i > 0) {
                               f[i].valor = f[i-1].valor + f[i].valor
                             }
                         });
                         return f;
                       });

                       var max = d3.max( ff_acum.map(function(d) { return d3.max(d.map(function(d) { return d.valor })) }) );
                       chart.yAxis[0].setExtremes(0,max);

                       chart.series[0].setData(ff_acum[0].map(function(d) { return d.valor }));
                       chart.series[1].setData(ff_acum[1].map(function(d) { return d.valor }));
                       chart.series[0].update({type:'area'});
                       chart.series[1].update({type:'area'});

                       updateTable(ff_acum)
               } else {
                       chart.series[0].setData(ff[0].map(function(d) { return d.valor; }).filter(function (f) { return f }))
                       chart.series[1].setData(ff[1].map(function(d) { return d.valor; }))

                       var max = d3.max( ff.map(function(d) { return d3.max(d.map(function(d) { return d.valor })) }) );
                       chart.yAxis[0].setExtremes(0,max);
                       //chart.yAxis[1].setExtremes(0,yAxis_max);
                       chart.series[0].update({type:'column'});
                       chart.series[1].update({type:'column'});

                       updateTable(ff);
               };

         });

         $('#acumulado').on('change',function() {
                 if(this.checked) {
                         var ff_acum = JSON.parse(JSON.stringify(ff));

                         ff_acum.map(function(f) {
                             f.forEach(function(d,i) {
                                 if(i > 0) {
                                   f[i].valor = f[i-1].valor + f[i].valor
                                 }
                             });
                             return f;
                         });



                         var max = d3.max( ff_acum.map(function(d) { return d3.max(d.map(function(d) { return d.valor })) }) );
                         chart.yAxis[0].setExtremes(0,max);

                         chart.series[0].setData(ff_acum[0].map(function(d) { return d.valor }));
                         chart.series[1].setData(ff_acum[1].map(function(d) { return d.valor }));
                         chart.series[0].update({type:'area'});
                         chart.series[1].update({type:'area'});

                         updateTable(ff_acum)

                 } else {

                         var max = d3.max( ff.map(function(d) { return d3.max(d.map(function(d) { return d.valor })) }) );
                         chart.yAxis[0].setExtremes(0,max);

                         chart.series[0].setData(ff[0].map(function(d) { return d.valor }));
                         chart.series[1].setData(ff[1].map(function(d) { return d.valor }));
                         chart.series[0].update({type:'column'});
                         chart.series[1].update({type:'column'});

                         updateTable(ff)
                 }

         });

         function updateTable(ff) {

                 var filas = ff[0].map(function(d,i) {

                   var id = String(d.anio).split(' ').join('_').replace(/(\(|\)|-)/g,'_')
                   var str = '<tr width="100%;">'+
                                '<td style="width:33.33%;">'+ d.anio +'</td>'+
                                '<td style="width:33.33%;">'+ (+d.valor.toFixed(1)).toLocaleString('es-MX', { minimumFractionDigits:1 }) +'</td>'+
                                '<td style="width:33.33%;" id=a_'+ id +'>'+ ' - ' +'</td>'
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
                  '<div id="scroll_table_" style="width:100%;height:calc(' + +$('#one').css('height').split('px')[0] *.66 + 'px - 30px);overflow:auto;border-bottom:1px solid gray;">' +
                    '<table style="width:100%;,table-layout:fixed;">' +
                    /*'<thead>' +
                     '<tr style="font-weight:600;text-align:center;border-bottom:1px solid gray;border-top:1px solid gray;">' +
                        '<td>AÑO</td>'+
                        '<td>PLAN</td>'+
                        '<td>REAL</td>' +
                     '</tr>' +
                    '</thead>' +
                    */
                      '<tbody id="filas_" style="text-align:center;font-size:0.8em;">' +
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
                   var id = String(d.anio).split(' ').join('_').replace(/(\(|\)|-)/g,'_')
                   $('#a_' + id).text((d.valor ? +d.valor.toFixed(1) : '').toLocaleString('es-MX',{ minimumFractionDigits:1 }))
                 });
        };



         var chart = Highcharts.chart('one', {
                           exporting: {
                             enabled:true,
                             filename:'datos',
                             buttons: {
                               contextButton:{
                                 menuItems: [{
                                   textKey:'downloadCSV',
                                   onclick:function() {
                                     descargarDatos(data)
                                   }
                                 }],
                                 symbol:'url(download.svg)',
                                 symbolX:19,
                                 symbolY:18
                               }
                             }
                           },
                          chart: {
                              type: 'column'
                          },
                          credits: { enabled:false },
                          title: {
                              text: ''
                          },
                          subtitle:{
                            text:conceptos_unidades[$('select#botonera>option:selected').attr('id')]
                          },
                          xAxis: {
                              categories: anios//['1998','1999','2000']
                          },
                          yAxis: {
                              title: {
                                text:'hola'
                              },
                              tickInterval:2,
                              min: 0,
                              title: {
                                  text: ''
                              },
                              max: d3.max( ff.map(function(d) { return d3.max(d.map(function(d) { return d.valor })) }) ) //d3.max(ff[0].map(function(d) { return d.valor; })) > d3.max(ff[1].map(function(d) { return d.valor; })) ?
                                //d3.max(ff[0].map(function(d) { return d.valor; })) : d3.max(ff[1].map(function(d) { return d.valor; }))
                          },
                          legend: {
                              shadow: false
                          },
                          tooltip: {
                              shared: true,
                              borderColor:'transparent'
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
                              name: 'Plan',
                              color: 'rgba(13,180,190,0.6)',
                              data: ff[0].map(function(d) { return d.valor; }),
                              pointPadding: 0.08,
                              pointPlacement: 0
                          }, {
                              name: 'Real',
                              color: 'rgba(126,86,134,.9)',
                              data: ff[1].map(function(d) { return d.valor; }),
                              pointPadding: 0.2,
                              pointPlacement: 0
                          }]
          });

    }; // <-- draw();

};

function aprovechamiento(data) {

    var obj_data = {}

    obj_data['produccion'] = data.produccion.map(function(d) {
       var obj = [d.fecha,+d.gas_mmpcd.toFixed(1)];
       return obj;
    });

    obj_data['aprovechamiento'] = data.aprovechamiento.map(function(d) {
      var obj = [d.fecha,+d.valor.toFixed(1)];
      return obj;
    });

    obj_data['produccion'] = obj_data['produccion'].filter(function(d) {
      return obj_data.aprovechamiento.map(function(e) { return e[0] }).some(function(s) { return s == d[0] })
    });

    var visor_config = {
      'radio_names':'',
      'title':'Aprovechamiento de gas',
      'options':[],
      'height':100
    };

    frameVisor_withRadios(visor_config);
    //$('#visor').html(visor);


    Highcharts.chart('visor_chart', {
        exporting: {
          enabled:true,
          filename:'datos',
          buttons: {
            contextButton:{
              menuItems: [
                {
                textKey:'downloadCSV',
                onclick:function() { descargarDatos(obj_data) }
                }
              ],
              symbol:'url(download.svg)',
              symbolX:19,
              symbolY:18
            }
          }
        },
        credits:{ enabled:false },
        chart: {
            zoomType: 'x'
        },
        title: {
            text: '',
            style: {
              'font-family':'Open Sans',
              'font-size':'2em',
              'font-weight':800
            }
        },
        subtitle: {
            text: 'Millones de pies cúbicos diarios',
            style: {
              fontSize: '0.9em'
            }
        },
        xAxis: {
            type: 'datetime',
            labels: {
              style: {
                fontSize:'1em'
              }
            }
        },
        yAxis: {
            title: {
                text: 'MMPCD',
                style: {
                  fontSize:'1em'
                }
            },
            labels: {
              format: '{value:,.0f}',
              style: {
                fontSize:'1em'
              }
            }
        },
        legend: {
            enabled: true
        },
        tooltip: {
          //useHTML:true,
          shared:true,
          split:false,
          borderColor:'transparent'
       },
        series: [{
            type: 'area',
            name: 'Gas producido',
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
            name: 'Gas no aprovechado',
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


function inversion_aprob(data) {

      var actividades = _.uniq(data.map(function(d) { return d.actividad })).map(function(d,i) {
          var obj = {};
          obj['value'] = 'actividad_' + i;
          obj['text'] = d;
          return obj;
      })

      var visor_config = {
        'name':'inv_aprob',
        'title':'Inversión aprobada',
        'options': actividades,
        'height':80
      };

      frameVisor_withRadios(visor_config);

      //$('#visor').html(visor);
      $('#visor_panel').css('height','auto');
      $('#visor_panel').append('<div style="width:100%;text-align:center;"><select id="inv_select"></select><div>');

      function draw_() {
            let datatemp = JSON.parse(JSON.stringify(data));
            var selectedRadio = $('input[type=radio]:checked');
///////////////////////////////////////////////////////////////////////////////////////////////
// TOTALES POR ACTIVIDAD
///////////////////////////////////////////////////////////////////////////////////////////////
            var data_ = _.uniq(datatemp.map(function(d) { return d.actividad }))
                .map(function(act) {
                  var actividad = datatemp.filter(function(f) { return f.actividad == act });
                  var anios = _.uniq(actividad.map(function(r) { return r.anio }))

                  var anios = anios.map(function(a) {
                    var monto = datatemp.filter(function(f) { return f.anio == a && f.actividad == act })
                              .map(function(d) { return d.monto_usd })

                    monto = d3.sum(monto);

                    var obj = {}
                    obj['anio'] = a;
                    obj['monto_usd'] = monto;
                    obj['sub_actividad'] = 'Total'
                    obj['actividad'] = act
                    return obj;
                  });

                  var obj = {};

                  obj['actividad'] = act;
                  obj['anios'] = anios;

                  return anios;
                });

            var acum = []
            for(var i in data_) {

              acum = acum.concat(data_[i])
            };

            acum = acum.filter(function(f) { return f.actividad == selectedRadio.parent().text() })
            acum = _.sortBy(acum,function(d) { return d.anio })
///////////////////////////////////////////////////////////////////////////////////////////////
// TOTALES POR ACTIVIDAD
///////////////////////////////////////////////////////////////////////////////////////////////
            //data = acum.concat(data)

            var subactividades = datatemp.filter(function(f) { return selectedRadio.parent().text() == f.actividad })
                                      .map(function(d) { return d.sub_actividad });

            var subactividades = ['Total'].concat(_.sortBy(_.uniq(subactividades))).map(function(sub) {
                                       return '<option>' + sub + '</option>';
                                     }).join('');
            datatemp = acum.concat(datatemp)

            $('select#inv_select').html('');
            $('select#inv_select').html(subactividades);

            var radios = document.querySelectorAll('input[type=radio]');

            dashboard(null,'#visor_chart')

            if(radios.length == 1) radios[0].style.display = 'none';

            var data_selected = datatemp.filter(function(f) {
                    let act = selectedRadio.parent().text();
                    let sub = $('select#inv_select>option:selected').text();
                    return act == f.actividad && sub == f.sub_actividad;
            }).map(function(d) { return [d.anio,d.monto_usd] })

            var plot = new BarChart({
              where:'inv_barchart',
              chart: { type:'column' },
              noRange:1,
              opposite:false,
              subtitle:'Dólares',
              xAxis: {
                categories: data_selected.map(function(d) { return String(d[0]) }),//[]//data[0].data.map((d) => String(d[0]))
                labels: {
                  style: {
                    fontSize:'1.2em'
                  }
                }
              },
              hideLegend:true,
              tooltip: "'<div style=\"font-weight:300;font-family:Open Sans;text-align:center;\">'+" +
                          "'<span style=\"font-weight:800;\">' + this.x + '</span><br>$'+ Number(this.y.toFixed(1)).toLocaleString('es-MX') +" +
                       "'</div>'"
            });

            grapher(plot.plot,[{ 'data':data_selected }],function(d) { return d });
            updateTable(data_selected);


            $('select#inv_select').on('change',function() {

                  var data_selected = datatemp.filter(function(f) {
                          let act = selectedRadio.parent().text();
                          let sub = $('select#inv_select>option:selected').text();
                          return act == f.actividad && sub == f.sub_actividad;
                  }).map(function(d) { return [d.anio,d.monto_usd] });

                  var plot = new BarChart({
                    where:'inv_barchart',
                    chart: { type:'column' },
                    noRange:1,
                    opposite:false,
                    subtitle:'Dólares',
                    xAxis: {
                      categories: data_selected.map(function(d) { return String(d[0]) })//[]//data[0].data.map((d) => String(d[0]))
                    },
                    hideLegend:true,
                    tooltip: "'<div style=\"font-weight:300;font-family:Open Sans;text-align:center;\">'+" +
                                    "'<span style=\"font-weight:800;\">' + this.x + '</span><br>$'+ Number(this.y.toFixed(1)).toLocaleString('es-MX') +" +
                             "'</div>'"

                  });

                  grapher(plot.plot,[{ 'data':data_selected }],function(d) { return d });
                  updateTable(data_selected);

            });

      };

      function updateTable(ff) {
              var filas = ff.map(function(d,i) {
                var str = '<tr width="100%;">'+
                             '<td style="width:50%;">'+ d[0] +'</td>'+
                             '<td style="width:50%;">'+ (+d[1].toFixed(0)).toLocaleString('es-MX') +'</td>'+
                          '</tr>'

                return str;
              }).join('');

              var table_container = '<div style="height:30px;width:100%;">'+
                                     '<table style="width:calc(100% - 8px);height:100%;table-layout:fixed;">'+
                                       '<tbody style="width:100%;">'+
                                         '<tr style="width:100%;font-weight:600;text-align:center;border-bottom:1px solid gray;border-top:1px solid gray;">' +
                                           '<td>AÑO</td>' +
                                           '<td>MONTO (dólares)</td>' +
                                         '</tr>' +
                                       '</tbody>' +
                                     '</table>';
                                    '</div>';

              var tabla = //table_container +
               '<div id="scroll_table_" style="width:100%;height:calc(' + $('#one').css('height') + ' - 30px);overflow:auto;border-bottom:1px solid transparent;">' +
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

              $('#inv_tabla').html(div_table);

     };

      draw_();

      $('input[type=radio]').on('change',function() {
          draw_();
      })

}


function frameVisor_withRadios(config) {

        var options = config.options.map(function(d,i) {
          var style = 'style="display:table-cell;padding-right:1%;font-size:.7em;"'
          var checked = i === 0 ? ' checked' : '';
          var element =
            '<div ' + style + '>' +
              '<input type="radio" name="'+ config.radio_names +'" value="'+ d.value +'"'+ checked +'>'+ d.text +'</input>' +
            '</div>';

          return element;
        }).join('');

        config.height = 'auto';
        var visor = "<div style='width:100%;height:100%;'>" +
                      "<div style='width:100%;height:"+ config.height +";' id='visor_panel'>"+
                        "<div style='text-align:center;'>" +
                          "<div style='display:inline-block;'>" +
                            "<div>" +
                              "<div style='font-weight:800;font-size:1em;'>" + config.title + "</div>" +
                              //"<div style='padding:2px;font-weight:300;font-size:1em'>Última actualización: <span id='last_update'></span></div>" +
                            "</div>" +
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

        //return visor;
        $('#visor').html(visor);

        var visorP_height = $('#visor_panel').css('height');
        $('#visor_chart').css('height','calc(100% - '+ visorP_height + ')')
};




function descargarDatos(data) {
        var conceptos_traduccion = {
            Qo: 'Producción de aceite',
            Qg: 'Producción de gas',
            Perf_Des: 'Perforaciones - Desarrollo',
            Perf_Iny: 'Perforaciones - Inyectores',
            Term_Des: 'Terminaciones - Desarrollo',
            Term_Iny: 'Terminaciones - Inyectores',
            RMA: 'Reparaciones Mayores',
            RME: 'Reparaciones Menores',
            Tap: 'Taponamientos',
            Inv: 'Inversión',
            G_Op: 'Gastos de Operación',
            Np: 'Producción acumulada de aceite',
            Gp: 'Producción acumulada de gas',
            QgHC: 'Producción de gas hidrocarburo',
            AD_SIS_2D_KM: 'Adquisición sísmica 2D',
            AD_SIS_3D_KM2: 'Adquisición sísmica 3D',
            ELECTROMAG: 'Electromagnéticos',
            ESTUDIOS:'Estudios',
            INV_MMPESOS:'Inversión',
            POZOS:'Pozos',
            PROCESADO_KM:'Procesamiento sísmica 2D',
            PROCESADO_KM2:'Procesamiento sísmica 3D'
        };

        var conceptos_unidades = {
            Qo: 'Miles de barriles diarios',
            Qg: 'Millones de pies cúbicos diarios',
            Perf_Des: 'Número de pozos',
            Perf_Iny: 'Número de pozos',
            Term_Des: 'Número de pozos',
            Term_Iny: 'Número de pozos',
            RMA: 'Número de reparaciones',
            RME: 'Número de reparaciones',
            Tap: 'Número de taponamientos',
            Inv: 'Millones de pesos',
            G_Op: 'Millones de pesos',
            Np: '',
            Gp: '',
            QgHC: 'Millones de pies cúbicos diarios',
            AD_SIS_2D_KM: 'Kilómetros',
            AD_SIS_3D_KM2: 'Kilómetros cuadrados',
            ELECTROMAG: 'Número de estudios',
            ESTUDIOS:'Número de estudios',
            INV_MMPESOS:'Millones de pesos',
            POZOS:'Número de pozos',
            PROCESADO_KM:'Kilómetros',
            PROCESADO_KM2:'Kilómetros cuadrados'
        };

        var nombres_cmt = {
            'G_Op': { 'nombre':'Gastos de operación', 'unidades':'Millones de pesos' },
            'Perf':{ 'nombre':'Perforaciones', 'unidades':'Número' },
            'Qg': { 'nombre':'Producción de gas', 'unidades':'MMPCD' },
            'Qo':{ 'nombre':'Producción de aceite', 'unidades':'MBD' },
            'RMA':{ 'nombre':'Reparaciones mayores', 'unidades':'Número' },
            'Term': { 'nombre':'Terminaciones', 'unidades':'Número' },
            'Inv': { 'nombre':'Inversión', 'unidades':'Millones de pesos'},
            'AD_SIS_2D_KM': { 'nombre':'Adquisición sísmica 2D', 'unidades':'KM' },
            'AD_SIS_3D_KM2': { 'nombre':'Adquisición sísmica 3D', 'unidades':'KM2' },
            'ELECTROMAG': { 'nombre':'Electromagneticos', 'unidades':'Número' },
            'ESTUDIOS': { 'nombre':'Estudios', 'unidades':'Número' },
            'INV_MMPESOS': { 'nombre':'Inversión', 'unidades':'Millones de pesos' },
            'POZOS': { 'nombre':'Pozos', 'unidades':'Número' },
            'PROCESADO_KM': { 'nombre':'Procesamiento sísimica 2D', 'unidades':'KM' },
            'PROCESADO_KM2': { 'nombre':'Procesamiento sísmica 3D', 'unidades':'KM2' }
        };

        var data = _.sortBy(data,function(d) { return d.fecha });
        var seleccion = $('.selectedButton').attr('id');

        var filtros = ['cuenca','ubicacion','tipo','asignacion'].map(function(d) {
            var texto = $('.' + d + '>option:selected').text().toUpperCase();
            var result = texto.substring(0,3) == 'TOD' ? null : d.toUpperCase() + ': ' + quitarAcentos(texto);
            return result;
        }).filter(function(d) { return d }).join('\n');


        if(seleccion == 'Producción') {
              var arr = [];
              var data = JSON.parse(JSON.stringify(data)).map(function(d) {
                  var obj = {};
                  obj.fecha = d.fecha;
                  obj.aceite_mbd = d.aceite_mbd;
                  obj.gas_mmpcd = d.gas_mmpcd;

                  return obj;
              });

              arr.push(header(seleccion,filtros,'FECHA,ACEITE_MBD,GAS_MMPCD').join('\n'));

              for(var i=0 in data) {
                  var row = [];

                  for(var k in data[i]) {

                      if(k == 'fecha') {
                        var fecha = new Date(data[i][k]);
                        var month = String(fecha.getMonth() + 1);
                        month = month.length == 1 ? '0' + month : month;
                        data[i][k] = month + '/' + fecha.getFullYear();
                      }

                      row.push(data[i][k]);
                  }

                  row = row.join(',');
                  arr.push(row);
              }

              arr = arr.join('\n');
              download(arr,seleccion);



        } else if(seleccion == 'Reservas') {
              var data = JSON.parse(JSON.stringify(data))
              var arr = [];
              arr.push(header(seleccion,filtros,'FECHA,TIPO,PCE_MMBPCE,ACEITE_MMB,GAS_MMBPCE').join('\n'));

              for(var i=0 in data) {
                  var row = [];

                  for(var k in data[i]) {

                      if(k == 'fecha') {
                        //var month = String(data[i][k].getMonth() + 1);
                        //month = month.length == 1 ? '0' + month : month;
                        data[i][k] = new Date(data[i][k]).getFullYear() + 1;

                      } else if(k == 'tipo') {
                        //data[i][k] = data[i][k].toUpperCase();
                      }

                      row.push(data[i][k]);
                  }

                  row = row.join(',');
                  arr.push(row);
              }

              arr = arr.join('\n');
              download(arr,seleccion);


        } else if(seleccion == 'Pozos') {
              var data = JSON.parse(JSON.stringify(data)).filter(function(d) {
                  return [
                    'Perforaciones desarrollo',
                    'Terminaciones desarrollo',
                    'Pozos operando',
                    'Reparaciones menores',
                    'Reparaciones mayores'
                  ].some(function(s) {
                      return d.descriptor == s;
                  })

              })

              data.forEach(function(d) {
                  var fecha = d.fecha.split('-')
                  d.fecha = fecha[1] + '/' + fecha[0]
                  delete d.id;
                  delete d.nombre;
              })

              var data = data.map(function(d) {
                var obj = {};
                obj.fecha = d.fecha;
                obj.descriptor = d.descriptor;
                obj.valor = d.valor;

                return obj;
              })

              var arr = [];
              arr.push(header(seleccion,filtros,'FECHA,CONCEPTO,VALOR').join('\n'));

              for(var i=0 in data) {
                  var row = [];

                  for(var k in data[i]) {
                      row.push(data[i][k]);
                  }

                  row = row.join(',');
                  arr.push(row);
              }

              arr = arr.join('\n');
              download(arr,seleccion);


        } else if(seleccion == 'Seguimiento de inversión') {
              var tipo_plan = $('input[name=seg]:checked').parent().text();

              var data = JSON.parse(JSON.stringify(data))
                            .filter(function(d) {
                                return d.concepto == 'Inv' || d.concepto == 'G_Op' || d.concepto == 'INV_MMPESOS';
                            });

              data = data.map(function(d) {
                var obj = {};
                obj.anio = d.anio;
                obj.concepto = d.concepto;
                obj.valor = d.valor;
                obj.tipo_valor = d.tipo_observacion == 'Plan' ? 'PLANEADO' : 'EJECUTADO';//quitarAcentos(tipo_plan.toUpperCase());
                return obj;
              });

              var arr = [];
              arr.push(header(seleccion,filtros,'FECHA,CONCEPTO,VALOR,TIPO_VALOR,UNIDAD,TIPO_PLAN').join('\n'));


              for(var i=0 in data) {
                  var row = [];

                  data[i].unidades = quitarAcentos(conceptos_unidades[data[i].concepto].toUpperCase());
                  data[i].concepto = quitarAcentos(conceptos_traduccion[data[i].concepto].toUpperCase());
                  data[i].plan = quitarAcentos(tipo_plan.toUpperCase());


                  for(var k in data[i]) {

                      row.push(data[i][k]);
                  }

                  row = row.join(',');
                  arr.push(row);
              }

              arr = arr.join('\n');
              download(arr,seleccion);



        } else if(seleccion == 'Compromiso Mínimo de Trabajo') {
                var columnas;

                if(typeof(data[0]) == 'string') {
                  columnas = 'FECHA,CONCEPTO,VALOR,TIPO,UNIDAD';

                  var data = JSON.parse(JSON.stringify(data))
                      data = data
                                    .map(function(d,i) {
                                        var result = JSON.parse(d);

                                        if(result.length) {
                                            var tipo;

                                            if(i === 0) {
                                                tipo = 'EXTRACCION'
                                            } else {
                                                tipo = 'EXPLORACION'
                                            }

                                            result.forEach(function(e) {
                                                e.tipo = tipo;
                                                e.unidades = quitarAcentos(nombres_cmt[e.concepto].unidades.toUpperCase());
                                                e.concepto = quitarAcentos(nombres_cmt[e.concepto].nombre.toUpperCase());
                                            });

                                        }

                                        return result;

                                    });

                      data = data[0].concat(data[1]);

                } else {
                    columnas = 'FECHA,CONCEPTO,VALOR,UNIDAD';

                    data.forEach(function(d) {
                        //d.tipo = quitarAcentos($('input[type=radio]:checked').parent().text().toUpperCase())
                        d.unidades = quitarAcentos(nombres_cmt[d.concepto].unidades.toUpperCase());
                        d.concepto = quitarAcentos(nombres_cmt[d.concepto].nombre.toUpperCase());
                    })
                };



                var arr = [];
                arr.push(header(seleccion,filtros,columnas).join('\n'));

                for(var i=0 in data) {
                    var row = [];

                    for(var k in data[i]) {

                        row.push(data[i][k]);
                    }

                    row = row.join(',');
                    arr.push(row);
                }

                arr = arr.join('\n');
                download(arr,seleccion);

        } else if(seleccion == 'Aprovechamiento de gas') {
                var data = JSON.parse(JSON.stringify(data))
                data = _.sortBy(data,function(d) { return d[0]; })
                              .map(function(d,i) {

                                    var concepto;

                                    if(i === 0) {
                                        concepto = 'GAS PRODUCIDO';
                                    } else {
                                        concepto = 'GAS NO APROVECHADO';
                                    }

                                    result = d.map(function(e) {
                                        var obj = {}
                                        var fecha = new Date(e[0]);
                                        var mes = String(fecha.getMonth() + 1);
                                        mes = mes.length == 1 ? '0' + mes : mes;
                                        var anio = fecha.getFullYear();

                                        fecha = mes + '/' + anio;

                                        obj.fecha = fecha;
                                        obj.concepto = concepto;
                                        obj.volumen = e[1];

                                        return obj;

                                    });

                                    return result;

                              });

                data = data[0].concat(data[1]);
                data = _.sortBy(data,function(d) { return d.fecha });


                var arr = [];
                arr.push(header(seleccion,filtros,'FECHA,CONCEPTO,MMPCD').join('\n'));

                for(var i=0 in data) {
                    var row = [];

                    for(var k in data[i]) {
                        row.push(data[i][k]);
                    }

                    row = row.join(',');
                    arr.push(row);
                }

                arr = arr.join('\n');
                download(arr,seleccion);

        } else if(seleccion == 'Seguimiento de actividad') {
                var data = JSON.parse(JSON.stringify(data))
                              .filter(function(d) {
                                  return d.concepto != 'Inv' && d.concepto != 'G_Op' && d.concepto != 'INV_MMPESOS';
                              });

                data = data.map(function(d) {
                  var obj = {};
                  obj.anio = d.anio;
                  obj.concepto = d.concepto;
                  obj.valor = d.valor;
                  obj.tipo_valor = d.tipo_observacion == 'Plan' ? 'PLANEADO' : 'EJECUTADO';//quitarAcentos(tipo_plan.toUpperCase());
                  return obj;
                });

                var arr = [];
                arr.push(header(seleccion,filtros,'FECHA,TIPO,VALOR,CONCEPTO,UNIDAD,PLAN').join('\n'));
                var tipo_plan = $('input[name=seg]:checked').parent().text();

                for(var i=0 in data) {
                    var row = [];

                    data[i].unidades = quitarAcentos(conceptos_unidades[data[i].concepto].toUpperCase());
                    data[i].concepto = quitarAcentos(conceptos_traduccion[data[i].concepto].toUpperCase());
                    data[i].plan = quitarAcentos(tipo_plan.toUpperCase())

                    for(var k in data[i]) {

                        row.push(data[i][k]);
                    }

                    row = row.join(',');
                    arr.push(row);
                }

                arr = arr.join('\n');
                download(arr,seleccion);

        }

        function download(csv,sel) {

              var sel_ = quitarAcentos(sel)
                            .replace(/ /g,'_');

              var csvFile = new Blob(["\ufeff", csv], {
                  'type': 'text/csv'
              });

              if (window.navigator && window.navigator.msSaveOrOpenBlob) {
                  window.navigator.msSaveOrOpenBlob(csvFile,"info.csv");
              } else {
                  var downloadLink = document.createElement("a");
                  downloadLink.download = "ASIGNACIONES_" + sel_ + ".csv";
                  downloadLink.href = window.URL.createObjectURL(csvFile);
                  downloadLink.style.display = "none";
                  document.body.appendChild(downloadLink);
                  downloadLink.click();
                  $("a[download]").remove();
              }

        }


        function quitarAcentos(txt) {
          return txt.toUpperCase()
                        .replace('Á','A')
                        .replace('É','E')
                        .replace('Í','I')
                        .replace('Ó','O')
                        .replace('Ú','U');
        };



        function header(sel,filtros,names) {
          var sel_ = quitarAcentos(sel);

          var fecha = new Date();
          var Header = [
              "COMISION NACIONAL DE HIDROCARBUROS",
              "ASIGNACIONES",
              sel_,
              filtros,
              "Fecha de descarga: " + fecha.toLocaleString('es-MX').replace(", ", " - "),
              "\n",
              names
          ];

          return Header;
        }

}
