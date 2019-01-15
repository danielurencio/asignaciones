'use strict';

function Expandir(data, st) {
    this.data = data;
    this.st = st;
    this.categories = {
        'CUENCA': 'Todas',
        'UBICACION': 'Todas',
        'TIPO': 'Todos',
        'NOMBRE': 'Todas',
        'ID': 'Todas'
    };
};

Expandir.prototype = {
    unicos: function unicos() {
        var _this = this;

        var uniqs = _.uniq(this.data.map(function (d) {
            return d[_this.st];
        }));
        uniqs = [this.categories[this.st]].concat(uniqs);
        return uniqs;
    },

    objReturn: function objReturn(st) {
        var keys = Object.keys(this.categories);
        var obj_ = {};
        for (k in keys) {
            if (keys[k] != st) obj_[keys[k]] = this.categories[keys[k]];
        }
        return obj_;
    },

    opciones: function opciones(st) {
        var _this2 = this;

        var categories = this.unicos().map(function (d) {

            var filtro = _this2.data.filter(function (f) {
                return f[_this2.st] == d;
            });

            var filtro_ = filtro.map(function (e) {
                //return e[st]
                var obj = _this2.objReturn(st);
                obj[st] = e[st];
                obj[_this2.st] = d;
                return JSON.stringify(obj);
            });

            var generales = _.uniq(filtro_).map(function (m) {
                return JSON.parse(m);
            });
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
            return generales; //.concat(particulares);

        });

        return [this.categories].concat(_.flatten(categories));
    },

    opciones_sin: function opciones_sin() {
        var _this3 = this;

        return this.unicos().map(function (d) {
            var obj = JSON.stringify(_this3.categories);
            obj = JSON.parse(obj);
            obj[_this3.st] = d;
            return obj;
        });
    },

    packaged_ops: function packaged_ops(arr) {
        var _this4 = this;

        if (arr) {
            pack = arr.map(function (d) {
                return _this4.opciones(d);
            });
            pack = _.flatten(pack);
            pack = this.opciones_sin().concat(pack);
        } else {
            pack = this.opciones_sin();
        }

        return pack;
    }

};

function extras_(arr, st, params, special) {
    var resultado = arr.map(function (d) {
        return data.filter(function (f) {
            return f[st] == d;
        }).map(function (m) {
            var obj = {};

            for (var p in params) {
                if (params[p] == special) {
                    obj[special] = m[special];
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
