tasks = []

while True:
    print("\n1. View Tasks")
    print("2. Add Task")
    print("3. Exit")

    choice = input("Enter your choice: ")

    if choice == '1':
        if not tasks:
            print("No tasks yet.")
        else:
            print("Your tasks:")
            for i, task in enumerate(tasks, 1):
                print(f"{i}. {task}")

    elif choice == '2':
        task = input("Enter new task: ")
        tasks.append(task)
        print("Task added.")

    elif choice == '3':
        print("Goodbye!")
        break

    else:
        print("Invalid choice. Try again.")
