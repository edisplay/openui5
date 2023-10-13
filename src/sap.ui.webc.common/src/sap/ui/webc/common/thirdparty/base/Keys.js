sap.ui.define(["exports"], function (_exports) {
  "use strict";

  Object.defineProperty(_exports, "__esModule", {
    value: true
  });
  _exports.isUpShiftCtrl = _exports.isUpShift = _exports.isUpCtrl = _exports.isUpAlt = _exports.isUp = _exports.isTabPrevious = _exports.isTabNext = _exports.isSpaceShift = _exports.isSpaceCtrl = _exports.isSpace = _exports.isShow = _exports.isShift = _exports.isRightShiftCtrl = _exports.isRightShift = _exports.isRightCtrl = _exports.isRight = _exports.isPlus = _exports.isPageUpShiftCtrl = _exports.isPageUpShift = _exports.isPageUpAlt = _exports.isPageUp = _exports.isPageDownShiftCtrl = _exports.isPageDownShift = _exports.isPageDownAlt = _exports.isPageDown = _exports.isNumber = _exports.isMinus = _exports.isLeftShiftCtrl = _exports.isLeftShift = _exports.isLeftCtrl = _exports.isLeft = _exports.isKeyP = _exports.isKeyA = _exports.isInsertShift = _exports.isInsertCtrl = _exports.isHomeShift = _exports.isHomeCtrl = _exports.isHome = _exports.isF7 = _exports.isF6Previous = _exports.isF6Next = _exports.isF4Shift = _exports.isF4 = _exports.isEscape = _exports.isEnterShift = _exports.isEnter = _exports.isEndShift = _exports.isEndCtrl = _exports.isEnd = _exports.isDownShiftCtrl = _exports.isDownShift = _exports.isDownCtrl = _exports.isDownAlt = _exports.isDown = _exports.isDeleteShift = _exports.isDelete = _exports.isCtrlV = _exports.isCtrlA = _exports.isColon = _exports.isBackSpace = void 0;
  var KeyCodes;
  (function (KeyCodes) {
    KeyCodes[KeyCodes["BACKSPACE"] = 8] = "BACKSPACE";
    KeyCodes[KeyCodes["TAB"] = 9] = "TAB";
    KeyCodes[KeyCodes["ENTER"] = 13] = "ENTER";
    KeyCodes[KeyCodes["SHIFT"] = 16] = "SHIFT";
    KeyCodes[KeyCodes["CONTROL"] = 17] = "CONTROL";
    KeyCodes[KeyCodes["ALT"] = 18] = "ALT";
    KeyCodes[KeyCodes["BREAK"] = 19] = "BREAK";
    KeyCodes[KeyCodes["CAPS_LOCK"] = 20] = "CAPS_LOCK";
    KeyCodes[KeyCodes["ESCAPE"] = 27] = "ESCAPE";
    KeyCodes[KeyCodes["SPACE"] = 32] = "SPACE";
    KeyCodes[KeyCodes["PAGE_UP"] = 33] = "PAGE_UP";
    KeyCodes[KeyCodes["PAGE_DOWN"] = 34] = "PAGE_DOWN";
    KeyCodes[KeyCodes["END"] = 35] = "END";
    KeyCodes[KeyCodes["HOME"] = 36] = "HOME";
    KeyCodes[KeyCodes["ARROW_LEFT"] = 37] = "ARROW_LEFT";
    KeyCodes[KeyCodes["ARROW_UP"] = 38] = "ARROW_UP";
    KeyCodes[KeyCodes["ARROW_RIGHT"] = 39] = "ARROW_RIGHT";
    KeyCodes[KeyCodes["ARROW_DOWN"] = 40] = "ARROW_DOWN";
    KeyCodes[KeyCodes["PRINT"] = 44] = "PRINT";
    KeyCodes[KeyCodes["INSERT"] = 45] = "INSERT";
    KeyCodes[KeyCodes["DELETE"] = 46] = "DELETE";
    KeyCodes[KeyCodes["DIGIT_0"] = 48] = "DIGIT_0";
    KeyCodes[KeyCodes["DIGIT_1"] = 49] = "DIGIT_1";
    KeyCodes[KeyCodes["DIGIT_2"] = 50] = "DIGIT_2";
    KeyCodes[KeyCodes["DIGIT_3"] = 51] = "DIGIT_3";
    KeyCodes[KeyCodes["DIGIT_4"] = 52] = "DIGIT_4";
    KeyCodes[KeyCodes["DIGIT_5"] = 53] = "DIGIT_5";
    KeyCodes[KeyCodes["DIGIT_6"] = 54] = "DIGIT_6";
    KeyCodes[KeyCodes["DIGIT_7"] = 55] = "DIGIT_7";
    KeyCodes[KeyCodes["DIGIT_8"] = 56] = "DIGIT_8";
    KeyCodes[KeyCodes["DIGIT_9"] = 57] = "DIGIT_9";
    KeyCodes[KeyCodes["A"] = 65] = "A";
    KeyCodes[KeyCodes["B"] = 66] = "B";
    KeyCodes[KeyCodes["C"] = 67] = "C";
    KeyCodes[KeyCodes["D"] = 68] = "D";
    KeyCodes[KeyCodes["E"] = 69] = "E";
    KeyCodes[KeyCodes["F"] = 70] = "F";
    KeyCodes[KeyCodes["G"] = 71] = "G";
    KeyCodes[KeyCodes["H"] = 72] = "H";
    KeyCodes[KeyCodes["I"] = 73] = "I";
    KeyCodes[KeyCodes["J"] = 74] = "J";
    KeyCodes[KeyCodes["K"] = 75] = "K";
    KeyCodes[KeyCodes["L"] = 76] = "L";
    KeyCodes[KeyCodes["M"] = 77] = "M";
    KeyCodes[KeyCodes["N"] = 78] = "N";
    KeyCodes[KeyCodes["O"] = 79] = "O";
    KeyCodes[KeyCodes["P"] = 80] = "P";
    KeyCodes[KeyCodes["Q"] = 81] = "Q";
    KeyCodes[KeyCodes["R"] = 82] = "R";
    KeyCodes[KeyCodes["S"] = 83] = "S";
    KeyCodes[KeyCodes["T"] = 84] = "T";
    KeyCodes[KeyCodes["U"] = 85] = "U";
    KeyCodes[KeyCodes["V"] = 86] = "V";
    KeyCodes[KeyCodes["W"] = 87] = "W";
    KeyCodes[KeyCodes["X"] = 88] = "X";
    KeyCodes[KeyCodes["Y"] = 89] = "Y";
    KeyCodes[KeyCodes["Z"] = 90] = "Z";
    KeyCodes[KeyCodes["WINDOWS"] = 91] = "WINDOWS";
    KeyCodes[KeyCodes["CONTEXT_MENU"] = 93] = "CONTEXT_MENU";
    KeyCodes[KeyCodes["TURN_OFF"] = 94] = "TURN_OFF";
    KeyCodes[KeyCodes["SLEEP"] = 95] = "SLEEP";
    KeyCodes[KeyCodes["NUMPAD_0"] = 96] = "NUMPAD_0";
    KeyCodes[KeyCodes["NUMPAD_1"] = 97] = "NUMPAD_1";
    KeyCodes[KeyCodes["NUMPAD_2"] = 98] = "NUMPAD_2";
    KeyCodes[KeyCodes["NUMPAD_3"] = 99] = "NUMPAD_3";
    KeyCodes[KeyCodes["NUMPAD_4"] = 100] = "NUMPAD_4";
    KeyCodes[KeyCodes["NUMPAD_5"] = 101] = "NUMPAD_5";
    KeyCodes[KeyCodes["NUMPAD_6"] = 102] = "NUMPAD_6";
    KeyCodes[KeyCodes["NUMPAD_7"] = 103] = "NUMPAD_7";
    KeyCodes[KeyCodes["NUMPAD_8"] = 104] = "NUMPAD_8";
    KeyCodes[KeyCodes["NUMPAD_9"] = 105] = "NUMPAD_9";
    KeyCodes[KeyCodes["NUMPAD_ASTERISK"] = 106] = "NUMPAD_ASTERISK";
    KeyCodes[KeyCodes["NUMPAD_PLUS"] = 107] = "NUMPAD_PLUS";
    KeyCodes[KeyCodes["NUMPAD_MINUS"] = 109] = "NUMPAD_MINUS";
    KeyCodes[KeyCodes["NUMPAD_COMMA"] = 110] = "NUMPAD_COMMA";
    KeyCodes[KeyCodes["NUMPAD_SLASH"] = 111] = "NUMPAD_SLASH";
    KeyCodes[KeyCodes["F1"] = 112] = "F1";
    KeyCodes[KeyCodes["F2"] = 113] = "F2";
    KeyCodes[KeyCodes["F3"] = 114] = "F3";
    KeyCodes[KeyCodes["F4"] = 115] = "F4";
    KeyCodes[KeyCodes["F5"] = 116] = "F5";
    KeyCodes[KeyCodes["F6"] = 117] = "F6";
    KeyCodes[KeyCodes["F7"] = 118] = "F7";
    KeyCodes[KeyCodes["F8"] = 119] = "F8";
    KeyCodes[KeyCodes["F9"] = 120] = "F9";
    KeyCodes[KeyCodes["F10"] = 121] = "F10";
    KeyCodes[KeyCodes["F11"] = 122] = "F11";
    KeyCodes[KeyCodes["F12"] = 123] = "F12";
    KeyCodes[KeyCodes["NUM_LOCK"] = 144] = "NUM_LOCK";
    KeyCodes[KeyCodes["SCROLL_LOCK"] = 145] = "SCROLL_LOCK";
    KeyCodes[KeyCodes["COLON"] = 186] = "COLON";
    KeyCodes[KeyCodes["PLUS"] = 187] = "PLUS";
    KeyCodes[KeyCodes["COMMA"] = 188] = "COMMA";
    KeyCodes[KeyCodes["SLASH"] = 189] = "SLASH";
    KeyCodes[KeyCodes["DOT"] = 190] = "DOT";
    KeyCodes[KeyCodes["PIPE"] = 191] = "PIPE";
    KeyCodes[KeyCodes["SEMICOLON"] = 192] = "SEMICOLON";
    KeyCodes[KeyCodes["MINUS"] = 219] = "MINUS";
    KeyCodes[KeyCodes["GREAT_ACCENT"] = 220] = "GREAT_ACCENT";
    KeyCodes[KeyCodes["EQUALS"] = 221] = "EQUALS";
    KeyCodes[KeyCodes["SINGLE_QUOTE"] = 222] = "SINGLE_QUOTE";
    KeyCodes[KeyCodes["BACKSLASH"] = 226] = "BACKSLASH";
  })(KeyCodes || (KeyCodes = {}));
  const isEnter = event => (event.key ? event.key === "Enter" : event.keyCode === KeyCodes.ENTER) && !hasModifierKeys(event);
  _exports.isEnter = isEnter;
  const isEnterShift = event => (event.key ? event.key === "Enter" : event.keyCode === KeyCodes.ENTER) && checkModifierKeys(event, false, false, true);
  _exports.isEnterShift = isEnterShift;
  const isSpace = event => (event.key ? event.key === "Spacebar" || event.key === " " : event.keyCode === KeyCodes.SPACE) && !hasModifierKeys(event);
  _exports.isSpace = isSpace;
  const isSpaceShift = event => (event.key ? event.key === "Spacebar" || event.key === " " : event.keyCode === KeyCodes.SPACE) && checkModifierKeys(event, false, false, true);
  _exports.isSpaceShift = isSpaceShift;
  const isSpaceCtrl = event => (event.key ? event.key === "Spacebar" || event.key === " " : event.keyCode === KeyCodes.SPACE) && checkModifierKeys(event, true, false, false);
  _exports.isSpaceCtrl = isSpaceCtrl;
  const isLeft = event => (event.key ? event.key === "ArrowLeft" || event.key === "Left" : event.keyCode === KeyCodes.ARROW_LEFT) && !hasModifierKeys(event);
  _exports.isLeft = isLeft;
  const isRight = event => (event.key ? event.key === "ArrowRight" || event.key === "Right" : event.keyCode === KeyCodes.ARROW_RIGHT) && !hasModifierKeys(event);
  _exports.isRight = isRight;
  const isUp = event => (event.key ? event.key === "ArrowUp" || event.key === "Up" : event.keyCode === KeyCodes.ARROW_UP) && !hasModifierKeys(event);
  _exports.isUp = isUp;
  const isDown = event => (event.key ? event.key === "ArrowDown" || event.key === "Down" : event.keyCode === KeyCodes.ARROW_DOWN) && !hasModifierKeys(event);
  _exports.isDown = isDown;
  const isLeftCtrl = event => (event.key ? event.key === "ArrowLeft" || event.key === "Left" : event.keyCode === KeyCodes.ARROW_LEFT) && checkModifierKeys(event, true, false, false);
  _exports.isLeftCtrl = isLeftCtrl;
  const isRightCtrl = event => (event.key ? event.key === "ArrowRight" || event.key === "Right" : event.keyCode === KeyCodes.ARROW_RIGHT) && checkModifierKeys(event, true, false, false);
  _exports.isRightCtrl = isRightCtrl;
  const isUpCtrl = event => (event.key ? event.key === "ArrowUp" || event.key === "Up" : event.keyCode === KeyCodes.ARROW_UP) && checkModifierKeys(event, true, false, false);
  _exports.isUpCtrl = isUpCtrl;
  const isDownCtrl = event => (event.key ? event.key === "ArrowDown" || event.key === "Down" : event.keyCode === KeyCodes.ARROW_DOWN) && checkModifierKeys(event, true, false, false);
  _exports.isDownCtrl = isDownCtrl;
  const isUpShift = event => (event.key ? event.key === "ArrowUp" || event.key === "Up" : event.keyCode === KeyCodes.ARROW_UP) && checkModifierKeys(event, false, false, true);
  _exports.isUpShift = isUpShift;
  const isDownShift = event => (event.key ? event.key === "ArrowDown" || event.key === "Down" : event.keyCode === KeyCodes.ARROW_DOWN) && checkModifierKeys(event, false, false, true);
  _exports.isDownShift = isDownShift;
  const isUpAlt = event => (event.key ? event.key === "ArrowUp" || event.key === "Up" : event.keyCode === KeyCodes.ARROW_UP) && checkModifierKeys(event, false, true, false);
  _exports.isUpAlt = isUpAlt;
  const isDownAlt = event => (event.key ? event.key === "ArrowDown" || event.key === "Down" : event.keyCode === KeyCodes.ARROW_DOWN) && checkModifierKeys(event, false, true, false);
  _exports.isDownAlt = isDownAlt;
  const isLeftShift = event => (event.key ? event.key === "ArrowLeft" || event.key === "Left" : event.keyCode === KeyCodes.ARROW_LEFT) && checkModifierKeys(event, false, false, true);
  _exports.isLeftShift = isLeftShift;
  const isRightShift = event => (event.key ? event.key === "ArrowRight" || event.key === "Right" : event.keyCode === KeyCodes.ARROW_RIGHT) && checkModifierKeys(event, false, false, true);
  _exports.isRightShift = isRightShift;
  const isLeftShiftCtrl = event => (event.key ? event.key === "ArrowLeft" || event.key === "Left" : event.keyCode === KeyCodes.ARROW_LEFT) && checkModifierKeys(event, true, false, true);
  _exports.isLeftShiftCtrl = isLeftShiftCtrl;
  const isRightShiftCtrl = event => (event.key ? event.key === "ArrowRight" || event.key === "Right" : event.keyCode === KeyCodes.ARROW_RIGHT) && checkModifierKeys(event, true, false, true);
  _exports.isRightShiftCtrl = isRightShiftCtrl;
  const isUpShiftCtrl = event => (event.key ? event.key === "ArrowUp" || event.key === "Up" : event.keyCode === KeyCodes.ARROW_UP) && checkModifierKeys(event, true, false, true);
  _exports.isUpShiftCtrl = isUpShiftCtrl;
  const isDownShiftCtrl = event => (event.key ? event.key === "ArrowDown" || event.key === "Down" : event.keyCode === KeyCodes.ARROW_DOWN) && checkModifierKeys(event, true, false, true);
  _exports.isDownShiftCtrl = isDownShiftCtrl;
  const isHome = event => (event.key ? event.key === "Home" : event.keyCode === KeyCodes.HOME) && !hasModifierKeys(event);
  _exports.isHome = isHome;
  const isEnd = event => (event.key ? event.key === "End" : event.keyCode === KeyCodes.END) && !hasModifierKeys(event);
  _exports.isEnd = isEnd;
  const isHomeCtrl = event => (event.key ? event.key === "Home" : event.keyCode === KeyCodes.HOME) && checkModifierKeys(event, true, false, false);
  _exports.isHomeCtrl = isHomeCtrl;
  const isHomeShift = event => (event.key ? event.key === "Home" : event.keyCode === KeyCodes.HOME) && checkModifierKeys(event, false, false, true);
  _exports.isHomeShift = isHomeShift;
  const isEndCtrl = event => (event.key ? event.key === "End" : event.keyCode === KeyCodes.END) && checkModifierKeys(event, true, false, false);
  _exports.isEndCtrl = isEndCtrl;
  const isEndShift = event => (event.key ? event.key === "End" : event.keyCode === KeyCodes.END) && checkModifierKeys(event, false, false, true);
  _exports.isEndShift = isEndShift;
  const isEscape = event => (event.key ? event.key === "Escape" || event.key === "Esc" : event.keyCode === KeyCodes.ESCAPE) && !hasModifierKeys(event);
  _exports.isEscape = isEscape;
  const isTabNext = event => (event.key ? event.key === "Tab" : event.keyCode === KeyCodes.TAB) && !hasModifierKeys(event);
  _exports.isTabNext = isTabNext;
  const isTabPrevious = event => (event.key ? event.key === "Tab" : event.keyCode === KeyCodes.TAB) && checkModifierKeys(event, /* Ctrl */false, /* Alt */false, /* Shift */true);
  _exports.isTabPrevious = isTabPrevious;
  const isBackSpace = event => (event.key ? event.key === "Backspace" : event.keyCode === KeyCodes.BACKSPACE) && !hasModifierKeys(event);
  _exports.isBackSpace = isBackSpace;
  const isDelete = event => (event.key ? event.key === "Delete" : event.keyCode === KeyCodes.DELETE) && !hasModifierKeys(event);
  _exports.isDelete = isDelete;
  const isDeleteShift = event => (event.key ? event.key === "Delete" : event.keyCode === KeyCodes.DELETE) && checkModifierKeys(event, false, false, true);
  _exports.isDeleteShift = isDeleteShift;
  const isInsertShift = event => (event.key ? event.key === "Insert" : event.keyCode === KeyCodes.DELETE) && checkModifierKeys(event, false, false, true);
  _exports.isInsertShift = isInsertShift;
  const isInsertCtrl = event => (event.key ? event.key === "Insert" : event.keyCode === KeyCodes.DELETE) && checkModifierKeys(event, true, false, false);
  _exports.isInsertCtrl = isInsertCtrl;
  const isPageUp = event => (event.key ? event.key === "PageUp" : event.keyCode === KeyCodes.PAGE_UP) && !hasModifierKeys(event);
  _exports.isPageUp = isPageUp;
  const isPageDown = event => (event.key ? event.key === "PageDown" : event.keyCode === KeyCodes.PAGE_DOWN) && !hasModifierKeys(event);
  _exports.isPageDown = isPageDown;
  const isPageUpShift = event => (event.key ? event.key === "PageUp" : event.keyCode === KeyCodes.PAGE_UP) && checkModifierKeys(event, false, false, true);
  _exports.isPageUpShift = isPageUpShift;
  const isPageUpAlt = event => (event.key ? event.key === "PageUp" : event.keyCode === KeyCodes.PAGE_UP) && checkModifierKeys(event, false, true, false);
  _exports.isPageUpAlt = isPageUpAlt;
  const isPageDownShift = event => (event.key ? event.key === "PageDown" : event.keyCode === KeyCodes.PAGE_DOWN) && checkModifierKeys(event, false, false, true);
  _exports.isPageDownShift = isPageDownShift;
  const isPageDownAlt = event => (event.key ? event.key === "PageDown" : event.keyCode === KeyCodes.PAGE_DOWN) && checkModifierKeys(event, false, true, false);
  _exports.isPageDownAlt = isPageDownAlt;
  const isPageUpShiftCtrl = event => (event.key ? event.key === "PageUp" : event.keyCode === KeyCodes.PAGE_UP) && checkModifierKeys(event, true, false, true);
  _exports.isPageUpShiftCtrl = isPageUpShiftCtrl;
  const isPageDownShiftCtrl = event => (event.key ? event.key === "PageDown" : event.keyCode === KeyCodes.PAGE_DOWN) && checkModifierKeys(event, true, false, true);
  _exports.isPageDownShiftCtrl = isPageDownShiftCtrl;
  const isPlus = event => (event.key ? event.key === "+" : event.keyCode === KeyCodes.PLUS) || event.keyCode === KeyCodes.NUMPAD_PLUS && !hasModifierKeys(event);
  _exports.isPlus = isPlus;
  const isMinus = event => (event.key ? event.key === "-" : event.keyCode === KeyCodes.MINUS) || event.keyCode === KeyCodes.NUMPAD_MINUS && !hasModifierKeys(event);
  _exports.isMinus = isMinus;
  const isShow = event => {
    if (event.key) {
      return isF4(event) || isShowByArrows(event);
    }
    return event.keyCode === KeyCodes.F4 && !hasModifierKeys(event) || event.keyCode === KeyCodes.ARROW_DOWN && checkModifierKeys(event, /* Ctrl */false, /* Alt */true, /* Shift */false);
  };
  _exports.isShow = isShow;
  const isF4 = event => {
    return event.key === "F4" && !hasModifierKeys(event);
  };
  _exports.isF4 = isF4;
  const isF4Shift = event => (event.key ? event.key === "F4" : event.keyCode === KeyCodes.F4) && checkModifierKeys(event, false, false, true);
  _exports.isF4Shift = isF4Shift;
  const isF6Next = event => (event.key ? event.key === "F6" : event.keyCode === KeyCodes.F6) && checkModifierKeys(event, false, false, false) || (event.key ? event.key === "ArrowDown" || event.key === "Down" : event.keyCode === KeyCodes.ARROW_DOWN) && checkModifierKeys(event, true, true, false);
  _exports.isF6Next = isF6Next;
  const isF6Previous = event => (event.key ? event.key === "F6" : event.keyCode === KeyCodes.F6) && checkModifierKeys(event, false, false, true) || (event.key ? event.key === "ArrowUp" || event.key === "Up" : event.keyCode === KeyCodes.ARROW_UP) && checkModifierKeys(event, true, true, false);
  _exports.isF6Previous = isF6Previous;
  const isF7 = event => (event.key ? event.key === "F7" : event.keyCode === KeyCodes.F7) && !hasModifierKeys(event);
  _exports.isF7 = isF7;
  const isShowByArrows = event => {
    return (event.key === "ArrowDown" || event.key === "Down" || event.key === "ArrowUp" || event.key === "Up") && checkModifierKeys(event, /* Ctrl */false, /* Alt */true, /* Shift */false);
  };
  const isShift = event => event.key === "Shift" || event.keyCode === KeyCodes.SHIFT;
  _exports.isShift = isShift;
  const isCtrlA = event => (event.key === "A" || event.key === "a" || event.which === KeyCodes.A) && checkModifierKeys(event, true, false, false);
  _exports.isCtrlA = isCtrlA;
  const isCtrlV = event => (event.key === "V" || event.key === "v" || event.which === KeyCodes.V) && checkModifierKeys(event, true, false, false);
  _exports.isCtrlV = isCtrlV;
  const isKeyA = event => (event.key === "A" || event.key === "a" || event.which === KeyCodes.A) && checkModifierKeys(event, false, false, false);
  _exports.isKeyA = isKeyA;
  const isKeyP = event => (event.key === "P" || event.key === "p" || event.which === KeyCodes.P) && checkModifierKeys(event, false, false, false);
  _exports.isKeyP = isKeyP;
  const hasModifierKeys = event => event.shiftKey || event.altKey || getCtrlKey(event);
  const getCtrlKey = event => !!(event.metaKey || event.ctrlKey); // double negation doesn't have effect on boolean but ensures null and undefined are equivalent to false.
  const checkModifierKeys = (event, bCtrlKey, bAltKey, bShiftKey) => event.shiftKey === bShiftKey && event.altKey === bAltKey && getCtrlKey(event) === bCtrlKey;
  const isNumber = event => (event.key ? "0123456789".indexOf(event.key) !== -1 : event.keyCode >= KeyCodes.DIGIT_0 && event.keyCode <= KeyCodes.DIGIT_9) && checkModifierKeys(event, false, false, false);
  _exports.isNumber = isNumber;
  const isColon = event => (event.key ? event.key === ":" : event.keyCode === KeyCodes.COLON) && checkModifierKeys(event, false, false, true);
  _exports.isColon = isColon;
});