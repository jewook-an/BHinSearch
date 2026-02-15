import React from 'react';
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
            <li><a href="/positions">포지션 검색</a></li>
            <li><a href="/about">서비스 소개</a></li>
            <li><a href="/faq">FAQ</a></li>
          </ul>
        </div>

        <div className="footer-section">
          <h4>고객지원</h4>
          <ul>
            <li><a href="/support">고객센터</a></li>
            <li><a href="/terms">이용약관</a></li>
            <li><a href="/privacy">개인정보처리방침</a></li>
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
