import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ChefHat, ShoppingBag, Info, AlertTriangle, Sparkles, Utensils } from 'lucide-react';
import { useCalories } from './hooks/useCalories';
import UploadSection from './components/UploadSection';
import ResultCard from './components/ResultCard';
import Button from './components/ui/Button';
import Card from './components/ui/Card';
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
    setPredictionResult(null); // Clear previous results on new upload
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
    <div className="app-main app-container">
      <header className="app-header">
        <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="brand"
        >
          <div className="bg-[#f97316] text-white p-2 rounded-xl shadow-lg">
            <ChefHat size={32} />
          </div>
          <h1 className="font-extrabold tracking-tight">Bite<span>Smart</span></h1>
        </motion.div>
        <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            transition={{ delay: 0.2 }}
            className="subtitle"
        >
          Intelligent food recognition powered by AI. Get instant nutritional insights by simply uploading a photo of your meal.
        </motion.p>
      </header>

      <main className="container main-content">
        {csvError && (
          <div className="error-banner">
            <AlertTriangle size={18} />
            {csvError}
          </div>
        )}

        <section className="grid-layout">
          <div className="upload-column flex flex-col gap-6">
            <UploadSection 
              onUpload={handleUpload} 
              onClear={handleClear} 
              isLoading={isLoading} 
            />

            <AnimatePresence>
                {selectedFile && !predictionResult && !isLoading && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="w-full"
                    >
                        <Button 
                            fullWidth 
                            onClick={analyzeFood}
                            disabled={isLoading || isCSVLoading}
                            className="!py-4 !text-lg"
                        >
                            <Sparkles size={20} />
                            {isLoading ? "Analyzing..." : "Analyze Meal Now"}
                        </Button>
                    </motion.div>
                )}
            </AnimatePresence>

            {error && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-2 items-center text-red-500 bg-red-50 p-4 rounded-xl border border-red-100"
                >
                    <AlertTriangle size={18} />
                    <p className="text-sm font-semibold">{error}</p>
                </motion.div>
            )}
          </div>

          <div className="result-column">
            <AnimatePresence mode="wait">
              {predictionResult || isLoading ? (
                <ResultCard 
                  key="result"
                  result={predictionResult} 
                  calorieResult={calorieResult} 
                  isLoading={isLoading}
                  onReset={handleClear} 
                />
              ) : (
                <motion.div 
                    key="empty"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="empty-placeholder"
                >
                    <div className="placeholder-icon-box">
                      <ShoppingBag size={40} />
                    </div>
                    <h3 className="font-bold text-2xl mb-2">Ready to Identify?</h3>
                    <p className="text-gray-500 text-center mb-8">
                       Upload an image on the left to see instant nutritional insights and calorie estimations.
                    </p>
                    <div className="flex flex-col gap-4 w-full max-w-[280px]">
                        <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">Popular searches:</span>
                        <div className="example-tags">
                            <span className="px-3 py-1 bg-white border border-gray-100 rounded-full text-xs font-semibold text-gray-500 shadow-sm">Pizza</span>
                            <span className="px-3 py-1 bg-white border border-gray-100 rounded-full text-xs font-semibold text-gray-500 shadow-sm">Biryani</span>
                            <span className="px-3 py-1 bg-white border border-gray-100 rounded-full text-xs font-semibold text-gray-500 shadow-sm">Burger</span>
                        </div>
                    </div>
                    <div className="mt-12 opacity-50 flex items-center gap-2 text-sm text-gray-400">
                        <Utensils size={14} />
                        <span>Try healthy options for better results!</span>
                    </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </section>
      </main>

      <footer className="container">
        <div className="border-t border-gray-100 pt-8 mt-8">
            <p className="text-gray-400 font-medium tracking-tight">
                Bite<span className="text-orange-400">Smart</span> AI &copy; 2026 | Modern Food Identification System
            </p>
            <div className="flex gap-6 justify-center mt-4">
                <span className="text-xs transition-opacity hover:opacity-100 opacity-60 cursor-pointer">Privacy Policy</span>
                <span className="text-xs transition-opacity hover:opacity-100 opacity-60 cursor-pointer">Terms of Service</span>
            </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
