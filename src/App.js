import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import './App.css';

const App = () => {
  const initialFormState = { name: '', phone: '', city: '', email: '', key: uuidv4() };
  const [forms, setForms] = useState([initialFormState]);
  const [formData, setFormData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [showForms, setShowForms] = useState(false);

  useEffect(() => {
    const storedFormData = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      const storedData = JSON.parse(localStorage.getItem(key));
      storedFormData.push({ ...storedData, key });
    }
    setFormData(storedFormData);
  }, [forms]);

  const handleNameChange = (value, index) => {
    const newForms = [...forms];
    newForms[index].name = value;
    setForms(newForms);
  };

  const handlePhoneChange = (value, index) => {
    if (value.length <= 10) {
      const newForms = [...forms];
      newForms[index].phone = value;
      setForms(newForms);
    }
  };

  const handleCityChange = (value, index) => {
    const newForms = [...forms];
    newForms[index].city = value;
    setForms(newForms);
  };

  const handleEmailChange = (value, index) => {
    const newForms = [...forms];
    newForms[index].email = value;
    setForms(newForms);
  };

  const isFormValid = (index) => {
    const form = forms[index];
    return form && form.name !== '' && form.phone !== '' && form.city !== '' && form.email !== '';
  };

  const handleAdd = () => {
    setForms([...forms, { ...initialFormState }]);
    setIsEditing(false);
  };

  const handleDeleteForm = (index) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this form?');
    if (confirmDelete) {
      setForms((prevForms) => prevForms.filter((element, i) => i !== index));
    }
  };

  const handleDeleteTable = (index) => {
    const formKey = formData[index].key;
    const confirmDelete = window.confirm('Are you sure you want to delete this entry?');

    if (confirmDelete) {
      setFormData((prevData) => prevData.filter((data) => data.key !== formKey));
      localStorage.removeItem(formKey);
      setIsEditing(false);
    }
  };

  const handleEdit = (index) => {
    const formToEdit = formData[index];
    if (formToEdit && formToEdit.key) {
      setForms([formToEdit]);
      setIsEditing(true);
    }
  };

  const handleSubmitAll = () => {
    const newFormData = [];
    forms.forEach((form, index) => {
      if (isFormValid(index)) {
        newFormData.push({ ...form });
        localStorage.setItem(form.key, JSON.stringify(form));
      }
    });

    setFormData(newFormData);

    if (forms.length === 1) {
      const storedFormData = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        const storedData = JSON.parse(localStorage.getItem(key));
        storedFormData.push({ ...storedData, key });
      }
      setFormData(storedFormData);
    }

    setForms([initialFormState]);
    setIsEditing(false);
  };

  const handleUserClick = () => {
    setShowForms(!showForms);
  };

  const handleCancel = () => {
    setShowForms(false);
  };

  const filteredData = formData.filter((data) =>
    data.name.toLowerCase().includes(searchInput.toLowerCase()) ||
    data.phone.includes(searchInput) ||
    data.city.toLowerCase().includes(searchInput.toLowerCase())
  );

  return (
    <div className="App">
      <h2>Form Application</h2>
      <div className="checkdiv">
        <button onClick={handleUserClick} className="show-user-details">
          {showForms ? 'Hide Form' : 'Click to add User Details'}
        </button>
        {showForms &&
          forms.map((form, index) => (
            <div key={form.key} className="form-container">
              <form
                key={form.key}
                onSubmit={(e) => e.preventDefault()}
                className="form"
              >
                <input
                  type="text"
                  name="name"
                  placeholder="Enter name here"
                  value={form.name}
                  maxLength={15}
                  onChange={(e) => handleNameChange(e.target.value, index)}
                />
                <input
                  type="number"
                  name="phone"
                  placeholder="Phone"
                  value={form.phone}
                  maxLength={10}
                  onChange={(e) => handlePhoneChange(e.target.value, index)}
                />
                <input
                  type="text"
                  name="city"
                  placeholder="Enter city here"
                  value={form.city}
                  onChange={(e) => handleCityChange(e.target.value, index)}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => handleEmailChange(e.target.value, index)}
                />
                <button
                  onClick={() => handleSubmitAll()}
                  disabled={!isFormValid(index)}
                >
                  {isEditing ? 'Update' : 'Submit'}
                </button>
                {showForms && (
                  <button onClick={handleCancel} className="cancel-form">
                    Cancel
                  </button>
                )}
                {forms.length > 1 && (
                  <button onClick={() => handleDeleteForm(index)}>
                    Delete Form
                  </button>
                )}
                <button onClick={handleAdd}>Add</button>
              </form>
            </div>
          ))}
      </div>
      {forms.length > 1 && (
        <button onClick={handleSubmitAll}>{isEditing ? 'Update' : 'Submit All'}</button>
      )}
      <input
        type="text"
        name="search"
        placeholder="Search here"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Phone</th>
            <th>City</th>
            <th>Email</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.map((data, index) => (
            <tr key={data.key}>
              <td>{data.name}</td>
              <td>{data.phone}</td>
              <td>{data.city}</td>
              <td>{data.email}</td>
              <td>
                <button onClick={() => handleEdit(index)}>Edit</button>
              </td>
              <td>
                <button onClick={() => handleDeleteTable(index)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default App;
