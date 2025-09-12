import {Users} from 'lucide-react'
import {defineField, defineType} from 'sanity'

export const artistType = defineType({
  name: 'artist',
  title: 'Artist',
  type: 'document',
  icon: Users,
  fields: [
    defineField({
      name: 'name',
      title: 'Artist Name',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Performance Description',
      type: 'text',
      rows: 1,
    }),
    defineField({
      name: 'bio',
      title: 'Artist Bio',
      type: 'text',
      description: 'A short bio of the artist, for promotional purposes.',
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
          {title: 'Other', value: 'other'},
        ],
      },
    }),
    defineField({
      name: 'genreTags',
      title: 'Genre',
      type: 'tags',
      options: {
        includeFromRelated: 'genreTags',
        allowCreate: true,
      },
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
        rule.required().error(`Required to generate a page on the website`),
    }),
    defineField({
      name: 'icon',
      title: 'Icon',
      type: 'icon',
      options: {
        collections: ['lucide', 'lucide-lab'],
        showName: true,
      },
    }),
  ],
})
