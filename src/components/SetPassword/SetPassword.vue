<template>
  <div class="mt-3 pt-3 container">
    <div v-if="isValidToken">
      <!-- top thing with avatar and username's profile -->
      <div class="heading">
        <h1>
          <b-img
            v-bind="mainProps"
            rounded="circle"
            alt="Circle image"
            class="mr-3"
          ></b-img>
        </h1>
      </div>

      <hr />

      <!-- change your password -->
      <div class="changePassword mt-3 pt-3 mb-3 pb-3">
        <h3>{{ $t("changePassword") }}</h3>
        <p class="lead">
          {{ $t("complexPassword") }}
          <br />
        </p>

        <!-- change password form -->
        <b-form @submit="onSubmit">
          <b-row class="my-1">
            <b-col sm="3">
              <label for="input-valid">{{ $t("newPassword") }}:</label>
            </b-col>
            <b-col sm="9">
              <b-form-input
                v-model="newPassword.original"
                type="password"
                id="input-valid"
                :placeholder="$t('newPassword')"
              >
              </b-form-input>
            </b-col>
          </b-row>

          <b-row class="my-1">
            <b-col sm="3">
              <label for="input-invalid">{{ $t("confirmPassword") }}:</label>
            </b-col>
            <b-col sm="9">
              <b-form-input
                id="input-invalid"
                v-model="newPassword.repeat"
                type="password"
                :state="validatePass"
                :placeholder="$t('confirmPassword')"
              >
              </b-form-input>
            </b-col>
          </b-row>
          <b-row class="my-1 mt-3">
            <b-col>
              <b-button
                type="submit"
                :disabled="
                  !validatePass || !newPassword.original
                "
                variant="success"
              >
                {{ $t("submit") }}
              </b-button>
            </b-col>
          </b-row>
        </b-form>
      </div>

      <div v-if="status === 'fail'">{{ $t("resetLinkExpired") }}</div>
    </div>
    <div v-else>
      {{ $t("please") }}
      <router-link to="/login"> {{ $t("login") }} </router-link>
      {{ $t("toSeeThePage") }}
    </div>
  </div>
</template>

<script>
import _ from "lodash";
import api from "../../lib/api/";

export default {
  name: "SetPassword",
  props: {
    apiHost: {
      type: String
    },
    loginLink: {
      type: Object,
      default() {
        return {};
      }
    },
  },
  data() {
    return {
      mainProps: {
        blank: true,
        blankColor: "#777",
        width: 75,
        height: 75,
        class: "m1"
      },
      imgProps: { blank: false, width: 50, height: 50, class: "m1" },
      // appletsFromServer: [],
      status: "loading",
      newPassword: {
        original: null,
        repeat: null
      },
      isValidToken: false,
      token: null
    };
  },
  beforeMount() {
    api.checkTemporaryPassword({
      apiHost: this.apiHost,
      userId: this.$route.params.userId,
      token: this.$route.params.temporaryToken
    }).then(resp => {
      this.token = resp.data.authToken.token 
      this.isValidToken = true;
    }).catch(() => {
      this.isValidToken = false;
    })
  },
  computed: {
    validatePass() {
      if (
        this.newPassword.original === null &&
        this.newPassword.repeat === null
      ) {
        return null;
      }
      return this.newPassword.original === this.newPassword.repeat;
    },
  },
  methods: {
    onSubmit(e) {
      e.preventDefault();
      api
        .updatePassword({
          apiHost: this.apiHost,
          oldPassword: this.$route.params.temporaryToken,
          token: this.token,
          newPassword: this.newPassword.original
        })
        .then(resp => {
          this.$router.push('/login');
        }).catch(() => {
          console.log('updating status to failed');
          this.status = 'fail';
        })
    },
  }
};
</script>
