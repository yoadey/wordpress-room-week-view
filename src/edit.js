/**
 * Retrieves the translation of text.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-i18n/
 */
import { __ } from '@wordpress/i18n';

/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import {
	useBlockProps,
	InspectorControls,
} from '@wordpress/block-editor';

import {
	Button,
	Modal,
	Flex,
	__experimentalNumberControl as NumberControl,
	FontSizePicker,
	PanelBody,
	PanelRow,
} from '@wordpress/components';

import { calendarGenerator } from './calendar';
import { editEventControl } from './events';
import { rooms, editRoomControl } from './rooms';
import { categories, editCategoryControl } from './categories';

import { groupBy } from './utils';
import { specialoccupancies } from './specialoccupancy';

/**
 * The edit function describes the structure of your block in the context of the
 * editor. This represents what the editor will render when the block is used.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#edit
 *
 * @return {WPElement} Element to render.
 */
export default function Edit({ attributes, setAttributes, isSelected }) {

	const blockProps = useBlockProps();
	var events = attributes.events;

	var eventsMap = {};
	const eventsByDays = groupBy(Object.values(events), 'day');
	Object.entries(eventsByDays).forEach(([day, eventsByDay]) => {
		const eventsByDayAndRoom = groupBy(eventsByDay, 'room');
		eventsMap[day] = eventsByDayAndRoom;
	})

	return (
		<>
			<InspectorControls>
				<PanelBody title="Schriften" initialOpen={true}>
					<PanelRow>
						<FontSizePicker
							label="Schriftgröße Titel"
							__nextHasNoMarginBottom
							value={attributes.titleFontSize}
							fallbackFontSize={16}
							onChange={(newTitleFontSize) => {
								setAttributes({ titleFontSize: newTitleFontSize });
							}}
						/>
					</PanelRow>
					<PanelRow>
						<FontSizePicker
							label="Schriftgröße Beschreibung"
							__nextHasNoMarginBottom
							value={attributes.descriptionFontSize}
							fallbackFontSize={12}
							onChange={(descriptionFontSize) => {
								setAttributes({ descriptionFontSize });
							}}
						/>
					</PanelRow>
				</PanelBody>
				<PanelBody title="Allgemeines" initialOpen={true}>
					<PanelRow>
						<NumberControl
							label="Tagesbeginn (Stunde)"
							onChange={(val) => setAttributes({ dayStartTime: Math.round(val) })}
							value={attributes.dayStartTime}
							min="0"
							max={attributes.dayEndTime - 1}
							step="1"
						/>
					</PanelRow>
					<PanelRow>
						<NumberControl
							label="Tagesende (Stunde)"
							onChange={(val) => setAttributes({ dayEndTime: Math.round(val) })}
							value={attributes.dayEndTime}
							min={attributes.dayStartTime + 1}
							max="24"
							step="1"
						/>
					</PanelRow>
					<PanelRow>
						<NumberControl
							label="Blöcke pro Stunde"
							onChange={(timeslotsPerHour) => setAttributes({ timeslotsPerHour })}
							value={attributes.timeslotsPerHour}
							min="1"
							max="4"
							step="1"
						/>
					</PanelRow>
					<PanelRow>
						<NumberControl
							label="Zeilenhöhe (px)"
							onChange={(rowHeight) => setAttributes({ rowHeight })}
							value={attributes.rowHeight}
							min="10"
							max="100"
							step="1"
						/>
					</PanelRow>
				</PanelBody>
			</InspectorControls>
			<div {...blockProps}>
				{isSelected && attributes.errorMessage && (
					errorNotification(attributes, setAttributes)
				)}
				{isSelected && attributes.editRoomId && (
					editRoomControl(attributes, setAttributes)
				)}
				{isSelected && attributes.editCatId && (
					editCategoryControl(attributes, setAttributes)
				)}
				{isSelected && attributes.editId && (
					editEventControl(attributes, setAttributes)
				)}
				{rooms({ attributes, setAttributes })}
				{calendarGenerator({ attributes, setAttributes, eventsMap })}
				{categories({ attributes, setAttributes })}
				{specialoccupancies({ attributes, setAttributes })}
			</div>
		</>
	);
}


function errorNotification(attributes, setAttributes) {

	return (<Modal title="Fehler" onRequestClose={() => setAttributes({ errorMessage: undefined })}>
		<p>{attributes.errorMessage}</p>
		<Flex direction="row" justify="flex-end">
			<Button variant="primary" onClick={() => setAttributes({ errorMessage: undefined })} >OK</Button>
		</Flex>
	</Modal>
	);
}