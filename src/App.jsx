import React, { useState, useRef } from "react";
import "./App.css";

function ImageCompressor() {
  const [originalImage, setOriginalImage] = useState(null);
  const [compressedImage, setCompressedImage] = useState(null);
  const [scale, setScale] = useState(50); // Scale percentage
  const [quality, setQuality] = useState(0.7); // Quality (0.1 to 1.0)
  const [format, setFormat] = useState("image/jpeg"); // Default format
  const canvasRef = useRef(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setOriginalImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const compressImage = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.src = originalImage;

    img.onload = () => {
      const width = img.width * (scale / 100);
      const height = img.height * (scale / 100);

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);

      const compressed = canvas.toDataURL(format, quality);
      setCompressedImage(compressed);
    };
  };

  const downloadImage = () => {
    const link = document.createElement("a");
    link.download = `compressed_image.${format.split("/")[1]}`;
    link.href = compressedImage;
    link.click();
  };

  return (
    <div className="app">
      <div className="card">
        <h1 className="title">Image Compressor</h1>
        <p className="subtitle">
          Upload your image, adjust compression settings, and download the optimized version!
        </p>

        <input type="file" onChange={handleImageUpload} className="file-input" />

        {originalImage && (
          <div className="image-preview">
            <h3>Original Image</h3>
            <img src={originalImage} alt="Original" className="preview-image" />
          </div>
        )}

        {originalImage && (
          <div className="settings">
            <label className="setting">
              Scale (%):
              <input
                type="number"
                value={scale}
                onChange={(e) => setScale(e.target.value)}
                className="input"
                min="10"
                max="100"
              />
            </label>
            <label className="setting">
              Quality (0.1 - 1.0):
              <input
                type="number"
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                className="input"
                step="0.1"
                min="0.1"
                max="1.0"
              />
            </label>
            <label className="setting">
              Format:
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="select"
              >
                <option value="image/jpeg">JPEG</option>
                <option value="image/png">PNG</option>
                <option value="image/webp">WebP</option>
              </select>
            </label>
          </div>
        )}

        {originalImage && (
          <button onClick={compressImage} className="button">
            Compress Image
          </button>
        )}

        {compressedImage && (
          <div className="image-preview">
            <h3>Compressed Image</h3>
            <img src={compressedImage} alt="Compressed" className="preview-image" />
            <button onClick={downloadImage} className="button">
              Download Image
            </button>
          </div>
        )}
        <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
      </div>
    </div>
  );
}

export default ImageCompressor;
