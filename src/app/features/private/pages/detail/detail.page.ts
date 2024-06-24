import {Component, OnInit} from "@angular/core";
// import * as Chart from 'chart.js';

// import { TitleService } from "../../services/title.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { EmailService } from "src/app/core/services/email/email.service";
import { PhoneService } from "src/app/core/services/phone/phone.service";
import { ActivatedRoute } from "@angular/router";
import { ProspectService } from "src/app/core/services/prospect/prospect.service";
import { AddrressService } from "src/app/core/services/address/address.service";
import { Address, Email, Phone } from "src/app/core/services/prospect/models";
declare var $: any;
import Swal from 'sweetalert2';
import { formatDate } from "@angular/common";
import { MatSnackBar } from "@angular/material/snack-bar";
import { DoctorService } from "src/app/core/services/doctor/doctor.service";
import { DataImportance, DataSpecialty, DataStatus, DoctorData, DoctorImportanceModel, DoctorSpecialtyModel, DoctorStatusModel, ProviderModel, Result } from "src/app/core/services/doctor/model";
import { RxService } from "src/app/core/services/rx/rx.service";
import { ConceptProperty, DrugFrequencyData, NdcProperty, PackagingList, PrescriptionsData, } from "src/app/core/services/rx/models";
import { DataLoaderService } from "src/app/core/services/dataloader.service";
import { forkJoin } from "rxjs";
import { ProfileService } from "src/app/core/services/profile/profile.service";
import { ProfileStateData } from "src/app/core/services/profile";

interface EmailTypeModel{
  EmailTypeID: number,
  EmailTypeValue: string
};

interface PhoneTypeModel{
  PhoneTypeID: number,
  PhoneTypeValue: string
};

interface AddressTypeModel{
  AddressTypeID: number,
  AddressTypeValue: string,
}

@Component({
  selector: 'app-detail-page',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})


export class DetailPage implements OnInit{

  title = 'Prospect Detail';
  buttonActive:string[] = ['Prospect',];
  contactForm!: FormGroup;
  emailForm!: FormGroup;
  phoneForm!: FormGroup;
  doctorForm!: FormGroup;
  addressForm!: FormGroup;
  medicationForm!: FormGroup;
  emailType: EmailTypeModel[] = [];
  phoneType: PhoneTypeModel[] = [];
  addressType:AddressTypeModel[] = [];
  contactID!: number;
  buttonUpdateForContact:string = 'Update';
  phoneList:Phone[]=[];
  emailList:Email[]=[];
  addressList:Address[]=[];
  gender:any[]=[];
  suffixes:any[]=[];
  titles:any[]=[];
  statuses:any[]=[];
  maritalStatus:any[]=[];
  pLanguage:any[]=[];
  sources:any[]=[];
  specialD:any[]=[];
  isLoading:boolean = false;
  buttonUpdateContactEnabled:boolean = false;
  submittedEmail = false;
  submittedPhone = false;
  submittedAddress = false;
  isLoadingEmail:boolean = false;
  isLoadingPhone:boolean = false;
  isLoadingAddress:boolean = false;
  doctorList:Result[]=[];
  doctorLastName:string = "";
  doctorFirstName:string = "";
  doctorTaxonomy:string = "";
  doctorZipCode:string = "";
  doctorSelected:boolean = false;
  doctorDataSelected!:Result;
  doctorLastNameMessage:string ='Last name is required';
  doctorLastNameIsRequired!:boolean;
  rxName!:string;
  rxResult: ConceptProperty[] | undefined;

  rxPackage:PackagingList[] = [];

  rxDosageValue!:string;

  isLoadingDosage:boolean = false;
  emailIdUpdate:number = 0;
  phoneIdUpdate:number = 0;
  addressIdUpdate:number = 0;
  doctorData:DoctorData[] = [];
  doctorStatus:DataStatus[] = [];
  doctorImportance:DataImportance[]=[];
  doctorSpecialty:DataSpecialty[] = [];
  drugFrequency:DrugFrequencyData[] = [];
  prescriptionsList:PrescriptionsData[] = [];
  addDoctorManual:boolean = false;
  isLoadingDoctor:boolean = false;
  submittedDoctor:boolean = false;
  stateList:ProfileStateData[]=[];



  // Nuevas variables


  // dataForProspect: any;
  // phoneByProspect: any;
  // genders: any;
  // status: any;
  // mStatus: any;
  // emailByProspect: any;
  // rxByName: any;
  // doctorsByContactId: any;



  constructor(
    // private titleService: TitleService,
    private formBuilder: FormBuilder,
    private emailService: EmailService,
    private phoneService: PhoneService,
    private route: ActivatedRoute,
    private prospectService:ProspectService,
    private addressService:AddrressService,
    private doctorService:DoctorService,
    private rxService: RxService,
    private dataLoaderService: DataLoaderService,
    private profileService:ProfileService,

  ) {
    // this.mask = ['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/];
    this.contactID =  parseInt( this.route.snapshot.paramMap.get('id')!);
    this.contactForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      midleName: ['', Validators.required],
      gender: ['', Validators.required],
      suffix: ['', Validators.required],
      title: ['', Validators.required],
      dob: ['', Validators.required],
      spouse: ['', Validators.required],
      maritalStatus: ['', Validators.required],
      preferredLanguage: ['', Validators.required],
      specialDesignation: ['', Validators.required],
      ocupation: ['', Validators.required],
      residentStatus: ['', Validators.required],
      status: ['', Validators.required],
      source: ['', Validators.required],
      referredBy: ['', Validators.required],
      email: ['',],
      phone: ['',],
      address: ['',],
    });

    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
    // const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))

    this.createFormEmail();
    this.createFormPhone();
    this.createFormDoctor();
    this.createFormAddress();
    this.createFormDrugs();
  }

  createFormAddress(){
    this.addressForm = this.formBuilder.group({
      ContactID: [this.contactID],
      AddressTypeID: ['', Validators.required],
      Street:['', Validators.required],
      City:['', Validators.required],
      Zip:['', Validators.required],
      StateID:['', Validators.required],
      Country:['USA', Validators.required],
      IsPreferredAddress:[false, Validators.required]
    });
  }

  createFormEmail(){
    this.emailForm = this.formBuilder.group({
      ContactID: [this.contactID],
      EmailTypeID: ['', Validators.required],
      EmailAddressValue:['', [Validators.required, Validators.email]],
      IsPreferredEmail:[false,]
    });
  }

  createFormPhone(){
    this.phoneForm = this.formBuilder.group({
      ContactID: [this.contactID],
      PhoneTypeID: ['', Validators.required],
      PhoneNumber:['', [Validators.required, Validators.pattern(/^\(\d{3}\) \d{3}-\d{4}$/)]],
      IsPreferredPhone:[false,]
    });
  }

  createFormDoctor(){
    this.doctorForm = this.formBuilder.group({
      ContactID: [this.contactID],
      FirstName: ['', Validators.required],
      LastName:['', Validators.required],
      ProviderPhone:['',Validators.required],
      ProviderSpecialtyAPI:['',],
      FacilityAddress:['', Validators.required],
      ProviderNPI:['', Validators.required],
      Notes:['',],
      Networks:['',],
      ProviderSpecialtyID:[null],
      ProviderImportanceID:['', Validators.required],
      ProviderStatusID:['', Validators.required],
      PracticeFacilityName:['',],
      Source:[this.addDoctorManual]
    });
  }


  createFormDrugs(){
    this.medicationForm = this.formBuilder.group({
      DrugName: ['', Validators.required],
      Dosage: ['', Validators.required],
      Package: ['', Validators.required],
      Quantity: ['', Validators.required],
      FrequencyID: ['', Validators.required],
      Note: [''],
      ContactID: [this.contactID]
    });
  }

  ngOnInit(): void {
    // this.titleService.changeTitle(this.title);//
    this.getEmailType();
    this.getPhoneType();
    this.getAddressType();
    this.getDataForProspect();
    this.getPhoneByProspect();
    this.getGenders();
    this.getSuffixes();
    this.getTitles();
    this.getStatus();
    this.getSources()
    this.getPLanguage();
    this.getMStatus();
    this.getSpecialD();
    this.getEmailByProspect();
    this.contactForm.disable();
    this.getDoctorsByContactId();
    this.getDoctorStatus();
    this.getDoctorImportance();
    this.getDoctorSpecialty();
    this.getAddressByProspect();
    this.getState();
    this.getDrugFrequency();
    this.getDrugList();
   }

  addOrRemoveTabs(butomName: string){
    const index = this.buttonActive.indexOf(butomName);
    if (index !== -1) {
        this.buttonActive.splice(index, 1);
    } else {
        this.buttonActive.push(butomName);
    }
  }

  isInvalidAndTouched(controlName: string): boolean {
    const control = this.phoneForm.get(controlName);
    const pattern = /^\(\d{3}\) \d{3}-\d{4}$/; // Expresión regular del patrón de número de teléfono
    return control!.invalid && (control!.touched || this.submittedPhone) && !pattern.test(control!.value);
  }

  isInvalidAndTouchedDoctor(controlName: string): boolean {
    const control = this.doctorForm.get(controlName);
    // const pattern = /^\(\d{3}\) \d{3}-\d{4}$/; // Expresión regular del patrón de número de teléfono
    return control!.invalid && (control!.touched || this.submittedDoctor);
  }

  isInvalidAndTouchedEmail(controlName: string): boolean {
    const control = this.emailForm.get(controlName);
    return control!.invalid && (control!.touched || this.submittedEmail) && control!.value === '';
  }

  isInvalidAndTouchedAddress(controlName: string): boolean {
    const control = this.addressForm.get(controlName);
    return control!.invalid && (control!.touched || this.submittedAddress) && control!.value === '';
  }

  onSubmitEmail(){
    this.submittedEmail = true;
    if(this.emailIdUpdate !=0){
      this.updateEmail();
    }else{
      if (this.emailForm.valid) {
        this.isLoadingEmail = true;
        this.emailService.saveNewEmail(this.emailForm.value).subscribe(response => {
          this.isLoadingEmail = false;
          this.emailForm.reset();
          this.createFormEmail();
          this.getEmailByProspect();
          this.getDataForProspect();
          this.submittedEmail=false;
        });
      }
    }
  }

  onSubmitAddress(){
    this.submittedAddress = true;
    if(this.addressIdUpdate !=0){
      this.updateAddress();
    }else{
      if(this.addressList.length == 0){
        this.addressForm.patchValue({
          IsPreferredAddress: true,
        });
      }
      if (this.addressForm.valid) {
        this.isLoadingAddress = true;
        this.addressService.saveNewAddress(this.addressForm.value).subscribe(response => {
          this.isLoadingAddress = false;
          this.addressForm.reset();
          this.createFormAddress();
          this.getAddressByProspect();
          this.getDataForProspect();
          this.submittedAddress=false;
        });
      }
    }
  }

  onSubmiteDoctor(){
    this.submittedDoctor = true;
    if (this.doctorForm.valid) {
      this.isLoadingDoctor = true;
      this.doctorService.saveNewDoctor(this.doctorForm.value).subscribe(response => {
        this.isLoadingDoctor = false;
        this.doctorForm.reset();
        this.createFormDoctor();
        this.addDoctorManual = false;
        this.getDoctorsByContactId();
        this.doctorSelected = false;
        this.doctorList = [];
        this.doctorLastName = '';
        this.submittedDoctor = false;
      });
    }

  }

  onSubmitPhone(){
    this.submittedPhone = true;
    if(this.phoneIdUpdate !=0){
      this.updatePhone();
    }else{
      if (this.phoneForm.valid) {
        this.isLoadingPhone = true;
        this.phoneService.saveNewPhone(this.phoneForm.value).subscribe(response => {
        this.isLoadingPhone = false;
          this.phoneForm.reset();
          this.createFormPhone();
          this.getPhoneByProspect();
          this.getDataForProspect();
          this.submittedPhone = false;
        });
      }
    }

  }

  closeModalPhone(){
    this.phoneForm.reset();
    this.submittedPhone = false;
    this.createFormPhone();
    $('#exampleModalPhone').modal('hide');
  }

  cancelEditPhone(){
    this.phoneForm.reset();
    this.submittedPhone = false;
    this.createFormPhone();
    this.phoneIdUpdate = 0;
  }

  closeModalEmail(){
    this.emailForm.reset();
    this.submittedEmail = false;
    this.emailIdUpdate = 0;
    this.createFormEmail();
    $('#exampleModal').modal('hide');
  }

  closeModalAddress(){
    this.addressForm.reset();
    this.submittedAddress = false;
    this.addressIdUpdate = 0;
    this.createFormAddress();
    $('#exampleModalAddress').modal('hide');
  }

  cancelEditEmail(){
    this.emailForm.reset();
    this.submittedEmail = false;
    this.emailIdUpdate = 0;
    this.createFormEmail();
  }

  cancelEditAddress(){
    this.addressForm.reset();
    this.submittedAddress = false;
    this.addressIdUpdate = 0;
    this.createFormAddress();
  }

  closeModalDoctor(){
    this.doctorSelected = false;
    this.addDoctorManual = false;
    this.doctorForm.reset();
    this.createFormDoctor();
    this.doctorList = [];
    this.doctorLastName = '';
    $('#exampleModalDoctor').modal('hide');
  }

  closeModalRx(){
    $('#exampleModalRx').modal('hide');
  }


  isInvalid(controlName: string): boolean {
    const control = this.phoneForm.get(controlName);
    return control!.invalid;
  }

  showAlertForInvalidFields() {
    let errorMessage = '';

    if (this.isInvalid('PhoneTypeID')) {
      errorMessage += 'Phone Type is required\n';
    }

    if (this.isInvalid('PhoneNumber')) {
      errorMessage += 'Invalid Phone Number\n';
    }

    Swal.fire({
      title: "error!",
      text: errorMessage,
      icon: "error",
    });
  }

  isInvalidEmail(controlName: string): boolean {
    const control = this.emailForm.get(controlName);
    return control!.invalid;
  }

  isInvalidAddress(controlName: string): boolean {
    const control = this.addressForm.get(controlName);
    return control!.invalid;
  }

  showAlertForInvalidFieldsEmail() {
    let errorMessage = '';

    if (this.isInvalid('EmailTypeID')) {
      errorMessage += 'Email Type is required\n';
    }

    if (this.isInvalid('EmailAddressValue')) {
      errorMessage += 'Invalid Email Address\n';
    }

    Swal.fire({
      title: "error!",
      text: errorMessage,
      icon: "error",
    });
  }

  deletePhone(id:number){
    this.phoneService.deletePhone(id).subscribe(response =>{
      this.getPhoneByProspect();
    });
  }

  deleteAddress(id:number){
    this.addressService.deleteAddress(id).subscribe(response =>{
      this.getAddressByProspect();
    });
  }

  deleteEmail(id:number){
    this.emailService.deleteEmail(id).subscribe(response =>{
      this.getEmailByProspect();
    });
  }



  getEmailType(){
    this.emailService.getEmailType().subscribe(response => {
      this.emailType = response.data;
    });
  }

  getPhoneType(){
    this.phoneService.getPhoneType().subscribe(response => {
      this.phoneType = response.data;
    });
  }

  getAddressType(){
    this.addressService.getAddressType().subscribe(response => {
      this.addressType = response.data;
    });
  }

  getGenders(){
    this.prospectService.getGender().subscribe(response => {
      this.gender = response.data;
    });
  }

  getSuffixes(){
    this.prospectService.getSuffix().subscribe(response => {
      this.suffixes = response.data;
    });
  }

  getTitles(){
    this.prospectService.getTitle().subscribe(response => {
      this.titles = response.data;
    });
  }

  getStatus(){
    this.prospectService.getStatus().subscribe(response => {
      this.statuses = response.data;
    });
  }

  getSources(){
    this.prospectService.getSources().subscribe(response => {
      this.sources = response.data;
    });
  }

  getPLanguage(){
    this.prospectService.getPLanguage().subscribe(response => {
      this.pLanguage = response.data;
    });
  }

  getMStatus(){
    this.prospectService.getMaritalStatus().subscribe(response => {
      this.maritalStatus = response.data;
    });
  }

  getSpecialD(){
    this.prospectService.getSpecialDesignation().subscribe(response => {
      this.specialD = response.data;
    });
  }

  getDataForProspect(){
    this.prospectService.getProspectByID(this.contactID).subscribe(response => {
      const utcDate = new Date(response.data.DOB!);
    // Obtener componentes de la fecha y hora en UTC
    const year = utcDate.getUTCFullYear();
    const month = utcDate.getUTCMonth() + 1;
    const day = utcDate.getUTCDate();
    const hours = utcDate.getUTCHours();
    const minutes = utcDate.getUTCMinutes();
    const seconds = utcDate.getUTCSeconds();

    const dobFormatted = `${year}-${this.padZero(month)}-${this.padZero(day)}T${this.padZero(hours)}:${this.padZero(minutes)}:${this.padZero(seconds)}.000`.substring(0, 10);
      this.contactForm.patchValue({
        firstName: response.data.FirstName,
        lastName: response.data.LastName,
        midleName: response.data.MiddleName,
        gender: response.data.GenderID,
        suffix: response.data.suffixID,
        title: response.data.TitleID,
        dob:response.data.DOB !== null ? dobFormatted : '',
        spouse: response.data.SpouseFirstName,
        maritalStatus: response.data.MAritalStatusID,
        preferredLanguage: response.data.preferredLanguageID,
        specialDesignation: response.data.specialDesignationID,
        ocupation: response.data.Ocupation,
        // residentStatus: response.data.ContactStatusID,
        status: response.data.ContactStatusID,
        source: response.data.SourceID,
        referredBy: response.data.ReferredBy,
        phone: response.data.Phone[0].PhoneNumber,
        email: response.data.Email[0].emailAddress,
        address: response.data.Address[0].street,

      });
      console.log(response)
      if(response.data.Address){
        console.log("Esto esta vacioooooooo")
      }

    });
  }

  padZero(num: number): string {
    return num < 10 ? '0' + num : num.toString();
  }


  enableForm(formName:string){
    switch(formName){
      case 'contact':
        if(this.contactForm.enabled){
          this.contactForm.disable();
          this.buttonUpdateForContact = 'Update';
          this.buttonUpdateContactEnabled = false;
          this.isLoading = false;
          this.getDataForProspect();
        }else{
          this.contactForm.enable();
          this.buttonUpdateForContact = 'Cancel';
          this.contactForm.get('email')!.disable();
          this.contactForm.get('phone')!.disable();
          this.contactForm.get('address')!.disable();
          this.buttonUpdateContactEnabled = true;

        }
    }
  }

  getPhoneByProspect(){
    this.prospectService.getPhonesByProspect(this.contactID).subscribe(response =>{
      this.phoneList = response.data;
    });
  }

  getEmailByProspect(){
    this.prospectService.getEmailByProspect(this.contactID).subscribe(response =>{
      console.log(response);
      this.emailList = response.data;
    });
  }

  getAddressByProspect(){
    this.prospectService.getAddressByProspect(this.contactID).subscribe(response =>{
      this.addressList = response.data;
    });
  }

  saveData(){
    if(!this.contactForm.valid){
      this.isLoading = true;
      const formData = { ...this.contactForm.value };
      delete formData.email;
      delete formData.phone;
      delete formData.address;
      console.log(formData);
      console.log(this.contactID);
      this.prospectService.updateProspect(formData, this.contactID).subscribe(response =>{
        this.isLoading = false;
        this.buttonUpdateContactEnabled = false;
        this.buttonUpdateForContact = 'Update';

        Swal.fire({
          title: "Good job!",
          text: "Contact updated successfully.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
        this.contactForm.disable();
        this.getDataForProspect();
      });
    }
  }

  getDoctorsByLastName(){
    if(this.doctorLastName){
      this.doctorService.getDoctorByLastName(this.doctorLastName, this.doctorZipCode, this.doctorFirstName, this.doctorTaxonomy).subscribe(response =>{
        this.doctorList = response.results;
      });
    }else{
      this.doctorLastNameIsRequired = true;
    }
  }

  onChangeDoctorLastName(value:any){
    if(value.length <=0){
      this.doctorLastNameIsRequired = true;
    }else{
      this.doctorLastNameIsRequired = false;

    }

  }

  loadDoctorSelected(doctor:Result){
    this.doctorSelected = true;
    this.doctorDataSelected = doctor;
    this.doctorForm.patchValue({
      FirstName: doctor.basic.first_name,
      LastName:doctor.basic.last_name,
      ProviderPhone:doctor.addresses[0].telephone_number,
      ProviderSpecialtyAPI:doctor.taxonomies[0].desc,
      FacilityAddress:doctor.addresses[0].address_1,
      ProviderNPI:doctor.number,
    });
  }

  getRxByName(){
    if(this.rxName){
      this.isLoadingDosage = true;
      this.rxService.getRxByName(this.rxName).subscribe(response =>{
        this.isLoadingDosage = false;
        this.rxResult = response.drugGroup.conceptGroup[1].conceptProperties || [];
      });
    }
  }

  getRxByCui(){
    if(this.rxDosageValue){
      this.rxService.getPackageByRxcui(this.rxDosageValue).subscribe(response =>{

        this.rxPackage = [];
      // Iterar sobre cada elemento en ndcProperty
      response.ndcPropertyList.ndcProperty.forEach(item => {
       if(item.packagingList){

         this.rxPackage.push(item.packagingList);
       }
      });
      });
    }
  }

  loadDataForEditEmail(email:Email){
    this.emailIdUpdate = email.EmailID;
    this.emailForm.patchValue({
      EmailTypeID: email.EmailTypeID,
      EmailAddressValue:email.EmailAddressValue,
    });
  }

  loadDataForEditPhone(phone:Phone){
    this.phoneIdUpdate = phone.PhoneID;
    this.phoneForm.patchValue({
      PhoneTypeID: phone.PhoneTypeID,
      PhoneNumber:phone.PhoneNumber,
    });
  }

  loadDataForEditAddress(address:Address){
    this.addressIdUpdate = address.ContactAddressID;
    this.addressForm.patchValue({
      AddressTypeID: address.AddressTypeID,
      Street:address.Street,
      City:address.City,
      StateID:address.stateID,
      Country:address.Country,
      Zip:address.Zip,
    });
  }

  updateEmail(){
    this.emailService.updateEmail(this.emailIdUpdate, this.emailForm.value).subscribe(response => {
      this.isLoadingEmail = false;
      this.emailForm.reset();
      this.createFormEmail();
      this.getEmailByProspect();
      this.submittedEmail=false;
      this.emailIdUpdate = 0;
    });
  }

  updatePhone(){
    this.phoneService.updatePhone(this.phoneIdUpdate, this.phoneForm.value).subscribe(response => {
      this.isLoadingPhone = false;
      this.phoneForm.reset();
      this.createFormPhone();
      this.getPhoneByProspect();
      this.submittedPhone=false;
      this.phoneIdUpdate = 0;
    });
  }

  updateAddress(){
    this.addressService.updateAddress(this.addressIdUpdate, this.addressForm.value).subscribe(response => {
      this.isLoadingAddress = false;
      this.addressForm.reset();
      this.createFormAddress();
      this.getAddressByProspect();
      this.submittedAddress=false;
      this.addressIdUpdate = 0;
    });
  }

  getDoctorsByContactId(){
    this.doctorService.getDoctorByContactID(this.contactID).subscribe(response => {
      this.doctorData = response.data;
    })
  }


  getDoctorStatus(){
    this.doctorService.getDoctorStatus().subscribe(response => {
      this.doctorStatus = response.data;
    });
  }

  getState(){
    this.profileService.getProfileState().subscribe(response => {
      this.stateList = response.data;
    });
  }

  getDoctorImportance(){
    this.doctorService.getDoctorImportance().subscribe(response => {
      this.doctorImportance = response.data;
    });
  }

  getDoctorSpecialty(){
    this.doctorService.getDoctorSpecialty().subscribe(response => {
      this.doctorSpecialty = response.data;
    });
  }

  getDrugFrequency(){
    this.rxService.getDrugsFrecuency().subscribe(response => {
      this.drugFrequency = response.data;
    });
  }

  getDrugList(){
    this.rxService.getPrescriptionDrugsById(this.contactID).subscribe(response => {
      this.prescriptionsList = response.data;
    });
  }

  changeDoctorToManually(){
    this.addDoctorManual = !this.addDoctorManual;
    this.doctorForm.reset();
    this.doctorSelected = false;
    this.createFormDoctor();
    this.doctorList = [];
    this.doctorLastName = '';
    this.submittedDoctor = false;

  }

  deleteDoctor(doctorID:number){
    this.doctorService.deleteProvider(doctorID).subscribe(response =>{
      this.getDoctorsByContactId();
    });
  }

  onSubmitDrug(){
    console.log(this.medicationForm.value);
    this.rxService.saveDrugs(this.medicationForm.value).subscribe(response =>{
      this.medicationForm.reset();
      this.getDrugList();
      this.closeModalRx();
      this.createFormDrugs();



      // this.submittedMedication = false;
    });

  }



}
