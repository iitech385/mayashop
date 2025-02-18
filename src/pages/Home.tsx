import styled from 'styled-components';
import {
  ContentWrapper,
  Section,
  TextContent,
  Title,
  Description,
  ImageWrapper,
  Image
} from '../components/AboutStyles';
import PageTransition from '../components/PageTransition';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const HomeWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  position: relative;
  background-color: #C9D8DD;
`;

const HomeContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  transform: translateZ(0);  // Force GPU acceleration
`;

const Content = styled.div`
  position: relative;
  z-index: 2;
  text-align: center;
  padding-top: 100px;
  
  h1 {
    font-size: 4.5rem;
    color: #586879;
    font-weight: 800;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
    font-family: 'Hello Paris Sans', sans-serif;
    
    span {
      color: #586879;
      font-weight: 900;
      font-family: 'Hello Paris Sans', sans-serif;
    }
  }
`;

const AboutSection = styled.section`
  position: relative;
  min-height: 100vh;
  width: 100%;
  margin-top: 20vh;
  background-color: #C9D8DD;
`;

const ContactSection = styled(Section)`
  margin-top: 10vh;
  padding-top: 100px;
  padding-bottom: 4rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  min-height: 100vh;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  margin-top: 2rem;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid rgba(88, 104, 121, 0.2);
  background: rgba(88, 104, 121, 0.1);
  border-radius: 8px;
  font-size: 1rem;
  color: #586879;
  font-family: 'Hello Paris Sans', sans-serif;

  &:focus {
    outline: none;
    border-color: #586879;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 2px solid rgba(88, 104, 121, 0.2);
  background: rgba(88, 104, 121, 0.1);
  border-radius: 8px;
  font-size: 1rem;
  min-height: 150px;
  color: #586879;
  font-family: 'Hello Paris Sans', sans-serif;
  resize: vertical;

  &:focus {
    outline: none;
    border-color: #586879;
  }
`;

const SubmitButton = styled.button`
  background: #586879;
  color: #E4E2DD;
  border: none;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Hello Paris Sans', sans-serif;
  margin: 0 auto;
  width: fit-content;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(88, 104, 121, 0.3);
  }
`;

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo === 'about') {
      const aboutSection = document.getElementById('about-section');
      aboutSection?.scrollIntoView();
    } else if (location.state?.scrollTo === 'contact') {
      const contactSection = document.getElementById('contact-section');
      contactSection?.scrollIntoView();
    }
  }, [location]);

  return (
    <PageTransition>
      <HomeWrapper>
        <HomeContainer id="home-section">
          <Content>
            <h1>Welcome to <span>Gavor</span></h1>
          </Content>
        </HomeContainer>

        <AboutSection id="about-section">
          <ContentWrapper>
            <Section>
              <TextContent>
                <Title>Gavor Guide</Title>
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
                {/* Empty space for future image */}
              </ImageWrapper>
            </Section>

            <Section>
              <ImageWrapper>
                {/* Empty space for future image */}
              </ImageWrapper>
              <TextContent>
                <Title>About Us</Title>
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

            <ContactSection id="contact-section">
              <TextContent style={{ width: '100%', textAlign: 'center' }}>
                <Title>Make Someone's Day</Title>
                <Form>
                  <Input
                    type="text"
                    placeholder="Your Name"
                    required
                  />
                  <Input
                    type="email"
                    placeholder="Your Email"
                    required
                  />
                  <Input
                    type="text"
                    placeholder="Subject"
                    required
                  />
                  <TextArea
                    placeholder="Your Message"
                    required
                  />
                  <SubmitButton type="submit">Send Message</SubmitButton>
                </Form>
              </TextContent>
            </ContactSection>
          </ContentWrapper>
        </AboutSection>
      </HomeWrapper>
    </PageTransition>
  );
};

export default Home; 