import React, { Component } from 'react';
import './App.css';

const divStyle = {
  width:'100%',
  height:'100%'
}

const heightHeaderInPixels = 60;
//const heightTailInPixels = 300;

const headerHeight = {
  height: heightHeaderInPixels+'px'
}

const tailHeight = {
  height:'70%'//heightTailInPixels +'px'
}

const centerStyle = {
  width:'100%',
  height: '30%',//'calc(100% - '+ (heightHeaderInPixels + heightTailInPixels) +'px)',
  backgroundColor:'transparent',
  display:'table',
  borderTop:'1px solid lightGray',
  borderBottom:'1px solid lightGray'
}


class App extends Component {
  render() {
    return (
      <div style={divStyle}>
        <Header/>
        <Wrap/>
      </div>
    );
  }
}

class Wrap extends Component {
  render() {
    return (
      <div style={{ width:'100%', height:'calc(100% - 70px)'}}>
        <Center/>
        <Tail/>
      </div>
    )
  }
}

class Header extends Component {
  render() {
    return (
      <div className='header' style={headerHeight}>
          <DropDownMenu className='cuenca' name='Cuenca'/>
          <DropDownMenu name='Asignación'/>
          <TextBox/>
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


class Center extends Component {
  render() {
    return (
      <div className='center' style={centerStyle}>
          <CenterLeft/>
          <CenterRight/>
      </div>
    )
  }
}

class CenterLeft extends Component {
  render() {
    return (
      <div className='centerLeft' style={{display:'table-cell', width:'40%', height:'100%', backgroundColor:'transparent'}}>
        <svg className='map' preserveAspectRatio='xMidYMid meet' style={{width:'100%',height:'100%',backgroundColor:'white' }}>
          <g style={{width:'100%',height:'100%'}}></g>
        </svg>
      </div>
    )
  }
}

class CenterRight extends Component {
  render() {
    return (
      <div className='centerRight' style={{position:'relative',display:'table-cell', width:'60%', height:'100%', backgroundColor:'transparent' }}>
        <div style={{ display:'table',position:'absolute',width:'100%',height:'50%'}}>
          <div style={{display:'table-cell',width:'100%',verticalAlign:'middle'}}>

            <table style={{width:'100%', marginLeft:'0%',paddingRight:'0%',minHeight:'50%'}}>
              <thead style={{minHeight:'10px',backgroundColor:'lightGray',width:'100%'}}>
                <tr style={{fontSize:'5px'}}>
                  <td>&nbsp;</td>
                  <td>&nbsp;</td>
                </tr>
              </thead>
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

class Tail extends Component {
  render() {
    return (
      <div className='tail' style={tailHeight}>
        <Pestanas cuatro={true} elements={['Producción','Reservas','Pozos','Inversión']}/>
        <Pestanas cuatro={false} elements={['Compromiso Mínimo de Trabajo','Aprovechamiento de gas','Dictámenes']}/>
        <div style={{ width:'90%',height:'calc(100% - 57px)',marginTop:'13px',marginLeft:'3%' }} id='visor'></div>
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
      maxWidth: String( 100 / 4 ) + '%',
      minWidth:'25%',
      width:'25%',
      textAlign:'center',
      verticalAlign:'middle'
  };

  const onlyButtonStyle = {
      width:'calc(100% - 5px)',
      height:'calc(100% - 0px)',
      border:'none',
      verticalAlign:'middle'
  };

    return(
        <div style={{ width:'100%', height:'20px',marginTop:'7px',textAlign:'center' }}>
          <div style={{ width:this.props.cuatro ? '100%' : '75%', height:'100%', display:'table', 'marginLeft':this.props.cuatro ? null : '12.5%' }}>
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


class Visor extends Component {

}

export default App;
