import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Camera, Trash2, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './ui/Button';

const UploadSection = ({ onUpload, onClear, isLoading }) => {
    const [preview, setPreview] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleFile = (file) => {
        if (file && file.type.startsWith('image/')) {
            const previewUrl = URL.createObjectURL(file);
            setPreview(previewUrl);
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
        handleFile(file);
    };

    const handleFileInput = (e) => {
        const file = e.target.files[0];
        handleFile(file);
    };

    const triggerFileInput = () => {
        if (!isLoading) {
            fileInputRef.current.click();
        }
    };

    const clearSelection = (e) => {
        e.stopPropagation();
        setPreview(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        onClear();
    };

    return (
        <div className="upload-wrapper h-full">
            <AnimatePresence mode="wait">
                {!preview ? (
                    <motion.div 
                        key="dropzone"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className={`dropzone-container ${isDragging ? 'active' : ''}`}
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={onDrop}
                        onClick={triggerFileInput}
                    >
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileInput} 
                            accept="image/*" 
                            style={{ display: 'none' }}
                        />
                        <div className="upload-icon-main">
                            <Camera size={32} />
                        </div>
                        <div className="upload-text">
                            <h3 className="font-bold text-xl mb-2">Upload Food Image</h3>
                            <p className="text-gray-500 mb-6">Drag and drop your meal photo here or click to browse files</p>
                            <div className="flex gap-2 justify-center">
                                <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-lg text-xs font-bold uppercase tracking-wider">JPG</span>
                                <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-lg text-xs font-bold uppercase tracking-wider">PNG</span>
                                <span className="px-3 py-1 bg-gray-100 text-gray-500 rounded-lg text-xs font-bold uppercase tracking-wider">WEBP</span>
                            </div>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        key="preview"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="image-preview-wrapper group"
                    >
                        <img src={preview} alt="Food analysis preview" />
                        
                        <div className="preview-actions">
                            <Button 
                                variant="outline" 
                                className="!bg-white/90 !border-0 !text-black !rounded-full !p-3"
                                onClick={triggerFileInput}
                                disabled={isLoading}
                                title="Change Image"
                            >
                                <ImageIcon size={20} />
                            </Button>
                            
                            <Button 
                                variant="outline" 
                                className="!bg-red-500/90 !border-0 !text-white !rounded-full !p-3 hover:!bg-red-600"
                                onClick={clearSelection}
                                disabled={isLoading}
                                title="Remove Image"
                            >
                                <Trash2 size={20} />
                            </Button>
                        </div>
                        
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            onChange={handleFileInput} 
                            accept="image/*" 
                            style={{ display: 'none' }}
                        />
                        
                        {isLoading && (
                            <div className="absolute inset-0 bg-white/40 backdrop-blur-[2px] flex items-center justify-center">
                                <div className="flex flex-col items-center gap-3">
                                    <div className="w-12 h-12 border-4 border-orange-100 border-t-orange-500 rounded-full animate-spin"></div>
                                    <span className="font-bold text-orange-600 drop-shadow-sm">Analyzing...</span>
                                </div>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default UploadSection;
