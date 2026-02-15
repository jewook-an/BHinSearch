import React from 'react';
import { Link } from 'react-router-dom';
import './PositionCard.css';

const PositionCard = ({ position }) => {
  const {
    id,
    title,
    company,
    location,
    experience,
    salary,
    employmentType,
    tags,
    postedDate,
    applicants,
    viewCount,
    companyLogo
  } = position;

  return (
    <div className="position-card">
      <div className="position-card-header">
        <div className="company-logo">
          {companyLogo ? (
            <img src={companyLogo} alt={company} />
          ) : (
            <div className="logo-placeholder">🏢</div>
          )}
        </div>
        <div className="company-info">
          <h3 className="position-title">
            <Link to={`/positions/${id}`}>{title}</Link>
          </h3>
          <p className="company-name">{company}</p>
        </div>
      </div>

      <div className="position-details">
        <div className="detail-item">
          <span className="detail-icon">📍</span>
          <span>{location}</span>
        </div>
        <div className="detail-item">
          <span className="detail-icon">💼</span>
          <span>{experience}</span>
        </div>
        <div className="detail-item">
          <span className="detail-icon">💰</span>
          <span>{salary}</span>
        </div>
        <div className="detail-item">
          <span className="detail-icon">📋</span>
          <span>{employmentType}</span>
        </div>
      </div>

      {tags && tags.length > 0 && (
        <div className="position-tags">
          {tags.map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>
      )}

      <div className="position-footer">
        <div className="position-meta">
          <span className="posted-date">{postedDate}</span>
          <span className="stats">
            지원자 {applicants}명 · 조회 {viewCount}회
          </span>
        </div>
        <div className="position-actions">
          <button className="btn-bookmark" title="즐겨찾기">
            ⭐
          </button>
          <Link to={`/positions/${id}`} className="btn btn-primary btn-small">
            상세보기
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PositionCard;
