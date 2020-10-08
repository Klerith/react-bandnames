import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';


import { BandAdd } from './componets/BandAdd';
import { BandList } from './componets/BandList';

const connectSocketServer = () => {
  const socket = io.connect('http://localhost:8080');
  return socket;
}


function App() {

  const [ socket ] = useState( connectSocketServer() )
  const [ online, setOnline ] = useState(false);
  const [ bands, setBands ] = useState([]);

  useEffect(() => {
    setOnline( socket.connected );
  }, [ socket ])

  useEffect( () => {

    socket.on('connect', () => {
      setOnline( true );
    })

  }, [ socket ])

  useEffect( () => {

    socket.on('disconnect', () => {
      setOnline( false );
    })

  }, [ socket ])


  useEffect( () => {

    socket.on('current-bands', (bands) => {
      setBands( bands );
    })

  }, [ socket ])


  const votar = ( id ) => {
    socket.emit( 'votar-banda', id );
  }

  const borrar = ( id ) => {
    socket.emit( 'borrar-banda', id );
  }

  const cambiarNombre = ( id, nombre ) => {
    socket.emit( 'cambiar-nombre-banda', { id, nombre });
  }

  // crearBanda( nombre )
  const crearBanda = ( nombre ) => {
    socket.emit( 'crear-banda', { nombre });
  }
  


  return (
    <div className="container">
        
        <div className="alert">
          <p>
            Service status: 
            {
              online
                ? <span className="text-success"> Online</span>
                : <span className="text-danger"> Offline</span>
            }
           
          </p>
        </div>


        <h1>BandNames</h1>
        <hr />

        <div className="row">
          <div className="col-8">
            <BandList 
              data={ bands }
              votar={ votar }
              borrar={ borrar }
              cambiarNombre={ cambiarNombre }
            />
          </div>

          <div className="col-4">
            <BandAdd 
              crearBanda={ crearBanda }
            />
          </div>
        </div>



    </div>
  );
}

export default App;
