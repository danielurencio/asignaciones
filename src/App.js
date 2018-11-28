import React, { Component } from 'react';
import './App.css';



const heightHeaderInPixels = 90;
//const heightTailInPixels = 300;


class App extends Component {
  render() {
    const divStyle = {
      width:'100%',
      height:'100%'
    }

    return (
      <div style={divStyle}>
        <Header/>
        <Columns/>
      </div>
    );
  }

}



class Columns extends Component {
  render() {

    const columnsStyle = {
      width:'100%',
      height: 'calc(100% - '+ (heightHeaderInPixels) +'px)',
      backgroundColor:'transparent',
      display:'table',
      borderBottom:'1px solid lightGray',
      position:'absolute'
    }

    return (
      <div style={ columnsStyle }>

          <ColumnSide borderRight='1px solid lightGray' width='40%'>
{/*
              <div style={{width:'100%','height':'30%'}}>
                    <Ficha/>
              </div>
*/}
              <div style={{width:'100%','height':'100%'}}>
                    <Mapa/>
              </div>

          </ColumnSide>

        <ColumnSide width='60%'>
            <div style={{width:'100%',height:'100%'}}>
                <Visor boton_width={60}/>
            </div>
        </ColumnSide>

      </div>
    );
  }
}



class ColumnSide extends Component {
  render() {
    const columnStyle = {
      width:this.props.width,
      borderRight: this.props.borderRight ? this.props.borderRight : null,
      height:'calc(100% - 30px)',
      display:'table-cell'
    }

    return (
      <div style={ columnStyle }>
        { this.props.children }
      </div>
    )
  }
}



class Header extends Component {
  render() {
    const headerStyle = {
      height: heightHeaderInPixels+'px',
      borderBottom:'1px solid lightGray'
    };

    //const dropdowns = ['Cuenca','Ubicación','Tipo','Asignacion'];
    const dropdowns = ['Nivel','Cuenca/Ubicación','Tipo/Asignación','Buscar'];
    const childrenWidth = '20%';// ( 100 / (dropdowns.length + 1) ) + '%';

    return (
        <div className='header' style={headerStyle}>
          <div style={{backgroundColor:'rgb(50,50,50)',height:'30px', position:'fixed', width:'100%', textAlign:'center'}}>
            <img alt='' src='cnh-logo-white.svg' width='30px' height='30px'></img>
          </div>
          <div style={{width:'100%',top:'30px',position:'relative',zIndex:2,height:'calc(100% - 30px)' }}>
              <DropDownMenu title={ ['Cuenca','Ubicación'] } w_={childrenWidth}/>
              <DropDownMenu title={ ['Tipo','Asignación'] } w_={childrenWidth}/>
              <TextBox w_={childrenWidth}/>
          </div>
      </div>
    )
  }
}


class Visor extends Component {
  render() {

    let notas = {
      top:'calc(99.7% - 10px)',
      position:'fixed',
      marginLeft:'10px',
      width:'calc(60% - 20px)',
      height:'0.2%',
      backgroundColor:'rgba(0,0,0,.9)',
      zIndex:100,
      borderRadius:'0px',
      color:'white',
      display:'table',
      textAlign:'center',
      fontFamily:'Open Sans',
      fontWeight:700
    };

    let notas_table = {
      top:'calc(97.7% - 11px)',
      marginLeft:'15px',
      position:'fixed',
      zIndex:100,
      height:'2%',
      width:'4.0%',
      backgroundColor:'rgba(0,0,0,0.9)',
      display:'table',
      textAlign:'center',
      borderTopRightRadius:'4px',
      borderTopLeftRadius:'4px',
      fontFamily:'Open Sans',
      color:'rgba(255,255,255,1)',
      fontWeight:600,
      fontSize:'1em'
    }

    return (
      <div style={{ width:'100%',height:'100%'}}>
        <div style={{ width:'100%',height:this.props.boton_width+'px', top:'0px',position:'relative' }}>

           <Botones boton_width={ this.props.boton_width }
           elements={[
             'Datos generales',
             'Producción',
             'Reservas',
             'Pozos',
             'Inversión',
             'Compromiso Mínimo de Trabajo',
             'Aprovechamiento de gas',
             'Documentos',
             'Seguimiento'
           ]}/>
        </div>
        <div style={{ width:'100%',height:'calc(100% - '+ this.props.boton_width + 'px)' }}>
            <div ix='notas' id='notas_pestana' className='notas' style={notas_table}>
              <div ix='notas' className='notas' style={{ display:'table-cell', verticalAlign:'middle' }}>Notas</div>
            </div>
            <div ix='notas' id='notas' className='notas' style={notas}>
              <div ix='notas' className='notas' id='notas_ocultar' style={{ display:'none', textAlign:'right', fontWeight:800 }}>
                  <span style={{ color:'WhiteSmoke', backgroundColor:'rgba(255,255,255,0.5)',borderBottomLeftRadius:'5px' }}>&ensp;X&ensp;</span>
              </div>
              <div id='notas_contenido' style={{ 'display':'none' }}>En construcción</div>
            </div>

            <div id='bubbles' style={{ width:'100%',height:'0px',backgroundColor:'transparent',zIndex:'20' }}></div>
            {/*<div id='controles' style={{ width:'100%',height:'20px',backgroundColor:'transparent' }}></div>*/}
            <div id='visor_holder' style={{ position:'relative',margin:'10px',width:'calc(100% - 0px)',height:'calc(100% - 0px - 0px - 0px)' }}>
              <div style={{ width:'calc(100% - 20px)',height:'calc(100% - 20px)' }}>
                    <div id='visor' style={{ width:'100%', height:'100%' }}></div>
              </div>
            </div>
            <div id="filtro_cont" style={{
              display:'none',
              marginLeft:'10px',
              top:"calc(100% - 120px)",
              width:"calc(60% - 20px)",
              height:"110px",
              backgroundColor:"rgba(13,50,150,0.95)",
              position:"absolute",
              borderTopLeftRadius:'3px',
              borderTopRightRadius:'3px'
            }}>
                <div style={{
                  display:'table-cell',
                  verticalAlign:'middle',
                  textAlign:'center',
                  color:'white',
                  fontSize:'1.5em',
                  fontWeight:300
                }}>
                <div>Filtrar asignación:</div>
                <input style={{
                  backgroundColor:'transparent',
                  borderTop:'none',
                  borderRight:'none',
                  borderLeft:'none',
                  borderBottom:'1px solid white',
                  width:'40%',
                  borderImage:'initial',
                  background:'url("glass_blue.svg") calc(100% - 0px) 0px no-repeat',
                  fontWeight:700
                }}></input>
                </div>
            </div>
        </div>
      </div>
    )
  }
}



class Botones extends Component {

  render() {

    const botones = this.props.elements;
    const boton_width = '10'//this.props.boton_width;
    const option_A = 'calc(100% - ' + botones.length*boton_width + '%)';
    const option_B = boton_width + '%';
    botones.push(null);

    return (
      <div id='botones_' style={{ width:'100%', height:'100%',display:'table' }}>
            {
              botones.map(function(d,i) {
                let dir = 'Stroke'
                let glyph;

                if( d === 'Producción' ) {
                  glyph = 'oil';
                } else if ( d === 'Reservas' ) {
                  glyph = 'stats';
                } else if ( d === 'Pozos' ) {
                  glyph = 'tint';
                } else if ( d === 'Inversión' ) {
                  glyph = 'usd';
                } else if ( d === 'Compromiso Mínimo de Trabajo' ) {
                  glyph = 'tasks';
                } else if ( d === 'Aprovechamiento de gas' ) {
                  glyph = 'scale';
                } else if ( d === 'Dictámenes' ) {
                  glyph = 'list-alt'
                } else if ( d === 'Seguimiento' ) {
                  glyph = 'ok';
                } else if ( d === 'Datos generales' ) {
                  glyph = 'pushpin';
                }

                let clase;
                    if(i === 0) {
                      clase = 'button';
                    } else if( i > 0 && i !== botones.length - 1 ) {
                      clase = 'button';
                    } else {
                      clase = 'espacioBlanco';
                    }

                return (
                    <div id={d} pos={i} className={clase} key={ i + '_' + d } style={{
                                              borderRadius:'2px',
                                              borderRight: i === (botones.length - 1) ? null : '1px solid lightGray',
                                              height:'100%',
                                              width: i === (botones.length - 1) ? option_A : option_B,
                                              display:'table-cell',
                                              left:i*boton_width + '%',
                                              position:'absolute',
                                              verticalAlign:'middle',
                                              textAlign:'center'
                                            }}>
                                            <div style={{ height:'100%',width:'100%',verticalAlign:'middle',display:'table',textAlign:'center',position:'relative' }}>
                                              <div style={{ 'display':'table-cell', verticalAlign:'middle',width:'100%',textAlign:'center',height:'100%',position:'relative' }}>
                                                {/*<i className={ 'glyphicon glyphicon-' + glyph } style={{ width:'100%',textAlign:'center',fontSize:'2.5em',verticalAlign:'middle' }}></i>*/}
                                                {
                                                    <img alt='' src={ i < botones.length - 1 ? dir + '/0' + i + '.svg' : null } style={{ maxWidth:'80%' }}></img>
                                                }
                                              </div>
                                            </div>
                    </div>
                )

              })
            }
      </div>
    )
  }
}


class DropDownMenu extends Component {
  tableDimension = .9;
  selectDimension = .8;

  tableStyle = {
    display:'table',
    tableLayout:'fixed',
    textAlign:'center',
    width: String(this.tableDimension*100) + '%',
    position:'relative',
    left: String( ((1 - this.tableDimension)*100) / 2) + '%',
    marginTop:'2px'
  };

  titleStyle = {
    display:'table-cell',
    width:'30%',
    fontWeight:'800',
    textAlign:'right',
    fontSize:'.9em'
  };

  selectContStyle = {
    display:'table-cell',
    width:'70%'
  };

  selectStyle = {
    width:'90%',
    left:'10%'
    //minWidth:'70%',
    //maxWidth:'70%'
  };

  replaceChars(str) {
    let str_ = str.toLowerCase()
                  .replace(/á/g,'a')
                  .replace(/é/g,'e')
                  .replace(/í/g,'i')
                  .replace(/ó/g,'o')
                  .replace(/ú/g,'u');

    return str_;
  }

  render() {
    return (
      <div className='header_child' style={{position:'relative',top:'5px',display:'table-cell',textAlign:'center',width:this.props.w_,height:'100%'}}>
        <div style={{display:'table',position:'absoulte',height:'100%', width:'100%', textAlign:'center' }}>
           <div style={{display:'table-cell',verticalAlign:'middle',textAlign:'center'}}>
              <div style={{ position:'relative',top:'-2px' }}>
                <div style={ this.tableStyle }>
                  <div style={ this.titleStyle }>
                  { this.props.title[0] }
                  </div>
                  <div style={ this.selectContStyle }>
                    <select className={ this.replaceChars(this.props.title[0]) } style={ this.selectStyle }/>
                  </div>
                </div>
                <div style={ this.tableStyle }>
                  <div style={ this.titleStyle }>
                  { this.props.title[1] }
                  </div>
                  <div style={ this.selectContStyle }>
                    <select className={ this.replaceChars(this.props.title[1]) } style={ this.selectStyle }/>
                  </div>
                </div>
                {/*<select className={this.props.tag} style={{minWidth:'70%',maxWidth:'70%'}}>*/}

              </div>
          </div>
        </div>
      </div>
    )
  }
}



class TextBox extends Component {
  render() {
    return (
      <div className='header_child' style={{display:'table-cell',textAlign:'center',width:this.props.w_}}>
        <div style={{display:'table',position:'absoulte',height:'100%', width:'100%', textAlign:'center'}}>
           <div style={{display:'table-cell',verticalAlign:'middle',textAlign:'center'}}>
              <div style={{ display:'table',width:'100%' }}>
                <div>
                  <div style={{ fontWeight:'800' }}>Buscar</div>
                  <input className='buscador' style={{ minWidth:'60%',maxWidth:'60%',border:'none',borderBottom:'1px solid gray',background:'url(glass_.svg) no-repeat calc(100% - 0px) 0px' }}></input>
                </div>
              </div>
          </div>
        </div>
      </div>
    )
  }
}



class Mapa extends Component {
  render() {
    return (
      <div style={{ position:'relative',width:'100%',height:'calc(100% - 0px)' }}>
          {/*<div style={{ position:'absolute',width:'100%',textAlign:'center',fontWeight:800,top:'10px' }}>Ubicación</div>*/}
          <div id='MAPA' style={{position:'relative',width:'calc(100% - 20px)', height:'calc(100% - 20px)', backgroundColor:'transparent',left:'10px',top:'10px'}}>
          </div>
      </div>
    )
  }
}



class Ficha extends Component {
  render() {
    return (
      <div className='ficha' style={{position:'relative', width:'100%', height:'100%', backgroundColor:'transparent' }}>
        <div style={{ display:'table',position:'absolute',width:'100%',height:'100%'}}>
          <div style={{display:'table-cell',width:'100%',verticalAlign:'middle',textAlign:'center'}}>
          <div className='NOMBRE' style={{ margin:'6px',fontWeight:'700',fontSize:'14px' }}></div>
            <table style={{width:'100%', marginLeft:'0%',paddingRight:'0%',maxHeight:'50%'}}>
              <tbody style={{ height:'70%',fontWeight:'900' }}>

                <tr>
                  <td>Vigencia (años):</td>
                  <td className='VIGENCIA_ANIOS'></td>
                </tr>

                <tr>
                  <td>Inicio de vigencia</td>
                  <td className='VIG_INICIO'></td>
                </tr>
                <tr>
                  <td>Fin de vigencia</td>
                  <td className='VIG_FIN'></td>
                </tr>
                <tr>
                  <td>Superficie (km<sup>2</sup>)</td>
                  <td className='SUPERFICIE_KM2'></td>
                </tr>
                <tr>
                  <td>Tipo de asignación</td>
                  <td className='TIPO'></td>
                </tr>
              </tbody>
            </table>
            <div style={{ textAlign:'center',padding:'0px',fontWeight:'800',position:'relative',top:'12px' }}>
                <div style={{display:'table',width:'100%'}}>

                  <div style={{'width':'50%',display:'table-cell', backgroundColor:'white', verticalAlign:'middle',position:'relative' }}>
                    <div id='titulo' style={{ width:'70%',padding:'2px',left:'20%',position:'relative',margin:'0px', color:'white',borderRadius:'2px', verticalAlign:'middle', background:'url() rgb(13,180,190) no-repeat 20px 3px',cursor:'pointer' }}>
                      Ver título
                    </div>
                  </div>


                  <div style={{'width':'50%',display:'table-cell', backgroundColor:'white', verticalAlign:'middle',position:'relative' }}>
                    <div style={{ width:'70%',padding:'2px',left:'10%',position:'relative', color:'white',borderRadius:'2px', verticalAlign:'middle', background:'url() gray no-repeat 20px 3px' }}>
                      Resumen
                    </div>
                  </div>

                </div>

            </div>
          </div>
        </div>
      </div>
    )
  }
}


export default App;
