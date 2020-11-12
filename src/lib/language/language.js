/* eslint-disable */
// Third-party libraries.
import Vue from 'vue';
import VueI18n from 'vue-i18n';
import _ from 'lodash';

// Local.
import store from '../../store/store';

// Translations.
import en_US from './locales/en_US';
import fr_FR from './locales/fr_FR';


Vue.use(VueI18n);

/**
 * Detects the browser langauge.
 *
 * @returns {string} the current browser language.
 */
const getBrowserLanguage = () => {
  const language = navigator.language || navigator.userLanguage;

  if (language.startsWith('fr')) {
    return 'fr_FR';
  }

  return 'en_US';
};

// Detect language in the URL.
const queryString = window.location.hash.split('?').pop();
const urlParams = new URLSearchParams(queryString);
const urlLanguage = urlParams.get('lang');


// new instance
export default new VueI18n({
  locale: (
    urlLanguage ||
    _.get(store, 'state.currentLanguage') ||
    getBrowserLanguage()
  ),
  lazy: true,
  messages: {
    en_US,
    fr_FR,
  },
});
