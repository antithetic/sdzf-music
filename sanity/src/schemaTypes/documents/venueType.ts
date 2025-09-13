import {Link, MapPin} from 'lucide-react'
import {defineField, defineType} from 'sanity'

export const venueType = defineType({
  name: 'venue',
  title: 'Venue',
  type: 'document',
  icon: MapPin,
  fields: [
    defineField({
      name: 'name',
      type: 'string',
      validation: (Rule) => Rule.required().error('A venue name is required'),
    }),

    defineField({
      name: 'description',
      type: 'text',
      description:
        'A brief description of the venue, its atmosphere, and any notable features',
      validation: (Rule) =>
        Rule.max(500).warning(
          'Description should be concise, under 500 characters',
        ),
    }),
    defineField({
      name: 'address',
      type: 'string',
      description: 'The street address of the venue',
      validation: (Rule) => Rule.required().error('An address is required'),
    }),
    defineField({
      name: 'city',
      type: 'string',
      description: 'The city where the venue is located',
      validation: (Rule) => Rule.required().error('A city is required'),
    }),
    defineField({
      name: 'zipcode',
      type: 'string',
      description: 'The zipcode of the venue',
      validation: (Rule) => Rule.required().error('A zipcode is required'),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'Slug',
      description: 'The unique identifier for the venue',
      options: {
        source: (doc) => `${doc.name}-${doc.city}`,
        maxLength: 96,
      },
      validation: (Rule) =>
        Rule.required()
          .error('A slug is required')
          .custom((slug) => {
            if (!slug?.current) return true
            const pattern = /^[a-z0-9]+(?:-[a-z0-9]+)*$/
            return (
              pattern.test(slug.current) ||
              'Slug can only contain lowercase letters, numbers, and hyphens'
            )
          }),
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      description: "Add links to the venue's social media profiles and website",
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'platform',
              title: 'Platform',
              type: 'string',
              options: {
                list: [
                  {title: 'Website', value: 'website'},
                  {title: 'Instagram', value: 'instagram'},
                  {title: 'Twitter', value: 'twitter'},
                  {title: 'TikTok', value: 'tiktok'},
                  {title: 'Facebook', value: 'facebook'},
                  {title: 'YouTube', value: 'youtube'},
                  // { title: 'LinkedIn', value: 'linkedin' },
                  {title: 'Other', value: 'other'},
                ],
                layout: 'dropdown',
              },
              validation: (Rule) =>
                Rule.required().error('Please select a platform'),
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url',
              description: 'Full URL to the social media profile or website',
              validation: (Rule) =>
                Rule.required()
                  .error('A valid URL is required')
                  .custom((value, context) => {
                    if (!value || typeof value !== 'string') return true
                    const parent = context.parent as {
                      platform: string
                    } | null
                    if (!parent) return true

                    const platform = parent.platform
                    const urlPatterns = {
                      website: /^https?:\/\/.+/,
                      instagram: /^https?:\/\/(www\.)?instagram\.com\/.+/,
                      twitter: /^https?:\/\/(www\.)?twitter\.com\/.+/,
                      tiktok: /^https?:\/\/(www\.)?tiktok\.com\/.+/,
                      facebook: /^https?:\/\/(www\.)?facebook\.com\/.+/,
                      youtube: /^https?:\/\/(www\.)?youtube\.com\/.+/,
                      other: /^https?:\/\/.+/,
                    }

                    if (
                      platform &&
                      platform !== 'other' &&
                      !urlPatterns[platform as keyof typeof urlPatterns].test(
                        value,
                      )
                    ) {
                      return `Please enter a valid ${platform} URL`
                    }

                    return true
                  }),
            },
            {
              name: 'name',
              title: 'Website Name',
              type: 'string',
              description:
                'Name of the website (required for Website and Other platforms)',
              hidden: ({parent}) =>
                !['website', 'other'].includes(parent?.platform),
              validation: (Rule) =>
                Rule.custom((value, context) => {
                  const parent = context.parent as {platform: string} | null
                  if (
                    parent?.platform &&
                    ['website', 'other'].includes(parent.platform) &&
                    !value
                  ) {
                    return 'Please enter a name for this website'
                  }
                  return true
                }),
            },
            {
              name: 'customPlatform',
              title: 'Custom Platform Name',
              type: 'string',
              description:
                'Enter the name of the platform if you selected "Other"',
              hidden: ({parent}) => parent?.platform !== 'other',
              validation: (Rule) =>
                Rule.custom((value, context) => {
                  const parent = context.parent as {platform?: string}
                  if (parent?.platform === 'other' && !value) {
                    return 'Please enter the platform name'
                  }
                  return true
                }),
            },
          ],
          preview: {
            select: {
              platform: 'platform',
              name: 'name',
              url: 'url',
            },
            prepare({platform, name, url}) {
              const title = ['website', 'other'].includes(platform)
                ? name
                : platform
              return {
                title: title
                  ? title.charAt(0).toUpperCase() + title.slice(1)
                  : 'Untitled',
                subtitle: url,
                media: Link,
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'media',
      title: 'Venue Images',
      type: 'array',
      description: 'Upload up to 5 images of the venue',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
              description: 'Important for SEO and accessibility',
              validation: (Rule) =>
                Rule.required().error(
                  'Please add an alternative text for the image',
                ),
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
              description: 'Optional caption for the image',
            },
          ],
        },
      ],
      validation: (Rule) =>
        Rule.max(5).error('You can upload a maximum of 5 images'),
    }),
    defineField({
      name: 'contacts',
      title: 'Venue Contacts',
      type: 'array',
      description:
        'Add contact information for venue staff and representatives',
      of: [
        {
          type: 'reference',
          to: [{type: 'contact'}],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'city',
      media: 'media.0',
    },
  },
})
