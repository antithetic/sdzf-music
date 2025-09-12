import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {tags} from 'sanity-plugin-tags-v4'

import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'SD Zine Fest',

  projectId: '1zmxr8qy',
  dataset: 'production',

  plugins: [structureTool(), visionTool(), tags()],

  schema: {
    types: schemaTypes,
  },
})
