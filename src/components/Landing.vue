<template>
  <div class="mt-3 mb-3 h-100">
    <div class="mb-3 pt-3">
      <h1>{{ $t("welcome") }}</h1>
      <p class="lead">
        <!-- Mindlogger is an online data collection platform for scientific research. -->
        {{ $t("participate") }}
      </p>
      <img
        style="max-width:500px; width:100%"
        src="@/assets/undraw_data_xmfy.svg"
      />
      <div v-if="!isLoggedIn">
        <p class="mt-3">{{ $t("togetStarted") }} :</p>
        <b-button :to="{ name: 'Login', query }" variant="primary" size="lg">{{
          $t("login")
        }}</b-button>
        {{ $t("or") }}
        <b-button :to="{ name: 'SignUp', query }" variant="success" size="lg">{{
          $t("signup")
        }}</b-button>
      </div>
      <div class="mt-3" v-else>
        <b-button :to="{ name: 'Profile', query }" variant="danger" size="lg">{{
          $t("getStarted")
        }}</b-button>
      </div>
    </div>
  </div>
</template>

<style></style>

<script>
export default {
  name: 'Landing',
  props: {
    isLoggedIn: {
      type: Boolean,
    },
    query: {
      type: Object,
    },
  },
};
</script>
