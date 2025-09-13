import {FolderKanban} from 'lucide-react'
import {defineField, defineType} from 'sanity'

export const projectType = defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  icon: FolderKanban,
  groups: [
    {name: 'editorial', title: 'Editorial', default: true},
    {name: 'details', title: 'Details'},
    {name: 'metadata', title: 'Metadata'},
  ],
  fields: [
    defineField({
      name: 'title',
      title: 'Project Title',
      description: 'The title of the project',
      type: 'string',
      group: 'editorial',
      validation: (Rule) => Rule.required().error('Title is required'),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      description: 'Used to generate the URL for this project',
      group: 'metadata',
      options: {
        source: 'title',
        maxLength: 96,
        isUnique: (value, context) => context.defaultIsUnique(value, context),
      },
      validation: (Rule) => Rule.required().error('Slug is required'),
    }),
    defineField({
      name: 'startDate',
      title: 'Start Date',
      description: 'The date the project started',
      type: 'date',
      group: 'details',
      validation: (Rule) => Rule.required().error('Start date is required'),
    }),
    defineField({
      name: 'endDate',
      title: 'End Date',
      description: 'The date the project ended',
      type: 'date',
      group: 'details',
      validation: (Rule) =>
        Rule.custom((end, ctx) => {
          const start = (ctx.document as {startDate?: string})?.startDate
          if (end && start && new Date(end) < new Date(start)) {
            return 'End date cannot be before start date'
          }
          return true
        }),
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'array',
      group: 'editorial',
      of: [
        {
          type: 'block',
          styles: [{title: 'Normal', value: 'normal'}],
          marks: {
            decorators: [
              {title: 'Bold', value: 'strong'},
              {title: 'Italic', value: 'em'},
              {title: 'Underline', value: 'underline'},
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: (Rule) =>
                      Rule.uri({
                        scheme: ['http', 'https', 'mailto', 'tel'],
                      }).error('Please enter a valid URL'),
                  },
                ],
              },
            ],
          },
        },
      ],
    }),
    defineField({
      name: 'projectImages',
      title: 'Project Images',
      description: 'Add images documenting this project',
      type: 'array',
      group: 'editorial',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            defineField({
              name: 'alt',
              type: 'string',
              title: 'Alternative Text',
              description: 'A short description for SEO and accessibility',
              validation: (Rule) =>
                Rule.required().error('Alt text is required'),
              hidden: ({parent}) => !parent?.asset,
            }),
          ],
        },
      ],
      validation: (Rule) =>
        Rule.min(1).error('At least one project image is required'),
    }),
    defineField({
      name: 'projectTags',
      title: 'Project Tags',
      description: 'Tags for the project',
      type: 'tags',
      group: 'metadata',
      options: {
        allowCreate: true,
      },
    }),
    defineField({
      name: 'artists',
      title: 'Artists',
      description: 'Add artists associated with this project, if any ',
      type: 'array',
      group: 'details',
      of: [{type: 'reference', to: [{type: 'artist'}]}],
    }),
    defineField({
      name: 'venues',
      title: 'Venues',
      description: 'The venues associated with this project',
      type: 'array',
      group: 'details',
      of: [{type: 'reference', to: [{type: 'venue'}]}],
    }),
    // defineField({
    //   name: 'pressReleases',
    //   title: 'Press Releases',
    //   description: 'Add press releases related to this project',
    //   type: 'array',
    //   group: 'metadata',
    //   of: [
    //     {
    //       type: 'reference',
    //       to: [{type: 'pressRelease'}],
    //     },
    //   ],
    // }),
  ],
  preview: {
    select: {
      title: 'title',
      startDate: 'startDate',
    },
    prepare({title, startDate}) {
      const date = startDate
        ? new Date(startDate).toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric',
          })
        : 'No date'
      return {
        title,
        subtitle: date,
        media: FolderKanban,
      }
    },
  },
})
