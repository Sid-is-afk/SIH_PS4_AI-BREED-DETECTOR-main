import { useTranslation, Trans } from 'react-i18next'; // <-- ADD <Trans> HERE
import React from 'react';
import { BackIcon } from '../components/Icons';

// The old, hardcoded 'guideContent' object is no longer needed here.
// All the text has been moved to your translation.json files.

const GuideDetailPage = ({ topic }) => {
    const { t } = useTranslation();

    // This new object, placed INSIDE the component, maps topics to their translation keys.
    const guideContent = {
        housing: {
            titleKey: 'guideTopics.housingTitle',
            contentComponent: (
                <>
                    <p className="lead"><Trans i18nKey="guideContent.housing.lead" components={{ strong: <strong /> }} /></p>
                    <h3 className="section-title">{t('guideContent.housing.section1Title')}</h3>
                    <ul className="list">
                        <li><Trans i18nKey="guideContent.housing.section1Item1" components={{ strong: <strong /> }} /></li>
                        <li><Trans i18nKey="guideContent.housing.section1Item2" components={{ strong: <strong /> }} /></li>
                        <li><Trans i18nKey="guideContent.housing.section1Item3" components={{ strong: <strong /> }} /></li>
                        <li><Trans i18nKey="guideContent.housing.section1Item4" components={{ strong: <strong /> }} /></li>
                        <li><Trans i18nKey="guideContent.housing.section1Item5" components={{ strong: <strong /> }} /></li>
                    </ul>
                    <h3 className="section-title">{t('guideContent.housing.section2Title')}</h3>
                    <ul className="list">
                        <li><Trans i18nKey="guideContent.housing.section2Item1" components={{ strong: <strong /> }} /></li>
                        <li><Trans i18nKey="guideContent.housing.section2Item2" components={{ strong: <strong /> }} /></li>
                    </ul>
                </>
            )
        },
        breeds: {
            titleKey: 'guideTopics.breedsTitle',
            contentComponent: (
                <>
                    <p className="lead"><Trans i18nKey="guideContent.breeds.lead" /></p>
                    <h3 className="section-title">{t('guideContent.breeds.section1Title')}</h3>
                    <ul className="list">
                        <li><Trans i18nKey="guideContent.breeds.section1Item1" components={{ strong: <strong /> }} /></li>
                        <li><Trans i18nKey="guideContent.breeds.section1Item2" components={{ strong: <strong /> }} /></li>
                        <li><Trans i18nKey="guideContent.breeds.section1Item3" components={{ strong: <strong /> }} /></li>
                        <li><Trans i18nKey="guideContent.breeds.section1Item4" components={{ strong: <strong /> }} /></li>
                    </ul>
                    <h3 className="section-title">{t('guideContent.breeds.section2Title')}</h3>
                    <p><Trans i18nKey="guideContent.breeds.section2Lead" /></p>
                    <ul className="list">
                        <li><Trans i18nKey="guideContent.breeds.section2Item1" components={{ strong: <strong /> }} /></li>
                        <li><Trans i18nKey="guideContent.breeds.section2Item2" components={{ strong: <strong /> }} /></li>
                        <li><Trans i18nKey="guideContent.breeds.section2Item3" components={{ strong: <strong /> }} /></li>
                    </ul>
                </>
            )
        },
        calving: {
            titleKey: 'guideTopics.calvingTitle',
            contentComponent: (
                <>
                    <p className="lead"><Trans i18nKey="guideContent.calving.lead" /></p>
                    <h3 className="section-title">{t('guideContent.calving.section1Title')}</h3>
                    <ul className="list">
                        <li><Trans i18nKey="guideContent.calving.section1Item1" components={{ strong: <strong /> }} /></li>
                        <li><Trans i18nKey="guideContent.calving.section1Item2" components={{ strong: <strong /> }} /></li>
                        <li><Trans i18nKey="guideContent.calving.section1Item3" components={{ strong: <strong /> }} /></li>
                    </ul>
                    <h3 className="section-title">{t('guideContent.calving.section2Title')}</h3>
                    <ul className="list">
                        <li><Trans i18nKey="guideContent.calving.section2Item1" components={{ strong: <strong /> }} /></li>
                        <li><Trans i18nKey="guideContent.calving.section2Item2" components={{ strong: <strong /> }} /></li>
                        <li><Trans i18nKey="guideContent.calving.section2Item3" components={{ strong: <strong /> }} /></li>
                    </ul>
                </>
            )
        },
        nutrition: {
            titleKey: 'guideTopics.nutritionTitle',
            contentComponent: (
                 <>
                    <p className="lead"><Trans i18nKey="guideContent.nutrition.lead" /></p>
                    <h3 className="section-title">{t('guideContent.nutrition.section1Title')}</h3>
                    <ul className="list">
                        <li><Trans i18nKey="guideContent.nutrition.section1Item1" components={{ strong: <strong /> }} /></li>
                        <li><Trans i18nKey="guideContent.nutrition.section1Item2" components={{ strong: <strong /> }} /></li>
                        <li><Trans i18nKey="guideContent.nutrition.section1Item3" components={{ strong: <strong /> }} /></li>
                        <li><Trans i18nKey="guideContent.nutrition.section1Item4" components={{ strong: <strong /> }} /></li>
                    </ul>
                    <h3 className="section-title">{t('guideContent.nutrition.section2Title')}</h3>
                    <ul className="list">
                        <li><Trans i18nKey="guideContent.nutrition.section2Item1" components={{ strong: <strong /> }} /></li>
                        <li><Trans i18nKey="guideContent.nutrition.section2Item2" components={{ strong: <strong /> }} /></li>
                        <li><Trans i18nKey="guideContent.nutrition.section2Item3" components={{ strong: <strong /> }} /></li>
                    </ul>
                </>
            )
        },
        health: {
            titleKey: 'guideTopics.healthTitle',
            contentComponent: (
                <>
                    <p className="lead"><Trans i18nKey="guideContent.health.lead" /></p>
                    <h3 className="section-title">{t('guideContent.health.section1Title')}</h3>
                    <ul className="list">
                        <li><Trans i18nKey="guideContent.health.section1Item1" components={{ strong: <strong /> }} /></li>
                        <li><Trans i18nKey="guideContent.health.section1Item2" components={{ strong: <strong /> }} /></li>
                        <li><Trans i18nKey="guideContent.health.section1Item3" components={{ strong: <strong /> }} /></li>
                    </ul>
                    <h3 className="section-title">{t('guideContent.health.section2Title')}</h3>
                    <ul className="list">
                        <li><Trans i18nKey="guideContent.health.section2Item1" components={{ strong: <strong /> }} /></li>
                        <li><Trans i18nKey="guideContent.health.section2Item2" components={{ strong: <strong /> }} /></li>
                        <li><Trans i18nKey="guideContent.health.section2Item3" components={{ strong: <strong /> }} /></li>
                        <li><Trans i18nKey="guideContent.health.section2Item4" components={{ strong: <strong /> }} /></li>
                    </ul>
                </>
            )
        },
    };

    const defaultContent = {
        titleKey: 'guidePage.topicNotFound',
        contentComponent: <p>{t('guidePage.topicNotFoundDesc')}</p>
    };

    const { titleKey, contentComponent } = guideContent[topic] || defaultContent;

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <style>{`
                .prose-custom .lead { font-size: 1.25rem; color: #57534e; margin-bottom: 1.5rem; }
                .prose-custom .section-title { font-size: 1.5rem; font-weight: 700; color: #059669; margin-top: 2rem; margin-bottom: 1rem; border-bottom: 2px solid #d1fae5; padding-bottom: 0.5rem; }
                .prose-custom .list { list-style-type: disc; padding-left: 1.5rem; display: flex; flex-direction: column; gap: 0.75rem; }
            `}</style>
             <div className="mb-8">
                <button onClick={() => window.location.hash = '/guide'} className="inline-flex items-center text-emerald-600 hover:underline bg-transparent border-none cursor-pointer">
                    <BackIcon />
                    {t('guidePage.backToGuide')}
                </button>
            </div>
            <article className="bg-gradient-to-br from-emerald-50 via-white to-blue-50 animate-bounce-in-top  rounded-lg shadow-lg p-8 sm:p-12 prose-custom">
                <h1 className="text-4xl font-bold text-stone-900 mb-6">{t(titleKey)}</h1>
                <div className="text-stone-700 text-lg leading-relaxed">
                    {contentComponent}
                </div>
            </article>
        </div>
    )
};

export default GuideDetailPage;