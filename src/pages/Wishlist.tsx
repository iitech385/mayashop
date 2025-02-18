import { useState, useEffect } from 'react';
import styled from 'styled-components';
import PageTransition from '../components/PageTransition';
import { useParams } from 'react-router-dom';

// Add a new interface for wishes
interface Wish {
  text: string;
  liked: boolean;
}

const Wishlist = () => {
  const [wishes, setWishes] = useState<Wish[]>([{ text: '', liked: false }]);
  const [isLoading, setIsLoading] = useState(true);
  const { username: viewUsername } = useParams();
  const currentUsername = localStorage.getItem('username');
  const isOwnWishlist = !viewUsername || viewUsername === currentUsername;

  // Load wishes when component mounts or username changes
  useEffect(() => {
    const usernameToLoad = viewUsername || currentUsername;
    console.log('Loading wishlist for:', usernameToLoad, 'Current user:', currentUsername);
    
    if (usernameToLoad) {
      const savedWishes = localStorage.getItem(`wishes_${usernameToLoad}`);
      if (savedWishes) {
        try {
          const parsedWishes = JSON.parse(savedWishes);
          // Only show liked wishes when viewing other's wishlist
          if (!isOwnWishlist) {
            const likedWishes = parsedWishes.filter((wish: Wish) => 
              wish.text.trim() !== '' && wish.liked
            );
            setWishes(likedWishes);
          } else {
            // For own wishlist, keep empty wish at the end
            if (!parsedWishes.length || parsedWishes[parsedWishes.length - 1].text !== '') {
              parsedWishes.push({ text: '', liked: false });
            }
            setWishes(parsedWishes);
          }
        } catch (error) {
          console.error('Error parsing wishes:', error);
          setWishes(isOwnWishlist ? [{ text: '', liked: false }] : []);
        }
      } else {
        // Reset to empty state
        setWishes(isOwnWishlist ? [{ text: '', liked: false }] : []);
      }
    }
    setIsLoading(false);
  }, [viewUsername, currentUsername, isOwnWishlist]);

  const handleWishChange = (index: number, value: string) => {
    if (!isOwnWishlist) return; // Only allow editing own wishlist
    
    const newWishes = [...wishes];
    newWishes[index] = { ...newWishes[index], text: value };
    
    // If the current line is empty and it's not the last line, remove it
    if (!value && index !== wishes.length - 1) {
      newWishes.splice(index, 1);
    }
    
    // Add new empty line if needed
    if (value && newWishes.length < 11) {
      const lastIndex = newWishes.length - 1;
      if (index === lastIndex) {
        newWishes.push({ text: '', liked: false });
      }
    }
    
    setWishes(newWishes);
    // Save after any text changes
    saveWishes(newWishes);
  };

  const saveWishes = (wishesToSave: Wish[]) => {
    const username = localStorage.getItem('username');
    if (username) {
      // Filter out empty wishes except the last one before saving
      const wishesToStore = wishesToSave.filter((wish, index) => 
        wish.text.trim() !== '' || index === wishesToSave.length - 1
      );
      localStorage.setItem(`wishes_${username}`, JSON.stringify(wishesToStore));
    }
  };

  const toggleHeart = (index: number) => {
    if (!isOwnWishlist) return; // Only allow toggling heart on own wishlist
    
    const newWishes = [...wishes];
    newWishes[index] = { ...newWishes[index], liked: !newWishes[index].liked };
    setWishes(newWishes);
    
    if (!isLoading) {
      saveWishes(newWishes);
    }
  };

  return (
    <PageTransition>
      <WishlistContainer>
        <Container>
          <WishlistCard>
            <Title>
              {isOwnWishlist ? 'My Wishlist' : `${viewUsername}'s Wishlist`}
            </Title>
            <ItemsList>
              {wishes.map((wish, index) => {
                // Only show filled lines when viewing other's wishlist
                const filledLines = wishes.filter(w => w.text !== '').length;
                const isVisible = isOwnWishlist ? index <= filledLines : wish.text !== '';

                return (
                  <ItemRow 
                    key={index} 
                    isVisible={isVisible}
                  >
                    <HeartIcon 
                      onClick={() => toggleHeart(index)} 
                      isLiked={wish.liked}
                      isClickable={isOwnWishlist}
                    >
                      {wish.liked ? '♥' : '♡'}
                    </HeartIcon>
                    <WishInput
                      type="text"
                      value={wish.text}
                      onChange={(e) => handleWishChange(index, e.target.value)}
                      placeholder=""
                      readOnly={!isOwnWishlist}
                    />
                  </ItemRow>
                );
              })}
            </ItemsList>
          </WishlistCard>
        </Container>
      </WishlistContainer>
    </PageTransition>
  );
};

const WishlistContainer = styled.div`
  min-height: 100vh;
  background-color: #C9D8DD;
  padding-top: 100px;
`;

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 100vh;
  background-color: #C9D8DD;
  padding: 120px 6rem 2rem 6rem;
  border-right: 1px solid #eee;
  overflow-y: auto;
`;

const WishlistCard = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  position: relative;
  background-color: #C9D8DD;
`;

const Title = styled.h1`
  text-align: center;
  color: #586879;
  font-size: 5rem;
  margin-top: 2rem;
  margin-bottom: 5rem;
  font-family: 'Hello Paris Sans', sans-serif;
`;

const ItemsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`;

const ItemRow = styled.div<{ isVisible: boolean }>`
  display: ${props => props.isVisible ? 'flex' : 'none'};
  align-items: center;
  width: 100%;
`;

const HeartIcon = styled.span<{ isLiked: boolean; isClickable: boolean }>`
  color: ${props => props.isLiked ? '#586879' : '#586879'};
  font-size: 1.8rem;
  margin-right: 1.5rem;
  cursor: ${props => props.isClickable ? 'pointer' : 'default'};
  transition: color 0.3s ease;
  opacity: ${props => props.isLiked ? 1 : 0.5};

  &:hover {
    opacity: ${props => props.isClickable ? 1 : props.isLiked ? 1 : 0.5};
  }
`;

const WishInput = styled.input`
  flex: 1;
  border: none;
  border-bottom: 1px solid #586879;
  font-size: 1.2rem;
  color: #586879;
  padding: 0.4rem 0;
  background: transparent;

  &:focus {
    outline: none;
    border-bottom-color: #586879;
  }

  &::placeholder {
    color: #586879;
    opacity: 0.5;
  }
`;

export default Wishlist;