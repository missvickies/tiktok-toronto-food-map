// LoadingScreen.js
import React from 'react';
import styled from 'styled-components';

const LoadingScreen = () => {
  return (
    <LoadScreen>
      Loading...
    </LoadScreen>
  );
};

const LoadScreen = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 24px;
  z-index: 1000;
}
`

export default LoadingScreen;

