import {CircleSmall, Contact, Mail, PhoneOutgoing} from 'lucide-react'
import {defineField, defineType} from 'sanity'

type PronounType = 'he/him' | 'she/her' | 'they/them' | 'other'

interface PronounObject {
  type: PronounType
  customPronouns?: string
}

export const contactType = defineType({
  name: 'contact',
  title: 'Contact',
  type: 'document',
  icon: Contact,
  fields: [
    defineField({
      name: 'name',
      title: 'Contact Name',
      description: 'Full name of the contact person',
      type: 'string',
      validation: (Rule) => Rule.required().error('Contact name is required'),
    }),
    defineField({
      name: 'position',
      title: 'Position/Role',
      type: 'string',
      description: 'e.g. Manager, Booking Agent, Owner',
      validation: (Rule) => Rule.required().error('Position is required'),
    }),
    defineField({
      name: 'description',
      title: 'Description/Notes',
      type: 'text',
      description: 'A brief description or notes about this contact',
      rows: 3,
      validation: (Rule) =>
        Rule.max(200).warning('Keep it under 200 characters'),
    }),
    defineField({
      name: 'pronouns',
      type: 'array',
      description: 'Select the pronouns that apply to this contact',
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
      name: 'phoneNumber',
      title: 'Phone Numbers',
      type: 'array',
      description: 'Add one or more phone numbers for this contact',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'type',
              title: 'Type',
              type: 'string',
              options: {
                list: [
                  {title: 'Work', value: 'work'},
                  {title: 'Mobile', value: 'mobile'},
                  {title: 'Home', value: 'home'},
                  {title: 'Other', value: 'other'},
                ],
                layout: 'dropdown',
              },
              validation: (Rule) =>
                Rule.required().error('Please select a phone type'),
            },
            {
              name: 'number',
              title: 'Phone Number',
              type: 'string',
              validation: (Rule) =>
                Rule.required().error('Phone number is required'),
            },
            {
              name: 'customType',
              title: 'Custom Type',
              type: 'string',
              description: 'Specify the type if you selected "Other"',
              hidden: ({parent}) => parent?.type !== 'other',
              validation: (Rule) =>
                Rule.custom((value, context) => {
                  const parent = context.parent as {type?: string}
                  if (parent?.type === 'other' && !value) {
                    return 'Please specify the phone type'
                  }
                  return true
                }),
            },
          ],
          preview: {
            select: {
              type: 'type',
              number: 'number',
              customType: 'customType',
            },
            prepare({type, number, customType}) {
              const title = type === 'other' ? customType : type
              return {
                title: title
                  ? title.charAt(0).toUpperCase() + title.slice(1)
                  : 'Untitled',
                subtitle: number,
                media: PhoneOutgoing,
              }
            },
          },
        },
      ],
      // validation: (Rule) =>
      //   Rule.required().min(1).error('At least one phone number is required'),
    }),
    defineField({
      name: 'email',
      title: 'Email Addresses',
      type: 'array',
      description: 'Add one or more email addresses for this contact',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'type',
              title: 'Type',
              type: 'string',
              options: {
                list: [
                  {title: 'Work', value: 'work'},
                  {title: 'Personal', value: 'personal'},
                  {title: 'Other', value: 'other'},
                ],
                layout: 'dropdown',
              },
              validation: (Rule) =>
                Rule.required().error('Please select an email type'),
            },
            {
              name: 'address',
              title: 'Email Address',
              type: 'email',
              validation: (Rule) =>
                Rule.required()
                  .error('Email address is required')
                  .custom((email) => {
                    if (!email) return true
                    const emailRegex =
                      /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
                    return (
                      emailRegex.test(email as string) ||
                      'Must be a valid email address'
                    )
                  }),
            },
            {
              name: 'customType',
              title: 'Custom Type',
              type: 'string',
              description: 'Specify the type if you selected "Other"',
              hidden: ({parent}) => parent?.type !== 'other',
              validation: (Rule) =>
                Rule.custom((value, context) => {
                  const parent = context.parent as {type?: string}
                  if (parent?.type === 'other' && !value) {
                    return 'Please specify the email type'
                  }
                  return true
                }),
            },
          ],
          preview: {
            select: {
              type: 'type',
              address: 'address',
              customType: 'customType',
            },
            prepare({type, address, customType}) {
              const title = type === 'other' ? customType : type
              return {
                title: title
                  ? title.charAt(0).toUpperCase() + title.slice(1)
                  : 'Untitled',
                subtitle: address,
                media: Mail,
              }
            },
          },
        },
      ],
      // validation: (Rule) => Rule.required().min(1).error('A // validation: (Rule) =>
      //   Rule.required().min(1).errot least one email address is required'),
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'position',
    },
  },
})
