<template>
  <div class="mt-3 pt-3 container">
    <div v-if="isLoggedIn">
      <div v-if="status === 'loading'" class="heading">
        <h1>
          {{ $t("loadingInvitation") }}
        </h1>
      </div>
      <div v-else-if="status === 'error'">
        {{ $t("networkError") }}
        <router-link to="/profile">
          {{ $t("home") }}
        </router-link>
      </div>
      <h1 v-else-if="status === 'declined'" class="invitationMessage">
        {{ message }}
      </h1>
      <BounceLoader v-else />
    </div>
    <div v-else class="heading">
      {{ $t("please") }}
      <router-link to="/login">
        {{ $t("login") }}
      </router-link>
      {{ $t("or") }}
      <router-link to="/signup">
        {{ $t("signup") }}
      </router-link>
      {{ $t("toDeclineThisInvitation") }}
    </div>
  </div>
</template>

<style>
.invitationBody * {
  text-align: left;
  font-size: 16px;
}

.invitationMessage {
  font-size: 25px;
  text-align: center;
  margin-top: 20px;
}

.invitationBody {
  text-align: left;
}
</style>

<script>
import api from '../../lib/api/';
import BounceLoader from '../BounceLoader';
import ButtonGroup from './ButtonGroup';

export default {
  name: 'DeclineInvitation',
  props: {
    user: {
      type: Object,
    },
    isLoggedIn: {
      type: Boolean,
    },
    apiHost: {
      type: String,
    },
  },
  components: {
    ButtonGroup,
    BounceLoader,
  },
  data() {
    return {
      status: 'loading',
      invitationText: '',
      message: '',
    };
  },
  watch: {
    isLoggedIn() {
      if (this.isLoggedIn) {
        this.declineInvitation();
      }
    },
  },
  mounted() {
    if (this.isLoggedIn) {
      this.declineInvitation();
    } else {
      const route = `invitation/${this.$route.params.invitationId}/decline`;
      this.$store.commit('setRedirect', route);
    }
  },
  methods: {
    declineInvitation() {
      this.status = 'loading';
      api
        .declineInvitation({
          apiHost: this.apiHost,
          token: this.user.authToken.token,
          invitationId: this.$route.params.invitationId,
        })
        .then((message) => {
          this.status = 'declined';
          this.message = message.data.body;

          const landFormatted = (message.data.lang === 'fr' ? 'fr_FR' : 'en_US');
          this.$i18n.locale = landFormatted;
          this.$store.commit('setCurrentLanguage', landFormatted);
        })
        .catch(() => {
          this.status = 'error';
        });
    },
  },
};
</script>
