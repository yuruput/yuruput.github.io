// 1. Import utilities from `astro:content`
import { defineCollection, z } from 'astro:content';

// 2. Import loader(s)
import { glob, file } from 'astro/loaders';

// 3. Define your collection(s)
const members = defineCollection({
  loader: file("src/data/members.json", { parser: (text) => JSON.parse(text).members }),
  schema: z.object({
    id: z.string(),
    name: z.string(),
    url: z.string(),
    icon: z.string(),
  })
});

const events = defineCollection({
  loader: file("src/data/events.json", { parser: (text) => JSON.parse(text).events }),
  schema: z.object({
    id: z.number(),
    name: z.string(),
    date: z.string(),
    url: z.string(),
    location: z.string(),
    locationUrl: z.string(),
  })
});

// 4. Export a single `collections` object to register your collection(s)
export const collections = { members, events };

