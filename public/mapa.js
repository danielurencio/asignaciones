function Mapa(projection) {
  var width, height, projection;
  width = $('svg.map').css('width').split('px')[0];
  height = $('svg.map').css('height').split('px')[0];
  //projection = d3.geo.mercator();

  var path = d3.geo.path().projection(projection);

  d3.json('entidades.json',function(err,data) {  	  
  	d3.json('asignaciones.json',function(err,asignaciones){
  		  asigCache = asignaciones
	      var key = Object.keys(asignaciones.objects)[0];
	      var entidades_ = topojson.feature(asignaciones,asignaciones.objects[key]);
	      projection.scale(1).translate([0,0]);

	      var b = path.bounds(entidades_);
	      var s = 0.95 / Math.max((b[1][0]-b[0][0]) / width, (b[1][1] - b[0][1]) / height);
	      var t = [(width-s*(b[1][0]+b[0][0]))/2, (height-s*(b[1][1]+b[0][1]))/2];

	      projection.scale(s).translate(t);

/*
	      var zoom = d3.behavior.zoom()
	      				.translate(t)
	      				.scale(s)
	      				.scaleExtent([s,s*2])
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

*/

	      d3.select('svg.map>g').selectAll('path')
	      	.data(topojson.feature(data,data.objects.shape).features)
	      	.enter().append('path')
	      	.attr('d',path)
	      	.style('fill','silver')//"rgb(121,207,206)")
	      	.style('stroke','white')
	      	.attr('class','ents');

	      d3.select('svg.map>g').selectAll('path')
	      	.data(topojson.feature(asignaciones,asignaciones.objects.shapes).features)
	      	.enter().append('path')
	      	.attr('d',path)
	      	.style('fill',"rgb(1,114,158)")
	      	.style('stroke','white')
	      	.attr('id',function(d) { return d.properties.ID; })
	      	.attr('class','asig');

	      //d3.select('svg.map').attr('viewBox','0 0 ' + width + ' ' + height)

	      d3.select(window).on('resize',function() {
	      	//d3.selectAll('path').remove()
	      	//Mapa(projection)
	      	//mapResize(entidades_,data);
	      });

	});
  });

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
