import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, ChevronRight, AlertCircle, Award, Info } from 'lucide-react';
import StatCard from './StatCard';
import TagList from './TagList';
import ProgressBar from './ui/ProgressBar';

const formatFoodName = (name) => {
    if (!name) return "";
    return name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
};

const ResultCard = ({ result, calorieResult, isLoading, onReset }) => {
    if (isLoading) {
        return (
            <div className="empty-state skeleton-box">
                <div className="w-16 h-16 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin mb-6"></div>
                <h3 className="text-2xl font-bold mb-2">Analyzing...</h3>
                <p className="text-gray-500">Extracting nutritional features</p>
            </div>
        );
    }

    if (!result) return null;

    const { food, confidence, top_5, status, message } = result;
    const confidencePercentage = (confidence * 100).toFixed(1);

    if (status === 'uncertain') {
        return (
            <motion.div 
                className="empty-state" 
                style={{ backgroundColor: 'var(--error-bg)', borderColor: 'var(--error)' }}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            >
                <div className="empty-icon-wrapper" style={{ color: 'var(--error)' }}>
                    <AlertCircle size={48} />
                </div>
                <h3 className="font-bold text-gray-900 mb-3" style={{ color: 'var(--error)' }}>Analysis Incomplete</h3>
                <p className="text-gray-500 mb-8 max-w-[300px]">
                    {message || "We couldn't confidently identify this food item. Try taking another photo from a different angle."}
                </p>
                <button onClick={onReset} className="btn-secondary px-8">
                    Try Another Photo
                </button>
            </motion.div>
        );
    }

    return (
        <AnimatePresence>
            <motion.div 
                className="image-preview-card h-full result-card-inner" 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                style={{ backgroundColor: 'var(--bg-card)' }}
            >
                <div className="prediction-header">
                    <div className="prediction-meta">
                        <span className="tag-chip font-bold text-xs" style={{ background: 'var(--success-bg)', color: 'var(--success)', borderColor: 'var(--success)' }}>
                            <CheckCircle size={14} className="mr-1" /> Verified Detection
                        </span>
                        {confidencePercentage > 90 && (
                            <span className="tag-chip font-bold text-xs" style={{ background: 'var(--warning-bg)', color: 'var(--warning)', borderColor: 'var(--warning)' }}>
                                <Award size={14} className="mr-1" /> High Accuracy
                            </span>
                        )}
                    </div>
                    <div>
                        <span className="prediction-top-label">AI Prediction Result</span>
                        <h2 className="prediction-title">{formatFoodName(food)}</h2>
                    </div>
                </div>

                <div className="metrics-container flex-col flex-1">
                    {calorieResult ? (
                        <StatCard 
                            calories={calorieResult.calories} 
                            matchedFood={calorieResult.foodName} 
                            delay={0.2} 
                        />
                    ) : (
                        <div className="stat-card" style={{ opacity: 0.7, marginBottom: 'var(--spacing-6)' }}>
                             <div className="stat-icon" style={{ background: 'var(--bg-subtle)', color: 'var(--text-muted)' }}>
                                <Info size={28} />
                             </div>
                             <div className="stat-content">
                                <span className="stat-label" style={{ color: 'var(--text-muted)' }}>Approximate</span>
                                <div className="stat-value" style={{ fontSize: '1.5rem', marginBottom: '4px' }}>Data Unavailable</div>
                                <div className="stat-secondary">No calorie match found for this item.</div>
                             </div>
                        </div>
                    )}

                    <motion.div 
                        className="confidence-container"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="confidence-header">
                            <span className="confidence-label">Prediction Confidence</span>
                            <span className="confidence-value">{confidencePercentage}%</span>
                        </div>
                        <div className="confidence-bar-bg">
                            <motion.div 
                                className="confidence-bar-fill" 
                                initial={{ width: 0 }}
                                animate={{ width: `${confidencePercentage}%` }}
                                transition={{ duration: 1, ease: 'easeOut', delay: 0.5 }}
                            />
                        </div>
                    </motion.div>

                    <TagList alternatives={top_5} delay={0.6} />

                </div>

                <div className="mt-auto pt-6 border-t border-gray-50" style={{ borderTop: '2px solid var(--border-light)', marginTop: 'auto', paddingTop: 'var(--spacing-6)' }}>
                    <button 
                        onClick={onReset}
                        className="btn-secondary w-full group relative overflow-hidden"
                        style={{ width: '100%' }}
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            Analyze Another Meal
                            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ResultCard;
