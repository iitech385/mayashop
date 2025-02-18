import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { products } from '../data/products';
import { authFetch } from '../utils/api';

const ItemsContainer = styled.div`
  width: 100vw;
  min-height: 100vh;
  background-color: #FFFFFF;
  position: relative;
  overflow: hidden;
  padding: 100px 50px 50px 50px;
`;

const ItemsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  position: relative;
  z-index: 2;
`;

const ItemCard = styled.div`
  background: white;
  border-radius: 15px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: all 0.3s ease;
  position: relative;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  }
`;

const ItemImage = styled.img`
  width: 100%;
  height: 280px;
  object-fit: contain;
  padding: 20px;

  // Add fallback for broken images
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #f5f5f5 url('/placeholder.png') center/contain no-repeat;
  }
`;

const ItemInfo = styled.div`
  padding: 1.5rem;
`;

const ItemTitle = styled.h3`
  font-size: 1.2rem;
  color: #333;
  margin-bottom: 0.5rem;
`;

const ItemPrice = styled.p`
  font-size: 1.3rem;
  color: #4a90e2;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const ItemCategory = styled.span`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background: rgba(255, 255, 255, 0.9);
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  color: #4a90e2;
  font-weight: 500;
`;

const WishlistButton = styled.button<{ isInWishlist: boolean }>`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: ${props => props.isInWishlist ? 'rgba(74, 144, 226, 0.9)' : 'rgba(255, 255, 255, 0.9)'};
  border: none;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  z-index: 2;

  svg {
    width: 45px;
    height: 45px;
    color: ${props => props.isInWishlist ? 'white' : '#4a90e2'};
    transition: all 0.3s ease;
  }

  &:hover {
    transform: scale(1.1);
    background: ${props => props.isInWishlist ? 'rgba(74, 144, 226, 1)' : 'rgba(255, 255, 255, 1)'};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`;

const AnimatedBackground = styled.canvas`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1;
`;

const CategoryBar = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2rem;
  overflow-x: auto;
  padding: 1rem 0;
  position: relative;
  z-index: 2;
  max-width: 1400px;
  margin: 0 auto 2rem auto;
`;

const CategoryButton = styled.button<{ active: boolean }>`
  padding: 0.8rem 1.5rem;
  border-radius: 25px;
  border: none;
  background: ${props => props.active ? '#4a90e2' : 'white'};
  color: ${props => props.active ? 'white' : '#333'};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  white-space: nowrap;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  }
`;

const Modal = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  opacity: 0;
  animation: fadeIn 0.3s forwards;

  @keyframes fadeIn {
    to {
      opacity: 1;
    }
  }
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 15px;
  width: 1000px;
  height: 600px;
  display: flex;
  overflow: hidden;
  position: relative;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  transform: scale(0.9);
  animation: scaleIn 0.3s forwards;

  @keyframes scaleIn {
    to {
      transform: scale(1);
    }
  }
`;

const ModalImage = styled.div`
  width: 500px;
  height: 600px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  padding: 40px;
`;

const ModalInfo = styled.div`
  width: 500px;
  height: 600px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`;

const ModalTitle = styled.h2`
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 1rem;
`;

const ModalPrice = styled.p`
  font-size: 1.5rem;
  color: #4a90e2;
  font-weight: 600;
  margin-bottom: 1.5rem;
`;

const ModalCategory = styled.span`
  background: #f0f7ff;
  color: #4a90e2;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
  display: inline-block;
  margin-bottom: 1.5rem;
`;

const ModalDescription = styled.p`
  color: #666;
  line-height: 1.6;
  margin-bottom: 2rem;
`;

const ModalButton = styled.button`
  background: #4a90e2;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-top: auto;
  margin-bottom: 20px;

  &:hover {
    background: #357abd;
    transform: translateY(-2px);
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: #333;
  font-size: 1.5rem;
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
  }
`;

const SearchInput = styled.input`
  width: 200px;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 25px;
  font-size: 0.9rem;
  transition: all 0.3s ease;
  background: white;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  margin-left: auto;
  color: #333;
  font-weight: 500;

  &::placeholder {
    color: #999;
    font-weight: 400;
  }

  &:focus {
    outline: none;
    box-shadow: 0 4px 15px rgba(74, 144, 226, 0.1);
    width: 300px;
    color: #000;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  }
`;

interface Product {
  id: number;
  title: string;
  price: number;
  category: string;
  image: string;
  description: string;
}

// Sample categories
const categories = [
  "All",
  "Fashion",
  "Technology",
  "Beauty",
  "Home & Living"
];

const Items = () => {
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Load initial wishlist
  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        const response = await authFetch('http://localhost:8000/api/auth/wishlist/');
        if (response.ok) {
          const data = await response.json();
          setWishlist(data.wishlist || []);
        }
      } catch (error) {
        console.error('Error fetching wishlist:', error);
      }
    };

    fetchWishlist();
  }, []);

  const toggleWishlist = async (productId: number, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }

    try {
      const method = wishlist.includes(productId) ? 'DELETE' : 'POST';
      const response = await authFetch('http://localhost:8000/api/auth/wishlist/', {
        method,
        body: JSON.stringify({
          product_id: productId
        })
      });

      if (response.ok) {
        // Update local state after successful API call
        if (method === 'POST') {
          setWishlist(prev => [...prev, productId]);
        } else {
          setWishlist(prev => prev.filter(id => id !== productId));
        }
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };

  const filteredProducts = products
    .filter(product => {
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           product.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });

  return (
    <ItemsContainer>
      <AnimatedBackground ref={canvasRef} />
      <CategoryBar>
        {categories.map(category => (
          <CategoryButton
            key={category}
            active={selectedCategory === category}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </CategoryButton>
        ))}
        <SearchInput
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </CategoryBar>
      <ItemsGrid>
        {filteredProducts.map(product => (
          <ItemCard 
            key={product.id}
            onClick={() => setSelectedProduct(product)}
          >
            <ItemImage src={product.image} alt={product.title} />
            <ItemCategory>{product.category}</ItemCategory>
            <WishlistButton
              isInWishlist={wishlist.includes(product.id)}
              onClick={(e) => toggleWishlist(product.id, e)}
              aria-label={wishlist.includes(product.id) ? "Remove from wishlist" : "Add to wishlist"}
            >
              {wishlist.includes(product.id) ? (
                <svg viewBox="0 0 24 24" fill="currentColor" stroke="none">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                </svg>
              )}
            </WishlistButton>
            <ItemInfo>
              <ItemTitle>{product.title}</ItemTitle>
              <ItemPrice>${product.price.toFixed(2)}</ItemPrice>
            </ItemInfo>
          </ItemCard>
        ))}
      </ItemsGrid>

      {selectedProduct && (
        <Modal onClick={() => setSelectedProduct(null)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <ModalImage style={{ backgroundImage: `url(${selectedProduct.image})` }} />
            <ModalInfo>
              <ModalTitle>{selectedProduct.title}</ModalTitle>
              <ModalCategory>{selectedProduct.category}</ModalCategory>
              <ModalPrice>${selectedProduct.price.toFixed(2)}</ModalPrice>
              <ModalDescription>{selectedProduct.description}</ModalDescription>
              <ModalButton
                onClick={() => toggleWishlist(selectedProduct.id)}
              >
                {wishlist.includes(selectedProduct.id) ? (
                  <>
                    <svg viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    Remove from Wishlist
                  </>
                ) : (
                  <>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
                    </svg>
                    Add to Wishlist
                  </>
                )}
              </ModalButton>
            </ModalInfo>
            <CloseButton onClick={() => setSelectedProduct(null)}>×</CloseButton>
          </ModalContent>
        </Modal>
      )}
    </ItemsContainer>
  );
};

export default Items; 