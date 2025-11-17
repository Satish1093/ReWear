import React, { useState } from 'react';

const AddItem = () => {
  const [form, setForm] = useState({
    title: '',
    description: '',
    size: '',
    category: '',
    condition: '',
    mode: 'swap',
    pointValue: '',
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first!');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('size', form.size);
      formData.append('category', form.category);
      formData.append('condition', form.condition);
      formData.append('mode', form.mode);
      if (form.mode === 'points') {
        formData.append('points', form.pointValue);
      }
      formData.append('image', imageFile);
      
      const res = await fetch('https://rewear-z7yj.onrender.com/api/items', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();

      if (res.ok) {
        alert('Item added successfully!');
        setForm({
          title: '',
          description: '',
          size: '',
          category: '',
          condition: '',
          mode: 'swap',
          pointValue: '',
        });
        setImageFile(null);
        setImagePreview(null);
      } else {
        alert(data.msg || 'Something went wrong.');
      }

    } catch (err) {
      console.error(err);
      alert('Failed to upload item');
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">List a New Item</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Title</label>
          <input type="text" className="form-control" name="title" value={form.title} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea className="form-control" name="description" rows="3" value={form.description} onChange={handleChange} required></textarea>
        </div>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Category</label>
            <select className="form-select" name="category" value={form.category} onChange={handleChange} required>
              <option value="">Select category</option>
              <option value="Tops">Tops</option>
              <option value="Bottoms">Bottoms</option>
              <option value="Footwear">Footwear</option>
              <option value="Accessories">Accessories</option>
            </select>
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Size</label>
            <select className="form-select" name="size" value={form.size} onChange={handleChange} required>
              <option value="">Select size</option>
              <option value="XS">XS</option>
              <option value="S">S</option>
              <option value="M">M</option>
              <option value="L">L</option>
              <option value="XL">XL</option>
            </select>
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Condition</label>
          <select className="form-select" name="condition" value={form.condition} onChange={handleChange} required>
            <option value="">Select condition</option>
            <option value="New">New</option>
            <option value="Good">Good</option>
            <option value="Worn">Worn</option>
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Availability</label>
          <select className="form-select" name="mode" value={form.mode} onChange={handleChange}>
            <option value="swap">Available for Swap</option>
            <option value="points">Redeem with Points</option>
          </select>
        </div>
        {form.mode === 'points' && (
          <div className="mb-3">
            <label className="form-label">Point Value</label>
            <input type="number" className="form-control" name="pointValue" value={form.pointValue} onChange={handleChange} required />
          </div>
        )}
        <div className="mb-3">
          <label className="form-label">Upload Image</label>
          <input type="file" className="form-control" accept="image/*" onChange={handleImageUpload} required />
        </div>
        {imagePreview && (
          <div className="mb-3">
            <img src={imagePreview} alt="Preview" className="img-thumbnail" style={{ maxWidth: '200px' }} />
          </div>
        )}
        <button type="submit" className="btn btn-success">Submit Item</button>
      </form>
    </div>
  );
};

export default AddItem;
