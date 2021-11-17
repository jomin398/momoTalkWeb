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
        _ew = document.createElement('li');
        _ew.className = 'chats__chat chat';
        _e = document.createElement('a');
        _fw = document.createElement('div');
        _fw.className = 'chats_chatfriend friend friend--lg';
        _dirBase = './assets/images/';
        for (i=0;i<2;i++){
            _fwc = document.createElement('div');
            _fwc.className = 'friend__column';
            //0: left, 1:right; 
            if(i==0){
                _fci = document.createElement('img');
                _fci.src = _dirBase+_c.c+'.png';
                _fc = document.createElement('div');
                _fc.className = 'friend__content';
                
                //name
                _fcn = document.createElement('div');
                _fcn.className = 'friend__name';
                _fcn.innerText = _c.n;
                
                //room message
                _fct = document.createElement('div');
                _fct.className = 'friend__bottom-text';
                _fct.innerText = _c.s?_c.s:'상태 메시지';

                _fc.append(_fcn,_fct)
                _fwc.append(_fci,_fc)
            }else if(i==2){

            }
            _fw.appendChild(_fwc)
        }
        _e.appendChild(_fw)
        _ew.appendChild(_e)
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