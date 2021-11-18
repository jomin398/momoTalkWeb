let MomoTalk = null;

function momoTalk() {
  function momoTalk() {
    this.mainElm = null;
    this.isMob = false;
    this.people = {
      DB: null,
      unread: null,
      raw: null
    }
  }
  momoTalk.prototype.reqDB = function (url, method, data) {
    let xhr = new XMLHttpRequest();
    xhr.open(method ? method : "GET", url, true);
    return new Promise(function (resolve, reject) {
      var s, p, i;
      if (data && data.constructor == Object) {
        // serialize object
        s = "_=" + (new Date).getTime();
        for (p in data)
          if (data.hasOwnProperty(p)) {
            if (!data[p] || data[p].constructor != Array) {
              data[p] = [data[p]]
            }
            for (i = 0; i < data[p].length; i++) {
              s += "&" + encodeuricomponent(p) + "=" + encodeuricomponent(data[p][i]);
            }
          } data = s;
      }
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          resolve(xhr);
        }
      }
      xhr.send(data);
    });
  };
  momoTalk.prototype.init = function () {
    document.querySelector('.init_display').remove();
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
    this.reqDB('./json/students.json').then(xhr => {
      this.people.raw = JSON.parse(xhr.response);
      this.people.DB = this.people.raw.students;
      if (this.people.raw.extra_students) {
        this.people.DB = this.people.DB.concat(this.people.raw.extra_students)
      }
      this.reqDB('./json/lasttalk.json').then(xhr => {
        _data = JSON.parse(xhr.response);
        this.people.unread = _data;
        this.renderUserLists();
      });
    });
  };

  momoTalk.prototype.renderUserLists = function () {
   
    _dirBase = './assets/images/';
    _countTotal = 0;
    if (this.people.unread) {
      this.people.unread.forEach((e, i) => {
        _countTotal += e[2].length;
      });
      let el = this.mainElm.querySelector('.sidebar-i span#tCount');
      el.style.display = 'block';
      el.innerText = _countTotal;
      el = this.mainElm.querySelector('.chr-list .list_header #unreadCt');
      el.innerText += ' (' + _countTotal + ')';
    }
    console.log(this.people.DB.length);
    for (let i in this.people.unread) {
      _ew = document.createElement('li');
      _ew.className = 'chats__chat chat';
      _e = document.createElement('a');
      _fw = document.createElement('div');
      _fw.className = 'chats_chatfriend friend friend--lg';
      _c = this.people.unread[i];
      _name = !isNaN(_c[0]) ? this.people.DB[_c[0]].n : _c[0];
      _msg = _c[2][0];
      _d=(number)=> { return Math.max(Math.floor(Math.log10(Math.abs(number))), 0) + 1; };
      _time = _c[1];
      _d = _d(Math.abs( _time));
      _nowOnMili=new Date().getTime();    
      _time = _d<4&&_time==-1?_nowOnMili:(Math.sign(_time)!=1?_nowOnMili+_time:_time);
      _time = new Date(_time).toLocaleTimeString(undefined, { day: "numeric",hour: "numeric", minute: "numeric", hour12: true });

      _count = _c[2].length;

      console.log([_name, _time, _msg, _count, _countTotal]);
      for (j = 0; j < 2; j++) {
        _fwc = document.createElement('div');
        _fwc.className = 'friend__column';
        //0: left, 1:right; 
        if (j == 0) {
          _fci = document.createElement('img');
          console.log(_c[0]);
          console.log(isNaN(_c[0]));
          console.log(_dirBase + this.people.DB[_c[0]].c + '.png')
          _fci.src = !isNaN(_c[0])? _dirBase + this.people.DB[_c[0]].c + '.png' : '';
          _fci.className = 'm-avatar friend__avatar';
          _fc = document.createElement('div');
          _fc.className = 'friend__content';

          //name
          _fcn = document.createElement('div');
          _fcn.className = 'friend__name';
          _fcn.innerText = _name;

          //room message
          _fct = document.createElement('div');
          _fct.className = 'friend__bottom-text';
          _fct.innerText = _msg.m ? (_msg.m) : '상태 메시지';
          _fc.append(_fcn, _fct);
          _fwc.append(_fci, _fc);

        } else if (j == 1) {
          _sp = document.createElement('span');
          _sp.className = 'chat__timestamp';
          _sp.innerText = _time;
          _crw = document.createElement('div');
          _crw.className = 'chat__remain';
          if (_c[2] != -1) {
            _crw.classList.add('unread');
            _cr = document.createElement('div');
            _cr.className = 'chat__remain-count';
            _cr.innerText = _count;
            _crw.appendChild(_cr);
          };
          _fwc.append(_sp, _crw);
        }
        _fw.appendChild(_fwc);
      }
      _e.appendChild(_fw);
      _ew.appendChild(_e);
      document.querySelector('.chr-list_lists').appendChild(_ew);
    }
  }
  return momoTalk;
};

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