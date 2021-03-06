var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

import _objectAssign from 'object.assign';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import moment from 'moment';
import { css, withStyles, withStylesPropTypes } from 'react-with-styles';
import { Portal } from 'react-portal';
import { forbidExtraProps } from 'airbnb-prop-types';
import { addEventListener } from 'consolidated-events';
import isTouchDevice from 'is-touch-device';
import OutsideClickHandler from 'react-outside-click-handler';

import SingleDatePickerShape from '../shapes/SingleDatePickerShape';
import { SingleDatePickerPhrases } from '../defaultPhrases';

import toMomentObject from '../utils/toMomentObject';
import toLocalizedDateString from '../utils/toLocalizedDateString';
import getResponsiveContainerStyles from '../utils/getResponsiveContainerStyles';
import getDetachedContainerStyles from '../utils/getDetachedContainerStyles';
import getInputHeight from '../utils/getInputHeight';
import isInclusivelyAfterDay from '../utils/isInclusivelyAfterDay';
import _disableScroll from '../utils/disableScroll';

import SingleDatePickerInput from './SingleDatePickerInput';
import DayPickerSingleDateController from './DayPickerSingleDateController';
import CloseButton from './CloseButton';

import { HORIZONTAL_ORIENTATION, VERTICAL_ORIENTATION, ANCHOR_LEFT, ANCHOR_RIGHT, OPEN_DOWN, OPEN_UP, DAY_SIZE, ICON_BEFORE_POSITION, INFO_POSITION_BOTTOM, FANG_HEIGHT_PX, DEFAULT_VERTICAL_SPACING } from '../constants';

var propTypes = forbidExtraProps(_objectAssign({}, withStylesPropTypes, SingleDatePickerShape));

var defaultProps = {
  // required props for a functional interactive SingleDatePicker
  date: null,
  focused: false,

  // input related props
  id: 'date',
  placeholder: 'Date',
  disabled: false,
  required: false,
  readOnly: false,
  screenReaderInputMessage: '',
  showClearDate: false,
  showDefaultInputIcon: false,
  inputIconPosition: ICON_BEFORE_POSITION,
  customInputIcon: null,
  customCloseIcon: null,
  noBorder: false,
  block: false,
  small: false,
  regular: false,
  verticalSpacing: DEFAULT_VERTICAL_SPACING,
  keepFocusOnInput: false,

  // calendar presentation and interaction related props
  orientation: HORIZONTAL_ORIENTATION,
  anchorDirection: ANCHOR_LEFT,
  openDirection: OPEN_DOWN,
  horizontalMargin: 0,
  withPortal: false,
  withFullScreenPortal: false,
  appendToBody: false,
  disableScroll: false,
  initialVisibleMonth: null,
  firstDayOfWeek: null,
  numberOfMonths: 2,
  keepOpenOnDateSelect: false,
  reopenPickerOnClearDate: false,
  renderCalendarInfo: null,
  calendarInfoPosition: INFO_POSITION_BOTTOM,
  hideKeyboardShortcutsPanel: false,
  daySize: DAY_SIZE,
  isRTL: false,
  verticalHeight: null,
  transitionDuration: undefined,

  // navigation related props
  navPrev: null,
  navNext: null,

  onPrevMonthClick: function () {
    function onPrevMonthClick() {}

    return onPrevMonthClick;
  }(),
  onNextMonthClick: function () {
    function onNextMonthClick() {}

    return onNextMonthClick;
  }(),
  onClose: function () {
    function onClose() {}

    return onClose;
  }(),


  // month presentation and interaction related props
  renderMonthText: null,

  // day presentation and interaction related props
  renderCalendarDay: undefined,
  renderDayContents: null,
  renderMonthElement: null,
  enableOutsideDays: false,
  isDayBlocked: function () {
    function isDayBlocked() {
      return false;
    }

    return isDayBlocked;
  }(),
  isOutsideRange: function () {
    function isOutsideRange(day) {
      return !isInclusivelyAfterDay(day, moment());
    }

    return isOutsideRange;
  }(),
  isDayHighlighted: function () {
    function isDayHighlighted() {}

    return isDayHighlighted;
  }(),

  // internationalization props
  displayFormat: function () {
    function displayFormat() {
      return moment.localeData().longDateFormat('L');
    }

    return displayFormat;
  }(),
  monthFormat: 'MMMM YYYY',
  weekDayFormat: 'dd',
  phrases: SingleDatePickerPhrases,
  dayAriaLabelFormat: undefined
};

var SingleDatePicker = function (_React$Component) {
  _inherits(SingleDatePicker, _React$Component);

  function SingleDatePicker(props) {
    _classCallCheck(this, SingleDatePicker);

    var _this = _possibleConstructorReturn(this, (SingleDatePicker.__proto__ || Object.getPrototypeOf(SingleDatePicker)).call(this, props));

    _this.isTouchDevice = false;

    _this.state = {
      dayPickerContainerStyles: {},
      isDayPickerFocused: false,
      isInputFocused: false,
      showKeyboardShortcuts: false
    };

    _this.onDayPickerFocus = _this.onDayPickerFocus.bind(_this);
    _this.onDayPickerBlur = _this.onDayPickerBlur.bind(_this);
    _this.showKeyboardShortcutsPanel = _this.showKeyboardShortcutsPanel.bind(_this);

    _this.onChange = _this.onChange.bind(_this);
    _this.onFocus = _this.onFocus.bind(_this);
    _this.onClearFocus = _this.onClearFocus.bind(_this);
    _this.clearDate = _this.clearDate.bind(_this);

    _this.responsivizePickerPosition = _this.responsivizePickerPosition.bind(_this);
    _this.disableScroll = _this.disableScroll.bind(_this);

    _this.setDayPickerContainerRef = _this.setDayPickerContainerRef.bind(_this);
    _this.setContainerRef = _this.setContainerRef.bind(_this);
    return _this;
  }

  /* istanbul ignore next */


  _createClass(SingleDatePicker, [{
    key: 'componentDidMount',
    value: function () {
      function componentDidMount() {
        this.removeEventListener = addEventListener(window, 'resize', this.responsivizePickerPosition, { passive: true });
        this.responsivizePickerPosition();
        this.disableScroll();

        var focused = this.props.focused;


        if (focused) {
          this.setState({
            isInputFocused: true
          });
        }

        this.isTouchDevice = isTouchDevice();
      }

      return componentDidMount;
    }()
  }, {
    key: 'componentDidUpdate',
    value: function () {
      function componentDidUpdate(prevProps) {
        var focused = this.props.focused;

        if (!prevProps.focused && focused) {
          this.responsivizePickerPosition();
          this.disableScroll();
        } else if (prevProps.focused && !focused) {
          if (this.enableScroll) this.enableScroll();
        }
      }

      return componentDidUpdate;
    }()

    /* istanbul ignore next */

  }, {
    key: 'componentWillUnmount',
    value: function () {
      function componentWillUnmount() {
        if (this.removeEventListener) this.removeEventListener();
        if (this.enableScroll) this.enableScroll();
      }

      return componentWillUnmount;
    }()
  }, {
    key: 'onChange',
    value: function () {
      function onChange(dateString) {
        var _props = this.props,
            isOutsideRange = _props.isOutsideRange,
            keepOpenOnDateSelect = _props.keepOpenOnDateSelect,
            onDateChange = _props.onDateChange,
            onFocusChange = _props.onFocusChange,
            onClose = _props.onClose;

        var newDate = toMomentObject(dateString, this.getDisplayFormat());

        var isValid = newDate && !isOutsideRange(newDate);
        if (isValid) {
          onDateChange(newDate);
          if (!keepOpenOnDateSelect) {
            onFocusChange({ focused: false });
            onClose({ date: newDate });
          }
        } else {
          onDateChange(null);
        }
      }

      return onChange;
    }()
  }, {
    key: 'onFocus',
    value: function () {
      function onFocus() {
        var _props2 = this.props,
            disabled = _props2.disabled,
            onFocusChange = _props2.onFocusChange,
            readOnly = _props2.readOnly,
            withPortal = _props2.withPortal,
            withFullScreenPortal = _props2.withFullScreenPortal,
            keepFocusOnInput = _props2.keepFocusOnInput;


        var withAnyPortal = withPortal || withFullScreenPortal;
        var moveFocusToDayPicker = withAnyPortal || readOnly && !keepFocusOnInput || this.isTouchDevice && !keepFocusOnInput;

        if (moveFocusToDayPicker) {
          this.onDayPickerFocus();
        } else {
          this.onDayPickerBlur();
        }

        if (!withAnyPortal) {
          this.responsivizePickerPosition();
        }

        if (!disabled) {
          onFocusChange({ focused: true });
        }
      }

      return onFocus;
    }()
  }, {
    key: 'onClearFocus',
    value: function () {
      function onClearFocus(event) {
        var _props3 = this.props,
            date = _props3.date,
            focused = _props3.focused,
            onFocusChange = _props3.onFocusChange,
            onClose = _props3.onClose,
            appendToBody = _props3.appendToBody;

        if (!focused) return;
        if (appendToBody && this.dayPickerContainer.contains(event.target)) return;

        this.setState({
          isInputFocused: false,
          isDayPickerFocused: false
        });

        onFocusChange({ focused: false });
        onClose({ date: date });
      }

      return onClearFocus;
    }()
  }, {
    key: 'onDayPickerFocus',
    value: function () {
      function onDayPickerFocus() {
        this.setState({
          isInputFocused: false,
          isDayPickerFocused: true,
          showKeyboardShortcuts: false
        });
      }

      return onDayPickerFocus;
    }()
  }, {
    key: 'onDayPickerBlur',
    value: function () {
      function onDayPickerBlur() {
        this.setState({
          isInputFocused: true,
          isDayPickerFocused: false,
          showKeyboardShortcuts: false
        });
      }

      return onDayPickerBlur;
    }()
  }, {
    key: 'getDateString',
    value: function () {
      function getDateString(date) {
        var displayFormat = this.getDisplayFormat();
        if (date && displayFormat) {
          return date && date.format(displayFormat);
        }
        return toLocalizedDateString(date);
      }

      return getDateString;
    }()
  }, {
    key: 'getDisplayFormat',
    value: function () {
      function getDisplayFormat() {
        var displayFormat = this.props.displayFormat;

        return typeof displayFormat === 'string' ? displayFormat : displayFormat();
      }

      return getDisplayFormat;
    }()
  }, {
    key: 'setDayPickerContainerRef',
    value: function () {
      function setDayPickerContainerRef(ref) {
        this.dayPickerContainer = ref;
      }

      return setDayPickerContainerRef;
    }()
  }, {
    key: 'setContainerRef',
    value: function () {
      function setContainerRef(ref) {
        this.container = ref;
      }

      return setContainerRef;
    }()
  }, {
    key: 'clearDate',
    value: function () {
      function clearDate() {
        var _props4 = this.props,
            onDateChange = _props4.onDateChange,
            reopenPickerOnClearDate = _props4.reopenPickerOnClearDate,
            onFocusChange = _props4.onFocusChange;

        onDateChange(null);
        if (reopenPickerOnClearDate) {
          onFocusChange({ focused: true });
        }
      }

      return clearDate;
    }()
  }, {
    key: 'disableScroll',
    value: function () {
      function disableScroll() {
        var _props5 = this.props,
            appendToBody = _props5.appendToBody,
            propDisableScroll = _props5.disableScroll,
            focused = _props5.focused;

        if (!appendToBody && !propDisableScroll) return;
        if (!focused) return;

        // Disable scroll for every ancestor of this <SingleDatePicker> up to the
        // document level. This ensures the input and the picker never move. Other
        // sibling elements or the picker itself can scroll.
        this.enableScroll = _disableScroll(this.container);
      }

      return disableScroll;
    }()

    /* istanbul ignore next */

  }, {
    key: 'responsivizePickerPosition',
    value: function () {
      function responsivizePickerPosition() {
        // It's possible the portal props have been changed in response to window resizes
        // So let's ensure we reset this back to the base state each time
        this.setState({ dayPickerContainerStyles: {} });

        var _props6 = this.props,
            openDirection = _props6.openDirection,
            anchorDirection = _props6.anchorDirection,
            horizontalMargin = _props6.horizontalMargin,
            withPortal = _props6.withPortal,
            withFullScreenPortal = _props6.withFullScreenPortal,
            appendToBody = _props6.appendToBody,
            focused = _props6.focused;
        var dayPickerContainerStyles = this.state.dayPickerContainerStyles;


        if (!focused) {
          return;
        }

        var isAnchoredLeft = anchorDirection === ANCHOR_LEFT;

        if (!withPortal && !withFullScreenPortal) {
          var containerRect = this.dayPickerContainer.getBoundingClientRect();
          var currentOffset = dayPickerContainerStyles[anchorDirection] || 0;
          var containerEdge = isAnchoredLeft ? containerRect[ANCHOR_RIGHT] : containerRect[ANCHOR_LEFT];

          this.setState({
            dayPickerContainerStyles: _objectAssign({}, getResponsiveContainerStyles(anchorDirection, currentOffset, containerEdge, horizontalMargin), appendToBody && getDetachedContainerStyles(openDirection, anchorDirection, this.container))
          });
        }
      }

      return responsivizePickerPosition;
    }()
  }, {
    key: 'showKeyboardShortcutsPanel',
    value: function () {
      function showKeyboardShortcutsPanel() {
        this.setState({
          isInputFocused: false,
          isDayPickerFocused: true,
          showKeyboardShortcuts: true
        });
      }

      return showKeyboardShortcutsPanel;
    }()
  }, {
    key: 'maybeRenderDayPickerWithPortal',
    value: function () {
      function maybeRenderDayPickerWithPortal() {
        var _props7 = this.props,
            focused = _props7.focused,
            withPortal = _props7.withPortal,
            withFullScreenPortal = _props7.withFullScreenPortal,
            appendToBody = _props7.appendToBody;


        if (!focused) {
          return null;
        }

        if (withPortal || withFullScreenPortal || appendToBody) {
          return React.createElement(
            Portal,
            null,
            this.renderDayPicker()
          );
        }

        return this.renderDayPicker();
      }

      return maybeRenderDayPickerWithPortal;
    }()
  }, {
    key: 'renderDayPicker',
    value: function () {
      function renderDayPicker() {
        var _props8 = this.props,
            anchorDirection = _props8.anchorDirection,
            openDirection = _props8.openDirection,
            onDateChange = _props8.onDateChange,
            date = _props8.date,
            onFocusChange = _props8.onFocusChange,
            focused = _props8.focused,
            enableOutsideDays = _props8.enableOutsideDays,
            numberOfMonths = _props8.numberOfMonths,
            orientation = _props8.orientation,
            monthFormat = _props8.monthFormat,
            navPrev = _props8.navPrev,
            navNext = _props8.navNext,
            onPrevMonthClick = _props8.onPrevMonthClick,
            onNextMonthClick = _props8.onNextMonthClick,
            onClose = _props8.onClose,
            withPortal = _props8.withPortal,
            withFullScreenPortal = _props8.withFullScreenPortal,
            keepOpenOnDateSelect = _props8.keepOpenOnDateSelect,
            initialVisibleMonth = _props8.initialVisibleMonth,
            renderMonthText = _props8.renderMonthText,
            renderCalendarDay = _props8.renderCalendarDay,
            renderDayContents = _props8.renderDayContents,
            renderCalendarInfo = _props8.renderCalendarInfo,
            renderMonthElement = _props8.renderMonthElement,
            calendarInfoPosition = _props8.calendarInfoPosition,
            hideKeyboardShortcutsPanel = _props8.hideKeyboardShortcutsPanel,
            firstDayOfWeek = _props8.firstDayOfWeek,
            customCloseIcon = _props8.customCloseIcon,
            phrases = _props8.phrases,
            dayAriaLabelFormat = _props8.dayAriaLabelFormat,
            daySize = _props8.daySize,
            isRTL = _props8.isRTL,
            isOutsideRange = _props8.isOutsideRange,
            isDayBlocked = _props8.isDayBlocked,
            isDayHighlighted = _props8.isDayHighlighted,
            weekDayFormat = _props8.weekDayFormat,
            styles = _props8.styles,
            verticalHeight = _props8.verticalHeight,
            transitionDuration = _props8.transitionDuration,
            verticalSpacing = _props8.verticalSpacing,
            small = _props8.small,
            reactDates = _props8.theme.reactDates;
        var _state = this.state,
            dayPickerContainerStyles = _state.dayPickerContainerStyles,
            isDayPickerFocused = _state.isDayPickerFocused,
            showKeyboardShortcuts = _state.showKeyboardShortcuts;


        var onOutsideClick = !withFullScreenPortal && withPortal ? this.onClearFocus : undefined;
        var closeIcon = customCloseIcon || React.createElement(CloseButton, null);

        var inputHeight = getInputHeight(reactDates, small);

        var withAnyPortal = withPortal || withFullScreenPortal;

        return React.createElement(
          'div',
          _extends({ // eslint-disable-line jsx-a11y/no-static-element-interactions
            ref: this.setDayPickerContainerRef
          }, css(styles.SingleDatePicker_picker, anchorDirection === ANCHOR_LEFT && styles.SingleDatePicker_picker__directionLeft, anchorDirection === ANCHOR_RIGHT && styles.SingleDatePicker_picker__directionRight, openDirection === OPEN_DOWN && styles.SingleDatePicker_picker__openDown, openDirection === OPEN_UP && styles.SingleDatePicker_picker__openUp, !withAnyPortal && openDirection === OPEN_DOWN && {
            top: inputHeight + verticalSpacing
          }, !withAnyPortal && openDirection === OPEN_UP && {
            bottom: inputHeight + verticalSpacing
          }, orientation === HORIZONTAL_ORIENTATION && styles.SingleDatePicker_picker__horizontal, orientation === VERTICAL_ORIENTATION && styles.SingleDatePicker_picker__vertical, withAnyPortal && styles.SingleDatePicker_picker__portal, withFullScreenPortal && styles.SingleDatePicker_picker__fullScreenPortal, isRTL && styles.SingleDatePicker_picker__rtl, dayPickerContainerStyles), {
            onClick: onOutsideClick
          }),
          React.createElement(DayPickerSingleDateController, {
            date: date,
            onDateChange: onDateChange,
            onFocusChange: onFocusChange,
            orientation: orientation,
            enableOutsideDays: enableOutsideDays,
            numberOfMonths: numberOfMonths,
            monthFormat: monthFormat,
            withPortal: withAnyPortal,
            focused: focused,
            keepOpenOnDateSelect: keepOpenOnDateSelect,
            hideKeyboardShortcutsPanel: hideKeyboardShortcutsPanel,
            initialVisibleMonth: initialVisibleMonth,
            navPrev: navPrev,
            navNext: navNext,
            onPrevMonthClick: onPrevMonthClick,
            onNextMonthClick: onNextMonthClick,
            onClose: onClose,
            renderMonthText: renderMonthText,
            renderCalendarDay: renderCalendarDay,
            renderDayContents: renderDayContents,
            renderCalendarInfo: renderCalendarInfo,
            renderMonthElement: renderMonthElement,
            calendarInfoPosition: calendarInfoPosition,
            isFocused: isDayPickerFocused,
            showKeyboardShortcuts: showKeyboardShortcuts,
            onBlur: this.onDayPickerBlur,
            phrases: phrases,
            dayAriaLabelFormat: dayAriaLabelFormat,
            daySize: daySize,
            isRTL: isRTL,
            isOutsideRange: isOutsideRange,
            isDayBlocked: isDayBlocked,
            isDayHighlighted: isDayHighlighted,
            firstDayOfWeek: firstDayOfWeek,
            weekDayFormat: weekDayFormat,
            verticalHeight: verticalHeight,
            transitionDuration: transitionDuration
          }),
          withFullScreenPortal && React.createElement(
            'button',
            _extends({}, css(styles.SingleDatePicker_closeButton), {
              'aria-label': phrases.closeDatePicker,
              type: 'button',
              onClick: this.onClearFocus
            }),
            React.createElement(
              'div',
              css(styles.SingleDatePicker_closeButton_svg),
              closeIcon
            )
          )
        );
      }

      return renderDayPicker;
    }()
  }, {
    key: 'render',
    value: function () {
      function render() {
        var _props9 = this.props,
            id = _props9.id,
            placeholder = _props9.placeholder,
            disabled = _props9.disabled,
            focused = _props9.focused,
            required = _props9.required,
            readOnly = _props9.readOnly,
            openDirection = _props9.openDirection,
            showClearDate = _props9.showClearDate,
            showDefaultInputIcon = _props9.showDefaultInputIcon,
            inputIconPosition = _props9.inputIconPosition,
            customCloseIcon = _props9.customCloseIcon,
            customInputIcon = _props9.customInputIcon,
            date = _props9.date,
            phrases = _props9.phrases,
            withPortal = _props9.withPortal,
            withFullScreenPortal = _props9.withFullScreenPortal,
            screenReaderInputMessage = _props9.screenReaderInputMessage,
            isRTL = _props9.isRTL,
            noBorder = _props9.noBorder,
            block = _props9.block,
            small = _props9.small,
            regular = _props9.regular,
            verticalSpacing = _props9.verticalSpacing,
            styles = _props9.styles;
        var isInputFocused = this.state.isInputFocused;


        var displayValue = this.getDateString(date);

        var enableOutsideClick = !withPortal && !withFullScreenPortal;

        var hideFang = verticalSpacing < FANG_HEIGHT_PX;

        var input = React.createElement(SingleDatePickerInput, {
          id: id,
          placeholder: placeholder,
          focused: focused,
          isFocused: isInputFocused,
          disabled: disabled,
          required: required,
          readOnly: readOnly,
          openDirection: openDirection,
          showCaret: !withPortal && !withFullScreenPortal && !hideFang,
          onClearDate: this.clearDate,
          showClearDate: showClearDate,
          showDefaultInputIcon: showDefaultInputIcon,
          inputIconPosition: inputIconPosition,
          customCloseIcon: customCloseIcon,
          customInputIcon: customInputIcon,
          displayValue: displayValue,
          onChange: this.onChange,
          onFocus: this.onFocus,
          onKeyDownShiftTab: this.onClearFocus,
          onKeyDownTab: this.onClearFocus,
          onKeyDownArrowDown: this.onDayPickerFocus,
          onKeyDownQuestionMark: this.showKeyboardShortcutsPanel,
          screenReaderMessage: screenReaderInputMessage,
          phrases: phrases,
          isRTL: isRTL,
          noBorder: noBorder,
          block: block,
          small: small,
          regular: regular,
          verticalSpacing: verticalSpacing
        });

        return React.createElement(
          'div',
          _extends({
            ref: this.setContainerRef
          }, css(styles.SingleDatePicker, block && styles.SingleDatePicker__block)),
          enableOutsideClick && React.createElement(
            OutsideClickHandler,
            { onOutsideClick: this.onClearFocus },
            input,
            this.maybeRenderDayPickerWithPortal()
          ),
          !enableOutsideClick && input,
          !enableOutsideClick && this.maybeRenderDayPickerWithPortal()
        );
      }

      return render;
    }()
  }]);

  return SingleDatePicker;
}(React.Component);

SingleDatePicker.propTypes = propTypes;
SingleDatePicker.defaultProps = defaultProps;

export { SingleDatePicker as PureSingleDatePicker };
export default withStyles(function (_ref) {
  var _ref$reactDates = _ref.reactDates,
      color = _ref$reactDates.color,
      zIndex = _ref$reactDates.zIndex;
  return {
    SingleDatePicker: {
      position: 'relative',
      display: 'inline-block'
    },

    SingleDatePicker__block: {
      display: 'block'
    },

    SingleDatePicker_picker: {
      zIndex: zIndex + 1,
      backgroundColor: color.background,
      position: 'absolute'
    },

    SingleDatePicker_picker__rtl: {
      direction: 'rtl'
    },

    SingleDatePicker_picker__directionLeft: {
      left: 0
    },

    SingleDatePicker_picker__directionRight: {
      right: 0
    },

    SingleDatePicker_picker__portal: {
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      position: 'fixed',
      top: 0,
      left: 0,
      height: '100%',
      width: '100%'
    },

    SingleDatePicker_picker__fullScreenPortal: {
      backgroundColor: color.background
    },

    SingleDatePicker_closeButton: {
      background: 'none',
      border: 0,
      color: 'inherit',
      font: 'inherit',
      lineHeight: 'normal',
      overflow: 'visible',
      cursor: 'pointer',

      position: 'absolute',
      top: 0,
      right: 0,
      padding: 15,
      zIndex: zIndex + 2,

      ':hover': {
        color: 'darken(' + String(color.core.grayLighter) + ', 10%)',
        textDecoration: 'none'
      },

      ':focus': {
        color: 'darken(' + String(color.core.grayLighter) + ', 10%)',
        textDecoration: 'none'
      }
    },

    SingleDatePicker_closeButton_svg: {
      height: 15,
      width: 15,
      fill: color.core.grayLighter
    }
  };
})(SingleDatePicker);