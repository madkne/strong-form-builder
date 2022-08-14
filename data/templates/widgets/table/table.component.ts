import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { clone, SFB_warn } from '../../common/StrongFB-common';
import { StrongFBBaseWidget } from '../../common/StrongFB-widget';
import { StrongFBBaseWidgetHeader } from '../../common/StrongFB-widget-header';
import { TableColumnAction, TableColumnDynamicActionsType, TableSchema } from './table-interfaces';
import { takeUntil } from 'rxjs';

@Component({
    selector: 'table-widget',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss']
})
export class StrongFBTabledWidgetComponent extends StrongFBBaseWidget<TableSchema> implements AfterViewInit {
    override schema: TableSchema;
    simpleRows: object[] = [];
    displayRows: object[] = [];
    page = 1;

    constructor(protected override elRef: ElementRef, protected cdr: ChangeDetectorRef) {
        super(elRef)
    }


    override async onInit() {
        this.schema = this.widgetHeader.schema;
        // =>normalize schema
        this.schema = await this.normalizeSchema(this.schema);
        // =>listen on update rows
        this.widgetHeader['_updateRows$'].pipe(takeUntil(this.destroy$)).subscribe(it => {
            if (!it) return;
            // =>load rows
            this.loadRows();
        })

    }

    async loadRows() {
        this.simpleRows = [];
        this.displayRows = [];
        // =>load rows by api
        if (this.schema.loadRowsByApi) {
            let res = await this.callApi();
            // =>call 'response' function
            this.simpleRows = await this.schema.loadRowsByApi.response.call(this.widgetForm, res.result, res.error, this.widgetHeader);
            // =>set loading for display rows
            let displayRow = {};
            for (const col of this.schema.columns) {
                if (col.type === 'actions') displayRow[col.name] = [];
                else if (col.type === 'tagsList') {
                    displayRow[col.name] = [];
                }
                else {
                    displayRow[col.name] = '...';
                }
            }
            // =>init display rows
            for (const row of this.simpleRows) {
                this.displayRows.push(JSON.parse(JSON.stringify(displayRow)));
            }
            // =>set display rows as async
            this.initDisplayRows();
        }
        // =>load rows by local
        //TODO:
    }


    protected async callApi() {
        // =>add pagination
        if (this.schema.mapApiPagination) {
            // =>GET method
            if (this.schema.loadRowsByApi.options.method === 'GET') {
                this.schema.loadRowsByApi.options.params = {};
                this.schema.loadRowsByApi.options.params[this.schema.mapApiPagination.pageParam] = this.page;
                this.schema.loadRowsByApi.options.params[this.schema.mapApiPagination.pageSizeParam] = this.schema.mapApiPagination.pageSize;
            }
            //TODO: post
        }
        // =>call api
        let res = await this.widgetForm.http.sendPromise(this.schema.loadRowsByApi.options);
        // =>parse pagination from response
        if (this.schema.mapApiPagination) {
            if (res && res.result) {
                // =>parse page count
                let sp = this.schema.mapApiPagination.pageCountResponse.split('.');
                let pageSize = clone(res.result);
                for (const key of sp) {
                    if (pageSize[key]) {
                        pageSize = pageSize[key];
                    }
                }
                this.schema.mapApiPagination.__pageCountResponse = Number(pageSize);
                // console.log('page count:', this.schema.mapApiPagination.__pageCountResponse, pageSize);
            }
            this.calcDisplayPagination();
        }

        return res;
    }

    protected async normalizeSchema(schema: TableSchema) {
        if (!schema.columns) schema.columns = [];
        if (!schema.columnActions) schema.columnActions = {};
        if (schema.mapApiPagination) {
            if (!schema.mapApiPagination.pageSize) {
                schema.mapApiPagination.pageSize = 10;
            }
            if (!schema.mapApiPagination.pageSizeParam) {
                schema.mapApiPagination.pageSizeParam = 'page_size';
            }
            if (!schema.mapApiPagination.pageParam) {
                schema.mapApiPagination.pageParam = 'page';
            }
        }

        return schema;
    }

    protected async initDisplayRows() {
        for (let i = 0; i < this.simpleRows.length; i++) {
            const simpleRow = this.simpleRows[i];
            for (const col of this.schema.columns) {
                // =>check for actions type
                if (col.type == 'actions') {
                    if (this.schema.columnActions[col.name]) {
                        // =>if dynamic add actions
                        if (typeof this.schema.columnActions[col.name] === 'function') {
                            (this.schema.columnActions[col.name] as TableColumnDynamicActionsType).call(this.widgetForm, simpleRow, i, this.widgetHeader).then(it => {
                                this.displayRows[i][col.name] = it;
                            });
                        } else if (Array.isArray(this.schema.columnActions[col.name])) {
                            this.displayRows[i][col.name] = this.schema.columnActions[col.name];
                        }

                    }
                    // =>if no action map, change its type
                    else {
                        col.type = 'string';
                        this.displayRows[i][col.name] = '';
                    }
                }
                // =>check for column map function
                else if (col.mapValue) {
                    this.displayRows[i][col.name] = await col.mapValue.call(this.widgetForm, this.simpleRows[i], i, this.widgetHeader);
                }
                // =>set simple row value
                else {
                    this.displayRows[i][col.name] = this.simpleRows[i][col.name] || '';
                }
            }
            this.cdr.detectChanges();
        }
    }

    async runButtonAction(button: TableColumnAction, rowIndex: number) {
        if (!button.action) return;
        button.action.call(this.widgetForm, this.simpleRows[rowIndex], rowIndex, this.widgetHeader);
    }

    goToPage(page: number) {
        this.page = page;
        this.loadRows();
    }

    displayPages = {
        first: true,
        prev: true,
        pages: [],
        next: true,
        last: true,

    }
    calcDisplayPagination() {
        /**
         * 1 2 3 4 5
         * < [1] 2 .. 4 5 > (5)
         * < 1 2 .. [5] .. 9 > (9)
         * < 1 .. [8] 9 10 > (10)
         */
        let count = this.schema.mapApiPagination.__pageCountResponse;
        this.displayPages = {
            first: false,
            prev: false,
            pages: [],
            next: false,
            last: false,

        }
        // count less than 5
        if (count < 5) {
            for (let i = 0; i < 5; i++) {
                this.displayPages.pages.push(i);
            }
            return true;
        }
        this.displayPages.prev = true;
        this.displayPages.next = true;
        this.displayPages.first = true;
        this.displayPages.last = true;
        if (this.page > 2 && count - this.page > 3) {
            this.displayPages.pages.push(1);
            this.displayPages.pages.push(2);
            this.displayPages.pages.push('...');
            this.displayPages.pages.push(this.page);
            this.displayPages.first = false;
        }
        else if (this.page > 1 && count != this.page) {
            this.displayPages.pages.push('...');
            this.displayPages.pages.push(this.page);
        }

        else if (count != this.page) {
            this.displayPages.first = false;
            this.displayPages.pages.push(this.page);

        }


        if (count == this.page) {
            this.displayPages.pages.push('...');
            this.displayPages.pages.push(count - 1);
            this.displayPages.pages.push(count);
            this.displayPages.last = false;
        }
        else if (count - this.page < 3) {
            for (let i = this.page + 1; i <= count; i++) {
                this.displayPages.pages.push(i);
            }
            this.displayPages.last = false;
        } else {
            this.displayPages.pages.push(this.page + 1);
            this.displayPages.pages.push('...');
            this.displayPages.pages.push(count - 1);
            this.displayPages.pages.push(count);
            this.displayPages.last = false;

        }

        return true;
    }
}

