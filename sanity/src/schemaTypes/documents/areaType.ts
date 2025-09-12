import {LandPlot} from 'lucide-react'
import {defineField, defineType} from 'sanity'

export const areaType = defineType({
  name: 'area',
  title: 'Area',
  type: 'document',
  icon: LandPlot,
  fields: [
    defineField({
      name: 'Name',
      title: 'Area Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'Description',
      title: 'Description',
      type: 'text',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'Name',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
  ],
})
