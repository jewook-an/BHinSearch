import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './CommunityPage.css';

const CommunityPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const categories = [
    { value: 'all', label: '전체' },
    { value: 'notice', label: '공지사항' },
    { value: 'faq', label: '자주 묻는 질문' },
    { value: 'update', label: '업데이트 소식' },
    { value: 'guide', label: '이용 가이드' }
  ];

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8001';

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const categoryParam = selectedCategory !== 'all' ? `&category=${selectedCategory}` : '';
      const url = `${API_BASE_URL}/api/v1/posts/?page=${currentPage}&page_size=10${categoryParam}`;

      console.log('🔍 API 호출:', url);

      const response = await fetch(url);

      console.log('📡 응답 상태:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ 데이터 수신:', data);
        setPosts(data.posts);
        setTotalPages(data.total_pages);
      } else {
        console.error('❌ 게시글을 불러올 수 없습니다. 상태 코드:', response.status);
        const errorText = await response.text();
        console.error('❌ 에러 내용:', errorText);
        setPosts([]);
      }
    } catch (error) {
      console.error('❌ Error fetching posts:', error);
      console.error('❌ Error details:', error.message);
      setPosts([]);
    } finally {
      console.log('✅ Loading 완료');
      setLoading(false);
    }
  }, [selectedCategory, currentPage, API_BASE_URL]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const getCategoryLabel = (categoryValue) => {
    const category = categories.find(cat => cat.value === categoryValue);
    return category ? category.label : categoryValue;
  };

  const getCategoryColor = (category) => {
    const colors = {
      notice: '#ff6b6b',
      faq: '#4ecdc4',
      update: '#45b7d1',
      guide: '#f7b731'
    };
    return colors[category] || '#95a5a6';
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return '방금 전';
    if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
    if (diff < 604800) return `${Math.floor(diff / 86400)}일 전`;

    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="community-page">
      {/* Header Section */}
      <section className="community-header">
        <div className="container">
          <h1 className="page-title">커뮤니티</h1>
          <p className="page-subtitle">
            공지사항, 업데이트 소식, 자주 묻는 질문을 확인하세요
          </p>
        </div>
      </section>

      <div className="container">
        <div className="community-content">
          {/* Main Content */}
          <div className="community-main">
            {/* Category Tabs */}
            <div className="category-tabs">
              {categories.map(category => (
                <button
                  key={category.value}
                  className={`category-tab ${selectedCategory === category.value ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedCategory(category.value);
                    setCurrentPage(1);
                  }}
                >
                  {category.label}
                </button>
              ))}
            </div>

            {/* Posts List */}
            <div className="posts-container">
            {loading ? (
              <div className="loading-state">
                <div className="spinner"></div>
                <p>게시글을 불러오는 중...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📭</div>
                <h3>게시글이 없습니다</h3>
                <p>아직 등록된 게시글이 없습니다.</p>
              </div>
            ) : (
              <div className="posts-list">
                {posts.map(post => (
                  <Link
                    to={`/community/${post.id}`}
                    key={post.id}
                    className="post-card"
                  >
                    <div className="post-header">
                      <div className="post-meta">
                        <span
                          className="category-badge"
                          style={{ backgroundColor: getCategoryColor(post.category) }}
                        >
                          {getCategoryLabel(post.category)}
                        </span>
                        {post.is_pinned && (
                          <span className="pinned-badge">📌 고정</span>
                        )}
                      </div>
                      <div className="view-count">
                        <span>👁️ {post.view_count}</span>
                      </div>
                    </div>

                    <h3 className="post-title">{post.title}</h3>

                    <div className="post-footer">
                      <span className="author">{post.author_name}</span>
                      <span className="date">{formatDate(post.created_at)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && posts.length > 0 && totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-btn"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => prev - 1)}
                >
                  ← 이전
                </button>

                <div className="pagination-pages">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        className={`pagination-number ${currentPage === pageNum ? 'active' : ''}`}
                        onClick={() => setCurrentPage(pageNum)}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  className="pagination-btn"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => prev + 1)}
                >
                  다음 →
                </button>
              </div>
            )}
          </div>
          </div>

          {/* Quick Info Section */}
          <aside className="community-sidebar">
            <div className="sidebar-card">
              <h3>💡 자주 묻는 질문</h3>
              <ul className="quick-links">
                <li>
                  <button onClick={() => {
                    setSelectedCategory('faq');
                    setCurrentPage(1);
                  }}>
                    회원가입은 어떻게 하나요?
                  </button>
                </li>
                <li>
                  <button onClick={() => {
                    setSelectedCategory('faq');
                    setCurrentPage(1);
                  }}>
                    프로필은 어떻게 작성하나요?
                  </button>
                </li>
                <li>
                  <button onClick={() => {
                    setSelectedCategory('faq');
                    setCurrentPage(1);
                  }}>
                    지원 후 진행 상황은 어디서 확인하나요?
                  </button>
                </li>
              </ul>
            </div>

            <div className="sidebar-card">
              <h3>📢 최신 소식</h3>
              <p>
                보험업계 ATS의 최신 업데이트와<br />
                새로운 기능을 확인하세요.
              </p>
              <button
                className="btn btn-outline"
                onClick={() => {
                  setSelectedCategory('update');
                  setCurrentPage(1);
                }}
              >
                업데이트 보기
              </button>
            </div>

            <div className="sidebar-card">
              <h3>📖 이용 가이드</h3>
              <p>
                서비스 이용 방법과<br />
                유용한 팁을 알아보세요.
              </p>
              <button
                className="btn btn-outline"
                onClick={() => {
                  setSelectedCategory('guide');
                  setCurrentPage(1);
                }}
              >
                가이드 보기
              </button>
            </div>

            <div className="sidebar-card contact-card">
              <h3>문의하기</h3>
              <p>도움이 필요하신가요?</p>
              <a href="mailto:support@bhinsearch.com" className="btn btn-primary">
                이메일 문의
              </a>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
