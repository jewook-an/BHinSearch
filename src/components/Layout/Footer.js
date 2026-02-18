import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-section">
          <h3>보험업계 ATS</h3>
          <p>보험업계 전문 채용관리 솔루션</p>
        </div>

        <div className="footer-section">
          <h4>서비스</h4>
          <ul>
            <li><Link to="/positions">포지션 검색</Link></li>
            <li><Link to="/about">서비스 소개</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>고객지원</h4>
          <ul>
            <li><Link to="/support">고객센터</Link></li>
            <li><Link to="/terms">이용약관</Link></li>
            <li><Link to="/privacy">개인정보처리방침</Link></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>문의</h4>
          <p>이메일: support@insurance-ats.com</p>
          <p>전화: 02-1234-5678</p>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 보험업계 ATS. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
