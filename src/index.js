let MomoTalk = null;
const debugMode = true;
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