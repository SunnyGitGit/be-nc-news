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
  test("200: Responses with an array of topic objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        const { topics } = response.body;

        expect(Array.isArray(topics)).toBe(true);

        topics.forEach((topic) => {
          expect(topic).toHaveProperty("slug");
          expect(topic).toHaveProperty("description");
        });
      });
  });
  test("404: Responses with an error if the endpoint is incorrect", () => {
    return request(app)
      .get("/api/no-topics")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Not Found");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Responses with the correct article", () => {
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
        });
      });
  });
  test("404: Responses with an error if article is not found", () => {
    return request(app)
      .get("/api/articles/999999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not Found");
      });
  });
  test("400: Responses with an error if article_id is not a number", () => {
    return request(app)
      .get("/api/articles/dog")
      .expect(400)
      .then((response) => {
        expect(response.body.msg).toBe("Bad Request");
      });
  });
});


describe("GET /api/articles", () => {
  test("200: Responses with an array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then((response) => {
        const { articles } = response.body;

        expect(Array.isArray(articles)).toBe(true);
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
  test("200: Should be able to order by created_at in descending order", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at&order=desc")
      .expect(200)
      .then((response) => {
        const { articles } = response.body;

        expect(articles).toBeSorted({ 
          key: "created_at", 
          descending: true
      });
    });
  });
  test("400: Responses with an error if an invalid sort_by parameter is provided", () => {
    return request(app)
      .get("/api/articles?sort_by=created&order=desc")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
  test("400: Responses with an error if an invalid order parameter is provided", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at&order=invalid")
      .expect(400)
      .then(({ body: { msg } }) => {
        expect(msg).toBe("Bad Request");
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responses with all comments for an article", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then((response) => {
        const { comments } = response.body;

        expect(Array.isArray(comments)).toBe(true);
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
  test("200: Should be able to order by created_at in descending order", () => {
    return request(app)
      .get("/api/articles/3/comments")
      .expect(200)
      .then((response) => {
        const { comments } = response.body;

        expect(comments).toBeSorted({ 
          key: "created_at", 
          descending: true
      });
    });
  });
  test("404: Responses with an error if article ID is not found", () => {
    return request(app)
      .get("/api/articles/999999")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("Not Found");
      });
  });
});