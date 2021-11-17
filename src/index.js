let MomoTalk = null;
function momoTalk() {
    function momoTalk() {
        this.mainElm = null;
        this.isMob = false;
        this.people = {
            rawDB: null,
            unread:null
        }
    }
    momoTalk.prototype.init = function () {
        let xhr = new XMLHttpRequest();
        document.querySelector('#init_display').remove();
        document.body.className = 'main';
        const continer = document.querySelector('.momoTalk.main');
        this.mainElm = continer;
        continer.style.display = 'grid';
        const header = document.querySelector('.momoTalk.main .header');
        title = 'MomoTalk';
        header.insertAdjacentHTML('afterbegin', title);
        if (document.body.clientWidth <= 720) {
            console.log(true);

            _msgv = document.createElement('div');
            _msgv.className = 'msg-view';
            _msgv.innerHTML = continer.querySelector('.msg-view').innerHTML;
            continer.querySelector('.msg-view').remove();
            document.body.append(_msgv);
            _msgv.classList.add('mob');
            continer.querySelector('.chr-list').style.gridColumn = 'span 2';
            document.body.classList.add('mob');
        }
        xhr.open('get', './json/students.json');
        xhr.onload = () => {
            _data = JSON.parse(xhr.response);
            this.people.rawDB = _data.students;
            
            this.renderUserLists();
        }
        xhr.send();
    }
    momoTalk.prototype.renderUserLists = function () {
        console.log( this.people.rawDB);
        _c= this.people.rawDB.students[0];
    }
    return momoTalk;
}

function pageInit() {

}
function pageOnload() {
    MomoTalk = new (momoTalk());
    MomoTalk.init();
    // pageInit();
}

window.onload = () => {
    setTimeout(() => {
        pageOnload();
    }, 1000);
}