import { shallowMount } from "@vue/test-utils";
import Home from "@/views/Home.vue";

describe("Home.vue", () => {
  it("Disables input with invalid url", () => {
    const wrapper = shallowMount(Home);
    let createButton = wrapper.find("#create");
    expect(createButton.html()).toContain('disabled="disabled"');

    wrapper.setData({ longUrl: "invalid url" });
    expect(wrapper.vm.isValidLongUrl).toBe(false);
    expect(createButton.html()).toContain('disabled="disabled"');

    wrapper.setData({ longUrl: "www.validurl.com" });
    expect(wrapper.vm.isValidLongUrl).toBe(true);

    createButton = wrapper.find("#create");
    console.log(createButton.attributes());
  });
});
