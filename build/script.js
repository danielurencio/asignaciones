 $(document).ready(function() {

    d3.json('file_.json',function(err,data_) {
    	d3.json('shapes_.json',function(err,shapes) {

/*------------------------------------------------Highcharts language settings------------------------------------------------------------------*/
			  Highcharts.setOptions({
			  	lang: {
			  		shortMonths:['En','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic']
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

		      var data = data_;//JSON.parse(data);

		      var cuencas = data.map(function(d) {
		      		return d.PROVINCIA;
		      });

		      cuencas = _.uniq(cuencas);

		      cuencas.forEach(function(d) {
		      	if(d) {
		      		$('.cuenca').append('<option>'+ d +'</option>');
		      	}
		      });



			  asignaciones.on('click',function(event) {

				  var id_asignacion = event.layer.feature.properties.ID;
				  var sel_asignacion = data.filter(function(d) { return d.ID == id_asignacion; })[0];

				  $('.cuenca').val(sel_asignacion.PROVINCIA)
					  .trigger('change');

				  $('.asignacion').val(sel_asignacion.NOMBRE)
						.trigger('change');

			  });

          var mapNdataObj = {
            'data':data,
            'asignaciones':asignaciones,
            'mymap':mymap
          };

          cambioAsignacion(data);
          speechBubbles(mapNdataObj);
		      //cambioAsignacion(data);
		      //datosAsignacion(data,null,null,mymap,asignaciones);

		      $('.cuenca').on('change',function() {
		      		cambioAsignacion(data);
		      		datosAsignacion(data,null,null,mymap,asignaciones);
		      });

		      $('.asignacion').on('change',function() {
		      		datosAsignacion(data,null,null,mymap,asignaciones);
		      })

		      $('input.buscador').on('input',function(d) {
		      		inputEnBuscador(d,data);
		      });

		});
  });
});




function datosAsignacion(data,nombre,projection,mymap,asignaciones) {

		var sel_asignacion_obj;

		if(!nombre) { 														// <-- ¿Esto qué?
			sel_asignacion = $('.asignacion>option:selected').text();
		} else {
			sel_asignacion = nombre;
		}

      	var sel_asignacion_obj = data.filter(function(d) { return d.NOMBRE == sel_asignacion; })[0];
console.log(sel_asignacion_obj)
      	var filas = ['NOMBRE','VIGENCIA_ANIOS','VIG_INICIO','VIG_FIN','SUPERFICIE_KM2','ESTATUS'];

      	for(var i in filas) {
      		$('.' + filas[i]).text(sel_asignacion_obj[filas[i]])
      	}


      	for(var k in asignaciones._layers) {
      		if(asignaciones._layers[k].feature.properties.ID == sel_asignacion.split(' - ')[0]) {
      			d3.selectAll('path').transition().duration(800).style('opacity',0)
      			mymap.flyTo(asignaciones._layers[k].getCenter(),10)
      		}
      	}

      	mymap.on('moveend',function(){
      		d3.selectAll('path:not(.'+ sel_asignacion.split(' - ')[0] +')')
      		  .transition()
      		  .duration(500)
      		  .style('opacity',1)
      		  .style('stroke-width',0.5)

      		d3.select('path.' + sel_asignacion.split(' - ')[0])
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



// Esta función maneja los cambios en los elementos 'select' (inserta las opciones según los filtros).
 function cambioAsignacion(data) {
 	  $('.asignacion').html('');
 	  var cuenca_sel = $('.cuenca>option:selected').text()

      var filtro_asig = data.filter(function(d) { return d.PROVINCIA == cuenca_sel; })
      						.map(function(d) { return d.NOMBRE; });
      filtro_asig = _.uniq(filtro_asig);

      filtro_asig.forEach(function(d) {
      	if(d) {
      		$('.asignacion').append('<option>'+ d +'</option>');
      	}
      });

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

		    $('.cuenca').val(sel_asignacion.PROVINCIA)
					          .trigger('change');

		    $('.asignacion').val(nombre)
						            .trigger('change');

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


    	$('#botones_>div').filter(function(i,d) { return i === 0 })
                        .click();

 };





 function clicker(element,mapNdataObj) {

 	  var id = $(element).attr('id');
 	  var clase = $(element).attr('class');

 	  if(clase != 'selectedButton') {
	 	   $('#visor').html('');
	 	   switcher(id,mapNdataObj);
	  }

 };



 function grapher(fn) {
 	    fn();
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
          datosAsignacion(mapNdataObj.data,null,null,mapNdataObj.mymap,mapNdataObj.asignaciones);

        });
        break;

	 		case id === 'Producción':
	 			grapher(LineChart);
	 			break;

	 		case id === 'Reservas':
	 			grapher(BarChart)
	 			break;

	 		case id === 'Pozos':
	 			console.log(id)
	 			break;

	 		case id === 'Inversión':
	 			console.log(id)
	 			break;

	 		case id === 'Compromiso Mínimo de Trabajo':
	 			console.log(id)
	 			break;

	 		case id === 'Aprovechamiento de gas':
	 			console.log(id)
	 			break;

	 		case id === 'Dictámenes':
	 			console.log(id)
	 			break;

	 		case id === 'Autorizaciones':
	 			console.log(id)
	 			break;

	 	}
};
