
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
        var time = "";
        if(i % 0.5 === 0) {
            time= toTime(i);
        }
        const hourClass = (i-i%1) % 2 === 0 ? "cal-row-hour" : "";
        timeEntries.push(
            <div key={i} className={`cal-row ${hourClass}`}>{time}</div>
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
            var tooltipClass = i > (attributes.dayEndTime - attributes.dayStartTime)/2 + attributes.dayStartTime ? "top" : "bottom"; 

            const editEventConst = event, time = i;
            roomColEntries.push(
                <div key={time} className="cal-row cal-event"
                    style={{"--event-height": `${height}px`, "--event-color": attributes.categories[event.category].color}}
                    onClick={() => editEvent(attributes, setAttributes, room, day, time, editEventConst)}>
                    <p className="cal-event-title">{event.title}</p>
                    { event.showDescription ? <p className="cal-event-description">{event.description}</p> : null }
                    <div class={ `tooltip ${tooltipClass}` }>
                        <p className="cal-event-title">{event.title}</p>
                        <p className="cal-event-description">{event.description}</p>
                        <div>
                            <div className="cal-tooltip-row icon"><span class="dashicons dashicons-clock"></span></div>
                            <div className="cal-tooltip-row">{toTime(event.startTime)} - {toTime(event.endTime)}</div>
                        </div>
                        <div>
                            <div className="cal-tooltip-row icon"><span class="dashicons dashicons-location"></span></div>
                            <div className="cal-tooltip-row">{attributes.rooms[event.room].label}</div>
                        </div>
                        <div>
                            <div className="cal-tooltip-row icon"><span class="dashicons dashicons-category"></span></div>
                            <div className="cal-tooltip-row">{attributes.categories[event.category].label}</div>
                        </div>
                        <i></i>
                    </div>
                </div>
            );
        } else if (event && event.startTime < i && event.endTime - (1 / attributes.timeslotsPerHour) === i) {
            event = eventsIter.next().value;
        } else if (!event || event.startTime > i) {
            const time = i;
            const hourClass = (i-i%1) % 2 === 0 ? "cal-row-hour" : "";
            roomColEntries.push(
                <div key={time} className={`cal-row ${hourClass}`} onClick={() => editEvent(attributes, setAttributes, room, day, time)}></div>
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
