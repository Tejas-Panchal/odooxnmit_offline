# odooxnmit_offline
-Team name: One piece 
-Team no. : 92
-Video Link: [https://drive.google.com/drive/folders/1XEsApGN629MVh1QMxQ7h3CVulVC9e1w5?usp=drive_link]

# Shiv Accounts Cloud  
Orders, Invoices & Real-Time Reports

A **cloud-based accounting system** built for **Shiv Furniture** that streamlines sales, purchases, invoicing, payments, and reporting.  
It enables smooth entry of master data, transaction management, and automated generation of financial & stock reports.  

Tech stack: **Flask (Backend) + PostgreSQL (Database) + React (Frontend)**  

## Table of Contents
- [Overview](#-overview)
- [Primary Actors](#-primary-actors)
- [Master Data Modules](#-master-data-modules)
- [Transaction Flow](#-transaction-flow)
- [Reporting](#-reporting)
- [Key Use Cases](#-key-use-cases)
- [Architecture](#-architecture)
- [Setup & Installation](#-setup--installation)
- [Future Improvements](#-future-improvements)

## Overview
Shiv Accounts Cloud enables:  
- Entry of **core master data** (Contacts, Products, Taxes, Chart of Accounts).  
- Recording of **sales, purchases, payments** using master data.  
- Automated **Balance Sheet, Profit & Loss (P&L), and Stock reports** in real time.  

## Primary Actors
- **Admin (Business Owner)** – Create/Modify/Archive master data, record transactions, view reports.  
- **Invoicing User (Accountant)** – Manage master data, record transactions, view reports.  
- **Contact** – Created via Contact Master. Can view their own invoices/bills & make payments.  
- **System** – Validates data, computes taxes, updates ledgers, generates reports.  

## Master Data Modules
1. **Contact Master**  
   - Fields: Name, Type (Customer/Vendor/Both), Email, Mobile, Address, Profile Image.   

2. **Product Master**  
   - Fields: Product Name, Type (Goods/Service), Sales Price, Purchase Price, Sale Tax %, Purchase Tax %, HSN Code, Category.

3. **Tax Master**  
   - Fields: Tax Name, Computation Method (Percentage/Fixed), Applicable on Sales/Purchase.

4. **Chart of Accounts (CoA)**  
   - Fields: Account Name, Type (Asset, Liability, Expense, Income, Equity).  

## Transaction Flow
1. **Purchase Order** → Select Vendor, Product, Quantity, Tax.  
2. **Vendor Bill** → Convert PO to Bill, record invoice/due date, register payment (Cash/Bank).  
3. **Sales Order** → Select Customer, Product, Quantity, Tax.  
4. **Customer Invoice** → Generate Invoice, set tax, receive payment.  
5. **Payment** → Register against bill/invoice via Cash/Bank. 

## Reporting
System generates reports in real time:  
- **Balance Sheet** – Snapshot of Assets, Liabilities, Equity.  
- **Profit & Loss (P&L)** – Income vs Expenses → Net Profit/Loss.  
- **Stock Report** – Product-wise stock levels, valuation & movement.  
- **Partner Ledger** – Transactions with each customer/vendor.  

## Key Use Cases
1. **Create Master Data**  
   - Add Contacts, Products, Taxes, Chart of Accounts.  
2. **Record Purchase**  
   - Create Purchase Order → Convert to Vendor Bill → Record Payment.  
3. **Record Sale**  
   - Create Sales Order → Generate Invoice → Record Payment.  
4. **Generate Reports**  
   - Balance Sheet, P&L, Stock Statement by period.  

## Architecture
- **Frontend:** React (SPA, responsive UI).  
- **Backend:** Flask REST API (Python).  
- **Database:** PostgreSQL with structured schema for accounting & stock.  

## Getting Started

### Prerequisites
- React.js (v14+ recommended)
- Python (v3.8+ recommended)
- Git

### Installation -- Setup

1. **Clone the repository**
    ```bash
    git clone https://github.com/Tejas-Panchal/odooxnmit_offline.git
    cd odooxnmit_offline
    ```

2. **Install backend dependencies**
    ```bash
    cd backend
    pip install -r requirements.txt
    ```

3. **Install frontend dependencies**
    ```bash
    cd ../frontend
    npm install
    ```

## Usage

1. **Start the backend server**
    ```bash
    cd backend
    python app.py
    ```

2. **Start the frontend application**
    ```bash
    cd ../frontend
    npm start
    ```

3. **Access the application**
   - Open your browser and go to: [http://localhost:3000](http://localhost:3000)

## Future Improvements
- Progressive Web App (PWA) features for deeper offline support
- Mobile application version
- Advanced user and permission management
- Real-time synchronization
- Automated testing and CI/CD pipeline





