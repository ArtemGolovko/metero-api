declare const formats: {
    json: string;
    jsonld: string;
};
declare type Format = keyof typeof formats;
declare type AccessToken = string | null;
interface ApiClientOptions {
    readonly format?: Format;
    readonly accessToken?: AccessToken;
}
declare class ApiClient {
    private format;
    private accessToken;
    constructor(options?: ApiClientOptions);
    getUsers<T extends object>(queryParameters?: {}): Promise<T>;
    getUser<T extends object>(username: string): Promise<T>;
    updateUser<T extends object>(username: string, user: object): Promise<T>;
    getPosts<T extends object>(queryParameters?: {}): Promise<T>;
    createPost<T extends object>(post: object): Promise<T>;
    getPost<T extends object>(id: number | string): Promise<T>;
    replacePost<T extends object>(id: number | string, post: object): Promise<T>;
    deletePost(id: number | string): Promise<undefined>;
    updatePost<T extends object>(id: number | string, post: object): Promise<T>;
    setFormat(format: Format): void;
    setAccessToken(accessToken: AccessToken): void;
    private createAxiosRequest;
    private getHeaders;
}
export default ApiClient;
