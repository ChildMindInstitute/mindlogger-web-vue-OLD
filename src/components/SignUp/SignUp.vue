<template name="signup">
  <div id="signup" class="pt-3 ">
    <div class="">
    <h1 class="text-center" v-if="useTitle"> Sign Up </h1>
    <div id="signupForm" class="container fluid">
      <b-form @submit="onSubmit">
        <b-alert :show="errors.show" variant="danger">{{errors.message}}</b-alert>

        <b-form-group id="usernameInputGroup">
          <b-form-input id="usernameInput"
                        type="text"
                        v-model="form.email"
                        required
                        placeholder="Email"
                        autocomplete="off">
          </b-form-input>
        </b-form-group>

        <b-form-group id="firstNameInputGroup">
          <b-form-input id="firstNameInput"
                        type="text"
                        v-model="form.firstName"
                        required
                        placeholder="First Name"
                        autocomplete="off">
          </b-form-input>
        </b-form-group>

        <b-form-group id="lastNameInputGroup">
          <b-form-input id="lastNameInput"
                        type="text"
                        v-model="form.lastName"
                        required
                        placeholder="Last Name"
                        autocomplete="off">
          </b-form-input>
        </b-form-group>

        <b-form-group id="passwordInputGroup">
          <b-form-input id="passwordInput"
                        type="password"
                        v-model="form.password"
                        required
                        placeholder="Password"
                        autocomplete="new-password">
          </b-form-input>
        </b-form-group>

        <b-form-group id="password2InputGroup">
          <b-form-input id="password2Input"
                        type="password"
                        v-model="form.password2"
                        required
                        placeholder="Confirm password"
                        autocomplete="new-password">
          </b-form-input>
        </b-form-group>
        <b-alert :show="!validated" variant="danger">
          Make sure your passwords match!
        </b-alert>

        <b-button type="submit" variant="primary" :disabled="status === 'loading' || !validated">
          <span v-if="status==='ready'">Sign Up</span>
          <span v-else>Signing up...</span>
        </b-button>

        <p class="mt-3" v-if="loginLink">
          Already have an account? <router-link :to="loginWithQuery">Log In</router-link>
        </p>

      </b-form>
    </div>
  </div>
  </div>
</template>
<style scoped>
#signup {
  min-height: 100vh;
}
#signupForm {
  max-width: 400px;
  padding: 20px;
  margin-top: 20px;
  box-shadow: 0px 0 7px 0px #80808036;
}
</style>

<script>
import _ from 'lodash';
import api from '../../lib/api';

/**
 * # SignUp
 * #### component for mindlogger-web to mindlogger-backend
 *
 * ## props
 * * `apiHost` : String, url to mindlogger-server, a Girder
 * * `loginLink` : String, a string that points to a router view (optional)
 */

export default {
  name: 'signup',
  props: {
    apiHost: {
      type: String,
    },
    loginLink: {
      type: Object,
      default() {
        return {};
      },
    },
    query: {
      type: Object,
    },
    useTitle: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      status: 'ready',
      form: {
        email: '',
        password: '',
        password2: '',
        login: '',
        firstName: '',
        lastName: '',
      },
      show: true,
      errors: {
        show: false,
        message: null,
        code: null,
      },
    };
  },
  computed: {
    validated() {
      return this.form.password === this.form.password2;
    },
    loginWithQuery() {
      return { ...this.loginLink, query: this.query };
    },
  },
  methods: {
    /**
    * Submit registration info to the server, and then save the response to the parent component.
    */
    onSubmit(e) {
      e.preventDefault();
      this.status = 'loading';
      api.signUp(this.apiHost, {
        email: this.form.email,
        firstName: this.form.firstName,
        lastName: this.form.lastName,
        password: this.form.password,
      }).then((resp) => {
        this.status = 'ready';
        const keys = _.filter(Object.keys(resp.data), k => k !== 'authToken');
        const cleanedUser = {};
        _.map(keys, (k) => {
          cleanedUser[k] = resp.data[k];
        });
        // tell the parent we've logged in with this token info.
        this.$emit('login', { authToken: resp.data.authToken, user: cleanedUser });
        this.$router.push(this.$store.state.redirect);
        this.$store.commit('setUserEmail', this.form.email);
        this.$store.commit('setRedirect', 'Profile');
      }).catch((err) => {
        this.errors.show = true;
        this.errors.code = err.response;
        try {
          this.errors.message = err.response.data.message;
        } catch (x) {
          this.errors.message = err.message;
        }
        this.status = 'ready';
      });
    },
  },
};
</script>
