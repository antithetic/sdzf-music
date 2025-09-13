import {Tag} from 'lucide-react'
import {defineField, defineType} from 'sanity'

export const siteTagType = defineType({
  name: 'siteTag',
  title: 'Tag',
  type: 'document',
  icon: Tag,
  fields: [
    defineField({
      name: 'name',
      title: 'Tag Name',
      type: 'string',
      validation: (rule) => rule.required().error('Tag name is required'),
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
  preview: {
    select: {
      title: 'name',
    },
  },
})
