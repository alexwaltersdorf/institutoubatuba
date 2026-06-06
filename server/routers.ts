import { TRPCError } from "@trpc/server";
import { z } from "zod";
import {
  createContact,
  createGalleryItem,
  createPost,
  deletePost,
  getAllPosts,
  getContacts,
  getFeaturedGallery,
  getGalleryItems,
  getPostBySlug,
  getPublishedPosts,
  updatePost,
} from "./db";
import { notifyOwner } from "./_core/notification";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") {
    throw new TRPCError({ code: "FORBIDDEN", message: "Acesso restrito a administradores." });
  }
  return next({ ctx });
});

export const appRouter = router({
  system: systemRouter,

  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  /* ── Blog / Posts ── */
  posts: router({
    list: publicProcedure
      .input(z.object({ limit: z.number().min(1).max(50).default(10), offset: z.number().min(0).default(0) }).optional())
      .query(async ({ input }) => {
        return getPublishedPosts(input?.limit ?? 10, input?.offset ?? 0);
      }),

    bySlug: publicProcedure
      .input(z.object({ slug: z.string() }))
      .query(async ({ input }) => {
        const post = await getPostBySlug(input.slug);
        if (!post) throw new TRPCError({ code: "NOT_FOUND", message: "Post não encontrado." });
        return post;
      }),

    // Admin: listar todos (incluindo rascunhos)
    adminList: adminProcedure
      .input(z.object({ limit: z.number().default(50), offset: z.number().default(0) }).optional())
      .query(async ({ input }) => {
        return getAllPosts(input?.limit ?? 50, input?.offset ?? 0);
      }),

    create: adminProcedure
      .input(
        z.object({
          slug: z.string().min(1),
          title: z.string().min(1),
          excerpt: z.string().optional(),
          content: z.string().min(1),
          coverImage: z.string().optional(),
          category: z.string().optional(),
          tags: z.string().optional(),
          published: z.boolean().default(false),
        })
      )
      .mutation(async ({ input, ctx }) => {
        await createPost({
          ...input,
          authorId: ctx.user.id,
          publishedAt: input.published ? new Date() : undefined,
        });
        return { success: true };
      }),

    update: adminProcedure
      .input(
        z.object({
          id: z.number(),
          slug: z.string().optional(),
          title: z.string().optional(),
          excerpt: z.string().optional(),
          content: z.string().optional(),
          coverImage: z.string().optional(),
          category: z.string().optional(),
          tags: z.string().optional(),
          published: z.boolean().optional(),
        })
      )
      .mutation(async ({ input }) => {
        const { id, ...data } = input;
        if (data.published) (data as Record<string, unknown>).publishedAt = new Date();
        await updatePost(id, data);
        return { success: true };
      }),

    delete: adminProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input }) => {
        await deletePost(input.id);
        return { success: true };
      }),
  }),

  /* ── Galeria ── */
  gallery: router({
    list: publicProcedure
      .input(z.object({ category: z.string().optional() }).optional())
      .query(async ({ input }) => {
        return getGalleryItems(input?.category);
      }),

    featured: publicProcedure.query(async () => {
      return getFeaturedGallery();
    }),

    create: adminProcedure
      .input(
        z.object({
          title: z.string().optional(),
          description: z.string().optional(),
          imageUrl: z.string().min(1),
          imageKey: z.string().optional(),
          category: z.string().optional(),
          featured: z.boolean().default(false),
          sortOrder: z.number().default(0),
        })
      )
      .mutation(async ({ input }) => {
        await createGalleryItem(input);
        return { success: true };
      }),
  }),

  /* ── Contato ── */
  contact: router({
    submit: publicProcedure
      .input(
        z.object({
          name: z.string().min(2, "Nome obrigatório"),
          email: z.string().email("E-mail inválido"),
          phone: z.string().optional(),
          subject: z.string().optional(),
          message: z.string().min(10, "Mensagem muito curta"),
          type: z.enum(["geral", "voluntariado", "doacao", "parceria", "imprensa"]).default("geral"),
        })
      )
      .mutation(async ({ input }) => {
        await createContact(input);
        // Notifica o dono do projeto
        await notifyOwner({
          title: `Nova mensagem de contato: ${input.name}`,
          content: `**De:** ${input.name} (${input.email})\n**Tipo:** ${input.type}\n**Assunto:** ${input.subject ?? "—"}\n\n${input.message}`,
        });
        return { success: true };
      }),

    list: adminProcedure.query(async () => {
      return getContacts();
    }),
  }),
});

export type AppRouter = typeof appRouter;
