import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  const [featuredItems, setFeaturedItems] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/items/featured')
      .then(res => res.json())
      .then(data => setFeaturedItems(data))
      .catch(err => console.error('Failed to load featured items:', err));
  }, []);

  return (
    <div className="container py-5">
      <h1 className="mb-3 fw-bold">Welcome to ReWear</h1>
      <p className="text-muted mb-4">
        Exchange unused clothes sustainably. Swap or redeem — ReWear, don't throw!
      </p>

      <div className="mb-5 d-flex flex-wrap gap-3">
        <Link to="/dashboard" className="btn btn-primary">Start Swapping</Link>
        <Link to="/browse" className="btn btn-outline-secondary">Browse Items</Link>
        <Link to="/add-item" className="btn btn-outline-success">List an Item</Link>
      </div>

      <h3 className="mb-4">Featured Items</h3>

      <div className="row g-4">
        {featuredItems.length > 0 ? (
          featuredItems.map(item => (
            <div className="col-md-4" key={item._id}>
              <div className="card h-100 shadow-sm">
                <img
                  src={`http://localhost:5000${item.imageUrl}`}
                  className="card-img-top"
                  alt={item.title}
                  style={{ height: '250px', objectFit: 'contain' }}
                />
                <div className="card-body">
                  <h5 className="card-title">{item.title}</h5>
                  <p className="card-text text-muted">
                    Size {item.size} • {item.points} Points
                  </p>
                  <Link to={`/item/${item._id}`} className="btn btn-sm btn-outline-primary">
                    View Details
                  </Link>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="alert alert-info">No featured items available.</div>
        )}
      </div>
    </div>
  );
};

export default LandingPage;
