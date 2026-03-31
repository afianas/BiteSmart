import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Camera } from 'lucide-react';

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
            alert("Please upload a valid image file.");
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
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
        fileInputRef.current.click();
    };

    const clearSelection = () => {
        setPreview(null);
        fileInputRef.current.value = '';
        onClear();
    };

    return (
        <div className="upload-container">
            {!preview ? (
                <div 
                    className={`drop-zone ${isDragging ? 'dragging' : ''}`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={triggerFileInput}
                >
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileInput} 
                        accept="image/*" 
                        style={{ display: 'none' }}
                    />
                    <div className="drop-content">
                        <div className="icon-wrapper">
                            <Camera size={48} className="camera-icon" />
                            <Upload size={32} className="upload-icon" />
                        </div>
                        <h3>Upload Food Image</h3>
                        <p>Drag & drop or click to browse</p>
                        <span className="file-hint">JPG, PNG or WEBP formats</span>
                    </div>
                </div>
            ) : (
                <div className="preview-container">
                    <img src={preview} alt="Food Preview" className="food-preview" />
                    <button 
                        className="clear-btn" 
                        onClick={clearSelection}
                        disabled={isLoading}
                        title="Remove image"
                    >
                        <X size={20} />
                    </button>
                    {!isLoading && (
                        <div className="preview-overlay">
                            <button className="change-btn" onClick={triggerFileInput}>
                                <ImageIcon size={18} />
                                Change Image
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default UploadSection;
