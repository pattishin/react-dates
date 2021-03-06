var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

import _objectAssign from 'object.assign';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

import React from 'react';
import PropTypes from 'prop-types';
import shallowCompare from 'react-addons-shallow-compare';
import momentPropTypes from 'react-moment-proptypes';
import { forbidExtraProps, mutuallyExclusiveProps, nonNegativeInteger } from 'airbnb-prop-types';
import { css, withStyles, withStylesPropTypes } from 'react-with-styles';
import moment from 'moment';
import { addEventListener } from 'consolidated-events';

import { CalendarDayPhrases } from '../defaultPhrases';
import getPhrasePropTypes from '../utils/getPhrasePropTypes';

import CalendarMonth from './CalendarMonth';

import isTransitionEndSupported from '../utils/isTransitionEndSupported';
import getTransformStyles from '../utils/getTransformStyles';
import getCalendarMonthWidth from '../utils/getCalendarMonthWidth';
import toISOMonthString from '../utils/toISOMonthString';
import isPrevMonth from '../utils/isPrevMonth';
import isNextMonth from '../utils/isNextMonth';

import ModifiersShape from '../shapes/ModifiersShape';
import ScrollableOrientationShape from '../shapes/ScrollableOrientationShape';
import DayOfWeekShape from '../shapes/DayOfWeekShape';

import { HORIZONTAL_ORIENTATION, VERTICAL_ORIENTATION, VERTICAL_SCROLLABLE, DAY_SIZE } from '../constants';

var propTypes = forbidExtraProps(_objectAssign({}, withStylesPropTypes, {
  enableOutsideDays: PropTypes.bool,
  firstVisibleMonthIndex: PropTypes.number,
  initialMonth: momentPropTypes.momentObj,
  isAnimating: PropTypes.bool,
  numberOfMonths: PropTypes.number,
  modifiers: PropTypes.objectOf(PropTypes.objectOf(ModifiersShape)),
  orientation: ScrollableOrientationShape,
  onDayClick: PropTypes.func,
  onDayMouseEnter: PropTypes.func,
  onDayMouseLeave: PropTypes.func,
  onMonthTransitionEnd: PropTypes.func,
  onMonthChange: PropTypes.func,
  onYearChange: PropTypes.func,
  renderMonthText: mutuallyExclusiveProps(PropTypes.func, 'renderMonthText', 'renderMonthElement'),
  renderCalendarDay: PropTypes.func,
  renderDayContents: PropTypes.func,
  translationValue: PropTypes.number,
  renderMonthElement: mutuallyExclusiveProps(PropTypes.func, 'renderMonthText', 'renderMonthElement'),
  daySize: nonNegativeInteger,
  focusedDate: momentPropTypes.momentObj, // indicates focusable day
  isFocused: PropTypes.bool, // indicates whether or not to move focus to focusable day
  firstDayOfWeek: DayOfWeekShape,
  setMonthTitleHeight: PropTypes.func,
  isRTL: PropTypes.bool,
  transitionDuration: nonNegativeInteger,
  verticalBorderSpacing: nonNegativeInteger,

  // i18n
  monthFormat: PropTypes.string,
  phrases: PropTypes.shape(getPhrasePropTypes(CalendarDayPhrases)),
  dayAriaLabelFormat: PropTypes.string
}));

var defaultProps = {
  enableOutsideDays: false,
  firstVisibleMonthIndex: 0,
  initialMonth: moment(),
  isAnimating: false,
  numberOfMonths: 1,
  modifiers: {},
  orientation: HORIZONTAL_ORIENTATION,
  onDayClick: function () {
    function onDayClick() {}

    return onDayClick;
  }(),
  onDayMouseEnter: function () {
    function onDayMouseEnter() {}

    return onDayMouseEnter;
  }(),
  onDayMouseLeave: function () {
    function onDayMouseLeave() {}

    return onDayMouseLeave;
  }(),
  onMonthChange: function () {
    function onMonthChange() {}

    return onMonthChange;
  }(),
  onYearChange: function () {
    function onYearChange() {}

    return onYearChange;
  }(),
  onMonthTransitionEnd: function () {
    function onMonthTransitionEnd() {}

    return onMonthTransitionEnd;
  }(),

  renderMonthText: null,
  renderCalendarDay: undefined,
  renderDayContents: null,
  translationValue: null,
  renderMonthElement: null,
  daySize: DAY_SIZE,
  focusedDate: null,
  isFocused: false,
  firstDayOfWeek: null,
  setMonthTitleHeight: null,
  isRTL: false,
  transitionDuration: 200,
  verticalBorderSpacing: undefined,

  // i18n
  monthFormat: 'MMMM YYYY', // english locale
  phrases: CalendarDayPhrases,
  dayAriaLabelFormat: undefined
};

function getMonths(initialMonth, numberOfMonths, withoutTransitionMonths) {
  var month = initialMonth.clone();
  if (!withoutTransitionMonths) month = month.subtract(1, 'month');

  var months = [];
  for (var i = 0; i < (withoutTransitionMonths ? numberOfMonths : numberOfMonths + 2); i += 1) {
    months.push(month);
    month = month.clone().add(1, 'month');
  }

  return months;
}

var CalendarMonthGrid = function (_React$Component) {
  _inherits(CalendarMonthGrid, _React$Component);

  function CalendarMonthGrid(props) {
    _classCallCheck(this, CalendarMonthGrid);

    var _this = _possibleConstructorReturn(this, (CalendarMonthGrid.__proto__ || Object.getPrototypeOf(CalendarMonthGrid)).call(this, props));

    var withoutTransitionMonths = props.orientation === VERTICAL_SCROLLABLE;
    _this.state = {
      months: getMonths(props.initialMonth, props.numberOfMonths, withoutTransitionMonths)
    };

    _this.isTransitionEndSupported = isTransitionEndSupported();
    _this.onTransitionEnd = _this.onTransitionEnd.bind(_this);
    _this.setContainerRef = _this.setContainerRef.bind(_this);

    _this.locale = moment.locale();
    _this.onMonthSelect = _this.onMonthSelect.bind(_this);
    _this.onYearSelect = _this.onYearSelect.bind(_this);
    return _this;
  }

  _createClass(CalendarMonthGrid, [{
    key: 'componentDidMount',
    value: function () {
      function componentDidMount() {
        this.removeEventListener = addEventListener(this.container, 'transitionend', this.onTransitionEnd);
      }

      return componentDidMount;
    }()
  }, {
    key: 'componentWillReceiveProps',
    value: function () {
      function componentWillReceiveProps(nextProps) {
        var _this2 = this;

        var initialMonth = nextProps.initialMonth,
            numberOfMonths = nextProps.numberOfMonths,
            orientation = nextProps.orientation;
        var months = this.state.months;
        var _props = this.props,
            prevInitialMonth = _props.initialMonth,
            prevNumberOfMonths = _props.numberOfMonths;

        var hasMonthChanged = !prevInitialMonth.isSame(initialMonth, 'month');
        var hasNumberOfMonthsChanged = prevNumberOfMonths !== numberOfMonths;
        var newMonths = months;

        if (hasMonthChanged && !hasNumberOfMonthsChanged) {
          if (isNextMonth(prevInitialMonth, initialMonth)) {
            newMonths = months.slice(1);
            newMonths.push(months[months.length - 1].clone().add(1, 'month'));
          } else if (isPrevMonth(prevInitialMonth, initialMonth)) {
            newMonths = months.slice(0, months.length - 1);
            newMonths.unshift(months[0].clone().subtract(1, 'month'));
          } else {
            var withoutTransitionMonths = orientation === VERTICAL_SCROLLABLE;
            newMonths = getMonths(initialMonth, numberOfMonths, withoutTransitionMonths);
          }
        }

        if (hasNumberOfMonthsChanged) {
          var _withoutTransitionMonths = orientation === VERTICAL_SCROLLABLE;
          newMonths = getMonths(initialMonth, numberOfMonths, _withoutTransitionMonths);
        }

        var momentLocale = moment.locale();
        if (this.locale !== momentLocale) {
          this.locale = momentLocale;
          newMonths = newMonths.map(function (m) {
            return m.locale(_this2.locale);
          });
        }

        this.setState({
          months: newMonths
        });
      }

      return componentWillReceiveProps;
    }()
  }, {
    key: 'shouldComponentUpdate',
    value: function () {
      function shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
      }

      return shouldComponentUpdate;
    }()
  }, {
    key: 'componentDidUpdate',
    value: function () {
      function componentDidUpdate() {
        var _props2 = this.props,
            isAnimating = _props2.isAnimating,
            transitionDuration = _props2.transitionDuration,
            onMonthTransitionEnd = _props2.onMonthTransitionEnd;

        // For IE9, immediately call onMonthTransitionEnd instead of
        // waiting for the animation to complete. Similarly, if transitionDuration
        // is set to 0, also immediately invoke the onMonthTransitionEnd callback

        if ((!this.isTransitionEndSupported || !transitionDuration) && isAnimating) {
          onMonthTransitionEnd();
        }
      }

      return componentDidUpdate;
    }()
  }, {
    key: 'componentWillUnmount',
    value: function () {
      function componentWillUnmount() {
        if (this.removeEventListener) this.removeEventListener();
      }

      return componentWillUnmount;
    }()
  }, {
    key: 'onTransitionEnd',
    value: function () {
      function onTransitionEnd() {
        var onMonthTransitionEnd = this.props.onMonthTransitionEnd;

        onMonthTransitionEnd();
      }

      return onTransitionEnd;
    }()
  }, {
    key: 'onMonthSelect',
    value: function () {
      function onMonthSelect(currentMonth, newMonthVal) {
        var newMonth = currentMonth.clone();
        var _props3 = this.props,
            onMonthChange = _props3.onMonthChange,
            orientation = _props3.orientation;
        var months = this.state.months;

        var withoutTransitionMonths = orientation === VERTICAL_SCROLLABLE;
        var initialMonthSubtraction = months.indexOf(currentMonth);
        if (!withoutTransitionMonths) {
          initialMonthSubtraction -= 1;
        }
        newMonth.set('month', newMonthVal).subtract(initialMonthSubtraction, 'months');
        onMonthChange(newMonth);
      }

      return onMonthSelect;
    }()
  }, {
    key: 'onYearSelect',
    value: function () {
      function onYearSelect(currentMonth, newYearVal) {
        var newMonth = currentMonth.clone();
        var _props4 = this.props,
            onYearChange = _props4.onYearChange,
            orientation = _props4.orientation;
        var months = this.state.months;

        var withoutTransitionMonths = orientation === VERTICAL_SCROLLABLE;
        var initialMonthSubtraction = months.indexOf(currentMonth);
        if (!withoutTransitionMonths) {
          initialMonthSubtraction -= 1;
        }
        newMonth.set('year', newYearVal).subtract(initialMonthSubtraction, 'months');
        onYearChange(newMonth);
      }

      return onYearSelect;
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
    key: 'render',
    value: function () {
      function render() {
        var _this3 = this;

        var _props5 = this.props,
            enableOutsideDays = _props5.enableOutsideDays,
            firstVisibleMonthIndex = _props5.firstVisibleMonthIndex,
            isAnimating = _props5.isAnimating,
            modifiers = _props5.modifiers,
            numberOfMonths = _props5.numberOfMonths,
            monthFormat = _props5.monthFormat,
            orientation = _props5.orientation,
            translationValue = _props5.translationValue,
            daySize = _props5.daySize,
            onDayMouseEnter = _props5.onDayMouseEnter,
            onDayMouseLeave = _props5.onDayMouseLeave,
            onDayClick = _props5.onDayClick,
            renderMonthText = _props5.renderMonthText,
            renderCalendarDay = _props5.renderCalendarDay,
            renderDayContents = _props5.renderDayContents,
            renderMonthElement = _props5.renderMonthElement,
            onMonthTransitionEnd = _props5.onMonthTransitionEnd,
            firstDayOfWeek = _props5.firstDayOfWeek,
            focusedDate = _props5.focusedDate,
            isFocused = _props5.isFocused,
            isRTL = _props5.isRTL,
            styles = _props5.styles,
            phrases = _props5.phrases,
            dayAriaLabelFormat = _props5.dayAriaLabelFormat,
            transitionDuration = _props5.transitionDuration,
            verticalBorderSpacing = _props5.verticalBorderSpacing,
            setMonthTitleHeight = _props5.setMonthTitleHeight;
        var months = this.state.months;

        var isVertical = orientation === VERTICAL_ORIENTATION;
        var isVerticalScrollable = orientation === VERTICAL_SCROLLABLE;
        var isHorizontal = orientation === HORIZONTAL_ORIENTATION;

        var calendarMonthWidth = getCalendarMonthWidth(daySize);

        var width = isVertical || isVerticalScrollable ? calendarMonthWidth : (numberOfMonths + 2) * calendarMonthWidth;

        var transformType = isVertical || isVerticalScrollable ? 'translateY' : 'translateX';
        var transformValue = transformType + '(' + String(translationValue) + 'px)';

        return React.createElement(
          'div',
          _extends({}, css(styles.CalendarMonthGrid, isHorizontal && styles.CalendarMonthGrid__horizontal, isVertical && styles.CalendarMonthGrid__vertical, isVerticalScrollable && styles.CalendarMonthGrid__vertical_scrollable, isAnimating && styles.CalendarMonthGrid__animating, isAnimating && transitionDuration && {
            transition: 'transform ' + String(transitionDuration) + 'ms ease-in-out'
          }, _objectAssign({}, getTransformStyles(transformValue), {
            width: width
          })), {
            ref: this.setContainerRef,
            onTransitionEnd: onMonthTransitionEnd
          }),
          months.map(function (month, i) {
            var isVisible = i >= firstVisibleMonthIndex && i < firstVisibleMonthIndex + numberOfMonths;
            var hideForAnimation = i === 0 && !isVisible;
            var showForAnimation = i === 0 && isAnimating && isVisible;
            var monthString = toISOMonthString(month);
            return React.createElement(
              'div',
              _extends({
                key: monthString
              }, css(isHorizontal && styles.CalendarMonthGrid_month__horizontal, hideForAnimation && styles.CalendarMonthGrid_month__hideForAnimation, showForAnimation && !isVertical && !isRTL && {
                position: 'absolute',
                left: -calendarMonthWidth
              }, showForAnimation && !isVertical && isRTL && {
                position: 'absolute',
                right: 0
              }, showForAnimation && isVertical && {
                position: 'absolute',
                top: -translationValue
              }, !isVisible && !isAnimating && styles.CalendarMonthGrid_month__hidden)),
              React.createElement(CalendarMonth, {
                month: month,
                isVisible: isVisible,
                enableOutsideDays: enableOutsideDays,
                modifiers: modifiers[monthString],
                monthFormat: monthFormat,
                orientation: orientation,
                onDayMouseEnter: onDayMouseEnter,
                onDayMouseLeave: onDayMouseLeave,
                onDayClick: onDayClick,
                onMonthSelect: _this3.onMonthSelect,
                onYearSelect: _this3.onYearSelect,
                renderMonthText: renderMonthText,
                renderCalendarDay: renderCalendarDay,
                renderDayContents: renderDayContents,
                renderMonthElement: renderMonthElement,
                firstDayOfWeek: firstDayOfWeek,
                daySize: daySize,
                focusedDate: isVisible ? focusedDate : null,
                isFocused: isFocused,
                phrases: phrases,
                setMonthTitleHeight: setMonthTitleHeight,
                dayAriaLabelFormat: dayAriaLabelFormat,
                verticalBorderSpacing: verticalBorderSpacing
              })
            );
          })
        );
      }

      return render;
    }()
  }]);

  return CalendarMonthGrid;
}(React.Component);

CalendarMonthGrid.propTypes = propTypes;
CalendarMonthGrid.defaultProps = defaultProps;

export default withStyles(function (_ref) {
  var _ref$reactDates = _ref.reactDates,
      color = _ref$reactDates.color,
      zIndex = _ref$reactDates.zIndex;
  return {
    CalendarMonthGrid: {
      background: color.background,
      textAlign: 'left',
      zIndex: zIndex
    },

    CalendarMonthGrid__animating: {
      zIndex: zIndex + 1
    },

    CalendarMonthGrid__horizontal: {
      position: 'absolute',
      left: 9
    },

    CalendarMonthGrid__vertical: {
      margin: '0 auto'
    },

    CalendarMonthGrid__vertical_scrollable: {
      margin: '0 auto',
      overflowY: 'scroll'
    },

    CalendarMonthGrid_month__horizontal: {
      display: 'inline-block',
      verticalAlign: 'top',
      minHeight: '100%'
    },

    CalendarMonthGrid_month__hideForAnimation: {
      position: 'absolute',
      zIndex: zIndex - 1,
      opacity: 0,
      pointerEvents: 'none'
    },

    CalendarMonthGrid_month__hidden: {
      visibility: 'hidden'
    }
  };
})(CalendarMonthGrid);