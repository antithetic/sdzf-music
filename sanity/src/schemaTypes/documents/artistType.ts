import {defineType, defineField} from 'sanity'

export default defineType({
  name: 'artist',
  title: 'Artist',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Performance Description',
      type: 'text',
      rows: 1,
    }),
    defineField({
      name: 'type',
      title: 'Performance Type',
      type: 'array',
      of: [{type: 'string'}],
      options: {
        list: [
          {title: 'Live', value: 'live'},
          {title: 'Band', value: 'band'},
          {title: 'DJ', value: 'dj'},
          {title: 'Hybrid', value: 'hybrid'},
          {title: 'Other', value: 'other'}
        ]
      }
    }),
    defineField({
      name: 'genreTags',
      title: 'Genre',
      type: 'tags',
      options: {
        includeFromRelated: 'genreTags',
        allowCreate: true,
      }
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (rule) => rule
      .required()
      .error(`Required to generate a page on the website`),
    })
  ],
})