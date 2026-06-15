

import {
	Button,
	Modal,
	Flex,
	ColorPicker,
	__experimentalInputControl as InputControl
} from '@wordpress/components';

export function categories({ attributes, setAttributes }) {
	return (<div>
		{Object.entries(attributes.categories).map(([id, entry]) => (
			<div key={id} style={{ display: 'inline-block' }} onClick={() => editCategory(setAttributes, entry)}>
				<div className="cal-category" style={{ backgroundColor: entry.color }} /><span>{entry.label}</span>
			</div>
		))}
		{setAttributes &&
			<div style={{ display: 'inline-block', margin: '5px' }}>
				<Button variant="text" onClick={() => editCategory(setAttributes)}>Kategorie hinzufügen</Button>
			</div>
		}
	</div>);
}

function editCategory(setAttributes, category) {

	if (category) {
		setAttributes({
			editCatId: category.id,
			editLabel: category.label,
			editColor: category.color,
		});
	} else {
		setAttributes({
			editCatId: crypto.randomUUID(),
			editLabel: "Name",
			editColor: "#000"
		});
	}
}

export function editCategoryControl(attributes, setAttributes) {

	return (<Modal title="Kategorie Bearbeiten" onRequestClose={() => attributes.errorMessage ? "" : setAttributes({ editCatId: undefined })}>
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
					<td>Farbe:</td>
					<td>
						<ColorPicker
							color={attributes.editColor}
							onChange={(hex8color) => setAttributes({ editColor: hex8color })}
							defaultValue="#000"
						/>
					</td>
				</tr>
			</tbody>
		</table>
		<Flex direction="row" justify="flex-end">
			<Button variant="secondary" isDestructive="true" onClick={() => deleteCategory(attributes, setAttributes)}>Löschen</Button>
			<Button variant="secondary" onClick={() => setAttributes({ editCatId: undefined })}>Abbrechen</Button>
			<Button variant="primary" onClick={() => saveCategory(attributes, setAttributes)} >OK</Button>
		</Flex>
	</Modal>
	);
}
function saveCategory(attributes, setAttributes) {
	var updatedCategories = Object.entries(attributes.categories)
		.filter(e => e[0] != attributes.editCatId)
		.reduce((map, obj) => {
			map[obj[0]] = obj[1];
			return map;
		}, {});

	updatedCategories[attributes.editCatId] = {
		id: attributes.editCatId,
		label: attributes.editLabel,
		color: attributes.editColor
	};
	updatedCategories = Object.entries(updatedCategories)
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
		categories: updatedCategories,
		editCatId: undefined,
		editLabel: undefined,
		editColor: undefined
	});
}

function deleteCategory(attributes, setAttributes) {

	const usedEntry = Object.entries(attributes.events)
		.find(([id, e]) => e.category === attributes.editCatId);
	var curErrorMessage = "";
	if (usedEntry) {
		curErrorMessage += `Kategorie wird noch beim Eintrag ${usedEntry.title} verwendet. `;
	}
	if (attributes.categories.length < 2) {
		curErrorMessage += `Die letzte Kategorie darf nicht gelöscht werden. `;
	}
	if (curErrorMessage) {
		setAttributes({
			errorMessage: curErrorMessage
		});
	} else {
		var updatedCategories = Object.entries(attributes.categories)
			.filter(e => e[0] != attributes.editCatId)
			.reduce((map, obj) => {
				map[obj[0]] = obj[1];
				return map;
			}, {});

		setAttributes({
			categories: updatedCategories,
			editCatId: undefined,
			editLabel: undefined,
			editColor: undefined
		});
	}
}
