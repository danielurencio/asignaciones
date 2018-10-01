function Expandir(data,st) {
  this.data = data;
  this.st = st;
  this.categories = {
    'CUENCA':'Todas',
    'UBICACION':'Todas',
    'TIPO':'Todos',
    'NOMBRE':'Todas',
    'ID':'Todas'
  };

};

Expandir.prototype = {
  unicos: function() {
    let uniqs = _.uniq(this.data.map((d) => d[this.st]));
    uniqs = [this.categories[this.st]].concat(uniqs)
    return uniqs;
  },



  objReturn: function(st) {
    let keys = Object.keys(this.categories);
    let obj_ = {}
    for( k in keys ) {
      if( keys[k] != st ) obj_[keys[k]] = this.categories[keys[k]]
    }
    return obj_
  },



  opciones:function(st) {

    let categories =  this.unicos().map((d) => {

        let filtro = this.data.filter((f) => f[this.st] == d);

        let filtro_ =  filtro.map((e) => {
          //return e[st]
            let obj = this.objReturn(st)
            obj[st] = e[st]
            obj[this.st] = d;
            return JSON.stringify(obj);
        });

        var generales = _.uniq(filtro_).map((m) => JSON.parse(m));
/*
        let particulares =filtro.map((e) => {
            let obj = this.objReturn(st);
            obj[st] = e[st]
            obj[this.st] = d;
            obj['NOMBRE'] = e['NOMBRE'];
            obj['ID'] = e['ID'];
            return obj;
        })
*/
        return generales//.concat(particulares);


    });

    return [this.categories].concat(_.flatten(categories));
  },


  opciones_sin:function() {

      return this.unicos().map((d) => {
          let obj = JSON.stringify(this.categories)
          obj = JSON.parse(obj);
          obj[this.st] = d;
          return obj;
      });
  },


  packaged_ops:function(arr) {
      if(arr) {
          pack = arr.map((d) => this.opciones(d));
          pack = _.flatten(pack);
          pack = this.opciones_sin().concat(pack);
      } else {
          pack = this.opciones_sin();
      }

      return pack;
  }

}

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
