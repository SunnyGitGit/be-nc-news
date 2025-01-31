const endpointsJson = require("../endpoints.json");
const request = require("supertest");
const app = require("../app");
const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const testData = require("../db/data/test-data/index");
require('jest-sorted');

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const { topics } = response.body;

        expect(Array.isArray(topics)).toBe(true);
        expect(topics.length).toBeGreaterThan(0);

        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
          expect(topic).toMatchObject({"slug": expect.any(String)});
          expect(topic).toMatchObject({"description": expect.any(String)});
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with the correct article", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then((response) => {
        const { article } = response.body;

        expect(article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: "2020-07-09T20:11:00.000Z",
          votes: 100,
          article_img_url:
            "https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700",
          comment_count: 11
        });
      });
  });
  test("404: Responds with an error when an article is not found", () => {
    return request(app)
      .get("/api/articles/999999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not Found");
      });
  });
  test("400: Responds with an error when an article_id is not a number", () => {
    return request(app)
      .get("/api/articles/dog")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  test("200: Responds with an article including the comment-count", () => {
      return request(app)
        .get("/api/articles/1")
        .expect(200)
        .then((response) => {
          const { article } = response.body;

          expect(article).toHaveProperty("article_id", 1);
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
          expect(article).toHaveProperty("comment_count", expect.any(Number));
        });
    });
});


describe("GET /api/articles", () => {
  test("200: Responds with an array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const { articles } = response.body;

        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBeGreaterThan(0);
        articles.forEach((article) => {
          expect(article).toHaveProperty("article_id");
          expect(article).toHaveProperty("title");
          expect(article).toHaveProperty("topic");
          expect(article).toHaveProperty("author");
          expect(article).toHaveProperty("created_at");
          expect(article).toHaveProperty("votes");
          expect(article).toHaveProperty("article_img_url");
          expect(article).toHaveProperty("comment_count");
        });
      });
  });
  test("200: Responds with articles sorted by title with an ascending order", () => {
    return request(app)
      .get("/api/articles?sort_by=title&order=asc")
      .expect(200)
      .then((response) => {
        const { articles } = response.body;

        expect(articles.length).toBeGreaterThan(0);
        expect(articles).toBeSorted({ 
          key: "title", 
          ascending: true  
      });
    });
  });
  test("200: Responds with articles when only sort_by query is provided", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at")
      .expect(200)
      .then((response) => {
        const { articles } = response.body;
  
        expect(articles.length).toBeGreaterThan(0);
        expect(articles).toBeSorted({ 
          key: "created_at", 
          descending: true
      });
    });
  });
  test("200: Responds with articles when only order query is provided", () => {
    return request(app)
      .get("/api/articles?order=asc")
      .expect(200)
      .then((response) => {
        const { articles } = response.body;
  
        expect(articles.length).toBeGreaterThan(0);
        expect(articles).toBeSorted({ 
          key: "created_at", 
          ascending: true  
        });
      });
  });  
  test("400: Responds with an error when an invalid sort_by is provided", () => {
    return request(app)
      .get("/api/articles?sort_by=invalid_sort_by")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  test("400: Responds with an error when an invalid order query is provided", () => {
    return request(app)
      .get("/api/articles?order=invalid_order")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
  test("200: Responds with articles filtered by topic", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then((response) => {
        const { articles } = response.body;

        expect(articles.length).toBeGreaterThan(0);
        articles.forEach((article) => {
          expect(article.topic).toBe("cats");
        });
    });
  });
  test("200: Responds with an empty array when topic exists but has no associated articles", () => {
    return request(app)
      .get("/api/articles?topic=paper")
      .expect(200)
      .then((response) => {
        const { articles } = response.body;
  
        expect(Array.isArray(articles)).toBe(true);
        expect(articles.length).toBe(0);
      });
  });
  test("404: Responds with an error when topic is not found", () => {
    return request(app)
      .get("/api/articles?topic=dogs")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not Found")
    });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with all comments for an article", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then((response) => {
        const { comments } = response.body;

        expect(Array.isArray(comments)).toBe(true);
        expect(comments.length).toBeGreaterThan(0);
        comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("article_id");
        });
    });
  });
  test("200: Responds with an empty array with no associated comments ", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then((response) => {
        const { comments } = response.body;
        expect(comments).toEqual([]);
      });
  });
  test("404: Responds with an error when article ID is not found", () => {
    return request(app)
      .get("/api/articles/999999/comments")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not Found");
      });
  });
  test("400: Responds with an error when an invalid article ID is provided", () => {
    return request(app)
      .get("/api/articles/notNumber/comments")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  test("201: Responds with the posted comment for an article", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This is a new comment"
    }
    const article_id = 3;

    return request(app)
      .post(`/api/articles/${article_id}/comments`)
      .send(newComment)
      .expect(201)
      .then((response) => {
        const { comment } = response.body;

        expect(comment).toHaveProperty("comment_id");
        expect(comment).toHaveProperty("votes", 0);
        expect(comment).toHaveProperty("created_at");
        expect(comment).toHaveProperty("author", newComment.username);
        expect(comment).toHaveProperty("body", newComment.body);
        expect(comment).toHaveProperty("article_id", 3);
    });
  });
  test("404: Responds with an error when article ID is not found", () => {
    const newComment = {
      username: "butter_bridge",
      body: "This is a new comment"
    }
    const article_id = 9999;

    return request(app)
      .post(`/api/articles/${article_id}/comments`)
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not Found");
      });
  });
  test("404: Responds with an error when an invalid username is provided", () => {
    const newComment = {
      username: "Invalid username",
      body: "This is a new comment"
    }
    const article_id = 3;

    return request(app)
      .post(`/api/articles/${article_id}/comments`)
      .send(newComment)
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not Found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: Responds an updated article with increment votes", () => {
    const incrementVotes = {
      inc_votes: 1
    };
    const article_id = 1;

    return request(app)
      .get(`/api/articles/${article_id}`)
      .expect(200)
      .then((response) => {
        const { article } = response.body;
        const currentVotes = article.votes;

        return request(app)
          .patch(`/api/articles/${article_id}`)
          .send(incrementVotes)
          .expect(200)
          .then((response) => {
            const { article } = response.body;
            expect(article.votes).toBe(currentVotes + incrementVotes.inc_votes);
          });
      });
  });
  test("200: Responds an updated article with decrement votes", () => {
    const decrementVotes = {
      inc_votes: -10
    };
    const article_id = 1;

    return request(app)
      .get(`/api/articles/${article_id}`)
      .expect(200)
      .then((response) => {
        const { article } = response.body;
        const currentVotes = article.votes;

        return request(app)
          .patch(`/api/articles/${article_id}`)
          .send(decrementVotes)
          .expect(200)
          .then((response) => {
            const { article } = response.body;
            expect(article.votes).toBe(currentVotes + decrementVotes.inc_votes);
          });
      });
  });
  test("404: Responds with error when an article ID is not found", () => {
    return request(app)
      .patch('/api/articles/9999')
      .send({ inc_votes: 1 })
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not Found");
      });
  });
  test("400: Responds with an error when an invalid article ID is provided", () => {
    return request(app)
      .patch('/api/articles/notNumber')
      .send({ inc_votes: 1 })
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
    });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: Responds with deleted comments by id", () => {
    const comment_id = 4;

    return request(app)
      .delete(`/api/comments/${comment_id}`)
      .expect(204)
      .then((response) => {
        expect(response.body).toEqual({});
      });
  });
  test("404: Responds with an error when a comment ID is not found", () => {
    return request(app)
      .delete('/api/comments/9999')
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toEqual("Not Found");
      });
  });
  test("400: Responds with an error when an invalid comment ID is provided", () => {
    return request(app)
      .delete('/api/comments/notNumber')
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toEqual("Bad Request");
      });
  });
});

describe("GET /api/users", () => {
  test("200: Responds with an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        const { users } = response.body;

        expect(Array.isArray(users)).toBe(true);
        expect(users.length).toBeGreaterThan(0);

        users.forEach((user) => {
          expect(user).toMatchObject({"username": expect.any(String)});
          expect(user).toMatchObject({"name": expect.any(String)});
          expect(user).toMatchObject({"avatar_url": expect.any(String)});
        });
      });
  });
});


describe("API error handling", () => {
  test("404: Responds with an error when the endpoint is incorrect", () => {
    return request(app)
      .get("/api/no-topics")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not Found");
      });
  });
});