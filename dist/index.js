"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var axios_1 = __importDefault(require("axios"));
var apiURL = 'https://api.metero.pp.ua/';
var formats = {
    json: 'application/json',
    jsonld: 'application/ld+json',
};
var patchMime = 'application/merge-patch+json';
var ApiClient = /** @class */ (function () {
    function ApiClient(options) {
        if (options === void 0) { options = {}; }
        var mergedOptions = __assign({ format: 'json', accessToken: null }, options);
        this.setFormat(mergedOptions.format);
        this.setAccessToken(mergedOptions.accessToken);
    }
    ApiClient.prototype.getUsers = function (queryParameters) {
        if (queryParameters === void 0) { queryParameters = {}; }
        var mergedQueryParameters = __assign({ page: 1 }, queryParameters);
        return this.createAxiosRequest({
            method: 'get',
            url: 'users?' + toQuery(mergedQueryParameters),
            statusCode: 200,
        });
    };
    ApiClient.prototype.getUser = function (username) {
        return this.createAxiosRequest({
            method: 'get',
            url: 'users/' + username,
            statusCode: 200,
        });
    };
    ApiClient.prototype.updateUser = function (username, user) {
        return this.createAxiosRequest({
            method: 'patch',
            url: 'users/' + username,
            statusCode: 200,
            body: user,
        });
    };
    ApiClient.prototype.getPosts = function (queryParameters) {
        if (queryParameters === void 0) { queryParameters = {}; }
        var mergedQueryParameters = __assign({ page: 1 }, queryParameters);
        return this.createAxiosRequest({
            method: 'get',
            url: 'posts?' + toQuery(mergedQueryParameters),
            statusCode: 200,
        });
    };
    ApiClient.prototype.createPost = function (post) {
        return this.createAxiosRequest({
            method: 'post',
            url: 'posts',
            statusCode: 201,
            body: post,
        });
    };
    ApiClient.prototype.getPost = function (id) {
        return this.createAxiosRequest({
            method: 'get',
            url: 'posts/' + id,
            statusCode: 200,
        });
    };
    ApiClient.prototype.replacePost = function (id, post) {
        return this.createAxiosRequest({
            method: 'put',
            url: 'posts/' + id,
            statusCode: 200,
            body: post,
        });
    };
    ApiClient.prototype.deletePost = function (id) {
        return this.createAxiosRequest({
            method: 'delete',
            url: 'posts/' + id,
            statusCode: 204,
        });
    };
    ApiClient.prototype.updatePost = function (id, post) {
        return this.createAxiosRequest({
            method: 'patch',
            url: 'posts/' + id,
            statusCode: 200,
            body: post,
        });
    };
    ApiClient.prototype.setFormat = function (format) {
        this.format = format;
    };
    ApiClient.prototype.setAccessToken = function (accessToken) {
        this.accessToken = accessToken;
    };
    ApiClient.prototype.createAxiosRequest = function (options) {
        var axiosConfig = {
            method: options.method,
            url: apiURL + options.url,
            validateStatus: function (status) {
                return status === options.statusCode;
            },
            headers: this.getHeaders(['post', 'put', 'patch'].includes(options.method.toLowerCase()), options.method.toLowerCase() === 'patch'),
        };
        if (undefined !== options.body) {
            axiosConfig.body = options.body;
        }
        return axios_1.default.request(axiosConfig).then(function (resp) {
            return resp.data;
        });
    };
    ApiClient.prototype.getHeaders = function (hasBody, isPatch) {
        var headers = {
            accept: formats[this.format],
        };
        if (hasBody) {
            headers['Content-Type'] = (isPatch) ? patchMime : formats[this.format];
        }
        if (this.accessToken !== null) {
            headers.Authorization = 'Bearer ' + this.accessToken;
        }
        return headers;
    };
    return ApiClient;
}());
// type QueryObject = Record<string|number|boolean, boolean|null|undefined|string|number|object>;
// no ts start
function toQuery(obj) {
    var query = [];
    for (var name_1 in obj) {
        var value = obj[name_1];
        if (!isScalar(value)) {
            if (!isTrueArray(value)) {
                toObject(value, encodeURIComponent(name_1), query);
                continue;
            }
            toTrueArray(value, encodeURIComponent(name_1), query);
            continue;
        }
        query.push(encodeURIComponent(name_1) + '=' + toScalar(value));
    }
    return query.join('&');
}
function isScalar(value) {
    return !(value !== null && value !== undefined && typeof value === 'object');
}
function toScalar(scalar) {
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
function toObject(obj, name, query) {
    for (var key in obj) {
        var value = obj[key];
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
function isTrueArray(obj) {
    if (!Array.isArray(obj)) {
        return false;
    }
    for (var _i = 0, obj_1 = obj; _i < obj_1.length; _i++) {
        var value = obj_1[_i];
        if (!isScalar(value) && !(Object.keys(value).length === 1 || Object.keys(value).length === 0)) {
            return false;
        }
    }
    return true;
}
function toTrueArray(array, name, query) {
    for (var _i = 0, array_1 = array; _i < array_1.length; _i++) {
        var value = array_1[_i];
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
exports.default = ApiClient;
