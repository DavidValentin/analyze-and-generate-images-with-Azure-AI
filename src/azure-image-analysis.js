import { useState } from 'react';
import './index.css';

export function validateCredentials(endpoint, key) {
    if (!endpoint || !key) {
      return "Vision endpoint or key not provided.";
    }
  
    // Validar que el endpoint y la clave tengan un formato adecuado (puedes ajustar esto según tu caso)
    const endpointRegex = /^https:\/\/[a-zA-Z0-9-]+\.cognitiveservices\.azure\.com\//;
    const keyRegex = /^[a-f0-9]{32}$/;
  
    if (!endpointRegex.test(endpoint) || !keyRegex.test(key)) {
      return "Invalid vision endpoint or key format.";
    }
  
    return null; // Devuelve null si la validación es exitosa
  }

function useImageAnalysis() {
    const [loading, setLoading] = useState(false);

    function analyzeImage(imageUrl, VISION_ENDPOINT, VISION_KEY) {
        
        setLoading(true);

        if (!VISION_ENDPOINT || !VISION_KEY) {
            console.error("Vision endpoint or key not provided.");
            setLoading(false);
            // return Promise.reject("Vision endpoint or key not provided.");
            const errorElement = document.createElement("h1");
            errorElement.innerHTML = "Error: Vision endpoint or key not provided.";

            const resultElement = document.getElementById("imageAnalysisResult");
            resultElement.innerHTML = ''; // Limpiar contenido existente
            resultElement.appendChild(errorElement);

            return;
        }

        const endpointRegex = /^https:\/\/[a-zA-Z0-9-]+\.cognitiveservices\.azure\.com\//;
        const keyRegex = /^[a-f0-9]{32}$/;

        if (!endpointRegex.test(VISION_ENDPOINT) || !keyRegex.test(VISION_KEY)) {
            console.error("Invalid vision endpoint or key format.");
            setLoading(false);

            // En lugar de devolver la promesa rechazada, crea un elemento h1 con el mensaje de error
            const errorElement = document.createElement("h1");
            errorElement.innerHTML = "Error: Invalid vision endpoint or key format.";

            const resultElement = document.getElementById("imageAnalysisResult");
            resultElement.innerHTML = ''; // Limpiar contenido existente
            resultElement.appendChild(errorElement);

            return; // Termina la función sin devolver una promesa
        }

        const url = `${VISION_ENDPOINT}/vision/v2.1/analyze?visualFeatures=Description&details=Landmarks&language=en&features=tags,read,caption,denseCaptions,smartCrops,objects,people`;

        const params = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Ocp-Apim-Subscription-Key': VISION_KEY,
            },
            body: JSON.stringify({ url: imageUrl }),
        };

        return fetch(url, params)
            .then(response => {
                setLoading(false);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(json => {
                console.log(json);
                const resultElement = document.getElementById("imageAnalysisResult");
                const hrElement = document.querySelector("hr");

                if (resultElement && hrElement) {
                    const titleElement = document.createElement("h1");
                    titleElement.innerHTML = "Image Analysis Result";
                    const imageElement = document.createElement("img");
                    imageElement.src = imageUrl;
                    imageElement.className = 'image-custom-width';
                    hrElement.insertAdjacentElement("afterend", imageElement);
                    hrElement.insertAdjacentElement("afterend", titleElement);
                    json.url = imageUrl;
                    // resultElement.innerHTML = JSON.stringify(json, null, 2);
                    resultElement.innerHTML = json.description.captions[0].text;
                    return json; // Puedes decidir si quieres devolver el JSON para su uso posterior
                }
            })
            .catch(error => {
                setLoading(false);
                console.error("Error during image analysis:", error);
                throw error; // Propaga el error para manejarlo donde llamas a esta función
            });
    }

    return { analyzeImage, loading };
}

export default useImageAnalysis;