import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { platform } from "@tauri-apps/plugin-os";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Base class representing a generic user
export class User {
    fullName: string;
    email: string;
    role: "admin"|"patient"|"doctor"|null;
    constructor(fullName: string, email: string,role:"admin"|"patient"|"doctor"|null) {
        this.fullName = fullName;
        this.email = email;
        this.role = role;
    }
}

// Admin class extending the base User class
export class Admin extends User {
    constructor(fullName: string, email: string) {
        super(fullName, email,"admin");
    }
}

// Doctor class extending the base User class
export class Doctor extends User {
    medicalCode: string;
    nationalCode: string;
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

    constructor(
        fullName: string,
        email: string,
        medicalCode: string,
        nationalCode: string,
        phoneNumber: string,
        specialization: string,
        category: string,
        profileImage: string,
        consultationFee: number,
        adminCommissionPercentage: number,
        walletBalance = 0,
        status: 'active' | 'disabled' = 'active',
        availability = 10,
        cardNumber: string[] = []
    ) {
        super(fullName, email,"doctor");
        this.medicalCode = medicalCode;
        this.nationalCode = nationalCode;
        this.phoneNumber = phoneNumber;
        this.specialization = specialization;
        this.category = category;
        this.profileImage = profileImage;
        this.consultationFee = consultationFee;
        this.adminCommissionPercentage = adminCommissionPercentage;
        this.walletBalance = walletBalance;
        this.status = status;
        this.availability = availability;
        this.cardNumber = cardNumber;
    }
}

// General User class
export class Patient extends User {
    nationalCode: string;
    phoneNumber: string;
    walletBalance: number;

    constructor(
        fullName: string,
        email: string,
        nationalCode: string,
        phoneNumber: string,
        walletBalance = 0
    ) {
        super(fullName, email,"patient");
        this.nationalCode = nationalCode;
        this.phoneNumber = phoneNumber;
        this.walletBalance = walletBalance;
    }
}
export class AppManager {
    public platform:string;
    public language:string;
    public theme : string;
    public user :User|null;
    public server:string;
    constructor({  theme,language }: {  theme?:string,language?:string }) {

        this.theme = theme||localStorage.getItem("theme")||"dark";
        this.language = language||localStorage.getItem("language") ||"fa";
        this.platform = platform();
        this.server = this.is_phone()?import.meta.env["VITE_PHONE_ID"]:import.meta.env["VITE_IP"];
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
        this.user = null;
    }
    public is_phone():boolean{
        return this.platform === 'ios' || this.platform === 'android'
    }

}
