const { __ } = wp.i18n;

const { registerBlockType } = wp.blocks;
const { RichText, BlockControls, InspectorControls, ColorPalette } = wp.editor;
const { Toolbar, IconButton, Dropdown, PanelBody } = wp.components;
const { withState } = wp.compose;

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import icon, { decreaseIndentIcon, increaseIndentIcon } from './icon';
import TextareaAutosize from 'react-textarea-autosize';
import { Component } from 'react';

import './editor.scss';
import './style.scss';

import { library } from '@fortawesome/fontawesome-svg-core';

library.add(fas, fab);

const cloneObject = obj => JSON.parse(JSON.stringify(obj));

class StyledList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			edits: 0
		};
	}
	render() {
		const {
			list,
			updateList,
			iconColor,
			selectedItem,
			updateSelectedItem,
			increaseIndent,
			decreaseIndent
		} = this.props;

		const { edits } = this.state;
		return (
			<ul className="fa-ul" key={edits}>
				{list.map((item, i) => (
					<li
						style={{ left: `${item.indent + 0.5}em` }}
						onKeyDown={e => {
							switch (e.key) {
								case 'Tab':
									if (e.shiftKey) {
										console.log(
											'increase indent not yet implemented'
										);
									} else {
										console.log(
											'decrease indent not yet implemented'
										);
									}

									break;
								case 'Backspace':
								case 'Delete':
									if (
										item.text.length === 0 &&
										list.length > 1
									) {
										deleteElement(i);
										this.setState({ edits: edits + 1 });
									}
									break;
								default:
									break;
							}
						}}
					>
						<span className="fa-li">
							<FontAwesomeIcon
								icon={
									Object.keys(fas)
										.filter(
											iconName =>
												fas[iconName].prefix === 'fas'
										)
										.includes(
											`fa${dashesToCamelcase(
												item.selectedIcon
											)}`
										)
										? item.selectedIcon
										: ['fab', item.selectedIcon]
								}
								color={iconColor}
							/>
						</span>
						<RichText
							value={item.text}
							multiline={false}
							onChange={newValue => {
								let newList = cloneObject(list);
								newList[i].text = newValue;
								updateList(newList);
							}}
							onSplit={(before, after) => {
								updateList([
									...list.slice(0, i),
									Object.assign(cloneObject(list[i]), {
										text: before
									}),
									Object.assign(cloneObject(list[i]), {
										text: after
									}),
									...list.slice(i + 1)
								]);

								this.setState({
									edits: edits + 1
								});
							}}
						/>
					</li>
				))}
			</ul>
		);
	}
}

const allIcons = Object.assign(fas, fab);

const dashesToCamelcase = str =>
	str
		.split('-')
		.map(s => s[0].toUpperCase() + s.slice(1))
		.join('');

registerBlockType('ub/styled-list', {
	title: __('Styled List'),
	icon: icon,
	category: 'ultimateblocks',
	attributes: {
		listItem: {
			type: 'array',
			default: [{ text: '', selectedIcon: 'circle', indent: 0 }] //each item is an object with text, selectedIcon, and indent properties
		},
		iconColor: {
			type: 'string',
			default: '#000000'
		}
	},
	keywords: [__('List'), __('Styled List'), __('Ultimate Blocks')],
	edit: withState({
		selectedItem: -1,
		availableIcons: [],
		iconSearchTerm: '',
		recentSelection: '',
		itemRef: []
	})(function(props) {
		const {
			isSelected,
			attributes,
			setAttributes,
			setState,
			selectedItem,
			availableIcons,
			iconSearchTerm
		} = props;
		const { listItem, iconColor } = attributes;
		if (availableIcons.length === 0) {
			const iconList = Object.keys(allIcons).sort();
			setState({ availableIcons: iconList.map(name => allIcons[name]) });
		}

		const increaseIndent = itemNumber => {
			let newListItem = cloneObject(listItem);
			if (
				newListItem[itemNumber].indent <=
				newListItem[itemNumber - 1].indent
			) {
				newListItem[itemNumber].indent++;
			}
			setAttributes({ listItem: newListItem });
		};

		const decreaseIndent = itemNumber => {
			let newListItem = cloneObject(listItem);
			if (newListItem[itemNumber].indent > 0) {
				newListItem[itemNumber].indent--;
				let i = itemNumber + 1;

				while (
					i < newListItem.length &&
					newListItem[i - 1].indent + 1 < newListItem[i].indent
				) {
					newListItem[i].indent--;
					i++;
				}
			}
			setAttributes({ listItem: newListItem });
		};

		return [
			isSelected && (
				<BlockControls>
					<Toolbar>
						<IconButton
							icon={decreaseIndentIcon}
							label={__('Decrease indent')}
							onClick={() => {
								if (selectedItem > 0) {
									decreaseIndent(selectedItem);
								}
							}}
						/>
						<IconButton
							icon={increaseIndentIcon}
							label={__('Increase indent')}
							onClick={() => {
								if (selectedItem > 0) {
									increaseIndent(selectedItem);
								}
							}}
						/>
					</Toolbar>
				</BlockControls>
			),
			isSelected && (
				<InspectorControls>
					<PanelBody title={__('Icon Options')}>
						<div
							style={{
								display: 'grid',
								gridTemplateColumns: '5fr 1fr'
							}}
						>
							<p>{__('Selected icon')}</p>
							{listItem.length > 0 && (
								<Dropdown
									position="bottom right"
									renderToggle={({ isOpen, onToggle }) => (
										<IconButton
											icon={
												<FontAwesomeIcon
													icon={
														Object.keys(fas)
															.filter(
																iconName =>
																	fas[
																		iconName
																	].prefix ===
																	'fas'
															)
															.includes(
																`fa${dashesToCamelcase(
																	listItem[0]
																		.selectedIcon
																)}`
															)
															? listItem[0]
																	.selectedIcon
															: [
																	'fab',
																	listItem[0]
																		.selectedIcon
															  ]
													}
													color={iconColor}
													size="lg"
												/>
											}
											label={__('Select icon for list')}
											onClick={onToggle}
											aria-expanded={isOpen}
										/>
									)}
									renderContent={() => (
										<div>
											<input
												type="text"
												value={iconSearchTerm}
												onChange={e =>
													setState({
														iconSearchTerm:
															e.target.value
													})
												}
											/>
											<br />
											{availableIcons.length > 0 &&
												availableIcons
													.filter(i =>
														i.iconName.includes(
															iconSearchTerm
														)
													)
													.map(i => (
														<IconButton
															className="ub-styled-list-available-icon"
															icon={
																<FontAwesomeIcon
																	icon={i}
																	size="lg"
																/>
															}
															label={i.iconName}
															onClick={() => {
																let newListItem = cloneObject(
																	listItem
																);
																newListItem.forEach(
																	item => {
																		item.selectedIcon =
																			i.iconName;
																	}
																);
																setState({
																	recentSelection:
																		i.iconName
																});

																setAttributes({
																	listItem: newListItem
																});
															}}
														/>
													))}
										</div>
									)}
								/>
							)}
						</div>
						<p>{__('Icon color')}</p>
						<ColorPalette
							value={iconColor}
							onChange={colorValue =>
								setAttributes({ iconColor: colorValue })
							}
						/>
					</PanelBody>
				</InspectorControls>
			),
			<div className="ub-styled-list">
				<StyledList
					list={listItem}
					updateList={newList => setAttributes({ listItem: newList })}
					iconColor={iconColor}
					selectedItem={selectedItem}
					updateSelectedItem={newSelectedItem =>
						setState({ selectedItem: newSelectedItem })
					}
					increaseIndent={itemNumber => increaseIndent(itemNumber)}
					decreaseIndent={itemNumber => decreaseIndent(itemNumber)}
				/>
			</div>
		];
	}),
	save(props) {
		const { listItem, iconColor } = props.attributes;

		let sortedList = [];

		const placeItem = (arr, item) => {
			if (arr.length === 0 || arr[0].indent === item.indent) {
				arr.push(Object.assign({}, item));
			} else if (arr[arr.length - 1].indent < item.indent) {
				if (!arr[arr.length - 1].children) {
					arr[arr.length - 1].children = [Object.assign({}, item)];
				} else placeItem(arr[arr.length - 1].children, item);
			}
		};

		listItem.forEach(item => {
			placeItem(sortedList, item);
		});

		const parseList = list => {
			return list.map(item => (
				<li>
					<span class="fa-li">
						<i
							className={`${
								Object.keys(fas)
									.filter(
										iconName =>
											fas[iconName].prefix === 'fas'
									)
									.includes(
										`fa${dashesToCamelcase(
											item.selectedIcon
										)}`
									)
									? 'fas'
									: 'fab'
							} fa-${item.selectedIcon}`}
							style={{ color: iconColor }}
						/>
					</span>
					<RichText.Content
						value={item.text.replace(/\n/g, '<br>')}
					/>
					{item.children && (
						<ul className="fa-ul">{parseList(item.children)}</ul>
					)}
				</li>
			));
		};

		return (
			<div>
				<ul className="fa-ul">{parseList(sortedList)}</ul>
			</div>
		);
	}
});
