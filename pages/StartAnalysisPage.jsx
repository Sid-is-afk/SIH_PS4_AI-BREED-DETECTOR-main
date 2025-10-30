import { useTranslation } from 'react-i18next'
import React from 'react';
import { SideProfileIcon, LightIcon, GroundIcon } from '../components/Icons';

const TipCard = ({ icon, title, description }) => (
    <div className="animate-slide-in-elliptic-top-fwd bg-white p-6 rounded-lg shadow-lg border border-emerald-200 text-center hover:shadow-xl transition-shadow duration-300"> {/* MODIFIED CLASSES HERE */}
        <div className="text-emerald-500 w-16 h-16 mx-auto flex items-center justify-center bg-emerald-100 rounded-full mb-4">
            {icon}
        </div>
        <h3 className="text-lg font-bold text-stone-800 mb-2">{title}</h3>
        <p className="text-stone-600">{description}</p>
    </div>
);

const StartAnalysisPage = () => {
    const { t } = useTranslation();
    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
           <header className="text-center mb-12">
    <h1 className="text-4xl font-bold leading-tight text-stone-900">
        {t('startAnalysisPage.title')}
    </h1>
    <p className="mt-2 text-lg text-stone-600">
        {t('startAnalysisPage.subtitle')}
    </p>
</header>

            <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
    <TipCard
        icon={<SideProfileIcon />}
        title={t('startAnalysisPage.tip1Title')}
        description={t('startAnalysisPage.tip1Description')}
    />
    <TipCard
        icon={<LightIcon />}
        title={t('startAnalysisPage.tip2Title')}
        description={t('startAnalysisPage.tip2Description')}
    />
    <TipCard
        icon={<GroundIcon />}
        title={t('startAnalysisPage.tip3Title')}
        description={t('startAnalysisPage.tip3Description')}
    />
</section>

            <div className="text-center">
                <button
    onClick={() => window.location.hash = '/analyze'}
    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-300"
>
    {t('startAnalysisPage.readyButton')}
</button>
            </div>
        </div>
    );
};

export default StartAnalysisPage;