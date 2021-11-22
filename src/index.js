let MomoTalk = null;

function momoTalk() {
  function momoTalk() {
    this.mainElm = null;
    this.isMob = false;
    this.people = {
      DB: null,
      unread: null,
      raw: null
    };
    this.user = {
      page: 0
    };
    this.moduleName = this.constructor.name;
  }
  const _fileExists = (url) => {
    if (url) {
      var req = new XMLHttpRequest();
      req.open('head', url, false);
      req.send();
      return req.status === 200;
    } else {
      return false;
    }
  };
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
  momoTalk.prototype.addLog = function () {
    var a = arguments, i = 0, j = a.length, item, v;
    const b = document.querySelector('.bsConsoleViewConsole');
    temp = document.createElement('div');
    item = ['<div style="clear:both">'];
    while (i < j) {
      v = a[i++];
      if (v && typeof v == 'object') v = JSON.stringify(v);
      item.push('<div class="bsConsoleItem">' + v + '</div>');
    }
    item.push('</div>');
    temp.innerHTML = item.join('');
    b.appendChild(temp.childNodes[0]);
    console.log(...arguments);
    b.scrollTop = b.scrollHeight - b.clientHeight;
  };
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  momoTalk.prototype.initChack = async function () {
    // if (document.querySelector('.init_display')) {
    //   document.querySelector('.init_display').remove();
    //   document.body.className = 'main';
    // }
    document.querySelector('.init_display img#logo').remove();
    document.querySelector('.init_display .progress').style.display = 'block';
    this.addLog('initializing......');
    this.addLog('load students...');
    this.reqDB('./json/students.json').then(xhr => {
      this.addLog('load students:', xhr.response.length!=0);
      this.people.raw = JSON.parse(xhr.response);
      this.people.DB = this.people.raw.students;
      if (this.people.raw.extra_students) {
        this.people.DB = this.people.DB.concat(this.people.raw.extra_students)
      };
      this.addLog('load images');
      async function demo(a) {
        // Sleep in loop
        for (let i = 0; i < a.length; i++) {
          this.addLog('loaded '+e.c+'\'s image');
            await sleep(2000);
        }
      }
      demo();
      
      /*this.addLog('load lastTalk...');
      this.reqDB('./json/lasttalk.json').then(xhr => {
        _data = JSON.parse(xhr.response);
        this.people.unread = _data;

        //this.pageRenderer();
        // this.initChack();
      });
      */
    });
  }
  momoTalk.prototype.pageRenderer = function () {
    if (document.querySelector('.init_display')) {
      document.querySelector('.init_display').remove();
      document.body.className = 'main';
    }
    const continer = document.querySelector('.momoTalk.main');
    const header = document.querySelector('.momoTalk.main .header');
    const title = this.moduleName.charAt(0).toUpperCase() + this.moduleName.slice(1);
    const header_title = document.querySelector('.list_header #title');
    const header_order = document.querySelector('.list_header .order #orderText');

    this.mainElm = continer;
    continer.style.display = 'grid';

    if (!header.innerText.includes(title)) {
      header.insertAdjacentHTML('afterbegin', title);
    }

    if (document.body.clientWidth <= 720) {
      console.log(true);
      if (!document.body.classList.contains('mob')) {
        let _msgv = document.createElement('div');
        _msgv.className = 'msg-view';
        _msgv.innerHTML = continer.querySelector('.msg-view').innerHTML;
        continer.querySelector('.msg-view').remove();
        document.body.append(_msgv);
        _msgv.classList.add('mob');
        continer.querySelector('.chr-list').style.gridColumn = 'span 2';
        document.body.classList.add('mob');
      }
    }

    continer.querySelectorAll('.sidebar-i a').forEach((a, i) => {
      a.className = '';
      a.onclick = () => {
        this.user.page = i;
        this.pageRenderer();
      }
    });

    continer.querySelector('.sidebar-i a:nth-child(' + (this.user.page + 1) + ')').className = 'select';
    if (this.user.page == 0) {
      header_title.innerText = '학생';
      header_order.innerText = '이름';
      this.renderUserLists();
    } else if (this.user.page == 1) {
      header_title.innerText = '안 읽은 메시지';
      header_order.innerText = '최신';
      this.renderRoomLists();
    }
  };

  momoTalk.prototype.init = function () {
    this.initChack();
  };
  momoTalk.prototype.getChrImgPath = function (n) {
    let _dirBase = './assets/images/';
    console.log(n)
    return _dirBase + (!isNaN(n) ? this.people.DB[n].c : n) + '.png';
  }
  /**
   * @generator
   * @description general Chr Chat Item generator
   * @author jomin398
   * @param {string} src display chr picture path 
   * @param {string} name display chr name
   * @param {string} msg display chr message
   * @param {number} time utc time to make LocaleTimeString
   * @param {boolean} unread mk unread icon? 
   * @param {boolean} isGroup is groupRoom?
   * @param {array} userList for rendering groupRoom users
   * @returns {HTMLElement} dumy HtmlElemant
   * @example
   * document.body.append(genDumyChr(src, name, msg, time, unread));
   */
  momoTalk.prototype.genDumyChr = function (src, name, msg, time, unread, isGroup, userList) {
    _ew = document.createElement('li');
    _ew.className = 'chats__chat chat';
    _e = document.createElement('a');
    _fw = document.createElement('div');
    _fw.className = 'chats_chatfriend friend friend--lg';
    for (i = 0; i < 2; i++) {
      _fwc = document.createElement('div');
      _fwc.className = 'friend__column';
      //0: left, 1:right; 
      if (i == 0) {
        _fci = null;
        if (!isGroup) {
          _fci = document.createElement('img');
          _fci.src = src;
          _fci.className = 'm-avatar friend__avatar';
        } else if (isGroup) {
          _fci = document.createElement('div');
          _fci.className = 'group-avatar';
          for (j in userList) {
            _avatar = document.createElement('img');
            _avatar.className = 'group4-avatar friends__avatar';
            _avatar.src = this.getChrImgPath(userList[j])
            _fci.appendChild(_avatar);
          }
        }
        _fc = document.createElement('div');
        _fc.className = 'friend__content';

        //name
        _fcn = document.createElement('div');
        _fcn.className = 'friend__name';
        _fcn.innerText = name;

        //room message
        _fct = document.createElement('div');
        _fct.className = 'friend__bottom-text';
        _fct.innerText = msg ? msg : '상태 메시지';
        _fc.append(_fcn, _fct);
        _fwc.append(_fci, _fc);

      } else if (i == 1) {
        _sp = document.createElement('span');
        _sp.className = 'chat__timestamp';
        _sp.innerText = new Date(time ? time : new Date().getTime()).toLocaleTimeString(undefined, { day: "numeric", hour: "numeric", minute: "numeric", hour12: true });;
        _crw = document.createElement('div');
        _crw.className = 'chat__remain';
        if (unread) {
          _crw.classList.add('unread');
          _cr = document.createElement('div');
          _cr.className = 'chat__remain-count';
          _cr.innerText = 1;
          _crw.appendChild(_cr);
        };
        _fwc.append(_sp, _crw);
      }
      _fw.appendChild(_fwc);
    }
    _e.appendChild(_fw);
    _ew.appendChild(_e);
    return _ew;
  };

  momoTalk.prototype.renderUserLists = function () {
    const header_title = this.mainElm.querySelector('.list_header #title');
    this.mainElm.querySelector('.chr-list_lists').innerText = '페이지 건설 중...';
    header_title.innerText += ' (' + this.people.DB.length + ')';
  };
  momoTalk.prototype.renderRoomLists = function () {
    _base = document.querySelector('.chr-list_lists');
    //in case reload.
    if (_base) {
      _base.remove();
      _base = document.createElement('div');
      _base.className = 'chr-list_lists';
      this.mainElm.querySelector('.chr-list').appendChild(_base);
    };
    _countTotal = 0;
    if (this.people.unread) {
      this.people.unread.forEach((e, i) => {
        _countTotal += e[2].length;
      });
      let el = this.mainElm.querySelector('.sidebar-i span#tCount');
      el.style.display = 'block';
      el.innerText = _countTotal;
      el = this.mainElm.querySelector('.chr-list .list_header #title');
      el.innerText += ' (' + _countTotal + ')';
    }
    console.log(this.people.DB.length);
    for (let i in this.people.unread) {
      _c = this.people.unread[i];
      console.log(_c[0]);
      _isGroup = typeof _c[0] != 'number' && typeof _c[0] != 'string';
      console.log('is GroupRoom? :', typeof _c[0])
      _name = !_isGroup ? (!isNaN(_c[0]) ? this.people.DB[_c[0]].n : _c[0]) : _c[3];
      _msg = _c[2][0];
      _d = (number) => { return Math.max(Math.floor(Math.log10(Math.abs(number))), 0) + 1; };
      _time = _c[1];
      _d = _d(Math.abs(_time));
      _nowOnMili = new Date().getTime();
      _time = _d < 4 && _time == -1 ? _nowOnMili : (Math.sign(_time) != 1 ? _nowOnMili + _time : _time);
      _src = null;
      _count = _c[2].length;

      console.log([_name, _time, _msg, _msg.m, _count, _countTotal]);

      console.log(isNaN(_c[0]));
      if (!_isGroup) {
        _src = this.getChrImgPath(_c[0]);
      } else {
        _src = '';
      }

      console.log(_src)

      _ew = this.genDumyChr(_src, _name, _msg.m, _time, true, _isGroup, _c[0]);
      _ew.querySelector('.chat__remain-count').innerText = _count;
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
  }, 1100);
}