let MomoTalk = null;

function pageInit() {

}

function pageOnload() {
  MomoTalk = new momoTalk;
  MomoTalk.init();
  // pageInit();
}

window.onload = () => {
  setTimeout(() => {
    pageOnload();
  }, 1100);
}