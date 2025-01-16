import { Component, OnInit, ViewChild} from "@angular/core";
import { MatPaginator } from '@angular/material/paginator';
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ProspectService } from "src/app/core/services/prospect/prospect.service";
import { IsChangeTableService } from "../../services/ejecutor.service";
import { MatSnackBar, } from "@angular/material/snack-bar";
import { SearchService } from "src/app/core/services/search/search.service";
import { UserDefineService } from "src/app/core/services/userDefine/userDefine.service";
import Swal from 'sweetalert2';
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
  sortField: string = '';
  sortDirection: 'asc' | 'desc' = 'asc';

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
    this.searchService.getSearchParams().subscribe({
      next: (response) => {
        if (response && response.data) {
          this.columns = response.data.map((element: any) => element.COLUMN_NAME);
          this.updateAvailableColumns();
        } else {
          console.error('La respuesta no tiene el formato esperado:', response);
          this.columns = [];
        }
      },
      error: (error) => {
        console.error('Error al obtener los parámetros:', error);
        this.columns = [];
        // Opcional: Mostrar mensaje de error al usuario
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudieron cargar los parámetros de búsqueda'
        });
      }
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
    const profileID = parseInt(localStorage.getItem('userId')!);
    const udvName = this.udvName;
    const selectedColumnIDs = this.getSelectedValues();

    if(selectedColumnIDs.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please select at least one column for the view'
      });
      return;
    }

    if(udvName === ''){
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please enter a name for the view'
      });
      return;
    }

    this.userDefineService.createUserDefinedView(profileID, udvName, selectedColumnIDs).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'The view has been created successfully'
        });
        this.getAllData(1);
        this.udvName = '';
        this.dynamicForm.reset();
        this.selectedField = 'Default';
        this.getUserDefineField();
        this.getAllFields();
        this.closeModalViews();
      },
      error: (error) => {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'There was an error creating the view. Please try again.'
        });
      }
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
      this.userDefineService.getUserDefineByProfile(profileID).subscribe({
        next: (response) => {
          if (response && response.data) {
            this.userDefineFieldsList = response.data;
            this.userDefineFields = [{ UDV_Name: 'Default' }, ...response.data];
          } else {
            console.error('La respuesta no tiene el formato esperado:', response);
            this.initializeDefaultFields();
          }
        },
        error: (error) => {
          console.error('Error al obtener los campos definidos por el usuario:', error);
          this.initializeDefaultFields();
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'No se pudieron cargar las vistas personalizadas'
          });
        }
      });
    } else {
      this.initializeDefaultFields();
    }
  }

  private initializeDefaultFields() {
    this.userDefineFieldsList = [];
    this.userDefineFields = [{ UDV_Name: 'Default' }];
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


  onViewChange(view: string, idView: number) {
    this.selectedView = view;
    this.selectedField = view;

    if (this.selectedView === 'Default') {
      // Limpiar campos dinámicos cuando se selecciona la vista Default
      this.dynamicFields = [];
      this.dynamicFields.forEach(field => {
        this.fieldVisibility[field] = false;
      });
    } else {
      // Obtener las columnas para la vista seleccionada
      this.userDefineService.getUserDefineColumns(idView).subscribe({
        next: (response) => {
          this.dynamicFields = response.data.map((field: { COLUMN_NAME: any; }) => field.COLUMN_NAME);
          console.log('Dynamic Fields:', this.dynamicFields);

          // Actualizar la visibilidad de los campos
          this.dynamicFields.forEach(field => {
            this.fieldVisibility[field] = true;
          });
        },
        error: (error) => {
          console.error('Error loading columns:', error);
          // Opcional: Mostrar mensaje de error al usuario
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Error loading view columns. Please try again.'
          });
        }
      });
    }

    // Recargar los datos de la tabla
    this.getAllData(1);
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

  deleteUDV(id: number, viewName: string) {
    Swal.fire({
      title: 'Are you sure?',
      text: `You are about to delete the view "${viewName}"`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.userDefineService.deleteUDV(id).subscribe({
          next: () => {
            Swal.fire(
              'Deleted!',
              'The view has been deleted successfully.',
              'success'
            );
            this.selectedField = 'Default';
            this.selectedView = 'Default';
            this.dynamicFields.forEach(field => {
              this.fieldVisibility[field] = false;
            });
            this.getUserDefineField();
            this.getAllData(1);
          },
          error: () => {
            Swal.fire(
              'Error!',
              'There was an error deleting the view.',
              'error'
            );
          }
        });
      }
    });
  }

  resetFilters(): void {
    this.searchForm.reset();
    this.searchFields.clear();
    this.addSearchField();
    this.getAllData(1);
  }

  sortColumn(field: string) {
    // Si el campo es el mismo, cambiamos la dirección
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Si es un nuevo campo, establecemos el campo y dirección por defecto
      this.sortField = field;
      this.sortDirection = 'asc';
    }

    // Ordenar el datasource
    this.datasource.sort((a, b) => {
      const valueA = this.getFieldValue(a, field);
      const valueB = this.getFieldValue(b, field);

      if (valueA === valueB) return 0;

      const comparison = valueA < valueB ? -1 : 1;
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  getFieldValue(item: any, field: string): any {
    // Manejar valores nulos o indefinidos
    const value = item[field];
    if (value === null || value === undefined) return '';

    // Si es una fecha, convertirla a timestamp para comparación
    if (this.isValidDate(value)) {
      return new Date(value).getTime();
    }

    // Si es un número como string, convertirlo a número
    if (!isNaN(value) && !isNaN(parseFloat(value))) {
      return parseFloat(value);
    }

    // Para strings, convertir a minúsculas para comparación insensible a mayúsculas
    if (typeof value === 'string') {
      return value.toLowerCase();
    }

    return value;
  }



}

