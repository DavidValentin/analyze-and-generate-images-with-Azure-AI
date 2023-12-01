import React, { useState } from 'react';
import useImageAnalysis from './azure-image-analysis';
import { validateCredentials } from './azure-image-analysis';


function App() {
  // Estado para almacenar el valor del input
  const [inputValue, setInputValue] = useState('');
  const { analyzeImage, loading } = useImageAnalysis();

  // Función para manejar cambios en el input
  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  // Función para manejar el clic en el botón y llamar a la función de análisis de imagen
  const handleButtonClick = () => {
    // setLoading(true);
    const VISION_ENDPOINT = "https://azure-vision-react.cognitiveservices.azure.com/"
    const VISION_KEY = "3b5d3672ee88489ea39c0a2d0eac9863"

    const validationError = validateCredentials(VISION_ENDPOINT, VISION_KEY);

    if (validationError) {
      // Mostrar un mensaje de error en la GUI
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
        onChange={handleInputChange} // Asignar el manejador de cambio
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

