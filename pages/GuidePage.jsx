import { useTranslation } from 'react-i18next';
import React from 'react';
import AIAssistant from '../components/AIAssistant';
import { HousingIcon, BreedGuideIcon, CalvingIcon, NutritionIcon, HealthIcon } from '../components/Icons';

const GuideCard = ({ topic }) => {
    // Note: We removed the useTranslation hook from here because the translated text is now passed down from the parent.
    return (
        <button
            onClick={() => window.location.hash = `/guide/${topic.slug}`}
            className="bg-gradient-to-br from-emerald-50 via-white to-blue-50  w-full h-full text-left bg-white rounded-lg shadow-lg p-6 border border-stone-200 transform hover:-translate-y-1 hover:shadow-xl transition-all duration-300 flex flex-col"
        >
            <div className="flex-shrink-0 text-emerald-500 mb-4">{topic.icon}</div>
            <h3 className="flex-grow font-bold text-xl text-stone-800 mb-2">{topic.title}</h3>
            <p className="text-stone-600">{topic.description}</p>
        </button>
    )
}

const GuidePage = () => {
    const { t } = useTranslation();

    // The guideTopics array is now inside the component to access the `t` function
    const guideTopics = [
        { slug: 'housing', title: t('guideTopics.housingTitle'), icon: <HousingIcon />, description: t('guideTopics.housingDesc') },
        { slug: 'breeds', title: t('guideTopics.breedsTitle'), icon: <BreedGuideIcon />, description: t('guideTopics.breedsDesc') },
        { slug: 'calving', title: t('guideTopics.calvingTitle'), icon: <CalvingIcon />, description: t('guideTopics.calvingDesc') },
        { slug: 'nutrition', title: t('guideTopics.nutritionTitle'), icon: <NutritionIcon />, description: t('guideTopics.nutritionDesc') },
        { slug: 'health', title: t('guideTopics.healthTitle'), icon: <HealthIcon />, description: t('guideTopics.healthDesc') },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 ">
            <header className="mb-12 text-center">
                <h1 className="text-4xl font-bold leading-tight text-stone-900">
                    {t('guidePage.mainTitle')}
                </h1>
                <p className="mt-2 text-lg text-stone-600">
                    {t('guidePage.mainSubtitle')}
                </p>
            </header>

            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                {guideTopics.map(topic => <GuideCard key={topic.slug} topic={topic} />)}
            </section>
            
            <section>
                <AIAssistant />
            </section>
        </div>
    );
};

export default GuidePage;