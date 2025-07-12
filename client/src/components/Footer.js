import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-light text-center py-4 mt-5 border-top">
      <div className="container">
        <p className="mb-1">&copy; {new Date().getFullYear()} ReWear — Reuse. Reduce. Recycle.</p>
        <small className="text-muted">Made with ♻️ for sustainability</small>
      </div>
    </footer>
  );
};

export default Footer;
