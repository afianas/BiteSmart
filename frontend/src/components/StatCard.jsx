import React from 'react';
import { motion } from 'framer-motion';
import { Flame } from 'lucide-react';

const StatCard = ({ calories, matchedFood, delay = 0 }) => {
    return (
        <motion.div 
            className="stat-card highlight"
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.4, type: "spring", bounce: 0.4 }}
        >
            <div className="stat-icon">
                <Flame size={32} />
            </div>
            <div className="stat-content">
                <span className="stat-label">Estimated Calories</span>
                <div className="stat-value">{calories} kcal</div>
                <div className="stat-secondary">Matched base item: {matchedFood}</div>
            </div>
        </motion.div>
    );
};

export default StatCard;
