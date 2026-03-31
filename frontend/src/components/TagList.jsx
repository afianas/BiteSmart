import React from 'react';
import { motion } from 'framer-motion';

const formatFoodName = (name) => {
    if (!name) return "";
    return name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
};

const TagList = ({ alternatives, delay = 0 }) => {
    if (!alternatives || alternatives.length <= 1) return null;

    return (
        <div className="tag-list-container">
            <h4 className="tag-list-title">Top Alternatives</h4>
            <div className="tags-grid">
                {alternatives.slice(1, 4).map((alt, idx) => (
                    <motion.div 
                        key={idx} 
                        className="tag-chip"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: delay + (idx * 0.1), duration: 0.3 }}
                    >
                        <span>{formatFoodName(alt.label)}</span>
                        <span className="tag-chip-conf">
                            {(alt.confidence * 100) < 1 ? '<1' : (alt.confidence * 100).toFixed(1)}%
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default TagList;
