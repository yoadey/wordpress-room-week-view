
import {
	Button,
	SelectControl,
	Modal,
	Flex,
	__experimentalInputControl as InputControl
} from '@wordpress/components';

import { toTime } from './utils';

import { TimePartInput } from './styles';


export function editEvent(attributes, setAttributes, room, day, time, event) {

	if (event) {
		setAttributes({
			editId: event.id,
			editTitle: event.title,
			editDescription: event.description,
			editCategory: event.category,
			editStartTime: event.startTime,
			editEndTime: event.endTime,
			editDay: day,
			editRoom: room
		});
	} else {
		setAttributes({
			editId: crypto.randomUUID(),
			editTitle: "Titel",
			editDescription: "Beschreibung",
			editCategory: Object.values(attributes.categories)[0].id,
			editStartTime: time,
			editEndTime: time + 1,
			editDay: day,
			editRoom: room
		});
	}
}

export function editEventControl(attributes, setAttributes) {

	const categories_map = Object.entries(attributes.categories).map(([id, entry]) => {
		return { label: entry.label, value: entry.id };
	});
	const rooms_map = Object.entries(attributes.rooms).map(([id, entry]) => {
		return { label: entry.label, value: entry.id };
	});

	return (<Modal title="Eintrag Bearbeiten" onRequestClose={() => attributes.errorMessage ? "" : setAttributes({ editId: undefined })}>
		<table>
			<tbody>
				<tr>
					<td>Titel:</td>
					<td>
						<InputControl
							onChange={(content) => setAttributes({ editTitle: content })}
							value={attributes.editTitle}
						/>
					</td>
				</tr>
				<tr>
					<td>Startzeit:</td>
					<td>
						<div>
							<TimePartInput
								onChange={(content) => setAttributes({ editStartTime: Math.floor(content) + (attributes.editStartTime % 1) })}
								value={Math.floor(attributes.editStartTime)}
								spinControls="none"
								required={true}
								min="12"
								max="22"
								step="1"
							/> : <TimePartInput
								onChange={(content) => setAttributes({ editStartTime: Math.floor(attributes.editStartTime) + (content / 60) })}
								value={(attributes.editStartTime % 1) * 60}
								spinControls="none"
								required={true}
								min="0"
								max="45"
								step="15"
							/>
						</div>
					</td>
				</tr>
				<tr>
					<td>Endzeit:</td>
					<td>
						<div>
							<TimePartInput
								onChange={(content) => setAttributes({ editEndTime: Math.floor(content) + (attributes.editEndTime % 1) })}
								value={Math.floor(attributes.editEndTime)}
								spinControls="none"
								required={true}
								min="12"
								max="23"
								step="1"
							/> : <TimePartInput
								onChange={(content) => setAttributes({ editEndTime: Math.floor(attributes.editEndTime) + (content / 60) })}
								value={(attributes.editEndTime % 1) * 60}
								spinControls="none"
								required={true}
								min="0"
								max="45"
								step="15"
							/>
						</div>
					</td>
				</tr>
				<tr>
					<td>Raum:</td>
					<td>
						<SelectControl
							value={attributes.editRoom}
							options={rooms_map}
							onChange={(room) => setAttributes({ editRoom: room })}
						/>
					</td>
				</tr>
				<tr>
					<td>Beschreibung:</td>
					<td>
						<InputControl
							onChange={(content) => setAttributes({ editDescription: content })}
							value={attributes.editDescription}
						/>
					</td>
				</tr>
				<tr>
					<td>Kategorie:</td>
					<td>
						<SelectControl
							value={attributes.editCategory}
							options={categories_map}
							onChange={(category) => setAttributes({ editCategory: category })}
						/>
					</td>
				</tr>
			</tbody>
		</table>
		<Flex direction="row" justify="flex-end">
			<Button variant="secondary" isDestructive="true" onClick={() => deleteEvent(attributes, setAttributes)}>Löschen</Button>
			<Button variant="secondary" onClick={() => setAttributes({ editId: undefined })}>Abbrechen</Button>
			<Button variant="primary" onClick={() => saveEvent(attributes, setAttributes)} >OK</Button>
		</Flex>
	</Modal>
	);
}

function deleteEvent(attributes, setAttributes) {
	var updatedEvents = Object.entries(attributes.events)
		.filter(e => e[0] != attributes.editId)
		.reduce((map, obj) => {
			map[obj[0]] = obj[1];
			return map;
		}, {});

	setAttributes({
		events: updatedEvents,
		editId: undefined,
		editTitle: undefined,
		editDescription: undefined,
		editCategory: undefined,
		editStartTime: undefined,
		editEndTime: undefined,
		editDay: undefined,
		editRoom: undefined
	});
}

function saveEvent(attributes, setAttributes) {
	var updatedEvents = Object.entries(attributes.events)
		.filter(e => e[0] != attributes.editId)
		.reduce((map, obj) => {
			map[obj[0]] = obj[1];
			return map;
		}, {});

	const newRoom = attributes.editRoom;
	const newDay = attributes.editDay;
	const newStartTime = attributes.editStartTime;
	const newEndTime = attributes.editEndTime;
	var curErrorMessage = "";
	if (newStartTime >= newEndTime) {
		curErrorMessage = `Startzeit ${toTime(newStartTime)} darf nicht nach oder gleich der Endzeit ${toTime(newEndTime)} sein. `
	}
	if (newStartTime < attributes.dayStartTime) {
		curErrorMessage = `Startzeit ${toTime(newStartTime)} muss nach Tagesbeginn ${toTime(attributes.dayStartTime)} sein. `
	}
	if (newEndTime > attributes.dayEndTime + (1 / attributes.timeslotsPerHour)) {
		curErrorMessage = `Endzeit ${toTime(newEndTime)} darf nicht nach Tagesende ${toTime(attributes.dayEndTime + (1 / attributes.timeslotsPerHour))} sein. `
	}
	const conflictEntry = Object.entries(updatedEvents)
		.filter(([id, e]) => e.day === newDay)
		.filter(([id, e]) => e.room === newRoom)
		.find(([id, e]) => newStartTime < e.endTime && newEndTime > e.startTime);
	if (conflictEntry) {
		curErrorMessage += `Konflikt mit anderem Termin zwischen ${toTime(conflictEntry[1].startTime)} und ${toTime(conflictEntry[1].endTime)}. `;
	}
	if (curErrorMessage) {
		setAttributes({
			errorMessage: curErrorMessage
		});
	} else {
		updatedEvents[attributes.editId] = {
			id: attributes.editId,
			title: attributes.editTitle,
			description: attributes.editDescription,
			category: attributes.editCategory,
			startTime: attributes.editStartTime,
			endTime: attributes.editEndTime,
			day: attributes.editDay,
			room: attributes.editRoom
		};

		setAttributes({
			events: updatedEvents,
			editId: undefined,
			editTitle: undefined,
			editDescription: undefined,
			editCategory: undefined,
			editStartTime: undefined,
			editEndTime: undefined,
			editDay: undefined,
			editRoom: undefined
		});
	}
}