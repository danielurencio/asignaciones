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
    }

    //const dropdowns = ['Cuenca','Ubicación','Tipo','Asignacion'];
    const dropdowns = ['Cuenca','Ubicación','Tipo','Asignación'];
    const childrenWidth = ( 100 / (dropdowns.length + 1) ) + '%';

    return (
        <div className='header' style={headerStyle}>
          <div style={{backgroundColor:'rgb(50,50,50)',height:'30px', position:'fixed', width:'100%', textAlign:'center'}}>
            <img alt='' src='cnh-logo-white.svg' width='30px' height='30px'></img>
          </div>
          <div style={{width:'100%',top:'35px',position:'fixed',zIndex:2 }}>
              <DropDownMenu title={ ['Cuenca','Ubicación'] } w_={childrenWidth}/>
              <DropDownMenu title={ ['Tipo','Asignación'] } w_={childrenWidth}/>
              {/*
                dropdowns.map(function(d,i) {
                  return (
                    <DropDownMenu w_={childrenWidth} key={i} name={d} tag={
                                                        d.toLowerCase()
                                                         .replace(/á/g,'a')
                                                         .replace(/é/g,'e')
                                                         .replace(/í/g,'i')
                                                         .replace(/ó/g,'o')
                                                         .replace(/ú/g,'u')
                                                      }/>
                  )
                })
              }*/}

              <TextBox w_={childrenWidth}/>
          </div>
      </div>
    )
  }
}


class Visor extends Component {
  render() {
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
             'Dictámenes',
             'Autorizaciones'
           ]}/>
        </div>
        <div style={{ width:'100%',height:'calc(100% - '+ this.props.boton_width + 'px)' }}>
            <div id='bubbles' style={{ width:'100%',height:'0px',backgroundColor:'transparent',zIndex:'20' }}></div>
            <div id='controles' style={{ width:'100%',height:'20px',backgroundColor:'transparent' }}></div>
            <div id='visor_holder' style={{ position:'relative',margin:'20px',width:'calc(100% - 20px)',height:'calc(100% - 40px - 0px - 20px)' }}>
              <div style={{ width:'calc(100% - 20px)',height:'calc(100% - 20px)' }}>
                    <div id='visor' style={{ width:'100%', height:'100%' }}></div>
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
                  glyph = 'scale'
                } else if ( d === 'Dictámenes' ) {
                  glyph = 'list-alt'
                } else if ( d === 'Autorizaciones' ) {
                  glyph = 'ok'
                } else if ( d === 'Datos generales' ) {
                  glyph = 'pushpin'
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
                                            <div style={{ height:'100%',width:'100%',verticalAlign:'middle',display:'table',textAlign:'center' }}>
                                              <div style={{ 'display':'table-cell', verticalAlign:'middle',width:'100%',textAlign:'center' }}>
                                                <i className={ 'glyphicon glyphicon-' + glyph } style={{ width:'100%',textAlign:'center',fontSize:'2.5em',verticalAlign:'middle' }}></i>
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
    textAlign:'right'
  };

  selectContStyle = {
    display:'table-cell',
    width:'70%'
  };

  selectStyle = {
    width:'100%',
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
      <div className='header_child' style={{display:'table-cell',textAlign:'center',width:this.props.w_}}>
        <div style={{display:'table',position:'absoulte',height:'100%', width:'100%', textAlign:'center' }}>
           <div style={{display:'table-cell',verticalAlign:'middle',textAlign:'center'}}>
              <div style={{ position:'relative',top:'-2px' }}>
                <div style={ this.tableStyle }>
                  <div style={ this.titleStyle }>
                  { this.props.title[0] } <span>&nbsp;</span>
                  </div>
                  <div style={ this.selectContStyle }>
                    <select className={ this.replaceChars(this.props.title[0]) } style={ this.selectStyle }/>
                  </div>
                </div>
                <div style={ this.tableStyle }>
                  <div style={ this.titleStyle }>
                  { this.props.title[1] } <span>&nbsp;</span>
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
                  <td className='ESTATUS'></td>
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
                    <div style={{ width:'70%',padding:'2px',left:'10%',position:'relative', color:'white',borderRadius:'2px', verticalAlign:'middle', background:'url() rgb(13,180,190) no-repeat 20px 3px' }}>
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
