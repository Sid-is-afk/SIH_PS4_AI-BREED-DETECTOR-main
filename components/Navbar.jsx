import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

const languages = [
    { code: 'en', lang: 'English' },
    { code: 'hi', lang: 'हिन्दी (Hindi)' },
    { code: 'or', lang: 'ଓଡ଼ିଆ (Odia)' },
    { code: 'bn', lang: 'বাংলা (Bangla)' },
    { code: 'ta', lang: 'தமிழ் (Tamil)' },
    { code: 'te', lang: 'తెలుగు (Telugu)' },
    { code: 'mr', lang: 'मराठी (Marathi)' },
    { code: 'pa', lang: 'ਪੰਜਾਬੀ (Punjabi)' },
    { code: 'kn', lang: 'ಕನ್ನಡ (Kannada)' },
    { code: 'ml', lang: 'മലയാളം (Malayalam)' },
    { code: 'gu', lang: 'ગુજરાતી (Gujarati)' }
];

// This is now a more robust, reusable component
const LanguageSelector = ({ isOpen, setIsOpen, changeLanguage, isMobile = false }) => {
    const { t, i18n } = useTranslation();
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setIsOpen]);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(prev => !prev)}
                className={isMobile ? "w-full flex items-center justify-between px-4 py-3 text-base font-medium text-stone-700 hover:bg-emerald-50 rounded-lg" : "flex items-center p-2 rounded-lg hover:bg-stone-50 transition-colors"}
            >
                <div className="flex items-center">
                    <svg className="w-5 h-5 text-stone-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m4 13l4-4M19 21l-4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                    <span className="ml-2 text-sm font-medium text-stone-700">{isMobile ? t('navbar.language') : languages.find(l => l.code === i18n.language)?.lang.split(' ')[0]}</span>
                </div>
                <svg className={`h-5 w-5 text-stone-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
            </button>
            {isOpen && (
                <div className={`origin-top-right absolute z-20 ${isMobile ? 'bottom-full mb-2 left-0' : 'right-0 mt-2'} w-56 rounded-xl shadow-xl py-2 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none border border-stone-100`}>
                    {languages.map((lng) => (
                        <button key={lng.code} onClick={() => changeLanguage(lng.code)} className={`flex items-center w-full px-4 py-3 text-sm text-stone-700 hover:bg-emerald-50 transition-colors ${i18n.language === lng.code ? 'font-bold text-emerald-600' : ''}`}>
                            {lng.lang}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

const Navbar = () => {
    const { t, i18n } = useTranslation();
    const { user, logout } = useAuth();

    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    // Create separate state for each language dropdown
    const [desktopLangOpen, setDesktopLangOpen] = useState(false);
    const [mobileLangOpen, setMobileLangOpen] = useState(false);

    const dropdownRef = useRef(null);
    const mobileMenuRef = useRef(null);
    const [activeHash, setActiveHash] = useState(window.location.hash);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setDropdownOpen(false);
            if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) setMobileMenuOpen(false);
        };
        const handleHashChange = () => setActiveHash(window.location.hash);
        document.addEventListener("mousedown", handleClickOutside);
        window.addEventListener('hashchange', handleHashChange);
        handleHashChange();
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener('hashchange', handleHashChange);
        };
    }, []);

    const navItems = [
        { name: t('navbar.dashboard'), hash: '/dashboard' },
        { name: t('navbar.valuator'), hash: '/valuator' },
        { name: t('navbar.marketplace'), hash: '/marketplace' },
        { name: t('navbar.guide'), hash: '/guide' },
        { name: t('navbar.findVet'), hash: '/find-vet' }
    ];
    
    const linkButtonClassName = "bg-transparent border-none cursor-pointer text-stone-700 hover:text-emerald-600 hover:bg-emerald-50 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center whitespace-nowrap";
    const mobileLinkButtonClassName = "w-full text-left flex items-center px-4 py-3 text-base font-medium text-stone-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-lg transition-colors duration-200";

    const handleNavigation = (hash) => {
        window.location.hash = hash;
        setActiveHash(`#${hash}`);
        setDropdownOpen(false);
        setMobileMenuOpen(false);
    };
    
    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng);
        setDesktopLangOpen(false);
        setMobileLangOpen(false);
        setMobileMenuOpen(false);
    };

    return (
        <header className="bg-white shadow-sm border-b border-stone-100 sticky top-0 z-50">
            <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <a href={user ? "#/dashboard" : "#/"} className="flex items-center space-x-2"><img src="/logo.png" className="h-10 w-10" alt="PashuDrishti Logo" /><div className="font-bold text-xl text-emerald-700 hidden sm:block">PashuDrishti</div></a>
                    <div className="hidden lg:flex items-center space-x-1">
                        {user ? (
                            <>
                                {navItems.map((item) => {
                                    const isActive = activeHash === `#${item.hash}`;
                                    return (<button key={item.hash} onClick={() => handleNavigation(item.hash)} className={`${linkButtonClassName} ${isActive ? 'bg-emerald-50 text-emerald-600 font-semibold' : ''}`}>{item.name}</button>);
                                })}
                                <div className="ml-4 border-l pl-2 border-stone-200"><LanguageSelector isOpen={desktopLangOpen} setIsOpen={setDesktopLangOpen} changeLanguage={changeLanguage} /></div>
                                <div className="relative ml-2" ref={dropdownRef}>
                                    <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center space-x-3 p-2 rounded-full hover:bg-stone-100">
                                        <div className="w-9 h-9 bg-emerald-100 rounded-full flex items-center justify-center"><span className="text-emerald-700 font-semibold text-md">{user.name ? user.name.charAt(0).toUpperCase() : 'U'}</span></div>
                                        <div className="text-left hidden md:block"><p className="text-stone-700 text-sm font-medium truncate max-w-[120px]">{user.name}</p></div>
                                    </button>
                                    {dropdownOpen && (
                                        <div className="origin-top-right absolute right-0 mt-2 w-56 rounded-xl shadow-xl py-2 bg-white ring-1 ring-black ring-opacity-5">
                                            <div className="px-4 py-3 border-b border-stone-100"><p className="text-sm font-medium text-stone-700 truncate">{user.name}</p><p className="text-xs text-stone-500">{t('navbar.farmer')}</p></div>
                                            <button onClick={() => handleNavigation('/profile')} className="flex items-center w-full px-4 py-3 text-sm text-stone-700 hover:bg-stone-50">{t('navbar.profile')}</button>
                                            <button onClick={() => { logout(); setDropdownOpen(false); }} className="flex items-center w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50">{t('navbar.logout')}</button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <LanguageSelector isOpen={desktopLangOpen} setIsOpen={setDesktopLangOpen} changeLanguage={changeLanguage} />
                                <button onClick={() => handleNavigation('/login')} className="px-5 py-2 border border-emerald-600 text-emerald-600 rounded-lg font-medium hover:bg-emerald-50">{t('navbar.login')}</button>
                                <button onClick={() => handleNavigation('/signup')} className="px-5 py-2 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 shadow-sm">{t('navbar.getStarted')}</button>
                            </div>
                        )}
                    </div>
                    <div className="lg:hidden">
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-stone-600">
                            {mobileMenuOpen ? <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> : <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>}
                        </button>
                    </div>
                </div>
                {mobileMenuOpen && (
                    <div className="lg:hidden" ref={mobileMenuRef}>
                        <div className="pt-2 pb-4 space-y-1">
                            {user ? (
                                <>
                                    <div className="px-4 py-3 mb-2 border-b border-stone-100"><p className="font-medium text-stone-800">{user.name}</p><p className="text-sm text-stone-500">{t('navbar.farmer')}</p></div>
                                    {navItems.map((item) => (<button key={item.hash} onClick={() => handleNavigation(item.hash)} className={mobileLinkButtonClassName}>{item.name}</button>))}
                                    <button onClick={() => handleNavigation('/profile')} className={mobileLinkButtonClassName}>{t('navbar.profile')}</button>
                                    <div className="border-t pt-2 mt-2 border-stone-100"><LanguageSelector isOpen={mobileLangOpen} setIsOpen={setMobileLangOpen} changeLanguage={changeLanguage} isMobile={true} /></div>
                                    <button onClick={() => { logout(); setMobileMenuOpen(false); }} className="w-full text-left flex items-center px-4 py-3 text-base font-medium text-red-600 hover:bg-red-50 rounded-lg">{t('navbar.logout')}</button>
                                </>
                            ) : (
                                <div className="space-y-2 pt-4 px-2">
                                    <button onClick={() => handleNavigation('/login')} className="w-full flex items-center justify-center px-6 py-3 border border-emerald-600 text-emerald-600 rounded-lg font-medium hover:bg-emerald-50">{t('navbar.login')}</button>
                                    <button onClick={() => handleNavigation('/signup')} className="w-full flex items-center justify-center px-6 py-3 bg-emerald-600 text-white rounded-lg font-medium hover:bg-emerald-700 shadow-md">{t('navbar.getStarted')}</button>
                                    <div className="pt-4 border-t border-stone-100"><LanguageSelector isOpen={mobileLangOpen} setIsOpen={setMobileLangOpen} changeLanguage={changeLanguage} isMobile={true} /></div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
};

export default Navbar;