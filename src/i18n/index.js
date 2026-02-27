'use strict';

const publicStatic = require('./public-static');
const publicRegexp = require('./public-regexp');
const publicSelector = require('./public-selector');

const chatStatic = require('./chat-static');
const chatRegexp = require('./chat-regexp');
const chatSelector = require('./chat-selector');

const settingsStatic = require('./settings-static');
const settingsRegexp = require('./settings-regexp');
const settingsSelector = require('./settings-selector');

const loginStatic = require('./login-static');
const loginRegexp = require('./login-regexp');
const loginSelector = require('./login-selector');

module.exports = {
  public: {
    static: publicStatic,
    regexp: publicRegexp,
    selector: publicSelector,
  },
  chat: {
    static: chatStatic,
    regexp: chatRegexp,
    selector: chatSelector,
  },
  settings: {
    static: settingsStatic,
    regexp: settingsRegexp,
    selector: settingsSelector,
  },
  login: {
    static: loginStatic,
    regexp: loginRegexp,
    selector: loginSelector,
  },
};
