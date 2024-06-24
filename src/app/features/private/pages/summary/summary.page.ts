import { Component, OnInit, ViewChild} from "@angular/core";
import { MatPaginator } from '@angular/material/paginator';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ProspectService } from "src/app/core/services/prospect/prospect.service";
import { IsChangeTableService } from "../../services/ejecutor.service";
import { MatSnackBar, } from "@angular/material/snack-bar";
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
  datasource:any = [];
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

  totalItems = 0;
  pageSize = 10;
  currentPage = 1;
  maxPagesToShow = 5;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
Math: any;


  constructor(
    private formBuilder: FormBuilder,
    private prospectService: ProspectService,
    private isChangeTableService:IsChangeTableService,
    private _snackBar: MatSnackBar
  ) {
    this.buildForm();
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
  }

   // events


  getAllData(page: number){
    this.prospectService.getFormData(page, this.pageSize).subscribe(response => {
      this.datasource = response.data;
      this.totalItems = response.pagination.total;
      this.currentPage = page;
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

  getFieldNames(): string[] {
    return Object.keys(this.fieldVisibility);
  }

  deleteContact(contactId:number){
    this.prospectService.deleteContact(contactId).subscribe(response => {
      this.getAllData(this.currentPage);
    });
  }




}
