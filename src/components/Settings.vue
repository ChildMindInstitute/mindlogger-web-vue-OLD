<template>
  <div class="mt-3 pt-3 container">
    <div v-if="isLoggedIn">
      <!-- top thing with avatar and username's profile -->
      <div class="heading">
        <h1>
          <b-img
            v-bind="mainProps"
            rounded="circle"
            alt="Circle image"
            class="mr-3"
          ></b-img>
          {{ user.user.firstName }}'s {{ $t("settings") }}
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
              <label for="input-valid">{{ $t("oldPassword") }}:</label>
            </b-col>
            <b-col sm="9">
              <b-form-input
                v-model="oldPassword"
                type="password"
                id="input-valid"
                :placeholder="$t('oldPassword')"
              >
              </b-form-input>
            </b-col>
          </b-row>

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
                  !validatePass || !newPassword.original || !oldPassword
                "
                variant="success"
              >
                {{ $t("submit") }}
              </b-button>
            </b-col>
          </b-row>
        </b-form>
      </div>
      <b-alert
        :show="dismissCountDown"
        dismissible
        :variant="msgType"
        @dismissed="dismissCountDown = 0"
        @dismiss-count-down="countDownChanged"
      >
        {{ alertMsg }}
      </b-alert>
    </div>
    <div v-else>
      Please <router-link to="/login"> {{ $t("login") }} </router-link> to see
      the page!
    </div>
  </div>
</template>

<style>
td {
  vertical-align: middle !important;
}
</style>

<script>
// import Loader from '@bit/akeshavan.mindlogger-web.loader';
import _ from "lodash";
import api from "../lib/api/";
import BounceLoader from "./BounceLoader";

export default {
  name: "Profile",
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
    BounceLoader
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
      msgType: "success",
      alertMsg: "",
      error: {},
      options: [{ text: "On", value: true }, { text: "Off", value: false }],
      oldPassword: null,
      newPassword: {
        original: null,
        repeat: null
      },
      dismissCountDown: 0,
      appletFields: [
        {
          key: "image",
          label: ""
        },
        {
          key: "name",
          label: "Name"
        },
        {
          key: "description",
          label: "Description"
        },
        {
          key: "active",
          label: "Active"
        }
      ]
    };
  },
  watch: {
    isLoggedIn() {
      if (this.isLoggedIn) {
        this.getApplets();
      }
    }
  },
  mounted() {
    if (this.isLoggedIn) {
      this.getApplets();
    }
  },
  computed: {
    appletItems() {
      // eslint-disable-next-line
      return _.map(this.appletsFromServer, (a, index) => {
        return {
          name: a["http://www.w3.org/2004/02/skos/core#prefLabel"]
            ? a["http://www.w3.org/2004/02/skos/core#prefLabel"][0]["@value"]
            : "",
          url: a["http://schema.org/url"]
            ? a["http://schema.org/url"][0]["@value"]
            : a["http://schema.org/url"] || a.url || "",
          description: a["http://schema.org/description"]
            ? a["http://schema.org/description"][0]["@value"]
            : "",
          image: a["http://schema.org/image"]
            ? a["http://schema.org/image"][0]["@value"]
            : a["http://schema.org/image"] ||
              `https://picsum.photos/400/400/?image=${350 + index}`,
          selected: true
        };
      });
    },
    validatePass() {
      if (
        this.newPassword.original === null &&
        this.newPassword.repeat === null
      ) {
        return null;
      }
      return this.newPassword.original === this.newPassword.repeat;
    },
    appletsFromServer() {
      return this.$store.state.applets;
    }
  },
  methods: {
    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown;
    },
    onSubmit(e) {
      e.preventDefault();
      api
        .updatePassword({
          apiHost: this.apiHost,
          token: this.user.authToken.token,
          oldPassword: this.oldPassword,
          newPassword: this.newPassword.original
        })
        .then(() => {
          this.dismissCountDown = 5;
          this.alertMsg = "Success!";
          this.msgType = "success";
        })
        .catch(err => {
          this.dismissCountDown = 5;
          this.alertMsg = err.response.data.message;
          this.msgType = "danger";
        });
    },
    getApplets() {
      this.status = "loading";
      api
        .getAppletsForUser({
          apiHost: this.apiHost,
          token: this.user.authToken.token,
          user: this.user.user._id,
          role: "user"
        })
        .then(resp => {
          if (resp) {
            const appletsFromServer = resp.data
              .map(applet => applet.applet)
              .filter(a => a["http://schema.org/url"]);
            this.status = "ready";
            this.$store.commit("setApplets", appletsFromServer);
          } else {
            this.status = "ready";
          }
        })
        .catch(e => {
          this.error = e;
          this.status = "error";
        });
    }
  }
};
</script>
