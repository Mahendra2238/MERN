from pymongo import MongoClient
from datetime import datetime

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client.todo_db
tasks_collection = db.tasks

# ---------- CRUD Functions ----------

def create_task(description, due_date=None):
    task = {
        'description': description,
        'completed': False,
        'created_at': datetime.now(),
        'due_date': due_date
    }
    result = tasks_collection.insert_one(task)
    print(f"✅ Task created with id: {result.inserted_id}")

def read_tasks(filter_status=None):
    query = {}
    if filter_status == "completed":
        query['completed'] = True
    elif filter_status == "pending":
        query['completed'] = False
    tasks = tasks_collection.find(query)
    print("\n📝 Your To-Do List:")
    for task in tasks:
        status = "✔️ Done" if task['completed'] else "❌ Pending"
        due = f"(Due: {task['due_date']})" if task['due_date'] else ""
        print(f"ID: {task['_id']} | [{status}] {task['description']} {due}")

def update_task(task_id, new_description):
    result = tasks_collection.update_one(
        {'_id': task_id},
        {'$set': {'description': new_description}}
    )
    if result.modified_count > 0:
        print("✏️ Task updated successfully!")
    else:
        print("⚠️ Task not found.")

def mark_task(task_id, completed=True):
    result = tasks_collection.update_one(
        {'_id': task_id},
        {'$set': {'completed': completed}}
    )
    if result.modified_count > 0:
        print("✅ Task status updated.")
    else:
        print("⚠️ Task not found.")

def delete_task(task_id):
    result = tasks_collection.delete_one({'_id': task_id})
    if result.deleted_count > 0:
        print("🗑️ Task deleted successfully!")
    else:
        print("⚠️ Task not found.")

# ---------- CLI Menu ----------
from bson.objectid import ObjectId

while True:
    print("\n📌 To-Do List Menu")
    print("1. Create Task")
    print("2. View All Tasks")
    print("3. View Completed Tasks")
    print("4. View Pending Tasks")
    print("5. Update Task Description")
    print("6. Mark Task as Completed")
    print("7. Mark Task as Pending")
    print("8. Delete Task")
    print("9. Exit")

    choice = input("Enter your choice: ")

    if choice == '1':
        description = input("Enter task description: ")
        due_date = input("Enter due date (YYYY-MM-DD) or leave blank: ")
        due_date = due_date if due_date else None
        create_task(description, due_date)

    elif choice == '2':
        read_tasks()

    elif choice == '3':
        read_tasks("completed")

    elif choice == '4':
        read_tasks("pending")

    elif choice == '5':
        task_id = input("Enter task id: ")
        new_desc = input("Enter new description: ")
        update_task(ObjectId(task_id), new_desc)

    elif choice == '6':
        task_id = input("Enter task id: ")
        mark_task(ObjectId(task_id), True)

    elif choice == '7':
        task_id = input("Enter task id: ")
        mark_task(ObjectId(task_id), False)

    elif choice == '8':
        task_id = input("Enter task id: ")
        delete_task(ObjectId(task_id))

    elif choice == '9':
        break
    else:
        print("⚠️ Invalid choice. Please try again.")
