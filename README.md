# Virtual Medical Consultation Platform Requirements

### 1. Overview

The system is designed to facilitate virtual consultations between users (patients) and doctors, with a multi-tiered permission structure (admin, doctor, user). The platform allows users to select doctors based on category, make payments, and leave ratings after consultations. The admin oversees all aspects of the platform, from doctor onboarding to financial management. Doctors have limited access to their own consultations, wallets, and payment information. The system supports dynamic pricing, transaction tracking, and detailed reporting for all involved parties.

---

### 2. Roles & Permissions

#### Admin:
- Full control over the platform.
- Can add, edit, and remove doctors.
- Assigns doctors to categories and sets the consultation fee dynamically.
- Monitors all transactions, approves withdrawals, and manages reports.
- Access to all user and doctor data, including performance metrics and ratings.
- Can disable/enable doctors.
- Can generate detailed reports on doctor performance, earnings, and consultations.
- Multiple admins with equal privileges.

#### Doctor:
- Limited access.
- Can view and edit consultation details and user information (limited to their consultations).
- Manage their schedule for consultations.
- View and manage their wallet, including sending withdrawal requests.
- Access reports of their earnings and consultations.
- Can request admin approval to end a session.

#### User:
- Can view doctors by category, search doctors, and see their prices.
- Can initiate consultation requests for themselves or others using national codes.
- Can pay via wallet or direct payment.
- View consultation history and details.
- Rate and review doctors post-consultation.

---

### 3. Functional Requirements

#### Admin Panel
1. **Doctor Management**:
   - Add/edit/remove doctors with details such as image, medical code, name, specialization, etc.
   - Assign categories to doctors.
   - Set dynamic consultation fees for each doctor.
   - Disable/enable doctors based on performance.
   - Change doctors’ category and log the change for audit purposes.

2. **Financial Management**:
   - Set dynamic admin commission per doctor and per consultation.
   - Manage the wallet system for both doctors and users.
   - View reports on earnings, payments made to doctors, and admin commission.
   - Approve/deny doctor withdrawal requests and log the decisions.

3. **Doctor Reporting**:
   - Track doctor performance: number of consultations, user feedback, earnings.
   - Ability to filter and search doctors based on medical code, name, or performance.
   - Generate reports for specific time ranges showing doctor performance and earnings.
   - Notifications on doctors performing poorly based on user ratings.

4. **Consultation Monitoring**:
   - Monitor all ongoing consultations.
   - Approve session end requests from doctors if necessary.
   - View detailed logs of all consultation statuses (new, answered, ended, etc.).

#### Doctor Panel
1. **Profile & Schedule**:
   - View and edit profile (basic details and verification).
   - Set availability: define consultation days, hours, and daily session limits.
   - View status to show users when available for consultations.

2. **Consultation Management**:
   - View all current and past consultations.
   - Search through user consultation history.
   - End a session after a 3-day timeout or by submitting an end-session request to the admin.

3. **Wallet & Payment**:
   - View wallet balance and transaction history.
   - Request withdrawal, which goes to admin for approval.
   - Set up a verified card number where earnings are transferred.

#### User Interface
1. **Registration/Login**:
   - Users can sign up/login using national code or phone number.
   - Users can initiate consultations for others by entering another person’s national code.

2. **Doctor Search**:
   - Users can search doctors by category and view consultation prices.
   - Ability to filter doctors based on availability, rating, or price.
   - View doctor profiles with their availability, ratings, and specialization.

3. **Consultation & Payment**:
   - Users can choose to pay via wallet or direct payment for consultations.
   - View a list of all past consultations with search functionality.
   - End consultations and provide feedback in the form of ratings and comments.

4. **Consultation Statuses**:
   - Each consultation has statuses like: new, answered, ended.

5. **Rating & Reviews**:
   - After a consultation, users can rate and comment on the doctor’s service.
   - Admin can view all user ratings and complaints about doctors.

---

### 4. Non-functional Requirements

1. **Usability**:
   - The interface should be intuitive and user-friendly, especially for non-tech-savvy users (including older adults).
   - Clear navigation paths and easy access to payment options.

2. **Performance**:
   - The system should handle high volumes of users and concurrent consultations without delays or crashes.

3. **Scalability**:
   - The system should be able to scale with increasing users, doctors, and consultations.

4. **Security**:
   - All user and doctor data must be securely stored.
   - Sensitive information such as payment details and national codes should be encrypted.

5. **Localization**:
   - Dates and formats should be localized for Iran (Jalali calendar).
   - Support for Persian language throughout the UI.

---

### 5. Reporting and Analytics

- **Admin Reports**:
  - View total earnings per doctor after admin’s commission.
  - Doctor performance reports filtered by time range.
  - Reports of user satisfaction, based on ratings and feedback.

- **Doctor Reports**:
  - Reports on personal earnings, sorted by time range.
  - Consultation performance and feedback reports.

---

### 6. Workflow Examples

#### User Consultation Request:
1. User browses available doctors by category.
2. User selects a doctor and initiates a consultation request.
3. User pays the consultation fee (wallet or direct).
4. Doctor is notified, consults, and then the session status changes.
5. User rates the consultation, and admin monitors the process.

#### Doctor Withdrawal Request:
1. Doctor views their wallet.
2. Sends a withdrawal request to the admin.
3. Admin reviews the request, approves or denies it, and logs it.
4. Funds are transferred to the doctor's verified account.





### dasty

- 3 diffrent permissions
- admin doctor user
- diffrent category
- user chose the doctor sends a request ,pays the money to the admin ,admin take some on it and the rest go to the doctor wallet
- admin has full access add change and delete each category has a list of each doctor in each category and ...
- admin adds doctor with information given like image ,medical code, name and ...
- the percentage that each doctor has to pay to admin is different and its decided by admin
- admin decide how much is the price to consulate with that doctor and its dynamic
- the percentage that each doctor has to pay to admin is dynamic and you have to save it each time and admin shoud be able to make a report of how much each party got
- admin should be able to search the doctors with filters like medical code or name
- admin can disable doctors from active doctors
- admin should be able to see a report on each doctor about how much he worked how many user he cunsulted (should be able to sort by time for example from x to y how many user he cunsulted), how much he made entirely and how he gets after admin take his share , each time a doctor asks for a withdraw admin sees it and be able to accept or deny it and log it into system
- doctor should be able to have a good experience about money stuff like wallet and payment
- user can rate doctors afterward and admin should be able to see it
- user unique id is national code or phone number
- user can make a consult request for some one else with national code
- doctor can see all of the user consultation and edit user and be able to search between users
- user can see a list of all consultation and be able to search between them
- there should be a notification system about doctors which have done poorly admin should see this notification
- user is able to login and sign in
- user see doctors on category search between them and see their prices
- user can either directly pay or do it with wallet
- user can end consultation and afterward give comment and rating with positive and negative points
- user can see a list of consultation that can search and see the history (should be appealing and the dates should be for iran )
- doctor login but not sign up he can send a req to the admin to sign up
- doctor has wallet in that there should be a good report that is searchable with different filter
- doctor can send withdraw request and this goes to admin
- doctor has to enter a verified card number beforehand and the money only goes there
- different status for each consultation like answered, ended , new and ...
- doctor can only see relevant information
- doctor can only end each session with one of thess condition either a 3 day timeout or after doctor answer he sends a end session request to the admin and admin sees it and close it if he wants
- admin can monitor all of the session
- doctor can set in what day what hour he is able to consult and how many session he wants a day the doctor status is shown to the user
- admin is not only one person
- gui is mandatory
