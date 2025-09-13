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
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'location',
      title: 'Location',
      description: 'Venue or space where this area is located',
      type: 'reference',
      to: [
        {
          type: 'venue',
        },
      ],
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
  preview: {
    select: {
      title: 'Name',
      subtitle: 'location.name',
      media: 'icon',
    },
    prepare({title, subtitle, media}) {
      return {
        title,
        subtitle: subtitle ? `${subtitle}` : 'No location set',
        media,
      }
    },
  },
})
