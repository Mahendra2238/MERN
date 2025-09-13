import { useRef, useState, useEffect } from 'react'
import Webcam from 'react-webcam'
import './App.css'

function App() {
  const webcamRef = useRef(null);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [storedImages, setStoredImages] = useState([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch("http://localhost:5000/images");
        const data = await res.json();
        setStoredImages(data);
      } catch (error) {
        console.error('Fetch images failed:', error);
      }
    };
    fetchImages();
  }, []);

  const capture=()=>{
    const imgSrc = webcamRef.current.getScreenshot();
    setImage(imgSrc);
    setError(null);
  };

  const uploadImg = async()=>{
    if(!image) {
      setError('No image to upload');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      console.log('Uploading image...');
      const res = await fetch("http://localhost:5000/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ image })
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      console.log('Upload response:', data);
      alert(data.message);
    } catch (error) {
      console.error('Upload failed:', error);
      setError('Upload failed: ' + error.message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <div className="app-container">
        <h1 className="app-heading">
          Webcam Image Upload
        </h1>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={350} />
        <div className="button-container">
          <button onClick={capture} className="capture-btn">Capture</button>
          <button onClick={uploadImg} disabled={!image || uploading} className="upload-btn">
            {uploading ? 'Uploading...' : 'Upload'}
          </button>
        </div>
        {error && <p className="error-message">{error}</p>}
        {image && (
          <div className="preview-section">
            <h2 className="preview-heading">Preview</h2>
            <img src={image} alt="Capture" width={300} className="preview-image" />
          </div>
        )}
        {storedImages.length > 0 && (
          <div className="stored-images-section">
            <h2>Stored Images</h2>
            <div className="images-grid">
              {storedImages.map((img, index) => (
                <img key={index} src={img.image} alt={`Stored ${index}`} width={200} />
              ))}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default App
