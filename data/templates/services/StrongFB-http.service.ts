import { TransmitService } from './StrongFB-transmit.service';
import { APIRequest, APIResponse } from '../common/interfaces';
// import { HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, interval, Observable, Subject } from 'rxjs';
import { SettingsService } from './settings.service';
// import { API } from '../common/api';
import { APIStatusCodes, TransmitChannelName } from '../common/types';
// import { CacheService } from './cache.service';
import { lengthInUtf8Bytes } from '../common/public';
import { Axios, AxiosResponse } from 'axios';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class StrongFBHttpService<C extends string = ''> {
    protected tokenKey = 'kp__token';
    protected refreshTokenKey = 'kp__refresh_token';
    httpTransferData: {
        upload: number;
        download: number;
    } = {
            upload: 0,
            download: 0,
        };
    protected lastStatusCode: APIStatusCodes;
    protected lastRefreshToken: Date;
    /************************************************** */
    constructor(
        protected transmit: TransmitService<TransmitChannelName>,
    ) {
        // =>listen on 5 times of update interval
        interval(SettingsService.UPDATE_STATE_INTERVAL * 5).subscribe(() => {
            // =>check if last code is 401!
            if (this.lastStatusCode === APIStatusCodes.HTTP_401_UNAUTHORIZED) {
                this.refreshToken();
            }
        });
    }
    /************************************************** */
    send<T = any>(data: APIRequest<any>): Promise<AxiosResponse<APIResponse<T>>> {
        if (!data) { return undefined; }
        // =>set api version, if not set
        if (!data.version) {
            data.version = 'v1';
        }
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
        if (!data.contentType) {
            data.contentType = 'application/json';
        }
        if (data.reportProgress) {
            data.contentType = 'multipart/form-data';
        }
        // =>calculate request data size
        this.httpTransferData.upload += lengthInUtf8Bytes(JSON.stringify(data));
        // =>generate url
        let url =
            SettingsService.API_ENDPOINT + '/' +
            data.version + '/' +
            data.path;
        // =>set auth header
        if (!data.noAuth && this.getToken()) {
            data.headers['Authentication'] = this.getToken();
        }
        // =>set content-type header
        if (data.contentType && !data.headers['Content-Type']) {
            data.headers['Content-Type'] = data.contentType;
        }
        // =>init http instance
        let http = new Axios({
            timeout: SettingsService.REQUEST_TIMEOUT,
            headers: data.headers as any,
            responseType: 'json',
        });
        // =>append params to url, if get or delete
        if (data.method === 'GET' || data.method === 'DELETE') {
            // =>add params to url
            if (data.params && Object.keys(data.params).length > 0) {
                let params = [];
                for (const key in data.params) {
                    let value = encodeURIComponent(data.params[key]);
                    params.push(`${key}=${value}`);
                }
                url += `?${params.join('&')}`;
            }
        }
        // =>if POST method
        if (data.method === 'POST') {
            if (data.formData) {
                data.body = data.formData;
            }
            console.log('body:', data.body)
            // return http.post<APIResponse<T>>(url, data.body);
            return http.request({
                url: url,
                data: data.contentType === 'application/json' ? JSON.stringify(data.body) : data.body,
                method: 'POST',
            });
            // return this.http.post<APIResponse<T>>(url, data.body, {
            //    headers: data.headers,
            //    reportProgress: data.reportProgress,
            //    observe: data.reportProgress ? 'events' : undefined,
            // }) as any;
        }
        // =>if PUT method
        else if (data.method === 'PUT') {
            if (data.formData) {
                data.body = data.formData;
            }
            return http.put<APIResponse<T>>(url, data.body);
            // return this.http.put<APIResponse<T>>(url, data.body, { headers: data.headers });
        }
        // =>if DELETE method
        else if (data.method === 'DELETE') {
            return http.delete<APIResponse<T>>(url);
            // return this.http.delete<APIResponse<T>>(url, { headers: data.headers, params: data.params as any });
        }
        // =>if GET method
        else {
            return http.get<APIResponse<T>>(url);
            // return this.http.get(url, {
            //    headers: data.headers,
            //    params: data.params as any,
            //    responseType: 'json'
            // }) as Observable<APIResponse<T>>;
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
            response = this.send<T>(data).then(
                (it) => {
                    if (typeof it.data === 'string') {
                        it.data = JSON.parse(it.data);
                    }
                    // =>calculate response data size
                    this.httpTransferData.download += lengthInUtf8Bytes(JSON.stringify(it));
                    // console.log('res promise:', it.data)
                    // response.unsubscribe();
                    this.emitResponse(data, it.data);
                    // =>remove page loading
                    if (showPageLoading) {
                        this.transmit.emit('page-loading', false);
                    }
                    // this.lastStatusCode = it.statusCode || APIStatusCodes.HTTP_200_OK;
                    res(it.data);
                }).catch(async (error) => {
                    if (!error) {
                        this.lastStatusCode = APIStatusCodes.HTTP_404_NOT_FOUND;
                        res(undefined);
                        return;
                    }
                    // response.unsubscribe();
                    // =>calculate response data size
                    this.httpTransferData.download += lengthInUtf8Bytes(JSON.stringify(error));
                    this.lastStatusCode = error?.status || APIStatusCodes.HTTP_404_NOT_FOUND;
                    // =>check 401 error
                    if (error.status === APIStatusCodes.HTTP_401_UNAUTHORIZED) {
                        // =>if no refresh token, redirect to 'login' page
                        if (!this.getRefreshToken()) {
                            this.redirectLogin();
                        }
                        // =>if not refresh token or failed to get it from server!
                        if (!reloadIf401 || !this.getRefreshToken() || !await this.refreshToken()) {
                            this.lastStatusCode = APIStatusCodes.HTTP_401_UNAUTHORIZED;
                            // =>remove page loading
                            if (showPageLoading) {
                                this.transmit.emit('page-loading', false);
                            }
                            res({
                                data: undefined,
                                success: false,
                                statusCode: APIStatusCodes.HTTP_401_UNAUTHORIZED,
                            });
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
                        data: error.error && error.error.result ? error.error.result : undefined,
                        success: false,
                        message: error.error && error.error.messageName ? error.error.messageName : 'failed_op',
                        statusCode: error.status,
                        error,
                    } as APIResponse<T>;
                    // =>if no have any message codes
                    // if (!errorResponse.message || errorResponse.message.length === 0) {
                    //    errorResponse.messageName = ['failed_op'];
                    // }
                    // =>show first error message as toast
                    if (toastErrorMessage) {
                        this.transmit.emit('snackbar-message', { text: errorResponse.message, mode: 'error' });
                    }
                    this.emitResponse(data, errorResponse);
                    // =>remove page loading
                    if (showPageLoading) {
                        this.transmit.emit('page-loading', false);
                    }
                    res(errorResponse);
                });
        });
    }
    /************************************************** */
    async refreshToken(): Promise<boolean> {
        return new Promise((res) => {
            // =>check last refresh token (less than 30 seconds)
            if (this.lastRefreshToken && new Date().getTime() - this.lastRefreshToken.getTime() < 1000 * 30) {
                res(false);
                return;
            }
            this.lastRefreshToken = new Date();
            // const response = this.send<string>(API.refresh_token(this.getRefreshToken())).subscribe(
            //    it => {
            //       response.unsubscribe();
            //       this.setToken(it.result);
            //       res(true);
            //    },
            //    (error: HttpErrorResponse) => {
            //       // =>check 401 error
            //       if (error.status === APIStatusCodes.HTTP_401_UNAUTHORIZED) {
            //          // =>redirect to 'login' page
            //          this.redirectLogin();
            //          // =>reset tokens
            //          this.setRefreshToken(undefined);
            //          this.setToken(undefined);
            //          res(false);
            //       }
            //       res(true);
            //    });
        });
    }
    /************************************************** */
    redirectLogin() {
        // this.transmit.emit<PageInfo>('page', { static: 'login' });
    }
    /************************************************** */
    async getSuccessResult<T = any>(data: APIRequest<any>, def?: T, showPageLoading = true): Promise<T> {
        // =>send request to server
        const res = await this.sendPromise<T>(data, true, showPageLoading);
        // console.log('res:', res);
        // =>if success status
        if (res.statusCode === APIStatusCodes.HTTP_200_OK) {
            return res.data;
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
