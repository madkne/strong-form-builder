import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Observable, Subject } from 'rxjs';
import { lengthInUtf8Bytes } from '../common/StrongFB-common';
import { APIRequest, APIResponse } from '../common/StrongFB-interfaces';
import { APIStatusCodes } from '../common/StrongFB-types';
import { StrongFBTransmitService } from './StrongFB-transmit.service';

@Injectable({
    providedIn: 'root'
})
export class StrongFBHttpService {
    protected tokenKey = '_token';
    protected updateInterval = 1000;
    protected refreshTokenKey = '_refresh_token';
    httpTransferData: {
        upload: number;
        download: number;
    } = {
            upload: 0,
            download: 0,
        };
    protected lastStatusCode: APIStatusCodes;
    protected lastRefreshToken: Date;
    protected apiEndpoint: string;
    protected authenticationHeaderName: string;
    protected getRefreshTokenApi: (http: StrongFBHttpService) => Promise<{ access_token: string; refresh_token: string; }>;
    protected loginPath: string;
    /************************************************** */
    constructor(
        private http: HttpClient,
        private transmit: StrongFBTransmitService,
        private route: Router,
    ) {
        this.configs();
        // =>listen on 5 times of update interval
        interval(this.updateInterval * 5).subscribe(() => {
            // =>check if last code is 401!
            if (this.lastStatusCode === APIStatusCodes.HTTP_401_UNAUTHORIZED) {
                this.refreshToken();
            }
        });
    }
    /************************************************** */
    configs(options = {
        updateInterval: 1000,
        tokenKey: 'access_token',
        refreshTokenKey: 'refresh_token',
        apiEndpoint: 'http:localhost:8081/api',
        authenticationHeaderName: 'Authentication',
        loginPath: '/login',
        getRefreshTokenApi: async (http: StrongFBHttpService) => {
            return {
                access_token: '',
                refresh_token: '',
            }
        },
    }) {
        this.updateInterval = options.updateInterval;
        this.tokenKey = options.tokenKey;
        this.refreshTokenKey = options.refreshTokenKey;
        this.apiEndpoint = options.apiEndpoint;
        this.authenticationHeaderName = options.authenticationHeaderName;
        this.getRefreshTokenApi = options.getRefreshTokenApi;
        this.loginPath = options.loginPath;
    }
    /************************************************** */
    send<T = any>(data: APIRequest<any>): Observable<any> {
        if (!data) { return undefined; }
        if (data.path.startsWith('/')) data.path = data.path.substring(1);
        // =>set report progress, if not set
        if (data.reportProgress === undefined) {
            data.reportProgress = false;
        }
        // =>set api headers, if not set
        if (!data.headers) {
            data.headers = {};
        }
        // =>set body for POST,PUT methods
        if ((data.method === 'POST' || data.method === 'PUT') && !data.body) {
            data.body = data.params;
            data.params = {};
        }
        // =>set params for GET,DELETE methods
        if ((data.method === 'GET' || data.method === 'DELETE') && !data.params) {
            data.params = data.body;
            data.body = {};
        }
        // =>if params not set
        if (!data.params) {
            data.params = {};
        }

        if (!data.body) { data.body = {}; }
        if (!data.params) { data.params = {}; }
        // =>calculate request data size
        this.httpTransferData.upload += lengthInUtf8Bytes(JSON.stringify(data));
        // =>generate url
        const url = this.apiEndpoint + '/' + data.path;
        // =>set auth header
        if (!data.noAuth && this.getToken()) {
            data.headers[this.authenticationHeaderName] = this.getToken();
        }
        // =>if POST method
        if (data.method === 'POST') {
            if (data.formData) {
                data.body = data.formData;
            }
            return this.http.post<APIResponse<T>>(url, data.body, {
                headers: data.headers,
                reportProgress: data.reportProgress,
                observe: data.reportProgress ? 'events' : undefined,
            }) as any;
        }
        // =>if PUT method
        else if (data.method === 'PUT') {

            return this.http.put<APIResponse<T>>(url, data.body, { headers: data.headers });
        }
        // =>if DELETE method
        else if (data.method === 'DELETE') {
            return this.http.delete<APIResponse<T>>(url, { headers: data.headers, params: data.params as any });
        }
        // =>if GET method
        else {
            return this.http.get(url, {
                headers: data.headers,
                params: data.params as any,
                responseType: 'json'
            }) as Observable<APIResponse<T>>;
        }
    }
    /************************************************** */
    sendPromise<T = any>(data: APIRequest<any>, toastErrorMessage = true, showPageLoading = true, reloadIf401 = true): Promise<APIResponse<T>> {
        return new Promise((res) => {
            // =>set page loading
            if (showPageLoading) {
                this.transmit.emit('page-loading', true);
            }
            let response;
            response = this.send<T>(data).subscribe({
                next: (it) => {
                    // =>calculate response data size
                    this.httpTransferData.download += lengthInUtf8Bytes(JSON.stringify(it));
                    response.unsubscribe();
                    this.emitResponse(data, it);
                    // =>remove page loading
                    if (showPageLoading) {
                        this.transmit.emit('page-loading', false);
                    }
                    this.lastStatusCode = it.statusCode || APIStatusCodes.HTTP_200_OK;
                    res({
                        result: it,
                        statusCode: this.lastStatusCode,
                    });
                },
                error: async (error: HttpErrorResponse) => {
                    if (!response) {
                        this.lastStatusCode = APIStatusCodes.HTTP_404_NOT_FOUND;
                        res({
                            statusCode: this.lastStatusCode,
                            result: undefined,
                            error,
                        });
                        return;
                    }
                    response.unsubscribe();
                    // =>calculate response data size
                    this.httpTransferData.download += lengthInUtf8Bytes(JSON.stringify(error));
                    this.lastStatusCode = error?.status || APIStatusCodes.HTTP_404_NOT_FOUND;
                    // =>check 401 error
                    if (error.status === APIStatusCodes.HTTP_401_UNAUTHORIZED) {

                        // =>if not refresh token or failed to get it from server!
                        if (!reloadIf401 || !this.getRefreshToken() || !await this.refreshToken()) {
                            this.lastStatusCode = APIStatusCodes.HTTP_401_UNAUTHORIZED;
                            // =>remove page loading
                            if (showPageLoading) {
                                this.transmit.emit('page-loading', false);
                            }
                            res({
                                result: undefined,
                                statusCode: APIStatusCodes.HTTP_401_UNAUTHORIZED,
                                error,
                            });
                            if (reloadIf401) {
                                this.redirectLogin();
                            }
                            return;
                        }
                        // =>remove page loading
                        if (showPageLoading) {
                            this.transmit.emit('page-loading', false);
                        }
                        res(await this.sendPromise(data, toastErrorMessage));
                        return;
                    }
                    const errorResponse = {
                        result: error.error && error.error.result ? error.error.result : undefined,
                        statusCode: error.status,
                        error,
                    } as APIResponse<T>;
                    this.emitResponse(data, errorResponse);
                    // =>remove page loading
                    if (showPageLoading) {
                        this.transmit.emit('page-loading', false);
                    }
                    res(errorResponse);
                }
            });
        });
    }

    /************************************************** */

    async get(path: string, params?: object, noAuth = false) {
        return this.sendPromise({
            method: 'GET',
            path,
            params: params as any,
            noAuth,
        });
    }
    /************************************************** */

    async post(path: string, body?: object, noAuth = false) {
        return this.sendPromise({
            method: 'POST',
            path,
            body: body,
            noAuth,
        });
    }
    /************************************************** */
    async refreshToken(): Promise<boolean> {
        return new Promise(async (res) => {
            // =>check last refresh token (less than 30 seconds)
            if (this.lastRefreshToken && new Date().getTime() - this.lastRefreshToken.getTime() < 1000 * 30) {
                res(false);
                return;
            }
            try {
                this.lastRefreshToken = new Date();
                let response = await this.getRefreshTokenApi(this);
                this.setToken(response.access_token);
                this.setRefreshToken(response.refresh_token);

                res(true);
            } catch (e) {
                // =>redirect to 'login' page
                this.redirectLogin();
                // =>reset tokens
                this.setRefreshToken(undefined);
                this.setToken(undefined);
                res(false);
            }
        });
    }
    /************************************************** */
    redirectLogin() {
        if (!this.loginPath) return;
        this.route.navigateByUrl(this.loginPath);
    }
    /************************************************** */
    async getSuccessResult<T = any>(data: APIRequest<any>, def?: T, showPageLoading = true): Promise<T> {
        // =>send request to server
        const res = await this.sendPromise<T>(data, true, showPageLoading);
        // =>if success status
        if (res.statusCode === APIStatusCodes.HTTP_200_OK) {
            return res.result;
        }
        return def;
    }
    /************************************************** */
    getToken(): string | null {
        return localStorage.getItem(this.tokenKey);
    }
    /************************************************** */
    getRefreshToken(): string | null {
        return localStorage.getItem(this.refreshTokenKey);
    }
    /************************************************** */
    setToken(token: string) {
        if (token === undefined || token === null) {
            localStorage.removeItem(this.tokenKey);
        }
        // =>save token on local storage
        else {
            localStorage.setItem(this.tokenKey, token);
        }
    }
    /************************************************** */
    setRefreshToken(token: string) {
        if (token === undefined || token === null) {
            localStorage.removeItem(this.refreshTokenKey);
        }
        // =>save token on local storage
        else {
            localStorage.setItem(this.refreshTokenKey, token);
        }
    }
    /************************************************** */
    emitResponse(request: APIRequest, response: APIResponse) {
        this.transmit.emit<{ request: APIRequest, response: APIResponse }>('response', {
            request,
            response,
        });
    }
    /************************************************** */
    resetTokens() {
        localStorage.removeItem(this.tokenKey);
        localStorage.removeItem(this.refreshTokenKey);

    }
}