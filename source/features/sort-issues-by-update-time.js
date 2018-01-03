import select from 'select-dom';
import {anySelector} from '../libs/utils';

export default function () {
	// Get issues links that don't already have a specific sorting applied
	const links = select.all(anySelector(`
		:any(
			[href*="/issues"],
			[href*="/pulls"]
		):not([href*="sort%3A"]):not(.issues-reset-query)
	`));
	for (const link of links) {
		// Pick only links to lists, not single issues
		if (!/(issues|pulls)\/?$/.test(link.pathname)) {
			continue;
		}

		const search = new URLSearchParams(link.search);
		const queries = (search.get('q') || '').split(/\s/);
		const isPRList = /\/pulls\/?$/.test(link.pathname) || queries.includes('is:pr');

		// /pulls/ and /issues/ imply some search queries;
		// when we set ?q=* we override them, so they need to be manually added again.
		const type = isPRList ? 'is:pr' : 'is:issue';
		if (!queries.includes(type)) {
			queries.push(type);
		}

		// Add sorting last
		queries.push('sort:updated-desc');

		search.set('q', queries.join(' ').trim());
		link.search = search;
	}
}
