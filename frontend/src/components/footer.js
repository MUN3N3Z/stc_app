import React, { useState } from 'react';
import Button from './button';
import './footer.css';
import { Link } from 'react-router-dom';


export default function Footer() {
  return (
      <div className="footer-container">
          <section className="footer-subscription">
              <p className="footer-subscription-heading">
                  
              </p>
      <div className='social-media-wrap'>
        <div className='footer-logo'>
          <Link to='/' className='social-logo'>
              Student Technology Collaborative
          </Link>
        </div>
        <small className='website-rights'>STC©2023</small>
              </div>
    </section>
      </div>
  );
}