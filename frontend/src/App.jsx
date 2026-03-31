import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCalories } from './hooks/useCalories';
import UploadSection from './components/UploadSection';
import ResultCard from './components/ResultCard';
import './App.css';
import { ChefHat, ShoppingBag, Info, AlertTriangle } from 'lucide-react';

const API_URL = 'http://localhost:8000'; // FastAPI default port

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [predictionResult, setPredictionResult] = useState(null);
  const [calorieResult, setCalorieResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const { findCalories, isLoading: isCSVLoading, error: csvError } = useCalories();

  const handleUpload = (file) => {
    setSelectedFile(file);
    setError(null);
  };

  const handleClear = () => {
    setSelectedFile(null);
    setPredictionResult(null);
    setCalorieResult(null);
    setError(null);
  };

  const analyzeFood = async () => {
    if (!selectedFile) {
      setError("Please select an image first.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      // Step 1: Call Backend for prediction
      const response = await axios.post(`${API_URL}/predict`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = response.data;
      setPredictionResult(result);

      // Step 2: Use local CSV fuzzy matching for calories
      if (result.status !== 'uncertain') {
        const matchedCalories = findCalories(result.food);
        setCalorieResult(matchedCalories);
        
        // Log results for verification as requested
        if (matchedCalories) {
          console.log(`Matched: ${result.food} -> ${matchedCalories.foodName} (Score: ${matchedCalories.matchScore})`);
        } else {
          console.warn(`No match found for: ${result.food}`);
        }
      }

    } catch (err) {
      console.error("Analysis error:", err);
      setError("Unable to process image. Make sure the backend server is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-main">
      <header className="app-header">
        <div className="logo-section">
          <ChefHat size={32} color="#f97316" />
          <h1>Bite<span>Smart</span></h1>
        </div>
        <p className="subtitle">AI Food Recognition & Calorie Estimator</p>
      </header>

      <main className="content-container">
        {csvError && (
          <div className="error-banner">
            <AlertTriangle size={18} />
            {csvError}
          </div>
        )}

        <section className="interaction-grid">
          <div className="upload-column">
            <UploadSection 
              onUpload={handleUpload} 
              onClear={handleClear} 
              isLoading={isLoading} 
            />

            {selectedFile && !predictionResult && !isLoading && (
              <button 
                className="analyze-btn" 
                onClick={analyzeFood}
                disabled={isLoading || isCSVLoading}
              >
                {isLoading ? "Analyzing..." : "Analyze Food"}
              </button>
            )}

            {error && <p className="error-message">{error}</p>}
          </div>

          <div className="result-column">
            {predictionResult || isLoading ? (
              <ResultCard 
                result={predictionResult} 
                calorieResult={calorieResult} 
                isLoading={isLoading} 
              />
            ) : (
                <div className="placeholder-card">
                  <ShoppingBag size={48} className="placeholder-icon" />
                  <p>Upload an image to see nutritional insights</p>
                  <span className="hint">Supported foods: Biryani, Pizza, Burger, Salad, and more.</span>
                </div>
            )}
          </div>
        </section>
      </main>

      <footer className="author-footer">
        <p>BiteSmart AI &copy; 2026 | Modern Food Identification System</p>
      </footer>
    </div>
  );
}

export default App;
