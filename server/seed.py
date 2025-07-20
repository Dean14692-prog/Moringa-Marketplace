# seed.py
from app import app, db
from models import User, Student, Project, Merchandise, Order, OrderItem, Company, ContactRequest, TeamProject, TeamResponse, Review
from faker import Faker
from datetime import datetime
import random

fake = Faker()

def seed_users():
    users = [
        User(
            username=fake.user_name(),
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            email=fake.email(),
            password_hash='hashed_password_placeholder',
            role=random.choice(['recruiter' 'admin', 'reviewer']),
            profile_pic_url=fake.image_url(),
            created_at=datetime.utcnow()
        )
        for _ in range(10)
    ]
    db.session.add_all(users)
    db.session.commit()



def seed_students():
    users = User.query.filter_by(role='student').all()
    students = [
    Student(
    name=fake.name(),
    email=fake.email(),
    password_hash='hashed_pw',
    github=fake.user_name(),
    linkedin=fake.url(),
    role='student',
    updated_at=datetime.utcnow()
)

        for user in users
    ]
    db.session.add_all(students)
    db.session.commit()

def seed_projects():
    student_ids = [s.id for s in Student.query.all()]
    projects = [
        Project(
            title=fake.catch_phrase(),
            category=random.choice(['Web', 'AI', 'Mobile']),
            description=fake.paragraph(),
            github_link=fake.url(),
            demo_link=fake.url(),
            file_url=fake.image_url(),
            for_sale=fake.boolean(),
            price=round(random.uniform(200, 3000), 2),
            status=random.choice(['Approved', 'Pending']),
            student_id=random.choice(student_ids)
        )
        for _ in range(10)
    ]
    db.session.add_all(projects)
    db.session.commit()

def seed_reviews():
    reviewer_ids = [u.id for u in User.query.filter_by(role='reviewer')]
    project_ids = [p.id for p in Project.query.all()]
    for _ in range(10):
        review = Review(
            reviewer_id=random.choice(reviewer_ids),
            project_id=random.choice(project_ids),
            rating=random.randint(1, 5),
            comment=fake.sentence(),
            created_at=datetime.utcnow()
        )
        db.session.add(review)
    db.session.commit()

def seed_merchandise():
    items = [
        Merchandise(name=fake.word().capitalize(), price=round(random.uniform(50, 500), 2),
                    description=fake.text(), image_url=fake.image_url())
        for _ in range(10)
    ]
    db.session.add_all(items)
    db.session.commit()

def seed_orders():
    user_ids = [u.id for u in User.query.all()]
    orders = [
        Order(user_id=random.choice(user_ids),
              total_amount=0.0,
              payment_status=random.choice(['Pending', 'Completed']),
              created_at=datetime.utcnow())
        for _ in range(10)
    ]
    db.session.add_all(orders)
    db.session.commit()

def seed_order_items():
    order_ids = [o.id for o in Order.query.all()]
    merch_ids = [m.id for m in Merchandise.query.all()]
    for _ in range(10):
        item = OrderItem(
            order_id=random.choice(order_ids),
            merchandise_id=random.choice(merch_ids),
            quantity=random.randint(1, 3),
            unit_price=round(random.uniform(100, 300), 2)
        )
        db.session.add(item)
    db.session.commit()

def seed_companies():
    companies = [
        Company(name=fake.company(),
                email=fake.company_email(),
                bio=fake.bs(),
                description=fake.text(),
                logo_image_url=fake.image_url())
        for _ in range(10)
    ]
    db.session.add_all(companies)
    db.session.commit()

def seed_contact_requests():
    company_ids = [c.id for c in Company.query.all()]
    requests = [
        ContactRequest(company_id=random.choice(company_ids),
                       email=fake.email(),
                       message=fake.text())
        for _ in range(10)
    ]
    db.session.add_all(requests)
    db.session.commit()

def seed_team_projects():
    students = Student.query.all()
    teams = [
        TeamProject(
            title=fake.catch_phrase(),
            description=fake.text(),
            category=random.choice(['Group AI', 'Collaborative Web']),
            repo_link=fake.url(),
            status=random.choice(['In Review', 'Approved']),
            student_id=random.choice([s.id for s in students])
        )
        for _ in range(10)
    ]
    db.session.add_all(teams)
    db.session.commit()

def seed_team_responses():
    team_ids = [t.id for t in TeamProject.query.all()]
    for _ in range(10):
        response = TeamResponse(
            team_project_id=random.choice(team_ids),
            reviewer_name=fake.name(),
            feedback=fake.paragraph()
        )
        db.session.add(response)
    db.session.commit()

def run_all_seeds():
    with app.app_context():
        db.drop_all()
        db.create_all()

        seed_users()
        seed_students()
        seed_projects()
        seed_reviews()
        seed_merchandise()
        seed_orders()
        seed_order_items()
        seed_companies()
        seed_contact_requests()
        seed_team_projects()
        seed_team_responses()

        print("All tables successfully seeded with 10 randomized entries each!")

if __name__ == '__main__':
    run_all_seeds()
