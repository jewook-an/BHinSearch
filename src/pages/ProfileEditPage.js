import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfileEditPage.css';

const ProfileEditPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '홍길동',
    email: 'hong@example.com',
    phone: '010-1234-5678',
    birthDate: '1990-05-15',
    address: '서울시 강남구',
    currentCompany: '삼성생명',
    currentPosition: '보험계리사',
    experienceYears: '5-10년',
    introduction: '보험업계에서 5년 이상의 경력을 보유한 보험계리사입니다. 생명보험 상품 개발 및 가격 산정, 리스크 관리 분야에서 전문성을 갖추고 있습니다.'
  });

  const [careers, setCareers] = useState([
    {
      id: 1,
      company: '삼성생명',
      position: '보험계리사',
      startDate: '2020-03',
      endDate: '',
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
  ]);

  const [education, setEducation] = useState([
    {
      id: 1,
      school: '서울대학교',
      major: '통계학과',
      degree: '학사',
      startDate: '2012-03',
      endDate: '2016-02',
      status: '졸업'
    }
  ]);

  const [certificates, setCertificates] = useState([
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
  ]);

  const [skills, setSkills] = useState(['보험계리', '리스크관리', '통계분석', 'Excel', 'R', 'Python', 'SQL']);
  const [newSkill, setNewSkill] = useState('');

  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCareerChange = (id, field, value) => {
    setCareers(prev => prev.map(career =>
      career.id === id ? { ...career, [field]: value } : career
    ));
  };

  const addCareer = () => {
    const newCareer = {
      id: Date.now(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      isCurrent: false,
      description: ''
    };
    setCareers(prev => [...prev, newCareer]);
  };

  const removeCareer = (id) => {
    setCareers(prev => prev.filter(career => career.id !== id));
  };

  const handleEducationChange = (id, field, value) => {
    setEducation(prev => prev.map(edu =>
      edu.id === id ? { ...edu, [field]: value } : edu
    ));
  };

  const addEducation = () => {
    const newEdu = {
      id: Date.now(),
      school: '',
      major: '',
      degree: '학사',
      startDate: '',
      endDate: '',
      status: '졸업'
    };
    setEducation(prev => [...prev, newEdu]);
  };

  const removeEducation = (id) => {
    setEducation(prev => prev.filter(edu => edu.id !== id));
  };

  const handleCertificateChange = (id, field, value) => {
    setCertificates(prev => prev.map(cert =>
      cert.id === id ? { ...cert, [field]: value } : cert
    ));
  };

  const addCertificate = () => {
    const newCert = {
      id: Date.now(),
      name: '',
      organization: '',
      acquisitionDate: '',
      certificateNumber: ''
    };
    setCertificates(prev => [...prev, newCert]);
  };

  const removeCertificate = (id) => {
    setCertificates(prev => prev.filter(cert => cert.id !== id));
  };

  const addSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills(prev => [...prev, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setSkills(prev => prev.filter(skill => skill !== skillToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // 실제로는 API 호출
    console.log('프로필 업데이트:', { formData, careers, education, certificates, skills });
    alert('프로필이 저장되었습니다.');
    navigate('/profile');
  };

  const handleCancel = () => {
    if (window.confirm('변경사항이 저장되지 않을 수 있습니다. 취소하시겠습니까?')) {
      navigate('/profile');
    }
  };

  return (
    <div className="profile-edit-page">
      <div className="edit-container">
        <div className="edit-header">
          <h1>프로필 수정</h1>
          <p>정확한 정보를 입력하면 더 적합한 포지션을 추천받을 수 있습니다.</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* 기본 정보 */}
          <section className="edit-section">
            <h2>기본 정보</h2>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="name">이름 *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleBasicInfoChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">이메일 *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleBasicInfoChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">전화번호 *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleBasicInfoChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="birthDate">생년월일</label>
                <input
                  type="date"
                  id="birthDate"
                  name="birthDate"
                  value={formData.birthDate}
                  onChange={handleBasicInfoChange}
                />
              </div>

              <div className="form-group full-width">
                <label htmlFor="address">주소</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleBasicInfoChange}
                />
              </div>
            </div>
          </section>

          {/* 현재 직무 정보 */}
          <section className="edit-section">
            <h2>현재 직무</h2>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="currentCompany">현재 회사</label>
                <input
                  type="text"
                  id="currentCompany"
                  name="currentCompany"
                  value={formData.currentCompany}
                  onChange={handleBasicInfoChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="currentPosition">직책</label>
                <input
                  type="text"
                  id="currentPosition"
                  name="currentPosition"
                  value={formData.currentPosition}
                  onChange={handleBasicInfoChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="experienceYears">경력</label>
                <select
                  id="experienceYears"
                  name="experienceYears"
                  value={formData.experienceYears}
                  onChange={handleBasicInfoChange}
                >
                  <option value="신입">신입</option>
                  <option value="1-3년">1-3년</option>
                  <option value="3-5년">3-5년</option>
                  <option value="5-10년">5-10년</option>
                  <option value="10년 이상">10년 이상</option>
                </select>
              </div>
            </div>
          </section>

          {/* 자기소개 */}
          <section className="edit-section">
            <h2>자기소개</h2>
            <div className="form-group">
              <label htmlFor="introduction">자기소개</label>
              <textarea
                id="introduction"
                name="introduction"
                rows="5"
                value={formData.introduction}
                onChange={handleBasicInfoChange}
                placeholder="자신의 경험, 강점, 목표 등을 간략히 작성해주세요."
              />
              <span className="char-count">{formData.introduction.length} / 500</span>
            </div>
          </section>

          {/* 경력사항 */}
          <section className="edit-section">
            <div className="section-header-with-button">
              <h2>경력사항</h2>
              <button type="button" className="btn btn-outline-small" onClick={addCareer}>
                + 경력 추가
              </button>
            </div>
            {careers.map((career, index) => (
              <div key={career.id} className="form-repeater-item">
                <div className="repeater-header">
                  <h3>경력 {index + 1}</h3>
                  {careers.length > 1 && (
                    <button
                      type="button"
                      className="btn-remove"
                      onClick={() => removeCareer(career.id)}
                    >
                      삭제
                    </button>
                  )}
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>회사명</label>
                    <input
                      type="text"
                      value={career.company}
                      onChange={(e) => handleCareerChange(career.id, 'company', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>직책</label>
                    <input
                      type="text"
                      value={career.position}
                      onChange={(e) => handleCareerChange(career.id, 'position', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>시작일</label>
                    <input
                      type="month"
                      value={career.startDate}
                      onChange={(e) => handleCareerChange(career.id, 'startDate', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>종료일</label>
                    <input
                      type="month"
                      value={career.endDate}
                      onChange={(e) => handleCareerChange(career.id, 'endDate', e.target.value)}
                      disabled={career.isCurrent}
                    />
                  </div>
                  <div className="form-group checkbox-group full-width">
                    <label>
                      <input
                        type="checkbox"
                        checked={career.isCurrent}
                        onChange={(e) => handleCareerChange(career.id, 'isCurrent', e.target.checked)}
                      />
                      <span>현재 재직중</span>
                    </label>
                  </div>
                  <div className="form-group full-width">
                    <label>업무 설명</label>
                    <textarea
                      rows="3"
                      value={career.description}
                      onChange={(e) => handleCareerChange(career.id, 'description', e.target.value)}
                      placeholder="담당했던 주요 업무를 설명해주세요."
                    />
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* 학력사항 */}
          <section className="edit-section">
            <div className="section-header-with-button">
              <h2>학력사항</h2>
              <button type="button" className="btn btn-outline-small" onClick={addEducation}>
                + 학력 추가
              </button>
            </div>
            {education.map((edu, index) => (
              <div key={edu.id} className="form-repeater-item">
                <div className="repeater-header">
                  <h3>학력 {index + 1}</h3>
                  {education.length > 1 && (
                    <button
                      type="button"
                      className="btn-remove"
                      onClick={() => removeEducation(edu.id)}
                    >
                      삭제
                    </button>
                  )}
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>학교명</label>
                    <input
                      type="text"
                      value={edu.school}
                      onChange={(e) => handleEducationChange(edu.id, 'school', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>전공</label>
                    <input
                      type="text"
                      value={edu.major}
                      onChange={(e) => handleEducationChange(edu.id, 'major', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>학위</label>
                    <select
                      value={edu.degree}
                      onChange={(e) => handleEducationChange(edu.id, 'degree', e.target.value)}
                    >
                      <option value="고졸">고졸</option>
                      <option value="전문학사">전문학사</option>
                      <option value="학사">학사</option>
                      <option value="석사">석사</option>
                      <option value="박사">박사</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>상태</label>
                    <select
                      value={edu.status}
                      onChange={(e) => handleEducationChange(edu.id, 'status', e.target.value)}
                    >
                      <option value="재학중">재학중</option>
                      <option value="휴학">휴학</option>
                      <option value="졸업">졸업</option>
                      <option value="졸업예정">졸업예정</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>입학일</label>
                    <input
                      type="month"
                      value={edu.startDate}
                      onChange={(e) => handleEducationChange(edu.id, 'startDate', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>졸업일</label>
                    <input
                      type="month"
                      value={edu.endDate}
                      onChange={(e) => handleEducationChange(edu.id, 'endDate', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* 자격증 */}
          <section className="edit-section">
            <div className="section-header-with-button">
              <h2>자격증</h2>
              <button type="button" className="btn btn-outline-small" onClick={addCertificate}>
                + 자격증 추가
              </button>
            </div>
            {certificates.map((cert, index) => (
              <div key={cert.id} className="form-repeater-item">
                <div className="repeater-header">
                  <h3>자격증 {index + 1}</h3>
                  <button
                    type="button"
                    className="btn-remove"
                    onClick={() => removeCertificate(cert.id)}
                  >
                    삭제
                  </button>
                </div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>자격증명</label>
                    <input
                      type="text"
                      value={cert.name}
                      onChange={(e) => handleCertificateChange(cert.id, 'name', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>발급기관</label>
                    <input
                      type="text"
                      value={cert.organization}
                      onChange={(e) => handleCertificateChange(cert.id, 'organization', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>취득일</label>
                    <input
                      type="month"
                      value={cert.acquisitionDate}
                      onChange={(e) => handleCertificateChange(cert.id, 'acquisitionDate', e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label>자격증 번호</label>
                    <input
                      type="text"
                      value={cert.certificateNumber}
                      onChange={(e) => handleCertificateChange(cert.id, 'certificateNumber', e.target.value)}
                    />
                  </div>
                </div>
              </div>
            ))}
          </section>

          {/* 보유 기술 */}
          <section className="edit-section">
            <h2>보유 기술</h2>
            <div className="skills-editor">
              <div className="skills-list-edit">
                {skills.map((skill, index) => (
                  <div key={index} className="skill-tag-edit">
                    <span>{skill}</span>
                    <button
                      type="button"
                      className="btn-remove-skill"
                      onClick={() => removeSkill(skill)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
              <div className="skill-input-group">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  placeholder="기술을 입력하고 추가 버튼을 클릭하세요"
                />
                <button type="button" className="btn btn-outline-small" onClick={addSkill}>
                  추가
                </button>
              </div>
            </div>
          </section>

          {/* 액션 버튼 */}
          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={handleCancel}>
              취소
            </button>
            <button type="submit" className="btn btn-primary">
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileEditPage;
