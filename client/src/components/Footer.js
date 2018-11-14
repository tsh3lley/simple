import FontAwesome from 'react-fontawesome';
import React from 'react';

const Footer = () => (
  <footer style={{padding: '40px 0'}}>
    <div className='container text-center'>
      <p className='m-0'>
        <span>Made in &nbsp;</span>
        <FontAwesome name='sun-o' style={{ color: '#DAA520' }} />
        <a href='/logout'>&nbsp;s u n n y&nbsp;</a>
        <FontAwesome name='sun-o' style={{ color: '#DAA520' }} />
        <span>&nbsp;San Francisco.</span>
      </p>
    </div>
  </footer>
);

export default Footer;
