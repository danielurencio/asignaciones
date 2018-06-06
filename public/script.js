 $(document).ready(function() {
 	//Mapa();

    $.getJSON('file.json',function(data) {
    		  var asigCache;
		      var projection = d3.geo.mercator();
		      Mapa(projection);

 			  window.onresize = function() {
 			  	//var selected = d3.select('.selected');
 			  	//var selectedID = selected.attr('id');
 			  	//var selectedFill = selected.style('fill');

 			  	d3.selectAll('path').remove();
 			  	var projection = d3.geo.mercator();
 			  	Mapa(projection)
 			  	//d3.select('#'+selectedID).style('fill',selectedFill);
 /*----------------------------------Redimensionar los resultados desplegables si es que existen-------------------------------------*/
 				if($('div.resultadosDesplegables')[0]) {
 					$('div.resultadosDesplegables').css('left',resultadosDesplegablesProperties().x)
 									   			   .css('width',resultadosDesplegablesProperties().width - 2);
 				}
/*----------------------------------Redimensionar los resultados desplegables si es que existen-------------------------------------*/
 			  }

		      var data = JSON.stringify(data.filter(function(d) { return d.VIGENTE == 'Vigente'; }))
		      				  .replace(/M\¿xico/g,'México')
		      				  .replace(/Cintur\¿n/g,'Cinturón')
		      				  .replace(/Yucat\¿n/g,'Yucatán');

		      data = JSON.parse(data);

		      var cuencas = data.map(function(d) {
		      		return d.PROVINCIA;
		      });

		      cuencas = _.uniq(cuencas);



		      $('select').filter(function(i,d){
		      	return i == 0;
		      }).attr('class','cuenca');

		      $('select').filter(function(i,d){
		      	return i == 1;
		      }).attr('class','asignacion');

		      cuencas.forEach(function(d) {
		      	if(d) {
		      		$('.cuenca').append('<option>'+ d +'</option>');
		      	}
		      });


		      cambioAsignacion(data);
		      datosAsignacion(data,null,projection);

		      $('.cuenca').on('change',function() {
		      		cambioAsignacion(data);
		      		datosAsignacion(data,null,projection);
		      });

		      $('.asignacion').on('change',function() {
		      		datosAsignacion(data,null,projection);
		      })

		      $('input.buscador').on('input',function(d) {
		      		inputEnBuscador(d,data)
		      });


		      $('button').on('click',function(d) {
		      		$('button').attr('class',null)
		      		$(this).attr('class','selectedButton')
		      });

    });

 });




function datosAsignacion(data,nombre,projection) {

		var sel_asignacion_obj;

		if(!nombre) { 														// <-- ¿Esto qué?
			sel_asignacion = $('.asignacion>option:selected').text();
		} else {
			sel_asignacion_obj = nombre;
		}

      	var sel_asignacion_obj = data.filter(function(d) { return d.NOMBRE == sel_asignacion; })[0];

      	var filas = ['NOMBRE','VIG_INICIO','VIG_FIN','SUPERFICIE_KM2','ESTATUS'];

      	for(var i in filas) {
      		$('.' + filas[i]).text(sel_asignacion_obj[filas[i]])
      	}


      	var zoomAttemp = window.setInterval(function() {

      		try {

      		  var element = d3.select('#' + sel_asignacion_obj.ID);
      		  var datum = element.datum();

      		  var width = $('svg.map').css('width').split('px')[0];
  			  var height = $('svg.map').css('height').split('px')[0];


      		  d3.selectAll('path.asig')
	      		.style('fill',"rgb(1,114,158)");

	      	  d3.selectAll('.selected')
	      	  		.attr('class',null)
	      	  		.style('fill',function() {
	      	  			var color = d3.select('path.asig:not(.selected)').style('fill');
	      	  			return color;
	      	  		})

      		  element.transition()
      		  		 .delay(1500)
      		  		 .duration(1000)
      		  		 .attr('class','selected')
      		  		 .style('fill','rgb(13,180,190)')
 
      		  var path = d3.geo.path().projection(projection);

      		  var bounds = path.bounds(datum),
      			  dx = bounds[1][0] - bounds[0][0],
      			  dy = bounds[1][1] - bounds[0][1],
      			  x = (bounds[0][0] + bounds[1][0]) / 2,
      			  y = (bounds[0][1] + bounds[1][1]) / 2,
      			  scale = .1 / Math.max(dx / width, dy / height),
      			  translate = [width / 2 - scale * x, height / 2 - scale * y];


      		  d3.select('svg.map>g')
      			.transition()
      			.duration(1000)
      			.attr('transform','')
      			.attr('stroke-width',0.5)
      			.each('end',function() {

      			  		d3.select(this)
      			  			.transition()
      			  			.duration(1000)
      			  			.attr('transform','translate('+ translate +')scale('+ scale +')')
      			  			.attr('stroke-width',0.05);

      			});
   
      		  clearInterval(zoomAttemp);

      		} catch(err) {
      			return
      		};

        },100);
};




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
			return '<div class="result_" style="font-size:12px;z-index:2;background-color:transparent;">'+ d.NOMBRE +'</div>'
		})

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




 function resultadosDesplegablesProperties() {
 	var properties = $('input.buscador')[0].getBoundingClientRect();
 	return properties;
 }