import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ProfilePage.css';

// 더미 데이터
const mockUserProfile = {
  id: 1,
  name: '홍길동',
  email: 'hong@example.com',
  phone: '010-1234-5678',
  userType: 'experienced',
  profileImage: null,

  // 기본 정보
  birthDate: '1990-05-15',
  address: '서울시 강남구',

  // 경력 정보
  experienceYears: '5-10년',
  currentCompany: '삼성생명',
  currentPosition: '보험계리사',

  // 프로필 완성도
  profileCompleteness: 75,

  // 경력사항
  careers: [
    {
      id: 1,
      company: '삼성생명',
      position: '보험계리사',
      startDate: '2020-03',
      endDate: null,
      isCurrent: true,
      description: '생명보험 상품 가격 산정 및 리스크 분석 업무 수행'
    },
    {
      id: 2,
      company: '현대해상',
      position: '언더라이터',
      startDate: '2018-06',
      endDate: '2020-02',
      isCurrent: false,
      description: '손해보험 청약 심사 및 위험 평가'
    }
  ],

  // 학력사항
  education: [
    {
      id: 1,
      school: '서울대학교',
      major: '통계학과',
      degree: '학사',
      startDate: '2012-03',
      endDate: '2016-02',
      status: '졸업'
    }
  ],

  // 자격증
  certificates: [
    {
      id: 1,
      name: '보험계리사',
      organization: '금융감독원',
      acquisitionDate: '2019-11',
      certificateNumber: 'ACT-2019-1234'
    },
    {
      id: 2,
      name: 'AFPK (재무설계사)',
      organization: '한국FP협회',
      acquisitionDate: '2018-05',
      certificateNumber: 'AFPK-2018-5678'
    }
  ],

  // 기술 스택
  skills: ['보험계리', '리스크관리', '통계분석', 'Excel', 'R', 'Python', 'SQL'],

  // 자기소개
  introduction: '보험업계에서 5년 이상의 경력을 보유한 보험계리사입니다. 생명보험 상품 개발 및 가격 산정, 리스크 관리 분야에서 전문성을 갖추고 있습니다.'
};

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profile] = useState(mockUserProfile);

  const handleEdit = () => {
    navigate('/profile/edit');
  };

  const calculateCareerPeriod = (career) => {
    const start = new Date(career.startDate);
    const end = career.isCurrent ? new Date() : new Date(career.endDate);
    const months = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth());
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    return `${years}년 ${remainingMonths}개월`;
  };

  return (
    <div className="profile-page">
      <div className="profile-container">
        {/* 헤더 */}
        <div className="profile-header">
          <div className="profile-header-content">
            <div className="profile-image-section">
              {profile.profileImage ? (
                <img src={profile.profileImage} alt={profile.name} className="profile-image" />
              ) : (
                <div className="profile-image-placeholder">
                  <span className="profile-initial">{profile.name.charAt(0)}</span>
                </div>
              )}
              <button className="btn-change-photo">사진 변경</button>
            </div>

            <div className="profile-info">
              <h1>{profile.name}</h1>
              <p className="profile-position">{profile.currentPosition} at {profile.currentCompany}</p>
              <div className="profile-meta">
                <span>📧 {profile.email}</span>
                <span>📱 {profile.phone}</span>
                <span>📍 {profile.address}</span>
              </div>
              <button className="btn btn-primary" onClick={handleEdit}>
                프로필 수정
              </button>
            </div>
          </div>
        </div>

        {/* 프로필 완성도 */}
        <div className="profile-section">
          <div className="section-header">
            <h2>프로필 완성도</h2>
          </div>
          <div className="profile-completeness">
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{width: `${profile.profileCompleteness}%`}}
              ></div>
            </div>
            <span className="progress-text">{profile.profileCompleteness}%</span>
          </div>
          <div className="completeness-tips">
            <p>💡 프로필을 더 채워서 채용 담당자의 눈에 띄어보세요!</p>
            <ul>
              {profile.profileCompleteness < 100 && (
                <>
                  {!profile.profileImage && <li>프로필 사진 추가 (+10%)</li>}
                  {profile.skills.length < 5 && <li>보유 기술 더 추가하기 (+5%)</li>}
                  {profile.careers.length < 3 && <li>경력사항 상세히 작성 (+10%)</li>}
                </>
              )}
            </ul>
          </div>
        </div>

        <div className="profile-content">
          {/* 왼쪽 컬럼 */}
          <div className="profile-main">
            {/* 자기소개 */}
            <div className="profile-section">
              <div className="section-header">
                <h2>자기소개</h2>
                <Link to="/profile/edit" className="btn-edit">수정</Link>
              </div>
              <div className="section-content">
                <p>{profile.introduction}</p>
              </div>
            </div>

            {/* 경력사항 */}
            <div className="profile-section">
              <div className="section-header">
                <h2>경력사항</h2>
                <Link to="/profile/edit" className="btn-edit">수정</Link>
              </div>
              <div className="section-content">
                <div className="timeline">
                  {profile.careers.map((career) => (
                    <div key={career.id} className="timeline-item">
                      <div className="timeline-marker"></div>
                      <div className="timeline-content">
                        <div className="career-header">
                          <h3>{career.position}</h3>
                          {career.isCurrent && <span className="badge-current">재직중</span>}
                        </div>
                        <p className="company-name">{career.company}</p>
                        <p className="career-period">
                          {career.startDate} ~ {career.isCurrent ? '현재' : career.endDate}
                          ({calculateCareerPeriod(career)})
                        </p>
                        <p className="career-description">{career.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 학력사항 */}
            <div className="profile-section">
              <div className="section-header">
                <h2>학력사항</h2>
                <Link to="/profile/edit" className="btn-edit">수정</Link>
              </div>
              <div className="section-content">
                {profile.education.map((edu) => (
                  <div key={edu.id} className="education-item">
                    <h3>{edu.school}</h3>
                    <p>{edu.major} ({edu.degree})</p>
                    <p className="education-period">
                      {edu.startDate} ~ {edu.endDate} · {edu.status}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* 자격증 */}
            <div className="profile-section">
              <div className="section-header">
                <h2>자격증</h2>
                <Link to="/profile/edit" className="btn-edit">수정</Link>
              </div>
              <div className="section-content">
                <div className="certificates-grid">
                  {profile.certificates.map((cert) => (
                    <div key={cert.id} className="certificate-card">
                      <div className="certificate-icon">🏆</div>
                      <h3>{cert.name}</h3>
                      <p className="certificate-org">{cert.organization}</p>
                      <p className="certificate-date">취득일: {cert.acquisitionDate}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 오른쪽 사이드바 */}
          <aside className="profile-sidebar">
            {/* 보유 기술 */}
            <div className="sidebar-section">
              <h3>보유 기술</h3>
              <div className="skills-list">
                {profile.skills.map((skill, index) => (
                  <span key={index} className="skill-tag">{skill}</span>
                ))}
              </div>
              <Link to="/profile/edit" className="btn-add">+ 기술 추가</Link>
            </div>

            {/* 이력서 관리 */}
            <div className="sidebar-section">
              <h3>이력서 관리</h3>
              <div className="resume-list">
                <div className="resume-item">
                  <span className="resume-icon">📄</span>
                  <div className="resume-info">
                    <p className="resume-name">기본 이력서</p>
                    <p className="resume-date">2026-02-10 수정</p>
                  </div>
                </div>
              </div>
              <button className="btn btn-outline btn-full">이력서 업로드</button>
            </div>

            {/* 자기소개서 관리 */}
            <div className="sidebar-section">
              <h3>자기소개서</h3>
              <div className="cover-letter-list">
                <div className="cover-letter-item">
                  <span className="cover-letter-icon">✍️</span>
                  <div className="cover-letter-info">
                    <p className="cover-letter-name">보험계리사 지원</p>
                    <p className="cover-letter-date">2026-02-08 작성</p>
                  </div>
                </div>
              </div>
              <button className="btn btn-outline btn-full">자기소개서 작성</button>
            </div>

            {/* 활동 내역 */}
            <div className="sidebar-section">
              <h3>활동 요약</h3>
              <div className="activity-stats">
                <div className="stat-item">
                  <span className="stat-number">5</span>
                  <span className="stat-label">지원한 포지션</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">12</span>
                  <span className="stat-label">관심 포지션</span>
                </div>
                <div className="stat-item">
                  <span className="stat-number">45</span>
                  <span className="stat-label">프로필 조회</span>
                </div>
              </div>
              <Link to="/dashboard" className="btn btn-outline btn-full">
                대시보드 보기
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
