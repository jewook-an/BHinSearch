import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import './RegisterPage.css';

const RegisterPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const typeFromUrl = searchParams.get('type') || '';

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    userType: typeFromUrl,
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    experienceYears: '',
    company: '',
    position: '',
    agreeTerms: false,
    agreePrivacy: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleUserTypeSelect = (type) => {
    setFormData(prev => ({ ...prev, userType: type }));
    setStep(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert('비밀번호가 일치하지 않습니다.');
      return;
    }

    if (!formData.agreeTerms || !formData.agreePrivacy) {
      alert('약관에 동의해주세요.');
      return;
    }

    // TODO: 실제 회원가입 로직 구현
    console.log('Registration data:', formData);
    alert('회원가입이 완료되었습니다!');
    navigate('/login');
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-card">
          <h2 className="register-title">회원가입</h2>
          <p className="register-subtitle">보험업계 ATS에 가입하세요</p>

          {step === 1 && (
            <div className="user-type-selection">
              <h3>사용자 유형을 선택해주세요</h3>

              <div className="user-type-options">
                <div
                  className="user-type-option"
                  onClick={() => handleUserTypeSelect('experienced')}
                >
                  <div className="option-icon">👔</div>
                  <h4>보험업계 경력자</h4>
                  <p>보험업계에서 1년 이상 근무한 경력자</p>
                </div>

                <div
                  className="user-type-option"
                  onClick={() => handleUserTypeSelect('jobseeker')}
                >
                  <div className="option-icon">🎓</div>
                  <h4>일반 구직자</h4>
                  <p>보험업계 입문을 희망하는 신입/경력자</p>
                </div>

                <div
                  className="user-type-option"
                  onClick={() => handleUserTypeSelect('recruiter')}
                >
                  <div className="option-icon">💼</div>
                  <h4>인사 담당자</h4>
                  <p>채용 공고를 등록하고 관리하는 기업 담당자</p>
                </div>
              </div>

              <div className="back-to-login">
                이미 계정이 있으신가요? <Link to="/login">로그인</Link>
              </div>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="register-form">
              <div className="step-indicator">
                <span className="current-step">사용자 정보 입력</span>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="back-button"
                >
                  ← 뒤로
                </button>
              </div>

              <div className="form-group">
                <label htmlFor="email">이메일 *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="example@email.com"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">비밀번호 *</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="8자 이상 입력하세요"
                  minLength="8"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">비밀번호 확인 *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="비밀번호를 다시 입력하세요"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="name">이름 *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="홍길동"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="phone">연락처 *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="010-1234-5678"
                  required
                />
              </div>

              {formData.userType === 'experienced' && (
                <div className="form-group">
                  <label htmlFor="experienceYears">경력 기간 *</label>
                  <select
                    id="experienceYears"
                    name="experienceYears"
                    value={formData.experienceYears}
                    onChange={handleChange}
                    required
                  >
                    <option value="">선택하세요</option>
                    <option value="1-3">1년 ~ 3년 미만</option>
                    <option value="3-5">3년 ~ 5년 미만</option>
                    <option value="5-10">5년 ~ 10년 미만</option>
                    <option value="10+">10년 이상</option>
                  </select>
                </div>
              )}

              {formData.userType === 'recruiter' && (
                <>
                  <div className="form-group">
                    <label htmlFor="company">회사명 *</label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      placeholder="회사명을 입력하세요"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="position">직위 *</label>
                    <input
                      type="text"
                      id="position"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      placeholder="인사팀 과장"
                      required
                    />
                  </div>
                </>
              )}

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="agreeTerms"
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    required
                  />
                  <span>[필수] 이용약관에 동의합니다</span>
                </label>

                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="agreePrivacy"
                    checked={formData.agreePrivacy}
                    onChange={handleChange}
                    required
                  />
                  <span>[필수] 개인정보 처리방침에 동의합니다</span>
                </label>
              </div>

              <button type="submit" className="btn btn-primary btn-full">
                회원가입 완료
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
