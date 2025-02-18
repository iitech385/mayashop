import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import PageTransition from '../components/PageTransition';

interface UserData {
  id: number;
  username: string;
  email: string;
}

const Dashboard = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedUsername, setEditedUsername] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      setUserData(user);
      setEditedUsername(user.username);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleSaveProfile = async () => {
    // TODO: Implement profile update API call
    setIsEditing(false);
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <PageTransition>
      <DashboardContainer>
        <DashboardContent>
          <ProfileHeader>
            <Title>My Profile</Title>
            <LogoutButton onClick={handleLogout}>
              Logout
            </LogoutButton>
          </ProfileHeader>

          <ProfileCard>
            <Avatar>
              {userData.username.charAt(0).toUpperCase()}
            </Avatar>

            <ProfileInfo>
              <InfoSection>
                <Label>Username</Label>
                {isEditing ? (
                  <Input
                    value={editedUsername}
                    onChange={(e) => setEditedUsername(e.target.value)}
                  />
                ) : (
                  <Value>{userData.username}</Value>
                )}
              </InfoSection>

              <InfoSection>
                <Label>Email</Label>
                <Value>{userData.email}</Value>
              </InfoSection>

              <ButtonGroup>
                {isEditing ? (
                  <>
                    <SaveButton onClick={handleSaveProfile}>
                      Save Changes
                    </SaveButton>
                    <CancelButton onClick={() => setIsEditing(false)}>
                      Cancel
                    </CancelButton>
                  </>
                ) : (
                  <EditButton onClick={() => setIsEditing(true)}>
                    Edit Profile
                  </EditButton>
                )}
              </ButtonGroup>
            </ProfileInfo>
          </ProfileCard>
        </DashboardContent>
      </DashboardContainer>
    </PageTransition>
  );
};

const DashboardContainer = styled.div`
  min-height: 100vh;
  background-color: #C9D8DD;
  padding-top: 100px;
`;

const Container = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  background-color: #C9D8DD;
`;

const DashboardCard = styled.div`
  background-color: #C9D8DD;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

const DashboardContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 6rem 2rem;
`;

const Title = styled.h1`
  color: #586879;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  padding-left: 1rem;
`;

const ProfileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 3rem;
  padding-top: 2rem;
`;

const ProfileCard = styled.div`
  background: #586879;
  border-radius: 15px;
  box-shadow: 0 8px 32px rgba(88, 104, 121, 0.3);
  padding: 3rem;
  display: flex;
  gap: 3rem;
  align-items: flex-start;
  backdrop-filter: blur(8px);
  color: #E4E2DD;
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #E4E2DD;
  font-size: 3rem;
  font-weight: bold;
  border: 4px solid rgba(255, 255, 255, 0.3);
`;

const ProfileInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.span`
  color: rgba(228, 226, 221, 0.8);
  font-size: 0.9rem;
  font-weight: 600;
`;

const Value = styled.span`
  color: #E4E2DD;
  font-size: 1.2rem;
  font-weight: 500;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  font-size: 1.2rem;
  color: #E4E2DD;
  width: 100%;
  max-width: 400px;
  
  &::placeholder {
    color: rgba(228, 226, 221, 0.6);
  }

  &:focus {
    outline: none;
    border-color: white;
    background: rgba(255, 255, 255, 0.2);
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  }

  &:active {
    transform: translateY(0);
  }
`;

const EditButton = styled(Button)`
  background: white;
  color: #586879;
  border: none;
`;

const SaveButton = styled(Button)`
  background: #4CAF50;
  color: white;
  border: none;
`;

const CancelButton = styled(Button)`
  background: rgba(255, 255, 255, 0.1);
  color: #E4E2DD;
  border: 2px solid rgba(255, 255, 255, 0.3);
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const LogoutButton = styled(Button)`
  background: #ff6b6b;
  color: white;
  border: none;
  margin-right: 1rem;
`;

export default Dashboard; 