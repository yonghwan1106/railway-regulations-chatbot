import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1);
`;

const HeaderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  
  .emoji {
    font-size: 2rem;
    margin-right: 0.5rem;
  }
  
  .text {
    background: linear-gradient(135deg, #667eea, #764ba2);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

const Nav = styled.nav`
  display: flex;
  gap: 2rem;
  
  @media (max-width: 768px) {
    gap: 1rem;
  }
`;

const NavLink = styled(Link)<{ $active?: boolean }>`
  color: ${props => props.$active ? '#667eea' : '#666'};
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  transition: all 0.3s ease;
  background: ${props => props.$active ? 'rgba(102, 126, 234, 0.1)' : 'transparent'};
  
  &:hover {
    color: #667eea;
    background: rgba(102, 126, 234, 0.1);
    transform: translateY(-1px);
  }
  
  @media (max-width: 768px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.9rem;
  }
`;

const Subtitle = styled.p`
  font-size: 0.85rem;
  color: #666;
  margin: 0.2rem 0 0 3rem;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const Header: React.FC = () => {
  const location = useLocation();

  return (
    <>
      <HeaderContainer>
        <HeaderContent>
          <div>
            <Logo>
              <span className="emoji">🚄</span>
              <span className="text">KR-CODE 지능형 가이드</span>
            </Logo>
            <Subtitle>AI 기반 철도건설규정 통합검색 시스템</Subtitle>
          </div>
          
          <Nav>
            <NavLink 
              to="/" 
              $active={location.pathname === '/'}
            >
              💬 AI 챗봇
            </NavLink>
            <NavLink 
              to="/regulations" 
              $active={location.pathname === '/regulations'}
            >
              📚 규정 검색
            </NavLink>
            <NavLink 
              to="/about" 
              $active={location.pathname === '/about'}
            >
              ℹ️ 소개
            </NavLink>
          </Nav>
        </HeaderContent>
      </HeaderContainer>
    </>
  );
};

export default Header;