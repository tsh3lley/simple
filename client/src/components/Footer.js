import FontAwesome from 'react-fontawesome';
import colors from '../lib/colors';
import React from 'react';

const Footer = () => (
  <footer className='container'>
    <div className='container grid-lg text-center'>
      <div>
        <p className='m-0'>
          <span>Made in &nbsp;</span>
          <FontAwesome name='sun-o' style={{ color: '#DAA520' }} />
          <span>&nbsp;s u n n y&nbsp;</span>
          <FontAwesome name='sun-o' style={{ color: '#DAA520' }} />
          <span>&nbsp;San Francisco.</span>
        </p>
      </div>
    </div>
    <style jsx>{`
      footer {
        border-top: 1px solid ${colors.grey};
        padding-top: 20px;
        padding-bottom: 20px;
      }
    `}</style>
  </footer>
);

export default Footer;
