import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminPanel = () => {
  const [pendingItems, setPendingItems] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    // 🔒 Check admin
    if (!user || !user.isAdmin) {
      navigate("/not-authorized");
      return;
    }

    // Fetch pending items
    const fetchPendingItems = async () => {
      try {
        const res = await fetch("https://rewear-z7yj.onrender.com/api/admin/pending-items", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();

        // ✔ Always ensure array
        setPendingItems(Array.isArray(data) ? data : []);

      } catch (err) {
        console.error("Failed to fetch pending items:", err);
        setPendingItems([]); // fallback as array
      }
    };

    fetchPendingItems();
  }, [navigate, token, user]);

  // APPROVE ITEM
  const handleApprove = async (id) => {
    try {
      const res = await fetch(`https://rewear-z7yj.onrender.com/api/admin/approve-item/${id}`, {
        method: "PATCH",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setPendingItems(prev => prev.filter(item => item._id !== id));
        alert("Item approved");
      }
    } catch (err) {
      console.error("Approval failed:", err);
    }
  };

  // REJECT ITEM
  const handleReject = async (id) => {
    try {
      const res = await fetch(`https://rewear-z7yj.onrender.com/api/items/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setPendingItems(prev => prev.filter(item => item._id !== id));
        alert("Item rejected");
      }
    } catch (err) {
      console.error("Rejection failed:", err);
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">🛡️ Admin Panel - Manage Listings</h2>

      {/* No Pending Items */}
      {pendingItems.length === 0 ? (
        <div className="alert alert-success">No pending items to approve.</div>
      ) : (
        <div className="row g-4">
          {pendingItems.map((item) => (
            <div className="col-md-6 col-lg-4" key={item._id}>
              <div className="card h-100 shadow-sm">

                <img
                  src={`https://rewear-z7yj.onrender.com${item.imageUrl}`}
                  alt={item.title}
                  className="card-img-top"
                  style={{ height: "200px", objectFit: "cover" }}
                  onError={(e) => (e.target.src = "/fallback.jpg")}
                />

                <div className="card-body">
                  <h5 className="card-title">{item.title}</h5>
                  <p className="card-text mb-1"><strong>Category:</strong> {item.category}</p>
                  <p className="card-text mb-1"><strong>Condition:</strong> {item.condition}</p>
                  <p className="card-text mb-1"><strong>Mode:</strong> {item.mode}</p>
                  <p className="card-text"><strong>Owner:</strong> {item.owner?.name || "Unknown"}</p>
                </div>

                <div className="card-footer d-flex justify-content-between">
                  <button
                    className="btn btn-success btn-sm"
                    onClick={() => handleApprove(item._id)}
                  >
                    Approve
                  </button>

                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => handleReject(item._id)}
                  >
                    Reject
                  </button>
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
