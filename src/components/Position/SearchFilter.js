import React, { useState } from 'react';
import './SearchFilter.css';

const SearchFilter = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    keyword: '',
    location: '',
    experience: '',
    employmentType: '',
    salary: '',
    sortBy: 'latest'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = {
      ...filters,
      [name]: value
    };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      keyword: '',
      location: '',
      experience: '',
      employmentType: '',
      salary: '',
      sortBy: 'latest'
    };
    setFilters(resetFilters);
    onFilterChange(resetFilters);
  };

  return (
    <div className="search-filter">
      <div className="filter-section">
        <label htmlFor="keyword">키워드 검색</label>
        <input
          type="text"
          id="keyword"
          name="keyword"
          value={filters.keyword}
          onChange={handleChange}
          placeholder="직무, 회사명으로 검색"
        />
      </div>

      <div className="filter-section">
        <label htmlFor="location">지역</label>
        <select
          id="location"
          name="location"
          value={filters.location}
          onChange={handleChange}
        >
          <option value="">전체</option>
          <option value="서울">서울</option>
          <option value="경기">경기</option>
          <option value="인천">인천</option>
          <option value="부산">부산</option>
          <option value="대구">대구</option>
          <option value="대전">대전</option>
          <option value="광주">광주</option>
          <option value="울산">울산</option>
          <option value="세종">세종</option>
        </select>
      </div>

      <div className="filter-section">
        <label htmlFor="experience">경력</label>
        <select
          id="experience"
          name="experience"
          value={filters.experience}
          onChange={handleChange}
        >
          <option value="">전체</option>
          <option value="신입">신입</option>
          <option value="1-3년">1~3년</option>
          <option value="3-5년">3~5년</option>
          <option value="5-10년">5~10년</option>
          <option value="10년+">10년 이상</option>
        </select>
      </div>

      <div className="filter-section">
        <label htmlFor="employmentType">고용형태</label>
        <select
          id="employmentType"
          name="employmentType"
          value={filters.employmentType}
          onChange={handleChange}
        >
          <option value="">전체</option>
          <option value="정규직">정규직</option>
          <option value="계약직">계약직</option>
          <option value="인턴">인턴</option>
          <option value="프리랜서">프리랜서</option>
        </select>
      </div>

      <div className="filter-section">
        <label htmlFor="salary">연봉</label>
        <select
          id="salary"
          name="salary"
          value={filters.salary}
          onChange={handleChange}
        >
          <option value="">전체</option>
          <option value="3000">3,000만원 이상</option>
          <option value="4000">4,000만원 이상</option>
          <option value="5000">5,000만원 이상</option>
          <option value="6000">6,000만원 이상</option>
          <option value="7000">7,000만원 이상</option>
          <option value="8000">8,000만원 이상</option>
        </select>
      </div>

      <div className="filter-section">
        <label htmlFor="sortBy">정렬</label>
        <select
          id="sortBy"
          name="sortBy"
          value={filters.sortBy}
          onChange={handleChange}
        >
          <option value="latest">최신순</option>
          <option value="popular">인기순</option>
          <option value="applicants">지원자순</option>
          <option value="salary">연봉순</option>
        </select>
      </div>

      <div className="filter-actions">
        <button onClick={handleReset} className="btn btn-outline btn-full">
          필터 초기화
        </button>
      </div>
    </div>
  );
};

export default SearchFilter;
