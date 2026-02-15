import React, { useState } from 'react';
import PositionCard from '../components/Position/PositionCard';
import SearchFilter from '../components/Position/SearchFilter';
import './PositionsPage.css';

// 더미 데이터
const mockPositions = [
  {
    id: 1,
    title: '보험계리사',
    company: '삼성생명',
    location: '서울 중구',
    experience: '3~5년',
    salary: '5,000만원~7,000만원',
    employmentType: '정규직',
    tags: ['계리', '리스크관리', '통계분석'],
    postedDate: '2일 전',
    applicants: 45,
    viewCount: 234
  },
  {
    id: 2,
    title: '언더라이터',
    company: '현대해상',
    location: '서울 여의도',
    experience: '5~10년',
    salary: '6,000만원~8,000만원',
    employmentType: '정규직',
    tags: ['언더라이팅', '리스크평가', '손해사정'],
    postedDate: '3일 전',
    applicants: 32,
    viewCount: 189
  },
  {
    id: 3,
    title: '손해사정사',
    company: 'KB손해보험',
    location: '서울 강남구',
    experience: '1~3년',
    salary: '4,000만원~5,000만원',
    employmentType: '정규직',
    tags: ['손해사정', '현장조사', '보상처리'],
    postedDate: '5일 전',
    applicants: 28,
    viewCount: 156
  },
  {
    id: 4,
    title: '보험상품개발 매니저',
    company: '메리츠화재',
    location: '서울 광화문',
    experience: '5~10년',
    salary: '7,000만원~9,000만원',
    employmentType: '정규직',
    tags: ['상품기획', '시장분석', '정책이해'],
    postedDate: '1주일 전',
    applicants: 23,
    viewCount: 145
  },
  {
    id: 5,
    title: '리스크관리 전문가',
    company: '한화생명',
    location: '서울 여의도',
    experience: '10년+',
    salary: '8,000만원 이상',
    employmentType: '정규직',
    tags: ['ERM', '리스크분석', 'ALM'],
    postedDate: '1주일 전',
    applicants: 18,
    viewCount: 201
  },
  {
    id: 6,
    title: '보험설계사',
    company: '교보생명',
    location: '서울 종로구',
    experience: '신입',
    salary: '연봉 협의',
    employmentType: '정규직',
    tags: ['영업', '고객관리', '재무설계'],
    postedDate: '2주일 전',
    applicants: 67,
    viewCount: 312
  },
  {
    id: 7,
    title: '보험금융 데이터분석가',
    company: 'DB손해보험',
    location: '서울 강남구',
    experience: '3~5년',
    salary: '5,500만원~7,500만원',
    employmentType: '정규직',
    tags: ['데이터분석', 'Python', 'SQL', '머신러닝'],
    postedDate: '3일 전',
    applicants: 41,
    viewCount: 278
  },
  {
    id: 8,
    title: '보험사기조사 전문가',
    company: '롯데손해보험',
    location: '서울 송파구',
    experience: '5~10년',
    salary: '6,500만원~8,500만원',
    employmentType: '정규직',
    tags: ['사기조사', '특별조사', '법률지식'],
    postedDate: '4일 전',
    applicants: 15,
    viewCount: 98
  }
];

const PositionsPage = () => {
  const [positions] = useState(mockPositions);
  const [filteredPositions, setFilteredPositions] = useState(mockPositions);
  const [loading, setLoading] = useState(false);

  const handleFilterChange = (filters) => {
    setLoading(true);

    // 필터링 로직
    let filtered = [...positions];

    // 키워드 검색
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase();
      filtered = filtered.filter(pos =>
        pos.title.toLowerCase().includes(keyword) ||
        pos.company.toLowerCase().includes(keyword) ||
        pos.tags.some(tag => tag.toLowerCase().includes(keyword))
      );
    }

    // 지역 필터
    if (filters.location) {
      filtered = filtered.filter(pos => pos.location.includes(filters.location));
    }

    // 경력 필터
    if (filters.experience) {
      filtered = filtered.filter(pos => pos.experience === filters.experience);
    }

    // 고용형태 필터
    if (filters.employmentType) {
      filtered = filtered.filter(pos => pos.employmentType === filters.employmentType);
    }

    // 정렬
    if (filters.sortBy === 'popular') {
      filtered.sort((a, b) => b.viewCount - a.viewCount);
    } else if (filters.sortBy === 'applicants') {
      filtered.sort((a, b) => b.applicants - a.applicants);
    }

    setTimeout(() => {
      setFilteredPositions(filtered);
      setLoading(false);
    }, 300);
  };

  return (
    <div className="positions-page">
      <div className="positions-container">
        <aside className="filter-sidebar">
          <SearchFilter onFilterChange={handleFilterChange} />
        </aside>

        <main className="positions-main">
          <div className="positions-header">
            <h1>포지션 검색</h1>
            <p className="result-count">
              총 <strong>{filteredPositions.length}</strong>개의 포지션
            </p>
          </div>

          {loading ? (
            <div className="loading">
              <div className="spinner"></div>
              <p>검색 중...</p>
            </div>
          ) : (
            <>
              {filteredPositions.length > 0 ? (
                <div className="positions-list">
                  {filteredPositions.map(position => (
                    <PositionCard key={position.id} position={position} />
                  ))}
                </div>
              ) : (
                <div className="no-results">
                  <div className="no-results-icon">🔍</div>
                  <h3>검색 결과가 없습니다</h3>
                  <p>다른 검색 조건으로 시도해보세요</p>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default PositionsPage;
