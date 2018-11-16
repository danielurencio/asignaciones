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
        self.CUENCA = self.params.getvalue('CUENCA')
        self.UBICACION = self.params.getvalue('UBICACION')
        self.TIPO = self.params.getvalue('TIPO')
        self.response = None
        self.rows = [
            "Content-Type: application/json; charset=UTF-8",
            "Access-Control-Allow-Origin:*",
            ''
        ]
        self.queries = {
            'produccion': "SELECT FECHA,SUM(ACEITE_MBD) AS ACEITE_MBD,SUM(GAS_MMPCD) AS GAS_MMPCD FROM ( " +\
                            "SELECT A.*,B.TIPO,B.CUENCA,B.UBICACION FROM CMDE_PUBLIC.ASIGNACIONES_PRODUCCION A " +\
                            "LEFT JOIN CMDE_RAW.DATOS_ASIGNACIONES_GRALES B " +\
                            "ON A.ID = B.ID " +\
                           ") " + self.conditionalQuery() +\
                           "GROUP BY FECHA",

            'pozos_inv': "SELECT FECHA,DESCRIPTOR,SUM(VALOR) AS VALOR FROM ( " +\
                            "SELECT A.*,B.CUENCA,B.UBICACION,B.TIPO FROM DATOS_ASIGNACIONES_INVPOZOS A " +\
                            "LEFT JOIN DATOS_ASIGNACIONES_GRALES B " +\
                            "ON A.ID = B.ID " +\
                            "ORDER BY FECHA " +\
                          ") " + self.conditionalQuery() +\
                          "GROUP BY FECHA,DESCRIPTOR",

            'inv': "SELECT ANIO,ACTIVIDAD,SUB_ACTIVIDAD,SUM(MONTO_USD) AS MONTO_USD FROM ( "
                     "SELECT A.ID,A.NOMBRE,A.ACTIVIDAD,A.SUB_ACTIVIDAD,A.ANIO,A.MONTO_USD,B.UBICACION,B.CUENCA,B.TIPO " +\
                     "FROM DATOS_ASIGNACIONES_INV A " +\
                     "LEFT JOIN DATOS_ASIGNACIONES_GRALES B " +\
                     "ON A.ID = B.ID " +\
                   ") " + self.conditionalQuery() +\
                   "GROUP BY ANIO,ACTIVIDAD,SUB_ACTIVIDAD",

            'reservas': "SELECT FECHA,TIPO_RESERVAS AS TIPO, SUM(RR_PCE_MMBPCE) AS RR_PCE_MMBPCE, SUM(RR_ACEITE_MMB) AS RR_ACEITE_MMB, SUM(RR_GAS_NATURAL_MMMPC) AS RR_GAS_NATURAL_MMMPC from ( " +\
                           "SELECT A.*, B.CUENCA, B.TIPO, B.UBICACION FROM ( " +\
                             "SELECT FECHA,NOMBRE_ASIG AS NOMBRE,ID_ASIG AS ID, TIPO AS TIPO_RESERVAS, SUM(RR_PCE_MMBPCE) AS RR_PCE_MMBPCE, SUM(RR_ACEITE_MMB) AS RR_ACEITE_MMB, SUM(RR_GAS_NATURAL_MMMPC) AS RR_GAS_NATURAL_MMMPC " +\
                             "FROM CMDE_PUBLIC.RESERVAS_ASIG_CONT_TEST GROUP BY FECHA,TIPO,NOMBRE_ASIG,ID_ASIG " +\
                             "ORDER BY FECHA,NOMBRE_ASIG,TIPO " +\
                           ") A LEFT JOIN CMDE_RAW.DATOS_ASIGNACIONES_GRALES B " +\
                           "ON A.ID = B.ID " +\
                         ") " + self.conditionalQuery() +\
                         "GROUP BY FECHA,TIPO_RESERVAS",
            'cmt_ext': "SELECT ANIO,CONCEPTO,SUM(VALOR) AS VALOR FROM ( " +\
                            "SELECT A.*, B.CUENCA, B.UBICACION, B.TIPO FROM ASIGNACIONES_CMT_EXTRACCION A " +\
                            "LEFT JOIN DATOS_ASIGNACIONES_GRALES B " +\
                            "ON A.ID = B.ID " +\
                        ") " + self.conditionalQuery() +\
                        "GROUP BY ANIO,CONCEPTO " +\
                        "ORDER BY ANIO,CONCEPTO",
            'cmt_exp': "SELECT ANIO,CONCEPTO,SUM(VALOR) AS VALOR FROM ( " +\
                            "SELECT A.*, B.CUENCA, B.UBICACION, B.TIPO FROM ASIGNACIONES_CMT_EXPLORACION A " +\
                            "LEFT JOIN DATOS_ASIGNACIONES_GRALES B " +\
                            "ON A.ID = B.ID " +\
                       ") " + self.conditionalQuery() +\
                       "GROUP BY ANIO,CONCEPTO " +\
                       "ORDER BY ANIO,CONCEPTO",
            'seguimiento_ext': "SELECT ANIO,TIPO_OBSERVACION,CONCEPTO,SUM(VALOR) AS VALOR FROM ( " +\
                                "SELECT A.*, B.CUENCA, B.UBICACION, B.TIPO FROM ASIGNACIONES_SEGUIMIENTO_EXT A " +\
                                "LEFT JOIN DATOS_ASIGNACIONES_GRALES B " +\
                                "ON A.ID = B.ID " +\
                            ") " + self.conditionalQuery() +\
                            "GROUP BY ANIO,TIPO_OBSERVACION,CONCEPTO " +\
                            "ORDER BY ANIO,TIPO_OBSERVACION,CONCEPTO",
            'seguimiento_exp': "SELECT PERIODO,TIPO_OBSERVACION,CONCEPTO,SUM(VALOR) AS VALOR FROM ( " +\
                                "SELECT A.*, B.CUENCA, B.UBICACION, B.TIPO FROM ASIGNACIONES_SEGUIMIENTO_EXP A " +\
                                "LEFT JOIN DATOS_ASIGNACIONES_GRALES B " +\
                                "ON A.ID = B.ID " +\
                            ") " + self.conditionalQuery() +\
                            "GROUP BY PERIODO,TIPO_OBSERVACION,CONCEPTO " +\
                            "ORDER BY PERIODO,TIPO_OBSERVACION,CONCEPTO",
            'aprovechamiento': "SELECT FECHA,VALOR FROM ( " +\
                                   "SELECT FECHA,CONCEPTO,SUM(VALOR) AS VALOR FROM ( " +\
                                        "SELECT A.*, B.CUENCA,B.TIPO,B.UBICACION FROM ASIGNACIONES_APROVECHAMIENTO A " +\
                                        "LEFT JOIN DATOS_ASIGNACIONES_GRALES B " +\
                                        "ON A.ID = B.ID " +\
                                   ") " + self.conditionalQuery() +\
                                   "GROUP BY FECHA,CONCEPTO " +\
                                   "ORDER BY FECHA,CONCEPTO " +\
                               ") WHERE CONCEPTO = 'Gas natural No aprovechado  (mmpcd)'"
        }
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
        query = "SELECT * FROM DATOS_ASIGNACIONES_GRALES WHERE VIGENTE = 1"
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


    def conditionalQuery(self):
        keys = self.params.keys()
        items = [ (k,"'" + self.params.getvalue(k) + "'") for k in keys ]
        filtro = filter(lambda x:x[1][1:4] != 'Tod',items)
        query = ' AND '.join(map(lambda x:'='.join(x),filtro))
        return 'WHERE ' + query + ' ' if query else query


    def produccion(self):
        if(self.ID != 'Todas'):
            query = "SELECT * FROM CMDE_PUBLIC.ASIGNACIONES_PRODUCCION WHERE ID='" + self.ID + "'"
        else:
            query = self.queries['produccion'] 

	conn_str = "oracle://durencio:daniel2017@172.16.120.3:1521/" + self.bd_service
	df = self.connectionResult(query,conn_str)
	df = df.to_json(orient='records')
        return df



    def pozos_inv(self):
        if(self.ID != 'Todas'):
            query = "SELECT * FROM DATOS_ASIGNACIONES_INVPOZOS WHERE ID='" + self.ID +"' "+\
                    "ORDER BY FECHA"
        else:
            query = self.queries['pozos_inv']

        conn_str = 'oracle://cmde_raw:raw17@172.16.120.3:1521/' + self.bd_service
        df = self.connectionResult(query,conn_str)

        #for i in ['descriptor','nombre','id']:
        #    df[i] = df[i].str.decode('latin1').str.encode('utf-8')

        result = df.to_json(orient='records')
        return result


    def inv(self):
        if(self.ID != 'Todas'):
	    query = "SELECT * FROM DATOS_ASIGNACIONES_INV WHERE ID='" + self.ID + "' " +\
                    "ORDER BY ANIO"
        else:
            query = self.queries['inv']

	conn_str = 'oracle://cmde_raw:raw17@172.16.120.3:1521/' + self.bd_service
	df = self.connectionResult(query,conn_str)

	#for i in ['nombre','actividad','sub_actividad','tarea','tipo','escenario','tipo_aprobacion']:
	#    df[i] = df[i].str.decode('latin1').str.encode('utf-8')

	df = df.to_json(orient='records')
	return df


    def reservas(self):
        if(self.ID != 'Todas'):
            query = "SELECT FECHA,TIPO,SUM(RR_PCE_MMBPCE) AS RR_PCE_MMBPCE,SUM(RR_ACEITE_MMB) AS RR_ACEITE_MMB, SUM(RR_GAS_NATURAL_MMMPC) AS RR_GAS_NATURAL_MMMPC FROM CMDE_PUBLIC.RESERVAS_ASIG_CONT_TEST " +\
                    "WHERE ID_ASIG='" + self.ID + "' " +\
                    "GROUP BY FECHA,TIPO,NOMBRE_ASIG,ID_ASIG ORDER BY FECHA,NOMBRE_ASIG,TIPO"
        else:
            query = self.queries['reservas']

        conn_str = 'oracle://durencio:daniel2017@172.16.120.3:1521/' + self.bd_service

        def transform_reserves(x,col):
            fechas = x.fecha.unique().tolist()

            for i,d in enumerate(fechas):
                a = x[x.fecha == pd.to_datetime(d)].reset_index().copy()
                b = a.set_index('tipo')[[col]].transpose().copy()
                b['probadas'] = b['1P']
                b['probables'] = b['2P'] - b['1P']
                b['posibles'] = b['3P'] - b['2P']
                b = b[['probadas','probables','posibles']].transpose().reset_index()
                b.rename(columns={'tipo':'tipo_',col:'rr'},inplace=True)
                c = pd.concat([a,b],axis=1)
                if i == 0:
                    result = c
                else:
                    result = result.append(c)

            cols = ['fecha','tipo_','rr']#['fecha','tipo_','nombre','id','rr'] if self.ID != 'Todas' else ['fecha','tipo_','rr']
            result = result.reset_index()[cols]
            result = result.rename(columns={ 'tipo_':'tipo', 'rr':col })
            return result


        df = self.connectionResult(query,conn_str)
        #df = transform_reserves(df) if len(df) != 0 else df

        def transform_All(col):
            return transform_reserves(df,col).set_index(['fecha','tipo'])

        def get_rr(df,cols):
            results = map(transform_All,cols)
            df_ = pd.concat(results,axis=1).reset_index()
            return df_

        
        df = get_rr(df,['rr_pce_mmbpce','rr_aceite_mmb','rr_gas_natural_mmmpc']) if len(df) != 0 else df
        df = df.to_json(orient='records')

        return df

    
    def cmt(self):

        conn_str = 'oracle://cmde_raw:raw17@172.16.120.3:1521/cnih'

        if(self.ID != 'Todas'):
            tipo = 'A' if len(self.ID.split('-')[0]) == 1 else 'AE'

            if(tipo == 'AE'):
                query = "SELECT ANIO,CONCEPTO,VALOR FROM ASIGNACIONES_CMT_EXPLORACION WHERE ID='" + self.ID + "'"
                df = self.connectionResult(query,conn_str)

                #for i in ['nombre','estatus']:
                #    df[i] = df[i].str.decode('latin1').str.encode('utf-8')


            elif(tipo == 'A'):
                query = "SELECT ANIO,CONCEPTO,VALOR FROM ASIGNACIONES_CMT_EXTRACCION WHERE ID='" + self.ID + "'"
                df = self.connectionResult(query,conn_str)

            df = df.to_json(orient='records')

        else:
            query_exp = self.queries['cmt_exp']
            query_ext = self.queries['cmt_ext']

            df_exp = self.connectionResult(query_exp,conn_str).to_json(orient='records')
            df_ext = self.connectionResult(query_ext,conn_str).to_json(orient='records')

            df = json.dumps({ "exp":df_exp, "ext":df_ext })

        return df


    def seguimiento(self):
        conn_str = "oracle://cmde_raw:raw17@172.16.120.3:1521/cnih"

        if(self.ID != 'Todas'):
            tipo = 'A' if len(self.ID.split('-')[0]) == 1 else 'AE'

            if(tipo == 'AE'):
                query = "SELECT PERIODO,CONCEPTO,VALOR,TIPO_OBSERVACION FROM ASIGNACIONES_SEGUIMIENTO_EXP WHERE ID='" + self.ID + "'"
                df = self.connectionResult(query,conn_str)

            elif(tipo == 'A'):
                query = "SELECT ANIO,CONCEPTO,VALOR,TIPO_OBSERVACION FROM ASIGNACIONES_SEGUIMIENTO_EXT WHERE ID='" + self.ID + "'"
                df = self.connectionResult(query,conn_str)
            
            df = df.to_json(orient='records')

        else:
            query_exp = self.queries['seguimiento_exp']
            query_ext = self.queries['seguimiento_ext']

            df_exp = self.connectionResult(query_exp,conn_str).to_json(orient='records')
            df_ext = self.connectionResult(query_ext,conn_str).to_json(orient='records')

            df = json.dumps({ 'exp':df_exp, 'ext':df_ext })

        return df


    def aprovechamiento(self):
        if(self.ID != 'Todas'):
            query = "SELECT * FROM ASIGNACIONES_APROVECHAMIENTO WHERE ID='" + self.ID + "' AND CONCEPTO = 'Gas natural No aprovechado  (mmpcd)'"
        else:
            query = self.queries['aprovechamiento']

        conn_str = "oracle://cmde_raw:raw17@172.16.120.3:1521/cnih"
        df = self.connectionResult(query,conn_str)
        df = df.to_json(orient='records')
        return df


    def assembler(self):
        obj = {}
        obj['pozos_inv'] = self.pozos_inv()
        obj['produccion'] = self.produccion()
	obj['inv'] = self.inv()
        obj['reservas'] = self.reservas()
        obj['cmt'] = self.cmt()
        obj['seguimiento'] = self.seguimiento()
        obj['aprovechamiento'] = self.aprovechamiento()
        return obj


    def responder(self):
        if self.ID is None:
            self.response = self.catalogo_general()
        else:
            self.response = self.assembler()

        self.printer()
        sys.stdout.write(json.dumps(self.response))


service = Service()


if __name__ == '__main__':
    service.responder()
#    sys.exit()
