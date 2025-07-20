import os
from datetime import datetime, timedelta
from random import choice, randint, uniform
from faker import Faker
from app import app # Import your Flask app instance
from models import db, User, Student, Project, TeamProject, TeamResponse, Review, Merchandise, Order, OrderItem, Company, ContactRequest 


fake = Faker()

def seed_database():
    """Seeds the database with sample data.
    This function is designed to be called within an active Flask application context.
    """
    print("Dropping all tables...")
    db.drop_all() 
    print("Creating all tables...")
    db.create_all() 

    print("Seeding Users...")
    users = []
    for i in range(10):
        username = fake.user_name()
        
        while User.query.filter_by(username=username).first():
            username = fake.user_name()

        user = User.create(
            username=username,
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            email=fake.unique.email(),
            password="password123", 
            role=choice(["admin", "user", "moderator"]),
            profile_pic_url=fake.image_url() if randint(0,1) else None
        )
        users.append(user)
    print(f"Created {len(users)} users.")

    print("Seeding Students...")
    students = []
    for i in range(15): 
        student = Student.create(
            name=fake.name(),
            email=fake.unique.email(),
            password="password123", 
            github=fake.url() if randint(0,1) else None,
            linkedin=fake.url() if randint(0,1) else None,
            skills=fake.sentence(nb_words=5) 
        )
        students.append(student)
    print(f"Created {len(students)} students.")

    print("Seeding Projects...")
    projects = []
    categories = ["Web Development", "Mobile App", "Data Science", "Machine Learning", "Game Development", "UI/UX Design", "Cybersecurity", "DevOps"]
    statuses = ["Pending", "Approved", "Rejected"]
    for i in range(25): 
        project = Project.create(
            title=fake.catch_phrase(),
            category=choice(categories),
            description=fake.paragraph(nb_sentences=5),
            github_link=fake.url(),
            demo_link=fake.url() if randint(0,1) else None,
            for_sale=fake.boolean(chance_of_getting_true=30),
            price=round(uniform(10.0, 500.0), 2) if fake.boolean(chance_of_getting_true=30) else 0.0,
            file_url=fake.file_extension() if randint(0,1) else None,
            student_id=choice(students).id,
            status=choice(statuses) if i < 15 else "Approved" 
        )
        projects.append(project)
    print(f"Created {len(projects)} projects.")

    print("Seeding Merchandise...")
    merchandise_items = []
    for i in range(12):
        merchandise = Merchandise.create(
            name=fake.word().capitalize() + " " + choice(["T-Shirt", "Mug", "Sticker", "Hoodie", "Notebook"]),
            description=fake.sentence(),
            price=round(uniform(5.0, 50.0), 2),
            image_url=fake.image_url() if randint(0,1) else None
        )
        merchandise_items.append(merchandise)
    print(f"Created {len(merchandise_items)} merchandise items.")

    print("Seeding Companies...")
    companies = []
    for i in range(10):
        company = Company.create(
            name=fake.company(),
            email=fake.unique.company_email(),
            description=fake.paragraph(nb_sentences=3),
            logo_image_url=fake.image_url() if randint(0,1) else None,
            bio=fake.text(max_nb_chars=200)
        )
        if i % 3 == 0: 
            company.verify()
        companies.append(company)
    print(f"Created {len(companies)} companies.")

    print("Seeding Orders and OrderItems...")
    orders = []
    for i in range(15):
        user = choice(users)
        order = Order.create(user_id=user.id) 
        orders.append(order)

        
        num_items = randint(1, 5)
        order_total = 0.0
        for _ in range(num_items):
            merchandise = choice(merchandise_items)
            quantity = randint(1, 3)
            unit_price = merchandise.price 
            order.add_item(merchandise.id, quantity, unit_price)
            order_total += quantity * unit_price
        order.total_amount = order_total 
        order.save() 
    print(f"Created {len(orders)} orders with items.")

    print("Seeding Reviews...")
    reviews = []
    for i in range(20):
        project = choice(projects)
        user = choice(users)
        review = Review.create(
            project_id=project.id,
            reviewer_id=user.id,
            rating=randint(1, 5),
            comment=fake.sentence() if randint(0,1) else None
        )
        reviews.append(review)
    print(f"Created {len(reviews)} reviews.")

    print("Seeding TeamProjects...")
    team_projects = []
    team_roles = ["Lead Developer", "Backend Engineer", "Frontend Developer", "UI/UX Designer", "Project Manager", "Data Analyst"]
    for i in range(10):
        project = choice(projects)
        student = choice(students) 
        team_project = TeamProject.create(
            project_id=project.id,
            student_id=student.id,
            role=choice(team_roles) 
        )
        team_projects.append(team_project)
    print(f"Created {len(team_projects)} team projects.")

    print("Seeding TeamResponses...")
    team_responses = []
    for i in range(20):
        team_project = choice(team_projects)
        
        team_response = TeamResponse.create(
            team_project_student_id=team_project.student_id,
            team_project_project_id=team_project.project_id,
            response_text=fake.paragraph(nb_sentences=2)
        )
        team_responses.append(team_response)
    print(f"Created {len(team_responses)} team responses.")

    print("Seeding ContactRequests...")
    contact_requests = []
    for i in range(15):
        company = choice(companies)
        contact_request = ContactRequest.create(
            company_id=company.id,
            email=fake.email(),
            message=fake.text(max_nb_chars=150)
        )
        contact_requests.append(contact_request)
    print(f"Created {len(contact_requests)} contact requests.")

    print("Database seeding complete!")

if __name__ == "__main__":
    with app.app_context():
        seed_database()
