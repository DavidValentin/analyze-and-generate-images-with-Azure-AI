import React, { useState } from 'react';
import useImageAnalysis from './azure-image-analysis';
import { validateCredentials } from './azure-image-analysis';

function App() {
  const [inputValue, setInputValue] = useState('');
  const { analyzeImage, loading } = useImageAnalysis();

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleButtonClick = () => {
    // setLoading(true);
    // Variables de entorno
    const VISION_ENDPOINT = process.env.REACT_APP_VISION_ENDPOINT;
    const VISION_KEY = process.env.REACT_APP_VISION_KEY;

    const validationError = validateCredentials(VISION_ENDPOINT, VISION_KEY);

    if (validationError) {
      const errorElement = document.createElement("h1");
      errorElement.innerHTML = `Error XD: ${validationError}`;
      const resultElement = document.getElementById("imageAnalysisResult");
      resultElement.innerHTML = ''; // Limpiar contenido existente
      resultElement.appendChild(errorElement);
    } else {
      analyzeImage(inputValue, VISION_ENDPOINT, VISION_KEY);
    }
  };

  return (
    <div>
      <h1>Computer Vision</h1>
      <div>Insert URL or type prompt:</div>
      <input
        type="text"
        placeholder="Enter URL to analyze or textual prompt to generate an image"
        className="input-custom-width"
        value={inputValue}
        onChange={handleInputChange}
      />
      <br></br>
      <button onClick={handleButtonClick}>Analyze image</button>  
      <hr></hr>
      {loading && <div className="spinner"></div>}
      <div id="imageAnalysisResult"></div>
    </div>
  );
}

export default App;

