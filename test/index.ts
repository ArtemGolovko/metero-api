import ApiClient from '../src';
import axios from 'axios';

jest.mock('axios');

const client = new ApiClient({
    format: 'json',
});
const apiURL = 'https://api.metero.pp.ua/';
const users = [
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

const posts = [
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

describe('Api Test', () => {
    it('Get Users ', () => {
        axios.request.mockResolvedValue({ data: users });

        client.getUsers<typeof users>().then((usersGot) => {
            expect(usersGot).toEqual(users);
        });

        const call = axios.request.mock.calls[axios.request.mock.calls.length - 1][0];
        expect(call.method).toEqual('get');
        expect(call.url).toEqual(apiURL + 'users?page=1');
        expect(call.validateStatus(200)).toBeTruthy();
        expect(call.validateStatus(201)).toBeFalsy();
        expect(Object.keys(call.headers).length).toEqual(1);
        expect(call.headers.hasOwnProperty('accept')).toBeTruthy();
        expect(call.headers.accept).toEqual('application/json');
    });

    it('Set Format and Set Access Token and Parameters', () => {
        axios.request.mockResolvedValue({ data: users });

        client.setAccessToken('[Access Token]');
        client.setFormat('jsonld');

        client
            .getUsers<typeof users>({
                username: 'use',
            })
            .then((usersGot) => {
                expect(usersGot).toEqual(users);
            });

        const call = axios.request.mock.calls[axios.request.mock.calls.length - 1][0];
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

    it('Get User', () => {
        client.setFormat('json');
        client.setAccessToken(null);

        axios.request.mockResolvedValue({ data: users[0] });

        client.getUser<typeof users[0]>('Username1').then((user) => {
            expect(user).toEqual(users[0]);
        });

        const call = axios.request.mock.calls[axios.request.mock.calls.length - 1][0];
        expect(call.method).toEqual('get');
        expect(call.url).toEqual(apiURL + 'users/Username1');
        expect(call.validateStatus(200)).toBeTruthy();
        expect(call.validateStatus(201)).toBeFalsy();
        expect(Object.keys(call.headers).length).toEqual(1);
        expect(call.headers.hasOwnProperty('accept')).toBeTruthy();
        expect(call.headers.accept).toEqual('application/json');
    });

    it('Update User', () => {
        axios.request.mockResolvedValue({ data: users[0] });

        client.updateUser<typeof users[0]>('Username1', users[0]).then((user) => {
            expect(user).toEqual(users[0]);
        });

        const call = axios.request.mock.calls[axios.request.mock.calls.length - 1][0];
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

    it('Get Posts', () => {
        axios.request.mockResolvedValue({ data: posts });

        client
            .getPosts<typeof posts>({
                author: 'Username1',
            })
            .then((postsGot) => {
                expect(postsGot).toEqual(posts);
            });

        const call = axios.request.mock.calls[axios.request.mock.calls.length - 1][0];
        expect(call.method).toEqual('get');
        expect(call.url).toEqual(apiURL + 'posts?page=1&author=Username1');
        expect(call.validateStatus(200)).toBeTruthy();
        expect(call.validateStatus(201)).toBeFalsy();
        expect(Object.keys(call.headers).length).toEqual(1);
        expect(call.headers.hasOwnProperty('accept')).toBeTruthy();
        expect(call.headers.accept).toEqual('application/json');
    });

    it('Create Post', () => {
        axios.request.mockResolvedValue({ data: posts[0] });

        client.createPost<typeof posts[0]>(posts[0]).then((post) => {
            expect(post).toEqual(posts[0]);
        });

        const call = axios.request.mock.calls[axios.request.mock.calls.length - 1][0];
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

    it('Get Post', () => {
        axios.request.mockResolvedValue({ data: posts[0] });

        client.getPost<typeof posts[0]>(1).then((post) => {
            expect(post).toEqual(posts[0]);
        });

        const call = axios.request.mock.calls[axios.request.mock.calls.length - 1][0];

        expect(call.method).toEqual('get');
        expect(call.url).toEqual(apiURL + 'posts/1');
        expect(call.validateStatus(200)).toBeTruthy();
        expect(call.validateStatus(201)).toBeFalsy();
        expect(Object.keys(call.headers).length).toEqual(1);
        expect(call.headers.hasOwnProperty('accept')).toBeTruthy();
        expect(call.headers.accept).toEqual('application/json');
    });

    it('Replace Post', () => {
        axios.request.mockResolvedValue({ data: posts[0] });

        client.replacePost<typeof posts[0]>(1, posts[0]).then((post) => {
            expect(post).toEqual(posts[0]);
        });

        const call = axios.request.mock.calls[axios.request.mock.calls.length - 1][0];

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

    it('Delete Post', () => {
        axios.request.mockResolvedValue({ data: undefined });

        client.deletePost(1).then((post) => {
            expect(post).toEqual(undefined);
        });

        const call = axios.request.mock.calls[axios.request.mock.calls.length - 1][0];

        expect(call.method).toEqual('delete');
        expect(call.url).toEqual(apiURL + 'posts/1');
        expect(call.validateStatus(204)).toBeTruthy();
        expect(call.validateStatus(200)).toBeFalsy();
        expect(Object.keys(call.headers).length).toEqual(1);
        expect(call.headers.hasOwnProperty('accept')).toBeTruthy();
        expect(call.headers.accept).toEqual('application/json');
    });

    it('Update Post', () => {
        axios.request.mockResolvedValue({ data: posts[0] });

        client.updatePost<typeof posts[0]>(1, posts[0]).then((post) => {
            expect(post).toEqual(posts[0]);
        });

        const call = axios.request.mock.calls[axios.request.mock.calls.length - 1][0];

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
