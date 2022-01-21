import axios, { AxiosRequestHeaders, AxiosResponse, Method } from 'axios';

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
    body?: object;
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
            url: 'users?' + toQuery(mergedQueryParameters),
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
            url: 'posts?' + toQuery(mergedQueryParameters),
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
            headers: this.getHeaders(
                 ['post', 'put', 'patch'].includes(options.method.toLowerCase()),
                options.method.toLowerCase() === 'patch',
            ),
        };

        if (undefined !== options.body) {
            axiosConfig.body = options.body;
        }

        return axios.request(axiosConfig).then((resp: AxiosResponse<T>): T => {
            return resp.data;
        });
    }

    private getHeaders(hasBody: boolean, isPatch: boolean): AxiosRequestHeaders {
        const headers: AxiosRequestHeaders = {
            accept: formats[this.format],
        };
        if (hasBody) {
            headers['Content-Type'] = (isPatch) ? patchMime : formats[this.format];
        }

        if (this.accessToken !== null) {
            headers.Authorization = 'Bearer ' + this.accessToken;
        }

        return headers;
    }
}

// type QueryObject = Record<string|number|boolean, boolean|null|undefined|string|number|object>;

// no ts start
function toQuery(obj: object): string {
    const query = [];
    for (const name in obj) {
        const value = obj[name];
        if (!isScalar(value)) {
            if (!isTrueArray(value)) {
                toObject(value, encodeURIComponent(name), query);
                continue;
            }

            toTrueArray(value, encodeURIComponent(name), query);
            continue;
        }
        query.push(encodeURIComponent(name) + '=' + toScalar(value));
    }

    return query.join('&');
}

function isScalar(value: any): boolean {
    return !(value !== null && value !== undefined && typeof value === 'object');
}

function toScalar(scalar: boolean | null | undefined | string | number): string {
    if (scalar === true) {
        return 'true';
    }

    if (scalar === false) {
        return 'false';
    }

    if (scalar === null || scalar === undefined) {
        return '';
    }

    return encodeURIComponent(scalar);
}

function toObject(obj: object, name: string, query: Array<string>): void {
    for (const key in obj) {
        const value = obj[key];
        if (!isScalar(value)) {
            if (!isTrueArray(value)) {
                toObject(value, name + '[' + encodeURIComponent(key) + ']', query);
                continue;
            }

            toTrueArray(value, name + '[' + encodeURIComponent(key) + ']', query);
            continue;
        }

        query.push(name + '[' + encodeURIComponent(key) + ']=' + toScalar(value));
    }
}

function isTrueArray(obj: any): boolean {
    if (!Array.isArray(obj)) {
        return false;
    }

    for (const value of obj) {
        if (!isScalar(value) && !(Object.keys(value).length === 1 || Object.keys(value).length === 0)) {
            return false;
        }
    }

    return true;
}

function toTrueArray(array: Array<any>, name: string, query: Array<string>): void {
    for (const value of array) {
        if (!isScalar(value)) {
            if (!isTrueArray(value)) {
                toObject(value, name + '[]', query);
                continue;
            }

            toTrueArray(value, name + '[]', query);
            continue;
        }
        query.push(name + '[]=' + toScalar(value));
    }
}
// no ts end

export default ApiClient;
