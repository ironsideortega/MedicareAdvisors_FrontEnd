import { Component, OnInit, ViewChild} from "@angular/core";
import { MatPaginator } from '@angular/material/paginator';
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ProspectService } from "src/app/core/services/prospect/prospect.service";
import { IsChangeTableService } from "../../services/ejecutor.service";
import { MatSnackBar, } from "@angular/material/snack-bar";
import { SearchService } from "src/app/core/services/search/search.service";
import { UserDefineService } from "src/app/core/services/userDefine/userDefine.service";
declare var $: any;

@Component({
  selector: 'app-summary-page',
  templateUrl: './summary.page.html',
  styleUrls: ['./summary.page.scss'],
})

export class SummaryPage implements OnInit {
  submittedPhone = false;
  isLoading:boolean = false;
  myForm!: FormGroup;
  datasource:any[] = [];
  fields:string[] = [];
  fieldVisibility: { [key: string]: boolean } = {
    Status:false,
    Gender: false,
    Title: false,
    PreferredLanguage: false,
    SpecialDesignation: false,
    Source: false,
    Suffix: false,
    ReferredBy: false,
    MaritalStatus: false,
    Occupation: false
  };

  searchParamsList:any = [];
  searchForm!: FormGroup;
  columns: string[] = []; // Este listado debe venir de tu servicio que obtiene las columnas de la BD.
  availableColumns: { [key: number]: string[] } = {};

  totalItems = 0;
  pageSize = 10;
  currentPage = 1;
  maxPagesToShow = 5;
  userDefineFields:any = [];
  userDefineFieldsList:any = [];
  selectedField!: string;
  selectedView: string = 'Default';
  dynamicFields: string[] = [];
  dynamicForm!: FormGroup;
  udvName:string = '';
  customFields: any[] = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
Math: any;


  constructor(
    private formBuilder: FormBuilder,
    private prospectService: ProspectService,
    private searchService:SearchService,
    private userDefineService: UserDefineService
  ) {
    this.buildForm();
    this.selectedField = 'Default';
  }



  buildForm(){
    this.myForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber:['', [Validators.required, Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/)]],
      email: ['', [Validators.required, Validators.email]]
    });
  }

  ngOnInit(): void {
    this.getAllData(1);
    this.getParams();
    this.searchForm = this.formBuilder.group({
      searchFields: this.formBuilder.array([this.createSearchField()])
    });
    this.getUserDefineField();
    this.getAllFields();
  }

   // events


  getAllData(page: number){
    this.prospectService.getFormData(page, this.pageSize).subscribe(response => {
      this.datasource = response.data;
      this.totalItems = response.pagination.total;
      this.currentPage = page;
    });
  }

  resetData(){
    this.myForm.reset();
    this.searchForm = this.formBuilder.group({
      searchFields: this.formBuilder.array([this.createSearchField()])
    });
    this.getAllData(1);
  }

  getParams(): void {
    this.searchService.getSearchParams().subscribe(response => {
      this.columns = response.data.map((element: any) => element.COLUMN_NAME);
      this.updateAvailableColumns();
    });
  }

  getAllFields() {
    this.searchService.getSearchParamsColumns().subscribe(response => {
      this.customFields = response.data[0]; // Asume que siempre se toma el primer array de la data
      this.dynamicForm = this.formBuilder.group({
        checkboxes: this.formBuilder.array(this.customFields.map(() => false))
      });
    });
  }

  get checkboxes(): FormArray {
    return this.dynamicForm.get('checkboxes') as FormArray;
  }

  getSelectedValues(): number[] {
    return this.customFields
      .filter((_, i) => this.checkboxes.at(i).value)
      .map(field => field.UDV_Column_ID); // Guarda el ID del campo seleccionado
  }

  saveView() {
    console.log(this.getSelectedValues());
    const profileID = parseInt(localStorage.getItem('userId')!);
    const udvName = this.udvName;
    const selectedColumnIDs = this.getSelectedValues();

    if(selectedColumnIDs.length === 0) {
      console.log('No se han seleccionado columnas');
      return;
    }

    if(udvName === ''){
      console.log('No se ha ingresado nombre de vista');
      return;
    }

    this.userDefineService.createUserDefinedView(profileID, udvName, selectedColumnIDs).subscribe(response => {
      console.log(response);
      this.getAllData(1);
      this.udvName = '';
      this.dynamicForm.reset();
      this.selectedField = 'Default';
      this.getUserDefineField();
      this.getAllFields();
    });
  }

  changePage(page: number) {
    if (page >= 1 && page <= Math.ceil(this.totalItems / this.pageSize)) {
      this.getAllData(page);
    }
  }

  get totalPages() {
    // Asegúrate de que totalItems sea un número antes de calcular el total de páginas
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get pages(): number[] {
    const totalPages = this.totalPages;
    const currentPage = this.currentPage;
    const maxPagesToShow = this.maxPagesToShow;

    if (totalPages <= maxPagesToShow) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  }

  showField(name:string){
    const index = this.fields.indexOf(name);
    if (index !== -1) {
      this.fields.splice(index, 1);
    } else {
      this.fields.push(name);
    }
  }

  // getFieldNames(): string[] {
  //   return Object.keys(this.fieldVisibility);
  // }

  deleteContact(contactId:number){
    this.prospectService.deleteContact(contactId).subscribe(response => {
      this.getAllData(this.currentPage);
    });
  }

  createSearchField(): FormGroup {
    return this.formBuilder.group({
      column: ['', Validators.required],
      searchTerm: ['', Validators.required]
    });
  }

  get searchFields(): FormArray {
    return this.searchForm.get('searchFields') as FormArray;
  }

  addSearchField(): void {
    this.searchFields.push(this.createSearchField());
    this.updateAvailableColumns();
  }

  removeSearchField(index: number): void {
    this.searchFields.removeAt(index);
    delete this.availableColumns[index];
    this.updateAvailableColumns();
  }

  onColumnChange(index: number): void {
    this.updateAvailableColumns();
  }

  updateAvailableColumns(): void {
    const selectedColumns = this.searchFields.controls.map(control => control.get('column')!.value);
    this.availableColumns = this.searchFields.controls.reduce((acc, _, idx) => {
      acc[idx] = this.columns.filter(column => !selectedColumns.includes(column) || selectedColumns[idx] === column);
      return acc;
    }, {} as { [key: number]: string[] });
  }




  onSubmit(): void {
    if (this.searchForm.valid) {
      const searchParams = this.searchForm.value.searchFields
        .filter((field: any) => field.column && field.searchTerm)
        .reduce((acc: any, field: any) => {
          acc[field.column] = field.searchTerm;
          return acc;
        }, {});

      this.searchService.searchData(searchParams).subscribe(response => {
        console.log('Search Results:', response);
        this.datasource = response.data || []; // Asigna directamente el resultado a datasource
        console.log(this.datasource);
      });
    }
  }

  getUserDefineField() {
    const userId = localStorage.getItem('userId');
    if (userId !== null) {
      const profileID = parseInt(userId);
      this.userDefineService.getUserDefineByProfile(profileID).subscribe(response => {
        this.userDefineFieldsList = response.data;
        this.userDefineFields = [{ UDV_Name: 'Default' }, ...response.data];
      });
    } else {
      // Inicializa solo con "Default" si no hay userId
      this.userDefineFields = [{ UDV_Name: 'Default' }];
    }
  }

  getFieldNames(culumnId: number) {
    this.userDefineService.getUserDefineColumns(culumnId).subscribe(response => {
      this.dynamicFields = response.data.map((field: { COLUMN_NAME: any; }) => field.COLUMN_NAME);

      console.log(this.dynamicFields);
      this.dynamicFields.forEach(field => {
        this.fieldVisibility[field] = true;
      });

      // Aquí podrías agregar lógica para actualizar el `datasource` si es necesario.
    });
  }


  onViewChange(view: string,  idView: number) {
    this.selectedView = view;

    console.log('Selected View:', this.selectedView);

    if (this.selectedView === 'Default') {
      // Handle the default view where only specific fields are shown
      this.dynamicFields.forEach(field => {
        this.fieldVisibility[field] = false;
      });
    } else {
      this.getFieldNames(idView)
    }
  }

  formatDatesInObject(obj: any): any {
    const formattedObject: any = {};

    Object.keys(obj).forEach(key => {
      const value = obj[key];

      if (this.isValidDate(value)) {
        formattedObject[key] = this.formatDate(value);
      } else {
        formattedObject[key] = value;
      }
    });

    return formattedObject;
  }

  isValidDate(dateString: string): boolean {
    if(dateString === undefined || dateString === null) return false;
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric'
    });
  }

  closeModalViews(){
    // exampleModalNewViews
    $('#exampleModalNewViews').modal('hide');
  }

  deleteUDV(id: number) {
    if(confirm('¿Está seguro que desea eliminar este campo?')) {
      this.userDefineService.deleteUDV(id).subscribe(response => {
        this.getAllFields();
        this.getUserDefineField();
      });
    }
  }



}

