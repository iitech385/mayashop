import styled from 'styled-components';
import { useState } from 'react';

const ContactContainer = styled.div`
  min-height: 100vh;
  background-color: #C9D8DD;
  padding-top: 100px;
`;

const ContentWrapper = styled.div`
  display: flex;
  width: 100vw;
  min-height: calc(100vh - 120px);
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const ContactInfo = styled.div`
  flex: 1;
  padding: 4rem 6rem;
  background: #C9D8DD;
  width: 50vw;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #586879;
  margin-bottom: 2rem;
  font-family: 'Hello Paris Sans', sans-serif;
`;

const InfoSection = styled.div`
  margin-bottom: 2rem;
`;

const InfoTitle = styled.h3`
  font-size: 1.2rem;
  color: #586879;
  margin-bottom: 1rem;
  font-family: 'Hello Paris Sans', sans-serif;
`;

const InfoText = styled.p`
  font-size: 1.1rem;
  color: #586879;
  line-height: 1.8;
  font-family: 'Hello Paris Sans', sans-serif;
  font-weight: 600;
`;

const FormSection = styled.div`
  flex: 1;
  padding: 4rem 6rem;
  background: #C9D8DD;
  width: 50vw;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
`;

const Input = styled.input`
  width: 100%;
  padding: 1rem;
  border: 2px solid #eee;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

const TextArea = styled.textarea`
  width: 100%;
  padding: 1rem;
  border: 2px solid #eee;
  border-radius: 8px;
  font-size: 1rem;
  min-height: 150px;
  resize: vertical;
  transition: all 0.3s ease;

  &:focus {
    outline: none;
    border-color: #4a90e2;
  }
`;

const SubmitButton = styled.button`
  padding: 1rem 2rem;
  background: #4a90e2;
  color: white;
  border: none;
  border-radius: 25px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #357abd;
    transform: translateY(-2px);
  }
`;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    // Reset form
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <ContactContainer>
      <ContentWrapper>
        <ContactInfo>
          <Title>Get in Touch</Title>
          <InfoSection>
            <InfoTitle>Visit Us</InfoTitle>
            <InfoText>123 Fashion Street</InfoText>
            <InfoText>New York, NY 10001</InfoText>
          </InfoSection>
          <InfoSection>
            <InfoTitle>Contact Info</InfoTitle>
            <InfoText>Phone: (555) 123-4567</InfoText>
            <InfoText>Email: info@fashionstore.com</InfoText>
          </InfoSection>
          <InfoSection>
            <InfoTitle>Hours</InfoTitle>
            <InfoText>Monday - Friday: 9am - 8pm</InfoText>
            <InfoText>Saturday - Sunday: 10am - 6pm</InfoText>
          </InfoSection>
        </ContactInfo>

        <FormSection>
          <Form onSubmit={handleSubmit}>
            <Title>Send us a Message</Title>
            <Input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <Input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
            <TextArea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
            />
            <SubmitButton type="submit">Send Message</SubmitButton>
          </Form>
        </FormSection>
      </ContentWrapper>
    </ContactContainer>
  );
};

export default Contact; 