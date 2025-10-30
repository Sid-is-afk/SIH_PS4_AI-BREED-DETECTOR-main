import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { getLivestockValuation } from '../services/geminiService';
import Spinner from '../components/Spinner';
import { ValuatorIcon } from '../components/Icons';

const ValuationSkeleton = () => (
    <div className="text-center w-full animate-pulse">
        <div className="h-6 bg-stone-300 rounded-md w-3/4 mx-auto mb-4"></div>
        <div className="h-12 bg-stone-400 rounded-md w-1/2 mx-auto my-6"></div>
        <div className="mt-6 text-left">
            <div className="h-5 bg-stone-300 rounded-md w-1/3 mb-4"></div>
            <div className="space-y-2">
                <div className="h-4 bg-stone-200 rounded-md w-full"></div>
                <div className="h-4 bg-stone-200 rounded-md w-5/6"></div>
                <div className="h-4 bg-stone-200 rounded-md w-3/4"></div>
            </div>
        </div>
    </div>
);

const ValuatorPage = () => {
    const { t } = useTranslation();
    const [inputs, setInputs] = useState({ breed: '', age: '', milkYield: '', health: 'Good', location: '' });
    const [valuation, setValuation] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setValuation(null);
        try {
            const result = await getLivestockValuation(inputs);
            setValuation(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleReset = () => {
        setInputs({ breed: '', age: '', milkYield: '', health: 'Good', location: '' });
        setValuation(null);
        setError(null);
    };

    const isFormIncomplete = !inputs.breed || !inputs.age || !inputs.milkYield || !inputs.location;

    // Helper to format the price range from the AI's response
    const formatPriceRange = (valueObject) => {
        if (!valueObject || !valueObject.priceRange) return "N/A";
        return `₹${valueObject.priceRange.min} - ₹${valueObject.priceRange.max}`;
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <header className="text-center mb-12">
                <ValuatorIcon className="mx-auto h-16 w-16 text-emerald-600" />
                <h1 className="text-4xl font-bold leading-tight text-stone-900 mt-4">
                    {t('valuatorPage.title')}
                </h1>
                <p className="mt-2 text-lg text-stone-600">
                    {t('valuatorPage.subtitle')}
                </p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
                <div className="bg-white p-8 rounded-lg shadow-lg border border-stone-200">
                    {valuation && !isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full text-center">
                            <h2 className="text-2xl font-bold text-stone-800 mb-4">{t('valuatorPage.resetTitle')}</h2>
                            <p className="text-stone-600 mb-8">{t('valuatorPage.resetSubtitle')}</p>
                            <button 
                                onClick={handleReset}
                                className="w-full inline-flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700"
                            >
                                {t('valuatorPage.resetBtn')}
                            </button>
                        </div>
                    ) : (
                        <>
                            <h2 className="text-2xl font-bold text-stone-800 mb-6">{t('valuatorPage.formTitle')}</h2>
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="breed" className="block text-sm font-medium text-stone-700">{t('valuatorPage.breedLabel')}</label>
                                    <input type="text" name="breed" id="breed" value={inputs.breed} onChange={handleInputChange} required className="mt-1 block w-full px-4 py-3 bg-stone-100 border border-stone-200 rounded-md shadow-sm" placeholder={t('valuatorPage.breedPlaceholder')} />
                                </div>
                                <div>
                                    <label htmlFor="age" className="block text-sm font-medium text-stone-700">{t('valuatorPage.ageLabel')}</label>
                                    <input type="number" name="age" id="age" value={inputs.age} onChange={handleInputChange} required min="0" step="0.5" className="mt-1 block w-full px-4 py-3 bg-stone-100 border border-stone-200 rounded-md shadow-sm" placeholder={t('valuatorPage.agePlaceholder')} />
                                </div>
                                <div>
                                    <label htmlFor="milkYield" className="block text-sm font-medium text-stone-700">{t('valuatorPage.milkYieldLabel')}</label>
                                    <input type="number" name="milkYield" id="milkYield" value={inputs.milkYield} onChange={handleInputChange} required min="0" className="mt-1 block w-full px-4 py-3 bg-stone-100 border border-stone-200 rounded-md shadow-sm" placeholder={t('valuatorPage.milkYieldPlaceholder')} />
                                </div>
                                <div>
                                    <label htmlFor="health" className="block text-sm font-medium text-stone-700">{t('valuatorPage.healthLabel')}</label>
                                    <select name="health" id="health" value={inputs.health} onChange={handleInputChange} className="mt-1 block w-full px-4 py-3 bg-stone-100 border border-stone-200 rounded-md shadow-sm">
                                        <option value="Good">{t('valuatorPage.healthGood')}</option>
                                        <option value="Fair">{t('valuatorPage.healthFair')}</option>
                                        <option value="Needs Attention">{t('valuatorPage.healthNeedsAttention')}</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="location" className="block text-sm font-medium text-stone-700">{t('valuatorPage.locationLabel')}</label>
                                    <input type="text" name="location" id="location" value={inputs.location} onChange={handleInputChange} required className="mt-1 block w-full px-4 py-3 bg-stone-100 border border-stone-200 rounded-md shadow-sm" placeholder={t('valuatorPage.locationPlaceholder')} />
                                </div>
                                <div>
                                    <button type="submit" disabled={isLoading || isFormIncomplete} className="w-full inline-flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 disabled:cursor-not-allowed">
                                        {isLoading ? <Spinner /> : t('valuatorPage.calculateBtn')}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
                </div>

                <div className="flex items-center justify-center bg-stone-100 p-8 rounded-lg border-2 border-dashed border-stone-300 min-h-[300px]">
                    {isLoading && ( <ValuationSkeleton /> )}
                    {error && ( <div className="text-center text-red-600"> <p><strong>Error</strong></p><p>{error}</p></div> )}
                    {valuation && !isLoading && (
                        <div className="text-center animate-fade-in w-full">
                            <h3 className="text-lg font-medium text-stone-600">{t('valuatorPage.resultTitle')}</h3>
                            <p className="text-4xl lg:text-5xl font-bold text-emerald-600 my-4">{formatPriceRange(valuation.fairMarketValue)}</p>
                            {/* <div className="mt-6 text-left">
                                <h4 className="font-semibold text-stone-800 mb-2">{t('valuatorPage.factorsTitle')}</h4>
                                <ul className="list-disc list-inside text-stone-700 space-y-1">
                                    {(valuation.keyValuationFactors || []).map((factor, i) => <li key={i}>{factor}</li>)}
                                </ul>
                            </div> */}
                        </div>
                    )}
                    {!valuation && !isLoading && !error && ( <div className="text-center text-stone-500"> <p>Give the details of your cow/cattle to get AI-powered valuation.</p></div> )}
                </div>
            </div>
        </div>
    );
};

export default ValuatorPage;