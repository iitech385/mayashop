import styled, { keyframes } from 'styled-components';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const PageWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow-y: auto;
  overflow-x: hidden;
  background-color: #C9D8DD;
`;

const TransitionWrapper = styled.div`
  animation: ${fadeIn} 0.5s ease-out;
  width: 100%;
  min-height: 100vh;
  position: relative;
`;

const PageTransition = ({ children }: { children: React.ReactNode }) => {
  return (
    <PageWrapper>
      <TransitionWrapper>{children}</TransitionWrapper>
    </PageWrapper>
  );
};

export default PageTransition; 