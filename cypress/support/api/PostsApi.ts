// API layer: a thin client for the JSONPlaceholder REST API. Tests call these methods instead of building URLs.
export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface PostComment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}

const base = () => String(Cypress.expose('API_URL'));

export const postsApi = {
  list: (qs: Record<string, string | number> = {}) => cy.request({ url: `${base()}/posts`, qs }),
  get: (id: number, failOnStatusCode = true) => cy.request({ url: `${base()}/posts/${id}`, failOnStatusCode }),
  comments: (postId: number) => cy.request(`${base()}/posts/${postId}/comments`),
  create: (body: Partial<Post>) => cy.request('POST', `${base()}/posts`, body),
  update: (id: number, body: Partial<Post>) => cy.request('PUT', `${base()}/posts/${id}`, body),
  remove: (id: number) => cy.request('DELETE', `${base()}/posts/${id}`),
};
