descargar() {
  for i in Exploraci%C3%B3n Extracci%C3%B3n Resguardo Estados; do
    dir=$(echo ${i} | sed s/%C3%B3/o/g);
    curl -O -J https://portal.cnih.cnh.gob.mx/iicnih2/downloads/es_MX/$i.zip;
    mkdir $dir;
    unzip ${i}.zip -d ${dir};
    rm ${i}.zip;
    unzip ${dir}/*.zip -d ${dir}
    ogr2ogr -f GeoJSON ${dir}.json ${dir}/*.shp
  done

  #rm */*.xls;
  #rm */*.zip;
  rm -r */;

#  topojson -o asignaciones.json --properties ID=ASIGNACION 
}
