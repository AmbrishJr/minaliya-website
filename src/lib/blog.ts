import prisma from "@/lib/prisma";
import type { ContentBlock } from "@/actions/adminData";

export async function getAllBlogs() {
  const blogs = await prisma.blog.findMany({
    orderBy: { publishedAt: "desc" },
  });

  return blogs.map((b) => ({
    id: b.id,
    title: b.title,
    slug: b.slug,
    content: b.content as ContentBlock[],
    images: b.images,
    imagePublicIds: b.imagePublicIds as string[],
    imageAlt: b.imageAlt,
    imageTitle: b.imageTitle,
    imageCaption: b.imageCaption,
    imageDescription: b.imageDescription,
    author: b.author,
    publishedAt: b.publishedAt.toISOString(),
    updatedAt: b.updatedAt.toISOString(),
    createdAt: b.createdAt.toISOString(),
  }));
}

export async function getBlogBySlug(slug: string) {
  const blog = await prisma.blog.findUnique({ where: { slug } });
  if (!blog) return null;

  return {
    id: blog.id,
    title: blog.title,
    slug: blog.slug,
    content: blog.content as ContentBlock[],
    images: blog.images,
    imagePublicIds: blog.imagePublicIds as string[],
    imageAlt: blog.imageAlt,
    imageTitle: blog.imageTitle,
    imageCaption: blog.imageCaption,
    imageDescription: blog.imageDescription,
    author: blog.author,
    publishedAt: blog.publishedAt.toISOString(),
    updatedAt: blog.updatedAt.toISOString(),
    createdAt: blog.createdAt.toISOString(),
  };
}
