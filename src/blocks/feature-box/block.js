/**
 * BLOCK: feature-box
 *
 * Registering a basic block with Gutenberg.
 * Simple block, renders and saves the same content without any interactivity.
 */

//Import Icon
import icon from './icons/icon';

//  Import CSS.
import './style.scss';
import './editor.scss';
import { version_1_1_2, version_1_1_5, oldAttributes } from './oldVersions';
import { blockControls, editorDisplay } from './components';
import { richTextToHTML } from '../../common';

const { __ } = wp.i18n;

const { registerBlockType, createBlock } = wp.blocks;

const { withDispatch, withSelect } = wp.data;

const { withState, compose } = wp.compose;

const attributes = {
	column: {
		type: 'string',
		default: '2'
	},
	columnOneTitle: {
		type: 'string',
		default: 'Title One'
	},
	title1Align: {
		type: 'string',
		default: 'center'
	},
	columnTwoTitle: {
		type: 'string',
		default: 'Title Two'
	},
	title2Align: {
		type: 'string',
		default: 'center'
	},
	columnThreeTitle: {
		type: 'string',
		default: 'Title Three'
	},
	title3Align: {
		type: 'string',
		default: 'center'
	},
	columnOneBody: {
		type: 'string',
		default:
			'Gutenberg is really awesome! Ultimate Blocks makes it more awesome!'
	},
	body1Align: {
		type: 'string',
		default: 'left'
	},
	columnTwoBody: {
		type: 'string',
		default:
			'Gutenberg is really awesome! Ultimate Blocks makes it more awesome!'
	},
	body2Align: {
		type: 'string',
		default: 'left'
	},
	columnThreeBody: {
		type: 'string',
		default:
			'Gutenberg is really awesome! Ultimate Blocks makes it more awesome!'
	},
	body3Align: {
		type: 'string',
		default: 'left'
	},
	imgOneURL: {
		type: 'string',
		default: ''
	},
	imgOneID: {
		type: 'number'
	},
	imgOneAlt: {
		type: 'string',
		default: ''
	},
	imgTwoURL: {
		type: 'string',
		default: ''
	},
	imgTwoID: {
		type: 'number'
	},
	imgTwoAlt: {
		type: 'string',
		default: ''
	},
	imgThreeURL: {
		type: 'string',
		default: ''
	},
	imgThreeID: {
		type: 'number'
	},
	imgThreeAlt: {
		type: 'string',
		default: ''
	}
};

/**
 * Register: aa Gutenberg Block.
 *
 * Registers a new block provided a unique name and an object defining its
 * behavior. Once registered, the block is made editor as an option to any
 * editor interface where blocks are implemented.
 *
 * @link https://wordpress.org/gutenberg/handbook/block-api/
 * @param  {string}   name     Block name.
 * @param  {Object}   settings Block settings.
 * @return {?WPBlock}          The block, if it has been successfully
 *                             registered; otherwise `undefined`.
 */
registerBlockType('ub/feature-box', {
	title: __('Feature Box'),
	icon: icon,
	category: 'ultimateblocks',
	keywords: [__('Feature Box'), __('Column'), __('Ultimate Blocks')],
	attributes: oldAttributes,

	supports: {
		inserter: false
	},

	/**
	 * The edit function describes the structure of your block in the context of the editor.
	 * This represents what the editor will render when the block is used.
	 *
	 * The "edit" property must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	edit: compose([
		withSelect((select, ownProps) => {
			const { getBlock } = select('core/editor');

			const { clientId } = ownProps;

			return {
				block: getBlock(clientId)
			};
		}),
		withDispatch(dispatch => {
			const { replaceBlock } = dispatch('core/editor');
			return { replaceBlock };
		}),
		withState({ editable: '' })
	])(function(props) {
		const { isSelected, block, replaceBlock } = props;

		return [
			isSelected && blockControls(props),

			<div className={props.className}>
				<button
					onClick={() => {
						const {
							columnOneTitle,
							columnTwoTitle,
							columnThreeTitle,
							columnOneBody,
							columnTwoBody,
							columnThreeBody,
							imgOneURL,
							imgOneAlt,
							imgTwoURL,
							imgTwoAlt,
							imgThreeURL,
							imgThreeAlt,
							...otherAttributes
						} = props.attributes;
						replaceBlock(
							block.clientId,
							createBlock(
								'ub/feature-box-block',
								Object.assign(otherAttributes, {
									columnOneTitle: columnOneTitle
										.map(item =>
											typeof item === 'string'
												? item
												: richTextToHTML(item)
										)
										.join(''),
									columnOneBody: columnOneBody
										.map(item =>
											typeof item === 'string'
												? item
												: richTextToHTML(item)
										)
										.join(''),
									columnTwoTitle: columnTwoTitle
										.map(item =>
											typeof item === 'string'
												? item
												: richTextToHTML(item)
										)
										.join(''),
									columnTwoBody: columnTwoBody
										.map(item =>
											typeof item === 'string'
												? item
												: richTextToHTML(item)
										)
										.join(''),
									columnThreeTitle: columnThreeTitle
										.map(item =>
											typeof item === 'string'
												? item
												: richTextToHTML(item)
										)
										.join(''),
									columnThreeBody: columnThreeBody
										.map(item =>
											typeof item === 'string'
												? item
												: richTextToHTML(item)
										)
										.join('')
								})
							)
						);
					}}
				>
					Block is being phased out. Click here to replace with newest
					version
				</button>
				{editorDisplay(props)}
			</div>
		];
	}),

	/**
	 * The save function defines the way in which the different attributes should be combined
	 * into the final markup, which is then serialized by Gutenberg into post_content.
	 *
	 * The "save" property must be specified and must be a valid function.
	 *
	 * @link https://wordpress.org/gutenberg/handbook/block-api/block-edit-save/
	 */
	save: function(props) {
		const {
			column,
			columnOneTitle,
			columnTwoTitle,
			columnThreeTitle,
			columnOneBody,
			columnTwoBody,
			columnThreeBody,
			imgOneURL,
			imgOneAlt,
			imgTwoURL,
			imgTwoAlt,
			imgThreeURL,
			imgThreeAlt,
			title1Align,
			title2Align,
			title3Align,
			body1Align,
			body2Align,
			body3Align
		} = props.attributes;

		return (
			<div className={props.className}>
				<div className={`ub_feature_box column_${column}`}>
					<div class="ub_feature_1">
						<img
							className="ub_feature_one_img"
							src={imgOneURL}
							alt={imgOneAlt}
						/>
						<p
							className="ub_feature_one_title"
							style={{ textAlign: title1Align }}
						>
							{columnOneTitle}
						</p>
						<p
							className="ub_feature_one_body"
							style={{ textAlign: body1Align }}
						>
							{columnOneBody}
						</p>
					</div>
					<div class="ub_feature_2">
						<img
							className="ub_feature_two_img"
							src={imgTwoURL}
							alt={imgTwoAlt}
						/>
						<p
							className="ub_feature_two_title"
							style={{ textAlign: title2Align }}
						>
							{columnTwoTitle}
						</p>
						<p
							className="ub_feature_two_body"
							style={{ textAlign: body2Align }}
						>
							{columnTwoBody}
						</p>
					</div>
					<div class="ub_feature_3">
						<img
							className="ub_feature_three_img"
							src={imgThreeURL}
							alt={imgThreeAlt}
						/>
						<p
							className="ub_feature_three_title"
							style={{ align: title3Align }}
						>
							{columnThreeTitle}
						</p>
						<p
							className="ub_feature_three_body"
							style={{ align: body3Align }}
						>
							{columnThreeBody}
						</p>
					</div>
				</div>
			</div>
		);
	},
	deprecated: [
		{
			attributes: oldAttributes,
			save: version_1_1_2
		},
		{
			attributes: oldAttributes,
			save: version_1_1_5
		}
	]
});

registerBlockType('ub/feature-box-block', {
	title: __('Feature Box'),
	icon: icon,
	category: 'ultimateblocks',
	keywords: [__('Feature Box'), __('Column'), __('Ultimate Blocks')],
	attributes,

	edit: compose([
		withSelect((select, ownProps) => {
			const { getBlock } = select('core/editor');

			const { clientId } = ownProps;

			return {
				block: getBlock(clientId)
			};
		}),
		withDispatch(dispatch => {
			const { replaceBlock } = dispatch('core/editor');
			return { replaceBlock };
		}),
		withState({ editable: '' })
	])(function(props) {
		const { isSelected } = props;

		return [
			isSelected && blockControls(props),

			<div className={props.className}>{editorDisplay(props)}</div>
		];
	}),
	save: () => null
});
