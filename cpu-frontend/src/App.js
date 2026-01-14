import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [cpus, setCpus] = useState([]);
  const [sockets, setSockets] = useState([]);
  const [editingCpu, setEditingCpu] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [formData, setFormData] = useState({ brand: '', model: '', socketId: '' ,price:''});
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    fetchCpus();
  }, []);

  const fetchCpus = () => {
    fetch('http://localhost:8080/api/cpus')
      .then(r => r.json())
      .then(d => setCpus(d))
      .catch(e => console.error('Error fetching CPUs:', e));
  };

  const fetchSockets = () => {
    fetch('http://localhost:8080/api/sockets')
      .then(r => r.json())
      .then(d => setSockets(d))
      .catch(e => console.error('Error fetching sockets:', e));
  };

  const handleEdit = (cpu) => {
    fetchSockets();
    setEditingCpu(cpu);
    setIsAddMode(false);
    setFormData({
      brand: cpu.brand,
      model: cpu.model,
      socketId: cpu.socket?.id || '',
      price:cpu.price
    });
  };

  const handleAdd = () => {
    fetchSockets();
    setEditingCpu(null);
    setIsAddMode(true);
    setFormData({ brand: '', model: '', socketId: '',price:'' });
  };

  const handleCancel = () => {
    setEditingCpu(null);
    setIsAddMode(false);
    setFormData({ brand: '', model: '', socketId: '',price:'' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = () => {
    if (!formData.brand || !formData.model || !formData.price||!formData.socketId) {
      alert('Please fill all fields');
      return;
    }

    const payload = {
      brand: formData.brand,
      model: formData.model,
      price: 76,
      socket: { id: parseInt(formData.socketId) }
    };
    console.log(JSON.stringify(payload));
    const url = isAddMode ? 'http://localhost:8080/api/cpus' : `http://localhost:8080/api/cpus/${editingCpu.id}`;
    const method = isAddMode ? 'POST' : 'PUT';

    fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(r => r.json())
      .then(d => {
        showSuccess();
        fetchCpus();
        handleCancel();
      })
      .catch(e => console.error('Error:', e));
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this CPU?')) {
      fetch(`http://localhost:8080/api/cpus/${id}`, { method: 'DELETE' })
        .then(() => {
          showSuccess();
          fetchCpus();
        })
        .catch(e => console.error('Error:', e));
    }
  };

  const showSuccess = () => {
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 3000);
  };

  if (editingCpu !== null || isAddMode) {
    return (
      <div style={styles.container}>
        <div style={styles.formContainer}>
          <h2>{isAddMode ? 'Add New CPU' : 'Edit CPU'}</h2>
          <div style={styles.formGroup}>
            <label>Brand</label>
            <input
              type="text"
              name="brand"
              value={formData.brand}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
          <label>Price($)</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label>Model</label>
            <input
              type="text"
              name="model"
              value={formData.model}
              onChange={handleInputChange}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label>Socket</label>
            <select
              name="socketId"
              value={formData.socketId}
              onChange={handleInputChange}
              style={styles.input}
            >
              <option value="">Select Socket</option>
              {sockets.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
          <div style={styles.buttonGroup}>
            <button onClick={handleSave} style={styles.saveBtn}>Save</button>
            <button onClick={handleCancel} style={styles.cancelBtn}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {showConfetti && <Confetti />}
      <h1>CPU Manager</h1>
      <button onClick={handleAdd} style={styles.addBtn}>+ Add CPU</button>
      
      {cpus.length === 0 ? (
        <p>No CPUs found</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Brand</th>
              <th>Model</th>
              <th>Socket</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {cpus.map(cpu => (
              <tr key={cpu.id}>
                <td>{cpu.brand}</td>
                <td>{cpu.model}</td>
                <td>{cpu.socket?.name || 'N/A'}</td>
                <td style={styles.actionCell}>
                  <button onClick={() => handleEdit(cpu)} style={styles.editBtn}>Edit</button>
                  <button onClick={() => handleDelete(cpu.id)} style={styles.deleteBtn}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function Confetti() {
  return (
    <div style={styles.confettiContainer}>
      {[...Array(150)].map((_, i) => (
        <div key={i} style={getConfettiStyle(i)} />
      ))}
      <div style={styles.successMessage}>Success!🚀🚀BOOM!✨Good job mariam!✨💯 PERFECT! 💯🔥 FIRE! 🔥✨ YASSS! ✨ </div>
    </div>
  );
}

function getConfettiStyle(i) {
  const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7', '#ff85a2', '#a8e6cf', '#ffd3b6'];
  const shapes = ['circle', 'square', 'star'];
  const shape = shapes[i % 3];
  const duration = 2 + Math.random() * 2;
  const delay = Math.random() * 0.3;
  
  let baseStyle = {
    position: 'fixed',
    width: '15px',
    height: '15px',
    backgroundColor: colors[i % colors.length],
    left: Math.random() * 100 + '%',
    top: '-20px',
    animation: `crazyFall ${duration}s linear ${delay}s forwards`,
    zIndex: 9999,
    fontWeight: 'bold',
    fontSize: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  if (shape === 'circle') {
    baseStyle.borderRadius = '50%';
  } else if (shape === 'square') {
    baseStyle.borderRadius = '2px';
  }

  return baseStyle;
}

const styles = {
  container: {
    maxWidth: '1000px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'Segoe UI, Tahoma, Geneva, Verdana, sans-serif'
  },
  formContainer: {
    backgroundColor: '#f5f5f5',
    padding: '30px',
    borderRadius: '8px',
    maxWidth: '400px',
    margin: '50px auto'
  },
  formGroup: {
    marginBottom: '15px'
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '14px',
    boxSizing: 'border-box'
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '20px'
  },
  saveBtn: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#27ae60',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  cancelBtn: {
    flex: 1,
    padding: '10px',
    backgroundColor: '#95a5a6',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px'
  },
  addBtn: {
    marginBottom: '20px',
    padding: '12px 20px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    backgroundColor: 'white',
    borderRadius: '8px',
    overflow: 'hidden',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  actionCell: {
    display: 'flex',
    gap: '10px'
  },
  editBtn: {
    padding: '6px 12px',
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px'
  },
  deleteBtn: {
    padding: '6px 12px',
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '12px'
  },
  confettiContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 10000,
    pointerEvents: 'none'
  },
  successMessage: {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#121b77ff',
    textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
    zIndex: 10001,
    animation: 'bounce 0.6s ease-in-out'
  }
};

export default App;