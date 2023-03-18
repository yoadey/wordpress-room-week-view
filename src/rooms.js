

import {
	Button,
	Modal,
	Flex,
	CheckboxControl,
	__experimentalInputControl as InputControl
} from '@wordpress/components';

export function rooms({ attributes, setAttributes }) {
	return (<div>
		{Object.entries(attributes.rooms).map(([id, entry]) => (
			<div key={id} style={{ display: 'inline-block', margin: '5px' }} onClick={() => editRoom(setAttributes, entry)}>
				{setAttributes ?
					<CheckboxControl
						label={entry.label}
						checked={entry.preSelected}
						onChange={() => editRoom(setAttributes, entry)}
						onClick={() => editRoom(setAttributes, entry)}
					/>
					:
					<div>
						<input type="checkbox"
						    className="cal-room-selector"
							id={entry.id}
							checked={entry.preSelected}
						/>
						<label for={entry.id}>{entry.label}</label>
					</div>
				}
			</div>
		))}
		{setAttributes &&
			<div style={{ display: 'inline-block', margin: '5px' }}>
				<Button variant="text" onClick={() => editRoom(setAttributes)}>Raum hinzufügen</Button>
			</div>
		}
	</div>);
}


function editRoom(setAttributes, room) {

	if (room) {
		setAttributes({
			editRoomId: room.id,
			editLabel: room.label,
			editPreSelected: room.preSelected
		});
	} else {
		setAttributes({
			editRoomId: crypto.randomUUID(),
			editLabel: "Name",
			editPreSelected: true
		});
	}
}

export function editRoomControl(attributes, setAttributes) {

	return (<Modal title="Raum Bearbeiten" onRequestClose={() => attributes.errorMessage ? "" : setAttributes({ editRoomId: undefined })}>
		<table>
			<tbody>
				<tr>
					<td>Name:</td>
					<td>
						<InputControl
							onChange={(content) => setAttributes({ editLabel: content })}
							value={attributes.editLabel}
						/>
					</td>
				</tr>
				<tr>
					<td>Vorausgewählt:</td>
					<td>
						<CheckboxControl
							label=""
							checked={attributes.editPreSelected}
							onChange={(content) => setAttributes({ editPreSelected: content })}
						/>
					</td>
				</tr>
			</tbody>
		</table>
		<Flex direction="row" justify="flex-end">
			<Button variant="secondary" isDestructive="true" onClick={() => deleteRoom(attributes, setAttributes)}>Löschen</Button>
			<Button variant="secondary" onClick={() => setAttributes({ editRoomId: undefined })}>Abbrechen</Button>
			<Button variant="primary" onClick={() => saveRoom(attributes, setAttributes)} >OK</Button>
		</Flex>
	</Modal>
	);
}
function saveRoom(attributes, setAttributes) {
	var updatedrooms = Object.entries(attributes.rooms)
		.filter(e => e[0] != attributes.editRoomId)
		.reduce((map, obj) => {
			map[obj[0]] = obj[1];
			return map;
		}, {});

	updatedrooms[attributes.editRoomId] = {
		id: attributes.editRoomId,
		label: attributes.editLabel,
		preSelected: attributes.editPreSelected
	};
	updatedrooms = Object.entries(updatedrooms)
		.sort((a, b) => {
			if (a[1].label < b[1].label) {
				return -1;
			} else if (a[1].label > b[1].label) {
				return 1;
			} else {
				return 0;
			}
		})
		.reduce((map, obj) => {
			map[obj[0]] = obj[1];
			return map;
		}, {});

	setAttributes({
		rooms: updatedrooms,
		editRoomId: undefined,
		editLabel: undefined,
		editPreSelected: undefined
	});
}

function deleteRoom(attributes, setAttributes) {

	const usedEntry = Object.entries(attributes.events)
		.find(([id, e]) => e.room === attributes.editRoomId);
	var curErrorMessage = "";
	if (usedEntry) {
		curErrorMessage += `Raum wird noch beim Eintrag ${usedEntry[1].title} verwendet. `;
	}
	if (Object.entries(attributes.rooms).length < 2) {
		curErrorMessage += `Der letzte Raum darf nicht gelöscht werden. `;
	}
	if (curErrorMessage) {
		setAttributes({
			errorMessage: curErrorMessage
		});
	} else {
		var updatedRooms = Object.entries(attributes.rooms)
			.filter(e => e[0] != attributes.editRoomId)
			.reduce((map, obj) => {
				map[obj[0]] = obj[1];
				return map;
			}, {});

		setAttributes({
			rooms: updatedRooms,
			editRoomId: undefined,
			editLabel: undefined,
			editColor: undefined
		});
	}
}
