import React from 'react';
import Week from '../timeline/week.cjsx';
import CourseDateUtils from '../../utils/course_date_utils.js';
import { Link } from 'react-router';

const emptyWeeksAtBeginning = function (weekMeetings) {
  let count = 0;
  for (let i = 0; i < weekMeetings.length; i++) {
    const week = weekMeetings[i];
    if (week !== '()') { return count; }
    count += 1;
  }
};

const emptyWeeksUntil = function (weekMeetings, weekIndex) {
  let count = 0;
  const iterable = weekMeetings.slice(0, weekIndex);
  for (let i = 0; i < iterable.length; i++) {
    const week = iterable[i];
    if (week === '()') { count += 1; }
  }
  return count;
};

const ThisWeek = React.createClass({
  displayName: 'ThisWeek',

  propTypes: {
    course: React.PropTypes.object,
    weeks: React.PropTypes.array,
    current: React.PropTypes.number
  },

  render() {
    let weekIndex;
    let thisWeekMeetings;
    let weekMeetings;
    let week;
    let title;
    let weekComponent;
    let noWeeks;

    if (this.props.weeks) {
      const { course } = this.props;
      weekIndex = this.props.current + 1;

      const meetings = CourseDateUtils.meetings(course);
      weekMeetings = CourseDateUtils.weekMeetings(meetings, course, course.day_exceptions);
      const emptyWeeksAtStart = emptyWeeksAtBeginning(weekMeetings);
      const daysUntilBeginning = emptyWeeksAtStart * 7;
      const isFirstWeek = moment().diff(this.props.course.timeline_start, 'days') <= daysUntilBeginning;
      if (isFirstWeek) {
        const weekMeetingsIndex = emptyWeeksAtBeginning(weekMeetings);
        thisWeekMeetings = weekMeetings[weekMeetingsIndex];
        weekIndex = weekMeetingsIndex + 1;
        week = this.props.weeks[0];
        title = I18n.t('timeline.first_week_title');
      } else {
        thisWeekMeetings = weekMeetings[this.props.current];
        const emptyWeeksSoFar = emptyWeeksUntil(weekMeetings, this.props.current);
        week = this.props.weeks[this.props.current - emptyWeeksSoFar];
      }
    }

    if (week) {
      let meetingsProp = weekMeetings ? thisWeekMeetings : ' ';
      weekComponent = (
        <Week
          week={week}
          timeline_start={this.props.course.timeline_start}
          timeline_end={this.props.course.timeline_end}
          index={weekIndex}
          key={week.id}
          editable={false}
          blocks= {week.blocks}
          moveBlock={null}
          deleteWeek={null}
          showTitle={false}
          meetings={meetingsProp}
        />
      );
    } else {
      noWeeks = (
        <li className="row view-all">
          <div><p>{I18n.t('timeline.nothing_this_week')}</p></div>
        </li>
      );
    }

    const timelineUrl = `/courses/${this.props.course.slug}/timeline`;

    return (
      <div className="module course__this-week">
        <div className="section-header">
          <h3>{title || I18n.t('timeline.this_week_title_default')}</h3>
          <Link to={timelineUrl} className="pull-right button ghost-button block__this-week-button" >{I18n.t('timeline.view_full_timeline')}</Link>
        </div>
        <ul className="list-unstyled">
          {weekComponent}
          {noWeeks}
        </ul>
      </div>
    );
  }
}
);

export default ThisWeek;
