import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './PositionDetailPage.css';

// 더미 데이터 (실제로는 API에서 가져옴)
const mockPositionDetails = {
  1: {
    id: 1,
    title: '보험계리사',
    company: '삼성생명',
    location: '서울 중구',
    experience: '3~5년',
    salary: '5,000만원~7,000만원',
    employmentType: '정규직',
    tags: ['계리', '리스크관리', '통계분석'],
    postedDate: '2026-02-12',
    deadline: '2026-03-15',
    applicants: 45,
    viewCount: 234,
    description: `
      삼성생명에서 보험계리사를 모집합니다.

      ▶ 주요 업무
      • 보험 상품 가격 산정 및 리스크 분석
      • 재무 건전성 평가 및 보고서 작성
      • 자산부채 종합평가(ALM) 업무 수행
      • 규제 대응 및 준법감시 업무 지원

      ▶ 자격 요건
      • 보험계리사 자격증 소지자 (필수)
      • 보험업계 경력 3~5년
      • 통계, 수학, 경제학 등 관련 전공자 우대
      • Excel, R, Python 등 데이터 분석 도구 활용 가능자

      ▶ 우대 사항
      • 생명보험회사 근무 경험자
      • 영어 능통자 (TOEIC 850 이상)
      • 금융권 프로젝트 경험자
    `,
    benefits: [
      '4대 보험 완비',
      '퇴직금',
      '성과급',
      '자기계발비 지원',
      '중식 제공',
      '유연근무제',
      '육아휴직',
      '경조휴가/경조금'
    ],
    companyInfo: {
      name: '삼성생명',
      industry: '생명보험',
      employees: '5,000명 이상',
      website: 'https://www.samsunglife.com',
      description: '삼성생명은 대한민국을 대표하는 생명보험회사입니다.'
    }
  },
  2: {
    id: 2,
    title: '언더라이터',
    company: '현대해상',
    location: '서울 여의도',
    experience: '5~10년',
    salary: '6,000만원~8,000만원',
    employmentType: '정규직',
    tags: ['언더라이팅', '리스크평가', '손해사정'],
    postedDate: '2026-02-11',
    deadline: '2026-03-10',
    applicants: 32,
    viewCount: 189,
    description: `
      현대해상에서 경험 많은 언더라이터를 모집합니다.

      ▶ 주요 업무
      • 보험 청약 심사 및 위험 평가
      • 보험료 산정 및 인수 조건 결정
      • 재보험 업무 처리
      • 언더라이팅 가이드라인 개선

      ▶ 자격 요건
      • 손해보험 언더라이팅 경력 5년 이상
      • 보험 관련 자격증 보유자 우대
      • 리스크 분석 능력 우수자
      • 원활한 커뮤니케이션 능력

      ▶ 우대 사항
      • 재보험 업무 경험자
      • 외국계 보험사 근무 경험자
      • 영어 능통자
    `,
    benefits: [
      '4대 보험',
      '퇴직금',
      '인센티브',
      '학자금 지원',
      '건강검진',
      '휴양시설',
      '연차',
      '경조사 지원'
    ],
    companyInfo: {
      name: '현대해상',
      industry: '손해보험',
      employees: '3,000명 이상',
      website: 'https://www.hi.co.kr',
      description: '현대해상은 대한민국의 대표적인 손해보험회사입니다.'
    }
  }
};

const PositionDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState(false);

  const position = mockPositionDetails[id] || mockPositionDetails[1];

  const handleApply = () => {
    // 실제로는 로그인 체크 후 지원 페이지로 이동
    if (window.confirm('이 포지션에 지원하시겠습니까?')) {
      alert('지원이 완료되었습니다!');
      navigate('/dashboard');
    }
  };

  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: position.title,
        text: `${position.company} - ${position.title}`,
        url: window.location.href
      });
    } else {
      alert('현재 브라우저는 공유 기능을 지원하지 않습니다.');
    }
  };

  return (
    <div className="position-detail-page">
      <div className="position-detail-container">
        <div className="breadcrumb">
          <Link to="/">홈</Link> &gt; <Link to="/positions">포지션 검색</Link> &gt; {position.title}
        </div>

        <div className="position-detail-header">
          <div className="header-left">
            <h1 className="position-title">{position.title}</h1>
            <div className="company-info">
              <h2 className="company-name">{position.company}</h2>
              <div className="position-meta">
                <span>📍 {position.location}</span>
                <span>💼 {position.experience}</span>
                <span>💰 {position.salary}</span>
                <span>📋 {position.employmentType}</span>
              </div>
            </div>
          </div>
          <div className="header-right">
            <button
              className={`btn-bookmark ${isBookmarked ? 'bookmarked' : ''}`}
              onClick={handleBookmark}
            >
              {isBookmarked ? '⭐ 즐겨찾기됨' : '☆ 즐겨찾기'}
            </button>
            <button className="btn-share" onClick={handleShare}>
              🔗 공유
            </button>
          </div>
        </div>

        <div className="position-stats">
          <span>📅 등록일: {position.postedDate}</span>
          <span>⏰ 마감일: {position.deadline}</span>
          <span>👥 지원자: {position.applicants}명</span>
          <span>👁️ 조회: {position.viewCount}회</span>
        </div>

        <div className="position-content">
          <aside className="position-sidebar">
            <div className="sidebar-card action-card">
              <button className="btn btn-primary btn-large btn-full" onClick={handleApply}>
                지원하기
              </button>
              <p className="deadline-notice">
                ⏰ 마감일: {position.deadline}
              </p>
            </div>

            <div className="sidebar-card">
              <h3>기업 정보</h3>
              <div className="company-details">
                <div className="detail-row">
                  <span className="label">회사명</span>
                  <span className="value">{position.companyInfo.name}</span>
                </div>
                <div className="detail-row">
                  <span className="label">업종</span>
                  <span className="value">{position.companyInfo.industry}</span>
                </div>
                <div className="detail-row">
                  <span className="label">규모</span>
                  <span className="value">{position.companyInfo.employees}</span>
                </div>
              </div>
              <a
                href={position.companyInfo.website}
                target="_blank"
                rel="noopener noreferrer"
                className="company-link"
              >
                회사 웹사이트 →
              </a>
            </div>

            <div className="sidebar-card">
              <h3>복리후생</h3>
              <ul className="benefits-list">
                {position.benefits.map((benefit, index) => (
                  <li key={index}>✓ {benefit}</li>
                ))}
              </ul>
            </div>
          </aside>

          <main className="position-main">
            <div className="content-card">
              <h2>포지션 상세</h2>
              {position.tags && position.tags.length > 0 && (
                <div className="position-tags">
                  {position.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
              )}
              <div className="position-description">
                {position.description.split('\n').map((line, index) => (
                  <p key={index}>{line}</p>
                ))}
              </div>
            </div>

            <div className="content-card">
              <h2>회사 소개</h2>
              <p>{position.companyInfo.description}</p>
            </div>

            <div className="content-card">
              <h2>유의사항</h2>
              <ul className="notice-list">
                <li>본 채용은 {position.company}의 공식 채용 절차를 따릅니다.</li>
                <li>허위 정보 기재 시 채용이 취소될 수 있습니다.</li>
                <li>제출된 서류는 반환되지 않습니다.</li>
                <li>지원서 접수 후 수정이 불가능하니 신중하게 작성해주세요.</li>
              </ul>
            </div>

            <div className="action-footer">
              <button className="btn btn-outline" onClick={() => navigate(-1)}>
                목록으로
              </button>
              <button className="btn btn-primary btn-large" onClick={handleApply}>
                지원하기
              </button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default PositionDetailPage;
