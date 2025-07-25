# 🏦 Advanced ATM Simulation with Modern UI
import time
import os
import random
from datetime import datetime

# Color codes for Windows
class Colors:
    RED = '\033[91m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    BLUE = '\033[94m'
    PURPLE = '\033[95m'
    CYAN = '\033[96m'
    WHITE = '\033[97m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'
    END = '\033[0m'

# User data: account number → [PIN, balance, transaction history, name, account_type]
users = {
    "123456": ["1234", 50000.0, [], "Ankur Saini", "Savings"],
    "654321": ["4321", 75000.0, [], "Yashvardhan", "Current"],
    "789012": ["5678", 25000.0, [], "chiku", "Savings"],
    "345678": ["9012", 100000.0, [], "rahul", "Premium"]
}

def clear_screen():
    os.system('cls' if os.name == 'nt' else 'clear')

def print_logo():
    logo = f"""
{Colors.CYAN}{Colors.BOLD}
    ╔══════════════════════════════════════════════════════════════╗
    ║                                                              ║
    ║  █████  ███████ ███    ███     █████  ████████ ███    ███    ║
    ║ ██   ██ ██      ████  ████    ██   ██    ██    ████  ████    ║
    ║ ███████ █████   ██ ████ ██    ███████    ██    ██ ████ ██    ║
    ║ ██   ██ ██      ██  ██  ██    ██   ██    ██    ██  ██  ██    ║
    ║ ██   ██ ███████ ██      ██    ██   ██    ██    ██      ██    ║
    ║                                                              ║
    ║                    WELCOME TO ATM                            ║
    ║                                                              ║
    ╚══════════════════════════════════════════════════════════════╝
{Colors.END}"""
    print(logo)

def loading_animation():
    print(f"{Colors.YELLOW}🔄 Initializing ATM System...{Colors.END}")
    for i in range(3):
        print(f"{Colors.CYAN}Loading{'.' * (i+1)}{Colors.END}")
        time.sleep(0.5)
    print(f"{Colors.GREEN}✅ System Ready!{Colors.END}\n")

def show_menu():
    menu = f"""
{Colors.BLUE}{Colors.BOLD}╔══════════════════════════════════════════════════════════════╗
║                        🏦 ATM SERVICES 🏦                        ║
╠══════════════════════════════════════════════════════════════╣
║  {Colors.WHITE}1.{Colors.BLUE} 💰 View Balance                    {Colors.WHITE}5.{Colors.BLUE} 📋 Transaction History    ║
║  {Colors.WHITE}2.{Colors.BLUE} 💸 Withdraw Cash                  {Colors.WHITE}6.{Colors.BLUE} 🔄 Transfer Funds         ║
║  {Colors.WHITE}3.{Colors.BLUE} 💳 Deposit Money                  {Colors.WHITE}7.{Colors.BLUE} 📄 Print Receipt          ║
║  {Colors.WHITE}4.{Colors.BLUE} 🔐 Change PIN                     {Colors.WHITE}8.{Colors.BLUE} 🚪 Exit                   ║
╚══════════════════════════════════════════════════════════════╝{Colors.END}"""
    print(menu)

def view_balance(balance, acc_num):
    user_info = users[acc_num]
    print(f"""
{Colors.GREEN}{Colors.BOLD}╔══════════════════════════════════════════════════════════════╗
║                        💰 ACCOUNT BALANCE 💰                        ║
╠══════════════════════════════════════════════════════════════╣
║  Account Holder: {Colors.WHITE}{user_info[3]:<40}{Colors.GREEN} ║
║  Account Type:   {Colors.WHITE}{user_info[4]:<40}{Colors.GREEN} ║
║  Current Balance:{Colors.WHITE} ₹{balance:>12,.2f}{Colors.GREEN}                    ║
╚══════════════════════════════════════════════════════════════╝{Colors.END}""")

def deposit(balance, acc_num):
    print(f"{Colors.CYAN}💰 DEPOSIT MONEY 💰{Colors.END}")
    try:
        amount = float(input(f"{Colors.YELLOW}Enter amount to deposit: ₹{Colors.END}"))
        if amount <= 0:
            print(f"{Colors.RED}❌ Invalid amount. Please enter a positive value.{Colors.END}")
        else:
            balance += amount
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            users[acc_num][2].append(f"[{timestamp}] Deposited ₹{amount:,.2f}")
            print(f"{Colors.GREEN}✅ ₹{amount:,.2f} deposited successfully!{Colors.END}")
            print(f"{Colors.CYAN}💡 New balance: ₹{balance:,.2f}{Colors.END}")
    except ValueError:
        print(f"{Colors.RED}❌ Please enter a valid number.{Colors.END}")
    return balance

def withdraw(balance, acc_num):
    print(f"{Colors.CYAN}💸 WITHDRAW CASH 💸{Colors.END}")
    
    # Quick withdrawal options
    print(f"{Colors.YELLOW}Quick Withdrawal Options:{Colors.END}")
    print(f"{Colors.WHITE}1. ₹500    2. ₹1000   3. ₹2000   4. ₹5000   5. Custom{Colors.END}")
    
    choice = input(f"{Colors.YELLOW}Select option (1-5): {Colors.END}")
    
    quick_amounts = {1: 500, 2: 1000, 3: 2000, 4: 5000}
    
    if choice in ['1', '2', '3', '4']:
        amount = quick_amounts[int(choice)]
    else:
        try:
            amount = float(input(f"{Colors.YELLOW}Enter amount to withdraw: ₹{Colors.END}"))
        except ValueError:
            print(f"{Colors.RED}❌ Please enter a valid number.{Colors.END}")
            return balance
    
    if amount <= 0:
        print(f"{Colors.RED}❌ Invalid amount.{Colors.END}")
    elif amount > balance:
        print(f"{Colors.RED}❌ Insufficient funds. Available balance: ₹{balance:,.2f}{Colors.END}")
    else:
        balance -= amount
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        users[acc_num][2].append(f"[{timestamp}] Withdrew ₹{amount:,.2f}")
        print(f"{Colors.GREEN}✅ ₹{amount:,.2f} withdrawn successfully!{Colors.END}")
        print(f"{Colors.CYAN}💡 Remaining balance: ₹{balance:,.2f}{Colors.END}")
        
        # Simulate counting notes
        print(f"{Colors.YELLOW}🔄 Counting notes...{Colors.END}")
        time.sleep(1)
        print(f"{Colors.GREEN}💵 Please collect your cash!{Colors.END}")
    
    return balance

def change_pin(acc_num):
    print(f"{Colors.CYAN}🔐 CHANGE PIN 🔐{Colors.END}")
    current_pin = input(f"{Colors.YELLOW}Enter current PIN: {Colors.END}")
    if current_pin == users[acc_num][0]:
        new_pin = input(f"{Colors.YELLOW}Enter new 4-digit PIN: {Colors.END}")
        if len(new_pin) == 4 and new_pin.isdigit():
            confirm_pin = input(f"{Colors.YELLOW}Confirm new PIN: {Colors.END}")
            if new_pin == confirm_pin:
                users[acc_num][0] = new_pin
                print(f"{Colors.GREEN}✅ PIN updated successfully!{Colors.END}")
            else:
                print(f"{Colors.RED}❌ PINs don't match.{Colors.END}")
        else:
            print(f"{Colors.RED}❌ PIN must be exactly 4 digits.{Colors.END}")
    else:
        print(f"{Colors.RED}❌ Incorrect current PIN.{Colors.END}")

def show_transaction_history(acc_num):
    print(f"""
{Colors.PURPLE}{Colors.BOLD}╔══════════════════════════════════════════════════════════════╗
║                    📋 TRANSACTION HISTORY 📋                    ║
╚══════════════════════════════════════════════════════════════╝{Colors.END}""")
    
    history = users[acc_num][2]
    if not history:
        print(f"{Colors.YELLOW}📝 No transactions yet.{Colors.END}")
    else:
        print(f"{Colors.CYAN}Recent transactions:{Colors.END}")
        for i, item in enumerate(history[-10:], 1):  # Last 10 transactions
            print(f"{Colors.WHITE}{i:2d}. {item}{Colors.END}")

def transfer_funds(sender_acc):
    print(f"{Colors.CYAN}🔄 TRANSFER FUNDS 🔄{Colors.END}")
    receiver_acc = input(f"{Colors.YELLOW}Enter recipient Account Number: {Colors.END}")
    
    if receiver_acc not in users:
        print(f"{Colors.RED}❌ Recipient account not found.{Colors.END}")
        return
    
    if receiver_acc == sender_acc:
        print(f"{Colors.RED}❌ Cannot transfer to your own account.{Colors.END}")
        return
    
    try:
        amount = float(input(f"{Colors.YELLOW}Enter amount to transfer: ₹{Colors.END}"))
        if amount <= 0:
            print(f"{Colors.RED}❌ Invalid amount.{Colors.END}")
        elif amount > users[sender_acc][1]:
            print(f"{Colors.RED}❌ Insufficient balance.{Colors.END}")
        else:
            # Confirm transfer
            print(f"{Colors.YELLOW}Transfer Details:{Colors.END}")
            print(f"{Colors.WHITE}To: {users[receiver_acc][3]} ({receiver_acc}){Colors.END}")
            print(f"{Colors.WHITE}Amount: ₹{amount:,.2f}{Colors.END}")
            
            confirm = input(f"{Colors.YELLOW}Confirm transfer? (yes/no): {Colors.END}").lower()
            
            if confirm == 'yes':
                users[sender_acc][1] -= amount
                users[receiver_acc][1] += amount
                
                timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                users[sender_acc][2].append(f"[{timestamp}] Transferred ₹{amount:,.2f} to {receiver_acc}")
                users[receiver_acc][2].append(f"[{timestamp}] Received ₹{amount:,.2f} from {sender_acc}")
                
                print(f"{Colors.GREEN}✅ Transfer successful!{Colors.END}")
                print(f"{Colors.CYAN}💡 New balance: ₹{users[sender_acc][1]:,.2f}{Colors.END}")
            else:
                print(f"{Colors.YELLOW}❌ Transfer cancelled.{Colors.END}")
    except ValueError:
        print(f"{Colors.RED}❌ Invalid input.{Colors.END}")

def print_receipt(acc_num):
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    user_info = users[acc_num]
    
    receipt_content = f"""
╔══════════════════════════════════════════════════════════════╗
║                        🏦 ATM RECEIPT 🏦                        ║
╠══════════════════════════════════════════════════════════════╣
║  Date & Time: {timestamp:<40} ║
║  Account No:  {acc_num:<40} ║
║  Account Holder: {user_info[3]:<35} ║
║  Account Type: {user_info[4]:<38} ║
║  Current Balance: ₹{user_info[1]:>12,.2f}{' ' * 25} ║
╠══════════════════════════════════════════════════════════════╣
║                    RECENT TRANSACTIONS                        ║
╠══════════════════════════════════════════════════════════════╣"""
    
    history = user_info[2][-5:]  # Last 5 transactions
    for item in history:
        receipt_content += f"\n║  {item:<55} ║"
    
    receipt_content += f"""
╠══════════════════════════════════════════════════════════════╣
║  Thank you for using our ATM!                                ║
║  For any queries, contact: 1800-123-4567                    ║
╚══════════════════════════════════════════════════════════════╝"""
    
    filename = f"receipt_{acc_num}_{datetime.now().strftime('%Y%m%d_%H%M%S')}.txt"
    with open(filename, "w", encoding='utf-8') as file:
        file.write(receipt_content)
    
    print(f"{Colors.GREEN}✅ Receipt saved as: {filename}{Colors.END}")
    print(f"{Colors.CYAN}📄 Receipt content:{Colors.END}")
    print(receipt_content)

def atm_simulation():
    clear_screen()
    print_logo()
    loading_animation()
    
    print(f"{Colors.CYAN}💳 Please insert your card...{Colors.END}")
    time.sleep(1)
    
    acc_num = input(f"{Colors.YELLOW}Enter your Account Number: {Colors.END}")

    if acc_num not in users:
        print(f"{Colors.RED}❌ Account not found. Please check your account number.{Colors.END}")
        return

    attempts = 3
    while attempts > 0:
        pin = input(f"{Colors.YELLOW}Enter your 4-digit PIN: {Colors.END}")
        if pin == users[acc_num][0]:
            print(f"{Colors.GREEN}✅ Login successful! Welcome back, {users[acc_num][3]}!{Colors.END}")
            balance = users[acc_num][1]

            while True:
                show_menu()
                choice = input(f"{Colors.YELLOW}Choose an option (1-8): {Colors.END}")

                if choice == "1":
                    view_balance(balance, acc_num)
                elif choice == "2":
                    balance = withdraw(balance, acc_num)
                elif choice == "3":
                    balance = deposit(balance, acc_num)
                elif choice == "4":
                    change_pin(acc_num)
                elif choice == "5":
                    show_transaction_history(acc_num)
                elif choice == "6":
                    transfer_funds(acc_num)
                elif choice == "7":
                    print_receipt(acc_num)
                elif choice == "8":
                    print(f"\n{Colors.YELLOW}🔄 Processing logout...{Colors.END}")
                    time.sleep(1)
                    users[acc_num][1] = balance
                    print(f"{Colors.GREEN}✅ Transaction complete. Thank you for using our ATM!{Colors.END}")
                    break
                else:
                    print(f"{Colors.RED}❌ Invalid choice. Please try again.{Colors.END}")
                
                input(f"\n{Colors.CYAN}Press Enter to continue...{Colors.END}")
                clear_screen()
                print_logo()
            break
        else:
            attempts -= 1
            print(f"{Colors.RED}❌ Wrong PIN. Attempts left: {attempts}{Colors.END}")

    if attempts == 0:
        print(f"{Colors.RED}🚫 Card blocked due to too many wrong attempts.{Colors.END}")
        print(f"{Colors.YELLOW}Please contact your bank to unblock your card.{Colors.END}")

def main():
    while True:
        atm_simulation()
        print(f"\n{Colors.CYAN}{'='*60}{Colors.END}")
        cont = input(f"{Colors.YELLOW}Would you like to perform another transaction? (yes/no): {Colors.END}").lower()
        if cont != "yes":
            print(f"{Colors.GREEN}🏦 Thank you for using our ATM. Have a great day! 👋{Colors.END}")
            break

if __name__ == "__main__":
    main()
