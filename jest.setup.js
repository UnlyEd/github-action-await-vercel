// XXX Unlike what could be expected, once an ENV var is found by dotenv, it won't be overridden
//  So, the order must be from the most important to the less important
//  See https://github.com/motdotla/dotenv/issues/256#issuecomment-598676663
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: '.env.test.local' });
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: '.env.test' });

// Backup of the native console object for later re-use
global._console = global.console;

// Force mute console by returning a mock object that mocks the props we use
global.muteConsole = () => {
  return {
    debug: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    log: jest.fn(),
    warn: jest.fn(),
  };
};

// Force mute console by returning a mock object that mocks the props we use, except for "log"
global.muteConsoleButLog = () => {
  return {
    debug: jest.fn(),
    error: jest.fn(),
    info: jest.fn(),
    log: _console.log,
    warn: jest.fn(),
  };
};

// Restore previously made "console" object
global.unmuteConsole = () => _console;

// Mock __non_webpack_require__ to use the standard node.js "require"
global['__non_webpack_require__'] = require;
