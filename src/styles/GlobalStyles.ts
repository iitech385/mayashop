import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  html, body, #root {
    background-color: #C9D8DD;
    font-family: 'Hello Paris Sans', sans-serif;
    min-height: 100vh;
    width: 100%;
  }

  #root {
    max-width: none;
    margin: 0;
    padding: 0;
  }

  /* If you want to ensure all text uses this font by default */
  h1, h2, h3, h4, h5, h6, p, span, div, button {
    font-family: 'Hello Paris Sans', sans-serif;
  }
`;

export default GlobalStyles; 