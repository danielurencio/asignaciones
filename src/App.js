import React, { Component } from 'react';
import './App.css';



const heightHeaderInPixels = 60;
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

              <div style={{width:'100%','height':'30%'}}>
                    <Ficha/>
              </div>

              <div style={{width:'100%','height':'70%'}}>
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
      height:'100%',
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

    return (
      <div className='header' style={headerStyle}>
          <DropDownMenu className='cuenca' name='Cuenca'/>
          <DropDownMenu name='Asignación'/>
          <TextBox/>
      </div>
    )
  }
}


class Visor extends Component {
  render() {
    return (
      <div style={{ width:'100%',height:'100%'}}>
        <div style={{ width:'100%',height:this.props.boton_width+'px', top:'0px',position:'relative' }}>
            <Botones boton_width={ this.props.boton_width } elements={['Producción','Reservas','Pozos','Inversión','Compromiso Mínimo de Trabajo','Aprovechamiento de gas','Dictámenes','Autorizaciones']}/>
        </div>
        <div style={{ width:'100%',height:'calc(100% - '+ this.props.boton_width + 'px)' }}>
            <div id='bubbles' style={{ width:'100%',height:'0px',backgroundColor:'transparent',zIndex:'20' }}></div>
            <div id='controles' style={{ width:'100%',height:'20px',backgroundColor:'transparent' }}></div>
            <div id='visor_holder' style={{ margin:'20px',width:'calc(100% - 20px)',height:'calc(100% - 40px - 0px - 20px)' }}>
              <div id='visor' style={{ width:'calc(100% - 20px)',height:'calc(100% - 20px)' }}></div>
            </div>
        </div>
      </div>
    )
  }
}



class Botones extends Component {
  render() {

    const botones = this.props.elements;
    const boton_width = this.props.boton_width;
    botones.push(null);

    return (
      <div id='botones_' style={{ width:'100%', height:'100%',display:'table' }}>
            {
              botones.map(function(d,i) {
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
                                              borderRight:'1px solid lightGray',
                                              height:'100%',
                                              width: i === (botones.length - 1) ? 'calc(100% - ' + botones.length*boton_width + 'px)' : boton_width+'px',
                                              minWidth:boton_width+'px',
                                              maxWidth:boton_width+'px',
                                              display:'table-cell',
                                            }}>
                    </div>
                )
              })
            }
      </div>
    )
  }
}



class Tail extends Component {
  render() {
    const tailHeight = {
      height:'100%',
      width:'100%',
      backgroundColor:'transparent'
    }

    return (
      <div style={tailHeight}>
        <Pestanas cuatro={true} elements={['Producción','Reservas','Pozos','Inversión','Compromiso Mínimo de Trabajo','Aprovechamiento de gas','Dictámenes']}/>
        <div style={{ width:'90%',height:'calc(100% - 0px)',marginTop:'0px',marginLeft:'0%' }} id='visor'></div>
      </div>
    )
  }
}



class DropDownMenu extends Component {
  render() {
    return (
      <div className='header_child' style={{display:'table-cell',textAlign:'center'}}>
        <div style={{display:'table',position:'absoulte',height:'100%', width:'100%', textAlign:'center',tableLayout:'fixed'}}>
           <div style={{display:'table-cell',verticalAlign:'middle',textAlign:'center'}}>
              <div>
                <div style={{ fontWeight:'800' }}>{this.props.name}</div>
                <select style={{minWidth:'70%',maxWidth:'70%'}}>
                </select>
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
      <div className='header_child' style={{display:'table-cell',textAlign:'center'}}>
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
      <div id='MAPA' style={{position:'relative',width:'100%', height:'calc(100% - 4px)', backgroundColor:'transparent'}}>
      {/*}
        <svg className='map' preserveAspectRatio='xMidYMid meet' style={{width:'100%',height:'100%',backgroundColor:'white' }}>
          <g style={{width:'100%',height:'100%'}}></g>
        </svg>
      */}
      </div>
    )
  }
}

class Ficha extends Component {
  render() {
    return (
      <div className='ficha' style={{position:'relative', width:'100%', height:'100%', backgroundColor:'transparent' }}>
        <div style={{ display:'table',position:'absolute',width:'100%',height:'100%'}}>
          <div style={{display:'table-cell',width:'100%',verticalAlign:'middle'}}>

            <table style={{width:'100%', marginLeft:'0%',paddingRight:'0%',minHeight:'50%'}}>
              <tbody style={{height:'90%',fontWeight:'900'}}>
                <tr>
                  <td>Nombre de la asignación</td>
                  <td className='NOMBRE'></td>
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
            <div id='titulo' style={{textAlign:'center',color:'rgb(13,180,190)',padding:'12px',fontWeight:'800','cursor':'pointer'}}>
                Título de la asignación
            </div>
          </div>
        </div>
      </div>
    )
  }
}


class Pestanas extends Component {

  render() {

  const elements = this.props.elements;//['Producción','Reservas','Pozos','Inversión'];

  const divButtonStyle = {
      display:'table-cell',
      height:'100%',
      width: String( 100 / elements.length ) + '%',
      //minWidth:'25%',
      //width:'25%',
      textAlign:'center',
      verticalAlign:'middle'
  };

  const onlyButtonStyle = {
      width:'calc(100% - 5px)',
      height:'calc(100% - 20px)',
      border:'none',
      verticalAlign:'middle'
  };

    return(
        <div style={{ width:'100%', height:'20px',marginTop:'0px',textAlign:'center' }}>
          <div style={{ width:'100%', height:'100%', display:'table' }}>
            {
              elements.map(function(d,i) {
                return (
                <div key={ i + '_' + d } style={ divButtonStyle }>
                  <button className={ d === 'Producción' ? 'selectedButton' : null } style={ onlyButtonStyle }>{d}</button>
                </div>
                )
              })
            }
          </div>
        </div>
    )
  }
}


/*
class Visor extends Component {

}
*/

export default App;
