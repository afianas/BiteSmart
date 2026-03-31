import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, CheckCircle, Info, ChevronRight, AlertCircle } from 'lucide-react';

const ResultCard = ({ result, calorieResult, isLoading }) => {
    if (isLoading) {
        return (
            <motion.div 
                className="result-card loading-state"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="spinner"></div>
                <p>Analyzing your food...</p>
            </motion.div>
        );
    }

    if (!result) return null;

    const { food, confidence, top_5, status, message } = result;
    const confidencePercentage = (confidence * 100).toFixed(1);

    if (status === 'uncertain') {
        return (
            <motion.div 
                className="result-card error-state"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <div className="error-header">
                    <AlertCircle size={24} color="#ef4444" />
                    <h3>Uncertain Prediction</h3>
                </div>
                <p>{message || "Model not confident enough. Try another image."}</p>
                <button className="retry-btn" onClick={() => window.location.reload()}>Try Another</button>
            </motion.div>
        );
    }

    return (
        <AnimatePresence>
            <motion.div 
                className="result-card success-state"
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ type: "spring", damping: 20, stiffness: 100 }}
            >
                <header className="result-header">
                    <div className="food-badge">
                        <CheckCircle size={16} />
                        Predicted Food
                    </div>
                    <h2>{food}</h2>
                </header>

                <div className="stats-grid">
                    <div className="stat-item calorie-stat">
                        <Flame size={20} className="stat-icon" />
                        <div className="stat-content">
                            <span className="stat-label">Estimated Calories</span>
                            <span className="stat-value">
                                {calorieResult ? `${calorieResult.calories} kcal` : "No reliable data found"}
                            </span>
                            {calorieResult && (
                                <span className="stat-sublabel">Matched: {calorieResult.foodName}</span>
                            )}
                        </div>
                    </div>

                    <div className="stat-item confidence-stat">
                        <Info size={20} className="stat-icon" />
                        <div className="stat-content">
                            <span className="stat-label">Prediction Confidence</span>
                            <span className="stat-value">{confidencePercentage}%</span>
                            <div className="confidence-bar-bg">
                                <motion.div 
                                    className="confidence-bar-fill"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${confidencePercentage}%` }}
                                    transition={{ duration: 1, delay: 0.5 }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {top_5 && top_5.length > 1 && (
                    <div className="alternatives-section">
                        <h4>Top Alternatives</h4>
                        <ul className="alternatives-list">
                            {top_5.slice(1, 4).map((alt, idx) => (
                                <li key={idx} className="alt-item">
                                    <span>{alt.label}</span>
                                    <span className="alt-conf">{(alt.confidence * 100).toFixed(0)}%</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                <footer className="card-footer">
                    <button className="reset-btn" onClick={() => window.location.reload()}>
                        Analyze Another Meal
                        <ChevronRight size={18} />
                    </button>
                </footer>
            </motion.div>
        </AnimatePresence>
    );
};

export default ResultCard;
