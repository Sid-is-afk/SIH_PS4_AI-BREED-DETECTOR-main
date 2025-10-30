import React, { useMemo, useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const StatCard = ({ label, value, accentColor = 'text-blue-600' }) => (
    <div className="bg-white p-5 rounded-lg shadow-sm transform transition duration-300 hover:scale-105 hover:shadow-md">
        <dt className="text-sm font-medium text-stone-500 truncate">{label}</dt>
        <dd className={`mt-1 text-3xl font-extrabold ${accentColor}`}>{value}</dd>
    </div>
);

const ProfilePage = () => {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [profileImage, setProfileImage] = useState(null);
    const [history, setHistory] = useState([]); 
    const [isLoading, setIsLoading] = useState(true); 

    useEffect(() => {
        const storedImage = localStorage.getItem('profile-image');
        if (storedImage) {
            setProfileImage(storedImage);
        }

        const fetchHistory = async () => {
            setIsLoading(true);
            try {
                if (!user || !user.token) {
                    setHistory([]);
                    return; // Return early if no user
                }
                
                const NODE_BACKEND_URL = import.meta.env.VITE_NODE_BACKEND_URL;
                const response = await fetch(`${NODE_BACKEND_URL}/api/analyses`, {
                    headers: { 'Authorization': `Bearer ${user.token}` }
                });

                if (!response.ok) {
                    throw new Error('Failed to fetch analysis history.');
                }
                const data = await response.json();
                setHistory(data);
            } catch (error) {
                console.error("Failed to fetch history:", error);
                setHistory([]);
            } finally {
                setIsLoading(false);
            }
        };

        if (user) { // Only fetch history if the user object is available
            fetchHistory();
        } else {
            setIsLoading(false); // If no user, stop loading
        }
    }, [user]); 

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const imageUrl = reader.result;
                setProfileImage(imageUrl);
                localStorage.setItem('profile-image', imageUrl);
            };
            reader.readAsDataURL(file);
        }
    };

    const profileStats = useMemo(() => {
        if (!history || history.length === 0) return null;

        const sortedHistory = [...history].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        
        const lastActivity = new Date(sortedHistory[0].createdAt).toLocaleDateString();

        const getTopItem = (key) => {
            const counts = history.reduce((acc, item) => {
                const value = key === 'primary_breed' ? item.reportData?.advanced_breed_detector?.primary_breed : item.location;
                if (value) {
                    acc[value] = (acc[value] || 0) + 1;
                }
                return acc;
            }, {});
            
            return Object.keys(counts).length > 0
                ? Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0]
                : 'N/A';
        }
        
        return {
            totalAnalyses: history.length,
            lastActivity,
            topBreed: getTopItem('primary_breed'),
            topLocation: getTopItem('location'),
        };

    }, [history]);

    if (isLoading || !user) {
        return <p className="text-center py-12 text-lg text-stone-600">{t('profilePage.loading')}</p>
    }
    
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-emerald-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto bg-white shadow-2xl rounded-xl overflow-hidden">
                <div className="relative p-8 bg-gradient-to-br from-emerald-50 via-white to-blue-50 text-black-300">
                    <div className="flex flex-col sm:flex-row items-center relative z-10">
                        <div className="relative h-28 w-28 rounded-full bg-white flex items-center justify-center text-emerald-600 text-5xl font-extrabold mb-4 sm:mb-0 sm:mr-8 flex-shrink-0 shadow-lg border-4 border-white">
                            {profileImage ? (
                                <img src={profileImage} alt="Profile" className="h-full w-full object-cover rounded-full" />
                            ) : (
                                user.name.charAt(0).toUpperCase()
                            )}
                            <label htmlFor="profile-image-upload" className="absolute -bottom-1 -right-1 p-2 bg-emerald-600 text-white rounded-full cursor-pointer hover:bg-emerald-700 transition-colors duration-200 ease-in-out shadow-md">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                                <span className="sr-only">{t('profilePage.uploadPicture')}</span>
                            </label>
                            <input id="profile-image-upload" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                        </div>
                        <div className="text-center sm:text-left">
                            <h1 className="text-4xl font-extrabold tracking-tight">{user.name}</h1>
                            <p className="text-lg opacity-90 mt-1">{user.email}</p>
                            <p className="text-sm opacity-75 mt-1">
                                {t('profilePage.memberSince', { date: new Date(user.createdAt).toLocaleDateString() })}
                            </p>
                        </div>
                    </div>
                </div>
                
                {profileStats ? (
                    <div className="border-t border-stone-100 p-8">
                        <h3 className="text-2xl font-bold mb-6 text-stone-800 border-b-2 border-emerald-200 pb-2">{t('profilePage.activityDashboard')}</h3>
                        <dl className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                           <StatCard label={t('profilePage.totalAnalyses')} value={profileStats.totalAnalyses} accentColor="text-emerald-600" />
                           <StatCard label={t('profilePage.lastActivity')} value={profileStats.lastActivity} accentColor="text-purple-600" />
                           <StatCard label={t('profilePage.topBreed')} value={profileStats.topBreed} accentColor="text-orange-600" />
                           <StatCard label={t('profilePage.topLocation')} value={profileStats.topLocation} accentColor="text-indigo-600" />
                        </dl>
                    </div>
                ) : (
                    <div className="border-t border-stone-100 px-8 py-10 text-center">
                         <p className="text-stone-600 text-lg">{t('profilePage.noHistory')}</p>
                         <button onClick={() => window.location.hash = '/start-analysis'} className="mt-6 px-6 py-3 bg-emerald-600 text-white font-semibold rounded-lg shadow-md hover:bg-emerald-700 transition-colors duration-200 ease-in-out transform hover:scale-105">
                             {t('profilePage.startFirstAnalysis')}
                         </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;