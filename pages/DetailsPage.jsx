import React, { useState, useEffect, useRef } from 'react';
import Spinner from '../components/Spinner';
import { BreedDetectorIcon, LocalAdvisorIcon, BackIcon, ShareIcon } from '../components/Icons';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const InfoCard = ({ title, children, icon }) => (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-stone-200">
        <div className="flex items-center border-b border-stone-200 pb-4 mb-4">
            <div className="text-emerald-600 mr-4">{icon}</div>
            <h2 className="text-xl font-bold text-stone-800">{title}</h2>
        </div>
        <div className="space-y-3 text-stone-700">{children}</div>
    </div>
);

const DetailsPage = () => {
    const [record, setRecord] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSharing, setIsSharing] = useState(false);
    const reportRef = useRef(null);
    
    useEffect(() => {
        const fetchAnalysisDetails = async () => {
            setLoading(true);
            setError(null);
            try {
                const recordId = window.location.hash.split('/')[2];
                if (!recordId) throw new Error('Record ID not found in URL.');
                const storedUser = sessionStorage.getItem('cattle-classifier-user');
                const user = storedUser ? JSON.parse(storedUser) : null;
                if (!user || !user.token) throw new Error('You must be logged in to view this page.');
                const NODE_BACKEND_URL = import.meta.env.VITE_NODE_BACKEND_URL;
                const response = await fetch(`${NODE_BACKEND_URL}/api/analyses/${recordId}`, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || 'Could not load analysis');
                }
                const data = await response.json();
                setRecord(data);
            } catch (err) {
                console.error("Failed to fetch details:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchAnalysisDetails();
    }, []);

    const handleShare = async () => {
        if (!reportRef.current || isSharing) return;
        setIsSharing(true);
        try {
            const input = reportRef.current;
            const canvas = await html2canvas(input, { scale: 2, backgroundColor: '#f5f5f4', useCORS: true });
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgWidth = canvas.width;
            const imgHeight = canvas.height;
            const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
            const imgX = (pdfWidth - imgWidth * ratio) / 2;
            const imgY = 10;
            pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
            pdf.save(`PashuDrishti-Report-${record?._id || Date.now()}.pdf`);
        } catch (shareError) {
            console.error("Failed to generate report PDF:", shareError);
            setError("Sorry, there was an error generating the report PDF.");
        } finally {
            setIsSharing(false);
        }
    };

    if (loading) { return ( <div className="h-[calc(100vh-64px)] w-full flex items-center justify-center"><div className="flex items-center text-stone-700"><Spinner /><span className="ml-2">Loading record...</span></div></div> ); }
    if (error || !record) { return ( <div className="h-[calc(100vh-64px)] w-full flex items-center justify-center text-center px-4"> <div> <h2 className="text-xl font-semibold text-red-500">Could not load analysis</h2> <p className="text-stone-600 mt-2">{error || 'The requested record does not exist.'}</p><button onClick={() => window.location.hash = '/dashboard'} className="mt-6 inline-block px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700">Back to Dashboard</button> </div></div> ); }
    
    // THIS IS THE FIX: Check if the report itself contains an error message from the AI
    if (record.reportData && record.reportData.error) {
        return (
            <div className="h-[calc(100vh-64px)] w-full flex items-center justify-center text-center px-4">
                <div>
                    <h2 className="text-xl font-semibold text-red-500">Analysis Could Not Be Completed</h2>
                    <p className="text-stone-600 mt-2">Reason: {record.reportData.error}</p>
                    <button onClick={() => window.location.hash = '/dashboard'} className="mt-6 inline-block px-4 py-2 bg-emerald-600 text-white rounded-md hover:bg-emerald-700">Back to Dashboard</button>
                </div>
            </div>
        );
    }
    
    const { reportData, yoloData } = record;
    const { advanced_breed_detector, hyper_local_advisor } = reportData;

    return (
        <div className="bg-stone-50 min-h-screen">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="mb-6 flex justify-between items-center">
                     <button onClick={() => window.history.back()} className="inline-flex items-center text-emerald-600 hover:underline bg-transparent border-none cursor-pointer"> <BackIcon /> Back </button>
                     <button onClick={handleShare} disabled={isSharing} className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400"> {isSharing ? (<><Spinner /><span>Generating...</span></>) : (<><ShareIcon /><span>Download as PDF</span></>)} </button>
                </div>
                
                <div ref={reportRef} className="bg-stone-50 p-4 sm:p-8 rounded-lg">
                    <header className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-stone-900">Pashu Sahayak AI Report</h1>
                        <p className="text-md text-stone-500">Analyzed on {new Date(record.createdAt).toLocaleString()}</p>
                    </header>
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                        <div className="lg:col-span-2">
                            <img src={record.image} alt={advanced_breed_detector?.primary_breed} className="w-full h-auto object-cover rounded-lg shadow-xl" />
                        </div>
                        <div className="lg:col-span-3 space-y-8">
                           <InfoCard title="AI: Detailed Breed Analysis" icon={<BreedDetectorIcon />}>
                                {advanced_breed_detector.primary_breed && <p><strong>Primary Breed (AI):</strong> <span className="font-bold text-emerald-700">{advanced_breed_detector.primary_breed}</span></p>}
                                {advanced_breed_detector.confidence_score && <p><strong>Confidence Score (AI):</strong> <span className="font-semibold">{(advanced_breed_detector.confidence_score * 100).toFixed(1)}%</span></p>}
                                {Array.isArray(yoloData) && yoloData.length > 0 && ( <p className="text-sm text-stone-600 pt-2 border-t mt-2"> <strong>Initial Detection (Local Model):</strong> {yoloData[0].breed} at {Math.round(yoloData[0].confidence * 100)}% confidence. </p> )}
                                {advanced_breed_detector.breed_origin && (
                                    <div className="pt-3 mt-3 border-t border-stone-200">
                                        <h4 className="font-semibold text-stone-800 mb-2">Breed Profile</h4>
                                        <p><strong>Origin:</strong> <span>{advanced_breed_detector.breed_origin}</span></p>
                                        <p><strong>Formation:</strong> <span>{advanced_breed_detector.breed_formation}</span></p>
                                    </div>
                                )}
                                {Array.isArray(advanced_breed_detector.key_identifiers) && (
                                    <div className="pt-3 mt-3 border-t border-stone-200">
                                        <h4 className="font-semibold text-stone-800 mb-2">Key Identifiers</h4>
                                        <ul className="list-disc list-inside text-sm text-stone-600 space-y-1">
                                            {advanced_breed_detector.key_identifiers.map((id, i) => <li key={i}>{id}</li>)}
                                        </ul>
                                    </div>
                                )}
                                {Array.isArray(advanced_breed_detector.secondary_breeds) && advanced_breed_detector.secondary_breeds.length > 0 && (
                                    <div className="pt-3 mt-3 border-t border-stone-200">
                                        <h4 className="font-semibold text-stone-800 mb-2">Possible Cross-Breed Influence</h4>
                                        <ul className="space-y-1">{advanced_breed_detector.secondary_breeds.map((sb, i) => ( <li key={i} className="text-sm"> <strong>{sb.breed}:</strong> <span className="text-stone-600">~{(sb.confidence_score * 100).toFixed(0)}% confidence</span> </li> ))}</ul>
                                    </div>
                                )}
                            </InfoCard>
                            
                           {hyper_local_advisor && (
                                <InfoCard title={`Hyper-Local Advisor (${hyper_local_advisor.language})`} icon={<LocalAdvisorIcon />}>
                                   <div className="prose prose-sm max-w-none text-stone-700">
                                       <h4>Feeding Tip</h4><p>{hyper_local_advisor.feeding_tip}</p>
                                       <h4>Housing Tip</h4><p>{hyper_local_advisor.housing_tip}</p>
                                       <h4>Seasonal Tip</h4><p>{hyper_local_advisor.seasonal_tip}</p>
                                   </div>
                                </InfoCard>
                           )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailsPage;