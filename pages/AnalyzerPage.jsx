import React from 'react';
import ImageUploader from '../components/ImageUploader';
// In file: project/src/pages/AnalyzerPage.jsx

import { getPashuSahayakReport, detectBreedWithYOLOv8 } from '../services/geminiService';
import CameraCapture from '../components/CameraCapture';
import { CameraIcon as TakePhotoIcon } from '../components/Icons'; 


const LoadingOverlay = () => (
  <div className="absolute inset-0 bg-white bg-opacity-90 flex flex-col items-center justify-center z-50 rounded-lg text-center p-4">
      <style>{
      `
       .cow-scanner {
          width: 450px;
          height: 100px;
          position: relative;
          background-size: contain;
          background-repeat: no-repeat;
          background-position: center;
        }
        .scan-line {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 3px;
          background-color: #16a34a;
          box-shadow: 0 0 10px #16a34a;
          animation: scan 2s infinite cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes scan {
          0%, 100% { top: 0%; }
          50% { top: 100%; }
        }
      `}</style>
    <div className="cow-scanner">
      <div className="scan-line"></div>
    </div>
    <p className="text-gray-800 text-lg mt-4 animate-pulse">PashuDrishti AI is analyzing the image...</p>
    <p className="text-gray-600 text-sm mt-2">This may take a moment. Please do not close this page.</p>
  <p className="text-gray-600 text-sm mt-10">Ai can make mistakes, so double-check it</p>
    
  </div>
);

const AnalyzerPage = () => {
    const [selectedImage, setSelectedImage] = React.useState(null);
    const [isCameraOpen, setIsCameraOpen] = React.useState(false);
    const [location, setLocation] = React.useState('');
    const [language, setLanguage] = React.useState('English');
    const [isLoading, setIsLoading] = React.useState(false);
    const [error, setError] = React.useState(null);
   const [yoloResult, setYoloResult] = React.useState(null);
    const [loadingMessage, setLoadingMessage] = React.useState('');

    
    const dataURLtoFile = (dataurl, filename) => {
        const arr = dataurl.split(',');
        const mime = arr[0].match(/:(.*?);/)[1];
        const bstr = atob(arr[1]);
        let n = bstr.length;
        const u8arr = new Uint8Array(n);
        while (n--) {
            u8arr[n] = bstr.charCodeAt(n);
        }
        return new File([u8arr], filename, { type: mime });
    };

    
    const handleFileSelect = (file) => {
        
        setError(null);

        const reader = new FileReader();
        reader.onload = () => {
            setSelectedImage({
                file: file, 
                dataUrl: reader.result,
                mimeType: file.type
            });
        };
        reader.readAsDataURL(file);
    };
    
    
    const handleCapture = (dataUrl) => {
        setError(null);
        setIsCameraOpen(false);
        const fileName = `capture_${Date.now()}.jpeg`;
        const file = dataURLtoFile(dataUrl, fileName); 

        setSelectedImage({
            file: file,
            dataUrl: dataUrl,
            mimeType: 'image/jpeg'
        });
    }
    
    
    const handleCloseCamera = () => {
        setIsCameraOpen(false);
    };

    

const handleAnalyze = async () => {
    if (!selectedImage || !selectedImage.file) {
        setError('Please select an image first.');
        return;
    }
    if (!location.trim()) {
        setError('Please enter a location.');
        return;
    }

    setIsLoading(true);
    setError(null);
    setYoloResult(null); 

    try {
        
        setLoadingMessage('Detecting breed with local model...');
        const yoloResultData = await detectBreedWithYOLOv8(selectedImage.file);
        const detectedBreedName = yoloResultData && yoloResultData.length > 0 ? yoloResultData[0].breed : null;
        setYoloResult(yoloResultData);

        
        setLoadingMessage('Breed detected! Getting detailed analysis from Gemini AI...');
        const finalReport = await getPashuSahayakReport(
            selectedImage.dataUrl.split(',')[1],
            selectedImage.mimeType,
            location,
            language,
            detectedBreedName
        );
        
        
        setLoadingMessage('Saving report to your permanent history...');
        const user = JSON.parse(sessionStorage.getItem('cattle-classifier-user'));
        
        if (!user || !user.token) {
            throw new Error("You must be logged in to save an analysis.");
        }



        const NODE_BACKEND_URL = import.meta.env.VITE_NODE_BACKEND_URL;

const response = await fetch(`${NODE_BACKEND_URL}/api/analyses`, {
      method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.token}`
            },
            body: JSON.stringify({
                image: selectedImage.dataUrl,
                location: location,
                analysisData: finalReport,
                 yoloData: yoloResultData 
            })



});
        

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to save the analysis to the database.');
        }

        const savedAnalysis = await response.json();

        
        window.location.hash = `/details/${savedAnalysis._id}`;

    } catch (err) {
        console.error("Full hybrid analysis failed:", err);
        setError(err instanceof Error ? err.message : 'An unexpected error occurred during the analysis.');
        setIsLoading(false);
    }
};

    const steps = ['Select Image', 'Add Details & Analyze'];
    const currentStep = !selectedImage ? 0 : 1;

    

    return (
        <> {/* Use a Fragment to wrap the page and the potential modal */}
            {/* THIS IS THE FIX: Render CameraCapture as an overlay when isCameraOpen is true */}
            {isCameraOpen && <CameraCapture onCapture={handleCapture} onClose={handleCloseCamera} />}

            <div className="animate-bounce-in-top max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ">
                <div className="mb-8 ">
                    <h1 className="text-3xl font-bold mb-4 text-center">PashuDrishti Analysis</h1>
                    {/* Progress Stepper */}
                    <div className="flex items-center justify-center">
                        {steps.map((step, index) => (
                            <React.Fragment key={step}>
                                <div className="flex items-center">
                                    <div className={`flex items-center justify-center h-8 w-8 rounded-full transition-colors ${index <= currentStep ? 'bg-emerald-600 text-white' : 'bg-stone-200 text-stone-600'}`}>
                                        {index + 1}
                                    </div>
                                    <p className={`ml-3 font-medium transition-colors ${index <= currentStep ? 'text-emerald-600' : 'text-stone-500'}`}>{step}</p>
                                </div>
                                {index < steps.length - 1 && <div className="flex-auto border-t-2 mx-4 border-stone-200"></div>}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
                
                <div className="relative bg-white p-8 rounded-lg shadow-lg min-h-[550px] flex flex-col items-center justify-center animate-bounce-in-top">
                    {isLoading && <LoadingOverlay />}
                    
                    {selectedImage ? (
                        
                        <div className="w-full flex flex-col items-center text-center">
                            <p className="text-stone-600 mb-4">Review your selected image and provide details for a hyper-local analysis.</p>
                            <img src={selectedImage.dataUrl} alt="Selected preview" className="max-w-md w-full h-auto rounded-md shadow-md mb-6" />
                            {/* ADD THIS BLOCK TO DISPLAY THE YOLOv8 RESULT */}


                            <div className="w-full max-w-md space-y-4 mb-6">
                                <div>
                                    <label htmlFor="location" className="block text-sm font-medium text-stone-700 text-left">Location (e.g., 'Bhubaneswar, Odisha, Gujurat,  Punjab, etc')</label>
                                    <input
                                        type="text"
                                        id="location"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                        className="mt-1 block w-full px-4 py-3 bg-stone-100 border border-stone-200 rounded-md shadow-sm placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                        placeholder="Enter city and state"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="language" className="block text-sm font-medium text-stone-700 text-left">Language for Advice</label>
                                    <select
                                        id="language"
                                        value={language}
                                        onChange={(e) => setLanguage(e.target.value)}
                                        className="mt-1 block w-full px-4 py-3 bg-stone-100 border border-stone-200 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                                    >
                                        <option>English</option>
                                        <option>Hindi</option>
                                        <option>Odia</option>
                                        <option>Bengali</option>
                                        <option>Telugu</option>
                                        <option>Tamil</option>
                                        <option>Marathi</option>
                                        <option>Gujarati</option>
                                    </select>
                                </div>
                            </div>
                            
                            {error && <p className="my-4 text-center text-red-500">{error}</p>}

                            <div className="flex space-x-4">
                                <button
                                    onClick={() => setSelectedImage(null)}
                                    className="px-8 py-3 border border-stone-300 text-base font-medium rounded-md shadow-sm text-stone-700 bg-white hover:bg-stone-50 disabled:opacity-50"
                                    disabled={isLoading}
                                >
                                    Change Image
                                </button>
                                <button
                                    onClick={handleAnalyze}
                                    disabled={isLoading || !location.trim()}
                                    className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-red-300 disabled:cursor-not-allowed"
                                >
                                    Analyze Now
                                </button>
                            </div>
                        </div>
                    ) : (
                        
                        <div className="w-full flex flex-col items-center text-center max-w-lg">
                            <p className="text-stone-600 mb-6">Select an image from your device or take a new photo.</p>
                            <ImageUploader onFileSelect={handleFileSelect} />
                            <div className="relative my-6 w-full flex items-center">
                                <div className="flex-grow border-t border-stone-300"></div>
                                <span className="flex-shrink mx-4 text-stone-500">OR</span>
                                <div className="flex-grow border-t border-stone-300"></div>
                            </div>
                            <button
                                onClick={() => setIsCameraOpen(true)}
                                className="rounded-xl w-full inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700"
                            >
                                <TakePhotoIcon className="h-6 w-6 mr-3" />
                                Take a Photo
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default AnalyzerPage;