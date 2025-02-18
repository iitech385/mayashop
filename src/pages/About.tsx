import styled from 'styled-components';

const AboutContainer = styled.div`
  min-height: 100vh;
  padding: 120px 0 50px 0;
  background: white;
`;

const ContentWrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 4rem;
`;

const Section = styled.div`
  display: flex;
  gap: 4rem;
  align-items: center;
  width: 100%;
  padding: 0 4rem;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
`;

const TextContent = styled.div`
  flex: 1;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #333;
  margin-bottom: 1.5rem;
  font-family: 'Dancing Script', cursive;
`;

const Description = styled.p`
  font-size: 1.1rem;
  color: #666;
  line-height: 1.8;
  margin-bottom: 1.5rem;
`;

const ImageWrapper = styled.div`
  flex: 1;
  height: 500px;
  overflow: hidden;
  box-shadow: none;
  border-radius: 0;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const About = () => {
  return (
    <AboutContainer>
      <ContentWrapper>
        <Section>
          <TextContent>
            <Title>Our Story</Title>
            <Description>
              Welcome to our unique marketplace where style meets sustainability. Founded in 2024,
              we've been dedicated to bringing you carefully curated collections that reflect both
              quality and consciousness.
            </Description>
            <Description>
              Our mission is to provide a seamless shopping experience while promoting responsible
              consumption. We partner with brands that share our values of quality, sustainability,
              and ethical production.
            </Description>
          </TextContent>
          <ImageWrapper>
            <Image 
              src="https://images.unsplash.com/photo-1441986300917-64674bd600d8"
              alt="Store interior"
            />
          </ImageWrapper>
        </Section>

        <Section>
          <ImageWrapper>
            <Image 
              src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85"
              alt="Team working"
            />
          </ImageWrapper>
          <TextContent>
            <Title>Our Values</Title>
            <Description>
              Quality is at the heart of everything we do. We believe in offering products that
              not only look good but are built to last. Our commitment to sustainability means
              we carefully consider the environmental impact of each item we offer.
            </Description>
            <Description>
              We're more than just a marketplace - we're a community of conscious consumers
              and creative minds working together to redefine modern shopping.
            </Description>
          </TextContent>
        </Section>
      </ContentWrapper>
    </AboutContainer>
  );
};

export default About; 