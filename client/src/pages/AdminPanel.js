import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const [pendingItems, setPendingItems] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/not-authorized');
      return;
    }

    fetch('http://localhost:5000/api/admin/pending-items', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => res.json())
      .then(data => setPendingItems(data))
      .catch(err => console.error('Failed to fetch pending items:', err));
  }, [token, user, navigate]);

  const handleApprove = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/admin/approve-item/${id}`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setPendingItems(pendingItems.filter(item => item._id !== id));
        alert('Item approved');
      }
    } catch (err) {
      console.error('Approval failed:', err);
    }
  };

  const handleReject = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/items/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        setPendingItems(pendingItems.filter(item => item._id !== id));
        alert('Item rejected');
      }
    } catch (err) {
      console.error('Rejection failed:', err);
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">🛡️ Admin Panel - Manage Listings</h2>

      {pendingItems.length === 0 ? (
        <div className="alert alert-success">No pending items to approve.</div>
      ) : (
        <div className="row g-4">
          {pendingItems.map(item => (
            <div className="col-md-6 col-lg-4" key={item._id}>
              <div className="card h-100 shadow-sm">
                <img
                  src={`http://localhost:5000${item.imageUrl}`}
                  alt={item.title}
                  className="card-img-top"
                  style={{ height: '200px', objectFit: 'cover' }}
                  onError={(e) => { e.target.src = '/fallback.jpg'; }} // fallback image
                />
                <div className="card-body">
                  <h5 className="card-title">{item.title}</h5>
                  <p className="card-text mb-1"><strong>Category:</strong> {item.category}</p>
                  <p className="card-text mb-1"><strong>Condition:</strong> {item.condition}</p>
                  <p className="card-text mb-1"><strong>Mode:</strong> {item.mode}</p>
                  <p className="card-text"><strong>Owner:</strong> {item.owner?.name || 'Unknown'}</p>
                </div>
                <div className="card-footer d-flex justify-content-between">
                  <button className="btn btn-success btn-sm" onClick={() => handleApprove(item._id)}>Approve</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleReject(item._id)}>Reject</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
