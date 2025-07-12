import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const ItemDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/items/${id}`)
      .then(res => res.json())
      .then(data => {
        setItem(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching item:', err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="container py-5">Loading...</div>;
  if (!item) return <div className="container py-5">Item not found</div>;

  const handleSwapRequest = () => {
    alert('Swap request sent!');
  };

  const handleRedeem = () => {
    alert(`You redeemed this item for ${item.points} points.`);
  };

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-6 text-center">
          <img src={`http://localhost:5000${item.imageUrl}`} alt={item.title} className="img-fluid rounded shadow" />
        </div>

        <div className="col-md-6">
          <h3>{item.title}</h3>
          <p className="text-muted">{item.category} • Size {item.size}</p>
          <p><strong>Condition:</strong> {item.condition}</p>
          <p><strong>Description:</strong><br />{item.description}</p>
          <p><strong>Status:</strong> {item.status}</p>
          <p><strong>Listed By:</strong><br />{item.owner?.name || 'Anonymous'}<br /><small>{item.owner?.email}</small></p>

          {item.mode === 'swap' ? (
            <button className="btn btn-primary mt-3" onClick={handleSwapRequest}>
              🔁 Propose Swap
            </button>
          ) : (
            <button className="btn btn-success mt-3" onClick={handleRedeem}>
              💎 Redeem for {item.points} Points
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
