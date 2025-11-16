import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const BrowseItems = () => {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [size, setSize] = useState('');

  // -------------------------------
  // Fetch all APPROVED items
  // -------------------------------
  const fetchItems = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/items");
      const data = await res.json();

      if (!Array.isArray(data)) return;

      setItems(data);
      setFiltered(data);

    } catch (err) {
      console.error("Failed to fetch items:", err);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  // -------------------------------
  // Filters Apply
  // -------------------------------
  useEffect(() => {
    const result = items.filter(item =>
      item.title.toLowerCase().includes(search.toLowerCase()) &&
      (category ? item.category === category : true) &&
      (size ? item.size === size : true)
    );
    setFiltered(result);
  }, [search, category, size, items]);


  // ⭐ BUY FUNCTION
  const handleBuy = async (id) => {
    const token = localStorage.getItem("token");

    const res = await fetch(`http://localhost:5000/api/items/buy/${id}`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    alert(data.msg);

    fetchItems();  // refresh after buy
  };

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
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="col-md-4">
          <select className="form-select" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">All Categories</option>
            {uniqueCategories.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        <div className="col-md-4">
          <select className="form-select" value={size} onChange={(e) => setSize(e.target.value)}>
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
          <p>No items found.</p>
        ) : (
          filtered.map(item => (
            <div className="col-md-6 col-lg-4" key={item._id}>
              <div className="card h-100 shadow-sm">

                <img
                  src={`http://localhost:5000${item.imageUrl}`}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "contain" }}
                  alt={item.title}
                />

                <div className="card-body">
                  <h5 className="card-title">{item.title}</h5>

                  <p className="card-text">
                    <strong>Size:</strong> {item.size}<br />
                    <strong>Category:</strong> {item.category}<br />
                    <strong>Mode:</strong> {item.mode}
                  </p>
                </div>

                <div className="card-footer d-flex justify-content-between bg-light">
                  <Link to={`/item/${item._id}`} className="btn btn-outline-primary btn-sm">
                    View
                  </Link>

                  {!item.isSold ? (
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => handleBuy(item._id)}
                    >
                      Buy Now
                    </button>
                  ) : (
                    <span className="badge bg-danger">Sold</span>
                  )}
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
