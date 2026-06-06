import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock das funções de banco de dados
vi.mock("./db", () => ({
  getPublishedPosts: vi.fn().mockResolvedValue([
    {
      id: 1,
      slug: "post-teste",
      title: "Post de Teste",
      excerpt: "Resumo do post",
      content: "Conteúdo do post",
      coverImage: null,
      category: "Conservação",
      tags: null,
      published: true,
      authorId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      publishedAt: new Date(),
    },
  ]),
  getPostBySlug: vi.fn().mockImplementation(async (slug: string) => {
    if (slug === "post-teste") {
      return {
        id: 1,
        slug: "post-teste",
        title: "Post de Teste",
        excerpt: "Resumo do post",
        content: "Conteúdo do post",
        coverImage: null,
        category: "Conservação",
        tags: null,
        published: true,
        authorId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        publishedAt: new Date(),
      };
    }
    return undefined;
  }),
  getAllPosts: vi.fn().mockResolvedValue([]),
  createPost: vi.fn().mockResolvedValue(undefined),
  updatePost: vi.fn().mockResolvedValue(undefined),
  deletePost: vi.fn().mockResolvedValue(undefined),
  getGalleryItems: vi.fn().mockResolvedValue([]),
  getFeaturedGallery: vi.fn().mockResolvedValue([]),
  createGalleryItem: vi.fn().mockResolvedValue(undefined),
  createContact: vi.fn().mockResolvedValue(undefined),
  getContacts: vi.fn().mockResolvedValue([]),
  upsertUser: vi.fn().mockResolvedValue(undefined),
  getUserByOpenId: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("./_core/notification", () => ({
  notifyOwner: vi.fn().mockResolvedValue(true),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function createAdminContext(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "admin-user",
      email: "admin@institutoubatuba.org",
      name: "Admin",
      loginMethod: "manus",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

describe("posts.list", () => {
  it("retorna lista de posts publicados", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.posts.list({ limit: 10, offset: 0 });
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result[0].slug).toBe("post-teste");
  });
});

describe("posts.bySlug", () => {
  it("retorna post pelo slug correto", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.posts.bySlug({ slug: "post-teste" });
    expect(result.title).toBe("Post de Teste");
    expect(result.slug).toBe("post-teste");
  });

  it("lança erro NOT_FOUND para slug inexistente", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.posts.bySlug({ slug: "slug-inexistente" })).rejects.toThrow("Post não encontrado.");
  });
});

describe("contact.submit", () => {
  it("envia mensagem de contato com sucesso", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.contact.submit({
      name: "João Silva",
      email: "joao@exemplo.com",
      message: "Gostaria de saber mais sobre o voluntariado no instituto.",
      type: "voluntariado",
    });
    expect(result.success).toBe(true);
  });

  it("rejeita mensagem com e-mail inválido", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.contact.submit({
        name: "João",
        email: "email-invalido",
        message: "Mensagem de teste para verificar validação.",
        type: "geral",
      })
    ).rejects.toThrow();
  });

  it("rejeita mensagem muito curta", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(
      caller.contact.submit({
        name: "João",
        email: "joao@exemplo.com",
        message: "Curta",
        type: "geral",
      })
    ).rejects.toThrow();
  });
});

describe("gallery.featured", () => {
  it("retorna galeria em destaque", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.gallery.featured();
    expect(Array.isArray(result)).toBe(true);
  });
});

describe("auth.me", () => {
  it("retorna null para usuário não autenticado", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.me();
    expect(result).toBeNull();
  });

  it("retorna dados do usuário autenticado", async () => {
    const ctx = createAdminContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.auth.me();
    expect(result?.role).toBe("admin");
    expect(result?.email).toBe("admin@institutoubatuba.org");
  });
});
