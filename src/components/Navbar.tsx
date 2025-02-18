import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../context/AuthContext';
import { authFetch } from '../utils/api';

interface UserData {
  username: string;
}

interface SearchResult {
  id: number;
  username: string;
  email: string;
}

const NavContainer = styled.nav<{ isWishlistPage: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 100px;
  background: #C9D8DD;
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  padding-bottom: 30px;
`;

const NavContent = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div<{ isWishlistPage: boolean }>`
  font-size: 2.5rem;
  font-weight: bold;
  color: #586879;
  cursor: pointer;
  padding-left: 4rem;
  font-family: 'Hello Paris Sans', sans-serif;
  display: flex;
  align-items: center;
  gap: 3rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 3.5rem;
  padding-right: 4rem;
  padding-bottom: 5px;
`;

const NavButton = styled.button<{ isWishlistPage: boolean }>`
  background: none;
  border: none;
  font-family: 'Hello Paris Sans', sans-serif;
  font-size: 1.4rem;
  color: #586879;
  cursor: pointer;
  padding: 0.5rem 1rem;
  position: relative;

  &:hover {
    color: #4a90e2;
  }
`;

const SignUpButton = styled(NavButton)`
  &:hover {
    color: #E4E2DD;
    
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 120%;
      height: 120%;
      background: #586879;
      border-radius: 50%;
      z-index: -1;
      transition: all 0.3s ease;
    }
  }
`;

const SearchContainer = styled.div<{ isOpen: boolean }>`
  position: relative;
  width: ${props => props.isOpen ? "300px" : "40px"};
  display: flex;
  align-items: center;
  transition: width 0.3s ease;
`;

const SearchIcon = styled.div<{ isWishlistPage: boolean }>`
  width: 18px;
  height: 18px;
  position: relative;
  
  &:before {
    content: '';
    position: absolute;
    width: 12px;
    height: 12px;
    border: 2px solid #586879;
    border-radius: 50%;
    top: 0;
    left: 0;
  }
  
  &:after {
    content: '';
    position: absolute;
    width: 2px;
    height: 8px;
    background: #586879;
    transform: rotate(-45deg);
    bottom: 0;
    right: 0;
  }
`;

const SearchButton = styled.button<{ isWishlistPage: boolean }>`
  width: 40px;
  height: 40px;
  background: none;
  border: none;
  color: #586879;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  position: absolute;
  right: 0;
  transition: all 0.3s ease;

  &:hover {
    opacity: 0.8;
  }
`;

const SearchInput = styled.input<{ isOpen: boolean; isWishlistPage: boolean }>`
  width: 100%;
  padding: 0.8rem 1.5rem;
  border: 2px solid rgba(88, 104, 121, 0.2);
  border-radius: 25px;
  background: rgba(88, 104, 121, 0.1);
  font-family: 'Hello Paris Sans', sans-serif;
  font-size: 1.2rem;
  color: #333;
  opacity: ${props => props.isOpen ? "1" : "0"};
  pointer-events: ${props => props.isOpen ? "auto" : "none"};
  transition: opacity 0.3s ease;

  &:focus {
    outline: none;
    border-color: #586879;
    background: rgba(88, 104, 121, 0.15);
  }

  &::placeholder {
    color: #586879;
    opacity: 0.6;
    font-family: 'Hello Paris Sans', sans-serif;
  }
`;

const SearchResultsDropdown = styled.div<{ isWishlistPage: boolean }>`
  position: absolute;
  top: calc(100% + 0.5rem);
  left: 0;
  right: 0;
  background: rgba(88, 104, 121, 0.1);
  border-radius: 15px;
  box-shadow: 0 4px 20px rgba(88, 104, 121, 0.15);
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  backdrop-filter: blur(10px);
  border: 2px solid rgba(88, 104, 121, 0.2);
  padding: 0.5rem;
`;

const SearchResultItem = styled.div<{ isWishlistPage: boolean }>`
  display: flex;
  align-items: center;
  padding: 1rem;
  cursor: pointer;
  border-radius: 12px;
  margin: 0.2rem 0;

  &:hover {
    background: rgba(88, 104, 121, 0.15);
  }
`;

const UserAvatar = styled.div<{ isWishlistPage: boolean }>`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #586879;
  color: #E4E2DD;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  margin-right: 1rem;
  font-family: 'Hello Paris Sans', sans-serif;
  font-size: 1.2rem;
  box-shadow: 0 2px 10px rgba(88, 104, 121, 0.2);
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
`;

const Username = styled.span<{ isWishlistPage: boolean }>`
  font-weight: 600;
  color: #333;
  font-family: 'Hello Paris Sans', sans-serif;
  font-size: 1.2rem;
`;

const UserEmail = styled.span<{ isWishlistPage: boolean }>`
  font-size: 0.9rem;
  color: #333;
  font-family: 'Hello Paris Sans', sans-serif;
`;

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const isWishlistPage = location.pathname === '/wishlist';

  useEffect(() => {
    const searchUsers = async () => {
      if (searchQuery.length < 2) {
        setSearchResults([]);
        return;
      }

      try {
        const response = await authFetch(`http://localhost:8000/api/auth/search-users/?q=${searchQuery}`);
        if (response.ok) {
          const data = await response.json();
          setSearchResults(data);
          setShowResults(true);
        }
      } catch (error) {
        console.error('Search error:', error);
      }
    };

    const debounceTimer = setTimeout(searchUsers, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  useEffect(() => {
    // Close search results when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const scrollToAbout = () => {
    if (window.location.pathname !== '/') {
      navigate('/', { state: { scrollTo: 'about' } });
    } else {
      const aboutSection = document.getElementById('about-section');
      aboutSection?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToContact = () => {
    if (window.location.pathname !== '/') {
      navigate('/', { state: { scrollTo: 'contact' } });
    } else {
      const contactSection = document.getElementById('contact-section');
      contactSection?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleHomeClick = () => {
    if (window.location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const homeSection = document.getElementById('home-section');
        homeSection?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const homeSection = document.getElementById('home-section');
      homeSection?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearchClick = (e: React.MouseEvent) => {
    e.stopPropagation();  // Prevent click from bubbling up to Logo
    setIsSearchOpen(!isSearchOpen);
  };

  return (
    <NavContainer isWishlistPage={isWishlistPage}>
      <NavContent>
        <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
          <Logo onClick={handleHomeClick} isWishlistPage={isWishlistPage}>
            GAVOR
          </Logo>
          {isAuthenticated && (
            <SearchContainer isOpen={isSearchOpen}>
              <SearchInput
                type="text"
                placeholder="Search other users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setShowResults(true)}
                isOpen={isSearchOpen}
                isWishlistPage={isWishlistPage}
              />
              <SearchButton onClick={handleSearchClick} isWishlistPage={isWishlistPage}>
                <SearchIcon isWishlistPage={isWishlistPage} />
              </SearchButton>
              {showResults && searchResults.length > 0 && isSearchOpen && (
                <SearchResultsDropdown isWishlistPage={isWishlistPage}>
                  {searchResults.map((user) => (
                    <SearchResultItem
                      key={user.id}
                      isWishlistPage={isWishlistPage}
                      onClick={() => {
                        navigate(`/wishlist/${user.username}`);
                        setShowResults(false);
                        setSearchQuery('');
                      }}
                    >
                      <UserAvatar isWishlistPage={isWishlistPage}>
                        {user.username[0].toUpperCase()}
                      </UserAvatar>
                      <UserInfo>
                        <Username isWishlistPage={isWishlistPage}>{user.username}</Username>
                        <UserEmail isWishlistPage={isWishlistPage}>{user.email}</UserEmail>
                      </UserInfo>
                    </SearchResultItem>
                  ))}
                </SearchResultsDropdown>
              )}
            </SearchContainer>
          )}
        </div>
        
        <ButtonGroup>
          <NavButton onClick={handleHomeClick} isWishlistPage={isWishlistPage}>
            Home
          </NavButton>
          <NavButton onClick={scrollToAbout} isWishlistPage={isWishlistPage}>
            About
          </NavButton>
          <NavButton onClick={scrollToContact} isWishlistPage={isWishlistPage}>
            Contact
          </NavButton>
          
          {isAuthenticated && user ? (
            <>
              <NavButton onClick={() => navigate('/dashboard')} isWishlistPage={isWishlistPage}>
                Hi, {user.username}
              </NavButton>
              <SignUpButton onClick={() => navigate('/wishlist')} isWishlistPage={isWishlistPage}>
                Wishlist
              </SignUpButton>
              <NavButton onClick={handleLogout} isWishlistPage={isWishlistPage}>
                Logout
              </NavButton>
            </>
          ) : (
            <>
              <NavButton onClick={() => navigate('/login')} isWishlistPage={isWishlistPage}>
                Login
              </NavButton>
              <SignUpButton onClick={() => navigate('/signup')} isWishlistPage={isWishlistPage}>
                Sign Up
              </SignUpButton>
            </>
          )}
        </ButtonGroup>
      </NavContent>
    </NavContainer>
  );
};

export default Navbar; 