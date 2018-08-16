var HOSTNAME = 'http://172.16.24.57/';

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

		      var cuencas = data.map(function(d) {
		      		return d.CUENCA;
		      });

		      cuencas = _.uniq(cuencas);

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


          cambioAsignacion(data);
          speechBubbles(mapNdataObj);

		      $('.cuenca').on('change',function() {
		      		cambioAsignacion(data);
		      		datosAsignacion(data,null,null,mymap,asignaciones);
		      });


          $('.ubicacion').on('change',function() {
                cambio(data,'tipo',function(d) {
                  return localCond(d,'cuenca') && localCond(d,'ubicacion');
                });

                $('.tipo').trigger('change');
          });


          $('.tipo').on('change',function() {
                cambio(data,'asignacion',function(d) {
                    return localCond(d,'cuenca') && localCond(d,'ubicacion') && localCond(d,'tipo');
                },'NOMBRE');
                $('.asignacion').trigger('change');
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
          data: { ID:$('.asignacion>option:selected').attr('id') },
          success: function(data) {
               for(var k in data) { data[k] = JSON.parse(data[k])}
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



 function grapher(fn,data) {
 	    fn(data);
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
        	 			grapher(LineChart,mapNdataObj.ajaxData.produccion);
        	 			break;

        	 		case id === 'Reservas':
                grapher(enConstruccion)
        	 			//grapher(BarChart)
        	 			break;

        	 		case id === 'Pozos':
        	 			console.log(id)
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
                grapher(BarChart,pozos)
                //grapher(enConstruccion)

        	 			break;

        	 		case id === 'Inversión':
        	 			console.log(id)
                grapher(enConstruccion)

        	 			break;

        	 		case id === 'Compromiso Mínimo de Trabajo':
        	 			console.log(id)
                grapher(enConstruccion)

        	 			break;

        	 		case id === 'Aprovechamiento de gas':
        	 			console.log(id)
                grapher(enConstruccion)

        	 			break;

        	 		case id === 'Dictámenes':
        	 			console.log(id)
                grapher(enConstruccion)

        	 			break;

        	 		case id === 'Autorizaciones':
        	 			console.log(id)
                grapher(enConstruccion)
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
