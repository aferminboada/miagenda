import React, { useState } from 'react';

const agendaImg = "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=400&q=80";

function App() {
  const [users, setUsers] = useState([]);
  const [registerData, setRegisterData] = useState({ email: '', password: '' });
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [error, setError] = useState('');
  const [screen, setScreen] = useState('home');
  const [contacts, setContacts] = useState([]);
  const [contactData, setContactData] = useState({ name: '', phone: '' });
  const [page, setPage] = useState(1);

  // Paginación personalizada
  let paginatedContacts = [];
  let showPagination = false;
  let totalPages = 1;
  let currentPageLabel = `Página ${page}`;

  if (contacts.length <= 5) {
    paginatedContacts = contacts;
    showPagination = false;
    totalPages = 1;
  } else if (contacts.length <= 10) {
    paginatedContacts = contacts.slice((page - 1) * 5, page * 5);
    showPagination = true;
    totalPages = 2;
    currentPageLabel = `Página ${page} de 2`;
  } else {
    // Más de 10 contactos: página 1 (primeros 5), página 2 (todos los demás)
    showPagination = true;
    totalPages = 2;
    currentPageLabel = `Página ${page}`;
    if (page === 1) {
      paginatedContacts = contacts.slice(0, 5);
    } else {
      paginatedContacts = contacts.slice(5);
    }
  }

  // Registro de usuario
  const handleRegister = (e) => {
    e.preventDefault();
    if (users.find(u => u.email === registerData.email)) {
      setError('El email ya está registrado');
      return;
    }
    setUsers([...users, registerData]);
    setRegisterData({ email: '', password: '' });
    setError('');
    alert('Usuario registrado correctamente');
    setScreen('login');
  };

  // Login de usuario
  const handleLogin = (e) => {
    e.preventDefault();
    const user = users.find(
      u => u.email === loginData.email && u.password === loginData.password
    );
    if (user) {
      setLoggedInUser(user.email);
      setLoginData({ email: '', password: '' });
      setError('');
      setScreen('contacts');
    } else {
      setError('Email o contraseña incorrectos');
    }
  };

  // Logout
  const handleLogout = () => {
    setLoggedInUser(null);
    setScreen('home');
    setContacts([]);
    setPage(1);
  };

  // Agregar contacto
  const handleAddContact = (e) => {
    e.preventDefault();
    if (!contactData.name || !contactData.phone) {
      setError('Completa ambos campos');
      return;
    }
    setContacts([...contacts, contactData]);
    setContactData({ name: '', phone: '' });
    setError('');
    // Si hay más de 5 contactos, ir a la página 2 automáticamente
    if (contacts.length + 1 > 5) {
      setPage(2);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        background: '#FFD1DC',
        color: '#000',
        fontFamily: 'Arial, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        paddingTop: 40
      }}
    >
      <img
        src={agendaImg}
        alt="Agenda"
        style={{
          width: 120,
          height: 120,
          objectFit: 'cover',
          borderRadius: '50%',
          marginBottom: 20,
          boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
        }}
      />
      <h1 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: 30 }}>Agenda</h1>

      <div style={{ width: '90%', maxWidth: 900, background: 'rgba(255,255,255,0.3)', borderRadius: 10, padding: 30, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        {screen === 'home' && (
          <div style={{ textAlign: 'center' }}>
            <button onClick={() => { setScreen('login'); setError(''); }}>Iniciar sesión</button>
            <button onClick={() => { setScreen('register'); setError(''); }} style={{ marginLeft: 10 }}>Registro de usuario</button>
          </div>
        )}

        {screen === 'register' && (
          <>
            <h2>Registro de usuario</h2>
            <form onSubmit={handleRegister}>
              <input
                type="email"
                placeholder="Email"
                value={registerData.email}
                onChange={e => setRegisterData({ ...registerData, email: e.target.value })}
                required
                style={{ width: '100%', marginBottom: 10, padding: 8 }}
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={registerData.password}
                onChange={e => setRegisterData({ ...registerData, password: e.target.value })}
                required
                style={{ width: '100%', marginBottom: 10, padding: 8 }}
              />
              <button type="submit" style={{ width: '100%', padding: 8 }}>Registrar</button>
            </form>
            <button onClick={() => { setScreen('home'); setError(''); }} style={{ marginTop: 10, width: '100%', padding: 8 }}>Volver</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </>
        )}

        {screen === 'login' && (
          <>
            <h2>Iniciar sesión</h2>
            <form onSubmit={handleLogin}>
              <input
                type="email"
                placeholder="Email"
                value={loginData.email}
                onChange={e => setLoginData({ ...loginData, email: e.target.value })}
                required
                style={{ width: '100%', marginBottom: 10, padding: 8 }}
              />
              <input
                type="password"
                placeholder="Contraseña"
                value={loginData.password}
                onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                required
                style={{ width: '100%', marginBottom: 10, padding: 8 }}
              />
              <button type="submit" style={{ width: '100%', padding: 8 }}>Ingresar</button>
            </form>
            <button onClick={() => { setScreen('home'); setError(''); }} style={{ marginTop: 10, width: '100%', padding: 8 }}>Volver</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
          </>
        )}

        {screen === 'contacts' && loggedInUser && (
          <div
            style={{
              display: 'flex',
              gap: '40px',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'flex-start'
            }}
          >
            {/* Card para agregar contacto */}
            <div style={{
              background: '#fff',
              borderRadius: 16,
              boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
              padding: 30,
              minWidth: 300,
              flex: '1 1 300px',
              maxWidth: 400
            }}>
              <h3 style={{ textAlign: 'center', fontSize: '1.5rem' }}>Agregar contacto</h3>
              <form onSubmit={handleAddContact}>
                <input
                  type="text"
                  placeholder="Nombre"
                  value={contactData.name}
                  onChange={e => setContactData({ ...contactData, name: e.target.value })}
                  required
                  style={{ width: '100%', marginBottom: 15, padding: 10, fontSize: '1rem' }}
                />
                <input
                  type="text"
                  placeholder="Teléfono"
                  value={contactData.phone}
                  onChange={e => setContactData({ ...contactData, phone: e.target.value })}
                  required
                  style={{ width: '100%', marginBottom: 15, padding: 10, fontSize: '1rem' }}
                />
                <button type="submit" style={{ width: '100%', padding: 10, fontSize: '1rem' }}>Agregar</button>
              </form>
              {error && <p style={{ color: 'red', marginTop: 10 }}>{error}</p>}
            </div>

            {/* Card para lista de contactos */}
            <div style={{
              background: '#fff',
              borderRadius: 16,
              boxShadow: '0 2px 12px rgba(0,0,0,0.10)',
              padding: 30,
              minWidth: 300,
              flex: '1 1 300px',
              maxWidth: 400,
              minHeight: 300
            }}>
              <h3 style={{ textAlign: 'center', fontSize: '1.5rem' }}>Contactos agregados</h3>
              {contacts.length === 0 ? (
                <p style={{ textAlign: 'center' }}>No hay contactos</p>
              ) : (
                <ul style={{ paddingLeft: 0, listStyle: 'none', fontSize: '1.1rem' }}>
                  {paginatedContacts.map((contact, idx) => (
                    <li key={idx + (page === 2 ? 5 : 0)} style={{ marginBottom: 12 }}>
                      <strong>{contact.name}</strong><br />
                      <span>{contact.phone}</span>
                    </li>
                  ))}
                </ul>
              )}
              {/* Paginación */}
              {showPagination && (
                <div style={{ textAlign: 'center', marginTop: 20 }}>
                  <button
                    onClick={() => setPage(1)}
                    disabled={page === 1}
                    style={{ marginRight: 10, padding: '6px 12px' }}
                  >
                    Anterior
                  </button>
                  <span>{currentPageLabel}</span>
                  <button
                    onClick={() => setPage(2)}
                    disabled={page === 2}
                    style={{ marginLeft: 10, padding: '6px 12px' }}
                  >
                    Siguiente
                  </button>
                </div>
              )}
            </div>
            <div style={{ width: '100%', textAlign: 'center', marginTop: 30 }}>
              <button onClick={handleLogout} style={{ padding: 10, fontSize: '1rem' }}>Cerrar sesión</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
