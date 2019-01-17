#!/usr/bin/python
import json
import sys
#reload(sys)
#sys.setdefaultencoding('utf-8')
import cgi
import pandas as pd
import warnings
from sqlalchemy import create_engine
warnings.filterwarnings('ignore')
#import os
#os.environ["NLS_LANG"] = "MEXICAN SPANISH_MEXICO.WE8MSWIN1252"


class Service():
    def __init__(self):
        self.connStr = 'mssql+pyodbc://daniel.urencio:Hola1234.@UMBRACOSQL03\\CNHSQLU03/estadisticas?driver=SQL+Server'
        self.engine = create_engine(self.connStr)
        self.params = cgi.FieldStorage()
        self.ID = self.params.getvalue('ID')
        self.CONFIG = self.params.getvalue('CONFIG')
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
#            'produccion_': "SELECT FECHA,SUM(ACEITE_MBD) AS ACEITE_MBD,SUM(GAS_MMPCD) AS GAS_MMPCD FROM ( " +\
#                            "SELECT A.*,B.TIPO,B.CUENCA,B.UBICACION FROM CMDE_PUBLIC.ASIGNACIONES_PRODUCCION A " +\
#                            "LEFT JOIN CMDE_RAW.ASIGNACIONES_GRALES B " +\
#                            "ON A.ID = B.ID " +\
#                           ") " + self.conditionalQuery() +\
#                           "GROUP BY FECHA",

            'produccion': u"SELECT FECHA,SUM(ACEITE_MBD) AS ACEITE_MBD, SUM(GAS_MMPCD) AS GAS_MMPCD FROM ASIGNACIONES_PRODUCCION " +\
	                  "WHERE ID IN ( " +\
			  "  SELECT DISTINCT ID FROM ASIGNACIONES_GRALES " + self.conditionalQuery() +\
			  ") GROUP BY FECHA",

#            'pozos_inv_': "SELECT FECHA,DESCRIPTOR,SUM(VALOR) AS VALOR FROM ( " +\
#                            "SELECT A.*,B.CUENCA,B.UBICACION,B.TIPO FROM ASIGNACIONES_INVPOZOS A " +\
#                            "LEFT JOIN ASIGNACIONES_GRALES B " +\
#                            "ON A.ID = B.ID " +\
#                            "ORDER BY FECHA " +\
#                          ") " + self.conditionalQuery() +\
#                          "GROUP BY FECHA,DESCRIPTOR",

            'pozos_inv': "SELECT * FROM (" +\
	                 "SELECT FECHA,DESCRIPTOR,SUM(VALOR) AS VALOR FROM ASIGNACIONES_INVPOZOS " +\
                         "WHERE ID IN ( " +\
                         "  SELECT DISTINCT ID FROM ASIGNACIONES_GRALES " + self.conditionalQuery() +\
                         ") GROUP BY FECHA,DESCRIPTOR" +\
			 ") AS FOO WHERE FECHA >= '2015/01/01' ORDER BY FECHA,DESCRIPTOR",

            'inv': "SELECT ANIO,ACTIVIDAD,SUB_ACTIVIDAD,SUM(MONTO_USD) AS MONTO_USD FROM ( "
                     "SELECT A.ID,A.NOMBRE,A.ACTIVIDAD,A.SUB_ACTIVIDAD,A.ANIO,A.MONTO_USD,B.UBICACION,B.CUENCA,B.TIPO " +\
                     "FROM ASIGNACIONES_INV A " +\
                     "LEFT JOIN ASIGNACIONES_GRALES B " +\
                     "ON A.ID = B.ID " +\
                   ") " + self.conditionalQuery() +\
                   "GROUP BY ANIO,ACTIVIDAD,SUB_ACTIVIDAD",

            'reservas_': "SELECT FECHA,TIPO_RESERVAS AS TIPO, SUM(RR_PCE_MMBPCE) AS RR_PCE_MMBPCE, SUM(RR_ACEITE_MMB) AS RR_ACEITE_MMB, SUM(RR_GAS_NATURAL_MMMPC) AS RR_GAS_NATURAL_MMMPC from ( " +\
                           "SELECT A.*, B.CUENCA, B.TIPO, B.UBICACION FROM ( " +\
                             "SELECT FECHA,NOMBRE_ASIG AS NOMBRE,ID_ASIG AS ID, TIPO AS TIPO_RESERVAS, SUM(RR_PCE_MMBPCE) AS RR_PCE_MMBPCE, SUM(RR_ACEITE_MMB) AS RR_ACEITE_MMB, SUM(RR_GAS_NATURAL_MMMPC) AS RR_GAS_NATURAL_MMMPC " +\
                             "FROM CMDE_PUBLIC.RESERVAS_ASIG_CONT_TEST WHERE ASIGNACION_CONTRATO LIKE 'A%' GROUP BY FECHA,TIPO,NOMBRE_ASIG,ID_ASIG " +\
                             "ORDER BY FECHA,NOMBRE_ASIG,TIPO " +\
                           ") A LEFT JOIN CMDE_RAW.ASIGNACIONES_GRALES B " +\
                           "ON A.ID = B.ID " +\
                         ") " + self.conditionalQuery() +\
                         "GROUP BY FECHA,TIPO_RESERVAS",

            'reservas': "SELECT FECHA,TIPO,SUM(RR_PCE_MMBPCE) AS RR_PCE_MMBPCE, SUM(RR_ACEITE_MMB) AS RR_ACEITE_MMB, SUM(RR_GAS_NATURAL_MMMPC) AS RR_GAS_NATURAL_MMMPC FROM RESERVAS_ASIG_CONT_TEST " +\
                        "WHERE ID_ASIG IN ( " +\
                          " SELECT DISTINCT ID FROM ASIGNACIONES_GRALES " + self.conditionalQuery() +\
                        ") GROUP BY FECHA,TIPO ORDER BY FECHA,TIPO",

            'cmt_ext_': "SELECT ANIO,CONCEPTO,SUM(VALOR) AS VALOR FROM ( " +\
                            "SELECT A.*, B.CUENCA, B.UBICACION, B.TIPO FROM (SELECT * FROM ASIGNACIONES_CMT_EXTRACCION WHERE CONCEPTO NOT IN ('Qo','Qg')) A " +\
                            "LEFT JOIN ASIGNACIONES_GRALES B " +\
                            "ON A.ID = B.ID " +\
                        ") " + self.conditionalQuery() +\
                        "GROUP BY ANIO,CONCEPTO " +\
                        "ORDER BY ANIO,CONCEPTO",

            'cmt_ext': "SELECT ANIO,CONCEPTO,SUM(VALOR) AS VALOR FROM ASIGNACIONES_CMT_EXTRACCION WHERE CONCEPTO NOT IN ('Qo','Qg') AND " +\
                       " ID IN ( SELECT DISTINCT ID FROM ASIGNACIONES_GRALES "+ self.conditionalQuery() +") "+\
                       "GROUP BY ANIO,CONCEPTO ORDER BY ANIO,CONCEPTO",

            'cmt_exp_': "SELECT ANIO,CONCEPTO,SUM(VALOR) AS VALOR FROM ( " +\
                            "SELECT A.*, B.CUENCA, B.UBICACION, B.TIPO FROM ASIGNACIONES_CMT_EXPLORACION A " +\
                            "LEFT JOIN ASIGNACIONES_GRALES B " +\
                            "ON A.ID = B.ID " +\
                       ") " + self.conditionalQuery() +\
                       "GROUP BY ANIO,CONCEPTO " +\
                       "ORDER BY ANIO,CONCEPTO",

            'cmt_exp':"SELECT ANIO,CONCEPTO,SUM(VALOR) AS VALOR FROM ASIGNACIONES_CMT_EXPLORACION " +\
                        "WHERE ID IN ( SELECT DISTINCT ID FROM ASIGNACIONES_GRALES "+ self.conditionalQuery() +" ) "+\
                        "GROUP BY ANIO,CONCEPTO ORDER BY ANIO,CONCEPTO",

            'seguimiento_ext_': "SELECT ANIO,TIPO_OBSERVACION,CONCEPTO,SUM(VALOR) AS VALOR FROM ( " +\
                                "SELECT A.*, B.CUENCA, B.UBICACION, B.TIPO FROM ("+\
                                    "SELECT * FROM ASIGNACIONES_SEGUIMIENTO_EXT WHERE CONCEPTO NOT IN ('Np','Gp')" +\
                                    "ORDER BY " +\
                                      "CASE " +\
                                        "WHEN CONCEPTO = 'Perf_Des' THEN 1 " +\
                                        "WHEN CONCEPTO = 'Perf_Iny' THEN 2 " +\
                                        "WHEN CONCEPTO = 'Term_Des' THEN 3 " +\
                                        "WHEN CONCEPTO = 'Term_Iny' THEN 4 " +\
                                        "WHEN CONCEPTO = 'RMA' THEN 5 " +\
                                        "WHEN CONCEPTO = 'RME' THEN 6 " +\
                                        "WHEN CONCEPTO = 'Tap' THEN 7 " +\
                                        "WHEN CONCEPTO = 'Qo' THEN 8 " +\
                                        "WHEN CONCEPTO = 'Qg' THEN 9 " +\
                                        "WHEN CONCEPTO = 'QgHC' THEN 10 " +\
                                        "WHEN CONCEPTO = 'Inv' THEN 11 " +\
                                        "WHEN CONCEPTO = 'G_Op' THEN 12 " +\
                                      "END " +\
                                ") A " +\
                                "LEFT JOIN ASIGNACIONES_GRALES B " +\
                                "ON A.ID = B.ID " +\
                            ") " + self.conditionalQuery() +\
                            "GROUP BY ANIO,TIPO_OBSERVACION,CONCEPTO " +\
                            "ORDER BY ANIO,TIPO_OBSERVACION,CONCEPTO",

            'seguimiento_ext': "SELECT ANIO,TIPO_OBSERVACION,CONCEPTO,SUM(VALOR) AS VALOR FROM ASIGNACIONES_SEGUIMIENTO_EXT " +\
                               "WHERE CONCEPTO NOT IN ('Np','Gp') AND ID IN ( SELECT DISTINCT ID FROM ASIGNACIONES_GRALES "+ self.conditionalQuery() +") " +\
                               "GROUP BY ANIO,TIPO_OBSERVACION,CONCEPTO ORDER BY ANIO,TIPO_OBSERVACION,CONCEPTO",

            'seguimiento_exp_': "SELECT ANIO,TIPO_OBSERVACION,CONCEPTO,SUM(VALOR) AS VALOR FROM ( " +\
                                "SELECT A.*, B.CUENCA, B.UBICACION, B.TIPO FROM ASIGNACIONES_SEGUIMIENTO_EXP_NEW A " +\
                                "LEFT JOIN ASIGNACIONES_GRALES B " +\
                                "ON A.ID = B.ID " +\
                            ") " + self.conditionalQuery() +\
                            "GROUP BY ANIO,TIPO_OBSERVACION,CONCEPTO " +\
                            "ORDER BY ANIO,TIPO_OBSERVACION,CONCEPTO",

            'seguimiento_exp': "SELECT ANIO,TIPO_OBSERVACION,CONCEPTO,SUM(VALOR) AS VALOR FROM ASIGNACIONES_SEGUIMIENTO_EXP "+\
                               "WHERE ID IN ( SELECT DISTINCT ID FROM ASIGNACIONES_GRALES "+ self.conditionalQuery() +") "+\
                               "GROUP BY ANIO,TIPO_OBSERVACION,CONCEPTO ORDER BY 1,2,3",

            'aprovechamiento_': "SELECT FECHA,VALOR FROM ( " +\
                                   "SELECT FECHA,CONCEPTO,SUM(VALOR) AS VALOR FROM ( " +\
                                        "SELECT A.*, B.CUENCA,B.TIPO,B.UBICACION FROM ASIGNACIONES_APROVECHAMIENTO A " +\
                                        "LEFT JOIN ASIGNACIONES_GRALES B " +\
                                        "ON A.ID = B.ID " +\
                                   ") " + self.conditionalQuery() +\
                                   "GROUP BY FECHA,CONCEPTO " +\
                                   "ORDER BY FECHA,CONCEPTO " +\
                               ") WHERE CONCEPTO = 'Gas natural No aprovechado  (mmpcd)'",

            'aprovechamiento': "SELECT FECHA,SUM(VALOR) AS VALOR FROM ASIGNACIONES_APROVECHAMIENTO "+\
                               "WHERE CONCEPTO = 'Gas natural No aprovechado  (mmpcd)' AND "+\
                               "ID IN ( SELECT DISTINCT ID FROM ASIGNACIONES_GRALES "+ self.conditionalQuery() +" ) " +\
                               "GROUP BY FECHA,CONCEPTO ORDER BY FECHA"
        }
        self.bd_service = 'cnih';


    def printer(self):
        for i in self.rows:
            print(i)



    def connectionResult(self,query,conn_str):
        c = create_engine(conn_str)
        conn = c.connect()
        df = pd.read_sql(query,conn)
        df.columns = df.columns.str.lower()
        conn.close()
        return df



    def catalogo_general(self):
        query = "SELECT * FROM ASIGNACIONES_GRALES WHERE VIGENTE = 1"
        #conn_str = "oracle://cmde_raw:raw17@172.16.120.3:1521/" + self.bd_service
        df = self.connectionResult(query,self.connStr)#conn_str)

        #try:
        #    c = create_engine('oracle://cmde_raw:raw17@172.16.120.3:1521/' + self.bd_service)
        #    conn = c.connect()
        #except:
        #    result = '[]'
        #    self.printer()
        #    print(result)

        #df = pd.read_sql(query,conn)
        #conn.close()

        #for i in ['litologia','tipo','tipo_yacimiento','situacion','formacion','periodo_geo','campos_con_reservas']:
        #    df[i] = df[i].str.decode('latin1').str.encode('utf-8')

        #for i in ['nombre','entidades']:
        #    df[i] = df[i].str.decode('latin1').str.encode('utf-8')

        df.columns = df.columns.map(lambda x:x.upper())
        result = df.to_json(orient='records')
        return result


    def conditionalQuery(self):
        keys = self.params.keys()
        items = [ (k,"'" + self.params.getvalue(k) + "'") for k in keys ]
        filtro = list(filter(lambda x:x[1][1:4] != 'Tod',items))
        query = ' AND '.join(map(lambda x:'='.join(x),filtro))
        return 'WHERE ' + query + ' ' if query else query


    def produccion(self):
        if(self.ID != 'Todas'):
            query = "SELECT * FROM ASIGNACIONES_PRODUCCION WHERE ID='" + self.ID + "'"
        else:
            query = self.queries['produccion']

        conn_str = "oracle://durencio:daniel2017@172.16.120.3:1521/" + self.bd_service

        df = self.connectionResult(query,self.connStr)

        #for i in ['nombre']:
        #    if i in df.columns.tolist():
        #        df[i] = df[i].str.decode('latin1').str.encode('utf-8')

        df = df.to_json(orient='records')
        return df



    def pozos_inv(self):
        if(self.ID != 'Todas'):
            query = "SELECT * FROM ASIGNACIONES_INVPOZOS WHERE ID='" + self.ID +"' "+\
                    "AND FECHA >= '2015/01/01' ORDER BY FECHA"
        else:
            query = self.queries['pozos_inv']

        conn_str = 'oracle://cmde_raw:raw17@172.16.120.3:1521/' + self.bd_service
        df = self.connectionResult(query,self.connStr)

        #for i in ['descriptor','nombre','id']:
        #    if i in df.columns.tolist():
        #        df[i] = df[i].str.decode('latin1').str.encode('utf-8')

        result = df.to_json(orient='records')
        return result


    def inv(self):
        if(self.ID != 'Todas'):
            query = "SELECT ANIO,ACTIVIDAD,SUB_ACTIVIDAD,SUM(MONTO_USD) AS MONTO_USD " +\
                    "FROM ASIGNACIONES_INV " +\
                    "WHERE ID = '" + self.ID + "' " +\
                    "GROUP BY ANIO,ACTIVIDAD,SUB_ACTIVIDAD " +\
                    "ORDER BY ANIO,ACTIVIDAD,SUB_ACTIVIDAD"

        else:
            query = self.queries['inv']

        conn_str = 'oracle://cmde_raw:raw17@172.16.120.3:1521/' + self.bd_service
        df = self.connectionResult(query,conn_str)

        for i in ['nombre','actividad','sub_actividad','tarea','tipo','escenario','tipo_aprobacion']:
            if i in df.columns.tolist():
                df[i] = df[i].str.decode('latin1').str.encode('utf-8')

        df = df.to_json(orient='records')
        return df


    def reservas(self):
        if(self.ID != 'Todas'):
            query = "SELECT FECHA,TIPO,SUM(RR_PCE_MMBPCE) AS RR_PCE_MMBPCE,SUM(RR_ACEITE_MMB) AS RR_ACEITE_MMB, SUM(RR_GAS_NATURAL_MMMPC) AS RR_GAS_NATURAL_MMMPC FROM RESERVAS_ASIG_CONT_TEST " +\
                    "WHERE ID_ASIG='" + self.ID + "' " +\
                    "GROUP BY FECHA,TIPO,NOMBRE_ASIG,ID_ASIG ORDER BY FECHA,NOMBRE_ASIG,TIPO"
        else:
            query = self.queries['reservas']

        conn_str = 'oracle://durencio:daniel2017@172.16.120.3:1521/' + self.bd_service

        def transform_reserves(x,col):
            fechas = x.fecha.unique().tolist()

            for i,d in enumerate(fechas):
                #a = x[x.fecha == pd.to_datetime(d)].reset_index().copy()
                a = x[x.fecha == d].reset_index().copy()
                b = a.set_index('tipo')[[col]].transpose().copy()
                #print(b)
                b['probadas'] = b['1P']
                b['probables'] = b['2P'] - b['1P']
                b['posibles'] = b['3P'] - b['2P']
                b = b[['posibles','probables','probadas']].transpose().reset_index()
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

        df = self.connectionResult(query,self.connStr)
        #print(df)
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
                df = self.connectionResult(query,self.connStr)

                #for i in ['nombre','estatus']:
                #    df[i] = df[i].str.decode('latin1').str.encode('utf-8')


            elif(tipo == 'A'):
                query = "SELECT ANIO,CONCEPTO,VALOR FROM ASIGNACIONES_CMT_EXTRACCION WHERE ID='" + self.ID + "' AND CONCEPTO NOT IN ('Qo','Qg')"
                df = self.connectionResult(query,self.connStr)

            df = df.to_json(orient='records')

        else:
            query_exp = self.queries['cmt_exp']
            query_ext = self.queries['cmt_ext']

            df_exp = self.connectionResult(query_exp,self.connStr).to_json(orient='records')
            df_ext = self.connectionResult(query_ext,self.connStr).to_json(orient='records')

            df = json.dumps({ "exp":df_exp, "ext":df_ext })

        return df


    def seguimiento(self):
        conn_str = "oracle://cmde_raw:raw17@172.16.120.3:1521/cnih"

        if(self.ID != 'Todas'):
            tipo = 'A' if len(self.ID.split('-')[0]) == 1 else 'AE'

            if(tipo == 'AE'):
                query = "SELECT ANIO,CONCEPTO,VALOR,TIPO_OBSERVACION FROM ASIGNACIONES_SEGUIMIENTO_EXP WHERE ID='" + self.ID + "'"
                df = self.connectionResult(query,self.connStr).to_json(orient='records')

            elif(tipo == 'A'):
                query1 = "SELECT ANIO,CONCEPTO,VALOR,TIPO_OBSERVACION FROM ASIGNACIONES_SEGUIMIENTO_EXT WHERE ID='" + self.ID + "' AND CONCEPTO NOT IN ('Np','Gp')"
                query2 = "SELECT ANIO,CONCEPTO,VALOR,TIPO_OBSERVACION FROM ASIGNACIONES_SEGUIMIENTO_EXP WHERE ID='" + self.ID + "'"
                df1 = self.connectionResult(query1,self.connStr)
                df2 = self.connectionResult(query2,self.connStr)

                if len(df2) == 0:
                    df = df1
                    df = df.to_json(orient='records')
                else:
                    df = json.dumps({ 'exp':df2.to_json(orient='records'), 'ext':df1.to_json(orient='records') })

            #df = df.to_json(orient='records')

        else:
            query_exp = self.queries['seguimiento_exp']
            query_ext = self.queries['seguimiento_ext']

            df_exp = self.connectionResult(query_exp,self.connStr).to_json(orient='records')
            df_ext = self.connectionResult(query_ext,self.connStr).to_json(orient='records')

            df = json.dumps({ 'exp':df_exp, 'ext':df_ext })

        return df


    def aprovechamiento(self):
        if(self.ID != 'Todas'):
            query = "SELECT * FROM ASIGNACIONES_APROVECHAMIENTO WHERE ID='" + self.ID + "' AND CONCEPTO = 'Gas natural No aprovechado  (mmpcd)'"
        else:
            query = self.queries['aprovechamiento']

        conn_str = "oracle://cmde_raw:raw17@172.16.120.3:1521/cnih"
        df = self.connectionResult(query,self.connStr)

        #for i in ['nombre','concepto']:
        #    if i in df.columns.tolist():
        #        df[i] = df[i].str.decode('latin1').str.encode('utf-8')

        df = df.to_json(orient='records')
        return df


    def assembler(self):
        obj = {}
        obj['pozos_inv'] = self.pozos_inv()
        obj['produccion'] = self.produccion()
        #obj['inv'] = self.inv()
        obj['reservas'] = self.reservas()
        obj['cmt'] = self.cmt()
        obj['seguimiento'] = self.seguimiento()
        obj['aprovechamiento'] = self.aprovechamiento()
        return obj

    def config_data(self):
        query = "select * from asignaciones_config"
        conn_str = "oracle://cmde_public:public17@172.16.120.3:1521/cnih"
        df = self.connectionResult(query,self.connStr)

        #for i in ['notes','topic']:
        #    if i in df.columns.tolist():
        #        df[i] = df[i].str.decode('latin1').str.encode('utf-8')

        df = df.to_json(orient='records')
        return df

    def responder(self):
        if 'CONFIG' in self.params:
            self.response = self.config_data()

        else:
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
