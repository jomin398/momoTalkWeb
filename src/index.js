let MomoTalk = null;
const debugMode = false;
const disableArea = {
  setupPage:true
}
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