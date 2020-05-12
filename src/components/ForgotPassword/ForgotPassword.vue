<template name="signup">
  <div id="signup" class="pt-3 ">
    <div class="">
    <h1 class="text-center" v-if="useTitle"> Reset Password </h1>
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

        <b-button type="submit" variant="primary"> Submit </b-button>
        <p class="mt-3" v-if="loginLink">
          Remember Password? <router-link :to="loginWithQuery">Log In</router-link>
        </p>

        <div v-if="status==='success'">An email has been sent</div>
        <div v-if="status==='fail'">That email is not registered</div>

      </b-form>
    </div>
  </div>
  </div>
</template>
<style scoped>
#signupForm {
  max-width: 400px;
  padding: 20px;
  margin-top: 20px;
  box-shadow: 0px 0 7px 0px #80808036;
}
</style>

<script>
import api from '../../lib/api';

export default {
  name: 'forgotpassword',
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
    loginWithQuery() {
      return { ...this.loginLink, query: this.query };
    },
  },
  methods: {
    onSubmit(e) {
      e.preventDefault();
      this.status = 'loading';

      api.resetPassword({
        apiHost: this.apiHost,
        body: {
          email: this.form.email,
        },
      }).then((resp) => {
        window.console.log(resp);
        this.status = 'success';
        this.$emit('sendRequest', null);
      }).catch((err) => {
        window.console.warn(err);
        this.status = 'fail';
        this.error = e.message;
      });
    },
  },
};
</script>
