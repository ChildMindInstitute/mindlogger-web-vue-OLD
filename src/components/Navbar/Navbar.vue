<template>
  <b-navbar toggleable="md" type="dark" class="site-header">
    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>

    <b-navbar-brand to="/" exact>MindLogger</b-navbar-brand>

    <b-navbar-nav class="ml-auto">
      <slot></slot>
    </b-navbar-nav>

    <b-collapse is-nav id="nav_collapse">
      <!-- Right aligned nav items -->
      <b-navbar-nav class="ml-auto">
        <b-form-select
          v-model="currentLanguage"
          :options="options"
          @change="onLanguageChange"
        ></b-form-select>
        <!-- class="bg-transparent text-white" -->

        <b-nav-item-dropdown right v-if="isLoggedIn">
          <!-- Using button-content slot -->
          <template slot="button-content">
            <em>{{ user.firstName }}</em>
          </template>
          <b-dropdown-item to="/profile">{{ $t("profile") }}</b-dropdown-item>
          <b-dropdown-item @click="logout">{{ $t("signout") }}</b-dropdown-item>
          <b-dropdown-item to="/settings">{{ $t("settings") }}</b-dropdown-item>
        </b-nav-item-dropdown>

        <b-nav-item v-else :to="{ name: 'Login', query }">{{
          $t("login")
        }}</b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
export default {
  name: "Navbar",
  data: () => ({
    currentLanguage: "en_US",
  }),
  props: {
    isLoggedIn: {
      type: Boolean
    },
    user: {
      type: Object
    },
    logout: {
      type: Function
    },
    query: {
      type: Object
    }
  },
  computed: {
    options() {
      return [
        {
          text: this.$t("en"),
          value: "en_US"
        },
        {
          text: this.$t("fr"),
          value: "fr_FR"
        }
      ]
    }
  },
  methods: {
    onLanguageChange() {
      this.$i18n.locale = this.currentLanguage;
      this.$store.commit("setCurrentLanguage", this.currentLanguage);
    }
  }
};
</script>

<style lang="scss">
.dropdown-toggle::after {
  margin-left: 0.5em;
  vertical-align: 0.15em;
}
</style>
