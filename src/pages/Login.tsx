import { useState } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PageTransition from '../components/PageTransition';

const LoginContainer = styled.div`
  min-height: 100vh;
  background-color: #C9D8DD;
  padding-top: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const LoginCard = styled.div`
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
  margin-bottom: 2rem;
  font-size: 2.5rem;
  font-weight: 700;
  font-family: 'Hello Paris Sans', sans-serif;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  color: #E4E2DD;
  font-size: 0.9rem;
  font-weight: 600;
  font-family: 'Hello Paris Sans', sans-serif;
`;

const Input = styled.input`
  padding: 1rem;
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

const LoginButton = styled.button`
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

const SignupLink = styled.div`
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
  background-color: rgba(255, 107, 107, 0.1);
  padding: 0.75rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  text-align: center;
`;

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          login: loginIdentifier,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        login(data.user, data.tokens.access);
        localStorage.setItem('username', data.user.username);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      setError('Network error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageTransition>
      <LoginContainer>
        <LoginCard>
          <Title>Welcome Back</Title>
          {error && <ErrorMessage>{error}</ErrorMessage>}
          <Form onSubmit={handleSubmit}>
            <InputGroup>
              <Label htmlFor="login">Email or Username</Label>
              <Input
                type="text"
                id="login"
                value={loginIdentifier}
                onChange={(e) => setLoginIdentifier(e.target.value)}
                required
                placeholder="Enter your email or username"
                disabled={isLoading}
              />
            </InputGroup>
            <InputGroup>
              <Label htmlFor="password">Password</Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                disabled={isLoading}
              />
            </InputGroup>
            <LoginButton 
              type="submit"
              disabled={isLoading}
              style={{ opacity: isLoading ? 0.7 : 1 }}
            >
              {isLoading ? 'Logging in...' : 'Log In'}
            </LoginButton>
          </Form>
          <SignupLink>
            Don't have an account?
            <Link to="/signup">Sign up</Link>
          </SignupLink>
        </LoginCard>
      </LoginContainer>
    </PageTransition>
  );
};

export default Login; 