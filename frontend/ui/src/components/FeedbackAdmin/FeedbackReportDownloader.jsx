import React, { useState } from 'react';
import FeedbackPDFReport from './FeedbackPDFReport';

const FeedbackReportDownloader = ({ feedbacks }) => {
  const [generating, setGenerating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  const handleDownload = () => {
    // Prevent multiple generations
    if (generating) return;
    
    setGenerating(true);
    setShowModal(true);
  };
  
  const handleGenerated = (blob, fileName) => {
    setGenerating(false);
    
    // Create download link
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  // Base style with all: unset to prevent inheritance
  const baseStyle = {
    all: 'unset',
    boxSizing: 'border-box',
    fontFamily: 'Arial, sans-serif'
  };

  return (
    <>
      <button
        style={{
          ...baseStyle,
          marginTop: '20px',
          padding: '10px 20px',
          backgroundColor: '#3498db',
          color: 'white',
          borderRadius: '4px',
          cursor: generating ? 'not-allowed' : 'pointer',
          fontSize: '14px',
          display: 'block',
          width: '100%',
          opacity: generating ? 0.7 : 1
        }}
        onClick={handleDownload}
        disabled={generating}
      >
        {generating ? 'Generating Report...' : 'Download Feedback Report'}
      </button>
      
      {showModal && (
        <div style={{
          ...baseStyle,
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            ...baseStyle,
            backgroundColor: '#fff',
            padding: '24px',
            borderRadius: '8px',
            maxWidth: '400px',
            width: '100%',
            textAlign: 'center',
            display: 'block'
          }}>
            {generating ? (
              <>
                <div style={{ ...baseStyle, fontSize: '18px', marginBottom: '16px', display: 'block' }}>
                  Generating report...
                </div>
                <div style={{ ...baseStyle, width: '50px', height: '50px', margin: '0 auto', border: '5px solid #f3f3f3', borderTop: '5px solid #3498db', borderRadius: '50%', animation: 'spin 1s linear infinite', display: 'block' }}>
                  <style>
                    {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
                  </style>
                </div>
              </>
            ) : (
              <>
                <div style={{ ...baseStyle, fontSize: '18px', marginBottom: '16px', color: '#27ae60', display: 'block' }}>
                  Report generated successfully!
                </div>
                <div style={{ ...baseStyle, fontSize: '14px', marginBottom: '24px', color: '#555', display: 'block' }}>
                  Your download should begin automatically.
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  style={{
                    ...baseStyle,
                    padding: '8px 16px',
                    backgroundColor: '#3498db',
                    color: 'white',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Close
                </button>
              </>
            )}
          </div>
        </div>
      )}
      
      {/* Only render PDF generator when needed */}
      {showModal && generating && (
        <FeedbackPDFReport 
          key={Date.now()} // Add key to ensure it re-renders properly
          feedbacks={feedbacks} 
          reportType="complete" 
          onGenerated={handleGenerated} 
        />
      )}
    </>
  );
};

export default FeedbackReportDownloader;