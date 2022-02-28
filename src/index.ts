import axios, { AxiosRequestHeaders, AxiosResponse, Method } from 'axios';
import buildPHPQuery from 'build-php-query';

const apiURL = 'https://api.metero.pp.ua/';
const formats = {
    json: 'application/json',
    jsonld: 'application/ld+json',
};
const patchMime = 'application/merge-patch+json';

type Format = keyof typeof formats;

type AccessToken = string | null;

interface ApiClientOptions {
    readonly format?: Format;
    readonly accessToken?: AccessToken;
}

type ApiClientOptionsRequired = Required<ApiClientOptions>;

interface RequestOptions {
    method: Method;
    url: string;
    statusCode: number;
    body?: object;
}

interface AxiosConfig {
    method: Method;
    url: string;
    validateStatus: (status: number) => boolean;
    headers: AxiosRequestHeaders;
    data?: object;
}

class ApiClient {
    private format!: Format;
    private accessToken!: AccessToken;

    public constructor(options: ApiClientOptions = {}) {
        const mergedOptions: ApiClientOptionsRequired = { format: 'json', accessToken: null, ...options };
        this.setFormat(mergedOptions.format);
        this.setAccessToken(mergedOptions.accessToken);
    }

    public getUsers<T extends object>(queryParameters = {}): Promise<T> {
        const mergedQueryParameters = { page: 1, ...queryParameters };
        return this.createAxiosRequest<T>({
            method: 'get',
            url: 'users?' + buildPHPQuery(mergedQueryParameters),
            statusCode: 200,
        });
    }

    public getUser<T extends object>(username: string): Promise<T> {
        return this.createAxiosRequest<T>({
            method: 'get',
            url: 'users/' + username,
            statusCode: 200,
        });
    }

    public updateUser<T extends object>(username: string, user: object): Promise<T> {
        return this.createAxiosRequest<T>({
            method: 'patch',
            url: 'users/' + username,
            statusCode: 200,
            body: user,
        });
    }

    public getPosts<T extends object>(queryParameters = {}): Promise<T> {
        const mergedQueryParameters = { page: 1, ...queryParameters };
        return this.createAxiosRequest<T>({
            method: 'get',
            url: 'posts?' + buildPHPQuery(mergedQueryParameters),
            statusCode: 200,
        });
    }

    public createPost<T extends object>(post: object): Promise<T> {
        return this.createAxiosRequest<T>({
            method: 'post',
            url: 'posts',
            statusCode: 201,
            body: post,
        });
    }

    public getPost<T extends object>(id: number | string): Promise<T> {
        return this.createAxiosRequest<T>({
            method: 'get',
            url: 'posts/' + id,
            statusCode: 200,
        });
    }

    public replacePost<T extends object>(id: number | string, post: object): Promise<T> {
        return this.createAxiosRequest<T>({
            method: 'put',
            url: 'posts/' + id,
            statusCode: 200,
            body: post,
        });
    }

    public deletePost(id: number | string): Promise<undefined> {
        return this.createAxiosRequest<undefined>({
            method: 'delete',
            url: 'posts/' + id,
            statusCode: 204,
        });
    }

    public updatePost<T extends object>(id: number | string, post: object): Promise<T> {
        return this.createAxiosRequest<T>({
            method: 'patch',
            url: 'posts/' + id,
            statusCode: 200,
            body: post,
        });
    }

    public setFormat(format: Format) {
        this.format = format;
    }

    public setAccessToken(accessToken: AccessToken) {
        this.accessToken = accessToken;
    }

    private createAxiosRequest<T extends object | undefined>(options: RequestOptions): Promise<T> {
        const axiosConfig: AxiosConfig = {
            method: options.method,
            url: apiURL + options.url,
            validateStatus: (status: number): boolean => {
                return status === options.statusCode;
            },
            headers: this.getHeaders(options.method),
        };

        if (undefined !== options.body) {
            axiosConfig.data = options.body;
        }

        return axios.request(axiosConfig).then((resp: AxiosResponse<T>): T => {
            return resp.data;
        });
    }

    private getHeaders(method: Method): AxiosRequestHeaders {
        const headers: AxiosRequestHeaders = {
            accept: formats[this.format],
        };
        if (['post', 'put', 'patch'].includes(method.toLowerCase())) {
            headers['Content-Type'] = method.toLowerCase() === 'patch' ? patchMime : formats[this.format];
        }

        if (this.accessToken !== null) {
            headers.Authorization = 'Bearer ' + this.accessToken;
        }

        return headers;
    }
}

export default ApiClient;
