import React, { useState, useRef } from 'react';
import { Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const UploadSection = ({ onUpload, isLoading }) => {
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleFile = (file) => {
        if (file && file.type.startsWith('image/')) {
            onUpload(file);
        } else {
            alert("Please upload a valid image file (JPG, PNG, or WEBP).");
        }
    };

    const onDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const onDragLeave = () => {
        setIsDragging(false);
    };

    const onDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        if (file) handleFile(file);
    };

    const handleFileInput = (e) => {
        const file = e.target.files[0];
        if (file) handleFile(file);
    };

    const triggerFileInput = () => {
        if (!isLoading && fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div 
                key="dropzone"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`upload-dropzone ${isDragging ? 'active' : ''}`}
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={triggerFileInput}
            >
                <input 
                    type="file" 
                    id="food-upload"
                    ref={fileInputRef} 
                    onChange={handleFileInput} 
                    accept="image/*" 
                    style={{ display: 'none' }}
                />
                <div className="upload-icon-circle">
                    <Camera size={36} />
                </div>
                <div className="upload-text">
                    <h3 className="upload-dropzone-title">Upload Food Image</h3>
                    <p className="upload-dropzone-desc">Drag & drop your meal photo here or click to browse files</p>
                    <div className="flex justify-center gap-2" style={{ marginTop: 'var(--spacing-6)' }}>
                        <span className="tag-chip-conf">JPG</span>
                        <span className="tag-chip-conf">PNG</span>
                        <span className="tag-chip-conf">WEBP</span>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default UploadSection;
