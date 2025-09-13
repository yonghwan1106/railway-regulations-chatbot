import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { regulationsAPI } from '../services/api';
import { Regulation, Category } from '../types';

const BrowserContainer = styled.div`
  background: rgba(255, 255, 255, 0.95);
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  min-height: calc(100vh - 140px);
`;

const BrowserHeader = styled.div`
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
  padding: 2rem;
  text-align: center;
  
  h2 {
    margin: 0 0 0.5rem 0;
    font-size: 1.8rem;
  }
  
  p {
    margin: 0;
    opacity: 0.9;
    font-size: 1rem;
  }
`;

const BrowserBody = styled.div`
  padding: 2rem;
`;

const SearchSection = styled.div`
  margin-bottom: 2rem;
  
  input {
    width: 100%;
    padding: 1rem 1.5rem;
    border: 2px solid #e9ecef;
    border-radius: 25px;
    font-size: 1rem;
    outline: none;
    
    &:focus {
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
  }
`;

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
`;

const CategoryCard = styled.div`
  background: white;
  border: 2px solid #e9ecef;
  border-radius: 15px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #667eea;
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(102, 126, 234, 0.15);
  }
  
  h3 {
    color: #333;
    margin: 0 0 0.5rem 0;
    font-size: 1.2rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  
  p {
    color: #6c757d;
    margin: 0 0 1rem 0;
    line-height: 1.5;
  }
  
  .count {
    background: linear-gradient(135deg, #667eea, #764ba2);
    color: white;
    padding: 0.3rem 0.8rem;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 600;
  }
  
  .subcategories {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    
    .subcategory {
      background: #f8f9fa;
      color: #495057;
      padding: 0.3rem 0.6rem;
      border-radius: 8px;
      font-size: 0.75rem;
      border: 1px solid #e9ecef;
    }
  }
`;

const RegulationsSection = styled.div`
  h3 {
    color: #333;
    margin-bottom: 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid #e9ecef;
  }
`;

const RegulationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const RegulationCard = styled.div`
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 10px;
  padding: 1.5rem;
  transition: all 0.3s ease;
  
  &:hover {
    border-color: #667eea;
    box-shadow: 0 2px 10px rgba(102, 126, 234, 0.1);
  }
  
  h4 {
    color: #333;
    margin: 0 0 0.5rem 0;
    font-size: 1.1rem;
  }
  
  p {
    color: #6c757d;
    margin: 0 0 1rem 0;
    line-height: 1.5;
  }
  
  .meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;
    font-size: 0.8rem;
    color: #6c757d;
    
    .category {
      background: #667eea;
      color: white;
      padding: 0.2rem 0.6rem;
      border-radius: 8px;
    }
    
    .date {
      background: #f8f9fa;
      padding: 0.2rem 0.6rem;
      border-radius: 8px;
      border: 1px solid #e9ecef;
    }
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem;
  
  .spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #f3f3f3;
    border-top: 3px solid #667eea;
    border-radius: 50%;
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const RegulationsBrowser: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [regulations, setRegulations] = useState<Regulation[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      searchRegulations();
    } else if (selectedCategory) {
      loadCategoryRegulations(selectedCategory);
    } else {
      loadAllRegulations();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, selectedCategory]);

  const loadCategories = async () => {
    try {
      const data = await regulationsAPI.getCategories();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };

  const loadAllRegulations = async () => {
    try {
      setLoading(true);
      const data = await regulationsAPI.getRegulations();
      setRegulations(data.regulations);
    } catch (error) {
      console.error('Failed to load regulations:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCategoryRegulations = async (categoryId: string) => {
    try {
      setLoading(true);
      const data = await regulationsAPI.getRegulationsByCategory(categoryId);
      setRegulations(data.regulations);
    } catch (error) {
      console.error('Failed to load category regulations:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchRegulations = async () => {
    try {
      setLoading(true);
      const data = await regulationsAPI.getRegulations({ search: searchQuery });
      setRegulations(data.regulations);
    } catch (error) {
      console.error('Failed to search regulations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(selectedCategory === categoryId ? null : categoryId);
    setSearchQuery('');
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setSelectedCategory(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR');
  };

  return (
    <BrowserContainer>
      <BrowserHeader>
        <h2>📚 철도건설규정 검색</h2>
        <p>카테고리별 규정 검색 및 상세 내용 확인</p>
      </BrowserHeader>

      <BrowserBody>
        <SearchSection>
          <input
            type="text"
            placeholder="규정 제목이나 내용으로 검색..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
        </SearchSection>

        {!searchQuery && !selectedCategory && (
          <>
            <h3>📋 규정 카테고리</h3>
            <CategoriesGrid>
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  onClick={() => handleCategoryClick(category.id)}
                >
                  <h3>
                    {category.name}
                    <span className="count">{category.regulationCount || 0}개</span>
                  </h3>
                  <p>{category.description}</p>
                  <div className="subcategories">
                    {category.subcategories.slice(0, 3).map((sub, index) => (
                      <span key={index} className="subcategory">
                        {sub}
                      </span>
                    ))}
                    {category.subcategories.length > 3 && (
                      <span className="subcategory">
                        +{category.subcategories.length - 3}개 더
                      </span>
                    )}
                  </div>
                </CategoryCard>
              ))}
            </CategoriesGrid>
          </>
        )}

        {(searchQuery || selectedCategory || regulations.length > 0) && (
          <RegulationsSection>
            <h3>
              {searchQuery ? `"${searchQuery}" 검색 결과` : 
               selectedCategory ? `${categories.find(c => c.id === selectedCategory)?.name} 규정` : 
               '전체 규정'}
              {!loading && ` (${regulations.length}개)`}
            </h3>

            {loading ? (
              <LoadingSpinner>
                <div className="spinner" />
              </LoadingSpinner>
            ) : (
              <RegulationsList>
                {regulations.map((regulation) => (
                  <RegulationCard key={regulation.id}>
                    <h4>{regulation.title}</h4>
                    <p>{regulation.content}</p>
                    <div className="meta">
                      <span className="category">
                        {regulation.category} &gt; {regulation.subcategory}
                      </span>
                      <span className="date">
                        시행일: {formatDate(regulation.effective_date)}
                      </span>
                      <span>{regulation.legal_basis}</span>
                    </div>
                  </RegulationCard>
                ))}
                
                {regulations.length === 0 && !loading && (
                  <div style={{ textAlign: 'center', padding: '2rem', color: '#6c757d' }}>
                    검색 결과가 없습니다.
                  </div>
                )}
              </RegulationsList>
            )}
          </RegulationsSection>
        )}
      </BrowserBody>
    </BrowserContainer>
  );
};

export default RegulationsBrowser;