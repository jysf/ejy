import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    date: z.string(),
    tags: z.array(z.string()),
    featured: z.boolean().default(false),
    order: z.number(),
    description: z.string(),
    images: z.array(z.string()),
    nextProject: z.string().optional(),
  }),
});

const about = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/about' }),
  schema: z.object({
    heading: z.string(),
    resumeUrl: z.string(),
    image: z.string().optional(),
  }),
});

const site = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/site' }),
  schema: z.object({
    tagline: z.string(),
    email: z.string(),
    resumeUrl: z.string(),
    instagram: z.string(),
    linkedin: z.string(),
  }),
});

export const collections = { projects, about, site };
