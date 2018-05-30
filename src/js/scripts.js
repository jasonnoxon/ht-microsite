global.jQuery = require('jquery');
popper = require('popper.js');
bootstrap = require('bootstrap');
Vue = require('../../node_modules/vue/dist/vue.min.js');
vueResource = require('../../node_modules/vue-resource/dist/vue-resource.min.js');

var app = new Vue({
  el: '#app',
  created() {
    this.$http.get(this.url).then(function ({data}) {
        this.partners = data.data;
    });
  },
  data: {
    url: 'https://api.uniteus.io/networks/f022b5dd-e985-44ab-810a-ef0bd8fd7765/groups?access_token=2ZZ4-kHMgYUx8TGDZ_6OFkWC_r66qSwOWxyhCubH',
    partners: [],
    active_partner: [{ name: "none", description: "none", website_url: "none", logo_url: "none"}]
   },
   methods: {
     setActivePartner(id) {
       var i = this.partners.map(item => item.id).indexOf(id);
       this.active_partner = this.partners[i];
     }
   }
});

var stripHtmlFunction = function (value) {
  var span = document.createElement("span");
  span.innerHTML = value;
  var text = span.textContent || span.innerText || "";
  return text;
};

var truncateFunction = function(text, length, clamp) {
    clamp = clamp || '...';
    var node = document.createElement('div');
    node.innerHTML = text;
    var content = node.textContent;
    return content.length > length ? content.slice(0, length) + clamp : content;
};

Vue.filter('truncate', truncateFunction);
Vue.filter('striphtml', stripHtmlFunction)
