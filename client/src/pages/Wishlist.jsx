import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    fetch('https://rewear-z7yj.onrender.com/api/wishlist', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(setItems);
  }, []);

  return (
    <div className="container py-5">
      <h2>❤️ Your Wishlist</h2>
      <div className="row g-4 mt-3">
        {items.map(item => (
          <div className="col-md-4" key={item._id}>
            <div className="card h-100">
              <img src={item.imageUrl} className="card-img-top" alt={item.title} />
              <div className="card-body">
                <h5>{item.title}</h5>
              </div>
              <div className="card-footer text-end">
                <Link to={`/item/${item._id}`} className="btn btn-outline-primary btn-sm">View</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
