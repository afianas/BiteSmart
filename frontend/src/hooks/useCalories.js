import { useState, useEffect, useCallback } from 'react';
import Papa from 'papaparse';
import Fuse from 'fuse.js';

const CSV_URL = '/food_data.csv';

export const useCalories = () => {
    const [foodData, setFoodData] = useState([]);
    const [fuse, setFuse] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadCSV = async () => {
            try {
                const response = await fetch(CSV_URL);
                if (!response.ok) throw new Error("Failed to fetch CSV");
                
                const csvText = await response.text();

                Papa.parse(csvText, {
                    header: true,
                    dynamicTyping: true,
                    skipEmptyLines: true,
                    complete: (results) => {
                        setFoodData(results.data);
                        
                        // Initialize Fuse.js with the parsed data
                        const fuseInstance = new Fuse(results.data, {
                            keys: ['ShortDescrip', 'Descrip'],
                            threshold: 0.4,
                            includeScore: true
                        });
                        setFuse(fuseInstance);
                        setIsLoading(false);
                    },
                    error: (err) => {
                        console.error("Papa parse error:", err);
                        setError("Error parsing calorie data.");
                        setIsLoading(false);
                    }
                });
            } catch (err) {
                console.error("Error loading CSV:", err);
                setError("Failed to load calorie database.");
                setIsLoading(false);
            }
        };

        loadCSV();
    }, []);

    const findCalories = useCallback((foodName) => {
        if (!fuse) return null;

        const results = fuse.search(foodName);
        if (results.length > 0) {
            const bestMatch = results[0];
            return {
                foodName: bestMatch.item.Descrip || bestMatch.item.ShortDescrip,
                calories: Math.round(bestMatch.item.Energy_kcal),
                matchScore: (1 - bestMatch.score).toFixed(2)
            };
        }
        return null;
    }, [fuse]);

    return { findCalories, isLoading, error };
};
