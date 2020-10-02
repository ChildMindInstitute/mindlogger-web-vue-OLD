<template>
  <div class="mt-3 pt-3 container">
    <div v-if="isLoggedIn">
      <div v-if="status === 'loading'" class="heading">
        <h1>
          Loading Invitation
        </h1>
      </div>
      <div v-else-if="status === 'error'">
        Network Error. Return
        <router-link to="/profile">
          {{ $t("home") }}
        </router-link>
      </div>
      <h1 v-else-if="status === 'declined'">
        Invitation Declined
      </h1>
      <BounceLoader v-else />
    </div>
    <div v-else class="heading">
      Please
      <router-link to="/login">
        {{ $t("login") }}
      </router-link>
      or
      <router-link to="/signup">
        {{ $t("signup") }}
      </router-link>
      to decline this invitation!
    </div>
  </div>
</template>

<style>
.invitationBody * {
  text-align: left;
  font-size: 16px;
}

.invitationBody {
  text-align: left;
}
</style>

<script>
import api from "../../lib/api/";
import BounceLoader from "../BounceLoader";
import ButtonGroup from "./ButtonGroup";

export default {
  name: "DeclineInvitation",
  props: {
    user: {
      type: Object
    },
    isLoggedIn: {
      type: Boolean
    },
    apiHost: {
      type: String
    }
  },
  components: {
    ButtonGroup,
    BounceLoader
  },
  data() {
    return {
      status: "loading",
      invitationText: ""
    };
  },
  watch: {
    isLoggedIn() {
      if (this.isLoggedIn) {
        this.declineInvitation();
      }
    }
  },
  mounted() {
    if (this.isLoggedIn) {
      this.declineInvitation();
    } else {
      const route = `invitation/${this.$route.params.invitationId}/decline`;
      this.$store.commit("setRedirect", route);
    }
  },
  methods: {
    declineInvitation() {
      this.status = "loading";
      api
        .declineInvitation({
          apiHost: this.apiHost,
          token: this.user.authToken.token,
          invitationId: this.$route.params.invitationId
        })
        .then(() => {
          this.status = "declined";
        })
        .catch(() => {
          this.status = "error";
        });
    }
  }
};
</script>
