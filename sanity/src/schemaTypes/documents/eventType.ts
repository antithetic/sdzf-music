import {CalendarDays} from 'lucide-react'
import {defineField, defineType} from 'sanity'

export const eventType = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  icon: CalendarDays,
  groups: [
    {name: 'editorial', title: 'Editorial', default: true},
    {name: 'details', title: 'Details'},
    {name: 'venue', title: 'Venue'},
  ],
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      description: 'The name of the event',
      group: 'editorial',
    }),
    defineField({
      name: 'subtitle',
      type: 'string',
      description: 'A subtitle or tagline for the event',
      group: 'editorial',
    }),

    defineField({
      name: 'eventType',
      title: 'Event Type',
      type: 'array',
      of: [{type: 'string'}],
      group: 'details',
      description: 'Specify the type of this event',
      options: {
        list: [
          {title: 'Artist Talk', value: 'artist talk'},
          {title: 'Community', value: 'community'},
          {title: 'Culture', value: 'culture'},
          {title: 'DJs', value: 'djs'},
          {title: 'Literature', value: 'literature'},
          {title: 'Music', value: 'music'},
          {title: 'Performance', value: 'Performance'},
          {title: 'Pop-Up', value: 'pop-up'},
          {title: 'Workshop', value: 'workshop'},
          'other',
        ],
        layout: 'grid',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'otherEventType',
      title: 'Other Event Type',
      type: 'string',
      group: 'details',
      description: 'Please specify the type of event',
      hidden: ({document}) => document?.eventType !== 'other',
      validation: (Rule) =>
        Rule.custom((field, context) => {
          if (context.document?.eventType === 'other' && !field) {
            return 'Please specify the event type'
          }
          return true
        }),
    }),
    defineField({
      name: 'venueType',
      type: 'string',
      group: 'details',
      description: 'Whether this event is in-person, virtual, or hybrid',
      options: {
        list: ['in-person', 'virtual', 'hybrid'],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'virtualEventLink',
      title: 'Virtual Event Link',
      type: 'url',
      group: 'details',
      description: 'Link to the virtual event (e.g., Zoom, Google Meet, etc.)',
      hidden: ({document}) => document?.venueType === 'in-person',
    }),
    defineField({
      name: 'virtualEventInfo',
      title: 'Virtual Event Information',
      type: 'array',
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
            annotations: [],
          },
          lists: [],
        },
      ],
      group: 'details',
      description:
        'Additional information about the virtual component (e.g., streaming details, how to join)',
      hidden: ({document}) => document?.venueType === 'in-person',
    }),
    defineField({
      name: 'date',
      title: 'Event Date',
      type: 'datetime',
      group: 'details',
      description: 'The date and time of the event',
      validation: (Rule) =>
        Rule.required().error(
          'Required to generate a event page on the website',
        ),
    }),
    defineField({
      name: 'doorsOpen',
      description: 'The time the doors open for the event',
      type: 'datetime',
      group: 'details',
    }),
    defineField({
      name: 'eventEnds',
      description: 'The date and time the event ends',
      type: 'datetime',
      group: 'details',
    }),

    defineField({
      name: 'venue',
      type: 'reference',
      description: 'Select the venue for this event',
      to: [{type: 'venue'}],
      group: 'details',
      hidden: ({document}) => document?.venueType === 'virtual',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (value && context?.document?.venueType === 'virtual') {
            return 'Only in-person or hybrid events can have a venue'
          }
          return true
        }),
    }),
    defineField({
      name: 'artists',
      type: 'array',
      description: 'Select the artists for this event',
      of: [{type: 'reference', to: [{type: 'artist'}]}],
      group: 'details',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const headline = context.document?.headline as {_ref: string}
          if (
            headline &&
            (value as {_ref: string}[])?.some(
              (artist) => artist._ref === headline._ref,
            )
          ) {
            return 'Regular artists cannot include the headline artist'
          }
          return true
        }),
    }),
    defineField({
      name: 'headline',
      type: 'reference',
      title: 'Headline Artist',
      description: 'Select the headline artist for this event, if any',
      to: [{type: 'artist'}],
      group: 'details',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          const artists = (context.document?.artists as {_ref: string}[]) || []
          if (value && artists.some((artist) => artist._ref === value._ref)) {
            return 'Headline artist cannot be in the regular artists list'
          }
          return true
        }),
    }),
    defineField({
      name: 'image',
      description: 'Upload the promotional image for this event',
      type: 'image',
      group: 'editorial',
      fields: [
        defineField({
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Important for SEO and accessibility',
          validation: (Rule) => Rule.required().error('Alt text is required'),
          hidden: ({parent}) => !parent?.asset,
        }),
      ],
    }),
    defineField({
      name: 'details',
      type: 'array',
      description: 'Add details about the event',
      of: [{type: 'block'}],
      group: 'editorial',
    }),

    defineField({
      name: 'siteTag',
      title: 'Event Tags',
      description: 'Tags for the event',
      type: 'tags',
      group: 'venue',
      options: {
        includeFromRelated: 'siteTag',
        allowCreate: true,
      },
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      description: 'How this event will be referenced on the website',
      group: 'venue',
      options: {source: 'name'},
      validation: (Rule) =>
        Rule.required().error('Required to generate a page on the website'),
      hidden: ({document}) => !document?.name,
    }),
    defineField({
      name: 'tickets',
      type: 'url',
      description: 'Add the link to the tickets for this event, if any',
      group: 'details',
    }),
    defineField({
      name: 'isFree',
      title: 'Is this a free event?',
      type: 'boolean',
      description: 'Select if the exhibition is free to attend',
      initialValue: false,
      group: 'details',
    }),

    defineField({
      name: 'coverCharge',
      title: 'Cover Charge',
      type: 'number',
      group: 'details',
      description: 'The amount of money charged for entry to the exhibition',
      hidden: ({document}) => document?.isFree === true,
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (!context.document?.isFree && !value) {
            return 'Cover charge is required for paid events'
          }
          if (value && (value < 0 || !Number.isFinite(value))) {
            return 'Cover charge must be a positive number'
          }
          if (value && !/^\d+(\.\d{1,2})?$/.test(value.toString())) {
            return 'Cover charge must be a valid dollar amount (up to 2 decimal places)'
          }
          return true
        }),
    }),

    defineField({
      name: 'additionalImages',
      title: 'Additional Images',
      description: 'Add up to 5 additional images for this event',
      type: 'array',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
        },
      ],
      validation: (Rule) => Rule.max(5),
      group: 'editorial',
    }),
  ],
  // Update the preview key in the schema
  preview: {
    select: {
      name: 'name',
      venue: 'venue.name',
      headline: 'headline',
      artists: 'artists',
      date: 'date',
      doorsOpen: 'doorsOpen',
      eventEnds: 'eventEnds',
      image: 'image',
    },
    prepare({
      name,
      venue,
      headline,
      artists,
      date,
      doorsOpen,
      eventEnds,
      image,
    }) {
      const nameFormatted = name || 'Untitled event'

      const getOrdinal = (n: number) => {
        const s = ['th', 'st', 'nd', 'rd']
        const v = n % 100
        return n + (s[(v - 20) % 10] || s[v] || s[0])
      }

      const formatDate = (dateString: string) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        const month = date.toLocaleDateString('en-US', {month: 'long'})
        const day = getOrdinal(date.getDate())
        const year = date.getFullYear()
        const time = date
          .toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true,
          })
          .toLowerCase()

        return `${month} ${day}, ${year} ${time}`
      }

      const dateFormatted = date ? formatDate(date) : 'No date set'
      const doorsOpenFormatted = doorsOpen
        ? `Doors open: ${formatDate(doorsOpen)}`
        : ''
      const eventEndsFormatted = eventEnds
        ? `Ends: ${formatDate(eventEnds)}`
        : ''

      const totalArtists = (headline?.length || 0) + (artists?.length || 0)
      const artistText = totalArtists > 1 ? `(${totalArtists} artists)` : ''

      const subtitle = [
        dateFormatted,
        doorsOpenFormatted,
        eventEndsFormatted,
        venue ? `at ${venue}` : '',
      ]
        .filter(Boolean)
        .join(' | ')

      return {
        title: artistText ? `${nameFormatted} ${artistText}` : nameFormatted,
        subtitle,
        media: image || CalendarDays,
      }
    },
  },
})
