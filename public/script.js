var HOSTNAME = 'http://172.16.24.57:5000/';

 $(document).ready(function() {

  $.ajax({
    type:'GET',
    dataType:'JSON',
    url: HOSTNAME + 'grales_asig.py',
    success:function(datos_grales) {
        datos_grales = JSON.parse(datos_grales)

   d3.csv('asignaciones_produccion.csv', function(err,produccion) {
    d3.json('file_.json',function(err,data_) {
    	d3.json('shapes.json',function(err,shapes) {

/*------------------------------------------------Highcharts language settings------------------------------------------------------------------*/
			  Highcharts.setOptions({
			  	lang: {
			  		shortMonths:['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
            months:['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'],
            rangeSelectorFrom:'De:',
            rangeSelectorTo:'A:',
            rangeSelectorZoom:''
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

        // Esta función comprueba si el usuario ya terminó de redimensionar la ventana.
				function resizeend() {
				    if (new Date() - rtime < delta) {
				        setTimeout(resizeend, delta);
				    } else {
				        timeout = false;
				        var id_ = $('.selectedButton').attr('id');
				        switcher(id_);
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

          data_ = JSON.stringify(data_)
              .replace(/M¿xico/g,'México')
              .replace(/Cintur¿n/g,'Cinturón')
              .replace(/Yucat¿n/g,'Yucatán');

          data_ = JSON.parse(data_)


////////////////////////////////////////////////////////////////////////////////////////////////////
//    -----> ESTO TIENE QUE CAMBIAR!!!!
/////////////////////////////////////////////////////////////////////////////////////////////
          datos_grales = datos_grales.map(function(d) { if(!d.CUENCA) d.CUENCA='nada'; return d; });
////////////////////////////////////////////////////////////////////////////////////////////////////
//    -----> ESTO TIENE QUE CAMBIAR!!!!
/////////////////////////////////////////////////////////////////////////////////////////////

          var data = datos_grales;

          //var exp = new Expandir(data,'CUENCA')
          //console.log(exp.unicos());

		      var cuencas = data.map(function(d) {
		      		return d.CUENCA;
		      });


          var tipos = _.uniq(data.map((d) => d.TIPO));
          tipos = ['Todos'].concat(tipos);

          var ubicaciones = _.uniq(data.map((d) => d.UBICACION));
          //ubicaciones = ['Todas'].concat(ubicaciones)

          var tipos_extras = tipos.map((d,i) => {
            var obj = {};
            obj['CUENCA'] = 'Todas';
            obj['TIPO'] = d;
            obj['UBICACION'] = 'Todas',
            obj['NOMBRE'] = 'Todas';
            obj['ID'] = 'Todas';
            return obj;
          });

          var ubicaciones_extras = ubicaciones.map((d) => {
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

            return resultados.map((d) => JSON.parse(d));
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

          var cuencas_extras = cuencas.map((d) => {
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
console.log(data)
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

          var mapNdataObj = {
            'data':data,
            'asignaciones':asignaciones,
            'mymap':mymap
          };

          function AjaxCall(data,mymap,asignaciones) {
            datosAsignacion(data,null,null,mymap,asignaciones);

            $('#visor').html('');

            var ID, TIPO, UBICACION, CUENCA;
            ID = $('.asignacion>option:selected').attr('id');
            TIPO = $('.tipo>option:selected').text();
            UBICACION = $('.ubicacion>option:selected').text();
            CUENCA = $('.cuenca>option:selected').text();

            $.ajax({
                  type:'GET',
                  dataType:'JSON',
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
                      ajaxData[k] = JSON.parse(ajaxData[k]).map(function(d) {
                            d['nombre'] = noms.filter((d) => d.slice(0,3) != 'Tod').join(' - ')// ? 'Todas' : noms.join(' - ')
                            return d;
                      })
                    }

                    mapNdataObj['ajaxData'] = ajaxData;

                    switcher($('.selectedButton').attr('id'),mapNdataObj);

                  }
            });
          };


          cambioAsignacion(data);
          speechBubbles(mapNdataObj);

		      $('.cuenca').on('change',function() {
              if( $('.asignacion>option:selected').attr('ID') != 'Todas' ) {
		      		    cambioAsignacion(data);
		      		    datosAsignacion(data,null,null,mymap,asignaciones);
              } else {
                  AjaxCall(data,mymap,asignaciones);
                  cambioAsignacion(data);
		      		    datosAsignacion(data,null,null,mymap,asignaciones);
              }
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
          });


          $('.tipo').on('change',function() {
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

                          for(var k in ajaxData) {
                            ajaxData[k] = JSON.parse(ajaxData[k])
                          }

                          mapNdataObj['ajaxData'] = ajaxData;
                          console.log(ajaxData)
                          switcher($('.selectedButton').attr('id'),mapNdataObj);

                        }
                  });
		      });


		      $('input.buscador').on('input',function(d) {
		      		  inputEnBuscador(d,data);
		      });

		});
   });
  });
 }});
});




function datosAsignacion(data,nombre,projection,mymap,asignaciones) {
try {
		var sel_asignacion_obj;

		if(!nombre) { 														// <-- ¿Esto qué?
			sel_asignacion = $('.asignacion>option:selected').attr('id');
		} else {
			sel_asignacion = nombre.split(' - ')[0];   // <-- ¿Esto qué?
		}

      	var sel_asignacion_obj = data.filter(function(d) { return d.ID == sel_asignacion; })[0];

      	var filas = ['NOMBRE','VIG_ANIOS','VIG_INICIO','VIG_FIN','SUPERFICIE_KM2','TIPO'];

      	for(var i in filas) {
          var texto = filas[i] == 'VIG_INICIO' || filas[i] == 'VIG_FIN' ?
                                      parseDate(sel_asignacion_obj[filas[i]],true) : sel_asignacion_obj[filas[i]];
          texto = '  ' + texto;

      		$('.' + filas[i]).text(texto);
      	}

       var arr_layers = Object.keys(asignaciones._layers)
                  .map(function(d) {
                      var obj = {};
                      obj['key'] = d;
                      obj['layer'] = asignaciones._layers[d];
                      return obj;
                  });


        var selected_layer = arr_layers.filter(function(d) {
          if(d.layer.feature.properties.id == sel_asignacion_obj.ID) return d.key;
        })[0].layer;


        d3.selectAll('div#MAPA path').transition().duration(800).style('opacity',0);
        mymap.flyTo(selected_layer.getCenter(),8);

      	mymap.on('moveend',function(){
      		d3.selectAll('div#MAPA path:not(.'+ sel_asignacion.split(' - ')[0] +')')
      		  .transition()
      		  .duration(500)
      		  .style('opacity',1)
      		  .style('stroke-width',0.5)

      		d3.select('div#MAPA path.' + sel_asignacion.split(' - ')[0])
      		  .transition()
      		  .duration(300)
      		  .delay(500)
      		  .style('opacity',1)
      		  .style('stroke-width',5)
      	});

/*------------------------AGRAGAR URL DE DESCARGA DE TITULO--------------------------------------------*/
      	var URL = 'http://asignaciones.energia.gob.mx/asignaciones/_doc/publico/Asignaciones/';
      	var tituloLink = URL + sel_asignacion_obj.NOMBRE.split(' - ')[0] + '.pdf';

      	var fnString = 'openInNewTab("' + tituloLink + '");';
      	$('#titulo').attr('onclick',fnString)
/*------------------------AGRAGAR URL DE DESCARGA DE TITULO--------------------------------------------*/
} catch (err) {}
};



// Esta función se llama dentro de la fn 'cambio', tiene como objetivo simplificar la sintaxis
// de su lógica interna.
function localCond(d,str) {
        return d[str.toUpperCase()] == $('.' + str + '>option:selected').text();
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

        param = data.filter(fn)
                    .map(function(d) { return d[mapName]; });

        param = _.uniq(param);
        param = param.map(function(d) { return '<option>' + d + '</option>'; }).join('');

    } else {
        param = data.filter(fn)
                    .map(function(d) { return { 'nombre':d[mapName],'id':d.ID }; });

        var nombres = _.uniq( param.map(function(d) { return d.nombre }) );

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
     	 $('div.button:not(.selectedButton)').on('mouseover',function() {

         		var text = $(this).attr('id');
         		var pos = +$(this).attr('pos');
         		var width = +$(this).css('width').split('px')[0];
         		var left = width*pos;

         		var p = '<div id="bubble" style="left:'+ left +'px">'+ text +'</div>'
         		$('div#bubbles').append(p)

         		var offset = Math.abs($('#bubble')[0].getBoundingClientRect().width - width) / 2;
         		var currentLeft = +$('#bubble').css('left').split('px')[0];
         		var newLeft = currentLeft - offset;

         		$('#bubble').css('left',newLeft + 'px');

      });


     	$('div.button').on('mouseout',function() {
     		   $('#bubbles>div#bubble').remove()
     	});


    	$('div.button').on('click',function(d) {

    		    clicker(this,mapNdataObj);
    		    d3.selectAll('div#botones_>div:not(.espacioBlanco)')
              .attr('class','button');

    		   $(this).attr('class','selectedButton')
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
              console.log('ajax')
              //console.log(JSON.parse(data)
               for(var k in data) { data[k] = JSON.parse(data[k]); }
               mapNdataObj['ajaxData'] = data;
    	         $('#botones_>div').filter(function(i,d) { return i === 0 })
                        .click();
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

    		 	switch (true) {
              case id == 'Datos generales':
                    grapher(function() {
                      DatosGrales();
                      try {
                          datosAsignacion(mapNdataObj.data,null,null,mapNdataObj.mymap,mapNdataObj.asignaciones);
                      } catch {}
                    });

                    break;

        	 		case id === 'Producción':
                    if(mapNdataObj.ajaxData.produccion.length > 0) {
            	 			     grapher(LineChart,mapNdataObj.ajaxData.produccion);
                    } else {
                        noDato();
                    }

        	 			    break;

        	 		case id === 'Reservas':

                    var reservas = mapNdataObj.ajaxData.reservas;

                    if(reservas.length > 0) {
                          var groups_ = [
                            { 'stackName':'PP','groups':['probadas','probables','posibles'] }
                            //{ 'stackName':'PP','groups':['1P','2P','3P'] }
                          ];

                          var config = {
                            filter:'tipo',
                            nombre:'nombre',
                            id:'id',
                            x:'fecha',
                            y:'rr_pce_mmbpce',
                            timeformat: { year:'%Y' }
                          }

                          var stack_reservas = new Wrangler(config,groups_);
                          var reservasStacked = stack_reservas.stackData(reservas);
                          var colores = ['rgb(13,180,190)','rgb(46,112,138)','rgb(20,50,90)'];

                          reservasStacked = reservasStacked.map(function(d,i) {
                            d.color = colores[i];
                            return d;
                          });


                          var reservasPlot = new BarChart({
                            title:'Reservas',
                            subtitle:'Millones de barriles de petróleo crudo equivalente',
                            yAxis:'MMBPCE',
                            where:'visor',
                            chart: {
                              type:'column'
                            },
                            noRange:1,
                            xAxis: {
                              type:'datetime',
                              dateTimeLabelFormats: {
                                month:'%b \ %Y'
                              }
                            },
                            //tooltip:'"<div><b>" +' +
                            //              'parseDate(this.x) + "</b>:<br> " +' +
                            //              'this.points.map(function(d) { return "  " + d.key + ": " + d.y }).join("<br>") +' +
                            //          '"</div>";'
                          });

                  	 			grapher(reservasPlot.plot,reservasStacked,(d) => d);//stack_reservas.stackData);

                    } else {
                          noDato();
                    }

            	 			break;

        	 		case id === 'Pozos':
                    if( mapNdataObj.ajaxData.pozos_inv.length > 0) {

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
                                'Pozos operando'
                              ].some(function(e) { return e == d.descriptor });

                              return cond;
                        });

                        var pozosPlot = new BarChart({
                          title:'Actividad física',
                          subtitle:'(En operación, perforaciones, terminaciones & taponamientos)',
                          yAxis:'Número de pozos',
                          where:'visor',
                          chart: {
                            type:'column'
                          },
                          xAxis: {
                            type:'datetime',
                            dateTimeLabelFormats: {
                              month:'%b \ %Y'
                            }
                          }
                        });

                        var groups_ = [
                          { 'stackName':'Perforaciones','groups':['Perforaciones desarrollo'] },
                          { 'stackName':'Terminaciones', 'groups':['Terminaciones desarrollo'] },
                          { 'stackName':'Reparaciones','groups':['Reparaciones menores','Repraciones mayores'] },
                          { 'stackName':'Taponamientos','groups':['Taponamientos'] },
                          { 'stackName':'Pozos operando','groups':['Pozos operando'] }
                        ];

                        var config = {
                            filter:'descriptor',
                            nombre:'nombre',
                            id:'id',
                            x:'fecha',
                            y:'valor',
                            timeformat: { month:'%b \ %Y' },
                            timebuttons:true
                        };

                        var stack_pozos = new Wrangler(config, groups_);
                        var stackedPozos = stack_pozos.stackData(pozos);

                    //if(pozos.length > 0) {
                        grapher(pozosPlot.plot,pozos,stack_pozos.stackData);
                    } else {
                        noDato();
                    }

                  //} catch {}

            	 			break;


        	 		case id === 'Inversión':
                    dashboard(mapNdataObj.ajaxData.inv);

                    var data = mapNdataObj.ajaxData.inv;
                    data = _.sortBy(data,function(d) { return d.anio; });


                    if(mapNdataObj.ajaxData.inv.length > 0) {
                          var groups = _.uniq(mapNdataObj.ajaxData.inv.map(function(d) { return d.actividad; }));

                          // Declarar grupos para gráfico de barras con stacks.
                          var groups_ = [
                              { 'stackName':'inv','groups':groups },
                          ];

                          // La configuración para el Wrangler
                          // En este objeto se especifica si se agregarán variables,cúales y bajo qué categorías
                          //   ejemplo: Inversión aprobada (valueToAggregate) anual (subAggregator) por actividad (aggregator).
                          //
                          // También, en este objeto se especifica bajo qué filtro se crearán stacks para gráficos de barras apilados.
                          var config = {
                              valueToAggregate:'monto_usd',
                              aggregator:'actividad',
                              subAggregator:'anio',
                              filter:'actividad',
                              nombre:'nombre',
                              id:'id',
                              x:'x',
                              y:'y',
                              timeformat: { year:'%Y' },
                              flatten:true,
                          };

                          var config_actividades = {
                              'valueToAggregate':'monto_usd',
                              'aggregator':'actividad',
                              'subAggregator':'sub_actividad',
                              'flatten':true,
                              'percentage':true,
                              'colores':{
                                'Exploración':5,
                                'Evaluación':7
                              }
                          };

                          var actividadesWrangler = new Wrangler(config_actividades);

                          var pie_sub = actividadesWrangler.aggregate(data);
                          var pie_act = actividadesWrangler.simpleAggregationBy(pie_sub,'actividad')
                                          .map(function(actividad) {
                                              var s = actividad.map(function(d) { return d.y; })
                                                               .reduce(function(a,b) { return a + b; });

                                              var obj = {};
                                              obj.y = s;
                                              obj.name = actividad[0].actividad;
                                              obj.color = actividad[0].mainColor;

                                              return obj;
                                          });


                          var inv_wrangler = new Wrangler(config, groups_);
                          var sumas_ = inv_wrangler.aggregate(data);
                          var invPorAnio = inv_wrangler.stackData(sumas_);


                          var groups_subactividades = actividadesWrangler.simpleAggregationBy(data,'actividad').map(function(d) {
                                                          var groups = actividadesWrangler.simpleAggregationBy(d,'sub_actividad')
                                                                    .map(function(d) {
                                                                        return d[0].sub_actividad;
                                                                    });

                                                          var stackName = d[0].actividad;

                                                          var obj = {};
                                                          obj['stackName'] = stackName;
                                                          obj['groups'] = groups;

                                                          return obj;

                          });


                          var config_subactividades = {
                            filter:'sub_actividad',
                            id:'id',
                            nombre:'nombre',
                            x:'anio',
                            y:'monto_usd'
                          };

                          var sub_wrangler = new Wrangler(config_subactividades,groups_subactividades);
                          var stack_subactividad = sub_wrangler.stackData(data);

                          // Gráficas
                          var invGeneral = new BarChart({
                                  title:'',
                                  yAxis:'Pesos',
                                  where: 'three',
                                  noRange:1,
                                  chart: {
                                    type:'column'
                                  },
                                  subtitle:'Inversión',
                                  hideLegend:true,
                                  xAxis: {
                                    type:'datetime',
                                    dateTimeLabelFormats: {
                                      month:'%b \ %Y'
                                    }
                                  }
                          });

                          var invPlot2 = new BarChart({
                                  title:'',
                                  yAxis:'Pesos',
                                  where: 'two',
                                  noRange:1,
                                  chart: {
                                    type:'column'
                                  },
                                  opposite:true,
                                  subtitle:'Inversión aprobada anual por actividad',
                                  xAxis: {
                                    type:'datetime',
                                    dateTimeLabelFormats: {
                                      month:'%b \ %Y'
                                    }
                                  }
                          });

                          pie(pie_act,pie_sub);
                          grapher(invGeneral.plot, data, sub_wrangler.stackData);
                          grapher(invPlot2.plot, invPorAnio, function(data) { return data; });

                    } else {
                          noDato();
                    }

            	 			break;

        	 		case id === 'Compromiso Mínimo de Trabajo':
                    var cmt = mapNdataObj.ajaxData.cmt;

                    if(cmt.length > 0) {
                      var cmtRowPlot = new RowPlot(cmt);
                      grapher(cmtRowPlot.table,cmt,function(data) { return data; });
                    } else {
                      noDato();
                    }

            	 			break;

        	 		case id === 'Aprovechamiento de gas':
                    grapher(enConstruccion)
            	 			break;

        	 		case id === 'Documentos':
                    grapher(enConstruccion)
            	 			break;

        	 		case id === 'Seguimiento':
                    var seg = mapNdataObj.ajaxData.seguimiento;
                    divisor(seg);
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
