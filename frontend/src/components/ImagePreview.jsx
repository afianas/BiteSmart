import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Trash2, Sparkles } from 'lucide-react';
import Button from './ui/Button';

const ImagePreview = ({ file, onClear, onAnalyze, isLoading, onUpload }) => {
    const [imageUrl, setImageUrl] = React.useState('');
    const fileInputRef = React.useRef(null);

    useEffect(() => {
        if (file) {
            const url = URL.createObjectURL(file);
            setImageUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [file]);

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected && selected.type.startsWith('image/')) {
            onUpload(selected);
        }
    };

    if (!file) return null;

    return (
        <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col gap-var(--spacing-6) w-full"
            style={{ gap: 'var(--spacing-6)' }}
        >
            <div className="image-preview-card">
                {imageUrl && <img src={imageUrl} alt="Uploaded meal" />}
                <div className="image-preview-overlay">
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept="image/*" 
                        style={{ display: 'none' }} 
                    />
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="btn-secondary"
                        disabled={isLoading}
                    >
                        <RefreshCw size={18} />
                        Change
                    </button>
                    <button 
                        onClick={onClear}
                        className="btn-secondary"
                        style={{ color: 'var(--error)' }}
                        disabled={isLoading}
                    >
                        <Trash2 size={18} />
                        Remove
                    </button>
                </div>
            </div>

            <button 
                onClick={onAnalyze}
                disabled={isLoading}
                className="btn-primary w-full"
                style={{ width: '100%', fontSize: '1.125rem', padding: 'var(--spacing-4)' }}
            >
                {isLoading ? (
                    <div 
                        className="flex items-center"
                        style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            style={{ display: 'flex' }}
                        >
                            <RefreshCw size={22} className="opacity-70" />
                        </motion.div>
                        Analyzing...
                    </div>
                ) : (
                    <>
                        <Sparkles size={22} />
                        Analyze Meal Now
                    </>
                )}
            </button>
        </motion.div>
    );
};

export default ImagePreview;
