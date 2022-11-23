import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { clone, SFB_warn } from '../../common/StrongFB-common';
import { StrongFBBaseWidget } from '../../common/StrongFB-widget';
import { StrongFBBaseWidgetHeader } from '../../common/StrongFB-widget-header';
import { TableColumnAction, TableColumnDynamicActionsType, TableSchema } from './table-interfaces';
import { takeUntil } from 'rxjs';
import { StrongFBService } from '../../services/StrongFB.service';
import { APIResponse } from '../../common/StrongFB-interfaces';
import { refreshTable } from './convertor';
// import { extraNormalizeSchema } from './convertor';

@Component({
    selector: 'table-widget',
    templateUrl: './table.component.html',
    styleUrls: ['./table.component.scss']
})
export class StrongFBTableWidgetComponent extends StrongFBBaseWidget<TableSchema> implements AfterViewInit {
    @ViewChild('table') tableRef: any;
    override schema: TableSchema;
    simpleRows: object[] = [];
    displayRows: object[] = [];
    page = 1;
    rowsSelectedCount = 0;
    isRtl = false;
    rowsSelected: { [k: string]: object } = {};
    displayedColumns: string[] = [];

    constructor(
        protected override elRef: ElementRef,
        protected override cdr: ChangeDetectorRef,
        protected srv: StrongFBService) {
        super(elRef, cdr);
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
        });
        // =>check rtl direction
        this.isRtl = this.srv.locale().direction.getValue() === 'rtl';

    }

    async loadRows() {
        this.displayLoading(true);
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
            if (this.simpleRows) {
                for (const row of this.simpleRows) {
                    this.displayRows.push(JSON.parse(JSON.stringify(displayRow)));
                }
            }
            // =>set display rows as async
            this.initDisplayRows();
        }
        // =>load rows by local
        //TODO:
        this.displayLoading(false);
        refreshTable(this.tableRef);
    }


    protected async callApi() {
        // =>add pagination
        if (this.schema.mapApiPagination) {
            // =>GET method
            if (this.schema.loadRowsByApi.options.method === 'GET') {
                if (this.schema.loadRowsByApi.options.params === undefined) {
                    this.schema.loadRowsByApi.options.params = {};
                }
                this.schema.loadRowsByApi.options.params[this.schema.mapApiPagination.pageParam] = this.page;
                this.schema.loadRowsByApi.options.params[this.schema.mapApiPagination.pageSizeParam] = this.schema.mapApiPagination.pageSize;
            }
            //TODO: post
        }
        let res: APIResponse;
        // =>call api by user request
        if (this.schema.loadRowsByApi.request) {
            res = await this.schema.loadRowsByApi.request(this.schema.loadRowsByApi.options);
        }
        // =>call api
        else {
            res = await this.widgetForm.http.sendPromise(this.schema.loadRowsByApi.options);
        }
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
        this.rowsSelected = {};
        this.rowsSelectedCount = 0;
        // =>set selected rows
        if (schema.selectable?.selectedRows) {
            for (const row of schema.selectable.selectedRows) {
                // =>check limit
                if (!this.checkSelectedLimit()) break;
                // =>generate sign
                let rowSign = this.generateRowSign(row);
                this.rowsSelected[rowSign] = row;
                this.rowsSelectedCount++;
            }
            this.emitSelectedRows();
        }

        // =>set not found text
        if (schema.notFound && !schema.notFound.html) {
            schema.notFound.html = this.srv.locale().trans('common', 'Not Found!');
        }

        this.displayedColumns = this.schema.columns.map(i => i.name);

        // schema = extraNormalizeSchema(schema);

        return schema;
    }

    protected async initDisplayRows() {
        if (!this.simpleRows) return;
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
            refreshTable(this.tableRef);
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

    isNotFoundEnabled() {
        if (this.displayComponentLoading) return false;
        if (!this.schema?.notFound) return false;
        if (this.page == 1 && (!this.simpleRows || this.simpleRows.length === 0)) return true;

        return false;
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
         * < [1] 2 3 4 5 > >>(5)
         * < 1 [2] 3 4 5 > >>(9)
         * < 1 2 [3] 4 5 > >>(10)
         * < 2 3 [4] 5 6 > >> (10)
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
        if (count <= 5) {
            for (let i = 1; i <= count; i++) {
                this.displayPages.pages.push(i);
            }
            return true;
        }
        this.displayPages.prev = true;
        this.displayPages.next = true;
        this.displayPages.first = true;
        this.displayPages.last = true;

        // =>if page bigger than 2
        if (this.page > 2) {
            this.displayPages.pages.push(this.page - 2);
        }
        if (this.page > 1) {
            this.displayPages.pages.push(this.page - 1);
        }
        this.displayPages.pages.push(this.page);
        if (this.page + 1 <= count) {
            this.displayPages.pages.push(this.page + 1);
        }
        if (this.page + 2 <= count) {
            this.displayPages.pages.push(this.page + 2);
        }
        if (this.displayPages.pages.length < 5 && this.page + 3 <= count) {
            this.displayPages.pages.push(this.page + 3);
        }
        // =>Add from first
        if (this.displayPages.pages.length < 5 && this.page > 3) {
            this.displayPages.pages.unshift(this.page - 3);
        }




        if (this.displayPages.pages.includes(count)) {
            this.displayPages.last = false;
        }

        if (this.displayPages.pages.includes(1)) {
            this.displayPages.first = false;
        }


        return true;
    }

    protected generateRowSign(row: object) {
        return String(this.schema.selectable.rowKey.call(this.widgetForm, row, this.widgetHeader));
        // return 'row_' + JSON.stringify(row);
    }

    toggleSelectRow(rowIndex: number, event: boolean) {
        // console.log('select:', rowIndex, event)
        // =>find row by index
        let row = this.simpleRows[rowIndex];
        // =>counter
        if (event) {
            // =>check limit
            if (!this.checkSelectedLimit()) return;

            this.rowsSelectedCount++;
        }
        else
            this.rowsSelectedCount--;
        // =>generate sign
        let rowSign = this.generateRowSign(row);
        this.rowsSelected[rowSign] = event ? row : undefined;

        this.emitSelectedRows();
    }

    emitSelectedRows() {
        // =>collect selected rows
        let selectedRows = [];
        for (const key of Object.keys(this.rowsSelected)) {
            if (!this.rowsSelected[key]) continue;
            selectedRows.push(this.rowsSelected[key]);
        }
        // =>call callback function
        this.schema.selectable.callback.call(this.widgetForm, selectedRows, this.widgetHeader);
    }

    isRowSelected(rowIndex: number) {
        let row = this.simpleRows[rowIndex];
        // =>generate sign
        let rowSign = this.generateRowSign(row);
        return this.rowsSelected[rowSign] !== undefined ? true : false;
    }

    checkSelectedLimit() {
        if (!this.schema.selectable.limit) return true;
        if (this.rowsSelectedCount + 1 > this.schema.selectable.limit) return false;

        return true;
    }

    setRowColor(mode: 'background' | 'foreground', rowIndex: number) {
        if (!this.schema.rowColorAction) return undefined;
        // =>find row by index
        let row = this.simpleRows[rowIndex];
        // =>call row color action
        let res = this.schema.rowColorAction.call(this.widgetForm, row, this.widgetHeader);
        if (mode === 'background') {
            if (typeof res === 'string') {
                return res;
            } else if (Array.isArray(res) && res.length > 0) {
                return String(res[0]);
            }
        } else if (mode === 'foreground') {
            if (Array.isArray(res) && res.length > 1) {
                return String(res[1]);
            }
        }
        return undefined;
    }
}

