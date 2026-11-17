// API tests against the public JSONPlaceholder REST API. Same test cases as the Playwright repository:
// docs/test-cases/api-posts.md there. cy.request needs no browser page.
import { postsApi, type Post, type PostComment } from '../../support/api/PostsApi';

describe('Posts API - read', () => {
  it('TC_POSTS_01 - GET /posts returns status 200 and 100 posts', { tags: '@smoke' }, () => {
    postsApi.list().then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body).to.have.length(100);
    });
  });

  it('TC_POSTS_02 - GET /posts/1 returns post 1 with userId, id, title and body', { tags: '@smoke' }, () => {
    postsApi.get(1).then((response) => {
      const post: Post = response.body;
      expect(response.status).to.equal(200);
      expect(post).to.include({ userId: 1, id: 1 });
      expect(post.title).not.to.equal('');
      expect(post.body).not.to.equal('');
    });
  });

  it('TC_POSTS_03 - GET /posts?userId=1 returns 10 posts and every post belongs to user 1', () => {
    postsApi.list({ userId: 1 }).then((response) => {
      const posts: Post[] = response.body;
      expect(posts).to.have.length(10);
      expect(posts.every((post) => post.userId === 1)).to.equal(true);
    });
  });

  it('TC_POSTS_04 - GET /posts/1/comments returns 5 comments and every email looks valid', () => {
    postsApi.comments(1).then((response) => {
      const comments: PostComment[] = response.body;
      expect(comments).to.have.length(5);
      comments.forEach((comment) => expect(comment.email).to.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/));
    });
  });

  it('TC_POSTS_05 - GET /posts/9999 returns status 404 for a post that does not exist', { tags: '@smoke' }, () => {
    postsApi.get(9999, false).its('status').should('equal', 404);
  });
});

describe('Posts API - write', () => {
  it(
    'TC_POSTS_06 - POST /posts with title "foo", body "bar" and userId 1 returns status 201 and the new id 101',
    { tags: '@smoke' },
    () => {
      postsApi.create({ title: 'foo', body: 'bar', userId: 1 }).then((response) => {
        expect(response.status).to.equal(201);
        expect(response.body).to.include({ title: 'foo', body: 'bar', userId: 1, id: 101 });
      });
    },
  );

  it('TC_POSTS_07 - PUT /posts/1 with the title "updated title" returns status 200 and the new title', () => {
    postsApi.update(1, { id: 1, title: 'updated title', body: 'bar', userId: 1 }).then((response) => {
      expect(response.status).to.equal(200);
      expect(response.body.title).to.equal('updated title');
    });
  });

  it('TC_POSTS_08 - DELETE /posts/1 returns status 200', () => {
    postsApi.remove(1).its('status').should('equal', 200);
  });
});
