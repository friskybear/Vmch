import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { platform } from "@tauri-apps/plugin-os";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Base class representing a generic user
export class User {
    id: string;
    fullName: string;
    email: string;
    role: "admin"|"patient"|"doctor"|null;
    gender: 'man' | 'woman';
    birthDate: Date;
    nationalCode: string;
    password: string;
    constructor(id: string,fullName: string, email: string,role:"admin"|"patient"|"doctor"|null,gender: 'man' | 'woman',birthDate: Date,nationalCode: string ,password: string) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.gender = gender;
        this.password = password;
        this.birthDate = birthDate;
        this.nationalCode = nationalCode;
    }

}

// Admin class extending the base User class
export class Admin extends User {
    // constructor(id: string,fullName: string, email: string,gender: 'man' | 'woman',birthDate: Date,nationalCode: string) {
    //     super(id,fullName, email,"admin",gender,birthDate,nationalCode);
    // }
    walletBalance: number;
    constructor(json: {
        id: string,
        fullName: string,
        email: string,
        password: string,
        gender: 'man' | 'woman',
        birthDate: Date,
        nationalCode: string
    }) {
        super(json.id, json.fullName, json.email, "admin", json.gender, json.birthDate, json.nationalCode , json.password);
        this.walletBalance = Infinity;
    }
}

// Doctor class extending the base User class
export class Doctor extends User {
    medicalCode: string;
    phoneNumber: string;
    specialization: string;
    category: string; // Replace with a record type if needed
    profileImage: string;
    consultationFee: number;
    adminCommissionPercentage: number;
    walletBalance: number;
    status: 'active' | 'disabled';
    availability: number;
    cardNumber: string[];
    // //@ts-ignore

    // constructor(
    //     id: string,
    //     fullName: string,
    //     email: string,
    //     medicalCode: string,
    //     phoneNumber: string,
    //     specialization: string,
    //     category: string,
    //     profileImage: string,
    //     consultationFee: number,
    //     adminCommissionPercentage: number,
    //     walletBalance = 0,
    //     status: 'active' | 'disabled' = 'active',
    //     availability = 10,
    //     cardNumber: string[] = [],
    //     gender: 'man' | 'woman',
    //     birthDate: Date,
    //     nationalCode: string
    // ) {
    //     super(id,fullName, email,"doctor",gender,birthDate,nationalCode);
    //     this.medicalCode = medicalCode;
    //     this.phoneNumber = phoneNumber;
    //     this.specialization = specialization;
    //     this.category = category;
    //     this.profileImage = profileImage;
    //     this.consultationFee = consultationFee;
    //     this.adminCommissionPercentage = adminCommissionPercentage;
    //     this.walletBalance = walletBalance;
    //     this.status = status;
    //     this.availability = availability;
    //     this.cardNumber = cardNumber;
    // }
    constructor(json: {
        id: string,
        fullName: string,
        email: string,
        medicalCode: string,
        phoneNumber: string,
        specialization: string,
        category: string,
        profileImage: string,
        consultationFee: number,
        adminCommissionPercentage: number,
        walletBalance?: number,
        password: string,
        status?: 'active' | 'disabled',
        availability?: number,
        cardNumber?: string[],
        gender: 'man' | 'woman',
        birthDate: Date,
        nationalCode: string
    }) {
        super(json.id, json.fullName, json.email, "doctor", json.gender, json.birthDate, json.nationalCode , json.password);
        this.medicalCode = json.medicalCode;
        this.phoneNumber = json.phoneNumber;
        this.specialization = json.specialization;
        this.category = json.category;
        this.profileImage = json.profileImage;
        this.consultationFee = json.consultationFee;
        this.adminCommissionPercentage = json.adminCommissionPercentage;
        this.walletBalance = json.walletBalance || 0;
        this.status = json.status || 'active';
        this.availability = json.availability || 10;
        this.cardNumber = json.cardNumber || [];
    }
}

// General User class
export class Patient extends User {
    walletBalance: number;
    PhoneNumber: string;
    // constructor(
    //     id: string,
    //     fullName: string,
    //     email: string,
    //     walletBalance = 0,
    //     gender: 'man' | 'woman',
    //     PhoneNumber: string,
    //     birthDate: Date,
    //     nationalCode: string
    // ) {
    //     super(id,fullName, email,"patient",gender,birthDate,nationalCode);
    //     this.walletBalance = walletBalance;
    //     this.PhoneNumber = PhoneNumber;
    // }
    constructor(json: {
        id: string,
        fullName: string,
        email: string,
        walletBalance?: number,
        gender: 'man' | 'woman',
        PhoneNumber: string,
        birthDate: Date,
        password: string,
        nationalCode: string
    }) {
        super(json.id, json.fullName, json.email, "patient", json.gender, json.birthDate, json.nationalCode , json.password);
        this.walletBalance = json.walletBalance || 0;
        this.PhoneNumber = json.PhoneNumber;
    }
};

export class AppManager {
    public platform:string;
    public language:string;
    public theme : string;
    public user :User|null;
    public server:string;
    constructor({  theme, language }: {  theme?: string, language?: string }) {

            const json = localStorage.getItem("appConfig");
            this.theme = theme ||"dark";
            this.language = language ||"fa";
            this.platform =   platform();
            this.server = this.is_phone()?import.meta.env["VITE_PHONE_ID"]:import.meta.env["VITE_IP"];
            this.user =null;
            if (json){
                Object.assign(this,JSON.parse(json));
            }

        // const _doctor = new Doctor(
        //     'Doctoraaaa-Name',
        //     'doctor@example.com',
        //     'MED12345',
        //     'NC1234567890',
        //     '1234567890',
        //     'Cardiology',
        //     'Specialized',
        //     '/path/to/profile/image.jpg',
        //     500,
        //     20,
        //     0,
        //     'active',
        //     10,
        //     ['1234567890123456']
        // );
        //this.user = null;
    }
    public is_phone():boolean{
        return this.platform === 'ios' || this.platform === 'android'
    }
}
