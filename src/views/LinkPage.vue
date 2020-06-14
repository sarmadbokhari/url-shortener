<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="max-w-2xl rounded bg-white p-6 shadow-lg h-40" v-if="error">
      <h1 class="text-2xl">{{ error }}</h1>

      <div class="flex justify-center w-full mt-5">
        <span class="inline-flex rounded-md shadow-sm">
          <button
            type="button"
            class="inline-flex items-center px-6 py-3 border border-transparent text-base leading-6 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:border-indigo-700 focus:shadow-outline-indigo active:bg-indigo-700 transition ease-in-out duration-150"
            @click="$router.push('/')"
          >
            Create new URL
          </button>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase/app";

export default {
  data: () => ({
    error: null,
    analytics: null,
  }),
  props: {
    shortUrl: {
      type: String,
    },
  },
  created() {
    this.captureAnalytics();
    this.fetchShortUrl();
  },
  methods: {
    async fetchShortUrl() {
      const query = await firebase
        .firestore()
        .collection("urls")
        .doc(this.shortUrl)
        .get();

      if (query.exists) {
        firebase
          .firestore()
          .collection("urls")
          .doc(this.shortUrl)
          .collection("analytics")
          .add({
            timestamp: new Date(),
            analytics: this.analytics,
          });

        const { longUrl } = query.data();
        window.location.href = `https://${longUrl}`;
      } else {
        this.error = "Sorry, this URL doesn't exist";
      }
    },
    captureAnalytics() {
      const module = {
        options: [],
        header: [
          navigator.platform,
          navigator.userAgent,
          navigator.appVersion,
          navigator.vendor,
          window.opera,
        ],
        dataos: [
          { name: "Windows Phone", value: "Windows Phone", version: "OS" },
          { name: "Windows", value: "Win", version: "NT" },
          { name: "iPhone", value: "iPhone", version: "OS" },
          { name: "iPad", value: "iPad", version: "OS" },
          { name: "Kindle", value: "Silk", version: "Silk" },
          { name: "Android", value: "Android", version: "Android" },
          { name: "PlayBook", value: "PlayBook", version: "OS" },
          { name: "BlackBerry", value: "BlackBerry", version: "/" },
          { name: "Macintosh", value: "Mac", version: "OS X" },
          { name: "Linux", value: "Linux", version: "rv" },
          { name: "Palm", value: "Palm", version: "PalmOS" },
        ],
        databrowser: [
          { name: "Chrome", value: "Chrome", version: "Chrome" },
          { name: "Firefox", value: "Firefox", version: "Firefox" },
          { name: "Safari", value: "Safari", version: "Version" },
          { name: "Internet Explorer", value: "MSIE", version: "MSIE" },
          { name: "Opera", value: "Opera", version: "Opera" },
          { name: "BlackBerry", value: "CLDC", version: "CLDC" },
          { name: "Mozilla", value: "Mozilla", version: "Mozilla" },
        ],
        init: function() {
          var agent = this.header.join(" "),
            os = this.matchItem(agent, this.dataos),
            browser = this.matchItem(agent, this.databrowser);

          return { os: os, browser: browser, agent };
        },
        matchItem: function(string, data) {
          var i = 0,
            j = 0,
            regex,
            regexv,
            match,
            matches,
            version;

          for (i = 0; i < data.length; i += 1) {
            regex = new RegExp(data[i].value, "i");
            match = regex.test(string);
            if (match) {
              regexv = new RegExp(data[i].version + "[- /:;]([\\d._]+)", "i");
              matches = string.match(regexv);
              version = "";
              if (matches) {
                if (matches[1]) {
                  matches = matches[1];
                }
              }
              if (matches) {
                matches = matches.split(/[._]+/);
                for (j = 0; j < matches.length; j += 1) {
                  if (j === 0) {
                    version += matches[j] + ".";
                  } else {
                    version += matches[j];
                  }
                }
              } else {
                version = "0";
              }
              return {
                name: data[i].name,
                version: parseFloat(version),
              };
            }
          }
          return { name: "unknown", version: 0 };
        },
      };

      const analytics = module.init();
      this.analytics = analytics;
    },
  },
};
</script>

<style lang="scss" scoped></style>
