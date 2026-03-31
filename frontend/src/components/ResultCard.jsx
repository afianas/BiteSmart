import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Flame, CheckCircle, Info, ChevronRight, AlertCircle, ShoppingBag, Award } from 'lucide-react';
import Card from './ui/Card';
import ProgressBar from './ui/ProgressBar';
import Badge from './ui/Badge';
import Button from './ui/Button';

const formatFoodName = (name) => {
    if (!name) return "";
    return name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
};

const ResultCard = ({ result, calorieResult, isLoading, onReset }) => {
    if (isLoading) {
        return (
            <Card className="flex flex-col items-center justify-center min-h-[400px] text-center" animate={false}>
                <div className="w-16 h-16 border-4 border-orange-50 border-t-orange-500 rounded-full animate-spin mb-6"></div>
                <h3 className="text-2xl font-bold mb-2">Analyzing Your Meal...</h3>
                <p className="text-gray-500 max-w-[280px]">Our AI is peering into the pixels to identify nutritional ingredients.</p>
            </Card>
        );
    }

    if (!result) return null;

    const { food, confidence, top_5, status, message } = result;
    const confidencePercentage = (confidence * 100).toFixed(1);

    if (status === 'uncertain') {
        return (
            <Card className="border-red-100 flex flex-col items-center justify-center text-center py-12" delay={0.1}>
                <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-6">
                    <AlertCircle size={32} />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">Analysis Incomplete</h3>
                <p className="text-gray-500 mb-8 max-w-[300px]">
                    {message || "We couldn't confidently identify this food item. Try taking another photo from a different angle."}
                </p>
                <Button variant="outline" onClick={onReset} className="px-8">
                    Try Another Photo
                </Button>
            </Card>
        );
    }

    return (
        <AnimatePresence>
            <Card className="h-full flex flex-col relative" delay={0.1}>
                <div className="prediction-title-group">
                    <div className="flex justify-between items-center mb-4">
                        <Badge variant="success">
                            <CheckCircle size={14} />
                            Verified Detection
                        </Badge>
                        {confidencePercentage > 90 && (
                            <Badge variant="orange">
                                <Award size={14} />
                                High Accuracy
                            </Badge>
                        )}
                    </div>
                    <span className="prediction-label">Likely Match</span>
                    <h2 className="food-name">{formatFoodName(food)}</h2>
                </div>

                <div className="metrics-container">
                    {calorieResult ? (
                        <motion.div 
                            className="calorie-highlight"
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                        >
                            <div className="calorie-icon-box">
                                <Flame size={28} />
                            </div>
                            <div className="calorie-info">
                                <span className="label">Estimated Calories</span>
                                <span className="value">{calorieResult.calories} kcal</span>
                                <span className="calorie-match">Matched: {calorieResult.foodName}</span>
                            </div>
                        </motion.div>
                    ) : (
                        <div className="bg-gray-50 p-6 rounded-2xl border border-dashed border-gray-200">
                             <div className="flex gap-4 items-center opacity-60">
                                <Info size={24} />
                                <div>
                                    <p className="font-bold text-gray-700">Approximate value</p>
                                    <p className="text-sm">Calorie data unavailable for this item.</p>
                                </div>
                             </div>
                        </div>
                    )}

                    <div className="confidence-section px-2">
                        <ProgressBar 
                            value={confidence * 100} 
                            label="Prediction Confidence" 
                        />
                    </div>
                </div>

                {top_5 && top_5.length > 1 && (
                    <div className="alternatives-container mb-8">
                        <h4>TOP ALTERNATIVES</h4>
                        <div className="pill-grid">
                            {top_5.slice(1, 4).map((alt, idx) => (
                                <motion.div 
                                    key={idx} 
                                    className="pill-item"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.5 + (idx * 0.1) }}
                                >
                                    <span>{formatFoodName(alt.label)}</span>
                                    <span className="conf">{(alt.confidence * 100).toFixed(0)}%</span>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-auto pt-6 border-t border-gray-50">
                    <Button 
                        variant="secondary" 
                        fullWidth 
                        onClick={onReset}
                        className="group"
                    >
                        Analyze Another Meal
                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </Button>
                </div>
            </Card>
        </AnimatePresence>
    );
};

export default ResultCard;
