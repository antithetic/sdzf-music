/* eslint-disable import/no-default-export */
import {richDate} from '@sanity/rich-date-input'
import {visionTool} from '@sanity/vision'
import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {iconify} from 'sanity-plugin-iconify'
import {imageAssetPickerPlugin} from 'sanity-plugin-image-asset-picker'
import {media} from 'sanity-plugin-media'
import {ptString} from 'sanity-plugin-pt-string'
import {singletonTools} from 'sanity-plugin-singleton-tools'
import {tags} from 'sanity-plugin-tags-v4'
import {uniquePlugin} from 'sanity-plugin-unique'

import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'sd-zine-fest',
  title: 'SD Zine Fest',
  projectId: '1zmxr8qy',
  dataset: 'production',

  plugins: [
    //studio
    structureTool(),
    visionTool(),
    //plugins
    iconify(),
    imageAssetPickerPlugin(),
    media(),
    ptString(),
    richDate(),
    singletonTools(),
    tags(),
    uniquePlugin(),
  ],

  schema: {
    types: schemaTypes,
  },
})
