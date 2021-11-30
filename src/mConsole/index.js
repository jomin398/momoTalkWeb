  /**
   * @module mConsole
   * @author jomin398
   * @license Apache-2.0
   */
  const mConsole = (function() {
    let body = null;
    /**
     * @property {boolean} update set update log? default:true;
     */
    let update = true;
    const init = () => {
      body = document.querySelector('.mConsole');
    };
    const scrToBottom = () => body.scrollTop = body.scrollHeight - body.clientHeight;
    const clear = () => {
      if (body) {
        body.innerHTML = '';
      }
    }
    /**
     * @generator
     * @memberof mConsole
     * @example
     * log("%chi","color:blue")
     */
    const log = function() {
      init();
      let a = arguments;
      let l = Array.from(a);
      let r = [];
      let i = 0,
        j = a.length,
        item;
      for (i; i < j; i++) {
        //if svring is str?
        if (typeof l[i] == 'string') {
          if (l[i].includes('%c')) {
            l[i] = l[i].replace('%c', '<span>');
            if (l[i].includes('%s')) {
              l[i] = l[i].replace('%s', '');
              l[i] = l[i].replace('span', 'span style="' + l[i + 1] + '"')
              l.splice(i + 1, 1)
              l.splice(i + 2, 0, '</span>')
            } else {
              l[i] = l[i].replace('span', 'span style="' + l[i + 1] + '"')
              l.splice(i + 1, 1, '</span>')
            }
          }
        } else if (l[i] && typeof l[i] == 'object') {
          l[i] = JSON.stringify(l[i]);
        }
        //finally push data to r;
        r.push(l[i]);
      }

      temp = document.createElement('div');
      item = ['<div style="clear:both">'];
      item.push('<div class="mConsole item">' + r.join('') + '</div>');
      item.push('</div>');
      temp.innerHTML = item.join('');
      if (update) {
        body.appendChild(temp.childNodes[0]);
        scrToBottom();
      }else if(!update){
        body.lastChild.innerHTML = temp.childNodes[0].innerHTML;
      }
      console.log(r.join(''))
    };
    return { log, l: log, clear, c: clear, update};
  })();