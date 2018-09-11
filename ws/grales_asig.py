#!/usr/bin/python
import json
import sys
import cgi
import pandas as pd
import warnings
from sqlalchemy import create_engine
warnings.filterwarnings('ignore')


class Service():
    def __init__(self):
	self.params = cgi.FieldStorage()
        self.ID = self.params.getvalue('ID')
        self.response = None
        self.rows = [
            "Content-Type: application/json; charset=UTF-8",
            "Access-Control-Allow-Origin:*",
            ''
        ]
        self.bd_service = 'cnih';


    def printer(self):
        for i in self.rows:
            print(i)



    def connectionResult(self,query,conn_str):
	c = create_engine(conn_str)
	conn = c.connect()
	df = pd.read_sql(query,conn)
	conn.close()
	return df
	


    def catalogo_general(self):
        query = "SELECT * FROM DATOS_ASIGNACIONES_GRALES"
	conn_str = "oracle://cmde_raw:raw17@172.16.120.3:1521/" + self.bd_service
	df = self.connectionResult(query,conn_str)

        #try:
        #    c = create_engine('oracle://cmde_raw:raw17@172.16.120.3:1521/' + self.bd_service)
        #    conn = c.connect()
        #except:
        #    result = '[]'
        #    self.printer()
        #    print(result)

        #df = pd.read_sql(query,conn)
        #conn.close()

#        for i in ['litologia','tipo','tipo_yacimiento','situacion','formacion','periodo_geo','campos_con_reservas']:
#            df[i] = df[i].str.decode('cp1252').str.encode('utf-8')

        #for i in ['nombre','entidades']:
        #    df[i] = df[i].str.decode('latin1').str.encode('utf-8')

        df.columns = df.columns.map(lambda x:x.upper())
        result = df.to_json(orient='records')
	return result



    def produccion(self):
        query = "SELECT * FROM ASIGNACIONES_PRODUCCION WHERE ID='" + self.ID + "'"
	conn_str = "oracle://cmde_public:public17@172.16.120.3:1521/" + self.bd_service
	df = self.connectionResult(query,conn_str)
	df = df.to_json(orient='records')
        return df



    def pozos_inv(self):
        query = "SELECT * FROM DATOS_ASIGNACIONES_INVPOZOS WHERE ID='" + self.ID +"' "+\
                "ORDER BY FECHA"

        conn_str = 'oracle://cmde_raw:raw17@172.16.120.3:1521/' + self.bd_service
        df = self.connectionResult(query,conn_str)

        for i in ['descriptor','nombre','id']:
            df[i] = df[i].str.decode('latin1').str.encode('utf-8')

        result = df.to_json(orient='records')
        return result


    def inv(self):
	query = "SELECT * FROM DATOS_ASIGNACIONES_INV WHERE ID='" + self.ID + "' " +\
                "ORDER BY ANIO"

	conn_str = 'oracle://cmde_raw:raw17@172.16.120.3:1521/' + self.bd_service
	df = self.connectionResult(query,conn_str)

	for i in ['nombre','actividad','sub_actividad','tarea','tipo','escenario','tipo_aprobacion']:
	    df[i] = df[i].str.decode('latin1').str.encode('utf-8')

	df = df.to_json(orient='records')
	return df


    def reservas(self):
        query = "SELECT FECHA,NOMBRE_ASIG AS NOMBRE,ID_ASIG AS ID,TIPO,SUM(RR_PCE_MMBPCE) AS RR_PCE_MMBPCE FROM RESERVAS_ASIG_CONT_TEST " +\
                "WHERE ID_ASIG='" + self.ID + "' " +\
                "GROUP BY FECHA,TIPO,NOMBRE_ASIG,ID_ASIG ORDER BY FECHA,NOMBRE_ASIG,TIPO"

        conn_str = 'oracle://cmde_public:public17@172.16.120.3:1521/' + self.bd_service

        def transform_reserves(x):
            fechas = x.fecha.unique().tolist()

            for i,d in enumerate(fechas):
                a = x[x.fecha == pd.to_datetime(d)].reset_index().copy()
                b = a.set_index('tipo')[['rr_pce_mmbpce']].transpose().copy()
                b['probadas'] = b['1P']
                b['probables'] = b['2P'] - b['1P']
                b['posibles'] = b['3P'] - b['2P']
                b = b[['probadas','probables','posibles']].transpose().reset_index()
                b.rename(columns={'tipo':'tipo_','rr_pce_mmbpce':'rr'},inplace=True)
                c = pd.concat([a,b],axis=1)
                if i == 0:
                    result = c
                else:
                    result = result.append(c)

            result = result.reset_index()[['fecha','tipo_','nombre','id','rr']]
            result = result.rename(columns={ 'tipo_':'tipo', 'rr':'rr_pce_mmbpce' })
            return result

        df = self.connectionResult(query,conn_str)
        df = transform_reserves(df) if len(df) != 0 else df
        df = df.to_json(orient='records')

        return df


    def cmt(self):
       tipo = 'A' if len(self.ID.split('-')[0]) == 1 else 'AE'

       if(tipo == 'AE'):
           query = "SELECT * FROM DATOS_ASIGNACIONES_CMT_EXP WHERE ID='" + self.ID + "'"
           conn_str = 'oracle://cmde_raw:raw18@172.16.120.3:1521/xe'# + self.bd_service
           df = self.connectionResult(query,conn_str)

           for i in ['nombre','estatus']:
	       df[i] = df[i].str.decode('latin1').str.encode('utf-8')

           df = df.to_json(orient='records')
       else:
           df = '[]'
       return df


    def assembler(self):
        obj = {}
        obj['pozos_inv'] = self.pozos_inv()
        obj['produccion'] = self.produccion()
	obj['inv'] = self.inv()
        obj['reservas'] = self.reservas()
        obj['cmt'] = self.cmt()
        return obj


    def responder(self):
        if 'ID' in self.params.keys():
            self.response = self.assembler()
        else:
            self.response = self.catalogo_general()

        self.printer()
        sys.stdout.write(json.dumps(self.response))


service = Service()


if __name__ == '__main__':
    service.responder()
#    sys.exit()
