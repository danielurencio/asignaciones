function leafletMap(shapes) {
/*
	   var tipos = ['Resguardo','Exploración','Extracción'];

		 // Estas líneas tienen como proósito cambiar el orden en el que aparecen los shapes.
		 var newShapesOrder = tipos.map(function(t) {
					 var filtro = shapes.features.filter(function(d) {
						 return d.properties.tipo == t;
					 });

					 return filtro;
		 });

		 newShapesOrder = _.flatten(newShapesOrder);
		 shapes.features = newShapesOrder;
		 // Estas líneas tienen como proósito cambiar el orden en el que aparecen los shapes.
*/
			var polygonColor = {
				'Extracción':'rgb(13,180,190)',//'rgb(1,114,158)',
				'Extracción Temporal':'rgb(46,112,138)',
				'Resguardo':'rgb(20,50,90)',
				'Exploración':'rgb(13,150,190)',
				'Exploración y Extracción':'rgb(20,70,110)'
			};

			var mymap = L.map('MAPA',{
					attributionControl:false,
					zoomAnimation:true
				})
				.setView([22.0, -97.0], 6.3);

			var asignaciones = L.geoJSON(shapes,{
				id:function(feature) {
					return feature.properties.id;
				},
				style:function(feature) {

					switch(feature.properties.tipo) {

						case 'Resguardo': return {
							color:'white',
							fillColor:polygonColor['Resguardo'],
							weight:0.5,
							fillOpacity:0.7,
							className:feature.properties.id
						};

						case 'Extracción': return {
							color:'white',
							fillColor:polygonColor['Extracción'],
							weight:0.5,
							fillOpacity:0.7,
							className:feature.properties.id,
							zIndex:3
						};

						case 'Exploración': return {
							color:'white',
							fillColor:polygonColor['Exploración'],
							weight:0.5,
							fillOpacity:0.7,
							className:feature.properties.id,
							zIndex:2
						};

						case 'Exploración y Extracción': return {
							color:'white',
							fillColor:polygonColor['Exploración y Extracción'],
							weight:0.5,
							fillOpacity:0.7,
							className:feature.properties.id,
							zIndex:2
						};

						case 'Extracción Temporal': return {
							color:'white',
							fillColor:polygonColor['Extracción temporal'],
							weight:0.5,
							fillOpacity:0.7,
							className:feature.properties.id,
							zIndex:2
						};

					}
				}
		  }).addTo(mymap);


			asignaciones.bindTooltip(function(layer) {
				return layer.feature.properties.nombre;
			},{
				className:'polygonTooltip'
			});


			var OpenStreetMap_BlackAndWhite = L.tileLayer('http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png',{//'http://{s}.tiles.wmflabs.org/bw-mapnik/{z}/{x}/{y}.png', {
																	maxZoom: 18,
																	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
			}).addTo(mymap);


			var legend = L.control({ position:'bottomleft' });
			var legendStr =
				'<div id="mapLegend">' +
						'<div style="font-weight:800;padding-bottom:5px;">Tipos de Asignación</div>' +
						'<div style="text-align:left;">' +
							'<span style="color:'+ polygonColor['Extracción'] +'">&block;</span>&ensp;Extracción&ensp;<br>' +
							'<span style="color:'+ polygonColor['Exploración'] +'">&block;</span>&ensp;Exploración<br>'+
							'<span style="color:'+ polygonColor['Extracción Temporal'] +'">&block;</span>&ensp;Extracción Temporal&ensp;<br>' +
							'<span style="color:'+ polygonColor['Exploración y Extracción'] +'">&block;</span>&ensp;Exploración y Extracción&ensp;<br>' +
							'<span style="color:'+ polygonColor['Resguardo'] +'">&block;</span>&ensp;Resguardo&nbsp;'
						'</div>'
				'</div>';

			legend.onAdd = function(map) {
				var div = L.DomUtil.create('div','info legend');

				div.innerHTML = legendStr;

				return div;
			};

			legend.addTo(mymap)


			var datos_grales_ = L.control({ position:'bottomright' });
			var legendStr =
				'<div id="mapLegend">' +
				  '<div class="NOMBRE" style="font-weight:800;text-align:center;padding:8px;"></div>' +
					"<table style='width:100%; marginLeft:0%;paddingRight:0%;maxHeight:50%'>" +
						"<tbody style='height:70%;fontWeight:900'>" +

							"<tr>" +
								"<td>Vigencia (años):&nbsp;</td>" +
								"<td class='VIG_ANIOS'></td>" +
							"</tr>" +

							"<tr>" +
								"<td>Inicio de vigencia:&nbsp;</td>" +
								"<td class='VIG_INICIO'></td>" +
							"</tr>" +
							"<tr>" +
								"<td>Fin de vigencia:&nbsp;</td>" +
								"<td class='VIG_FIN'></td>" +
							"</tr>" +
							"<tr>" +
								"<td>Superficie (km<sup>2</sup>):&nbsp;</td>"+
								"<td class='SUPERFICIE_KM2'></td>" +
							"</tr>" +
							"<tr>" +
								"<td>Tipo:&nbsp;</td>" +
								"<td class='TIPO'></td>" +
							"</tr>" +
						"</tbody>" +
					"</table>" +
				'</div>';

			datos_grales_.onAdd = function(map) {
				var div = L.DomUtil.create('div','info legend');

				div.innerHTML = legendStr;

				return div;
			};

			//datos_grales_.addTo(mymap)


			return [asignaciones,mymap];
};


function Mapa(projection) {
  var width, height, projection;
  width = $('svg.map').css('width').split('px')[0];
  height = $('svg.map').css('height').split('px')[0];
  //projection = d3.geo.mercator();

  var path = d3.geo.path().projection(projection);

  //d3.json('entidades.json',function(err,data) {
  	d3.json('asig.json',function(err,asignaciones){
  		  console.log(asignaciones)
  		  asigCache = asignaciones
	      var key = Object.keys(asignaciones.objects)[0];
	      var entidades_ = topojson.feature(asignaciones,asignaciones.objects[key]);
	      projection.scale(1).translate([0,0]);

	      var b = path.bounds(entidades_);
	      var s = 0.95 / Math.max((b[1][0]-b[0][0]) / width, (b[1][1] - b[0][1]) / height);
	      var t = [(width-s*(b[1][0]+b[0][0]))/2, (height-s*(b[1][1]+b[0][1]))/2];

	      projection.scale(s).translate(t);


	      var zoom = d3.behavior.zoom()
	      				.translate(t)
	      				.scale(s)
	      				.scaleExtent([s,s*3])
	      				.on('zoom',zoomed)


	      function zoomed() {
 				projection
			      .translate(zoom.translate())
      			  .scale(zoom.scale());

  				d3.select('svg.map>g').selectAll("path")
      				.attr("d", path);
		  }


		  d3.select('svg.map').call(zoom)
		  					  .call(zoom.event);

/*
	      d3.select('svg.map>g').selectAll('path')
	      	.data(topojson.feature(data,data.objects.shape).features)
	      	.enter().append('path')
	      	.attr('d',path)
	      	.style('fill','silver')//"rgb(121,207,206)")
	      	.style('stroke','white')
	      	.attr('class','ents');
*/

	      d3.select('svg.map>g').selectAll('path')
	      	.data(topojson.feature(asignaciones,asignaciones.objects.shapes).features)
	      	.enter().append('path')
	      	.attr('d',path)
	      	.style('fill',function(d) {
	      		var color = d.properties.TIPO == 'ENTIDAD' ? 'red' : 'gray';
	      		return color;
	      	})//"rgb(1,114,158)")
	      	.style('stroke','white')
	      	.attr('id',function(d) { return d.properties.ID; })
	      	.attr('class','asig');

	      //d3.select('svg.map').attr('viewBox','0 0 ' + width + ' ' + height)


	});
 // });

};



function mapResize(topojsonFeature) {
	var width = $('svg.map').css('width').split('px')[0];
  	var height = $('svg.map').css('height').split('px')[0];

	var proj = d3.geo.mercator();
	var path = d3.geo.path().projection(proj);
	//var path_ents = d3.geo.path.projection(proj)
	proj.scale(1).translate([0,0]);

	var b = path.bounds(topojsonFeature);
	var s = 0.95 / Math.max((b[1][0]-b[0][0]) / width, (b[1][1] - b[0][1]) / height);
	var t = [(width-s*(b[1][0]+b[0][0]))/2, (height-s*(b[1][1]+b[0][1]))/2];

	proj.scale(s).translate(t);

	d3.selectAll('path.asig')
		.attr('d',path)
/*
	d3.selectAll('path.asig')
		.style('fill','silver')
		.attr('d',path)
	  //.attr('transform','scale('+ s +')')
*/
}
