import slugify from 'slugify';

export const generateSlug = (name) => slugify(name, { lower: true, strict: true });