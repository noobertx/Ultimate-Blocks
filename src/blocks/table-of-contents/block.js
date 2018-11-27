import icon from './icon';

const { __ } = wp.i18n; // Import __() from wp.i18n
const { registerBlockType } = wp.blocks;

const { select, subscribe } = wp.data;

const { RichText } = wp.editor;

const { withState } = wp.compose;

import './editor.scss';
import './style.scss';

import { Component } from 'react';

class TableOfContents extends Component {
	constructor(props) {
		super(props);
		this.state = {
			headers: props.headers,
			unsubscribe: null,
			showList: true
		};
	}

	componentDidMount() {
		const makeHeaderArray = origHeaders => {
			let arrays = [];
			origHeaders.forEach(header => {
				let last = arrays.length - 1;
				if (
					arrays.length === 0 ||
					arrays[last][0].level < header.level
				) {
					arrays.push([header]);
				} else if (arrays[last][0].level === header.level) {
					arrays[last].push(header);
				} else {
					while (arrays[last][0].level > header.level) {
						if (arrays.length > 1) {
							arrays[arrays.length - 2].push(arrays.pop());
							last = arrays.length - 1;
						} else break;
					}
					if (arrays[last][0].level === header.level) {
						arrays[last].push(header);
					}
				}
			});

			while (
				arrays.length > 1 &&
				arrays[arrays.length - 1][0].level >
					arrays[arrays.length - 2][0].level
			) {
				arrays[arrays.length - 2].push(arrays.pop());
			}

			return arrays[0];
		};

		const getHeaderBlocks = () =>
			select('core/editor')
				.getBlocks()
				.filter(block => block.name === 'core/heading');

		const setHeaders = () => {
			const headers = getHeaderBlocks().map(header => header.attributes);

			headers.forEach((heading, key) => {
				const headingAnchorEmpty =
					typeof heading.anchor === 'undefined' ||
					heading.anchor === '';
				const headingContentEmpty =
					typeof heading.content === 'undefined' ||
					heading.content === '';
				const headingDefaultAnchor =
					!headingAnchorEmpty &&
					heading.anchor.indexOf(key + '-') === 0;
				if (
					!headingContentEmpty &&
					(headingAnchorEmpty || headingDefaultAnchor)
				) {
					heading.anchor =
						key +
						'-' +
						heading.content
							.toString()
							.toLowerCase()
							.replace(' ', '-');
				}
			});

			this.setState({ headers: makeHeaderArray(headers) });
		};

		setHeaders();

		const unsubscribe = subscribe(() => {
			setHeaders();
		});
		this.setState({ unsubscribe });
	}

	componentWillUnmount() {
		this.state.unsubscribe();
	}

	componentDidUpdate(prevProps, prevState) {
		if (
			JSON.stringify(prevProps.headers) !==
			JSON.stringify(prevState.headers)
		) {
			this.props.blockProp.setAttributes({
				links: JSON.stringify(this.state.headers)
			});
		}
	}

	render() {
		const parseList = list => {
			let items = [];
			list.forEach(item => {
				items.push(
					Array.isArray(item) ? (
						parseList(item)
					) : (
						<li>
							<a href={`#${item.anchor}`}>{item.content}</a>
						</li>
					)
				);
			});
			return <ul>{items}</ul>;
		};

		if (this.state.headers) {
			return (
				<div
					className="ub_table-of-contents-container"
					style={{
						display: this.props.isHidden ? 'none' : 'initial'
					}}
				>
					{parseList(this.state.headers)}
				</div>
			);
		} else {
			return (
				<p className="ub_table-of-contents-placeholder">
					Add a header to begin generating the table of contents
				</p>
			);
		}
	}
}

registerBlockType('ub/table-of-contents', {
	title: __('Table of Contents'),
	icon: icon,
	category: 'ultimateblocks',
	keywords: [__('Table of Contents'), __('Ultimate Blocks')],

	attributes: {
		title: {
			type: 'string',
			default: '',
			selector: '.ub_table-of-contents-title'
		},
		showList: {
			type: 'boolean',
			default: true
		},
		links: {
			type: 'string',
			default: ''
		}
	},

	supports: {
		multiple: false
	},

	edit: withState({ editable: 'content' })(function(props) {
		const { editable, setAttributes, isSelected } = props;
		const { showList, links, title } = props.attributes;
		const onSetActiveEditable = newEditable => () => {
			setState({ editable: newEditable });
		};
		return (
			<div className="ub_table-of-contents">
				<RichText
					placeholder={__('Optional title')}
					className="ub_table-of-contents-title"
					onChange={text => setAttributes({ title: text })}
					value={title}
					multiline={false}
					isSelected={
						isSelected && editable === 'table_of_contents_title'
					}
					onFocus={onSetActiveEditable('table_of_contents_title')}
					keepPlaceholderOnFocus={true}
				/>
				[
				<a
					className="ub_table-of-contents-toggle"
					href="#"
					onClick={() => {
						props.setAttributes({
							showList: !showList
						});
					}}
				>
					{showList ? __('hide') : __('show')}
				</a>
				]
				{showList && (
					<TableOfContents
						headers={links && JSON.parse(links)}
						blockProp={props}
					/>
				)}
			</div>
		);
	}),

	save(props) {
		const { showList, links, title } = props.attributes;
		return (
			<div className="ub_table-of-contents">
				{title && (
					<span>
						<span className="ub_table-of-contents-title">
							{title}
						</span>{' '}
						[
						<a className="ub_table-of-contents-toggle" href="#">
							{showList ? __('hide') : __('show')}
						</a>
						]
					</span>
				)}
				<TableOfContents
					isHidden={!showList || title}
					headers={links && JSON.parse(links)}
				/>
			</div>
		);
	}
});