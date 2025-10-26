/**
 * i18n (Internationalization) Module
 * Manages multi-language support for the application
 */

class I18n {
    constructor() {
        this.currentLang = 'en';
        this.translations = {};
        this.supportedLanguages = ['en', 'ja', 'ko'];
        this.ready = false;
    }

    /**
     * Initialize i18n system
     */
    async init() {
        if (this.ready) return; // Already initialized
        
        // Load translations
        await this.loadTranslations();
        
        // Determine initial language from URL parameter or localStorage
        const urlParams = new URLSearchParams(window.location.search);
        const urlLang = urlParams.get('lang');
        const savedLang = localStorage.getItem('preferredLanguage');
        
        if (urlLang && this.supportedLanguages.includes(urlLang)) {
            this.currentLang = urlLang;
        } else if (savedLang && this.supportedLanguages.includes(savedLang)) {
            this.currentLang = savedLang;
        } else {
            this.currentLang = 'en'; // Default
        }
        
        this.ready = true;
        
        // Apply translations
        this.applyTranslations();
        
        console.log(`🌍 Language initialized: ${this.currentLang}`);
    }

    /**
     * Load translation data from JSON
     */
    async loadTranslations() {
        try {
            const response = await fetch('locales/translations.json');
            this.translations = await response.json();
        } catch (error) {
            console.error('Failed to load translations:', error);
            // Fallback to empty translations
            this.translations = { en: {}, ja: {}, ko: {} };
        }
    }

    /**
     * Get translated text for a key
     */
    t(key) {
        const keys = key.split('.');
        let value = this.translations[this.currentLang];
        
        for (const k of keys) {
            if (value && value[k] !== undefined) {
                value = value[k];
            } else {
                console.warn(`Translation missing: ${key} (${this.currentLang})`);
                return key;
            }
        }
        
        return value;
    }

    /**
     * Change current language
     */
    setLanguage(lang) {
        if (!this.supportedLanguages.includes(lang)) {
            console.error(`Unsupported language: ${lang}`);
            return;
        }
        
        this.currentLang = lang;
        localStorage.setItem('preferredLanguage', lang);
        this.applyTranslations();
        
        console.log(`🌍 Language changed to: ${lang}`);
    }

    /**
     * Apply translations to DOM elements with data-i18n attribute
     */
    applyTranslations() {
        // Translate elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach(element => {
            const key = element.getAttribute('data-i18n');
            element.textContent = this.t(key);
        });
        
        // Translate placeholder attributes
        document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
            const key = element.getAttribute('data-i18n-placeholder');
            element.placeholder = this.t(key);
        });
        
        // Translate title attributes
        document.querySelectorAll('[data-i18n-title]').forEach(element => {
            const key = element.getAttribute('data-i18n-title');
            element.title = this.t(key);
        });
    }

    /**
     * Get current language
     */
    getCurrentLanguage() {
        return this.currentLang;
    }

    /**
     * Get all supported languages
     */
    getSupportedLanguages() {
        return this.supportedLanguages;
    }
}

// Create global i18n instance
window.i18n = new I18n();
