import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { SFB_warn } from '../../common/StrongFB-common';
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
            let res = await this.widgetForm.http.sendPromise(this.schema.loadRowsByApi.options);
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

    async normalizeSchema(schema: TableSchema) {
        if (!schema.columns) schema.columns = [];
        if (!schema.columnActions) schema.columnActions = {};


        return schema;
    }

    async initDisplayRows() {
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
}
