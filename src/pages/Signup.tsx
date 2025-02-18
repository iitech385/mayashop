import { useState } from 'react';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PageTransition from '../components/PageTransition';

const SignupContainer = styled.div`
  min-height: 100vh;
  background-color: #C9D8DD;
  padding-top: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SignupCard = styled.div`
  background: #586879;
  padding: 3rem 4rem;
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(88, 104, 121, 0.3);
  width: 100%;
  max-width: 500px;
  z-index: 2;
  backdrop-filter: blur(8px);
  color: white;
`;

const Title = styled.h1`
  color: #E4E2DD;
  text-align: center;
  margin-bottom: 1.5rem;
  font-size: 2.5rem;
  font-weight: 700;
  font-family: 'Hello Paris Sans', sans-serif;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
  margin-bottom: 1.5rem;
  width: 100%;

  .react-tel-input {
    .form-control {
      &:focus {
        outline: none;
        border-color: #E4E2DD;
        background: rgba(228, 226, 221, 0.2);
        box-shadow: 0 0 0 2px rgba(228, 226, 221, 0.1);
      }
    }
    
    .country-list {
      background-color: #586879;
      
      .country:hover {
        background-color: rgba(228, 226, 221, 0.1);
      }
    }

    .phone-input-button {
      height: 40px;
      width: 40px;
      padding: 0 0 0 8px;
      
      .selected-flag {
        padding: 0 0 0 8px;
        background-color: transparent;
        
        &:hover, &:focus {
          background-color: transparent;
        }
      }
    }
  }
`;

const Label = styled.label`
  color: #E4E2DD;
  font-size: 0.9rem;
  font-weight: 600;
  font-family: 'Hello Paris Sans', sans-serif;
`;

const Input = styled.input`
  padding: 0.8rem;
  border: 2px solid rgba(228, 226, 221, 0.2);
  background: rgba(228, 226, 221, 0.1);
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  color: #E4E2DD;
  font-family: 'Hello Paris Sans', sans-serif;

  &::placeholder {
    color: rgba(228, 226, 221, 0.6);
  }

  &:focus {
    outline: none;
    border-color: #E4E2DD;
    background: rgba(228, 226, 221, 0.2);
    box-shadow: 0 0 0 2px rgba(228, 226, 221, 0.1);
  }
`;

const SignupButton = styled.button`
  background: #E4E2DD;
  color: #586879;
  border: none;
  padding: 1rem;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(228, 226, 221, 0.3);
    background: rgba(228, 226, 221, 0.9);
  }

  &:active {
    transform: translateY(0);
  }
`;

const LoginLink = styled.div`
  text-align: center;
  margin-top: 1.5rem;
  color: #E4E2DD;
  font-size: 0.9rem;

  a {
    color: #E4E2DD;
    text-decoration: none;
    font-weight: 600;
    margin-left: 0.5rem;

    &:hover {
      text-decoration: underline;
    }
  }
`;

const ErrorMessage = styled.div`
  color: #ff6b6b;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  text-align: center;
`;

interface SignupData {
  username: string;
  email: string;
  password: string;
  phone: string;
}

const Signup = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignupData>({
    username: '',
    email: '',
    password: '',
    phone: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/auth/signup/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: formData.username,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user, data.tokens.access);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (error) {
      setError('Network error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      phone: value
    }));
  };

  return (
    <PageTransition>
      <SignupContainer>
        <SignupCard>
          <Title>Create Account</Title>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <Label htmlFor="username">Username</Label>
              <Input
                type="text"
                id="username"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                required
                placeholder="Enter your username"
                disabled={isLoading}
              />
            </InputGroup>
            <InputGroup>
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                required
                placeholder="Enter your email"
                disabled={isLoading}
              />
            </InputGroup>
            <InputGroup>
              <Label>Phone Number</Label>
              <PhoneInput
                country={'us'}
                value={formData.phone}
                onChange={handlePhoneChange}
                inputStyle={{
                  width: '100%',
                  height: '40px',
                  fontSize: '1rem',
                  backgroundColor: 'rgba(228, 226, 221, 0.1)',
                  border: '2px solid rgba(228, 226, 221, 0.2)',
                  borderRadius: '8px',
                  color: '#E4E2DD',
                  padding: '0.8rem 0.8rem 0.8rem 48px',
                  fontFamily: 'Hello Paris Sans, sans-serif',
                }}
                containerStyle={{
                  width: '100%',
                }}
                dropdownStyle={{
                  backgroundColor: '#586879',
                  color: '#E4E2DD',
                  border: '2px solid rgba(228, 226, 221, 0.2)',
                }}
                buttonStyle={{
                  backgroundColor: 'rgba(228, 226, 221, 0.1)',
                  border: '2px solid rgba(228, 226, 221, 0.2)',
                  borderRadius: '8px 0 0 8px',
                  borderRight: 'none',
                  padding: '0 0 0 8px',
                }}
                buttonClass="phone-input-button"
              />
            </InputGroup>
            <InputGroup>
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                required
                placeholder="Create a password"
                disabled={isLoading}
              />
            </InputGroup>
            <SignupButton 
              type="submit"
              disabled={isLoading}
              style={{ opacity: isLoading ? 0.7 : 1 }}
            >
              {isLoading ? 'Creating Account...' : 'Sign Up'}
            </SignupButton>
          </Form>
          <LoginLink>
            Already have an account?
            <Link to="/login">Log in</Link>
          </LoginLink>
        </SignupCard>
      </SignupContainer>
    </PageTransition>
  );
};

export default Signup; 