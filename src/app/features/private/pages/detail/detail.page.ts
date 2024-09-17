import {Component, OnInit} from "@angular/core";
// import * as Chart from 'chart.js';

// import { TitleService } from "../../services/title.service";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
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
import { ConceptProperty, DrugFrequencyData, HealthInfoData, NdcProperty, PackagingList, PrescriptionsData, } from "src/app/core/services/rx/models";
import { DataLoaderService } from "src/app/core/services/dataloader.service";
import { forkJoin } from "rxjs";
import { ProfileService } from "src/app/core/services/profile/profile.service";
import { ProfileStateData } from "src/app/core/services/profile";
import { PersonalService } from "src/app/core/services/personal/personal.service";
import { SocialData } from '../../../../core/services/personal/social';
import { MedicareData } from "src/app/core/services/personal/Medicare";
import { SPapModelData } from "src/app/core/services/personal/Spap";
import { PDVAModelData } from "src/app/core/services/personal/Va";
import { PDVaultModelData } from "src/app/core/services/personal/Vault";
import { PDAssistenceLevelModelData } from "src/app/core/services/personal/AssistenceLevel";
import { PDMedicaidModelData } from "src/app/core/services/personal/Medicaid";

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
  healthTrackerForm!: FormGroup;
  personalDetailSocialForm!: FormGroup;
  personalDetailMedicareForm!: FormGroup;
  personalDetailSpapForm!: FormGroup;
  personalDetailVAForm!: FormGroup;
  personalDetailVaultForm!: FormGroup;
  medicaidForm!: FormGroup;
  emailType: EmailTypeModel[] = [];
  phoneType: PhoneTypeModel[] = [];
  addressType:AddressTypeModel[] = [];
  contactID!: number;
  buttonUpdateForContact:string = 'Update';
  phoneList:Phone[]=[];
  emailList:Email[]=[];
  addressList:Address[]=[];
  assistenceLevelList:PDAssistenceLevelModelData[] = [];
  socialList!:SocialData;
  medicareList!:MedicareData;
  spapList!:SPapModelData;
  pdvaList!:PDVAModelData;
  pdVaultList!:PDVaultModelData;
  pdMedicaidList!:PDMedicaidModelData;
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
  submittedRx = false;
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

  enabledHealthInfo:boolean = true;
  enabledHealthTracker:boolean = false;
  enabledHealthTrackerHasData:boolean = false;
  policySelected:string = '';



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
    private personalService:PersonalService,

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
    this.createHealthTrackerForm();
    this.createSocialForm();
    this.createMedicareForm();
    this.createSpapForm();
    this.createVAForm();
    this.createVaultForm();
    this.createMedicaidForm();
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
    this.getHeightInfo();
    this.getHealthTracker();
    this.healthTrackerForm.disable();
    this.getSocialById();
    this.getMedicareById();
    this.getSpapById();
    this.getVAById();
    this.getVaultById();
    this.getAllAssistenceLevels();
    this.getMedicaidById();
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

  isInvalidAndTouchedRX(controlName: string): boolean {
    const control = this.medicationForm.get(controlName);
    return control!.invalid && (control!.touched || this.submittedRx) && control!.value === '';
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

  isInvalidRx(controlName: string): boolean {
    const control = this.medicationForm.get(controlName);
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
        maritalStatus: response.data.MaritalStatusID,
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
    this.rxResult = [];
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
    if(this.getFilteredEmailTypes().length === 0){

      this.emailForm.get('EmailTypeID')!.disable();
    }
  }

  loadDataForEditPhone(phone:Phone){
    this.phoneIdUpdate = phone.PhoneID;
    this.phoneForm.patchValue({
      PhoneTypeID: phone.PhoneTypeID,
      PhoneNumber:phone.PhoneNumber,
    });
    if(this.getFilteredPhoneTypes().length === 0){
      this.phoneForm.get('PhoneTypeID')!.disable();
    }
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
    if(this.getFilteredAddressTypes().length === 0){
      this.addressForm.get('AddressTypeID')!.disable();
    }
  }

  updateEmail(){
    // this.filteredEmailTypes = this.getFilteredEmailTypes(email);
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
      console.log("Status", response);
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
    this.submittedRx = true;
    if(this.medicationForm.valid){
      this.rxService.saveDrugs(this.medicationForm.value).subscribe(response =>{
        this.medicationForm.reset();
        this.getDrugList();
        this.closeModalRx();
        this.createFormDrugs();
        this.submittedRx = false;
      });
    }
  }

  heightFeetValue:string = '';
  heightValue:string = '';
  weightValue:string = '';
  healthNotes:string = '';
  dnrValue:boolean = false;
  isForUpdateHealthInfo:boolean = false;

  enableFormHealthInfo(){
    this.enabledHealthInfo = false;
  }

  cancelFormHealthInfo(){
    this.enabledHealthInfo = true;
    this.healthNotes = '';
    this.dnrValue = false;
    this.weightValue = '';
    this.heightValue = '';
    this.heightFeetValue = '';
    this.getHeightInfo();
  }

  getHeightInfo(){
    this.rxService.getHealthInfoById(this.contactID).subscribe(response =>{
      console.log(response.data);
      this.heightFeetValue = response.data.HealthFeet.toString();
      this.heightValue = response.data.HealthInches.toString();
      this.weightValue = response.data.HealthWeight.toString();
      this.healthNotes = response.data.HealthNotes;
      this.dnrValue = response.data.HealthDNR;

      if(response.data != null){
        this.isForUpdateHealthInfo = true;
      }
    });
  }

  saveHeightInfo(){
    var data:HealthInfoData = {
     ContactID: this.contactID,
      HealthInches: parseInt(this.heightValue),
      HealthFeet: parseInt(this.heightFeetValue),
      HealthWeight: parseInt(this.weightValue),
      HealthNotes: this.healthNotes,
      HealthDNR: this.dnrValue,
    }

    if(this.isForUpdateHealthInfo){
      this.rxService.updateHealthInfo(this.contactID, data).subscribe(response =>{
        this.enabledHealthInfo = true;
        this.getHeightInfo();
      });
    }else{
      this.rxService.saveHealthInfo(data).subscribe(response =>{
        this.enabledHealthInfo = true;
        this.getHeightInfo();
      });
    }
  }

  createHealthTrackerForm(){
    this.healthTrackerForm = this.formBuilder.group({
      AFIB: [false],
      Blind: [false],
      COPD: [false],
      Cancer: [false],
      CrohnsDisease: [false],
      DementiaAlzheimers: [false],
      DisabledSSDI: [false],
      HIVAIDS: [false],
      HeavyRxUser: [false],
      LimitedMobility: [false],
      NonVerbal: [false],
      Pacemaker: [false],
      RheumatoidArthritis: [false],
      StatinGrant: [false],
      SystemicLupus: [false],
      VA: [false],
      AnnualRxReview: [false],
      CHF: [false],
      CPAP: [false],
      CardiovascularDisease: [false],
      Deaf: [false],
      Diabetes: [false],
      ESRD: [false],
      HeartAttack: [false],
      InsulinDependent: [false],
      MentalHealth: [false],
      Oxygen: [false],
      Parkinsons: [false],
      Scleroderma: [false],
      Stroke: [false],
      TriCare: [false],
      Wheelchair: [false],

    });
  }



  getHealthTracker(){
    this.rxService.getHealthTrackerById(this.contactID).subscribe(response =>{
      if(response.data != null){
       this.enabledHealthTrackerHasData = true;
       this.healthTrackerForm.patchValue(response.data);
      }else{
        this.enabledHealthTrackerHasData = false;
      }
    });
  }

  enabledHealTrackerFn(){
    if(this.healthTrackerForm.enabled){
      this.healthTrackerForm.disable();
      this.enabledHealthTracker = false;

    }else{
      this.enabledHealthTracker = true;
      this.healthTrackerForm.enable();
    }
   }

  saveHealthTracker(){
    this.healthTrackerForm.addControl('ContactID', new FormControl());
    this.healthTrackerForm.patchValue({
      ContactID: this.contactID,
    });
    if(this.enabledHealthTrackerHasData){
      console.log('Modo edicion');
      this.rxService.updateHealthTracker(this.contactID,this.healthTrackerForm.value).subscribe(response =>{
        console.log(response);
        console.log(this.healthTrackerForm.value);
        this.healthTrackerForm.reset();
        this.createHealthTrackerForm();
        this.getHealthTracker();
        this.enabledHealthTracker = false;
        this.healthTrackerForm.disable();
      });
    }else{
      console.log('Modo creacion');

      this.rxService.saveHealthTracker(this.healthTrackerForm.value).subscribe(response =>{
        console.log(response);
        console.log(this.healthTrackerForm.value);
        this.getHealthTracker();
        this.enabledHealthTracker = false;
        this.healthTrackerForm.disable();
      });
    }
  }

  getFilteredEmailTypes(emailTypeIdBeingEdited?: number) {
    const usedEmailTypeIDs = this.emailList.map(email => email.EmailTypeID);

    return this.emailType.filter(emailType => {
      // Permitir que el email que se está editando sea visible
      if (emailTypeIdBeingEdited && emailTypeIdBeingEdited === emailType.EmailTypeID) {
        return true;
      }
      // Filtrar los que ya están en uso
      return !usedEmailTypeIDs.includes(emailType.EmailTypeID);
    });
  }

  getFilteredPhoneTypes(phoneTypeIdBeingEdited?: number) {
    const usedPhoneTypeIDs = this.phoneList.map(phone => phone.PhoneTypeID);

    return this.phoneType.filter(phoneType => {
      // Permitir que el phoneType que se está editando sea visible
      if (phoneTypeIdBeingEdited && phoneTypeIdBeingEdited === phoneType.PhoneTypeID) {
        return true;
      }
      // Filtrar los que ya están en uso
      return !usedPhoneTypeIDs.includes(phoneType.PhoneTypeID);
    });
  }

  getFilteredAddressTypes(addressTypeIdBeingEdited?: number) {
    const usedAddressTypeIDs = this.addressList.map(address => address.AddressTypeID);

    return this.addressType.filter(addressType => {
      // Permitir que el addressType que se está editando sea visible
      if (addressTypeIdBeingEdited && addressTypeIdBeingEdited === addressType.AddressTypeID) {
        return true;
      }
      // Filtrar los que ya están en uso
      return !usedAddressTypeIDs.includes(addressType.AddressTypeID);
    });
  }


  createSocialForm(){
    this.personalDetailSocialForm = this.formBuilder.group({
      SSN: ['',],
      DL: ['', ],
      Household_Income: [''],
      IRMAA: [''],
      Notes: [''],
      ContactID: [this.contactID]
    });
  }

  getSocialById(){
    this.personalService.getSocialById(this.contactID).subscribe(response =>{
      this.personalDetailSocialForm.disable();
      if(response.data != null){
        this.socialList = response.data;
        this.personalDetailSocialForm.patchValue(response.data);
      }
    });
  }

  enableSocialForm(){
    this.personalDetailSocialForm.enable();
  }

  disableSocialForm(){
    this.personalDetailSocialForm.disable();
  }

  onSubmitSocial(){
    var formData = this.personalDetailSocialForm.value;
    if(formData.SSN == ''){
      formData.SSN = null;
    }
    if(formData.DL == ''){
      formData.DL = null;
    }
    if(formData.Household_Income == ''){
      formData.Household_Income = null;
    }
    if(formData.IRMAA == ''){
      formData.IRMAA = null;
    }
    if(formData.Notes == ''){
      formData.Notes = null;
    }
    console.log(formData);
    if(this.socialList == null){
      this.personalService.saveSocial(formData).subscribe(response =>{
        this.getSocialById();
        this.personalDetailSocialForm.disable();
      });
    }else{
      this.personalService.updateSocial(this.contactID, formData).subscribe(response =>{
        this.getSocialById();
        this.personalDetailSocialForm.disable();
      });
    }
  }

  createMedicareForm(){
    this.personalDetailMedicareForm = this.formBuilder.group({
      MedicareNumber: [''],
      PartAEffective: [''],
      PartBEffective: [''],
      MedicareGov_UserName: [''],
      ContactID: [this.contactID],
      MedicareGov_Password: [''],
      MedicareGov_Answer: [''],
    });
  }

  onSubmitMedicare(){
    var formData = this.personalDetailMedicareForm.value;

    if(formData.MedicareNumber == ''){
      formData.MedicareNumber = null;
    }
    if(formData.PartAEffective == ''){
      formData.PartAEffective = null;
    }
    if(formData.PartBEffective == ''){
      formData.PartBEffective = null;
    }
    if(formData.MedicareGov_UserName == ''){
      formData.MedicareGov_UserName = null;
    }
    if(formData.MedicareGov_Password == ''){
      formData.MedicareGov_Password = null;
    }
    if(formData.MedicareGov_Answer == ''){
      formData.MedicareGov_Answer = null;
    }

    if(this.medicareList == null){
      this.personalService.saveMedicare(formData).subscribe(response =>{
        this.getMedicareById();
        this.personalDetailMedicareForm.disable();
      });
    }else{
      this.personalService.updateMedicare(this.contactID, formData).subscribe(response =>{
        this.getMedicareById();
        this.personalDetailSocialForm.disable();
      });
    }
  }

  getMedicareById(){
    this.personalService.getMedicareById(this.contactID).subscribe(response =>{
      this.personalDetailMedicareForm.disable();
      if(response.data != null){
        this.medicareList = response.data;
        this.personalDetailMedicareForm.patchValue(response.data);
      }
    });
  }

  enableMedicareForm(){
    this.personalDetailMedicareForm.enable();
  }

  disableMedicareForm(){
    this.personalDetailMedicareForm.disable();
  }


  createSpapForm(){
    this.personalDetailSpapForm = this.formBuilder.group({
      SpapName: [''],
      MemberID: [''],
      GroupID: [''],
      RxBin: [''],
      Notes: [''],
      ContactID: [this.contactID],
    });
  }

  onSubmitSpap(){
    var formData = this.personalDetailSpapForm.value;
    if(formData.SpapName == ''){
      formData.SpapName = null;
    }
    if(formData.MemberID == ''){
      formData.MemberID = null;
    }
    if(formData.GroupID == ''){
      formData.GroupID = null;
    }
    if(formData.RxBin == ''){
      formData.RxBin = null;
    }
    if(formData.Notes == ''){
      formData.Notes = null;
    }


    if(this.spapList == null){
      this.personalService.saveSpap(formData).subscribe(response =>{
        this.getSpapById();
        this.personalDetailSpapForm.disable();
      });
    }else{
      this.personalService.updateSpap(this.contactID, formData).subscribe(response =>{
        this.getSpapById();
        this.personalDetailSpapForm.disable();
      });
    }
  }

  getSpapById(){
    this.personalService.getSpapById(this.contactID).subscribe(response =>{
      this.personalDetailSpapForm.disable();
      if(response.data != null){
        this.spapList = response.data;
        this.personalDetailSpapForm.patchValue(response.data);
      }
    });
  }

  enableSpapForm(){
    this.personalDetailSpapForm.enable();
  }

  disableSpapForm(){
    this.personalDetailSpapForm.disable();
  }

  createVAForm(){
    this.personalDetailVAForm = this.formBuilder.group({
      ID: [''],
      VaGroup: [''],
      Notes: [''],
      ContactID: [this.contactID],
    });
  }

  onSubmitVA(){
    var formData = this.personalDetailVAForm.value;
    if(formData.ID == ''){
      formData.ID = null;
    }
    if(formData.VaGroup == ''){
      formData.VaGroup = null;
    }
    if(formData.Notes == ''){
      formData.Notes = null;
    }

    if(this.pdvaList == null){
      this.personalService.saveVA(formData).subscribe(response =>{
        this.getVAById();
        this.personalDetailVAForm.disable();
      });
    }else{
      this.personalService.updateVA(this.contactID, formData).subscribe(response =>{
        this.getVAById();
        this.personalDetailVAForm.disable();
      });
    }
  }

  getVAById(){
    this.personalService.getVAById(this.contactID).subscribe(response =>{
      this.personalDetailVAForm.disable();
      if(response.data != null){
        this.pdvaList = response.data;
        this.personalDetailVAForm.patchValue(response.data);
      }
    });
  }

  enableVAForm(){
    this.personalDetailVAForm.enable();
  }

  disableVAForm(){
    this.personalDetailVAForm.disable();
  }

  createVaultForm(){
    this.personalDetailVaultForm = this.formBuilder.group({
      Notes: [''],
      ContactID: [this.contactID],
    });
  }

  onSubmitVault(){

    if(this.pdVaultList == null){
      this.personalService.saveVault(this.personalDetailVaultForm.value).subscribe(response =>{
        this.getVaultById();
        this.personalDetailVaultForm.disable();
      });
    }else{
      this.personalService.updateVault(this.contactID, this.personalDetailVaultForm.value).subscribe(response =>{
        this.getVaultById();
        this.personalDetailVaultForm.disable();
      });
    }
  }

  getVaultById(){
    this.personalService.getVaultById(this.contactID).subscribe(response =>{
      this.personalDetailVaultForm.disable();
      if(response.data != null){
        this.pdVaultList = response.data;
        this.personalDetailVaultForm.patchValue(response.data);
      }
    });
  }

  enableVaultForm(){
    this.personalDetailVaultForm.enable();
  }

  disableVaultForm(){
    this.personalDetailVaultForm.disable();
  }

  createMedicaidForm(){
    this.medicaidForm = this.formBuilder.group({
      Medicaid_No: [''],
      Medicaid_Plan: [''],
      Renewal: [''],
      Note: [''],
      ContactID: [this.contactID],
      Assistance_Level_ID: ['']
    });
  }

  getAllAssistenceLevels(){
    this.personalService.getAssistenceLevels().subscribe(response =>{
      this.assistenceLevelList = response.data;
    });
  }

  onSubmitMedicaid(){
    var formData = this.medicaidForm.value;
    if(formData.Medicaid_No == ''){
      formData.Medicaid_No = null;
    }
    if(formData.Medicaid_Plan == ''){
      formData.Medicaid_Plan = null;
    }
    if(formData.Renewal == ''){
      formData.Renewal = null;
    }
    if(formData.Note == ''){
      formData.Note = null;
    }
    if(formData.Assistance_Level_ID == ''){
      formData.Assistance_Level_ID = null;
    }

    if(this.pdMedicaidList == null){
      this.personalService.saveMedicaid(formData).subscribe(response =>{
        this.getMedicaidById();
        this.medicaidForm.disable();
      });
    }else{
      this.personalService.updateMedicaid(this.contactID, formData).subscribe(response =>{
        this.getMedicaidById();
        this.medicaidForm.disable();
      });
    }
  }

  getMedicaidById(){
    this.personalService.getMedicaidById(this.contactID).subscribe(response =>{
      this.medicaidForm.disable();
      if(response.data != null){
        this.pdMedicaidList = response.data;
        this.medicaidForm.patchValue(response.data);
      }
    });
  }

  enableMedicaidForm(){
    this.medicaidForm.enable();
  }

  disableMedicaidForm(){
    this.medicaidForm.disable();
  }

  closeModalPolicy(){
    $('#exampleModalPolicy').modal('hide');
    $(`#${this.policySelected}`).modal('hide');
    this.policySelected = '';
  }


  openPolicyModal(){
    if(this.policySelected == ''){
      alert('Please select a policy');
      return;
    }
    $('#exampleModalPolicy').modal('hide');
    $(`#${this.policySelected}`).modal('show');
  }

}
