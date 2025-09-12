import {defineField, defineType} from 'sanity'

export const venueType = defineType({
  name: 'venue',
  title: 'Venue',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Venue Name',
      type: 'string',
      validation: (rule) => rule.required().error('Venue name is required'),
    }),
    defineField({
      name: 'address',
      title: 'Address',
      type: 'string',
      validation: (rule) => rule.required().error('Address is required'),
    }),
    defineField({
      name: 'capacity',
      title: 'Capacity',
      type: 'number',
      validation: (rule) =>
        rule.min(0).error('Capacity must be a positive number'),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 3,
      description: 'A brief description of the venue.',
      validation: (rule) => rule.max(500).warning('Description is quite long'),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (rule) =>
        rule
          .required()
          .error('Slug is required to generate a page on the website'),
    }),
  ],
})
