
import { registerBlockType, registerBlockCategory } from '@wordpress/blocks';

// Register a custom category
const customCategory = {
    slug: 'rw-blocks-category',
    title: 'RW Blocks',
    icon: 'heart'
};

wp.blocks.updateCategory(customCategory.slug, {
    title: customCategory.title,
    icon: customCategory.icon,
});

// Then, register your blocks
import './slideshow';
import './slide';
import './world-map';
