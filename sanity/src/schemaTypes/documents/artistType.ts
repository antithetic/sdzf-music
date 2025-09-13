import {CircleSmall, Link, Palette, Users} from 'lucide-react'
import {defineField, defineType} from 'sanity'

type PronounType = 'he/him' | 'she/her' | 'they/them' | 'other'

interface PronounObject {
  type: PronounType
  customPronouns?: string
}

export const artistType = defineType({
  name: 'artist',
  title: 'Artist',
  type: 'document',
  icon: Users,
  groups: [
    {name: 'editorial', title: 'Editorial', default: true},
    {name: 'details', title: 'Details'},
    {name: 'contact', title: 'Contact Info'},
  ],
  fields: [
    defineField({
      name: 'name',
      title: 'Artist Name',
      type: 'string',
      group: 'editorial',
      validation: (Rule) => Rule.required().error('Name is required'),
    }),
    defineField({
      name: 'artistPhoto',
      title: 'Artist Portrait',
      description: 'Upload a portrait photo of the artist',
      type: 'image',
      group: 'editorial',
    }),
    defineField({
      name: 'bio',
      title: 'Artist Bio',
      description: 'Add a bio for the artist',
      type: 'text',
      group: 'editorial',
    }),
    defineField({
      name: 'pronouns',
      type: 'array',
      description: 'Select the pronouns that apply to the artist',
      group: 'details',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'type',
              title: 'Pronoun Type',
              type: 'string',
              options: {
                list: [
                  {title: 'She/Her', value: 'she/her'},
                  {title: 'He/Him', value: 'he/him'},
                  {title: 'They/Them', value: 'they/them'},
                  {title: 'Other', value: 'other'},
                ],
                layout: 'dropdown',
              },
              validation: (Rule) =>
                Rule.required().error('Please select a pronoun type'),
            },
            {
              name: 'customPronouns',
              title: 'Custom Pronouns',
              type: 'string',
              description: 'Enter custom pronouns if you selected "Other"',
              hidden: ({parent}) => parent?.type !== 'other',
              validation: (Rule) =>
                Rule.custom((value, context) => {
                  const parent = context.parent as PronounObject
                  if (parent?.type === 'other' && !value) {
                    return 'Please enter the custom pronouns'
                  }
                  return true
                }),
            },
          ],
          preview: {
            select: {
              type: 'type',
              customPronouns: 'customPronouns',
            },
            prepare({type, customPronouns}) {
              const title = type === 'other' ? customPronouns : type
              return {
                title: title
                  ? title.charAt(0).toUpperCase() + title.slice(1)
                  : 'Untitled',
                media: CircleSmall,
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'additionalPhotos',
      title: 'Artist Photos',
      description: 'Upload 1-5 photos of the artist and/or works',
      type: 'array',
      group: 'editorial',
      of: [{type: 'image'}],
      validation: (Rule) =>
        Rule.min(1).max(5).error('You must upload between 1 and 5 photos'),
    }),
    defineField({
      name: 'artFocus',
      title: 'Art Focus',
      description: "Select the focus areas of this artist's practice",
      type: 'array',
      group: 'details',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'type',
              title: 'Focus Type',
              type: 'string',
              options: {
                list: [
                  {title: 'Painting', value: 'painting'},
                  {title: 'Sculpture', value: 'sculpture'},
                  {title: 'Photography', value: 'photography'},
                  {title: 'Digital Art', value: 'digital'},
                  {title: 'Mixed Media', value: 'mixed'},
                  {title: 'Installation', value: 'installation'},
                  {title: 'Performance', value: 'performance'},
                  {title: 'Video Art', value: 'video'},
                  {title: 'Sound Art', value: 'sound'},
                  {title: 'Other', value: 'other'},
                ],
                layout: 'dropdown',
              },
              validation: (Rule) =>
                Rule.required().error('Please select a focus type'),
            },
            {
              name: 'customFocus',
              title: 'Custom Focus',
              type: 'string',
              description: 'Specify the focus area if you selected "Other"',
              hidden: ({parent}) => parent?.type !== 'other',
              validation: (Rule) =>
                Rule.custom((value, context) => {
                  const parent = context.parent as {type?: string}
                  if (parent?.type === 'other' && !value) {
                    return 'Please specify the focus area'
                  }
                  return true
                }),
            },
          ],
          preview: {
            select: {
              type: 'type',
              customFocus: 'customFocus',
            },
            prepare({type, customFocus}) {
              const title = type === 'other' ? customFocus : type
              return {
                title: title
                  ? title.charAt(0).toUpperCase() + title.slice(1)
                  : 'Untitled',
                media: Palette,
              }
            },
          },
        },
      ],
      validation: (Rule) =>
        Rule.min(1).error('Please select at least one focus area'),
    }),
    defineField({
      name: 'artistTags',
      title: 'Artist Tags',
      description: 'Tags for the artist',
      type: 'tags',
      group: 'contact',
      options: {
        allowCreate: true,
      },
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Links',
      type: 'array',
      description:
        "Add links to the artist's social media profiles and website",
      group: 'details',
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
                  {title: 'Facebook', value: 'facebook'},
                  {title: 'Twitter', value: 'twitter'},
                  {title: 'TikTok', value: 'tiktok'},
                  {title: 'YouTube', value: 'youtube'},
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
                  .uri({scheme: ['http', 'https']})
                  .custom((value, context) => {
                    if (!value) return true
                    const parent = (context.parent ?? {}) as {platform?: string}
                    const platform = parent.platform
                    try {
                      const {hostname} = new URL(value as string)
                      const host = hostname.replace(/^www\./, '')
                      const okByPlatform: Record<
                        string,
                        (h: string) => boolean
                      > = {
                        website: () => true,
                        instagram: (h) => h === 'instagram.com',
                        twitter: (h) => h === 'twitter.com' || h === 'x.com',
                        tiktok: (h) => h === 'tiktok.com',
                        facebook: (h) => h === 'facebook.com',
                        youtube: (h) => h === 'youtube.com' || h === 'youtu.be',
                        other: () => true,
                      }
                      if (
                        platform &&
                        platform !== 'other' &&
                        !okByPlatform[platform]?.(host)
                      ) {
                        return `Please enter a valid ${platform} URL`
                      }
                      return true
                    } catch {
                      return 'Enter a valid absolute URL (including https://)'
                    }
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
      name: 'contact',
      title: 'Artist Contact',
      type: 'array',
      description: 'Artist Contact Information',
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
      pronouns: 'pronouns',
      media: 'artistPhoto',
    },
    prepare({title, pronouns, media}) {
      const pronounList =
        pronouns
          ?.map((p: PronounObject) =>
            p.type === 'other' ? p.customPronouns : p.type,
          )
          .join(', ') || ''
      return {
        title,
        subtitle: pronounList ? pronounList : 'No pronouns specified',
        media: media || Users,
      }
    },
  },
})
