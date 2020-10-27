// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from "vue";
import * as Sentry from "@sentry/browser";
import { Vue as VueIntegration } from "@sentry/integrations";

import App from "./App";
import router from "./router";
import store from "./store/store";
import i18n from "./lib/language/language";

const env = process.env.NODE_ENV || "development";

if (env !== "development") {
  Sentry.init({
    dsn:
      "https://8cd0d02f082f46c7aaccf908df2617a7@o414302.ingest.sentry.io/5320597",
    integrations: [new VueIntegration({ Vue, attachProps: true })],
    environment: env
  });
}

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: "#app",
  i18n,
  router,
  store,
  components: { App },
  template: "<App/>"
});
