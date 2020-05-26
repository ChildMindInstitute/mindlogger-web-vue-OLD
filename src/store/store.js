import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';
import _ from 'lodash';

Vue.use(Vuex);

// const state = {
//   applets: [],
//   appletResponses: {},
//   branchingCache: {},
//   activities: [], // TODO: remove this and fix a bug in Survey
// };

// eslint-disable-next-line
const getInitialState = () => {
  return {
    userEmail: '',
    applets: [],
    appletResponses: {},
    branchingCache: {},
    activities: {},
    redirect: 'Profile',
  };
};

const state = getInitialState();

const getters = {
  storeContext() {
    return [];
  },
};

const mutations = {
  setActivities(state, data) {
    state.activities = data;
  },
  setApplets(state, data) {
    state.applets = data;
  },
  setUserEmail(state, email) {
    state.userEmail = email;
  },
  setAppletResponses(state, { appletURI, data }) {
    state.appletResponses[appletURI] = data;
    // eslint-disable-next-line
    console.log('committing applet responses', state.appletResponses[appletURI]);
  },
  setBranchingCache(state, { key, data }) {
    state.branchingCache[key] = data;
  },
  setRedirect(state, data) {
    state.redirect = data;
  },
  reinitializeState(state) {
    const newState = getInitialState();
    _.map(state, (val, key) => {
      state[key] = newState[key];
    });
  },
};

const actions = {
  /**
   * TODO: remove below and fix Survey component
   */
  updateListShow() {
  },
};

export default new Vuex.Store({
  state,
  getters,
  mutations,
  actions,
  plugins: [createPersistedState()],
});
