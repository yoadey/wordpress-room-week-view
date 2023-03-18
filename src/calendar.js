
import { toTime } from './utils';
import { editEvent } from './events';

const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const days_de = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag'];

const CAL_ROW_HEIGHT = 18;

export function calendarGenerator({ attributes, setAttributes, eventsMap }) {
    return <div className="calendar">
        {timeCol(attributes)}
        <span className='cal-week'>
            {days.map((day, index) => showDay(attributes, setAttributes, day, index, eventsMap))}
        </span>
    </div>
}

function timeCol(attributes) {
    const timeEntries = []
    for (var i = attributes.dayStartTime; i <= attributes.dayEndTime; i += (1 / attributes.timeslotsPerHour)) {
        var time = toTime(i);
        timeEntries.push(
            <div key={i} className="cal-row">{time}</div>
        );
    }
    return (
        <span className="cal-col cal-time cal-col-right">
            <div className="cal-row cal-row-top"></div>
            <div className="cal-row">Zeit</div>
            {timeEntries}
        </span>
    );
}

function showDay(attributes, setAttributes, day, index, eventsMap) {
    const lastRoom = Object.keys(attributes.rooms)[Object.keys(attributes.rooms).length - 1]
    return (
        <span key={index} className={`cal-day-parent cal-${day}`}>
            <div className="cal-day-name">{days_de[index]}</div>
            {Object.entries(attributes.rooms).map(([i, room]) => {
                var eventsByDayAndRoom = eventsMap[day] ? eventsMap[day][room.id] : [];
                return roomCol(attributes, setAttributes, day, room.id, i === lastRoom, eventsByDayAndRoom)
            })}
        </span>
    );
}

function roomCol(attributes, setAttributes, day, room, lastRoom, events) {
    const rowHeight = CAL_ROW_HEIGHT;
    const classLastRoom = lastRoom ? "cal-col-right" : "";

    const roomColEntries = []
    var eventsIter = null;
    var event = null;
    if (events) {
        events.sort((a, b) => a.startTime - b.startTime);
        eventsIter = events[Symbol.iterator]();
        event = eventsIter.next().value;
    }
    for (var i = attributes.dayStartTime; i <= attributes.dayEndTime; i += (1 / attributes.timeslotsPerHour)) {
        if (event && event.startTime === i) {
            var height = (event.endTime - event.startTime) * attributes.timeslotsPerHour * rowHeight;

            const editEventConst = event, time = i;
            roomColEntries.push(
                <div key={time} className="cal-row"
                    style={{height: `${height}px`, backgroundColor: attributes.categories[event.category].color}}
                    onClick={() => editEvent(attributes, setAttributes, room, day, time, editEventConst)}>
                    <p className="cal-event-title">{event.title}</p>
                    <p className="cal-event-description">{event.description}</p>
                </div>
            );
        } else if (event && event.startTime < i && event.endTime - (1 / attributes.timeslotsPerHour) === i) {
            event = eventsIter.next().value;
        } else if (!event || event.startTime > i) {
            const time = i;
            roomColEntries.push(
                <div key={time} className="cal-row" onClick={() => editEvent(attributes, setAttributes, room, day, time)}></div>
            );
        }
    }
    return (
        <div key={room} className={`cal-col cal-${room} ${classLastRoom}`}>
            <div className="cal-row">{attributes.rooms[room].label}</div>
            {roomColEntries}
        </div>
    );
}
