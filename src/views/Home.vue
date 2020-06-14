<template>
  <div class="min-h-screen flex items-center justify-center">
    <div class="max-w-2xl bg-white rounded shadow p-4">
      <h1 class="text-lg">URL Shortener</h1>
      <p class="text-gray-600 text-sm">Paste a url to shorten</p>
      <div class="mt-3">
        <label
          for="long-url"
          class="block text-sm font-medium leading-5 text-gray-700 uppercase"
        >
          Long URL
        </label>
        <div class="mt-1 flex rounded-md shadow-sm">
          <span
            class="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm"
          >
            http://
          </span>
          <input
            id="long-url"
            class="form-input flex-1 block w-full px-3 py-2 rounded-none sm:text-sm sm:leading-5 border border-x-0 border-gray-300"
            placeholder="example.com"
            v-model="longUrl"
          />
          <button
            id="create"
            class="relative inline-flex items-center px-4 py-2 border border-l-0 border-gray-300 text-sm leading-5 font-medium rounded-r-md text-gray-700 bg-gray-50 hover:text-gray-500 hover:bg-white focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150"
            :class="{
              'opacity-25 cursor-not-allowed': !isValidLongUrl,
              'cursor-pointer': isValidLongUrl,
            }"
            :disabled="!isValidLongUrl"
            @click="submitUrl"
          >
            Create
          </button>
        </div>

        <div class="mt-3" v-if="shortUrl">
          <label
            for="short_url"
            class="block text-sm font-medium leading-5 text-gray-700 uppercase"
          >
            Short URL
          </label>
          <div class="flex rounded-md shadow-sm">
            <input
              id="short_url"
              class="form-input flex-1 block w-full px-3 py-2 rounded-l-md sm:text-sm sm:leading-5 border border-r-0 border-gray-300"
              readonly="readonly"
              v-model="fullShortUrl"
            />
            <button
              class="-ml-px relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm leading-5 font-medium rounded-r-md text-gray-700 bg-gray-50 hover:text-gray-500 hover:bg-white focus:outline-none focus:shadow-outline-blue focus:border-blue-300 active:bg-gray-100 active:text-gray-700 transition ease-in-out duration-150"
              :disabled="copied"
              v-clipboard:copy="fullShortUrl"
              v-clipboard:success="onCopy"
            >
              <i class="fas fa-clipboard mr-2" v-if="copied"></i>
              {{ copied ? "Copied!" : "Copy" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import firebase from "firebase/app";

export default {
  data: () => ({
    longUrl: "",
    shortUrl: "",
    copied: false,
    error: "",
  }),
  computed: {
    isValidLongUrl() {
      var expression = /[-a-zA-Z0-9@:%_+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&//=]*)?/gi;
      var regex = new RegExp(expression);
      return this.longUrl.match(regex) ? true : false;
    },
    fullShortUrl() {
      return this.shortUrl ? window.location.href + this.shortUrl : "";
    },
  },
  methods: {
    async submitUrl() {
      // reset page
      this.shortUrl = null;

      // sanitize urls by removing prefixes
      const prefixes = ["https://", "http://", "www."];
      let sanizedUrl = this.longUrl;

      prefixes.forEach((prefix) => {
        if (sanizedUrl.startsWith(prefix)) {
          sanizedUrl = this.longUrl.replace(prefix, "");
        }
      });

      console.log({ sanizedUrl });

      // check if we already have this url
      const isPresent = await this.checkLongUrl(sanizedUrl);

      if (isPresent) {
        this.shortUrl = isPresent;
      } else {
        // store in firebase
        let isUnique = false;
        let shortUrl;

        while (!isUnique) {
          shortUrl = this.generateShortUrl(sanizedUrl);
          isUnique = await this.checkShortUrl(shortUrl);

          console.log({ shortUrl, isUnique });
        }

        firebase
          .firestore()
          .collection("urls")
          .doc(shortUrl)
          .set({ longUrl: sanizedUrl });

        this.shortUrl = shortUrl;
      }
    },
    generateShortUrl() {
      const possibleChars = [];

      // add A-Z
      for (let i = 65; i <= 90; i++) {
        possibleChars.push(String.fromCharCode(i));
      }

      // add a-z
      for (let i = 97; i <= 122; i++) {
        possibleChars.push(String.fromCharCode(i));
      }

      // add 0-9
      for (let i = 0; i <= 9; i++) {
        possibleChars.push(i);
      }

      const result = [];

      // add 12 random characters
      for (let i = 0; i < 12; i++) {
        const randomInt = Math.floor(Math.random() * possibleChars.length);
        result.push(possibleChars[randomInt]);
      }

      return result.join("");
    },
    async checkLongUrl(url) {
      const snapshot = await firebase
        .firestore()
        .collection("urls")
        .where("longUrl", "==", url)
        .get();

      const result = [];

      snapshot.forEach((doc) => {
        // the doc id is the shortUrl
        result.push(doc.id);
      });

      console.log({ result });

      return result ? result[0] : null;
    },
    async checkShortUrl(url) {
      const query = await firebase
        .firestore()
        .collection("urls")
        .doc(url)
        .get();

      return !query.exists;
    },
    onCopy() {
      this.copied = true;

      setTimeout(() => {
        this.copied = false;
      }, 2500);
    },
  },
};
</script>

<style lang="scss"></style>
