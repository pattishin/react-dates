var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

import _objectAssign from 'object.assign';

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* eslint react/no-array-index-key: 0 */

import React from 'react';
import PropTypes from 'prop-types';
import shallowCompare from 'react-addons-shallow-compare';
import momentPropTypes from 'react-moment-proptypes';
import { forbidExtraProps, mutuallyExclusiveProps, nonNegativeInteger } from 'airbnb-prop-types';
import { css, withStyles, withStylesPropTypes } from 'react-with-styles';
import moment from 'moment';

import { CalendarDayPhrases } from '../defaultPhrases';
import getPhrasePropTypes from '../utils/getPhrasePropTypes';

import CalendarWeek from './CalendarWeek';
import CalendarDay from './CalendarDay';

import calculateDimension from '../utils/calculateDimension';
import getCalendarMonthWeeks from '../utils/getCalendarMonthWeeks';
import isSameDay from '../utils/isSameDay';
import toISODateString from '../utils/toISODateString';

import ModifiersShape from '../shapes/ModifiersShape';
import ScrollableOrientationShape from '../shapes/ScrollableOrientationShape';
import DayOfWeekShape from '../shapes/DayOfWeekShape';

import { HORIZONTAL_ORIENTATION, VERTICAL_ORIENTATION, VERTICAL_SCROLLABLE, DAY_SIZE } from '../constants';

var propTypes = forbidExtraProps(_objectAssign({}, withStylesPropTypes, {
  month: momentPropTypes.momentObj,
  isVisible: PropTypes.bool,
  enableOutsideDays: PropTypes.bool,
  modifiers: PropTypes.objectOf(ModifiersShape),
  orientation: ScrollableOrientationShape,
  daySize: nonNegativeInteger,
  onDayClick: PropTypes.func,
  onDayMouseEnter: PropTypes.func,
  onDayMouseLeave: PropTypes.func,
  onMonthSelect: PropTypes.func,
  onYearSelect: PropTypes.func,
  renderMonthText: mutuallyExclusiveProps(PropTypes.func, 'renderMonthText', 'renderMonthElement'),
  renderCalendarDay: PropTypes.func,
  renderDayContents: PropTypes.func,
  renderMonthElement: mutuallyExclusiveProps(PropTypes.func, 'renderMonthText', 'renderMonthElement'),
  firstDayOfWeek: DayOfWeekShape,
  setMonthTitleHeight: PropTypes.func,
  verticalBorderSpacing: nonNegativeInteger,

  focusedDate: momentPropTypes.momentObj, // indicates focusable day
  isFocused: PropTypes.bool, // indicates whether or not to move focus to focusable day

  // i18n
  monthFormat: PropTypes.string,
  phrases: PropTypes.shape(getPhrasePropTypes(CalendarDayPhrases)),
  dayAriaLabelFormat: PropTypes.string
}));

var defaultProps = {
  month: moment(),
  isVisible: true,
  enableOutsideDays: false,
  modifiers: {},
  orientation: HORIZONTAL_ORIENTATION,
  daySize: DAY_SIZE,
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
  onMonthSelect: function () {
    function onMonthSelect() {}

    return onMonthSelect;
  }(),
  onYearSelect: function () {
    function onYearSelect() {}

    return onYearSelect;
  }(),

  renderMonthText: null,
  renderCalendarDay: function () {
    function renderCalendarDay(props) {
      return React.createElement(CalendarDay, props);
    }

    return renderCalendarDay;
  }(),
  renderDayContents: null,
  renderMonthElement: null,
  firstDayOfWeek: null,
  setMonthTitleHeight: null,

  focusedDate: null,
  isFocused: false,

  // i18n
  monthFormat: 'MMMM YYYY', // english locale
  phrases: CalendarDayPhrases,
  dayAriaLabelFormat: undefined,
  verticalBorderSpacing: undefined
};

var CalendarMonth = function (_React$Component) {
  _inherits(CalendarMonth, _React$Component);

  function CalendarMonth(props) {
    _classCallCheck(this, CalendarMonth);

    var _this = _possibleConstructorReturn(this, (CalendarMonth.__proto__ || Object.getPrototypeOf(CalendarMonth)).call(this, props));

    _this.state = {
      weeks: getCalendarMonthWeeks(props.month, props.enableOutsideDays, props.firstDayOfWeek == null ? moment.localeData().firstDayOfWeek() : props.firstDayOfWeek)
    };

    _this.setCaptionRef = _this.setCaptionRef.bind(_this);
    _this.setMonthTitleHeight = _this.setMonthTitleHeight.bind(_this);
    return _this;
  }

  _createClass(CalendarMonth, [{
    key: 'componentDidMount',
    value: function () {
      function componentDidMount() {
        this.setMonthTitleHeightTimeout = setTimeout(this.setMonthTitleHeight, 0);
      }

      return componentDidMount;
    }()
  }, {
    key: 'componentWillReceiveProps',
    value: function () {
      function componentWillReceiveProps(nextProps) {
        var month = nextProps.month,
            enableOutsideDays = nextProps.enableOutsideDays,
            firstDayOfWeek = nextProps.firstDayOfWeek;
        var _props = this.props,
            prevMonth = _props.month,
            prevEnableOutsideDays = _props.enableOutsideDays,
            prevFirstDayOfWeek = _props.firstDayOfWeek;

        if (!month.isSame(prevMonth) || enableOutsideDays !== prevEnableOutsideDays || firstDayOfWeek !== prevFirstDayOfWeek) {
          this.setState({
            weeks: getCalendarMonthWeeks(month, enableOutsideDays, firstDayOfWeek == null ? moment.localeData().firstDayOfWeek() : firstDayOfWeek)
          });
        }
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
    key: 'componentWillUnmount',
    value: function () {
      function componentWillUnmount() {
        if (this.setMonthTitleHeightTimeout) {
          clearTimeout(this.setMonthTitleHeightTimeout);
        }
      }

      return componentWillUnmount;
    }()
  }, {
    key: 'setMonthTitleHeight',
    value: function () {
      function setMonthTitleHeight() {
        var setMonthTitleHeight = this.props.setMonthTitleHeight;

        if (setMonthTitleHeight) {
          var captionHeight = calculateDimension(this.captionRef, 'height', true, true);
          setMonthTitleHeight(captionHeight);
        }
      }

      return setMonthTitleHeight;
    }()
  }, {
    key: 'setCaptionRef',
    value: function () {
      function setCaptionRef(ref) {
        this.captionRef = ref;
      }

      return setCaptionRef;
    }()
  }, {
    key: 'render',
    value: function () {
      function render() {
        var _props2 = this.props,
            month = _props2.month,
            monthFormat = _props2.monthFormat,
            orientation = _props2.orientation,
            isVisible = _props2.isVisible,
            modifiers = _props2.modifiers,
            onDayClick = _props2.onDayClick,
            onDayMouseEnter = _props2.onDayMouseEnter,
            onDayMouseLeave = _props2.onDayMouseLeave,
            onMonthSelect = _props2.onMonthSelect,
            onYearSelect = _props2.onYearSelect,
            renderMonthText = _props2.renderMonthText,
            renderCalendarDay = _props2.renderCalendarDay,
            renderDayContents = _props2.renderDayContents,
            renderMonthElement = _props2.renderMonthElement,
            daySize = _props2.daySize,
            focusedDate = _props2.focusedDate,
            isFocused = _props2.isFocused,
            styles = _props2.styles,
            phrases = _props2.phrases,
            dayAriaLabelFormat = _props2.dayAriaLabelFormat,
            verticalBorderSpacing = _props2.verticalBorderSpacing;
        var weeks = this.state.weeks;

        var monthTitle = renderMonthText ? renderMonthText(month) : month.format(monthFormat);

        var verticalScrollable = orientation === VERTICAL_SCROLLABLE;

        return React.createElement(
          'div',
          _extends({}, css(styles.CalendarMonth, orientation === HORIZONTAL_ORIENTATION && styles.CalendarMonth__horizontal, orientation === VERTICAL_ORIENTATION && styles.CalendarMonth__vertical, verticalScrollable && styles.CalendarMonth__verticalScrollable), {
            'data-visible': isVisible
          }),
          React.createElement(
            'div',
            _extends({
              ref: this.setCaptionRef
            }, css(styles.CalendarMonth_caption, verticalScrollable && styles.CalendarMonth_caption__verticalScrollable)),
            renderMonthElement ? renderMonthElement({ month: month, onMonthSelect: onMonthSelect, onYearSelect: onYearSelect }) : React.createElement(
              'strong',
              null,
              monthTitle
            )
          ),
          React.createElement(
            'table',
            _extends({}, css(!verticalBorderSpacing && styles.CalendarMonth_table, verticalBorderSpacing && styles.CalendarMonth_verticalSpacing, verticalBorderSpacing && { borderSpacing: '0px ' + String(verticalBorderSpacing) + 'px' }), {
              role: 'presentation'
            }),
            React.createElement(
              'tbody',
              null,
              weeks.map(function (week, i) {
                return React.createElement(
                  CalendarWeek,
                  { key: i },
                  week.map(function (day, dayOfWeek) {
                    return renderCalendarDay({
                      key: dayOfWeek,
                      day: day,
                      daySize: daySize,
                      isOutsideDay: !day || day.month() !== month.month(),
                      tabIndex: isVisible && isSameDay(day, focusedDate) ? 0 : -1,
                      isFocused: isFocused,
                      onDayMouseEnter: onDayMouseEnter,
                      onDayMouseLeave: onDayMouseLeave,
                      onDayClick: onDayClick,
                      renderDayContents: renderDayContents,
                      phrases: phrases,
                      modifiers: modifiers[toISODateString(day)],
                      ariaLabelFormat: dayAriaLabelFormat
                    });
                  })
                );
              })
            )
          )
        );
      }

      return render;
    }()
  }]);

  return CalendarMonth;
}(React.Component);

CalendarMonth.propTypes = propTypes;
CalendarMonth.defaultProps = defaultProps;

export default withStyles(function (_ref) {
  var _ref$reactDates = _ref.reactDates,
      color = _ref$reactDates.color,
      font = _ref$reactDates.font,
      spacing = _ref$reactDates.spacing;
  return {
    CalendarMonth: {
      background: color.background,
      textAlign: 'center',
      padding: '0 13px',
      verticalAlign: 'top',
      userSelect: 'none'
    },

    CalendarMonth_table: {
      borderCollapse: 'collapse',
      borderSpacing: 0
    },

    CalendarMonth_verticalSpacing: {
      borderCollapse: 'separate'
    },

    CalendarMonth_caption: {
      color: color.text,
      fontSize: font.captionSize,
      textAlign: 'center',
      paddingTop: spacing.captionPaddingTop,
      paddingBottom: spacing.captionPaddingBottom,
      captionSide: 'initial'
    },

    CalendarMonth_caption__verticalScrollable: {
      paddingTop: 12,
      paddingBottom: 7
    }
  };
})(CalendarMonth);