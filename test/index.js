"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var src_1 = __importDefault(require("../src"));
var axios_1 = __importDefault(require("axios"));
jest.mock('axios');
var client = new src_1.default({
    format: 'json',
});
var apiURL = 'https://api.metero.pp.ua/';
var users = [
    {
        id: 1,
        username: 'Username1',
        posts: [],
        likedPosts: [],
        email: 'Username1@example.com',
        name: 'User 1',
    },
    {
        id: 2,
        username: 'Username2',
        posts: [],
        likedPosts: [],
        email: 'Username1@example.com',
        name: 'User 2',
    },
];
var posts = [
    {
        id: 1,
        body: 'Great post about ...',
        author: {
            username: 'Username1',
            email: 'Username1@example.com',
            name: 'User 1',
        },
        likes: 2,
        isLiked: true,
        createdAt: '2022-01-21T18:49:53.420Z',
        createdAtDiff: '3 days ago',
    },
    {
        id: 2,
        body: 'Great post about ... (im better)',
        author: {
            username: 'Username2',
            email: 'Username1@example.com',
            name: 'User 2',
        },
        likes: 2,
        isLiked: true,
        createdAt: '2022-01-21T18:49:53.420Z',
        createdAtDiff: '2 days ago',
    },
];
describe('Api Test', function () {
    it('Get Users ', function () {
        axios_1.default.request.mockResolvedValue({ data: users });
        client.getUsers().then(function (usersGot) {
            expect(usersGot).toEqual(users);
        });
        var call = axios_1.default.request.mock.calls[axios_1.default.request.mock.calls.length - 1][0];
        expect(call.method).toEqual('get');
        expect(call.url).toEqual(apiURL + 'users?page=1');
        expect(call.validateStatus(200)).toBeTruthy();
        expect(call.validateStatus(201)).toBeFalsy();
        expect(Object.keys(call.headers).length).toEqual(1);
        expect(call.headers.hasOwnProperty('accept')).toBeTruthy();
        expect(call.headers.accept).toEqual('application/json');
    });
    it('Set Format and Set Access Token and Parameters', function () {
        axios_1.default.request.mockResolvedValue({ data: users });
        client.setAccessToken('[Access Token]');
        client.setFormat('jsonld');
        client
            .getUsers({
            username: 'use',
        })
            .then(function (usersGot) {
            expect(usersGot).toEqual(users);
        });
        var call = axios_1.default.request.mock.calls[axios_1.default.request.mock.calls.length - 1][0];
        expect(call.method).toEqual('get');
        expect(call.url).toEqual(apiURL + 'users?page=1&username=use');
        expect(call.validateStatus(200)).toBeTruthy();
        expect(call.validateStatus(201)).toBeFalsy();
        expect(Object.keys(call.headers).length).toEqual(2);
        expect(call.headers.hasOwnProperty('accept')).toBeTruthy();
        expect(call.headers.hasOwnProperty('Authorization')).toBeTruthy();
        expect(call.headers.accept).toEqual('application/ld+json');
        expect(call.headers.Authorization).toEqual('Bearer [Access Token]');
    });
    it('Get User', function () {
        client.setFormat('json');
        client.setAccessToken(null);
        axios_1.default.request.mockResolvedValue({ data: users[0] });
        client.getUser('Username1').then(function (user) {
            expect(user).toEqual(users[0]);
        });
        var call = axios_1.default.request.mock.calls[axios_1.default.request.mock.calls.length - 1][0];
        expect(call.method).toEqual('get');
        expect(call.url).toEqual(apiURL + 'users/Username1');
        expect(call.validateStatus(200)).toBeTruthy();
        expect(call.validateStatus(201)).toBeFalsy();
        expect(Object.keys(call.headers).length).toEqual(1);
        expect(call.headers.hasOwnProperty('accept')).toBeTruthy();
        expect(call.headers.accept).toEqual('application/json');
    });
    it('Update User', function () {
        axios_1.default.request.mockResolvedValue({ data: users[0] });
        client.updateUser('Username1', users[0]).then(function (user) {
            expect(user).toEqual(users[0]);
        });
        var call = axios_1.default.request.mock.calls[axios_1.default.request.mock.calls.length - 1][0];
        expect(call.method).toEqual('patch');
        expect(call.url).toEqual(apiURL + 'users/Username1');
        expect(call.validateStatus(200)).toBeTruthy();
        expect(call.validateStatus(201)).toBeFalsy();
        expect(call.body).toEqual(users[0]);
        expect(Object.keys(call.headers).length).toEqual(2);
        expect(call.headers.hasOwnProperty('accept')).toBeTruthy();
        expect(call.headers.accept).toEqual('application/json');
        expect(call.headers.hasOwnProperty('Content-Type')).toBeTruthy();
        expect(call.headers['Content-Type']).toEqual('application/merge-patch+json');
        expect(call.body).toEqual(users[0]);
    });
    it('Get Posts', function () {
        axios_1.default.request.mockResolvedValue({ data: posts });
        client
            .getPosts({
            author: 'Username1',
        })
            .then(function (postsGot) {
            expect(postsGot).toEqual(posts);
        });
        var call = axios_1.default.request.mock.calls[axios_1.default.request.mock.calls.length - 1][0];
        expect(call.method).toEqual('get');
        expect(call.url).toEqual(apiURL + 'posts?page=1&author=Username1');
        expect(call.validateStatus(200)).toBeTruthy();
        expect(call.validateStatus(201)).toBeFalsy();
        expect(Object.keys(call.headers).length).toEqual(1);
        expect(call.headers.hasOwnProperty('accept')).toBeTruthy();
        expect(call.headers.accept).toEqual('application/json');
    });
    it('Create Post', function () {
        axios_1.default.request.mockResolvedValue({ data: posts[0] });
        client.createPost(posts[0]).then(function (post) {
            expect(post).toEqual(posts[0]);
        });
        var call = axios_1.default.request.mock.calls[axios_1.default.request.mock.calls.length - 1][0];
        expect(call.method).toEqual('post');
        expect(call.url).toEqual(apiURL + 'posts');
        expect(call.validateStatus(201)).toBeTruthy();
        expect(call.validateStatus(200)).toBeFalsy();
        expect(Object.keys(call.headers).length).toEqual(2);
        expect(call.headers.hasOwnProperty('accept')).toBeTruthy();
        expect(call.headers.accept).toEqual('application/json');
        expect(call.headers.hasOwnProperty('Content-Type')).toBeTruthy();
        expect(call.headers['Content-Type']).toEqual('application/json');
        expect(call.body).toEqual(posts[0]);
    });
    it('Get Post', function () {
        axios_1.default.request.mockResolvedValue({ data: posts[0] });
        client.getPost(1).then(function (post) {
            expect(post).toEqual(posts[0]);
        });
        var call = axios_1.default.request.mock.calls[axios_1.default.request.mock.calls.length - 1][0];
        expect(call.method).toEqual('get');
        expect(call.url).toEqual(apiURL + 'posts/1');
        expect(call.validateStatus(200)).toBeTruthy();
        expect(call.validateStatus(201)).toBeFalsy();
        expect(Object.keys(call.headers).length).toEqual(1);
        expect(call.headers.hasOwnProperty('accept')).toBeTruthy();
        expect(call.headers.accept).toEqual('application/json');
    });
    it('Replace Post', function () {
        axios_1.default.request.mockResolvedValue({ data: posts[0] });
        client.replacePost(1, posts[0]).then(function (post) {
            expect(post).toEqual(posts[0]);
        });
        var call = axios_1.default.request.mock.calls[axios_1.default.request.mock.calls.length - 1][0];
        expect(call.method).toEqual('put');
        expect(call.url).toEqual(apiURL + 'posts/1');
        expect(call.validateStatus(200)).toBeTruthy();
        expect(call.validateStatus(201)).toBeFalsy();
        expect(Object.keys(call.headers).length).toEqual(2);
        expect(call.headers.hasOwnProperty('accept')).toBeTruthy();
        expect(call.headers.accept).toEqual('application/json');
        expect(call.headers.hasOwnProperty('Content-Type')).toBeTruthy();
        expect(call.headers['Content-Type']).toEqual('application/json');
        expect(call.body).toEqual(posts[0]);
    });
    it('Delete Post', function () {
        axios_1.default.request.mockResolvedValue({ data: undefined });
        client.deletePost(1).then(function (post) {
            expect(post).toEqual(undefined);
        });
        var call = axios_1.default.request.mock.calls[axios_1.default.request.mock.calls.length - 1][0];
        expect(call.method).toEqual('delete');
        expect(call.url).toEqual(apiURL + 'posts/1');
        expect(call.validateStatus(204)).toBeTruthy();
        expect(call.validateStatus(200)).toBeFalsy();
        expect(Object.keys(call.headers).length).toEqual(1);
        expect(call.headers.hasOwnProperty('accept')).toBeTruthy();
        expect(call.headers.accept).toEqual('application/json');
    });
    it('Update Post', function () {
        axios_1.default.request.mockResolvedValue({ data: posts[0] });
        client.updatePost(1, posts[0]).then(function (post) {
            expect(post).toEqual(posts[0]);
        });
        var call = axios_1.default.request.mock.calls[axios_1.default.request.mock.calls.length - 1][0];
        expect(call.method).toEqual('patch');
        expect(call.url).toEqual(apiURL + 'posts/1');
        expect(call.validateStatus(200)).toBeTruthy();
        expect(call.validateStatus(201)).toBeFalsy();
        expect(Object.keys(call.headers).length).toEqual(2);
        expect(call.headers.hasOwnProperty('accept')).toBeTruthy();
        expect(call.headers.accept).toEqual('application/json');
        expect(call.headers.hasOwnProperty('Content-Type')).toBeTruthy();
        expect(call.headers['Content-Type']).toEqual('application/merge-patch+json');
        expect(call.body).toEqual(posts[0]);
    });
});
