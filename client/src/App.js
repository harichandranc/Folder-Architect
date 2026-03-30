import { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchFiles = async () => {
    setLoading(true);
    const res = await axios.get('http://localhost:5000/api/files');
    setFiles(res.data);
    setLoading(false);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  // upload
  const uploadFile = async (e) => {
    const formData = new FormData();
    formData.append('file', e.target.files[0]);

    await axios.post('http://localhost:5000/api/files/upload', formData);
    fetchFiles();
  };

  // copy
  const copyFile = async (id) => {
    try {
      await axios.post(`http://localhost:5000/api/files/copy/${id}`);
      fetchFiles();
    } catch (err) {
      alert("Retrieving data... Try again!");
    }
  };

  // move
  const moveFile = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/files/move/${id}`, {
        folderId: null
      });
      fetchFiles();
    } catch (err) {
      alert("System busy... Try again!");
    }
  };

  // delete
  const deleteFile = async (id) => {
    await axios.delete(`http://localhost:5000/api/files/${id}`);
    fetchFiles();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>📁 Folder Architect</h2>

      <input type="file" onChange={uploadFile} />

      {loading ? (
        <p>Retrieving data... Wait a few seconds ⏳</p>
      ) : (
        files.map(file => (
          <div key={file._id} style={{ margin: 10 }}>
            📄 {file.name}
            <br />
            <button onClick={() => copyFile(file._id)}>Copy</button>
            <button onClick={() => moveFile(file._id)}>Move</button>
            <button onClick={() => deleteFile(file._id)}>Delete</button>
          </div>
        ))
      )}
    </div>
  );
}

export default App;
