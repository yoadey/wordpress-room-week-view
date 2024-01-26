/**
 * React hook that is used to mark the block wrapper element.
 * It provides all the necessary props like the class name.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/packages/packages-block-editor/#useblockprops
 */
import { useBlockProps } from '@wordpress/block-editor';

import { calendarGenerator } from './calendar';
import { rooms } from './rooms';
import { categories } from './categories';

import { groupBy } from './utils';
import { specialoccupancies } from './specialoccupancy';

/**
 * The save function defines the way in which the different attributes should
 * be combined into the final markup, which is then serialized by the block
 * editor into `post_content`.
 *
 * @see https://developer.wordpress.org/block-editor/reference-guides/block-api/block-edit-save/#save
 *
 * @return {WPElement} Element to render.
 */
export default function save({ attributes }) {

	var events = attributes.events;

	var eventsMap = {};
	if (events) {
		const eventsByDays = groupBy(Object.values(events), 'day');
		Object.entries(eventsByDays).forEach(([day, eventsByDay]) => {
			const eventsByDayAndRoom = groupBy(eventsByDay, 'room');
			eventsMap[day] = eventsByDayAndRoom;
		})
	}

	return (
		<div {...useBlockProps.save()}>
			{rooms({attributes})}
			{calendarGenerator({attributes, eventsMap})}
			{categories({attributes})}
			{specialoccupancies({attributes})}
		</div>
	);
}

