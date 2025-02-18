import styled from 'styled-components';

export const ContentWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4rem;
  background-color: #C9D8DD;
`;

export const Section = styled.div`
  display: flex;
  gap: 4rem;
  align-items: center;
  width: 100%;
  padding: 0 4rem;
  background-color: #C9D8DD;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

export const TextContent = styled.div`
  flex: 1;
`;

export const Title = styled.h1`
  font-size: 2.5rem;
  color: #586879;
  margin-bottom: 1.5rem;
  font-family: 'Hello Paris Sans', sans-serif;
`;

export const Description = styled.p`
  font-size: 1.1rem;
  color: #586879;
  line-height: 1.8;
  margin-bottom: 1.5rem;
  font-family: 'Hello Paris Sans', sans-serif;
  font-weight: 600;
`;

export const ImageWrapper = styled.div`
  flex: 1;
  height: 500px;
  overflow: hidden;
  box-shadow: none;
  border-radius: 0;
`;

export const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`; 