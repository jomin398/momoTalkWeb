const momoTalk = function() {
  function momoTalk() {
    this.mainElm = null;
    this.progressElm = null;
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
    this.isdeb = debugMode;
  }
  const makeRequest = (method, url, data = {}) => {
    const xhr = new XMLHttpRequest();
    return new Promise(resolve => {
      xhr.open(method ? method : 'get', url, true);
      xhr.onload = () => resolve(xhr);
      xhr.onerror = () => resolve(xhr);
      data != {} ? xhr.send(JSON.stringify(data)) : xhr.send();
    })
  }

  const _fileExists = async (url) => {
    if (url) {
      let req = await makeRequest('head', url);
      return req.readyState == 4;
    } else {
      return false;
    }
  };
  momoTalk.prototype.reqDB = function(url, method, data = {}) {
    return makeRequest(method, url, data);
  };
  momoTalk.prototype.mConsole = mConsole;

  /**
   * @generator
   * @alias mkBooleanLog
   * @param {string} m message
   * @param {boolean} b boolean to toggle
   */
  momoTalk.prototype.mkBooLog = function(m, b) {
    let t = [
      m ? m : '',
      '%c%s',
      'font-weight:bolder; color:' + (b ? '#adff2f;' : '#8b0000;'),
      (b ? 'done.' : 'failed.')
    ];
    return t;
  };

  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  momoTalk.prototype.progressUPdate = function(ps = 0, notAcc) {
    if (!notAcc) {
      this.progressElm.value += ps;
    } else {
      this.progressElm.value = ps;
    }
    _text = this.progressElm.value.toFixed(1) + "%";
    this.progressElm.innerText = _text;
    this.progressElm.parentElement.querySelector('#ps').innerText = _text;
  };
  momoTalk.prototype.initChack = async function() {
    let self = this;
    document.querySelector('.init_display img#logo').remove();
    document.querySelector('.init_display .progress').style.display = 'block';
    this.progressElm = document.querySelector('.init_display .progress progress');
    this.mConsole.l('initializing.');
    this.mConsole.l('initializing...');
    this.mConsole.l('initializing......');
    this.mConsole.l('initializing..........', '%cdone', 'color:#adff2f;');

    this.mConsole.l('load students...');
    this.reqDB('./json/students.json').then(async (xhr) => {
      this.people.raw = JSON.parse(xhr.response);
      this.people.DB = this.people.raw.students;
      if (this.people.raw.extra_students) {
        this.people.DB = this.people.DB.concat(this.people.raw.extra_students)
      };
      this.mConsole.l('concatenate data...');
      this.progressUPdate(10);
      await sleep(2000);
      this.mConsole.l('load students : ', this.people.DB.length);
      this.mConsole.l('<br>');
      this.progressUPdate(10)

      _dirBase = './assets/images/';
      this.mConsole.l('loading images...', 'from ', _dirBase);
      async function imageLoad() {
        _fails = [];
        _tval = 80;

        _pval = (_tval - self.progressElm.value) / self.people.DB.length;
        console.log(_pval);
        // Sleep in loop
        for (let i = 0, a = self.people.DB, l = a.length; i < l; i++) {
          await sleep(200);
          _n = a[i].c;
          _t = 'loading ' + _n + '\'s image...';
          self.mConsole.l(_t);
          _res = await _fileExists(_dirBase + _n + '.png');
          if (!_res) {
            _fails.push(_res);
          };
          self.progressUPdate(_pval);
          arr = self.mkBooLog(_t, _res).concat(
            ' ...(' + (i + 1) + '/' + l + ')');
          self.mConsole.l.apply(null, arr);
        }
        _bool = _fails.length == 0;
        arr = self.mkBooLog('loaded ', _bool);
        self.mConsole.l.apply(null, arr);
        self.progressUPdate(10);
      };
      let loadchat = () => {
        this.mConsole.l('<br>');
        this.mConsole.l('load lastChat...');
        this.reqDB('./json/lastchat.json').then(async (xhr) => {
          _data = JSON.parse(xhr.response);
          this.people.unread = _data;
          this.mConsole.l.apply(null,this.mkBooLog('load lastChat... ',xhr.response!={}));
          self.progressUPdate(10);
          _b = self.progressElm.parentElement.querySelector('.mConsole');


          if (_b.classList.contains('view')) {
            _b.classList.remove('view');
          }
          _b.scrollTop = _b.scrollHeight - _b.clientHeight;
          await sleep(1200);
          this.pageRenderer();
        });
      }
      if (this.isdeb) {
        loadchat();
      } else {
        imageLoad().then(() => {
          loadchat();
        });
      }
    });
  }

  momoTalk.prototype.countUnread = function() {
    _countTotal = 0;
    if (this.people.unread) {
      this.people.unread.forEach((e, i) => {
        _countTotal += e[2].length;
      });
    }
    return _countTotal;
  }
  momoTalk.prototype.pageRenderer = function() {
    //remove ad...
    if (document.getElementById('forkongithub')) {
      document.getElementById('forkongithub').remove();
    }

    if (document.querySelector('.init_display')) {
      document.querySelector('.init_display').remove();
    }
    if (document.querySelector('.msg-container.mob')) {
      document.querySelector('.msg-container.mob').remove();
    }
    document.body.className = 'main';
    const continer = document.querySelector('.momotalk-wrapper');
    const header = document.querySelector('.title-container .title');
    const title = this.moduleName.charAt(0).toUpperCase() + this.moduleName.slice(1);
    let header_title = null,
      header_order = null;

    this.mainElm = continer;
    continer.style.display = 'inline';
    header.innerHTML = title;

    if (continer.querySelector('.construction')) {
      continer.querySelector('.construction').remove();
      continer.querySelector('.chr-list_lists').style.display = 'block';
    }

    if (!continer.querySelector('.msg-container')) {
      let _msgv = document.createElement('div');
      _msgv.className = 'msg-container';
      let _noti = document.createElement('div');
      _noti.className = 'noti';
      _noti.id = 'nostu';
      _noti.innerText = '학생을 선택해주세요.';
      _msgv.appendChild(_noti)
      continer.querySelector('.content-container').appendChild(_msgv);
    }
    if (document.body.clientWidth <= 720) {
      console.log(true);
      if (!document.body.classList.contains('mob')) {
        let _msgv = document.createElement('div');
        _msgv.className = 'msg-container';
        _msgv.innerHTML = continer.querySelector('.msg-container').innerHTML;
        continer.querySelector('.msg-container').remove();
        document.body.append(_msgv);
        _msgv.classList.add('mob');
        document.body.classList.add('mob');
      }
    }

    continer.querySelectorAll('.tab-container a').forEach((a, i) => {
      a.className = 'tab';
      a.onclick = () => {
        this.user.page = i;
        this.pageRenderer();
      }
    });

    continer.querySelector('.tab-container a:nth-child(' + (this.user.page + 1) + ')').classList.add('active');
    const genRightTab = () => {
      if (!document.querySelector('.list_header .right')) {
        let r = document.createElement('div');
        r.className = 'right';
        for (i = 0; i < 2; i++) {
          let b = document.createElement('button');
          b.className = i == 0 ? 'order' : 'order_org';

          for (let j = 0; j < 2; j++) {
            let l = ['triangle-topright', 'fa fa-solid fa-bars', 'fas fa-long-arrow-alt-up'];
            let e = document.createElement(i == 0 & j == 0 ? 'div' : 'i');
            if (i == 0 & j == 0) {
              e.id = 'orderText';
              e.innerText = ' ';
            } else {
              e.className = i == 0 & j == 1 ? l[j - 1] : l[j + 1];
            }
            b.appendChild(e);
          }

          r.appendChild(b);
        }
        document.querySelector('.list_header').appendChild(r);
      }
    };
    genRightTab();
    header_title = document.querySelector('.list_header #title');
    header_order = document.querySelector('.list_header .order #orderText');
    switch (this.user.page) {
      case 0:
        header_title.innerText = '학생';
        header_order.innerText = '이름';
        this.renderUserLists();
        break;
      case 1:
        header_title.innerText = '안 읽은 메시지';
        header_order.innerText = '최신';
        this.renderRoomLists();
        break;
      case 2:
        header_title.innerText = '설정';
        this.renderSetupPage();
        break;
      default:
        location.reload();
        break;
    }
    let el = this.mainElm.querySelector('.tab-container span#tCount');
    el.style.display = 'block';
    el.innerText = this.countUnread();
  };

  momoTalk.prototype.init = function() {
    this.console = document.querySelector('.progress .mConsole');
    this.console.onclick = () => this.console.classList.toggle('view');
    this.initChack();
  };
  momoTalk.prototype.getChrImgPath = function(n) {
    let _dirBase = './assets/images/';
    console.log(n)
    return _dirBase + (!isNaN(n) ? this.people.DB[n].c : n) + '.png';
  }

  /**
   * @generator
   * @param {Object} option option of generater;
   * @param {boolean} option.isGroup is group cheat?
   * @param {boolean} option.isPF is people profile?
   * @param {string} option.src string for display chr picture path
   * @param {string} option.name display chr name 
   * @param {string} option.msg display chr message
   * @param {number} option.time utc time to make LocaleTimeString
   * @param {boolean} option.unread mk unread icon? 
   * @param {Array} option.userList a user number for rendering groupRoom users
   * @param {Object} option.music pf music object
   * @param {string} option.music.tp typeof musicplayer
   * @param {string} option.music.title display music title
   * @returns {HTMLElement} dumy HtmlElemant
   */
  momoTalk.prototype.genDumyPeople = function(option) {
    _ew = document.createElement('li');
    //is people profile?
    _ew.className = option.isPF ? 'friends__list' : 'chats__chat chat';
    _e = document.createElement('a');
    _fw = document.createElement('div');
    _fw.className = option.isPF ? 'friends__friend friend real-friend' : 'chats_chatfriend friend friend--lg';
    for (i = 0; i < 2; i++) {
      _fwc = document.createElement('div');
      _fwc.className = 'friend__column';
      //0: left, 1:right; 
      if (i == 0) {
        _fci = null;
        if (!option.isGroup) {
          _fci = document.createElement('img');
          _fci.src = option.src;
          _fci.className = option.isPF ? 'friend__avatar' : 'm-avatar friend__avatar';
        } else if (option.isGroup) {
          _fci = document.createElement('div');
          _fci.className = 'group-avatar';
          for (j in option.userList) {
            _avatar = document.createElement('img');
            _avatar.className = 'group4-avatar friends__avatar';
            _avatar.src = this.getChrImgPath(option.userList[j])

            _fci.appendChild(_avatar);
          }
        }
        _fc = document.createElement('div');
        _fc.className = 'friend__content';

        //name
        _fcn = document.createElement('div');
        _fcn.className = 'friend__name';
        _fcn.innerText = option.name;

        //room message
        _fct = document.createElement('div');
        _fct.className = option.isPF ? 'friend__status' : 'friend__bottom-text';
        _fct.innerText = option.msg ? option.msg : '상태 메시지';
        _fc.append(_fcn, _fct);
        _fwc.append(_fci, _fc);

      } else if (i == 1) {
        if (!option.isPF) {
          _sp = document.createElement('span');
          _sp.className = 'chat__timestamp';
          _sp.innerText = new Date(option.time ? option.time : new Date().getTime()).toLocaleTimeString(undefined, { day: "numeric", hour: "numeric", minute: "numeric", hour12: true });
          _crw = document.createElement('div');
          _crw.className = 'chat__remain';
          if (option.unread) {
            _crw.classList.add('unread');
            _cr = document.createElement('div');
            _cr.className = 'chat__remain-count';
            _cr.innerText = 1;
            _crw.appendChild(_cr);
          };
          _fwc.append(_sp, _crw);
        } else if (option.isPF) {
          if (option.music) {
            _music_wrapper = document.createElement('div');
            _music_wrapper.className = 'friend__now-listening' + (option.music.tp ? ' ' + option.music.tp : 'melon');
            _sp = document.createElement('span');
            _sp.className = 'music-title';
            _sp.innerText = option.music.title;
            _music_wrapper.appendChild(_sp)
            _fwc.append(_music_wrapper);
          };
        }
      }
      _fw.appendChild(_fwc);
    }
    //wrapping for return
    _e.appendChild(_fw);
    _ew.appendChild(_e);
    return _ew;
  };

  /**
   * @description user Sort function
   * @param {Object} option sort for rendering
   * @param {Array} option.arr array to sort;
   * @param {(string|number)} option.t selct object
   * @param {number} option.n 0 for up, 1 for down.
   * @returns {Array} sorted array.
   */
  momoTalk.prototype.userSorter = function(option) {
    let c = null,
      f = null;
    option.n ? option.n : option.n = 0;

    if (option.n == 0) {
      c = (x, y) => x < y ? -1 : x > y ? 1 : 0;
    } else if (option.n == 1) {
      c = (x, y) => x > y ? -1 : x < y ? 1 : 0;
    }
    f = (a, b) => c(a[option.t], b[option.t]);
    return option.arr.sort((a, b) => f(a, b));
  };

  momoTalk.prototype.displayErrorPage = function() {
    _base = this.mainElm.querySelector('.chr-list_lists');
    _base.style.display = 'none';
    _constarea = document.createElement('div');
    _constarea.className = 'construction';
    _t = document.createElement('span');
    _t.id = 'top';
    _t.innerText = '페이지 건설 중...';
    _imgwrap = document.createElement('div');
    _imgwrap.style.textAlign = 'center';
    _img = document.createElement('img');
    _img.className = 'area_const';

    _img.src = './assets/icons/emojis/Popup_Image_Arona.png';
    _imgwrap.appendChild(_img);
    _constarea.append(_t, _imgwrap);
    document.querySelector('.room-container').append(_constarea)
  };
  momoTalk.prototype.renderUserLists = function(sortOption) {
    const header_title = this.mainElm.querySelector('.list_header #title');
    _base = this.mainElm.querySelector('.chr-list_lists');
    if (_base) {
      _base.remove();
      _base = document.createElement('div');
      _base.className = 'chr-list_lists';
      this.mainElm.querySelector('.room-container').appendChild(_base);
    };
    let data = this.people.DB;
    header_title.innerText += ' (' + data.length + ')';
    if (disableArea.UserLists) {
      this.displayErrorPage();
    } else {
      console.log(data.length);
      if (sortOption) {
        data = this.userSorter(Object.assign({ arr: data }, sortOption))
      }
      for (let i = 0, l = data; i < l.length; i++) {
        _ew = this.genDumyPeople({
          isGroup: false,
          isPF: true,
          src: this.getChrImgPath(l[i].c),
          name: l[i].n,
          msg: l[i].s
        });
        _base.appendChild(_ew);
      }
    }
  };
  momoTalk.prototype.renderRoomLists = function() {
    _base = document.querySelector('.chr-list_lists');
    //in case reload.
    if (_base) {
      _base.remove();
      _base = document.createElement('div');
      _base.className = 'chr-list_lists';
      this.mainElm.querySelector('.room-container').appendChild(_base);
    };
    let el = this.mainElm.querySelector('.room-container .list_header #title');
    el.innerText += ' (' + this.countUnread() + ')';
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

      _ew = this.genDumyPeople({
        isGroup: _isGroup,
        src: _src,
        name: _name,
        msg: _msg.m,
        time: _time,
        unread: true,
        userList: _c[0]
      });
      _ew.querySelector('.chat__remain-count').innerText = _count;
      document.querySelector('.chr-list_lists').appendChild(_ew);
    }
  };
  momoTalk.prototype.renderSetupPage = function() {
    const header_title = this.mainElm.querySelector('.list_header #title');
    _base = this.mainElm.querySelector('.chr-list_lists');
    this.mainElm.querySelector('.list_header .right').remove();
    if (disableArea.setupPage) {
      this.displayErrorPage();
    } else {

    }
  }
  return momoTalk;
}();