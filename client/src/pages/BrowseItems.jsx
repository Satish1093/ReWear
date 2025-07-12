import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const BrowseItems = () => {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [size, setSize] = useState('');

  

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('http://localhost:5000/api/items', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setFiltered(data);
      })
      .catch(err => console.error('Failed to fetch items:', err));
  }, []);
  
  // Filter logic
  useEffect(() => {
    const result = items.filter(item =>
      item.title.toLowerCase().includes(search.toLowerCase()) &&
      (category ? item.category === category : true) &&
      (size ? item.size === size : true)
    );
    setFiltered(result);
  }, [search, category, size, items]);

  const uniqueCategories = [...new Set(items.map(i => i.category))];
  const uniqueSizes = [...new Set(items.map(i => i.size))];

  return (
    <div className="container py-5">
      <h2 className="mb-4">🛍️ Browse Available Items</h2>

      {/* Search + Filters */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search by title..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-4">
          <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            {uniqueCategories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <select className="form-select" value={size} onChange={e => setSize(e.target.value)}>
            <option value="">All Sizes</option>
            {uniqueSizes.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Items */}
      <div className="row g-4">
        {filtered.length === 0 ? (
          <p>No items found for your criteria.</p>
        ) : (
          filtered.map(item => (
            <div className="col-md-6 col-lg-4" key={item._id}>
              <div className="card h-100 shadow-sm">
                <img
                  src={`http://localhost:5000${item.imageUrl}`}
                  alt={item.title}
                  className="card-img-top"
                  style={{ height: '200px', objectFit: 'contain' }}
                />
                <div className="card-body">
                  <h5 className="card-title">{item.title}</h5>
                  <p className="card-text">
                    <strong>Size:</strong> {item.size}<br />
                    <strong>Category:</strong> {item.category}<br />
                    <strong>Mode:</strong> {item.mode}
                  </p>
                </div>
                <div className="card-footer text-end bg-light">
                  <Link to={`/item/${item._id}`} className="btn btn-outline-primary btn-sm">View</Link>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default BrowseItems;
