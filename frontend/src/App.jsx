import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ChefHat, ShoppingBag, Utensils, AlertTriangle } from 'lucide-react';
import { useCalories } from './hooks/useCalories';
import UploadSection from './components/UploadSection';
import ImagePreview from './components/ImagePreview';
import ResultCard from './components/ResultCard';

import './index.css';
import './App.css';

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
    setPredictionResult(null); 
    setCalorieResult(null);
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
    // Explicitly clear old result to show the skeleton immediately
    setPredictionResult(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await axios.post(`${API_URL}/predict`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const result = response.data;
      setPredictionResult(result);

      if (result.status !== 'uncertain') {
        const matchedCalories = findCalories(result.food);
        setCalorieResult(matchedCalories);
      }

    } catch (err) {
      console.error("Analysis error:", err);
      setError("Unable to process image. Make sure the backend server is running.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-main app-container">
      <header className="app-header">
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="brand"
        >
          <div className="brand-icon">
            <ChefHat size={36} />
          </div>
          <h1 className="font-extrabold tracking-tight">Bite<span>Smart</span></h1>
        </motion.div>
        <motion.p 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="subtitle"
        >
          Intelligent food recognition powered by AI. Get instant nutritional insights by simply uploading a photo of your meal.
        </motion.p>
      </header>

      <main className="container main-content">
        {csvError && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="error-banner">
            <AlertTriangle size={20} />
            <span>{csvError}</span>
          </motion.div>
        )}

        <section className="grid-layout">
          <div className="upload-column flex flex-col gap-6">
            <AnimatePresence mode="wait">
                {!selectedFile ? (
                    <UploadSection 
                        key="upload"
                        onUpload={handleUpload} 
                        isLoading={isLoading} 
                    />
                ) : (
                    <ImagePreview 
                        key="preview"
                        file={selectedFile}
                        onClear={handleClear}
                        onAnalyze={analyzeFood}
                        isLoading={isLoading || isCSVLoading}
                        onUpload={handleUpload}
                    />
                )}
            </AnimatePresence>

            {error && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="error-banner"
                >
                    <AlertTriangle size={20} />
                    <p>{error}</p>
                </motion.div>
            )}
          </div>

          <div className="result-column">
            <AnimatePresence mode="wait">
              {predictionResult || isLoading ? (
                <motion.div
                    key="result"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="h-full"
                >
                    <ResultCard 
                        result={predictionResult} 
                        calorieResult={calorieResult} 
                        isLoading={isLoading}
                        onReset={handleClear} 
                    />
                </motion.div>
              ) : (
                <motion.div 
                    key="empty"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="empty-state"
                >
                    <div className="empty-icon-wrapper">
                      <ShoppingBag size={48} />
                    </div>
                    <h3>Ready to Identify?</h3>
                    <p>
                       Upload an image on the left to uncover instant nutritional insights and calorie estimations.
                    </p>
                    <div className="example-searches">
                        <span className="label">Common searches:</span>
                        <div className="example-pills">
                            <span className="example-pill">Pizza slice</span>
                            <span className="example-pill">Chicken Biryani</span>
                            <span className="example-pill">Caesar Salad</span>
                        </div>
                    </div>
                    <div className="mt-8 flex items-center justify-center gap-2 opacity-50" style={{ marginTop: 'var(--spacing-12)' }}>
                        <Utensils size={16} />
                        <span className="text-sm">Works best with clear, well-lit photos.</span>
                    </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>

      <footer className="app-footer">
        <div className="container">
            <p className="tracking-tight">
                Bite<span style={{ color: 'var(--primary)', fontWeight: 'bold' }}>Smart</span> AI &copy; 2026 | Modern Food Identification System
            </p>
            <div className="footer-links">
                <a href="#" className="footer-link">Privacy Policy</a>
                <a href="#" className="footer-link">Terms of Service</a>
                <a href="#" className="footer-link">Help Center</a>
            </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
