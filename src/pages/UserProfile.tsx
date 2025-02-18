import { useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import { authFetch } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const UserProfile = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ProfileContainer>
      <Container>
        <ProfileCard>
          <ProfileHeader>
            <Title>My Profile</Title>
          </ProfileHeader>
          
          <ProfileContent>
            <AvatarCircle>
              {user?.username?.[0]?.toUpperCase() || 'A'}
            </AvatarCircle>
            
            <InfoSection>
              <InfoLabel>Username</InfoLabel>
              <InfoValue>{user?.username || ''}</InfoValue>
              
              <InfoLabel>Email</InfoLabel>
              <InfoValue>{user?.email || ''}</InfoValue>
            </InfoSection>
            
            <EditButton>Edit Profile</EditButton>
          </ProfileContent>
        </ProfileCard>
      </Container>
    </ProfileContainer>
  );
};

const ProfileContainer = styled.div`
  min-height: 100vh;
  background-color: #C9D8DD;
  padding-top: 100px;
`;

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
`;

const ProfileCard = styled.div`
  background-color: #C9D8DD;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const ProfileHeader = styled.div`
  margin-bottom: 2rem;
`;

const Title = styled.h1`
  color: #586879;
  font-size: 2.5rem;
  font-family: 'Hello Paris Sans', sans-serif;
  text-align: center;
`;

const ProfileContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
`;

const AvatarCircle = styled.div`
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background-color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  color: #586879;
  font-family: 'Hello Paris Sans', sans-serif;
`;

const InfoSection = styled.div`
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const InfoLabel = styled.div`
  color: #586879;
  font-size: 0.9rem;
  font-family: 'Hello Paris Sans', sans-serif;
`;

const InfoValue = styled.div`
  color: #586879;
  font-size: 1.2rem;
  padding: 0.5rem;
  background-color: rgba(88, 104, 121, 0.1);
  border-radius: 8px;
  font-family: 'Hello Paris Sans', sans-serif;
`;

const EditButton = styled.button`
  background-color: #586879;
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 25px;
  font-size: 1.1rem;
  cursor: pointer;
  font-family: 'Hello Paris Sans', sans-serif;
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

export default UserProfile; 