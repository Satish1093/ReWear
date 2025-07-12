import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState({ name: '', email: '', points: 0 });
  const [items, setItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (storedUser) setUser(storedUser);

    fetch('http://localhost:5000/api/items/my-items', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error('Failed to fetch items:', err));

    fetch('http://localhost:5000/api/wishlist', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => setWishlist(data.map(item => item._id)))
      .catch(err => console.error('Failed to fetch wishlist:', err));
  }, []);

  const toggleWishlist = async (itemId) => {
    const token = localStorage.getItem('token');
    await fetch(`http://localhost:5000/api/wishlist/toggle/${itemId}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` }
    });

    setWishlist(prev =>
      prev.includes(itemId) ? prev.filter(id => id !== itemId) : [...prev, itemId]
    );
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4 fw-bold">👋 Welcome, {user.name}!</h2>

      <div className="card mb-5 shadow-sm">
        <div className="card-body">
          <h5 className="card-title text-primary">👤 Profile Info</h5>
          <p className="mb-1"><strong>Email:</strong> {user.email}</p>
          <p><strong>Points Balance:</strong> <span className="badge bg-success fs-6">{user.points} Points</span></p>
        </div>
      </div>

      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h4>Your Uploaded Items</h4>
          <Link to="/add-item" className="btn btn-outline-success btn-sm">+ Add New Item</Link>
        </div>

        <div className="row g-4">
          {Array.isArray(items) && items.map(item => (
            <div className="col-md-6 col-lg-4" key={item._id}>
              <div className="card h-100 shadow-sm border-0">
                <img src={`http://localhost:5000${item.imageUrl}`} alt={item.title}
                  className="card-img-top" style={{ height: '200px', objectFit: 'contain' }} />
                <div className="card-body">
                  <h6 className="card-title fw-semibold d-flex justify-content-between">
                    {item.title}
                  </h6>
                  <span className={`badge ${item.status === 'Available' ? 'bg-primary' : 'bg-secondary'}`}>
                    {item.status || 'Available'}
                  </span>
                </div>
                <div className="card-footer bg-light text-end">
                  <button
                    onClick={() => toggleWishlist(item._id)}
                    className="btn btn-sm border-0 bg-transparent"
                    title="Toggle Wishlist"
                  >
                    {wishlist.includes(item._id) ? '❤️' : '🤍'}
                  </button>
                  <Link to={`/item/${item._id}`} className="btn btn-sm btn-outline-primary">View</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h4 className="mb-3">🔁 Swap Requests</h4>
        <ul className="list-group shadow-sm">
          <li className="list-group-item d-flex justify-content-between align-items-center">
            Winter Coat <span className="badge px-3 py-2 bg-success">Completed</span>
          </li>
          <li className="list-group-item d-flex justify-content-between align-items-center">
            Sneakers <span className="badge px-3 py-2 bg-warning text-dark">Pending</span>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
