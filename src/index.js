let MomoTalk = null;
function momoTalk(){
    function momoTalk(){
        this.mainElm = null;
        this.isMob = false;
        this.people = {
            status:null,
            chrs:null
}
    }
    momoTalk.prototype.init = function(){
        let xhr = new XMLHttpRequest();
        document.querySelector('#init_display').remove();
        document.body.className = 'main';
        const continer = document.querySelector('.momoTalk.main');
        this.mainElm = continer;
        continer.style.display= 'grid';
        const header = document.querySelector('.momoTalk.main .header');
        title ='MomoTalk';
        header.insertAdjacentHTML('afterbegin',title);
        xhr.open('get','./json/students.json');
        xhr.onload = ()=>{
            _data = JSON.parse(xhr.response);
            this.people.status=_data.status;
            console.log(this.people.status)
            this.renderUserLists();
        }
        xhr.send();
    }
    momoTalk.prototype.renderUserLists = function(){
        console.log(0)
    }
    return momoTalk;
}

function pageInit(){

}
function pageOnload(){
    MomoTalk = new(momoTalk());
    MomoTalk.init();
    // pageInit();
}

window.onload = ()=>{
    setTimeout(() => {
        pageOnload();
    }, 1000);
}