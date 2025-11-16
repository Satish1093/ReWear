import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ItemDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  // ⭐ Fetch single item details
  const fetchItemDetails = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/items/${id}`);
      const data = await res.json();

      setItem(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching item:', err);
      setLoading(false);
    }
  };

  // First load
  useEffect(() => {
    fetchItemDetails();
  }, [id]);

  if (loading) return <div className="container py-5">Loading...</div>;
  if (!item) return <div className="container py-5">Item not found</div>;

  // ⭐ BUY item function
  const handleBuy = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/items/buy/${item._id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      alert(data.msg);

      fetchItemDetails();  // refresh page after buy
    } catch (err) {
      console.error("Buy error:", err);
    }
  };

  // Swap and Redeem placeholders
  const handleSwapRequest = () => alert("Swap request sent!");
  const handleRedeem = () => alert(`You redeemed this item for ${item.points} points.`);

  return (
    <div className="container py-5">
      <div className="row">

        <div className="col-md-6 text-center">
          <img
            src={`http://localhost:5000${item.imageUrl}`}
            alt={item.title}
            className="img-fluid rounded shadow"
          />
        </div>

        <div className="col-md-6">

          <h3>{item.title}</h3>
          <p className="text-muted">{item.category} • Size {item.size}</p>
          <p><strong>Condition:</strong> {item.condition}</p>
          <p><strong>Description:</strong><br />{item.description}</p>
          <p><strong>Status:</strong> {item.isSold ? "Sold" : item.status}</p>

          <p>
            <strong>Listed By:</strong><br />
            {item.owner?.name || "Anonymous"} <br />
            <small>{item.owner?.email}</small>
          </p>

          {/* Redeem OR Swap */}
          {item.mode === 'swap' ? (
            <button className="btn btn-primary mt-3" onClick={handleSwapRequest}>
              🔁 Propose Swap
            </button>
          ) : (
            <button className="btn btn-success mt-3" onClick={handleRedeem}>
              💎 Redeem for {item.points} Points
            </button>
          )}

          {/* BUY BUTTON */}
          {!item.isSold ? (
            <button
              className="btn btn-success mt-3 ms-2"
              onClick={handleBuy}
            >
              🛒 Buy Now
            </button>
          ) : (
            <span className="badge bg-danger ms-3 fs-6">Sold</span>
          )}

        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
