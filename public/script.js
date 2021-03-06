var produccion = false;
var HOSTNAME = produccion ? 'https://asignaciones.hidrocarburos.gob.mx/' : 'http://asignaciones.test.cnh.gob.mx/';
var HOSTNAME = '';

 $(document).ready(function() {

   var tipoExplorador = (function(){
       var ua= navigator.userAgent, tem,
       M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
       if(/trident/i.test(M[1])){
           tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
           return 'IE '+(tem[1] || '');
       }
       if(M[1]=== 'Chrome'){
           tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
           if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
       }
       M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
       if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
       return M.join(' ');
   })();

  console.log(tipoExplorador)

   var explorador = tipoExplorador.split(' ')[0];

   if(explorador == 'Chrome') {
   //if(explorador != 'IE' && explorador != 'Edge' && explorador != 'Safari') {

            $.ajax({
              type:'GET',
              dataType:'JSON',
              url: HOSTNAME + 'grales_asig.py',
              success:LogicaEntera
            });

    } else {
            $('div#lamina .content>*').css('display','none');
            $('div#lamina p#IE').css('display','block');
            //$('body').html('No es explorer')
    }

    $('.contacto').on('click', function() {
           $('div#lamina').css('visibility','visible');
           $('div#lamina img').css('display','none');
           $('div#lamina p:not(#IE)').css('display','block')
           $('div#lamina div#cerrar').css('display','block')
           $('div#lamina #cargando').css('display','none')

    });

    $('div#cerrar>div').on('click',function() {
          $('div#lamina').css('visibility','hidden');
    })

});

var LogicaEntera = function(datos_grales) {
    datos_grales = JSON.parse(datos_grales)
    $.ajax({
      type:'GET',
      dataType:'JSON',
      url: HOSTNAME + 'grales_asig.py?CONFIG=1',
      success:function(notas_update) {

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

        notas_update = JSON.parse(notas_update);

        var notas_alPie = {};
        var last_update = {};
        var sources = {};
        var maxfecha = {};
        var rango_extent = {};

        notas_update.forEach(function(d) {
          notas_alPie[d.topic] = d.notes;
          var isoDate = new Date(d.last_update).toISOString().split('-');

          var date_update = meses[isoDate[1].replace(/^0/,'')] + ' - ' + isoDate[0];
          last_update[d.topic] = date_update;
          sources[d.topic] = d.source;
          maxfecha[d.topic] = d.maxfecha;
          rango_extent[d.topic] = d.rango;
        });


d3.json('file_.json',function(err,data_) {

  d3.json('shapes.json',function(err,shapes) {

        shapes.features.forEach(function(d) {
           var vocales = [
             ['á','a'],
             ['é','e'],
             ['í','i'],
             ['ó','o'],
             ['ú','u']
           ];

           vocales.forEach(function(v) {
              d.properties.tipo = d.properties.tipo.replace(new RegExp(v[0],'g'),v[1]);
              d.properties.cuenca = d.properties.cuenca.replace(new RegExp(v[0],'g'),v[1]);
           });

        });

//////////////////////////////////////
        d3.select('#notas_pestana').on('click',function() {
            var up = d3.select(this).attr('up');

            if(!up) {
                    d3.select(this).attr('up',1);
                    $(this).attr('class','notas_up');
                    $('#notas').attr('class','notas__up');
                    $('#notas_ocultar,#notas_contenido').css('display','block')
            } else {
                    $('#notas_ocultar,#notas_contenido').css('display','none');
                    var up = d3.select('#notas_pestana').attr('up',null);
                    $('#notas_pestana').attr('class','notas_down');
                    $('#notas').attr('class','notas__down');
            }

        });

        $('body').click(function(e) {
             if(
               $(e.target).attr('ix') != 'notas' &&
               $(e.target).attr('id') != 'notas_contenido' &&
               $(e.target).attr('id') != 'notasTexto' &&
               $(e.target).attr('id') != 'notasHeader' &&
               $(e.target).attr('id') != 'notasSource' &&
               $(e.target).attr('id') != 'notasFecha' &&
               !$(e.target).is('b') &&
               !$(e.target).is('i') &&
               !$(e.target).is('ul') &&
               !$(e.target).is('li') &&
               !$(e.target).is('a') &&
               !$(e.target).is('span')
             ) {

                   var up = d3.select('#notas_pestana').attr('up');

                   if(up) {
                       $('.source,#fechaActualizacion').css('display','none');
                       $('#notas_ocultar,#notas_contenido').css('display','none');
                       var up = d3.select('#notas_pestana').attr('up',null);
                       $('#notas_pestana').attr('class','notas_down');
                       $('#notas').attr('class','notas__down');
                   }

             }
        });
//////////////////////////////////////

/*------------------------------------------------Highcharts language settings------------------------------------------------------------------*/
    Highcharts.setOptions({
      lang: {
        shortMonths:['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
        months:['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
        rangeSelectorFrom:'De:',
        rangeSelectorTo:'A:',
        rangeSelectorZoom:'',
        thousandsSep:',',
        downloadCSV: 'Descargar datos'
      }
    })

/*------------------------------------------------Highcharts language settings------------------------------------------------------------------*/

      var markersANDmap = leafletMap(shapes);
      var asignaciones = markersANDmap[0];
      var mymap = markersANDmap[1];

/*======================================================================================================*/
/*====== Redraw maps when resize event is finished =====================================================*/
/*======================================================================================================*/
      var rtime;
      var timeout = false;
      var delta = 200;
      var mapNdataObj;

    // Esta función comprueba si el usuario ya terminó de redimensionar la ventana.
    function resizeend() {
        if (new Date() - rtime < delta) {
            setTimeout(resizeend, delta);
        } else {
            timeout = false;
            var id_ = $('.selectedButton').attr('id');
            switcher(id_,mapNdataObj);
        }
    }



    window.onresize = function() {
/*----------------------------------Redimensionar los resultados desplegables si es que existen-------------------------------------*/
       if($('div.resultadosDesplegables')[0]) {
             $('div.resultadosDesplegables').css('left',resultadosDesplegablesProperties().x)
                                            .css('width',resultadosDesplegablesProperties().width - 2);
       }
/*----------------------------------Redimensionar los resultados desplegables si es que existen-------------------------------------*/
       $('#visor').html('')
       rtime = new Date();
       if ( timeout === false ) {
              timeout = true;
              setTimeout(resizeend,delta);
       }
    }

/*======================================================================================================*/
/*====== Redraw maps when resize event is finished ====================================================*/
/*====================================================================================================*/
/*
      data_ = JSON.stringify(data_)
          .replace(/M¿xico/g,'México')
          .replace(/Cintur¿n/g,'Cinturón')
          .replace(/Yucat¿n/g,'Yucatán');

      data_ = JSON.parse(data_)
*/

////////////////////////////////////////////////////////////////////////////////////////////////////
//    -----> ESTO TIENE QUE CAMBIAR!!!!
/////////////////////////////////////////////////////////////////////////////////////////////
      datos_grales = datos_grales.map(function(d) { if(!d.CUENCA) d.CUENCA='En verificación'; return d; });
////////////////////////////////////////////////////////////////////////////////////////////////////
//    -----> ESTO TIENE QUE CAMBIAR!!!!
/////////////////////////////////////////////////////////////////////////////////////////////

      var data = datos_grales;

      //var exp = new Expandir(data,'CUENCA')

      var cuencas = data.map(function(d) {
          return d.CUENCA;
      });


      var tipos = _.uniq(data.map(function(d) { return d.TIPO }));
      tipos = ['Todos'].concat(tipos);

      var ubicaciones = _.uniq(data.map(function(d) { return d.UBICACION }));
      //ubicaciones = ['Todas'].concat(ubicaciones)

      var tipos_extras = tipos.map(function(d,i) {
        var obj = {};
        obj['CUENCA'] = 'Todas';
        obj['TIPO'] = d;
        obj['UBICACION'] = 'Todas',
        obj['NOMBRE'] = 'Todas';
        obj['ID'] = 'Todas';
        return obj;
      });

      var ubicaciones_extras = ubicaciones.map(function(d) {
        var obj = {};
        obj['CUENCA'] = 'Todas';
        obj['UBICACION'] = d;
        obj['TIPO'] = 'Todas';
        obj['NOMBRE'] = 'Todas';
        obj['ID'] = 'Todas';
        return obj;
      });

      //ubicaciones.slice(1,ubicaciones.length)
      var ubicaciones_extras_2 = ubicaciones.map(function(d) {
        var resultados = _.uniq(data.filter(function(e) {
          return e.UBICACION == d; }).map( function(m) {
            var obj = {};
            obj['NOMBRE'] = 'Todas';
            obj['ID'] = 'Todas';
            obj['CUENCA'] = 'Todas';
            obj['UBICACION'] = d;
            obj['TIPO'] = m.TIPO;

            return JSON.stringify(obj);
          })
        );

        return resultados.map(function(d) { return JSON.parse(d) });
      });

      ubicaciones_extras_2 = _.flatten(ubicaciones_extras_2);

      function extras_(arr,st,params,special) {
          let resultado = arr.map(function(d)  {
              return data.filter(function(f) {
                  return f[st] == d;
              }).map(function(m) {
                  var obj = {};

                  for(var p in params) {
                    if(params[p] == special) {
                      obj[special] = m[special]
                    } else {
                      obj[params[p]] = 'Todas';
                    }
                  }

                  obj[st] = m[st];
                  obj['ID'] = m['ID'];
                  obj['NOMBRE'] = m['NOMBRE'];

                  return obj;
              });
          });

          resultado = _.flatten(resultado);
          return resultado;
      };

      var test_0 = extras_(tipos.slice(1,tipos.length), 'TIPO',['CUENCA','UBICACION']);
      var test_1 = extras_(ubicaciones,'UBICACION',['CUENCA','TIPO'],'TIPO');

      cuencas = _.uniq(cuencas);

      var cuencas_extras = cuencas.map(function(d) {
        var obj = {};
        obj['CUENCA'] = d;
        obj['ID'] = 'Todas';
        obj['UBICACION'] = 'Todas';
        obj['TIPO'] = 'Todos';
        obj['NOMBRE'] = 'Todas';
        return obj;
      });

      cuencas = ['Todas'].concat(cuencas);

      var ex_0 = new Expandir(data,'CUENCA').packaged_ops(['UBICACION','TIPO']);
      var ex_1 = new Expandir(data,'UBICACION').packaged_ops(['TIPO']);
      var ex_2 = new Expandir(data,'TIPO').packaged_ops();
      data = data.concat(ex_0,ex_1,ex_2,data)

      //data = data.concat(cuencas_extras,tipos_extras,ubicaciones_extras,ubicaciones_extras_2,test_0,test_1);


      cuencas.forEach(function(d) {
        if(d) {
          $('.cuenca').append('<option>'+ d +'</option>');
        }
      });


    asignaciones.on('click',function(event) {
      //event.layer.setStyle({ background:'red' });
          var id_asignacion = event.layer.feature.properties.id;

          var sel_asignacion = data.filter(function(d) {
            /* Habrá que cambiar NOMBRE por ID */
            return d.ID == id_asignacion;
            /* Habrá que cambiar NOMBRE por ID */
          })[0];


          /* -- Sustituir valores de filtros sin detonar eventos --*/
          $('.cuenca').val(sel_asignacion.CUENCA)
          cambio(data,'ubicacion',function(d) {
            return localCond(d,'cuenca');
          });

          $('.ubicacion').val(sel_asignacion.UBICACION)
          cambio(data,'tipo',function(d) {
              return localCond(d,'cuenca') && localCond(d,'ubicacion');
          });

          $('.tipo').val(sel_asignacion.TIPO)
          cambio(data,'asignacion',function(d) {
              return localCond(d,'cuenca') && localCond(d,'ubicacion') && localCond(d,'tipo');
          },'NOMBRE');

          $('.asignacion').val(sel_asignacion.NOMBRE);
          /* -- Sustituir valores de filtros sin detonar eventos --*/

          $('.asignacion').trigger('change');

    });

      mapNdataObj = {
        'grales':datos_grales,
        'data':data,
        'asignaciones':asignaciones,
        'mymap':mymap,
        'notas':notas_alPie,
        'last_update':last_update,
        'sources':sources,
        'maxfecha':maxfecha,
        'rango':rango_extent
      };

      function AjaxCall(data,mymap,asignaciones) {

        //datosAsignacion(data,null,null,mymap,asignaciones);
        $('#visor').html('');

        var ID, TIPO, UBICACION, CUENCA;
        ID = $('.asignacion>option:selected').attr('id');
        TIPO = $('.tipo>option:selected').text();
        UBICACION = $('.ubicacion>option:selected').text();
        CUENCA = $('.cuenca>option:selected').text();


        $.ajax({
              type:'GET',
              dataType:'JSON',
              //type:'json',
              url:HOSTNAME + 'grales_asig.py',
              data:{
                ID:ID,
                TIPO:TIPO,
                UBICACION:UBICACION,
                CUENCA:CUENCA
              },
              success:function(ajaxData) {

                var noms = [CUENCA,TIPO,UBICACION];

                for(var k in ajaxData) {

                  ajaxData[k] = JSON.parse(ajaxData[k])/*.map(function(d) {
                        var name = noms.filter((d) => d.slice(0,3) != 'Tod').join(' - ')// ? 'Todas' : noms.join(' - ')
                        d['nombre'] = name ? name : 'Nacional'
                        return d;
                  })*/
                }

                Object.keys(ajaxData.seguimiento).forEach(function(d) {
                  if(typeof(ajaxData.seguimiento[d]) == 'string') ajaxData.seguimiento[d] = JSON.parse(ajaxData.seguimiento[d])
                });

                mapNdataObj['ajaxData'] = ajaxData;
/*
                Object.keys(mapNdataObj.ajaxData.seguimiento).forEach((d) => {
                  mapNdataObj.ajaxData.seguimiento[d] = JSON.parse(mapNdata.ajaxData.seguimiento[d])
                });
*/
                switcher($('.selectedButton').attr('id'),mapNdataObj);

              }
        });
      };


      cambioAsignacion(data);
      speechBubbles(mapNdataObj);

      $('.cuenca').on('change',function() {
          if( $('.asignacion>option:selected').attr('ID') != 'Todas' ) {
              //AjaxCall(data,mymap,asignaciones)
              cambioAsignacion(data);
              AjaxCall(data,mymap,asignaciones)

          } else {

              AjaxCall(data,mymap,asignaciones);
              cambioAsignacion(data);

          }

          datosAsignacion(data,null,null,mymap,asignaciones);
      });


      $('.ubicacion').on('change',function() {
          if( $('.asignacion>option:selected').attr('ID') != 'Todas' ) {
              cambio(data,'tipo',function(d) {
                return localCond(d,'cuenca') && localCond(d,'ubicacion');
              });

              $('.tipo').trigger('change');
          } else {
                AjaxCall(data,mymap,asignaciones);
                cambio(data,'tipo',function(d) {
                  return localCond(d,'cuenca') && localCond(d,'ubicacion');
                });

                //$('.tipo').trigger('change');
          }

          datosAsignacion(data,null,null,mymap,asignaciones);
      });


      $('.tipo').on('change',function() {
        //
        // Si las siguientes tres líneas no se incorporan: no se hacen bien los queries. caso VERACRUZ, MARINO, EXTRACCIÒN
        //
        cambio(data,'asignacion',function(d) {
            return localCond(d,'cuenca') && localCond(d,'ubicacion') && localCond(d,'tipo');
        },'NOMBRE');

            if( $('.asignacion>option:selected').attr('ID') != 'Todas' ) {

                cambio(data,'asignacion',function(d) {
                    return localCond(d,'cuenca') && localCond(d,'ubicacion') && localCond(d,'tipo');
                },'NOMBRE');

                $('.asignacion').trigger('change');

            } else {

                AjaxCall(data,mymap,asignaciones);

                cambio(data,'asignacion',function(d) {
                    return localCond(d,'cuenca') && localCond(d,'ubicacion') && localCond(d,'tipo');
                },'NOMBRE');
                //$('.asignacion').trigger('change');
            }

            datosAsignacion(data,null,null,mymap,asignaciones);
      });


      $('.asignacion').on('change',function() {
              datosAsignacion(data,null,null,mymap,asignaciones);

              $('#visor').html('');

              $.ajax({
                    type:'GET',
                    dataType:'JSON',
                    url:HOSTNAME + 'grales_asig.py',
                    data:{ ID: $('.asignacion>option:selected').attr('ID') },
                    success:function(ajaxData) {
                      var noms = ['cuenca','ubicacion','tipo','asignacion'].map(function(d) { return [d.toUpperCase(),$('.' + d + '>option:selected').text()] })

                      for(var k in ajaxData) {
                        //console.log(k)
                        ajaxData[k] = JSON.parse(ajaxData[k])
                        var isJson = Object.keys(ajaxData[k]).every(function(d) { return !+d });

                        if(isJson) {
                            Object.keys(ajaxData[k]).forEach(function(d) {
                                ajaxData[k][d] = typeof(ajaxData[k][d]) != 'object' ? JSON.parse(ajaxData[k][d]) : ajaxData[k][d]
                            })
                        }
/*
                            ajaxDat[k].map(function(d) {
                                  var name = noms.filter((d) => d.slice(0,3) != 'Tod').join(' - ')// ? 'Todas' : noms.join(' - ')
                                  d['nombre'] = name ? name : 'Nacional'
                                  return d;
                            })
*/
                      }

                      mapNdataObj['ajaxData'] = ajaxData;

                      switcher($('.selectedButton').attr('id'),mapNdataObj);

                    }
              });
      });


      $('input.buscador').on('input',function(d) {
            inputEnBuscador(d,data);
      });

});
});
}});
}


function datosAsignacion(data,nombre,projection,mymap,asignaciones) {

    //  try {
      		var sel_asignacion_obj;

      		if(!nombre) { 														// <-- ¿Esto qué?
      			sel_asignacion = $('.asignacion>option:selected').attr('id');
      		} else {
      			sel_asignacion = nombre.split(' - ')[0];   // <-- ¿Esto qué?
      		}
          //console.log(sel_asignacion)

            	var sel_asignacion_obj = data.filter(function(d) { return d.ID == sel_asignacion; })[0];
/*
            	var filas = ['NOMBRE','VIG_ANIOS','VIG_INICIO','VIG_FIN','SUPERFICIE_KM2','TIPO'];

            	for(var i in filas) {
                var texto = filas[i] == 'VIG_INICIO' || filas[i] == 'VIG_FIN' ?
                                            parseDate(sel_asignacion_obj[filas[i]],true) : sel_asignacion_obj[filas[i]];
                texto = '  ' + texto;

            		$('.' + filas[i]).text(texto);
            	}
*/
             var arr_layers = Object.keys(asignaciones._layers)
                        .map(function(d) {
                            var obj = {};
                            obj['key'] = d;
                            obj['layer'] = asignaciones._layers[d];
                            return obj;
                        });

              var selected_layer = arr_layers.filter(function(d) {
                if(d.layer.feature.properties.id == sel_asignacion_obj.ID) return d.key;
              })[0]

              selected_layer = selected_layer ? selected_layer.layer : false;

              if(sel_asignacion != 'Todas') {

                      //d3.selectAll('div#MAPA path').transition().duration(800).style('opacity',0.1);
                      mymap.flyTo(selected_layer.getCenter(),8);

                    	mymap.on('moveend',function(){
                    		d3.selectAll('div#MAPA path')
                    		  .transition()
                    		  .duration(500)
                    		  .style('opacity',.15)
                    		  .style('stroke-width',0.3)
                          .style('stroke','white')

                    		d3.select('div#MAPA path.' + sel_asignacion.split(' - ')[0])
                    		  .transition()
                    		  .duration(300)
                    		  .delay(500)
                    		  .style('opacity',1)
                    		  .style('stroke-width',3)
                          .style('stroke','magenta')
                    	});

              } else {

                  mymap.flyTo([22.0, -96.0], 6)
                  mymap.on('moveend',function() {
                            d3.selectAll('div#MAPA path')
                              .transition()
                              .duration(500)
                                .style('stroke','white')
                                .style('stroke-width','0.3')
                                .style('opacity','1');

                            var filtros_ = ['cuenca','tipo','ubicacion'].map(function(d) {
                                  return [d,$('.' + d + '>option:selected').text()]
                            }).filter(function(f) { return f[1].substring(0,3) != 'Tod' });


                            if(filtros_.length > 0) {
                                  var filtered_layers = arr_layers.filter(function(f) {
                                                            return filtros_.every(function(d) { return f.layer.feature.properties[d[0]] == d[1] });
                                                        }).map(function(d) { return d.layer.feature.properties.id });


                                  d3.selectAll('div#MAPA path')
                                    .transition()
                                    .duration(500)
                                    .style('stroke','white')
                                    .style('stroke-width','0.3')
                                    .style('opacity','0.15')

                                  Array.prototype.slice.call(document.querySelectorAll('div#MAPA path')).filter(function(d) {
                                      return filtered_layers.some(function(s) { return s == $(d).attr('class').split(' ')[0] })
                                  }).forEach(function(d) {

                                    d3.select(d)
                                      .transition()
                                      .duration(1000)
                                      .style('stroke','magenta')
                                      .style('stroke-width','1')
                                      .style('opacity','1');
                                  })


                            }
                        })

              }

      /*------------------------AGRAGAR URL DE DESCARGA DE TITULO--------------------------------------------*/
            	var URL = 'https://asignaciones.energia.gob.mx/asignaciones/_doc/publico/Asignaciones/';
            	var tituloLink = URL + sel_asignacion_obj.NOMBRE.split(' - ')[0] + '.pdf';

            	var fnString = 'openInNewTab("' + tituloLink + '");';
            	$('#titulo').attr('onclick',fnString)
      /*------------------------AGRAGAR URL DE DESCARGA DE TITULO--------------------------------------------*/
      //} catch (err) {}
};



// Esta función se llama dentro de la fn 'cambio', tiene como objetivo simplificar la sintaxis
// de su lógica interna.
function localCond(d,str) {
    var selected_option = $('.' + str + '>option:selected').text();

    if(selected_option.substr(0,3) != 'Tod') {
        return d[str.toUpperCase()] == selected_option;
    } else {
        return d;
    }
};



// Esta función maneja los cambios en los elementos 'select' (inserta las opciones según los filtros).
 function cambioAsignacion(data) {

      cambio(data,'ubicacion',function(d) {
        //return d['UBICACION'] == $('.>option:selected').text();
        return localCond(d,'cuenca');
      });

      cambio(data,'tipo',function(d) {
        return localCond(d,'cuenca') && localCond(d,'ubicacion');
      });


      cambio(data,'asignacion',function(d) {
        //return localCond(d,'cuenca')
        return localCond(d,'cuenca') && localCond(d,'ubicacion') && localCond(d,'tipo');
      },'NOMBRE');

/*
      $('.asignacion').html('');
 	    var cuenca_sel = $('.cuenca>option:selected').text();

      var filtro_asig = data.filter(function(d) {
        return d.CUENCA == cuenca_sel ;
      })
      .map(function(d) { return d.NOMBRE; });

      filtro_asig = _.uniq(filtro_asig);

      filtro_asig.forEach(function(d) {
      	if(d) {
      		$('.asignacion').append('<option>'+ d +'</option>');
      	}
      });
*/
 };



// Esta función cambia las opciones de selección para 'Ubicación', 'Tipo' y 'Asignacion'.
function cambio(data,str,fn,extraParam) {

    var filters, param;

    var mapName = extraParam ? extraParam : str.toUpperCase();

    if(str != 'asignacion') {
        var asigs_ = data.filter(fn)
                         .map(function(d) { return JSON.stringify(d) })

        asigs_ = _.uniq(asigs_).map(function(d) { return JSON.parse(d) })
                  //.map((d) => '<option id="'+d.ID+'">'+ d.NOMBRE +'</option>');

        asigs_ = asigs_.filter(function(f) { return f.NOMBRE.slice(0,3) == 'Tod' })
                       .concat(_.sortBy(asigs_.filter(function(f) {
                                                          return f.NOMBRE.slice(0,3) != 'Tod',(function(d) { return d.NOMBRE })
                                                        }) ))
                       .map(function(d) { return '<option id="'+d.ID+'">'+ d.NOMBRE +'</option>' })

        asigs_ = _.uniq(asigs_).join('');

        param = data.filter(fn)
                    .map(function(d) { return d[mapName]; });

        param = _.uniq(param);
        param = param.filter(function(f) { return f.slice(0,3) == 'Tod' }).concat(param.filter(function(f) { return f.slice(0,3) != 'Tod' }))
        param = param.map(function(d) { return '<option>' + d + '</option>'; }).join('');

        $('.asignacion').html(asigs_)

    } else {

        param = data.filter(fn)
                    .map(function(d) { return { 'nombre':d[mapName],'id':d.ID }; });

        var nombres = _.uniq( param.map(function(d) { return d.nombre }) );

        nombres = nombres.filter(function(f) { return f.slice(0,3) == 'Tod' }).concat(nombres.filter(function(f) { return f.slice(0,3) != 'Tod' }))

        param = nombres.map(function(d) {
            var id = param.filter(function(e) { return e.nombre == d; })[0].id;
            return '<option id='+ id +'>' + d + '</option>';
        });

    };

    $('.' + str).html(param);

};



// Maneja la funcionalidad a la hora de buscar asignaciones por palabra.
 function inputEnBuscador(d,data) {

 	var val = $('input.buscador').val();
 	if($('div.resultadosDesplegables>div')[0]) {
 		$('div.resultadosDesplegables>div').remove();
 	}

 	if(val) {

 		var text = val.split(' ');

 		patts = [];
 		text.forEach(function(d) {
 			var rx = new RegExp(d,'i');
 			patts.push(rx);
 		})


		var str_
		function regexCheck(patt) {
			return patt.test(str_);
		}

		var matches = data.filter(function(d) {
				str_ = d.NOMBRE;
				return patts.every(regexCheck)
		}).map(function(d) {
			return '<div class="result_" style="font-size:12px;z-index:2;background-color:transparent;">'
                  + d.NOMBRE +
             '</div>';
		});

    matches = _.uniq(matches)

		if(matches.length > 0) {
			matches = matches.reduce(function(a,b) { return a + b; });
		} else {
			matches = '<div style="font-size:12px;z-index:2;background-color:transparent;font-weight:700;color:rgb(13,180,190)">No hay coincidencias</div>'
		}

	 	var papaDelBuscador = $('input.buscador').parent();
	 	var resultadosProps = resultadosDesplegablesProperties();
	 	var resultadosStyle = '"width:'+ (resultadosProps.width - 2) +
	 								'px;max-height:250px;background:rgba(255,255,255,0.8);position:absolute;left:'+
	 								resultadosProps.x +'px;border:1px solid black;overflow:auto;z-index:1;"'
	 	var resultadosDiv = '<div class="resultadosDesplegables" style='+ resultadosStyle +'><div style="width:100%;z-index:1;">'+ matches +'</div></div>';

	 	papaDelBuscador.append(resultadosDiv);


 	} else {
 		     $('div.resultadosDesplegables').remove()
 	}

	$('.result_').on('mouseover',function(d) {

	  		$(this).css('background-color','lightBlue')
	  			     .css('cursor','pointer');

	}).on('mouseout',function(d) {

	  		$(this).css('background-color','transparent');

	}).on('click',function(d) {

		    var nombre = $(this).text();
		    var sel_asignacion = data.filter(function(d) { return d.NOMBRE == nombre; })[0];


                      /* -- Sustituir valores de filtros sin detonar eventos --*/
            				  $('.cuenca').val(sel_asignacion.CUENCA)
                      cambio(data,'ubicacion',function(d) {
                        return localCond(d,'cuenca');
                      });

                      $('.ubicacion').val(sel_asignacion.UBICACION)
                      cambio(data,'tipo',function(d) {
                          return localCond(d,'cuenca') && localCond(d,'ubicacion');
                      });

                      $('.tipo').val(sel_asignacion.TIPO)
                      cambio(data,'asignacion',function(d) {
                          return localCond(d,'cuenca') && localCond(d,'ubicacion') && localCond(d,'tipo');
                      },'NOMBRE');

            				  $('.asignacion').val(sel_asignacion.NOMBRE);
                      /* -- Sustituir valores de filtros sin detonar eventos --*/

                      $('.asignacion').trigger('change');
	});


 	$('body *>*:not(.resultadosDesplegables)').on('click',function() {
    		$('div.resultadosDesplegables').remove();
    		$('input.buscador').val('');
	 });

 };


// Esta función obtiene las dimensiones del cuadro desplegable de búsquedas por palabra.
 function resultadosDesplegablesProperties() {
 	    var properties = $('input.buscador')[0].getBoundingClientRect();
 	    return properties;
 };



 function speechBubbles(mapNdataObj) {
     	 $('div.button:not(.selectedButton), .polygonTooltip').on('mouseover',function() {

         		var text = $(this).attr('id');
         		var pos = +$(this).attr('pos');
         		var button_width = +$(this).css('width').split('px')[0];
         		var left = button_width*pos;
            var buttonOrigin = this.getBoundingClientRect().x;

         		var p = '<div id="bubble" style="z-index:1000;left:'+ left +'px">'+ text +'</div>'
         		$('div#bubbles').append(p)

            var bubble_width = $('#bubble')[0].getBoundingClientRect().width;
         		var offset = Math.abs(bubble_width - button_width) / 2;
         		var currentLeft = +$('#bubble').css('left').split('px')[0];
         		var newLeft = bubble_width > button_width ? currentLeft - offset : currentLeft + offset;

         		$('#bubble').css('left',newLeft + 'px');

      });


     	$('div.button').on('mouseout',function() {
     		   $('#bubbles>div#bubble').remove()
     	});


    	$('div.button').on('click',function(d) {

    		    clicker(this,mapNdataObj);
    		    d3.selectAll('div#botones_>div:not(.espacioBlanco)')
              .attr('class','button');

    		   $(this).attr('class','selectedButton');
           // PEGAR NOTAS
           $('#notas_contenido #notasTexto').html(mapNdataObj.notas[$('div.selectedButton').attr('id')]);
           $('#notasFecha>span').html(mapNdataObj.last_update[$('div.selectedButton').attr('id')]);
           $('#notasSource>span').html(mapNdataObj.sources[$('div.selectedButton').attr('id')]);

    	});

      $.ajax({
          type:'GET',
          dataType:'json',
          url: HOSTNAME + 'grales_asig.py?',
          data: {
            ID:$('.asignacion>option:selected').attr('id'),
            TIPO:$('.tipo>option:selected').text(),
            UBICACION:$('.ubicacion>option:selected').text(),
            CUENCA:$('.cuenca>option:selected').text()
          },
          success: function(data) {

               for(var k in data) { data[k] = JSON.parse(data[k]); }

               Object.keys(data.seguimiento).forEach(function(d) {
                 data.seguimiento[d] = JSON.parse(data.seguimiento[d])
               });

               mapNdataObj['ajaxData'] = data;

    	         $('#botones_>div').filter(function(i,d) { return i === 0 }).click();

               $('div#lamina').css('visibility','hidden')

          }
      });

 };





 function clicker(element,mapNdataObj) {

 	  var id = $(element).attr('id');
 	  var clase = $(element).attr('class');

 	  if(clase != 'selectedButton') {
	 	   $('#visor').html('');
	 	   switcher(id,mapNdataObj);
	  }

 };



 function grapher(fn,data,seriesProcessor) {
 	    fn(data,seriesProcessor);
 	    window.setTimeout(function() {
 			      $('.highcharts-background').attr('fill','transparent');
 	    },300);
};


function openInNewTab(url) {
  var win = window.open(url, '_blank');
  win.focus();
};


function switcher(id,mapNdataObj) {
          $('#filtro_cont').css('display','none')
  /*
          Object.keys(mapNdataObj.ajaxData.seguimiento).forEach((d) => {
              if(typeof(mapNdataObj.ajaxData.seguimiento[d]) == 'string') {
                  mapNdataObj.ajaxData.seguimiento[d] = JSON.parse(mapNdataObj.ajaxData.seguimiento[d])
              }
          });
*/
    		 	switch (true) {
              case id == 'Datos generales':

                    grapher(function() {

                      DatosGrales(mapNdataObj);
                      //try {
                          //datosAsignacion(mapNdataObj.data,null,null,mapNdataObj.mymap,mapNdataObj.asignaciones);
                      //} catch {}
                    });

                    break;

        	 		case id === 'Producción':

                    if(mapNdataObj.ajaxData.produccion.length > 0) {

                        var prod = mapNdataObj.ajaxData.produccion;
                        prod = JSON.parse(JSON.stringify(prod));

                        prod.forEach(function(d) {
                          let fecha = new Date(d.fecha).toISOString();
                          let anio = fecha.split('-')[0];
                          let mes = fecha.split('-')[1];

                          d.fecha = new Date(+anio,+mes - 1);
                        })

            	 			     //grapher(LineChart,mapNdataObj.ajaxData.produccion);

                         var visor_config = {
                           'radio_names':'',
                           'title':'Producción de hidrocarburos',
                           'options':[],
                           'height':100
                         };

                         frameVisor_withRadios(visor_config)

                         //$('#visor').html(visor)
                         var chart__ = LineChart(prod,mapNdataObj);

                         //chart__.series[0].update({lineColor:'red'})

                    } else {
                        noDato();
                    }

        	 			    break;

        	 		case id === 'Reservas':

                    var reservas = mapNdataObj.ajaxData.reservas;
                    reservas = _.sortBy(reservas,function (d) { return d.fecha; });

                    var pocasReservas = d3.max(_.flatten(reservas.map(function(d) {
                                return Object.values(d).filter(function(f) { return typeof(f) == 'number' })
                              })));

                    pocasReservas = pocasReservas < 1 ? pocasReservas : null;


                    if(reservas.length > 0) {

                          // ----------------- AGREGAR FRAME QUE INCLUYE BOTONES TIPO RADIO --------------------
                          var visor_config = {
                            'radio_names':'reservas',
                            'title':'Reserva de hidrocarburos',
                            'options': [
                                { 'value':'rr_pce_mmbpce', 'text':' PCE' },
                                { 'value':'rr_aceite_mmb', 'text':' Aceite' },
                                { 'value':'rr_gas_natural_mmmpc', 'text':' Gas' }
                              ],
                            'height':109
                          };

                          frameVisor_withRadios(visor_config)

                          //$('#visor').html(visor);

                          // ----------------- AGREGAR FRAME QUE INCLUYE BOTONES TIPO RADIO --------------------
                          var floatToFixed = pocasReservas ? '3' : '1';

                          var plot_config = {
                            title:'',
                            subtitle:'Millones de barriles de petróleo crudo equivalente',
                            yAxis:'MMBPCE',
                            yMax: pocasReservas ? pocasReservas : null,
                            where:'visor_chart',
                            chart: {
                              type:'column'
                            },
                            noRange:1,
                            xAxis: {
                              /*
                              type:'datetime',
                              dateTimeLabelFormats: {
                                year:'%Y'
                              },
                              */
                              labels: {
                                style: {
                                  fontSize:'1em'
                                }
                              }
                            },
                            stackLabels:true,
                            tooltip:'"<div><b>" +' +
                                          '(this.x) + "</b>:<br> " +' +
                                          'this.points.map(function(d) { '+
                                              'var key = d.key;' +
                                              'var key = "<span style=\'font-weight:800;color:" + d.color + "\'>"+ d.key.toUpperCase() + "</span>";' +
                                              'return "  " + key + ": " + Number(d.y.toFixed('+ floatToFixed +')).toLocaleString("es-MX") ' +
                                          '}).join("<br>") +' +
                                      '"</div>";'
                          };

                          var config_changes = {
                            yAxis: {
                              rr_pce_mmbpce:'MMBPCE',
                              rr_aceite_mmb:'MMB',
                              rr_gas_natural_mmmpc:'MMMPC'
                            },
                            subtitle: {
                              rr_pce_mmbpce:'Millones de barriles de petróleo crudo equivalente',
                              rr_aceite_mmb:'Millones de barriles de petróleo',
                              rr_gas_natural_mmmpc:'Miles de millones de pies cúbicos'
                            }
                          };

                          $('input[type=radio][name=reservas]').change(function() {
                                plot_config.yAxis = config_changes.yAxis[this.value];
                                plot_config.subtitle = config_changes.subtitle[this.value];
                                new BarChart(plot_config).plot(stack_fn(this.value),function(d) { return d },reservas);
                          });


                          function stack_fn(tipo) {
                              var groups_ = [
                                { 'stackName':'PP','groups':['probadas','probables','posibles'] }
                                //{ 'stackName':'PP','groups':['1P','2P','3P'] }
                              ];

                              var config = {
                                filter:'tipo',
                                nombre:'nombre',
                                id:'id',
                                x:'fecha',
                                y:tipo,
                                timeformat: { year:'%Y' }
                              }

                              var stack_reservas = new Wrangler(config,groups_);
                              var reservasStacked = stack_reservas.stackData(reservas);

                              //var colores = ['rgb(13,180,190)','rgb(46,112,138)','rgb(20,50,90)'];
                              var colores = ['rgb(20,50,90)','rgb(46,112,138)','rgb(13,180,190)']

                              reservasStacked = reservasStacked.map(function(d,i) {
                                d.color = colores[i];
                                return d;
                              });

                              return reservasStacked;
                          };


                          var reservasPlot = new BarChart(plot_config);

                          reservasPlot.plot(stack_fn('rr_pce_mmbpce'),function(d) { return d },reservas);

                    } else {
                          noDato();
                    }

            	 			break;

        	 		case id === 'Actividad física':

              //===========================================================================================================
              // OJO: Highcharts error #15: www.highcharts.com/errors/15
              //===========================================================================================================
                    if( mapNdataObj.ajaxData.pozos_inv.length > 0) {

                          var pozos_ = JSON.parse(JSON.stringify(mapNdataObj.ajaxData.pozos_inv));

                          pozos_.forEach(function(d) {
                            let fecha = new Date(d.fecha).toISOString();
                            let anio = fecha.split('-')[0];
                            let mes = fecha.split('-')[1];

                            d.fecha = new Date(+anio,+mes - 1);
                          })

                          var pozos = mapNdataObj.ajaxData.pozos_inv.filter(function(d) {
                            var cond =
                              [
                                'Perforaciones desarrollo',
                                'Terminaciones desarrollo',
                                'Perforaciones inyectores',
                                'Terminaciones inyectores',
                                'Reparaciones mayores',
                                'Reparaciones menores',
                                'Taponamientos',
                                'Pozos operando',
                                'Perforaciones exploración',
                                'Terminaciones exploración'
                              ].some(function(e) { return e == d.descriptor });

                              return cond;
                        });

                        var groups_ = {
                          'per': [
                            { 'stackName':'Perforaciones','groups':['Perforaciones desarrollo','Perforaciones exploración'] },
                            { 'stackName':'Terminaciones', 'groups':['Terminaciones desarrollo','Terminaciones exploración'] }
                          ],
                          'ops': [
                            { 'stackName':'Pozos operando','groups':['Pozos operando'] }
                          ],
                          'rep': [
                            { 'stackName':'Reparaciones menores','groups':['Reparaciones menores'] },
                            { 'stackName':'Reparaciones mayores','groups':['Reparaciones mayores'] },
                            //{ 'stackName':'Taponamientos','groups':['Taponamientos'] }
                          ]
                        };

                        var checkComplete = Object.keys(groups_)
                              .map(function(d) {
                                  var rs = groups_[d].map(function(d) { return d.groups })
                                                   .map(function(k) {
                                                     return pozos.filter(function(f) { return k.some(function(s) { return s == f.descriptor }) })
                                                                 .map(function(a) { return a.valor }).every(function(e) { return !e })
                                                   });

                                  rs = rs.every(function(e) { return !e })
                                  return rs ? d : null
                              }).filter(function(f) { return f });
/*
                        var groups_ = [
                          { 'stackName':'Perforaciones','groups':['Perforaciones desarrollo'] },
                          { 'stackName':'Terminaciones', 'groups':['Terminaciones desarrollo'] },
                          { 'stackName':'Reparaciones','groups':['Reparaciones menores','Reparaciones mayores'] },
                          { 'stackName':'Taponamientos','groups':['Taponamientos'] },
                          { 'stackName':'Pozos operando','groups':['Pozos operando'] }
                        ];
*/


                        var visor_config = {
                          'name':'pozos',
                          'title':'Actividad física',
                          'options': [
                              { 'value':'per', 'text':' Perforación de pozos' },
                              { 'value':'ops', 'text':' Pozos operando' },
                              { 'value':'rep', 'text':' Reparaciones' }
                            ],
                          'height':100
                        };

                        frameVisor_withRadios(visor_config);
                        //$('#visor').html(visor);

                        $('input[type=radio][value='+ checkComplete[0] +']').attr('checked',true);

                        var noEstan = Object.keys(groups_).filter(function(f) { return checkComplete.some(function(s) { return s != f }) })

                        if(noEstan.length < 3) {
                                      noEstan
                                            .forEach(function(d) {
                                              var el = document.querySelector('input[type=radio][value='+ d +']');
                                              el.disabled = true;
                                              $(el).parent().css('color','lightGray');

                                            });
                        }

                        $('input[type=radio]').each(function(i,d) {
                            $(this).parent().css('padding',0)
                            if(i >= 0) $(this).parent().css('padding-right','15px')
                        });

                        var config = {
                            filter:'descriptor',
                            nombre:'nombre',
                            id:'id',
                            x:'fecha',
                            y:'valor',
                            timeformat: { month:'%b \ %Y' },
                            timebuttons:true
                        };

                        var categoria = $('input[type=radio]:checked').val();
                        var stack_pozos = new Wrangler(config, groups_[categoria]);
                        var stackedPozos = stack_pozos.stackData(pozos);


                        function removeEdges(stackedPozos) {
                              var stackedPozos_ = JSON.parse(JSON.stringify(stackedPozos));


                              stackedPozos_.forEach(function(d,i) {
                                 var valid = d.data.filter(function(f) { return f.y }).map(function(d) { return d.x });
                                 var max = d3.max(valid);
                                 var min = d3.min(valid);

                                 var a = d.data.filter(function(f) { return f.x >= min }).filter(function(f) { return f.x <= max });
                                 stackedPozos_[i].data = a;

                                 if(stackedPozos_[i].name == 'Perforaciones exploración') {
                                    stackedPozos_[i].color = 'rgb(67,64,138)'
                                 }

                                 if(stackedPozos_[i].name == 'Perforaciones desarrollo') {
                                    stackedPozos_[i].color = 'rgba(0,150,255,0.6)'
                                 }

                                 if(stackedPozos_[i].name == 'Terminaciones desarrollo') {
                                    stackedPozos_[i].color = 'rgba(13,180,190,.6)'
                                 }

                                 if(stackedPozos_[i].name == 'Terminaciones exploración') {
                                    stackedPozos_[i].color = 'rgb(46,150,130)'
                                 }
                              })

                              return stackedPozos_;
                        };


                        var chartConfig_ = {
                          title:'',
                          subtitle:'',
                          yAxis:'Número',
                          where:'visor_chart',
                          chart: {
                            type:'column'
                          },
                          xAxis: {
                            type:'datetime',
                            labels: {
                              style: {
                                fontSize:'1em'
                              }
                            },
                            dateTimeLabelFormats: {
                              month:'%b \ %Y'
                            }
                          },
                          noRange:false,
                          timebuttons:true
                        }

                        var pozosPlot = new BarChart(chartConfig_);
                    //if(pozos.length > 0) {
                        //grapher(pozosPlot.plot,stackedPozos,removeEdges);
                        //pozosPlot.plot(removeEdges(stackedPozos),(d) => d)
                        pozosPlot.plot(stackedPozos,removeEdges,pozos)

                        $('input[type=radio]').on('change',function() {

                              var categoria = $('input[type=radio]:checked').val();
                              var stack_pozos = new Wrangler(config, groups_[categoria]);
                              var stackedPozos = stack_pozos.stackData(pozos);
                              //grapher(pozosPlot.plot,stackedPozos,removeEdges);
                              pozosPlot.plot(stackedPozos,removeEdges,pozos)

                        });

                    } else {
                        noDato();
                    }

                  //} catch {}

            	 			break;


        	 		case id === 'Seguimiento de inversión':

                          var seg = mapNdataObj.ajaxData.seguimiento;

                          seg.length > 0 || Object.keys(seg).length > 0 ? seguimiento(seg,'inv') : noDato();

            	 			break;

        	 		case id === 'Compromiso Mínimo de Trabajo':

                    var cmt = mapNdataObj.ajaxData.cmt;

                    if(Object.keys(cmt).length) {
                      CMT(cmt);
                      //var cmtRowPlot = new RowPlot(cmt);
                      //grapher(cmtRowPlot.table,cmt,function(data) { return data; });
                    } else {
                      noDato();
                    }

            	 			break;

        	 		case id === 'Aprovechamiento de gas':

                    var aprov = mapNdataObj.ajaxData//.aprovechamiento;

                    if(aprov.aprovechamiento.length) {
                      aprovechamiento(aprov)
                    } else {
                      noDato();
                    }


            	 			break;

        	 		case id === 'Documentos':

                    documentos(mapNdataObj.grales);
                    $('#filtro_cont').css('display','table')
            	 			break;

        	 		case id === 'Seguimiento de actividad':

                    var seg = mapNdataObj.ajaxData.seguimiento;

                    seg.length > 0 || Object.keys(seg).length > 0 ? seguimiento(seg,'act') : noDato();
                    //grapher(enConstruccion)
            	 			break;
    	 	}

};


function parseDate(ts,bool) {
    var fecha;
    var date = new Date(ts);
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    var day = date.getDate();

    function zerosBefore(input) {
      var output = String(input).length == 1 ? '0' + input : String(input);
      return output;
    };

    var months = {
      '1': 'Enero',
      '2': 'Febrero',
      '3': 'Marzo',
      '4': 'Abril',
      '5': 'Mayo',
      '6': 'Junio',
      '7': 'Julio',
      '8': 'Agosto',
      '9': 'Septiembre',
      '10': 'Octubre',
      '11': 'Noviembre',
      '12': 'Diciembre'
    };

    if(!bool) {
      fecha = months[String(month)] + ' ' + year;
    } else {
      fecha = zerosBefore(day) + '/' + zerosBefore(month) + '/' + year;
    }

    return fecha;
};
